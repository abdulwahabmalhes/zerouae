"use client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      <Header/>
      <main className="pt-28 pb-24">
        <div className="container-main max-w-3xl">
          <div className="mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-3">Legal</p>
            <h1 className="text-5xl font-black text-[var(--color-text-main)] tracking-tighter italic">
              Terms of <span className="text-[var(--color-primary)]">Use</span>
            </h1>
            <p className="text-[var(--color-text-muted)] font-medium mt-4">Last updated: April 2025</p>
          </div>

          <div className="prose prose-sm max-w-none space-y-10">
            {[
              { title: "1. Acceptance of Terms", body: "By accessing or using ZORO UAE, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree, please do not use the platform." },
              { title: "2. User Accounts", body: "You must be 18 years or older to create an account. You are responsible for maintaining the security of your account credentials. ZORO UAE reserves the right to terminate accounts that violate these terms." },
              { title: "3. Listing Rules", body: "All listings must be accurate, legal, and compliant with UAE law. Prohibited items include weapons, counterfeit goods, illegal services, or anything restricted under UAE regulations. ZORO UAE reserves the right to remove any listing at its discretion." },
              { title: "4. Transactions", body: "ZORO UAE is a marketplace platform only. We do not participate in, facilitate, or guarantee any transaction between buyers and sellers. All deals are made directly between parties. We strongly recommend meeting in public places and verifying items before payment." },
              { title: "5. Intellectual Property", body: "All content on ZORO UAE — including the logo, design, code, and original text — is the property of ZORO UAE and may not be reproduced without written permission." },
              { title: "6. Limitation of Liability", body: "ZORO UAE is not liable for any direct, indirect, or consequential damages arising from the use of our platform, including but not limited to fraudulent listings, failed transactions, or data loss." },
              { title: "7. Governing Law", body: "These terms are governed by the laws of the United Arab Emirates. Any disputes shall be subject to the exclusive jurisdiction of the courts of Dubai." },
              { title: "8. Changes to Terms", body: "We may update these terms periodically. Continued use of the platform after changes constitutes acceptance of the new terms." },
            ].map(({ title, body }) => (
              <div key={title} className="card p-8">
                <h2 className="text-base font-black text-[var(--color-text-main)] mb-4">{title}</h2>
                <p className="text-sm text-[var(--color-text-sub)] font-medium leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
