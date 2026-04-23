"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/context/LanguageContext";
import {
  Car, Home, Smartphone, Briefcase, Package, Scissors,
  ShoppingBag, Baby, Phone, Mail, MapPin, Globe,
  Rss, Share2, ArrowRight
} from "lucide-react";

const footerCategories = [
  { icon: Car, label: "vehicles", href: "/listings?category=1" },
  { icon: Home, label: "property", href: "/listings?category=2" },
  { icon: Smartphone, label: "electronics", href: "/listings?category=3" },
  { icon: Briefcase, label: "jobs", href: "/listings?category=4" },
  { icon: Package, label: "furniture", href: "/listings?category=5" },
  { icon: ShoppingBag, label: "fashion", href: "/listings?category=6" },
];

export function Footer() {
  const { t, dir } = useLanguage();

  return (
    <footer className="bg-[var(--color-text-main)] text-white">
      {/* CTA Band */}
      <div className="border-b border-white/10">
        <div className="container-main py-12">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-6 ${dir === "rtl" ? "md:flex-row-reverse text-right" : ""}`}>
            <div>
              <h3 className="text-2xl font-black tracking-tighter mb-1">
                Start Selling <span className="text-[var(--color-primary)]">Today.</span>
              </h3>
              <p className="text-white/50 text-sm font-medium">Reach 50,000+ monthly buyers across the Emirates</p>
            </div>
            <Link href="/advertiser" className="btn-primary flex-shrink-0 gap-2">
              Post Your Free Ad <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-main py-16">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 ${dir === "rtl" ? "text-right" : ""}`}>

          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex mb-6">
              <Image
                src="/Zoro Logo-01.png"
                alt="Zoro UAE"
                width={120}
                height={48}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-white/50 text-sm font-medium leading-relaxed mb-6">
              The UAE&apos;s premier classified ads marketplace. Buy, sell, and discover everything across the Emirates.
            </p>
            <div className="flex items-center gap-3">
              {[Globe, Rss, Share2].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[var(--color-primary)] transition-all">
                  <Icon size={16} className="text-white/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6">{t("categories")}</h4>
            <div className="space-y-3">
              {footerCategories.map(({ icon: Icon, label, href }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 text-sm font-medium text-white/60 hover:text-white transition-colors group">
                  <Icon size={14} className="group-hover:text-[var(--color-primary)] transition-colors" />
                  {t(label as any)}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6">Quick Links</h4>
            <div className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Use", href: "/terms" },
                { label: "Advertiser Portal", href: "/advertiser" },
              ].map(({ label, href }) => (
                <Link key={href} href={href}
                  className="block text-sm font-medium text-white/60 hover:text-white transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6">Contact Us</h4>
            <div className="space-y-4">
              <a href="mailto:info@zorouae.com" className="flex items-center gap-3 text-sm font-medium text-white/60 hover:text-white transition-colors">
                <Mail size={15} className="text-[var(--color-primary)]" /> info@zorouae.com
              </a>
              <a href="tel:+971500000000" className="flex items-center gap-3 text-sm font-medium text-white/60 hover:text-white transition-colors">
                <Phone size={15} className="text-[var(--color-primary)]" /> +971 50 000 0000
              </a>
              <div className="flex items-center gap-3 text-sm font-medium text-white/60">
                <MapPin size={15} className="text-[var(--color-primary)] flex-shrink-0" />
                Dubai, United Arab Emirates
              </div>
            </div>

            {/* Emirates badges */}
            <div className="mt-8 flex flex-wrap gap-2">
              {["Dubai", "Abu Dhabi", "Sharjah", "Ajman"].map((e) => (
                <span key={e} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-white/40 uppercase tracking-wider">{e}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-main py-6">
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-bold text-white/30 ${dir === "rtl" ? "sm:flex-row-reverse" : ""}`}>
            <span>© {new Date().getFullYear()} ZORO UAE. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white/60 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
