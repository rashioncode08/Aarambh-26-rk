import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PDFDocument, rgb } from 'pdf-lib';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import QRCode from 'qrcode';
import fs from 'fs/promises';
import path from 'path';

// Initialize Cashfree
const cashfree = new Cashfree(
  process.env.NEXT_PUBLIC_CASHFREE_ENV === 'PRODUCTION' 
    ? CFEnvironment.PRODUCTION 
    : CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID || '',
  process.env.CASHFREE_SECRET_KEY || ''
);
cashfree.XApiVersion = '2023-08-01';

// Input Sanitation Helpers
function sanitizeInput(val: any): any {
  if (typeof val === 'string') {
    return val
      .trim()
      .replace(/<[^>]*>?/gm, '') // Remove HTML tags
      .replace(/[^\w\s@.+-]/gi, (char) => {
        // Basic escaping for special characters to prevent injection
        const map: { [key: string]: string } = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        };
        return map[char] || char;
      });
  }
  return val;
}

function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  const sanitized: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        sanitized[key] = sanitizeObject(val);
      } else {
        sanitized[key] = sanitizeInput(val);
      }
    }
  }
  return sanitized;
}

// Simple in-memory rate limiting
const rateLimitMap = new Map();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const limit = 5; // max 5 requests
    const window = 60 * 1000; // per 1 minute

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, { count: 1, firstRequest: now });
    } else {
      const rateData = rateLimitMap.get(ip);
      if (now - rateData.firstRequest > window) {
        rateLimitMap.set(ip, { count: 1, firstRequest: now });
      } else if (rateData.count >= limit) {
        return NextResponse.json({ error: 'Too many attempts. Please try again in a minute.' }, { status: 429 });
      } else {
        rateData.count++;
      }
    }

    const body = await req.json();
    const { action, honeypot, ...rawData } = body;
    const data = sanitizeObject(rawData);

    if (honeypot) {
      console.warn("Honeypot triggered by IP:", ip);
      return NextResponse.json({ error: 'Bot detected' }, { status: 400 });
    }

    if (action === 'CREATE_ORDER') {
      const orderId = `order_${Date.now()}`;
      
      // MOCK MODE: If no keys, return a mock session for testing
      if (!process.env.CASHFREE_APP_ID) {
        return NextResponse.json({ 
          order_id: orderId,
          payment_session_id: "mock_session_id",
          is_mock: true
        });
      }

      const orderAmount = data.coupon?.toUpperCase() === 'TESTTEST' ? 1 : 1500;

      const response = await cashfree.PGCreateOrder({
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: 'INR',
        customer_details: {
          customer_id: data.registrationNumber || `cust_${Date.now()}`,
          customer_name: data.name,
          customer_email: data.email,
          customer_phone: data.mobile,
        },
        order_meta: {
          return_url: `${new URL(req.url).origin}/register?order_id={order_id}`,
        }
      });

      return NextResponse.json({ 
        order_id: response.data.order_id,
        payment_session_id: response.data.payment_session_id 
      });
    }

    if (action === 'VERIFY_PAYMENT') {
      const { orderId, formData } = data;
      console.log("Verifying payment for order:", orderId);
      
      // If we are in development and don't have keys, allow bypass for testing UI
      if (!process.env.CASHFREE_APP_ID) {
        console.warn("CASHFREE_APP_ID missing, bypassing verification for testing.");
        return await finalizeRegistration(formData, "mock_payment_id", orderId);
      }

      const response = await cashfree.PGOrderFetchPayments(orderId);
      const payments = response.data;
      const successPayment = payments?.find((p: any) => p.payment_status === 'SUCCESS');

      if (!successPayment) {
        console.warn("No successful payment found for order:", orderId);
        return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
      }

      console.log("Payment verified successfully:", successPayment.cf_payment_id);
      return await finalizeRegistration(formData, successPayment.cf_payment_id.toString(), orderId);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process registration' }, { status: 500 });
  }
}

