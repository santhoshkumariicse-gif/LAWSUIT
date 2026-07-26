export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#07111f] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8">
          Privacy <span className="text-[#d4af37]">Policy</span>
        </h1>
        
        <div className="glass-card p-8 md:p-12 space-y-8 text-[#b8c2cc] font-sans">
          <section>
            <h2 className="text-2xl font-heading font-bold text-white mb-4">1. Overview</h2>
            <p>
              LawGuide AI India is committed to protecting your privacy in accordance with the 
              <strong> Digital Personal Data Protection (DPDP) Act, 2023</strong>. 
              This policy outlines how we handle your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-white mb-4">2. Data Minimization & Collection</h2>
            <p className="mb-4">
              We collect the absolute minimum data required to operate the platform:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Unauthenticated Users:</strong> Legal queries are processed at the edge and immediately discarded. No text is saved.</li>
              <li><strong>Authenticated Users:</strong> Only explicitly saved queries, your email address, and an encrypted password hash are stored in our secure database.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-white mb-4">3. Data Principal Rights (Your Rights)</h2>
            <p className="mb-4">Under the DPDP Act, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access all personal data we hold about you via the Dashboard.</li>
              <li>Request a complete erasure of your account and associated query history (Right to be Forgotten).</li>
              <li>Withdraw consent for optional analytics tracking.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-white mb-4">4. Subprocessors & Security</h2>
            <p>
              Our infrastructure relies on secure cloud providers. Data is encrypted at rest using AES-256 and in transit via TLS 1.3. 
              Anonymized telemetry may be sent to Sentry/Datadog for error tracking, strictly stripped of any PII.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
