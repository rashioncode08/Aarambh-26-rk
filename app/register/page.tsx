'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, CreditCard, ArrowLeft, ArrowRight, User, ShieldCheck, Home as HomeIcon, Lock, Unlock, Check } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { load } from "@cashfreepayments/cashfree-js";
import Image from 'next/image';
import ComicBackground from '@/components/ComicBackground';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePayment();
  };

  // Section validation logic
  const studentStarted = 
    formData.name.trim() !== '' ||
    formData.registrationNumber.trim() !== '' ||
    formData.mobile.trim() !== '' ||
    formData.email.trim() !== '';

  const isStudentValid = 
    formData.name.trim() !== '' &&
    formData.registrationNumber.trim() !== '' &&
    formData.mobile.trim() !== '' &&
    formData.email.trim() !== '';

  const parentsStarted = 
    formData.fatherName.trim() !== '' ||
    formData.fatherMobile.trim() !== '' ||
    formData.fatherEmail.trim() !== '' ||
    formData.motherName.trim() !== '' ||
    formData.motherMobile.trim() !== '' ||
    formData.motherEmail.trim() !== '';

  const isParentsValid = 
    formData.fatherName.trim() !== '' &&
    formData.fatherMobile.trim() !== '' &&
    formData.motherName.trim() !== '' &&
    formData.motherMobile.trim() !== '';

  const isAddressValid = 
    formData.address.trim().length >= 10;

  if (isSuccess) {
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center p-4 sm:p-6 selection:bg-brand-ink selection:text-brand-cloud text-brand-ink overflow-hidden">
        <ComicBackground />

        <div className="max-w-md w-full bg-brand-cloud border-comic p-6 sm:p-8 md:p-12 text-center flex flex-col items-center rounded-2xl shadow-comic-lg relative z-10">
          
          <h1 className="text-3xl md:text-4xl font-vanilla text-brand-ink mb-4">
            Registration Successful!
          </h1>
          <p className="font-sans font-medium text-sm text-brand-ink/70 mb-6 leading-relaxed">
            Your payment has been processed. A copy of your details has been mailed to <strong className="text-brand-pink font-semibold">{formData.email}</strong>.
          </p>
          <div className="bg-white border-comic-thin px-4 py-2.5 rounded-xl font-mono text-xs tracking-wider mb-8 text-brand-ink w-full shadow-comic-sm">
            REGISTRATION ID: {regId}
          </div>
          <button 
            onClick={() => router.push('/')} 
            className="w-full py-4 bg-brand-pink hover:bg-brand-pink/90 text-brand-cloud border-comic shadow-comic font-sans font-black text-sm uppercase tracking-wider rounded-xl comic-interactive cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen py-8 sm:py-16 md:py-24 px-3 sm:px-4 flex flex-col items-center selection:bg-brand-ink selection:text-brand-cloud text-brand-ink overflow-hidden">
      <ComicBackground />

      <div className="w-full max-w-3xl relative z-10">
        <div className="mb-6 sm:mb-8 md:mb-12 text-center flex flex-col items-center">
          <Image 
            src="/aarambh-registration.svg" 
            alt="Aarambh '26 Registration" 
            width={800} 
            height={231} 
            priority
            className="w-full max-w-2xl h-auto object-contain select-none"
            style={{ 
              filter: "drop-shadow(2px 2px 0px #030404) drop-shadow(-2px -2px 0px #030404) drop-shadow(2px -2px 0px #030404) drop-shadow(-2px 2px 0px #030404) drop-shadow(6px 6px 0px #FF188C)" 
            }}
          />
        </div>

        <div className="border-comic bg-brand-cloud/80 backdrop-blur-md text-brand-ink p-4 sm:p-6 md:p-12 rounded-2xl shadow-comic-lg relative overflow-hidden bg-halftone-black">
          {isProcessing ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <Loader2 size={48} className="text-brand-pink animate-spin stroke-[3]" />
              <p className="text-brand-ink/75 font-semibold animate-pulse font-display uppercase tracking-wider text-xs">
                Processing your registration...
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-12">
              {/* Honeypot field */}
              <div className="hidden" aria-hidden="true">
                <input id="hp_field" type="text" name="hp_field" tabIndex={-1} autoComplete="off" />
              </div>

              {/* SECTION 1. STUDENT DETAILS */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-4 border-brand-ink pb-4">
                  <div className="flex items-center gap-3 text-brand-pink">
                    <h2 className="text-2xl sm:text-3xl font-vanilla text-brand-ink">Student Details</h2>
                  </div>
                  {isStudentValid ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 border-2 border-brand-ink bg-green-400 text-brand-ink font-display text-[9px] font-black uppercase rounded shadow-comic-sm rotate-3">
                      <Check size={12} className="stroke-[4] shrink-0" />
                      <span className="flex flex-col text-left leading-tight">
                        <span>Requirement</span>
                        <span>Fulfilled</span>
                      </span>
                    </span>
                  ) : studentStarted ? (
                    <span className="px-3 py-1 border-2 border-brand-ink bg-brand-pink text-brand-cloud font-display text-[10px] font-black uppercase rounded shadow-comic-sm -rotate-2">
                      IN PROGRESS
                    </span>
                  ) : (
                    <span className="px-3 py-1 border-2 border-brand-ink bg-brand-blue text-brand-cloud font-display text-[10px] font-black uppercase rounded shadow-comic-sm -rotate-2">
                      ACTIVE
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-brand-ink/80 block">Full Name *</label>
                    <input 
                      required 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 bg-white border-comic-thin text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl"
                      placeholder="Enter your full name" 
                      suppressHydrationWarning 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-brand-ink/80 block">Registration Number *</label>
                    <input 
                      required 
                      name="registrationNumber" 
                      value={formData.registrationNumber} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 bg-white border-comic-thin text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl"
                      placeholder="20230001" 
                      suppressHydrationWarning 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-brand-ink/80 block">Mobile Number *</label>
                    <input 
                      required 
                      type="tel" 
                      name="mobile" 
                      value={formData.mobile} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 bg-white border-comic-thin text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl"
                      placeholder="+91 98765 43210" 
                      suppressHydrationWarning 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-brand-ink/80 block">Email ID *</label>
                    <input 
                      required 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 bg-white border-comic-thin text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl"
                      placeholder="Enter your email" 
                      suppressHydrationWarning 
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2. PARENTS DETAILS (ACCORDION) */}
              <div className="space-y-6">
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-4 border-brand-ink pb-4 transition-all duration-300 ${!isStudentValid ? 'opacity-30' : ''}`}>
                  <div className="flex items-center gap-3 text-brand-blue">
                    <h2 className="text-2xl sm:text-3xl font-vanilla text-brand-ink">Parents Details</h2>
                  </div>
                  {isStudentValid ? (
                    isParentsValid ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 border-2 border-brand-ink bg-green-400 text-brand-ink font-display text-[9px] font-black uppercase rounded shadow-comic-sm rotate-3">
                        <Check size={12} className="stroke-[4] shrink-0" />
                        <span className="flex flex-col text-left leading-tight">
                          <span>Requirement</span>
                          <span>Fulfilled</span>
                        </span>
                      </span>
                    ) : parentsStarted ? (
                      <span className="px-3 py-1 border-2 border-brand-ink bg-brand-pink text-brand-cloud font-display text-[10px] font-black uppercase rounded shadow-comic-sm -rotate-2">
                        IN PROGRESS
                      </span>
                    ) : (
                      <span className="px-3 py-1 border-2 border-brand-ink bg-brand-blue text-brand-cloud font-display text-[10px] font-black uppercase rounded shadow-comic-sm -rotate-2">
                        ACTIVE
                      </span>
                    )
                  ) : (
                    <span className="px-3 py-1 border-2 border-brand-ink bg-[#F5F1E5] text-brand-ink/40 font-display text-[9px] font-black uppercase rounded shadow-comic-sm">
                      🔒 LOCKED
                    </span>
                  )}
                </div>
                
                <AnimatePresence initial={false}>
                  {isStudentValid && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden space-y-6"
                    >
                      {/* Father Details Row */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border-2 border-brand-ink/10 rounded-xl bg-white/40 shadow-comic-sm">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-brand-ink/80 block">Father&apos;s Name *</label>
                          <input 
                            required={isStudentValid}
                            name="fatherName" 
                            value={formData.fatherName} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 bg-white border-comic-thin text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl" 
                            placeholder="Father's full name"
                            suppressHydrationWarning 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-brand-ink/80 block">Father&apos;s Mobile *</label>
                          <input 
                            required={isStudentValid}
                            name="fatherMobile" 
                            value={formData.fatherMobile} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 bg-white border-comic-thin text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl" 
                            placeholder="Father's mobile number"
                            suppressHydrationWarning 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-brand-ink/80 block">Father&apos;s Email</label>
                          <input 
                            name="fatherEmail" 
                            value={formData.fatherEmail} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 bg-white border-comic-thin text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl" 
                            placeholder="father@email.com"
                            suppressHydrationWarning 
                          />
                        </div>
                      </div>

                      {/* Mother Details Row */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border-2 border-brand-ink/10 rounded-xl bg-white/40 shadow-comic-sm">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-brand-ink/80 block">Mother&apos;s Name *</label>
                          <input 
                            required={isStudentValid}
                            name="motherName" 
                            value={formData.motherName} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 bg-white border-comic-thin text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl" 
                            placeholder="Mother's full name"
                            suppressHydrationWarning 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-brand-ink/80 block">Mother&apos;s Mobile *</label>
                          <input 
                            required={isStudentValid}
                            name="motherMobile" 
                            value={formData.motherMobile} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 bg-white border-comic-thin text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl" 
                            placeholder="Mother's mobile number"
                            suppressHydrationWarning 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-brand-ink/80 block">Mother&apos;s Email</label>
                          <input 
                            name="motherEmail" 
                            value={formData.motherEmail} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 bg-white border-comic-thin text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl" 
                            placeholder="mother@email.com"
                            suppressHydrationWarning 
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SECTION 3. ADDRESS & PAYMENT (ACCORDION) */}
              <div className="space-y-6">
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-4 border-brand-ink pb-4 transition-all duration-300 ${(!isStudentValid || !isParentsValid) ? 'opacity-30' : ''}`}>
                  <div className="flex items-center gap-3 text-brand-orange">
                    <h2 className="text-2xl sm:text-3xl font-vanilla text-brand-ink">Address & Verification</h2>
                  </div>
                  {isStudentValid && isParentsValid ? (
                    isAddressValid ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 border-2 border-brand-ink bg-green-400 text-brand-ink font-display text-[9px] font-black uppercase rounded shadow-comic-sm rotate-3">
                        <Check size={12} className="stroke-[4] shrink-0" />
                        <span className="flex flex-col text-left leading-tight">
                          <span>Requirement</span>
                          <span>Fulfilled</span>
                        </span>
                      </span>
                    ) : formData.address.trim().length > 0 ? (
                      <span className="px-3 py-1 border-2 border-brand-ink bg-brand-pink text-brand-cloud font-display text-[10px] font-black uppercase rounded shadow-comic-sm -rotate-2">
                        IN PROGRESS
                      </span>
                    ) : (
                      <span className="px-3 py-1 border-2 border-brand-ink bg-brand-blue text-brand-cloud font-display text-[10px] font-black uppercase rounded shadow-comic-sm -rotate-2">
                        ACTIVE
                      </span>
                    )
                  ) : (
                    <span className="px-3 py-1 border-2 border-brand-ink bg-[#F5F1E5] text-brand-ink/40 font-display text-[9px] font-black uppercase rounded shadow-comic-sm">
                      🔒 LOCKED
                    </span>
                  )}
                </div>
                
                <AnimatePresence initial={false}>
                  {isStudentValid && isParentsValid && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-brand-ink/80 block">Full Address *</label>
                        <textarea 
                          required={isStudentValid && isParentsValid}
                          name="address" 
                          value={formData.address} 
                          onChange={handleChange} 
                          rows={3} 
                          className="w-full px-4 py-3 bg-white border-comic-thin text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl resize-none" 
                          placeholder="House No, Street, Landmark, City, State, Pincode" 
                          suppressHydrationWarning 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-brand-ink/80 block">Coupon Code (Optional)</label>
                        <div className="flex gap-2">
                          <input 
                            name="couponInput" 
                            value={couponInput} 
                            onChange={(e) => setCouponInput(e.target.value)} 
                            className="flex-grow px-4 py-3 bg-white border-comic-thin text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl uppercase" 
                            placeholder="Enter coupon code" 
                            suppressHydrationWarning 
                          />
                          <button 
                            type="button" 
                            onClick={handleApplyCoupon} 
                            className="px-6 py-3 bg-brand-pink text-brand-cloud border-comic shadow-comic font-display font-black text-xs uppercase tracking-widest rounded-xl comic-interactive cursor-pointer whitespace-nowrap"
                          >
                            Apply
                          </button>
                        </div>
                        {couponMessage && (
                          <p className={`text-xs font-black uppercase tracking-wider mt-1 ${couponMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                            {couponMessage}
                          </p>
                        )}
                      </div>

                      <div className="border-comic bg-brand-pink/5 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden shadow-comic bg-halftone-black opacity-95">
                        <div className="absolute top-2 right-2 text-[8px] font-black uppercase border-comic-thin px-2 py-0.5 bg-brand-pink text-brand-cloud rounded shadow-comic-sm">
                          OFFICIAL TICKET
                        </div>
                        <div>
                          <p className="text-xs font-black text-brand-ink/60 uppercase tracking-widest mb-1">Registration Fee</p>
                          <div className="flex items-center gap-3">
                            {formData.coupon.toUpperCase() === 'TESTTEST' ? (
                              <>
                                <p className="text-lg font-display font-black text-brand-ink/30 line-through">₹ 3,500</p>
                                <p className="text-4xl font-display font-black text-brand-pink drop-shadow-[2px_2px_0px_#030404]">₹ 1</p>
                              </>
                            ) : (
                              <div className="flex flex-col">
                                <div className="flex items-center gap-3">
                                  <p className="text-lg font-display font-black text-brand-ink/30 line-through">₹ 3,500</p>
                                  <p className="text-4xl font-display font-black text-brand-pink drop-shadow-[2px_2px_0px_#030404]">₹ 2,500</p>
                                </div>
                                <p className="text-[9px] font-black uppercase text-brand-ink/40 tracking-wider mt-1.5">
                                  * Excludes 2% Cashfree transaction fee
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <button 
                          type="submit" 
                          className="px-10 py-5 bg-brand-pink text-brand-cloud border-comic shadow-comic font-display font-black text-lg uppercase tracking-wider rounded-xl comic-interactive flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
                        >
                          <CreditCard size={24} className="stroke-[3]" /> Pay Now
                        </button>
                      </div>

                      <div className="mt-4 border-2 border-brand-ink bg-white p-4 rounded-xl text-center shadow-comic-sm space-y-2">
                        <p className="text-xs font-black uppercase tracking-wider text-brand-pink">
                          Important Note: The registration fee is strictly non-refundable under any circumstances.
                        </p>
                        <div className="h-[2px] bg-brand-ink/10 w-12 mx-auto" />
                        <p className="text-[9px] font-black uppercase tracking-wider text-brand-ink/50 leading-relaxed">
                          Please note: A 2% gateway transaction fee charged by Cashfree Payments will be added at checkout and is to be paid by the participant.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-ink flex items-center justify-center"><Loader2 className="animate-spin text-brand-pink stroke-[3]" size={48} /></div>}>
      <RegisterContent />
    </Suspense>
  );
}
