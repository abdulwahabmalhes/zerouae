"use client";
import React, { useState, useEffect } from "react";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin, Clock, Eye, Heart, Share2, Phone, MessageCircle,
  ShieldCheck, ChevronRight, Flag, CheckCircle, ArrowLeft, Loader2
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/lib/context/LanguageContext";
import { listingService } from "@/lib/api/listingService";
import { ListingCard } from "@/components/listings/ListingCard";

function timeAgo(d: string) {
  if (!d) return "";
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { dir } = useLanguage();

  const [listing, setListing]   = useState<any>(null);
  const [similar, setSimilar]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saved, setSaved]       = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await listingService.getListing(id);
        if (res.success) {
          setListing(res.data);
          // Register view
          listingService.registerView(Number(id)).catch(() => {});
          // Fetch similar
          const sim = await listingService.getListings({
            category_id: res.data.category_id, per_page: 4
          });
          if (sim.success) setSimilar((sim.data ?? []).filter((i: any) => i.id !== Number(id)));
        }
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)]">
        <Header />
        <div className="flex items-center justify-center min-h-[70vh]">
          <Loader2 className="animate-spin text-[var(--color-primary)]" size={48} />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)]">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center">
          <h1 className="text-3xl font-black text-[var(--color-text-main)]">Listing Not Found</h1>
          <p className="text-[var(--color-text-muted)]">This ad may have been removed or expired.</p>
          <Link href="/listings" className="btn-primary h-11 px-6 text-[10px]">Browse All Ads</Link>
        </div>
      </div>
    );
  }

  const imageBase = process.env.NEXT_PUBLIC_IMAGE_URL ?? "http://localhost:8000/storage";
  const mainImage = listing.image?.startsWith("http") ? listing.image : `${imageBase}/${listing.image}`;
  const gallery = listing.galleryImages ?? [];
  const allImages = [mainImage, ...gallery.map((g: any) => g.image?.startsWith("http") ? g.image : `${imageBase}/${g.image}`)];

  // Custom field values
  const customFields = listing.item_custom_field_values ?? [];

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      <Header />

      <main className="pt-28 pb-24">
        <div className="container-main">
          {/* Breadcrumb */}
          <nav className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-8 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
            <ChevronRight size={10} className={dir === "rtl" ? "rotate-180" : ""} />
            <Link href="/listings" className="hover:text-[var(--color-primary)] transition-colors">
              {listing.category?.name ?? "Listings"}
            </Link>
            <ChevronRight size={10} className={dir === "rtl" ? "rotate-180" : ""} />
            <span className="text-[var(--color-text-main)] truncate max-w-[200px]">{listing.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* ── Left: Images + Info ── */}
            <div className="lg:col-span-8 space-y-8">
              {/* Image Gallery */}
              <div className="card overflow-hidden">
                <div className="relative h-[420px] bg-[var(--color-bg-soft)]">
                  <Image
                    src={allImages[activeImg] ?? `https://picsum.photos/seed/${id}/800/500`}
                    alt={listing.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Actions */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => setSaved(!saved)}
                      className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all">
                      <Heart size={16} className={saved ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : "text-[var(--color-text-sub)]"} />
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all">
                      <Share2 size={16} className="text-[var(--color-text-sub)]" />
                    </button>
                  </div>
                </div>
                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="flex gap-3 p-4 overflow-x-auto hide-scrollbar">
                    {allImages.map((img, i) => (
                      <button key={i} onClick={() => setActiveImg(i)}
                        className={`relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImg === i ? "border-[var(--color-primary)]" : "border-transparent"}`}>
                        <Image src={img} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Core Info */}
              <div className="card p-8">
                <div className={`flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pb-8 border-b border-[var(--color-border)] ${dir === "rtl" ? "md:flex-row-reverse text-right" : ""}`}>
                  <div className="flex-1">
                    {listing.category && (
                      <span className="badge badge-primary text-[9px] mb-4 inline-block">{listing.category.name}</span>
                    )}
                    <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tighter leading-tight mb-4">{listing.name}</h1>
                    <div className={`flex flex-wrap items-center gap-5 text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <span className={`flex items-center gap-1.5 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                        <MapPin size={13} className="text-[var(--color-primary)]" /> {listing.address ?? "UAE"}
                      </span>
                      <span className={`flex items-center gap-1.5 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                        <Eye size={13} className="text-[var(--color-primary)]" /> {listing.total_click ?? 0} views
                      </span>
                      <span className={`flex items-center gap-1.5 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                        <Clock size={13} className="text-[var(--color-primary)]" /> {timeAgo(listing.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className={`flex flex-col ${dir === "rtl" ? "items-start" : "items-end"}`}>
                    <span className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Price</span>
                    <div className={`flex items-baseline gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <span className="text-4xl font-black text-[var(--color-text-main)] tracking-tighter">
                        {Number(listing.price ?? 0).toLocaleString()}
                      </span>
                      <span className="text-lg font-black text-[var(--color-primary)] uppercase">AED</span>
                    </div>
                  </div>
                </div>

                {/* Custom Field Specs */}
                {customFields.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-5">Specifications</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {customFields.map((cf: any) => (
                        <div key={cf.id} className={`p-4 bg-[var(--color-bg-soft)] border border-[var(--color-border)] rounded-xl ${dir === "rtl" ? "text-right" : "text-left"}`}>
                          <span className="text-[9px] font-black text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">
                            {cf.custom_field?.name}
                          </span>
                          <span className="text-sm font-black text-[var(--color-text-main)]">{cf.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {listing.description && (
                  <div className={dir === "rtl" ? "text-right" : ""}>
                    <div className={`flex items-center gap-3 mb-5 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <div className="w-1.5 h-6 bg-[var(--color-primary)] rounded-full" />
                      <h3 className="text-base font-black text-[var(--color-text-main)] uppercase tracking-widest">Description</h3>
                    </div>
                    <p className="text-[var(--color-text-sub)] font-medium leading-relaxed whitespace-pre-line">{listing.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Seller + Safety ── */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 self-start">
              {/* Seller Card */}
              <div className="card p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] mb-6">Verified Seller</p>

                  <div className={`flex items-center gap-4 mb-8 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-soft)] border border-[var(--color-border)] flex items-center justify-center text-2xl font-black text-[var(--color-primary)] relative">
                      {(listing.user?.name ?? "?").charAt(0).toUpperCase()}
                      <div className={`absolute -bottom-1 ${dir === "rtl" ? "-left-1" : "-right-1"} w-5 h-5 bg-emerald-500 rounded-full border-2 border-white`} />
                    </div>
                    <div className={dir === "rtl" ? "text-right" : ""}>
                      <h4 className="text-lg font-black text-[var(--color-text-main)] tracking-tight">{listing.user?.name ?? "Seller"}</h4>
                      <div className={`flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                        <CheckCircle size={12} strokeWidth={2.5} /> Verified Member
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setShowPhone(!showPhone)}
                      className="btn-primary w-full h-14 gap-3 text-[11px]"
                    >
                      <Phone size={18} />
                      {showPhone ? (listing.contact ?? "N/A") : "Show Phone Number"}
                    </button>
                    <button className="btn-outline w-full h-14 gap-3 text-[11px]">
                      <MessageCircle size={18} className="text-[var(--color-primary)]" />
                      Chat Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Safety Card */}
              <div className="card p-8 bg-[var(--color-bg-soft)]">
                <h4 className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-main)] mb-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <ShieldCheck size={16} className="text-[var(--color-primary)]" /> Safety Tips
                </h4>
                <ul className="space-y-3 mb-6">
                  {[
                    "Only pay after inspecting the item",
                    "Meet in a safe, public location",
                    "Verify item authenticity before paying",
                    "Report suspicious listings immediately",
                  ].map((tip, i) => (
                    <li key={i} className={`flex items-start gap-3 text-sm text-[var(--color-text-sub)] font-medium ${dir === "rtl" ? "flex-row-reverse text-right" : ""}`}>
                      <span className="text-[var(--color-primary)] font-black mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
                <button className="w-full h-11 border border-[var(--color-border)] rounded-xl text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)] hover:text-red-600 hover:border-red-400 transition-all flex items-center justify-center gap-2">
                  <Flag size={13} /> Report this Ad
                </button>
              </div>
            </aside>
          </div>

          {/* Similar Listings */}
          {similar.length > 0 && (
            <div className="mt-24 pt-16 border-t border-[var(--color-border)]">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-[var(--color-text-main)] italic tracking-tighter">
                  Similar <span className="text-[var(--color-primary)]">Listings</span>
                </h2>
                <Link href={`/listings?category=${listing.category_id}`} className="text-[11px] font-black uppercase tracking-wider text-[var(--color-text-sub)] hover:text-[var(--color-primary)] transition-colors">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similar.slice(0, 4).map((item, i) => (
                  <ListingCard key={item.id} listing={item} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
