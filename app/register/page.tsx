'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, CreditCard, ArrowLeft, ArrowRight, User, Phone, Mail, Home as HomeIcon, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useRouter, useSearchParams } from 'next/navigation';
import { load } from "@cashfreepayments/cashfree-js";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [regId, setRegId] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    registrationNumber: '',
    fatherName: '',
    fatherMobile: '',
    fatherEmail: '',
    motherName: '',
    motherMobile: '',
    motherEmail: '',
    address: '',
    coupon: '',
  });

  useEffect(() => {
    const oId = searchParams.get('order_id');
    if (oId) {
      setOrderId(oId);
      verifyPayment(oId);
    }
  }, [searchParams]);

  const verifyPayment = async (oId: string) => {
    setIsProcessing(true);
    try {
      const savedData = localStorage.getItem('pending_registration_data');
      const data = savedData ? JSON.parse(savedData) : formData;
      if (savedData) setFormData(data);

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'VERIFY_PAYMENT', orderId: oId, formData: data })
      });
      
      const result = await res.json();
      if (result.success) {
        setIsSuccess(true);
        setRegId(result.id);
        localStorage.removeItem('pending_registration_data');
      } else {
        alert(result.error || 'Payment verification failed');
      }
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleApplyCoupon = () => {
    if (couponInput.toUpperCase() === 'TESTTEST') {
      setFormData(prev => ({ ...prev, coupon: couponInput.toUpperCase() }));
      setCouponMessage('Coupon applied successfully!');
    } else {
      setFormData(prev => ({ ...prev, coupon: '' }));
      setCouponMessage('Invalid coupon code');
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'CREATE_ORDER', 
          honeypot: (document.getElementById('hp_field') as HTMLInputElement)?.value,
          ...formData 
        })
      });
      
      const order = await res.json();
      if (!order.payment_session_id) throw new Error('Failed to create payment session');

      localStorage.setItem('pending_registration_data', JSON.stringify(formData));

      if (order.is_mock) {
        console.log("Mock mode enabled: Bypassing payment");
        await verifyPayment(order.order_id);
        return;
      }

      const cashfree = await load({ 
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'PRODUCTION' ? "production" : "sandbox" 
      });
      
      cashfree.checkout({
        paymentSessionId: order.payment_session_id,
        redirectTarget: "_modal",
      }).then((result: any) => {
        if (result.error) {
          console.error("Payment failed or cancelled:", result.error);
        } else if (!result.redirect) {
          verifyPayment(order.order_id);
        }
      });

    } catch (error) {
      console.error("Payment error:", error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-12 text-center flex flex-col items-center border-brand-orange/30">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
            <CheckCircle2 size={80} className="text-brand-orange mb-6" />
          </motion.div>
          <h1 className="text-3xl font-display font-extrabold text-brand-cloud mb-2">Registration Successful!</h1>
          <p className="text-brand-cloud/60 mb-8">
            Your payment has been processed. A copy of your details has been mailed to <strong>{formData.email}</strong>.
          </p>
          <p className="text-sm text-brand-cloud/50 mb-8">Registration ID: {regId}</p>
          <Button variant="accent" onClick={() => router.push('/')} className="w-full">Back to Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4 flex flex-col items-center relative">
      <div className="hero-glow w-96 h-96 bg-brand-pink/15 -top-20 -right-20 absolute" />
      <div className="w-full max-w-3xl relative z-10">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-brand-cloud/60 hover:text-brand-pink mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to Home
        </button>

        <div className="mb-12 text-center">
          <span className="page-eyebrow">Secure Your Spot</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4 text-brand-cloud uppercase tracking-tight brand-gradient-text">
            AARAMBH&apos;26 Registration
          </h1>
          <p className="text-brand-cloud/60">Join the ultimate convergence of tech and culture.</p>
        </div>

        <div className="flex gap-2 mb-8 justify-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 w-24 rounded-full transition-all duration-300 ${step >= s ? 'bg-brand-pink' : 'bg-brand-cloud/10'}`} />
          ))}
        </div>

        <Card className="p-8 md:p-12 border-brand-pink/20">
          {isProcessing ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <Loader2 size={48} className="text-brand-pink animate-spin" />
              <p className="text-brand-cloud/60 animate-pulse">Processing your registration...</p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <form onSubmit={handleNext} className="space-y-8">
                  {/* Honeypot field */}
                  <div className="hidden" aria-hidden="true">
                    <input id="hp_field" type="text" name="hp_field" tabIndex={-1} autoComplete="off" />
                  </div>
                  <div className="flex items-center gap-3 text-brand-pink border-b border-brand-cloud/10 pb-4">
                    <User size={24} />
                    <h2 className="text-xl font-bold uppercase tracking-wider">Student Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-cloud/60">Full Name *</label>
                      <input required name="name" value={formData.name} onChange={handleChange} className="input-field w-full py-3" placeholder="Enter your full name" suppressHydrationWarning />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-cloud/60">Registration Number *</label>
                      <input required name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="input-field w-full py-3" placeholder="20230001" suppressHydrationWarning />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-cloud/60">Mobile Number *</label>
                      <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="input-field w-full py-3" placeholder="+91 98765 43210" suppressHydrationWarning />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-cloud/60">Email ID *</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} className="input-field w-full py-3" placeholder="Enter your email" suppressHydrationWarning />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button type="submit" className="px-10 flex items-center gap-2">Next Step <ArrowRight size={18} /></Button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleNext} className="space-y-8">
                  <div className="flex items-center gap-3 text-brand-blue border-b border-brand-cloud/10 pb-4">
                    <ShieldCheck size={24} />
                    <h2 className="text-xl font-bold uppercase tracking-wider">Parents Details</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1 space-y-2">
                        <label className="text-sm font-medium text-brand-cloud/60">Father&apos;s Name *</label>
                        <input required name="fatherName" value={formData.fatherName} onChange={handleChange} className="input-field w-full py-3" suppressHydrationWarning />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-brand-cloud/60">Father&apos;s Mobile *</label>
                        <input required name="fatherMobile" value={formData.fatherMobile} onChange={handleChange} className="input-field w-full py-3" suppressHydrationWarning />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-brand-cloud/60">Father&apos;s Email</label>
                        <input name="fatherEmail" value={formData.fatherEmail} onChange={handleChange} className="input-field w-full py-3" suppressHydrationWarning />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1 space-y-2">
                        <label className="text-sm font-medium text-brand-cloud/60">Mother&apos;s Name *</label>
                        <input required name="motherName" value={formData.motherName} onChange={handleChange} className="input-field w-full py-3" suppressHydrationWarning />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-brand-cloud/60">Mother&apos;s Mobile *</label>
                        <input required name="motherMobile" value={formData.motherMobile} onChange={handleChange} className="input-field w-full py-3" suppressHydrationWarning />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-brand-cloud/60">Mother&apos;s Email</label>
                        <input name="motherEmail" value={formData.motherEmail} onChange={handleChange} className="input-field w-full py-3" suppressHydrationWarning />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="glass" onClick={handlePrev}>Back</Button>
                    <Button type="submit" className="px-10 flex items-center gap-2">Next Step <ArrowRight size={18} /></Button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 text-brand-orange border-b border-brand-cloud/10 pb-4">
                    <HomeIcon size={24} />
                    <h2 className="text-xl font-bold uppercase tracking-wider">Address & Payment</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-cloud/60">Full Address *</label>
                      <textarea required name="address" value={formData.address} onChange={handleChange} rows={3} className="input-field w-full resize-none py-3" placeholder="House No, Street, Landmark, City, Pincode" suppressHydrationWarning />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-cloud/60">Coupon Code (Optional)</label>
                      <div className="flex gap-2">
                        <input name="couponInput" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="input-field w-full py-3 uppercase" placeholder="Enter coupon code" suppressHydrationWarning />
                        <Button type="button" variant="accent" onClick={handleApplyCoupon} className="px-6 whitespace-nowrap">Apply</Button>
                      </div>
                      {couponMessage && (
                        <p className={`text-sm ${couponMessage.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
                          {couponMessage}
                        </p>
                      )}
                    </div>

                    <div className="bg-brand-orange/10 border border-brand-orange/30 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div>
                        <p className="text-sm text-brand-cloud/60 uppercase tracking-widest mb-1">Registration Fee</p>
                        <div className="flex items-center gap-3">
                          {formData.coupon.toUpperCase() === 'TESTTEST' ? (
                            <>
                              <p className="text-lg font-display text-brand-cloud/40 line-through">₹ 1,500</p>
                              <p className="text-3xl font-display font-extrabold text-brand-orange">₹ 1</p>
                            </>
                          ) : (
                            <p className="text-3xl font-display font-extrabold text-brand-orange">₹ 1,500</p>
                          )}
                        </div>
                      </div>
                      <Button variant="accent" onClick={handlePayment} className="px-10 py-6 flex items-center gap-2 text-lg">
                        <CreditCard size={24} /> Pay Now
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <Button type="button" variant="glass" onClick={handlePrev}>Back</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-pink" size={48} /></div>}>
      <RegisterContent />
    </Suspense>
  );
}
