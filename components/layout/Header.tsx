"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Menu, X, Sun, Moon, Globe, Heart,
  Bell, ChevronDown, Plus, User, LogOut, Settings,
  LayoutDashboard, Shield
} from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useTheme } from "@/lib/context/ThemeContext";
import { useAuth } from "@/lib/context/AuthContext";

export function Header() {
  const { lang, dir, t, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/listings?search=${encodeURIComponent(searchQuery)}`);
  };

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/listings", label: t("listings") },
    { href: "/categories", label: t("categories") },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--color-bg-card)] border-b border-[var(--color-border)] shadow-[var(--shadow-sm)]"
          : "bg-[var(--color-bg-card)]/80 backdrop-blur-xl border-b border-[var(--color-border)]/50"
      }`}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-18 py-3 gap-4">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center flex-shrink-0 group">
            <Image
              src="/Zoro Logo-01.png"
              alt="Zoro UAE"
              width={110}
              height={44}
              className="h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className={`hidden md:flex items-center gap-1 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                  pathname === href
                    ? "text-[var(--color-primary)] bg-[var(--color-primary-light)]"
                    : "text-[var(--color-text-sub)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-soft)]"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Search ── */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center flex-1 max-w-sm h-11 bg-[var(--color-bg-soft)] border border-[var(--color-border)] rounded-xl px-4 gap-3 focus-within:border-[var(--color-primary)] focus-within:shadow-[0_0_0_3px_rgba(238,29,35,0.1)] transition-all"
          >
            <Search size={15} className="text-[var(--color-text-muted)] flex-shrink-0" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)]"
              dir={dir}
            />
          </form>

          {/* ── Right Actions ── */}
          <div className={`flex items-center gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-soft)] transition-all"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="h-10 px-3 rounded-xl flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-soft)] transition-all text-[11px] font-black uppercase tracking-wider"
            >
              <Globe size={15} />
              {lang === "en" ? "عربي" : "EN"}
            </button>

            {/* Post Ad Button */}
            <Link
              href={user ? "/advertiser" : "/login"}
              className="hidden sm:flex btn-primary h-10 px-5 text-[10px] gap-1.5"
            >
              <Plus size={15} />
              {t("postAd")}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 h-10 pl-2 pr-3 rounded-xl hover:bg-[var(--color-bg-soft)] transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-black">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={14} className={`text-[var(--color-text-muted)] transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute top-14 ${dir === "rtl" ? "left-0" : "right-0"} w-52 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl shadow-[var(--shadow-lg)] overflow-hidden z-50`}
                    >
                      <div className="p-3 border-b border-[var(--color-border)]">
                        <p className="text-xs font-black text-[var(--color-text-main)] truncate">{user.name}</p>
                        <p className="text-[10px] text-[var(--color-text-muted)] truncate">{user.email ?? user.mobile}</p>
                      </div>
                      <div className="p-2 space-y-0.5">
                        <Link href="/advertiser" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold text-[var(--color-text-sub)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-text-main)] transition-all">
                          <LayoutDashboard size={15} /> {t("dashboard")}
                        </Link>
                        {user.type === "admin" && (
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all">
                            <Shield size={15} /> {t("admin")}
                          </Link>
                        )}
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold text-[var(--color-text-sub)] hover:bg-red-50 hover:text-red-600 transition-all"
                        >
                          <LogOut size={15} /> {t("logout")}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 h-10 px-4 rounded-xl text-[11px] font-black uppercase tracking-wider text-[var(--color-text-sub)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-text-main)] transition-all"
              >
                <User size={15} /> {t("login")}
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-text-sub)] hover:bg-[var(--color-bg-soft)] transition-all"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden"
          >
            <div className="container-main py-4 space-y-2">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex items-center gap-3 h-12 bg-[var(--color-bg-soft)] border border-[var(--color-border)] rounded-xl px-4 mb-4">
                <Search size={16} className="text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)]"
                />
              </form>

              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                    pathname === href
                      ? "text-[var(--color-primary)] bg-[var(--color-primary-light)]"
                      : "text-[var(--color-text-sub)]"
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link
                href={user ? "/advertiser" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="flex btn-primary w-full justify-center mt-4"
              >
                <Plus size={16} /> {t("postAd")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
