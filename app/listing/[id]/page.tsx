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
          listingService.registerView(Number(id)).catch(() => {});
          const sim = await listingService.getListings({ category_id: res.data.category_id, per_page: 4 });
          if (sim.success) setSimilar((sim.data ?? []).filter((i: any) => i.id !== Number(id)));
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      <Header /><div className="flex items-center justify-center min-h-[70vh]"><Loader2 className="animate-spin text-[var(--color-primary)]" size={48} /></div>
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <h1 className="text-3xl font-black">Listing Not Found</h1>
        <Link href="/listings" className="btn-primary h-11 px-6">Browse All Ads</Link>
      </div>
    </div>
  );

  const imageBase = "http://127.0.0.1:8000/storage/";
  const getFullImg = (path: string | null) => {
    if (!path) return "https://picsum.photos/seed/zoro/800/600";
    if (path.startsWith("http")) return path;
    const cleanPath = path.replace(/^storage\//, "");
    return imageBase + cleanPath;
  };

  const mainImage = getFullImg(listing.image);
  const gallery = listing.images ?? [];
  const allImages = [mainImage, ...gallery.map((g: any) => getFullImg(g.image))];

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      <Header />
      <main className="pt-28 pb-24">
        <div className="container-main">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-8">
            <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
            <ChevronRight size={10} />
            <Link href="/listings" className="hover:text-[var(--color-primary)]">Listings</Link>
            <ChevronRight size={10} />
            <span className="text-[var(--color-text-main)] truncate max-w-[200px]">{listing.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Main Image */}
              <div className="card aspect-[4/3] relative overflow-hidden bg-[var(--color-bg-soft)]">
                <img src={allImages[activeImg]} alt="" className="w-full h-full object-contain" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => setSaved(!saved)} className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center shadow-sm">
                    <Heart size={18} className={saved ? "fill-red-500 text-red-500" : "text-slate-600"} />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center shadow-sm text-slate-600"><Share2 size={18} /></button>
                </div>
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} className={`relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 ${activeImg === i ? "border-[var(--color-primary)]" : "border-transparent"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Specifications */}
              {listing.custom_field_values?.length > 0 && (
                <div className="card p-8">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6">Specifications</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {listing.custom_field_values.map((cf: any) => (
                      <div key={cf.id}>
                        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase">{cf.custom_field?.name}</p>
                        <p className="text-sm font-black">{cf.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="card p-8">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6">Description</h3>
                <p className="text-[var(--color-text-sub)] whitespace-pre-line">{listing.description}</p>
              </div>
            </div>

            {/* Right Column */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="card p-8">
                <p className="text-[10px] font-black uppercase text-[var(--color-primary)] mb-6">Verified Seller</p>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl font-black text-[var(--color-primary)]">
                    {listing.user?.name?.[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-lg font-black">{listing.user?.name}</h4>
                    <p className="text-[10px] font-black text-emerald-600 uppercase">Verified Member</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <button onClick={() => setShowPhone(!showPhone)} className="btn-primary w-full h-14 gap-3 text-[11px]">
                    <Phone size={18} /> {showPhone ? listing.contact : "Show Phone Number"}
                  </button>
                  <button className="btn-outline w-full h-14 gap-3 text-[11px]"><MessageCircle size={18} /> Chat Now</button>
                </div>
              </div>
            </aside>
          </div>

          {/* Similar */}
          {similar.length > 0 && (
            <div className="mt-24">
              <h2 className="text-2xl font-black mb-8 italic">Similar <span className="text-[var(--color-primary)]">Ads</span></h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similar.map((item, i) => <ListingCard key={item.id} listing={item} index={i} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
