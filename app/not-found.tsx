"use client";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
        <div className="text-[120px] font-black text-[var(--color-primary)] leading-none tracking-tighter mb-6 select-none">
          404
        </div>
        <h1 className="text-3xl font-black text-[var(--color-text-main)] italic tracking-tighter mb-3">
          Page Not Found
        </h1>
        <p className="text-[var(--color-text-muted)] font-medium max-w-sm mb-10">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="btn-primary h-12 px-8 text-[11px]">← Back to Home</Link>
      </div>
    </div>
  );
}
