import React from 'react';

export const metadata = {
  title: 'Terms & Conditions | Aarambh \'26',
  description: 'Official terms and conditions of participation for Aarambh \'26 event registrations at JK Lakshmipat University.',
  openGraph: {
    title: 'Terms & Conditions | Aarambh \'26',
    description: 'Official terms and conditions of participation for Aarambh \'26 event registrations at JK Lakshmipat University.',
    type: 'website',
  }
};

export default function TermsPage() {
  return (
    <div className="py-28 px-6 max-w-4xl mx-auto min-h-screen relative selection:bg-brand-ink selection:text-brand-cloud text-brand-ink bg-brand-cloud">
      {/* Decorative layout indicators */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-brand-pink/5 rounded-full blur-[80px] pointer-events-none" />

      <header className="text-center mb-16 relative z-10">
        <span className="text-xs font-mono font-black uppercase tracking-widest text-brand-pink block mb-3">
          Official Agreement
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight mb-4 drop-shadow-[2px_2px_0px_rgba(3,4,4,0.1)]">
          Terms & Conditions
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
            Welcome to Aarambh &apos;26. By registering and completing the payment of rupees 2500, you agree to comply with the terms of participation, university codes of conduct, and safety regulations detailed below.
          </p>
        </div>

        {/* Content sections */}
        <div className="bg-white border-4 border-brand-ink p-8 rounded-lg shadow-[6px_6px_0px_0px_#030404] space-y-6">
          <div>
            <h2 className="text-lg font-display font-black uppercase mb-2 text-brand-orange">
              1. Registration & Entry Requirements
            </h2>
            <p className="font-mono text-xs leading-relaxed text-brand-ink/75">
              Participation in Aarambh &apos;26 requires completion of the registration form, payment of rupees 2500, and a valid university student identity card. Entry will only be granted upon successful barcode/QR code scans at the check-in terminal.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display font-black uppercase mb-2 text-brand-orange">
              2. Strict Code of Conduct
            </h2>
            <p className="font-mono text-xs leading-relaxed text-brand-ink/75">
              All registrants must adhere to the high disciplinary standards of JK Lakshmipat University. Any form of harassment, destruction of property, disruption of events, or usage of banned substances is strictly prohibited and will result in immediate disqualification and removal from campus without refund.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display font-black uppercase mb-2 text-brand-orange">
              3. Payment & Non-Refundability
            </h2>
            <p className="font-mono text-xs leading-relaxed text-brand-ink/75">
              The registration fee of rupees 2500 is completely non-refundable and non-transferable under any circumstances, as detailed in our Refund Policy. Additionally, a 2% gateway transaction convenience fee charged by Cashfree Payments is applicable and must be paid by the participant during checkout. Duplicate charges arising from network delays during transaction processing will be verified and reconciled manually by our team.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display font-black uppercase mb-2 text-brand-orange">
              4. Media & Publicity Release
            </h2>
            <p className="font-mono text-xs leading-relaxed text-brand-ink/75">
              By participating in Aarambh &apos;26, you grant the organizing committee and JK Lakshmipat University the absolute right and permission to take photographs, audio recordings, or videos during the festival and utilize them for institutional promotions, publications, and web marketing.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display font-black uppercase mb-2 text-brand-orange">
              5. Limitation of Liability
            </h2>
            <p className="font-mono text-xs leading-relaxed text-brand-ink/75">
              The organizing committee, volunteers, and JK Lakshmipat University shall not be held liable for any loss, damage, theft of personal belongings, or physical injury sustained by participants during the events of the youth festival.
            </p>
          </div>
        </div>

        {/* Contact info footer box */}
        <div className="bg-brand-cloud border-4 border-brand-ink p-8 rounded-lg shadow-[6px_6px_0px_0px_#030404] text-center font-mono">
          <h3 className="text-lg font-display font-black uppercase mb-2">
            Questions Regarding Terms?
          </h3>
          <p className="text-xs text-brand-ink/70 mb-4 max-w-xl mx-auto">
            Please reach out to the university administration office for any questions or formal concerns regarding these rules.
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
