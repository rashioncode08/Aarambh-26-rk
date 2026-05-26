import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Aarambh \'26',
  description: 'Official privacy policy for Aarambh \'26 event registrations at JK Lakshmipat University.',
  openGraph: {
    title: 'Privacy Policy | Aarambh \'26',
    description: 'Official privacy policy for Aarambh \'26 event registrations at JK Lakshmipat University.',
    type: 'website',
  }
};

export default function PrivacyPage() {
  return (
    <div className="py-28 px-6 max-w-4xl mx-auto min-h-screen relative selection:bg-brand-ink selection:text-brand-cloud text-brand-ink bg-brand-cloud">
      {/* Decorative layout indicators */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-brand-pink/5 rounded-full blur-[80px] pointer-events-none" />

      <header className="text-center mb-16 relative z-10">
        <span className="text-xs font-mono font-black uppercase tracking-widest text-brand-pink block mb-3">
          Security & Privacy
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight mb-4 drop-shadow-[2px_2px_0px_rgba(3,4,4,0.1)]">
          Privacy Policy
        </h1>
        <div className="w-24 h-1.5 bg-brand-orange mx-auto" />
      </header>

      <div className="space-y-8 relative z-10 font-bold">
        {/* Intro */}
        <div className="bg-white border-4 border-brand-ink p-8 rounded-lg shadow-[6px_6px_0px_0px_#030404]">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-brand-pink mb-2">
            Last Updated: May 2026
          </div>
          <p className="font-mono text-sm leading-relaxed text-brand-ink/80">
            At Aarambh &apos;26 and JK Lakshmipat University, we value your privacy and are committed to protecting your personal information. This Privacy Policy details how we collect, store, process, and safeguard your data during the registration and participation process.
          </p>
        </div>

        {/* Content sections */}
        <div className="bg-white border-4 border-brand-ink p-8 rounded-lg shadow-[6px_6px_0px_0px_#030404] space-y-6">
          <div>
            <h2 className="text-lg font-display font-black uppercase mb-2 text-brand-orange">
              1. Information We Collect
            </h2>
            <p className="font-mono text-xs leading-relaxed text-brand-ink/75">
              During the registration process, we collect essential personal details, including your full name, student registration number, academic programme, mobile number, email address, parent or guardian details (name, phone, email), residential address, and transaction logs.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display font-black uppercase mb-2 text-brand-orange">
              2. How We Use Your Data
            </h2>
            <p className="font-mono text-xs leading-relaxed text-brand-ink/75">
              We process this data solely to manage your event enrollment, generate secure QR verification passes, send booking receipt confirmations via email, coordinate logistics with volunteer teams, compile official attendance registries, and maintain security logs on the university premises.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display font-black uppercase mb-2 text-brand-orange">
              3. Payment Security & Processing
            </h2>
            <p className="font-mono text-xs leading-relaxed text-brand-ink/75">
              All financial transaction processing is handled securely by our integrated payment gateway provider (Cashfree Payments). We do not record or retain your credit card credentials, net banking passwords, or UPI pin details on our databases. Transaction IDs and payment states are stored for audit and verification purposes.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display font-black uppercase mb-2 text-brand-orange">
              4. Data Sharing & Third-Parties
            </h2>
            <p className="font-mono text-xs leading-relaxed text-brand-ink/75">
              We do not distribute, lease, sell, or disclose your personal records to any commercial advertising platforms or third-party marketing entities. Information is shared strictly with university administration and secure technical components necessary for checking you in.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display font-black uppercase mb-2 text-brand-orange">
              5. Data Protection Rights
            </h2>
            <p className="font-mono text-xs leading-relaxed text-brand-ink/75">
              Registrants retain the right to check, update, or correct their registered details on our databases. If you wish to rectify an input mistake on your profile, please contact the registration support team with valid identification credentials.
            </p>
          </div>
        </div>

        {/* Contact info footer box */}
        <div className="bg-brand-cloud border-4 border-brand-ink p-8 rounded-lg shadow-[6px_6px_0px_0px_#030404] text-center font-mono">
          <h3 className="text-lg font-display font-black uppercase mb-2">
            Need Privacy Clarification?
          </h3>
          <p className="text-xs text-brand-ink/70 mb-4 max-w-xl mx-auto">
            For data inquiries, request reviews, or policy clarifications, please reach out to the university tech support desk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center font-bold text-xs uppercase">
            <span className="px-4 py-2 border-2 border-brand-ink bg-white rounded shadow-comic-sm">
              Email: info@jklu.edu.in
            </span>
            <span className="px-4 py-2 border-2 border-brand-ink bg-white rounded shadow-comic-sm">
              Phone: +91 141 7107500
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
