"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, Lock, Eye, EyeOff, Loader2, ChevronRight, ArrowLeft, UserPlus } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useAuth } from "@/lib/context/AuthContext";
import { authService } from "@/lib/api/authService";

export default function RegisterPage() {
  const { t, dir } = useLanguage();
  const { login }  = useAuth();
  const router     = useRouter();

  const [form, setForm]       = useState({ name: "", email: "", mobile: "", password: "", password_confirmation: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) return setError("Passwords do not match");
    setLoading(true); setError("");
    try {
      const res = await authService.register(form);
      if (res.success && res.token) {
        login(res.token, res.data);
        router.push("/advertiser");
      } else setError(res.message ?? "Registration failed");
    } catch { setError("Network error. Is the backend running?"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--color-text-main)] relative overflow-hidden flex-col items-center justify-center p-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 text-center">
          <Link href="/" className="inline-flex mb-16">
            <Image
              src="/Zoro Logo-01.png"
              alt="Zoro UAE"
              width={140}
              height={56}
              className="h-14 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <h2 className="text-4xl font-black text-white tracking-tighter leading-tight mb-6">
            Join the UAE&apos;s <span className="text-[var(--color-primary)] italic">#1</span><br />Marketplace
          </h2>
          <p className="text-white/50 font-medium leading-relaxed max-w-sm mx-auto">
            Post unlimited ads, reach verified buyers, and grow your business across all 7 Emirates.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4">
            {[["Free","Account"],["Instant","Posting"],["50K+","Buyers"]].map(([n,l]) => (
              <div key={l} className="p-5 bg-white/5 rounded-2xl">
                <div className="text-lg font-black text-white tracking-tighter">{n}</div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex mb-10 lg:hidden">
            <Image
              src="/Zoro Logo-01.png"
              alt="Zoro UAE"
              width={100}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </Link>

          <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tighter mb-2">Create Account</h1>
          <p className="text-[var(--color-text-muted)] font-medium mb-10">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--color-primary)] font-black hover:underline">{t("signIn")}</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Full Name</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                placeholder="Your full name" className="input-field h-13 h-12" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">{t("email")}</label>
                <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="you@example.com" className="input-field h-12" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">{t("phoneNumber")}</label>
                <input type="tel" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})}
                  placeholder="+971 50 000 0000" className="input-field h-12" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">{t("password")}</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required minLength={6}
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="Min. 6 characters" className="input-field h-12 pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors">
                  {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Confirm Password</label>
              <input type="password" required value={form.password_confirmation}
                onChange={e => setForm({...form, password_confirmation: e.target.value})}
                placeholder="Repeat your password" className="input-field h-12" />
            </div>

            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full h-14 gap-2 mt-2">
              {loading ? <Loader2 className="animate-spin" size={20}/> : <><UserPlus size={18}/> Create Account</>}
            </button>

            <p className="text-center text-xs text-[var(--color-text-muted)] font-medium leading-relaxed">
              By registering, you agree to our{" "}
              <Link href="/terms" className="text-[var(--color-primary)] hover:underline">Terms</Link> and{" "}
              <Link href="/privacy" className="text-[var(--color-primary)] hover:underline">Privacy Policy</Link>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