async function finalizeRegistration(formData: any, paymentId: string, orderId: string) {
  console.log("Saving registration to Firestore...");
  // 1. Save data to Firestore Registration Collection
  const registrationsRef = collection(db, 'registrations');
  const docRef = await addDoc(registrationsRef, {
    ...formData,
    name: formData.name,
    email: formData.email,
    phone: formData.mobile,
    rollNumber: formData.registrationNumber,
    year: "Fresher", 
    hasEntered: false,
    paymentId: paymentId,
    orderId: orderId,
    registeredAt: serverTimestamp(),
  });
  console.log("Registration saved. Firestore ID:", docRef.id);

  // 2. Generate PDF Receipt
  console.log("Generating PDF receipt...");
  const pdfBytes = await generatePDF(formData, docRef.id);
  console.log("PDF receipt generated.");

  // 3. Send Email using SMTP
  console.log("Attempting to send confirmation email to:", formData.email);
  try {
    await sendEmail(formData.email, formData.name, pdfBytes);
    console.log("Email sent successfully.");
  } catch (emailError) {
    console.error("Email delivery failed (non-blocking):", emailError);
  }

  // 4. Create Audit Log
  console.log("Recording audit log...");
  try {
    await addDoc(collection(db, 'auditLogs'), {
      timestamp: serverTimestamp(),
      action: 'REGISTRATION_COMPLETE',
      performedBy: formData.email,
      targetEntity: `registration/${docRef.id}`,
      details: `New registration for ${formData.name} (${formData.registrationNumber}) completed via ${paymentId === 'mock_payment_id' ? 'MOCK' : 'CASHFREE'}`
    });
  } catch (auditError) {
    console.error("Audit logging failed:", auditError);
  }

  return NextResponse.json({ success: true, id: docRef.id });
}

