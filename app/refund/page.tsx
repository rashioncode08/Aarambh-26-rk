import React from 'react';

export const metadata = {
  title: 'Refund & Cancellation Policy | Aarambh \'26',
  description: 'Official refund and cancellation policy for Aarambh \'26 registrations at JK Lakshmipat University.',
  openGraph: {
    title: 'Refund & Cancellation Policy | Aarambh \'26',
    description: 'Official refund and cancellation policy for Aarambh \'26 registrations at JK Lakshmipat University.',
    type: 'website',
  }
};

export default function RefundPage() {
  return (
    <div className="py-28 px-6 max-w-4xl mx-auto min-h-screen relative selection:bg-brand-ink selection:text-brand-cloud text-brand-ink bg-brand-cloud">
      {/* Decorative layout grid line indicators (Neobrutalist design language) */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-brand-pink/5 rounded-full blur-[80px] pointer-events-none" />

      <header className="text-center mb-16 relative z-10">
        <span className="text-xs font-mono font-black uppercase tracking-widest text-brand-pink block mb-3">
          University Guidelines
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight mb-4 drop-shadow-[2px_2px_0px_rgba(3,4,4,0.1)]">
          Refund & Cancellation Policy
        </h1>
        <div className="w-24 h-1.5 bg-brand-orange mx-auto" />
      </header>

      <div className="space-y-8 relative z-10 font-bold">
        {/* Core Notice Box */}
        <div className="bg-white border-4 border-brand-ink p-8 rounded-lg shadow-[6px_6px_0px_0px_#030404] transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#030404]">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-brand-pink mb-2">
            Important Notice
          </div>
          <h2 className="text-xl font-display font-black uppercase mb-4">
            Strict Non-Refundable Fee Policy
          </h2>
          <p className="font-mono text-sm leading-relaxed text-brand-ink/80">
            Aarambh &apos;26 is the premier annual youth festival of JK Lakshmipat University. To facilitate the booking of resource persons, material procurement, team formations, and logistics preparation, a strict financial policy is enforced.
          </p>
        </div>

        {/* Detailed Guidelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Policy Section 1 */}
          <div className="bg-white border-4 border-brand-ink p-6 rounded-lg shadow-[4px_4px_0px_0px_#030404] flex flex-col justify-between">
            <div>
              <h3 className="text-base font-display font-black uppercase mb-3 text-brand-orange">
                1. Event Registration Fee
              </h3>
              <p className="text-xs font-mono leading-relaxed text-brand-ink/75">
                The standard final registration fee for participating in Aarambh &apos;26 is set at rupees 2500 per registrant. This is a unified entry ticket providing access to events. Please note that a 2% gateway transaction convenience fee charged by Cashfree Payments is applicable and must be paid by the participant during checkout.
              </p>
            </div>
          </div>

          {/* Policy Section 2 */}
          <div className="bg-white border-4 border-brand-ink p-6 rounded-lg shadow-[4px_4px_0px_0px_#030404] flex flex-col justify-between">
            <div>
              <h3 className="text-base font-display font-black uppercase mb-3 text-brand-orange">
                2. No Refund Terms
              </h3>
              <p className="text-xs font-mono leading-relaxed text-brand-ink/75">
                Once a registration transaction is successful, the paid amount of rupees 2500 is completely non-refundable. Under no circumstances—including but not limited to absence, scheduling conflicts, change of mind, event postponement, or disqualification—will a refund request be entertained.
              </p>
            </div>
          </div>

          {/* Policy Section 3 */}
          <div className="bg-white border-4 border-brand-ink p-6 rounded-lg shadow-[4px_4px_0px_0px_#030404] flex flex-col justify-between">
            <div>
              <h3 className="text-base font-display font-black uppercase mb-3 text-brand-orange">
                3. Cancellation Procedure
              </h3>
              <p className="text-xs font-mono leading-relaxed text-brand-ink/75">
                Registrants who wish to cancel their participation may do so by contacting the registration desk or support team. However, cancellation of a profile will not yield any monetary compensation or credit towards subsequent editions of the festival.
              </p>
            </div>
          </div>

          {/* Policy Section 4 */}
          <div className="bg-white border-4 border-brand-ink p-6 rounded-lg shadow-[4px_4px_0px_0px_#030404] flex flex-col justify-between">
            <div>
              <h3 className="text-base font-display font-black uppercase mb-3 text-brand-orange">
                4. Ticket Transferability
              </h3>
              <p className="text-xs font-mono leading-relaxed text-brand-ink/75">
                Aarambh registrations are highly secure and tied specifically to the student registration credentials supplied during enrollment. Tickets, QR codes, and entry passes are strictly non-transferable and cannot be reassigned to any other candidate.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Support Box */}
        <div className="bg-brand-cloud border-4 border-brand-ink p-8 rounded-lg shadow-[6px_6px_0px_0px_#030404] text-center font-mono">
          <h3 className="text-lg font-display font-black uppercase mb-2">
            Questions Regarding Registration?
          </h3>
          <p className="text-xs text-brand-ink/70 mb-4 max-w-xl mx-auto">
            If you experienced an accidental duplicate billing transaction during checkout or encountered a payment gateway error, please reach out to the university administration for immediate reconciliation.
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
