"use client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      <Header/>
      <main className="pt-28 pb-24">
        <div className="container-main max-w-3xl">
          <div className="mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-3">Legal</p>
            <h1 className="text-5xl font-black text-[var(--color-text-main)] tracking-tighter italic">
              Privacy <span className="text-[var(--color-primary)]">Policy</span>
            </h1>
            <p className="text-[var(--color-text-muted)] font-medium mt-4">Last updated: April 2025</p>
          </div>

          <div className="space-y-8">
            {[
              { title: "1. Information We Collect", body: "We collect information you provide when creating an account (name, email, phone), posting listings, and using our platform. We also collect usage data such as pages visited, search queries, and device information." },
              { title: "2. How We Use Your Information", body: "Your data is used to provide and improve our services, verify user identity, prevent fraud, send relevant notifications, and personalise your experience on ZORO UAE." },
              { title: "3. Information Sharing", body: "We do not sell your personal data. We share information only with service providers who assist us in operating the platform, and only when required by UAE law or legal process." },
              { title: "4. Data Security", body: "We implement industry-standard encryption and security measures to protect your personal data. However, no method of transmission over the internet is 100% secure." },
              { title: "5. Cookies", body: "We use cookies to enhance your experience, remember preferences, and analyse traffic. You can control cookies through your browser settings." },
              { title: "6. Your Rights", body: "You have the right to access, correct, or delete your personal data. Contact us at privacy@zorouae.com to exercise these rights." },
              { title: "7. Children's Privacy", body: "ZORO UAE is not intended for users under 18. We do not knowingly collect personal information from minors." },
              { title: "8. Contact Us", body: "For any privacy-related questions, email us at privacy@zorouae.com or write to: ZORO UAE, Dubai, United Arab Emirates." },
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
