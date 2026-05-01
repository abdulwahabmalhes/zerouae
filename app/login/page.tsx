"use client";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, Lock, Eye, EyeOff, Loader2, ChevronRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useAuth } from "@/lib/context/AuthContext";
import { authService } from "@/lib/api/authService";

type Step = "method" | "phone_input" | "otp" | "email";

function LoginContent() {
  const { t, dir } = useLanguage();
  const { login }   = useAuth();
  const router      = useRouter();
  const searchParams = useSearchParams();
  const redirectTo  = searchParams.get("redirect") ?? null;

  const getRedirect = (type: string) =>
    redirectTo ?? (type === "admin" ? "/admin" : "/advertiser");

  const [step, setStep]           = useState<Step>("method");
  const [phone, setPhone]         = useState("");
  const [otp, setOtp]             = useState(["", "", "", "", "", ""]);
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  // ── OTP helpers ──────────────────────────────────────────
  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      (document.getElementById(`otp-${i + 1}`) as HTMLInputElement)?.focus();
    }
  };

  // ── Handlers ─────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!phone.trim()) return setError("Please enter your phone number");
    setLoading(true); setError("");
    try {
      const res = await authService.requestOtp(phone);
      if (res.success) { setStep("otp"); }
      else setError(res.message ?? "Failed to send OTP");
    } catch { setError("Network error. Is the backend running?"); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) return setError("Enter the full 6-digit code");
    setLoading(true); setError("");
    try {
      const res = await authService.verifyOtp(phone, code);
      if (res.success && res.token) {
        login(res.token, res.data);
        router.push(getRedirect(res.data?.type));
      } else setError(res.message ?? "Invalid OTP");
    } catch { setError("Verification failed"); }
    finally { setLoading(false); }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await authService.loginEmail(email, password);
      if (res.success && res.token) {
        login(res.token, res.data);
        router.push(getRedirect(res.data?.type));
      } else setError(res.message ?? "Invalid credentials");
    } catch { setError("Login failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] flex">
      {/* Left Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--color-text-main)] relative overflow-hidden flex-col items-center justify-center p-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 text-center">
          {/* Logo */}
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
            Welcome Back to<br />
            <span className="text-[var(--color-primary)] italic">UAE&apos;s #1</span><br />
            Marketplace
          </h2>
          <p className="text-white/50 font-medium leading-relaxed max-w-sm mx-auto">
            Buy and sell cars, properties, electronics, jobs, and more — trusted by thousands across the Emirates.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {[["50K+","Buyers"],["18K+","Live Ads"],["7","Emirates"]].map(([n,l]) => (
              <div key={l} className="p-5 bg-white/5 rounded-2xl">
                <div className="text-xl font-black text-white tracking-tighter">{n}</div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="inline-flex mb-10 lg:hidden">
            <Image
              src="/Zoro Logo-01.png"
              alt="Zoro UAE"
              width={100}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </Link>

          <AnimatePresence mode="wait">

            {/* Method Selection */}
            {step === "method" && (
              <motion.div key="method" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tighter mb-2">Sign in</h1>
                <p className="text-[var(--color-text-muted)] font-medium mb-10">Choose how to continue</p>

                <div className="space-y-4">
                  <button onClick={() => setStep("phone_input")}
                    className="w-full h-16 flex items-center justify-between px-6 bg-[var(--color-bg-card)] border-2 border-[var(--color-border)] rounded-2xl hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center">
                        <Phone size={18} className="text-[var(--color-primary)]" />
                      </div>
                      <div className={dir === "rtl" ? "text-right" : ""}>
                        <div className="text-sm font-black text-[var(--color-text-main)]">Mobile Number</div>
                        <div className="text-[10px] font-bold text-[var(--color-text-muted)]">Login with OTP</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                  </button>

                  <button onClick={() => setStep("email")}
                    className="w-full h-16 flex items-center justify-between px-6 bg-[var(--color-bg-card)] border-2 border-[var(--color-border)] rounded-2xl hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-soft)] flex items-center justify-center">
                        <Mail size={18} className="text-[var(--color-text-sub)]" />
                      </div>
                      <div className={dir === "rtl" ? "text-right" : ""}>
                        <div className="text-sm font-black text-[var(--color-text-main)]">Email & Password</div>
                        <div className="text-[10px] font-bold text-[var(--color-text-muted)]">Classic login</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                  </button>
                </div>

                <p className="text-center text-sm text-[var(--color-text-muted)] font-medium mt-8">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-[var(--color-primary)] font-black hover:underline">Sign Up</Link>
                </p>
              </motion.div>
            )}

            {/* Phone Input */}
            {step === "phone_input" && (
              <motion.div key="phone" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <button onClick={() => setStep("method")} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors mb-8">
                  <ArrowLeft size={14} /> Back
                </button>
                <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tighter mb-2">Enter Your Number</h1>
                <p className="text-[var(--color-text-muted)] font-medium mb-10">We&apos;ll send a 6-digit OTP to verify</p>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-14 w-20 flex items-center justify-center bg-[var(--color-bg-soft)] border border-[var(--color-border)] rounded-xl text-sm font-black text-[var(--color-text-sub)]">
                      🇦🇪 +971
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                      placeholder="50 000 0000"
                      className="input-field flex-1 h-14 text-base"
                      autoFocus
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
                  <button onClick={handleSendOtp} disabled={loading} className="btn-primary w-full h-14">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Send OTP →"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* OTP Verify */}
            {step === "otp" && (
              <motion.div key="otp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <button onClick={() => setStep("phone_input")} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors mb-8">
                  <ArrowLeft size={14} /> Back
                </button>
                <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tighter mb-2">Enter OTP</h1>
                <p className="text-[var(--color-text-muted)] font-medium mb-10">
                  Code sent to <span className="font-black text-[var(--color-text-main)]">+971 {phone}</span>
                </p>

                <div className="flex gap-3 mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !digit && i > 0)
                          (document.getElementById(`otp-${i - 1}`) as HTMLInputElement)?.focus();
                      }}
                      className="w-full h-16 text-center text-xl font-black border-2 border-[var(--color-border)] rounded-xl bg-[var(--color-bg-soft)] focus:border-[var(--color-primary)] outline-none transition-all"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                {error && <p className="text-red-500 text-sm font-bold mb-4">{error}</p>}
                <button onClick={handleVerifyOtp} disabled={loading} className="btn-primary w-full h-14 mb-4">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify & Sign In →"}
                </button>
                <button onClick={handleSendOtp} className="w-full text-center text-sm text-[var(--color-text-muted)] font-bold hover:text-[var(--color-primary)] transition-colors">
                  Resend OTP
                </button>
              </motion.div>
            )}

            {/* Email Login */}
            {step === "email" && (
              <motion.div key="email" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <button onClick={() => setStep("method")} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors mb-8">
                  <ArrowLeft size={14} /> Back
                </button>
                <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tighter mb-2">Sign In</h1>
                <p className="text-[var(--color-text-muted)] font-medium mb-10">Enter your credentials</p>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">{t("email")}</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                      placeholder="you@example.com" className="input-field h-14" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">{t("password")}</label>
                    <div className="relative">
                      <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                        placeholder="••••••••" className="input-field h-14 pr-12" />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors">
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
                  <button type="submit" disabled={loading} className="btn-primary w-full h-14">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : `${t("signIn")} →`}
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--color-bg-page)] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
