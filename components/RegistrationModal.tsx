import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2, CreditCard } from 'lucide-react';
import { Button } from './ui/Button';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RegistrationModal({ isOpen, onClose, onSuccess }: RegistrationModalProps) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
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
    cohortNameNumber: '',
    cohortLeader: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // 1. Save data to Firebase and trigger backend email/PDF generation
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Registration failed');

      // 2. Simulate payment gateway delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setIsProcessing(false);
      setStep(4); // Success step
      onSuccess();
    } catch (error) {
      console.error("Error during payment/registration:", error);
      setIsProcessing(false);
      alert('Something went wrong during registration. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-admin-surface border border-admin-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-admin-border flex justify-between items-center bg-admin-surface sticky top-0 z-10">
            <h2 className="text-2xl font-bold text-white">Aarambh'26 Registration</h2>
            {step !== 4 && !isProcessing && (
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar">
            {step === 1 && (
              <form id="reg-form-1" onSubmit={handleNext} className="space-y-4">
                <h3 className="text-lg font-semibold text-primary mb-4 border-b border-white/10 pb-2">Student Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name *</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/50 border border-admin-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Registration Number *</label>
                    <input required type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="w-full bg-black/50 border border-admin-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" placeholder="12345678" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Mobile Number *</label>
                    <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full bg-black/50 border border-admin-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email ID *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-black/50 border border-admin-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-primary mb-4 mt-8 border-b border-white/10 pb-2">Cohort Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Cohort Name & Number *</label>
                    <input required type="text" name="cohortNameNumber" value={formData.cohortNameNumber} onChange={handleChange} className="w-full bg-black/50 border border-admin-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Alpha 101" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Cohort Leader Name *</label>
                    <input required type="text" name="cohortLeader" value={formData.cohortLeader} onChange={handleChange} className="w-full bg-black/50 border border-admin-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Jane Smith" />
                  </div>
                </div>
              </form>
            )}

            {step === 2 && (
              <form id="reg-form-2" onSubmit={handleNext} className="space-y-4">
                <h3 className="text-lg font-semibold text-primary mb-4 border-b border-white/10 pb-2">Father's Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Father's Name *</label>
                    <input required type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full bg-black/50 border border-admin-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Father's Mobile *</label>
                    <input required type="tel" name="fatherMobile" value={formData.fatherMobile} onChange={handleChange} className="w-full bg-black/50 border border-admin-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Father's Email *</label>
                    <input required type="email" name="fatherEmail" value={formData.fatherEmail} onChange={handleChange} className="w-full bg-black/50 border border-admin-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-primary mb-4 mt-8 border-b border-white/10 pb-2">Mother's Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Mother's Name *</label>
                    <input required type="text" name="motherName" value={formData.motherName} onChange={handleChange} className="w-full bg-black/50 border border-admin-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Mother's Mobile *</label>
                    <input required type="tel" name="motherMobile" value={formData.motherMobile} onChange={handleChange} className="w-full bg-black/50 border border-admin-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Mother's Email *</label>
                    <input required type="email" name="motherEmail" value={formData.motherEmail} onChange={handleChange} className="w-full bg-black/50 border border-admin-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-primary mb-4 border-b border-white/10 pb-2">Address & Final Review</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Full Address *</label>
                  <textarea required name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full bg-black/50 border border-admin-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors resize-none" placeholder="123 Street Name, City, State, ZIP" />
                </div>
                
                <div className="bg-black/30 p-4 rounded-xl border border-admin-border/50">
                  <h4 className="text-sm font-medium text-white mb-2">Registration Summary</h4>
                  <ul className="space-y-1 text-sm text-gray-400">
                    <li><span className="text-gray-500">Name:</span> {formData.name}</li>
                    <li><span className="text-gray-500">Reg No:</span> {formData.registrationNumber}</li>
                    <li><span className="text-gray-500">Cohort:</span> {formData.cohortNameNumber}</li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-admin-border flex justify-between items-center">
                    <span className="text-gray-300 font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-white">₹ 1,500</span>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-12 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <CheckCircle2 size={80} className="text-green-500 mb-6" />
                </motion.div>
                <h3 className="text-3xl font-bold text-white mb-2">Registration Successful!</h3>
                <p className="text-gray-400 max-w-md mx-auto mb-8">
                  Your payment has been processed. A copy of your details in PDF format has been mailed to <strong>{formData.email}</strong>.
                </p>
                <Button onClick={onClose} className="px-8">Explore Locked Features</Button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {step < 4 && (
            <div className="p-6 border-t border-admin-border bg-black/20 flex justify-between items-center sticky bottom-0 z-10">
              <div className="flex gap-1">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-2 w-8 rounded-full ${step >= s ? 'bg-primary' : 'bg-admin-border'}`} />
                ))}
              </div>
              
              <div className="flex gap-3">
                {step > 1 && !isProcessing && (
                  <Button variant="glass" onClick={handlePrev}>Back</Button>
                )}
                {step < 3 ? (
                  <Button type="submit" form={`reg-form-${step}`}>Next Step</Button>
                ) : (
                  <Button 
                    onClick={handlePayment} 
                    disabled={isProcessing || !formData.address}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"
                  >
                    {isProcessing ? (
                      <><Loader2 className="animate-spin" size={18} /> Processing Payment...</>
                    ) : (
                      <><CreditCard size={18} /> Pay Now</>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
