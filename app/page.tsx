"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, ChevronRight, ChevronLeft,
  ArrowRight, Star, TrendingUp, Shield, Zap,
  Car, Home, Smartphone, Briefcase, Package,
  ShoppingBag, Baby, Scissors,
} from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { listingService } from "@/lib/api/listingService";
import { ListingCard } from "@/components/listings/ListingCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DEMO_LISTINGS, HERO_SLIDES } from "@/lib/data/demoData";

const CATEGORIES = [
  { id: 1, key: "vehicles",    icon: Car,         color: "bg-blue-50   text-blue-600"   },
  { id: 2, key: "property",    icon: Home,        color: "bg-emerald-50 text-emerald-600" },
  { id: 3, key: "electronics", icon: Smartphone,  color: "bg-orange-50 text-orange-600" },
  { id: 4, key: "jobs",        icon: Briefcase,   color: "bg-purple-50 text-purple-600" },
  { id: 5, key: "furniture",   icon: Package,     color: "bg-amber-50  text-amber-600"  },
  { id: 6, key: "fashion",     icon: ShoppingBag, color: "bg-pink-50   text-pink-600"   },
  { id: 7, key: "babies",      icon: Baby,        color: "bg-sky-50    text-sky-600"    },
  { id: 8, key: "services",    icon: Scissors,    color: "bg-red-50    text-red-600"    },
];

const STATS = [
  { num: "50K+", label: "Monthly Visitors" },
  { num: "18K+", label: "Live Listings" },
  { num: "7",    label: "Emirates Covered" },
  { num: "99%",  label: "Verified Users" },
];

