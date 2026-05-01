"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Heart, Clock, Eye, Star, Verified, BadgeCheck } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";

interface ListingCardProps {
  listing: any;
  index?: number;
  viewMode?: "grid" | "list";
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function ListingCard({ listing, index = 0, viewMode = "grid" }: ListingCardProps) {
  const { lang, dir } = useLanguage();
  const [saved, setSaved] = useState(false);

  const title = listing.name ?? listing.title ?? "Untitled";
  const price = listing.price ?? 0;
  const image =
    listing.image
      ? listing.image.startsWith("http")
        ? listing.image
        : `${process.env.NEXT_PUBLIC_IMAGE_URL ?? "http://localhost:8000/storage"}/${listing.image}`
      : `https://picsum.photos/seed/${listing.id ?? index}/600/400`;
  const location = listing.address ?? listing.city?.name ?? "UAE";
  const category = listing.category?.name ?? "";
  const seller = listing.user?.name ?? "";
  const views = listing.total_click ?? listing.views ?? 0;
  const postedAt = listing.created_at ?? "";
  const isFeatured = listing.is_featured === 1;

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link href={`/listing/${listing.id}`} className="group block">
          <div className="card flex gap-5 p-4 hover:border-[var(--color-primary)]/20">
            <div className="relative w-32 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--color-bg-soft)]">
              <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {isFeatured && (
                <span className="absolute top-2 left-2 badge badge-primary text-[8px]">Featured</span>
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-black text-[var(--color-text-main)] leading-tight line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
                    {title}
                  </h3>
                  <button
                    onClick={(e) => { e.preventDefault(); setSaved(!saved); }}
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--color-bg-soft)] transition-all"
                  >
                    <Heart size={14} className={saved ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"} />
                  </button>
                </div>
                {category && <span className="badge badge-primary text-[9px] mb-2">{category}</span>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] font-bold">
                  <MapPin size={11} className="text-[var(--color-primary)]" />
                  {location}
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[var(--color-text-main)]">AED {Number(price).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link href={`/listing/${listing.id}`} className="group block h-full">
        <div className="card overflow-hidden h-full flex flex-col">
          {/* Image */}
          <div className="relative h-52 overflow-hidden bg-[var(--color-bg-soft)]">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {/* Top badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {isFeatured && (
                <span className="badge badge-warning text-[8px] shadow-sm">⭐ Featured</span>
              )}
            </div>

            {/* Save button */}
            <button
              onClick={(e) => { e.preventDefault(); setSaved(!saved); }}
              className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all"
            >
              <Heart
                size={14}
                className={saved ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : "text-[var(--color-text-sub)]"}
              />
            </button>

            {/* Price */}
            <div className="absolute bottom-3 left-3">
              <div className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-sm">
                <span className="text-sm font-black text-[var(--color-text-main)]">
                  AED {Number(price).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            {category && (
              <span className="badge badge-primary text-[8px] mb-2 w-fit">{category}</span>
            )}
            <h3 className="text-sm font-black text-[var(--color-text-main)] line-clamp-2 mb-3 leading-snug group-hover:text-[var(--color-primary)] transition-colors flex-1">
              {title}
            </h3>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] mt-auto">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-text-muted)]">
                <MapPin size={11} className="text-[var(--color-primary)]" />
                <span className="truncate max-w-[100px]">{location}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold text-[var(--color-text-muted)]">
                {views > 0 && (
                  <span className="flex items-center gap-1">
                    <Eye size={11} /> {views}
                  </span>
                )}
                {postedAt && (
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {timeAgo(postedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
