import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import { finalizeRegistration } from '@/lib/registrationHelper';

import { isRateLimited, sanitizeObject } from '@/lib/security';

// Initialize Cashfree
const cashfree = new Cashfree(
  process.env.NEXT_PUBLIC_CASHFREE_ENV === 'PRODUCTION' 
    ? CFEnvironment.PRODUCTION 
    : CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID || '',
  process.env.CASHFREE_SECRET_KEY || ''
);
cashfree.XApiVersion = '2023-08-01';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Use unified security rate limiting: max 5 requests per minute
    if (isRateLimited(ip, 5, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many attempts. Please try again in a minute.' }, { status: 429 });
    }

    const body = await req.json();
    const { action, honeypot, ...rawData } = body;
    
    // Use unified security sanitization to prevent XSS script injection
    const data = sanitizeObject(rawData);

    if (honeypot) {
      console.warn("Honeypot triggered by IP:", ip);
      return NextResponse.json({ error: 'Bot detected' }, { status: 400 });
    }

    if (action === 'CREATE_ORDER') {
      try {
        const orderId = `order_${Date.now()}`;
        const orderAmount = data.coupon?.toUpperCase() === 'TESTTEST' ? 1 : 2500;

        console.log("Saving pending registration for order ID:", orderId);
        if (!db) {
          throw new Error("Firestore db is null inside CREATE_ORDER. Firebase may not be configured properly.");
        }

        // 1. Save pending registration details under pendingRegistrations
        await setDoc(doc(db, 'pendingRegistrations', orderId), {
          formData: data,
          orderId: orderId,
          amount: orderAmount,
          createdAt: serverTimestamp(),
          status: 'pending'
        });
        console.log("Pending registration saved.");

        // MOCK MODE: If no keys, return a mock session for testing
        if (!process.env.CASHFREE_APP_ID) {
          return NextResponse.json({ 
            order_id: orderId,
            payment_session_id: "mock_session_id",
            is_mock: true
          });
        }

        console.log("Creating Cashfree Order via PGCreateOrder...");
        
        // Strip non-digit characters and ensure a clean 10-digit format for Cashfree validation
        let cleanPhone = data.mobile ? data.mobile.replace(/\D/g, '') : '';
        if (cleanPhone.length > 10) {
          if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
            cleanPhone = cleanPhone.slice(2);
          } else {
            cleanPhone = cleanPhone.slice(-10);
          }
        }
        // Fail-safe default if number is somehow empty or too short
        if (cleanPhone.length < 10) {
          cleanPhone = '9999999999';
        }

        const response = await cashfree.PGCreateOrder({
          order_id: orderId,
          order_amount: orderAmount,
          order_currency: 'INR',
          customer_details: {
            customer_id: data.registrationNumber || `cust_${Date.now()}`,
            customer_name: data.name,
            customer_email: data.email,
            customer_phone: cleanPhone,
          },
          order_meta: {
            return_url: `${new URL(req.url).origin}/register?order_id={order_id}`.replace(/^http:\/\//i, 'https://'),
          }
        });
        console.log("Cashfree order created successfully.");

        return NextResponse.json({ 
          order_id: response.data.order_id,
          payment_session_id: response.data.payment_session_id 
        });
      } catch (err: any) {
        console.error("CREATE_ORDER error detail:", err);
        return NextResponse.json({ error: `CREATE_ORDER failed: ${err.message || err}` }, { status: 500 });
      }
    }

    if (action === 'VERIFY_PAYMENT') {
      const { orderId, formData } = data;
      console.log("Verifying payment for order:", orderId);
      
      // If we are in development and don't have keys, allow bypass for testing UI
      if (!process.env.CASHFREE_APP_ID) {
        console.warn("CASHFREE_APP_ID missing, bypassing verification for testing.");
        const regId = await finalizeRegistration(formData, "mock_payment_id", orderId);
        return NextResponse.json({ success: true, id: regId });
      }

      const response = await cashfree.PGOrderFetchPayments(orderId);
      const payments = response.data;
      const successPayment = payments?.find((p: any) => p.payment_status === 'SUCCESS');

      if (!successPayment) {
        console.warn("No successful payment found for order:", orderId);
        return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
      }

      console.log("Payment verified successfully:", successPayment.cf_payment_id);
      const regId = await finalizeRegistration(formData, successPayment.cf_payment_id.toString(), orderId);
      return NextResponse.json({ success: true, id: regId });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process registration' }, { status: 500 });
  }
}