// ─── Hero Section with Image Slider ─────────────────────────────────────────
function HeroSection() {
  const { t, dir } = useLanguage();
  const router = useRouter();
  const [query, setQuery]       = useState("");
  const [emirate, setEmirate]   = useState("");
  const [slide, setSlide]       = useState(0);
  const [prevSlide, setPrevSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  // Auto-advance slides
  useEffect(() => {
    const id = setInterval(() => {
      setPrevSlide(slide);
      setDirection(1);
      setSlide(s => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slide]);

  const goTo = (idx: number) => {
    setDirection(idx > slide ? 1 : -1);
    setPrevSlide(slide);
    setSlide(idx);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (emirate)      params.set("city", emirate);
    router.push(`/listings?${params.toString()}`);
  };

  const current = HERO_SLIDES[slide];

  return (
    <section className="relative min-h-[92vh] flex items-end overflow-hidden pt-16">
      {/* ── Background Image ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={current.image}
            alt={current.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ── Content ── */}
      <div className="container-main relative z-10 pb-28 pt-20 w-full">
        <div className="max-w-3xl">
          {/* Slide Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`badge-${slide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] rounded-full mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white">
                {current.badge}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Headline */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${slide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.95] mb-5 whitespace-pre-line"
            >
              {current.title.split("\n").map((line, i) =>
                i === 1
                  ? <span key={i}><br /><span className="text-[var(--color-primary)] italic">{line}</span></span>
                  : <span key={i}>{line}</span>
              )}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${slide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-lg text-white/70 font-medium mb-10 max-w-lg"
            >
              {current.subtitle}
            </motion.p>
          </AnimatePresence>

          {/* Search Box */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-2 p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-2xl"
          >
            <div className="flex items-center flex-1 gap-3 px-4 h-14 bg-white/10 rounded-xl">
              <Search size={18} className="text-[var(--color-primary)] flex-shrink-0" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-white placeholder:text-white/50"
                dir={dir}
              />
            </div>
            <div className="hidden sm:flex items-center gap-3 px-4 h-14 bg-white/10 rounded-xl min-w-[155px]">
              <MapPin size={15} className="text-white/50 flex-shrink-0" />
              <select
                value={emirate}
                onChange={e => setEmirate(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-wider text-white cursor-pointer appearance-none"
              >
                <option value="" className="text-black">{t("allEmirates")}</option>
                {["Dubai","Abu Dhabi","Sharjah","Ajman","RAK","Fujairah","UAQ"].map(e => (
                  <option key={e} value={e} className="text-black">{e}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary px-8 h-14 text-[11px] flex-shrink-0">
              {t("search")}
            </button>
          </motion.form>

          {/* Quick Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {CATEGORIES.slice(0, 5).map(cat => (
              <Link key={cat.id} href={`/listings?category=${cat.id}`}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/20 hover:border-white/30 transition-all text-[10px] font-black uppercase tracking-wider text-white/80 hover:text-white group">
                <cat.icon size={13} className="group-hover:scale-110 transition-transform" />
                {t(cat.key as any)}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Slide Controls ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${i === slide ? "w-8 h-2.5 bg-[var(--color-primary)]" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"}`}
          />
        ))}
      </div>

      {/* Prev/Next */}
      {[{d:"left",idx:(slide-1+HERO_SLIDES.length)%HERO_SLIDES.length},{d:"right",idx:(slide+1)%HERO_SLIDES.length}].map(({d,idx})=>(
        <button key={d} onClick={() => goTo(idx)}
          className={`absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all ${d==="left"?"left-6":"right-6"}`}>
          {d==="left" ? <ChevronLeft size={22}/> : <ChevronRight size={22}/>}
        </button>
      ))}

      {/* Stats Bar */}
      <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-md border-t border-white/10 z-10">
        <div className="container-main">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
            {STATS.map(({ num, label }) => (
              <div key={label} className="py-4 text-center">
                <div className="text-xl font-black text-white tracking-tighter">{num}</div>
                <div className="text-[9px] font-bold text-white/40 uppercase tracking-wider mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Category Grid ─────────────────────────────────────────────────────────
function CategoryGrid() {
  const { t, dir } = useLanguage();

  return (
    <section className="py-24 bg-[var(--color-bg-page)]">
      <div className="container-main">
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 ${dir==="rtl"?"md:flex-row-reverse":""}`}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--color-primary)] mb-3">Browse by Category</p>
            <h2 className="text-4xl font-black text-[var(--color-text-main)] tracking-tighter">
              {dir==="rtl"?<>تصفح حسب <span className="text-[var(--color-primary)] italic">الفئة</span></>:<>Explore by <span className="text-[var(--color-primary)] italic">Category</span></>}
            </h2>
          </div>
          <Link href="/categories" className="btn-outline h-11 px-6 text-[10px]">{t("viewAll")} →</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link href={`/listings?category=${cat.id}`} className="group block">
                <div className="card p-6 flex flex-col items-center text-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center group-hover:scale-110 group-hover:rounded-xl transition-all duration-300`}>
                    <cat.icon size={28} />
                  </div>
                  <h3 className="text-sm font-black text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                    {t(cat.key as any)}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Featured Listings (with Demo fallback) ─────────────────────────────────
function FeaturedListings() {
  const { dir } = useLanguage();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listingService.getListings({ per_page: 10 })
      .then(res => setItems(res.success && res.data?.length ? res.data : DEMO_LISTINGS))
      .catch(() => setItems(DEMO_LISTINGS))
      .finally(() => setLoading(false));
  }, []);

  const scroll = (d: "left"|"right") =>
    scrollRef.current?.scrollBy({ left: d==="left"?-420:420, behavior:"smooth" });

  return (
    <section className="py-24 bg-[var(--color-bg-card)]">
      <div className="container-main">
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 ${dir==="rtl"?"md:flex-row-reverse":""}`}>
          <div>
            <div className={`flex items-center gap-3 mb-3 ${dir==="rtl"?"flex-row-reverse":""}`}>
              <span className="w-8 h-px bg-[var(--color-primary)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--color-primary)]">Handpicked</span>
            </div>
            <h2 className="text-4xl font-black text-[var(--color-text-main)] tracking-tighter italic">
              Featured <span className="text-[var(--color-primary)]">Listings.</span>
            </h2>
          </div>
          <div className={`flex items-center gap-3 ${dir==="rtl"?"flex-row-reverse":""}`}>
            <Link href="/listings" className="text-[11px] font-black uppercase tracking-wider text-[var(--color-text-sub)] hover:text-[var(--color-primary)] transition-colors border-b border-transparent hover:border-[var(--color-primary)] pb-0.5">
              View All →
            </Link>
            <div className="flex gap-2">
              {(["left","right"] as const).map(d => (
                <button key={d} onClick={() => scroll(d)}
                  className="w-11 h-11 rounded-xl bg-[var(--color-bg-soft)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 transition-all active:scale-95">
                  {d==="left" ? <ChevronLeft size={18}/> : <ChevronRight size={18}/>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 snap-x">
          {loading
            ? Array.from({length:4}).map((_,i)=>(
                <div key={i} className="flex-shrink-0 w-72 snap-start">
                  <div className="card overflow-hidden">
                    <div className="skeleton h-48"/>
                    <div className="p-4 space-y-3"><div className="skeleton h-4 w-3/4"/><div className="skeleton h-4 w-1/2"/></div>
                  </div>
                </div>
              ))
            : items.map((item,i)=>(
                <div key={item.id} className="flex-shrink-0 w-72 snap-start">
                  <ListingCard listing={item} index={i}/>
                </div>
              ))
          }
        </div>
      </div>
    </section>
  );
}

// ─── Why Section ────────────────────────────────────────────────────────────
function WhySection() {
  const features = [
    { icon: Shield,    title: "Verified Listings",    desc: "Every ad is manually reviewed to ensure quality and authenticity." },
    { icon: Zap,       title: "Instant Posting",      desc: "Post your ad in under 2 minutes and reach thousands of buyers." },
    { icon: TrendingUp,title: "Real-Time Analytics",  desc: "Track views, clicks and enquiries on your ads in real time." },
    { icon: Star,      title: "Premium Placements",   desc: "Boost your listing to the top for maximum visibility." },
  ];

  return (
    <section className="py-24 bg-[var(--color-bg-page)]">
      <div className="container-main">
        <div className="text-center mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--color-primary)] mb-3">Why Choose Us</p>
          <h2 className="text-4xl font-black text-[var(--color-text-main)] tracking-tighter">
            The Smarter Way to <span className="text-[var(--color-primary)] italic">Buy &amp; Sell</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card p-8 text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icon size={24}/>
              </div>
              <h3 className="text-sm font-black text-[var(--color-text-main)] mb-3">{title}</h3>
              <p className="text-sm text-[var(--color-text-sub)] font-medium leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl overflow-hidden relative"
        >
          <Image
            src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1400&q=80"
            alt="Post your ad"
            width={1400} height={400}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between gap-8 p-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--color-primary)] mb-3">Get Started Free</p>
              <h3 className="text-3xl font-black text-white tracking-tighter">
                Ready to Sell <span className="text-[var(--color-primary)]">Today?</span>
              </h3>
              <p className="text-white/50 font-medium mt-2 max-w-md">Join 50,000+ sellers. No listing fees for your first ad.</p>
            </div>
            <Link href="/advertiser" className="btn-primary text-sm px-8 py-4 h-auto flex-shrink-0 gap-2">
              Post Your Free Ad <ArrowRight size={18}/>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Latest Listings (with Demo fallback) ────────────────────────────────────
function LatestListings() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { dir } = useLanguage();

  useEffect(() => {
    listingService.getListings({ per_page: 8, sort: "newest" })
      .then(res => setItems(res.success && res.data?.length ? res.data : DEMO_LISTINGS.slice(0,8)))
      .catch(() => setItems(DEMO_LISTINGS.slice(0,8)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 bg-[var(--color-bg-card)]">
      <div className="container-main">
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 ${dir==="rtl"?"md:flex-row-reverse":""}`}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--color-primary)] mb-3">Just Added</p>
            <h2 className="text-4xl font-black text-[var(--color-text-main)] tracking-tighter italic">
              Latest <span className="text-[var(--color-primary)]">Ads.</span>
            </h2>
          </div>
          <Link href="/listings" className="btn-outline h-11 px-6 text-[10px]">Browse All →</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({length:8}).map((_,i)=>(
              <div key={i} className="card overflow-hidden">
                <div className="skeleton h-44"/>
                <div className="p-4 space-y-3"><div className="skeleton h-4 w-3/4"/><div className="skeleton h-4 w-1/2"/></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item,i) => <ListingCard key={item.id} listing={item} index={i}/>)}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header/>
      <main>
        <HeroSection/>
        <CategoryGrid/>
        <FeaturedListings/>
        <WhySection/>
        <LatestListings/>
      </main>
      <Footer/>
    </div>
  );
}
