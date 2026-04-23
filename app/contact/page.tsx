"use client";
import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";
import apiClient from "@/lib/api/apiClient";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await apiClient.post("/contact-us", form);
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch { setError("Failed to send. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      <Header />
      <main className="pt-28 pb-24">
        <div className="container-main">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-3">Get in Touch</p>
            <h1 className="text-5xl font-black text-[var(--color-text-main)] tracking-tighter italic">
              Contact <span className="text-[var(--color-primary)]">Us</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {/* Info */}
            <div className="space-y-6">
              {[
                { icon: Mail,    title: "Email",   val: "info@zorouae.com",  href: "mailto:info@zorouae.com" },
                { icon: Phone,   title: "Phone",   val: "+971 50 000 0000",  href: "tel:+971500000000" },
                { icon: MapPin,  title: "Address", val: "Dubai, UAE",        href: "#" },
              ].map(({ icon: Icon, title, val, href }) => (
                <a key={title} href={href} className="card p-6 flex items-center gap-4 hover:border-[var(--color-primary)]/30 group">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform flex-shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">{title}</p>
                    <p className="text-sm font-bold text-[var(--color-text-main)] mt-0.5">{val}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2 card p-8">
              {success ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <CheckCircle size={48} className="text-emerald-500 mb-4" />
                  <h3 className="text-lg font-black text-[var(--color-text-main)] mb-2">Message Sent!</h3>
                  <p className="text-sm text-[var(--color-text-muted)] font-medium">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSuccess(false)} className="btn-primary h-10 px-6 mt-6 text-[10px]">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Name</label>
                      <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" className="input-field h-12" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Email</label>
                      <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" className="input-field h-12" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Subject</label>
                    <input required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="How can we help?" className="input-field h-12" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Message</label>
                    <textarea rows={5} required value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Tell us more..." className="input-field py-3 resize-none w-full" />
                  </div>
                  {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
                  <button type="submit" disabled={loading} className="btn-primary h-12 px-8 gap-2">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <><Send size={16} /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