async function generatePDF(data: any, id: string) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();
  
  // Brand Colors
  const primaryColor = rgb(0.98, 0.8, 0.08); // #FACC15 Yellow
  const darkColor = rgb(0.1, 0.1, 0.1);
  const lightGray = rgb(0.96, 0.96, 0.96);
  const successColor = rgb(0.1, 0.5, 0.2);

  // White Header Area
  page.drawRectangle({
    x: 0,
    y: height - 120,
    width: width,
    height: 120,
    color: rgb(1, 1, 1)
  });

  // Load University Logo
  const logoPath = path.join(process.cwd(), 'public', 'logo.png');
  try {
    const logoBytes = await fs.readFile(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const logoDims = logoImage.scale(0.12); // Slightly smaller logo

    page.drawImage(logoImage, {
      x: 40,
      y: height - 105,
      width: logoDims.width,
      height: logoDims.height,
    });
  } catch (error) {
    console.warn('PDF Logo load failed, skipping logo:', error);
  }

  // Header Text (Now Dark for White Background)
  page.drawText('AARAMBH 2026', {
    x: 200,
    y: height - 65,
    size: 26,
    color: darkColor,
  });
  page.drawText('OFFICIAL REGISTRATION RECEIPT', {
    x: 200,
    y: height - 88,
    size: 12,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Brand Accent Bar
  page.drawRectangle({
    x: 0,
    y: height - 125,
    width: width,
    height: 8,
    color: primaryColor
  });

  // QR Code Section (More Elegant)
  const qrDataUrl = await QRCode.toDataURL(id, { margin: 1, width: 300 });
  const qrImageBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
  const qrImage = await pdfDoc.embedPng(qrImageBytes);
  
  page.drawImage(qrImage, {
    x: 450,
    y: height - 110,
    width: 100,
    height: 100
  });

  // Text Cleaning Helper (prevents WinAnsi encoding errors)
  const clean = (text: string) => (text || '').replace(/[^\x20-\x7E]/g, '');

  // Metadata Card
  page.drawRectangle({
    x: 40,
    y: height - 200,
    width: width - 80,
    height: 50,
    color: lightGray
  });
  page.drawText(`Registration ID: ${id}`, { x: 60, y: height - 175, size: 11, color: darkColor });
  page.drawText(`Date Issued: ${new Date().toISOString().split('T')[0]}`, { x: 60, y: height - 192, size: 9, color: rgb(0.5, 0.5, 0.5) });

  // Main Content Sections
  const drawSection = (title: string, y: number, items: { label: string, value: string }[]) => {
    page.drawText(title, { x: 40, y: y, size: 13, color: darkColor });
    page.drawLine({ start: { x: 40, y: y - 5 }, end: { x: 120, y: y - 5 }, thickness: 2, color: primaryColor });
    
    items.forEach((item, index) => {
      page.drawText(item.label, { x: 60, y: y - 35 - (index * 22), size: 10, color: rgb(0.5, 0.5, 0.5) });
      page.drawText(clean(item.value), { x: 180, y: y - 35 - (index * 22), size: 11, color: darkColor });
    });
  };

  // Student Info
  drawSection('STUDENT INFORMATION', height - 240, [
    { label: 'Full Name', value: data.name },
    { label: 'Registration No', value: data.registrationNumber },
    { label: 'Email Address', value: data.email },
    { label: 'Mobile Number', value: data.mobile }
  ]);

  // Family Info
  drawSection('FAMILY DETAILS', height - 370, [
    { label: "Father's Name", value: `${data.fatherName} (${data.fatherMobile})` },
    { label: "Mother's Name", value: `${data.motherName} (${data.motherMobile})` }
  ]);

  // Address Section
  page.drawText('RESIDENTIAL ADDRESS', { x: 40, y: height - 460, size: 13, color: darkColor });
  page.drawLine({ start: { x: 40, y: height - 465 }, end: { x: 120, y: height - 465 }, thickness: 2, color: primaryColor });
  page.drawText(clean(data.address), { x: 60, y: height - 490, size: 11, color: darkColor, maxWidth: width - 120, lineHeight: 15 });

  // Payment Badge
  page.drawRectangle({
    x: 40,
    y: 80,
    width: width - 80,
    height: 45,
    color: rgb(0.9, 1, 0.9),
    borderColor: successColor,
    borderWidth: 1
  });
  page.drawText('PAYMENT STATUS: SUCCESSFUL / VERIFIED', { x: 60, y: 98, size: 12, color: successColor });
  
  // Footer
  page.drawText('JK Lakshmipat University, Jaipur | Aarambh 2026 Management Team', {
    x: 40,
    y: 55,
    size: 8,
    color: rgb(0.5, 0.5, 0.5)
  });
  page.drawText('This is an electronically generated receipt and does not require a physical signature.', {
    x: 40,
    y: 42,
    size: 8,
    color: rgb(0.6, 0.6, 0.6)
  });

  return await pdfDoc.save();
}

async function sendEmail(to: string, name: string, pdfBytes: Uint8Array) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("BREVO_API_KEY missing, skipping email.");
    return;
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: {
        name: 'Aarambh Team',
        email: process.env.SMTP_FROM || 'aarambh@jklu.edu.in'
      },
      to: [{ email: to, name: name }],
      subject: "Aarambh'26 | Your Registration is Confirmed!",
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
            .header { background-color: #1a1a1a; padding: 40px 20px; text-align: center; }
            .logo-text { color: #FACC15; font-size: 32px; font-weight: bold; margin: 0; letter-spacing: 2px; }
            .content { padding: 40px 30px; background-color: #ffffff; color: #333; line-height: 1.6; }
            .success-badge { display: inline-block; padding: 6px 12px; background-color: #dcfce7; color: #166534; border-radius: 4px; font-weight: bold; font-size: 14px; margin-bottom: 20px; }
            .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #777; font-size: 12px; border-top: 1px solid #eeeeee; }
            .button { display: inline-block; padding: 12px 24px; background-color: #FACC15; color: #1a1a1a; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo-text">AARAMBH '26</h1>
              <p style="color: #fff; margin: 5px 0 0 0; opacity: 0.8;">The Awakening of Future</p>
            </div>
            <div class="content">
              <div class="success-badge">✓ Registration Confirmed</div>
              <h2 style="margin-top: 0;">Hello ${name}!</h2>
              <p>Your registration for <strong>Aarambh '26</strong> at JK Lakshmipat University has been successfully processed.</p>
              <p>We are thrilled to have you as part of our signature event. Your attendance contributes to the vibrant spirit of this celebration.</p>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <p style="margin: 0; font-size: 14px; color: #64748b;">What's next?</p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px;">
                  <li>Keep the attached PDF receipt safe.</li>
                  <li>Show the QR code at the check-in desk for instant entry.</li>
                  <li>Check our website for the latest schedule updates.</li>
                </ul>
              </div>

              <p>See you at the event!</p>
              <p>Best Regards,<br/><strong>Team Aarambh</strong></p>
            </div>
            <div class="footer">
              <p>JK Lakshmipat University, Jaipur</p>
              <p>&copy; 2026 Aarambh Event Management System</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachment: [
        {
          content: Buffer.from(pdfBytes).toString('base64'),
          name: 'Aarambh_Registration_Receipt.pdf'
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Brevo API Error: ${errorData.message || JSON.stringify(errorData)}`);
  }
}
