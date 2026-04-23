"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/lib/context/LanguageContext";
import { categoryService } from "@/lib/api/categoryService";

const EMOJI_MAP: Record<string, string> = {
  vehicles: "🚗", motors: "🚗", property: "🏠", real: "🏠",
  electronics: "📱", jobs: "💼", furniture: "🛋️", fashion: "👗",
  babies: "👶", services: "🔧", marine: "⛵", watches: "⌚",
  sports: "⚽", garden: "🌿", books: "📚", food: "🍔",
};

function getEmoji(name: string): string {
  const key = Object.keys(EMOJI_MAP).find(k => name.toLowerCase().includes(k));
  return key ? EMOJI_MAP[key] : "📦";
}

export default function CategoriesPage() {
  const { t, dir } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [query, setQuery]           = useState("");

  useEffect(() => {
    categoryService.getAll()
      .then(res => { if (res.success) setCategories(res.data ?? []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = categories.filter(c =>
    c.name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      <Header />

      <main className="pt-28 pb-24">
        <div className="container-main">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-3">Browse All</p>
            <h1 className="text-5xl font-black text-[var(--color-text-main)] tracking-tighter italic mb-6">
              All <span className="text-[var(--color-primary)]">Categories</span>
            </h1>
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search categories..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="input-field h-13 pl-11 text-sm w-full h-14 rounded-2xl"
                dir={dir}
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="card p-6 flex flex-col items-center gap-3">
                  <div className="skeleton w-16 h-16 rounded-2xl" />
                  <div className="skeleton h-4 w-20" />
                  <div className="skeleton h-3 w-14" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {filtered.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link href={`/listings?category=${cat.id}`} className="group block">
                    <div className="card p-6 flex flex-col items-center text-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-soft)] flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rounded-xl transition-all duration-300 border border-[var(--color-border)]">
                        {cat.icon ? (
                          <span className="text-2xl">{cat.icon}</span>
                        ) : (
                          <span className="text-2xl">{getEmoji(cat.name)}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                          {cat.name}
                        </h3>
                        {cat.total_item !== undefined && (
                          <p className="text-[10px] font-bold text-[var(--color-text-muted)] mt-0.5">
                            {cat.total_item} ads
                          </p>
                        )}
                      </div>
                      {/* Sub-categories */}
                      {cat.sub_categories?.length > 0 && (
                        <div className="w-full pt-2 border-t border-[var(--color-border)] space-y-1">
                          {cat.sub_categories.slice(0, 3).map((sub: any) => (
                            <Link
                              key={sub.id}
                              href={`/listings?category=${sub.id}`}
                              onClick={e => e.stopPropagation()}
                              className="flex items-center justify-between text-[10px] font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                            >
                              <span>{sub.name}</span>
                              <ChevronRight size={10} />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}

              {filtered.length === 0 && !loading && (
                <div className="col-span-full py-20 text-center text-[var(--color-text-muted)]">
                  <p className="text-sm font-bold">No categories match your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
