"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Grid, List, X, ChevronDown,
  Loader2, SlidersHorizontal, MapPin
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ListingCard } from "@/components/listings/ListingCard";
import { useLanguage } from "@/lib/context/LanguageContext";
import { listingService } from "@/lib/api/listingService";
import { categoryService } from "@/lib/api/categoryService";
import { CATEGORY_FILTER_FIELDS } from "@/lib/data/categoryFields";
import { DynamicFields } from "@/components/ui/DynamicFields";

const EMIRATES = ["Dubai","Abu Dhabi","Sharjah","Ajman","RAK","Fujairah","UAQ"];

function ListingsContent() {
  const { t, dir } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [items, setItems]         = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [viewMode, setViewMode]   = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    search:      searchParams.get("search") ?? "",
    category_id: searchParams.get("category") ? Number(searchParams.get("category")) : undefined as number | undefined,
    city:        searchParams.get("city") ?? "",
    min_price:   searchParams.get("min_price") ? Number(searchParams.get("min_price")) : undefined as number | undefined,
    max_price:   searchParams.get("max_price") ? Number(searchParams.get("max_price")) : undefined as number | undefined,
    sort:        (searchParams.get("sort") ?? "newest") as "newest" | "price_asc" | "price_desc",
  });
  const [dynamicFilters, setDynamicFilters] = useState<Record<string, string>>({});

  const catFilterFields = filters.category_id ? (CATEGORY_FILTER_FIELDS[filters.category_id] ?? []) : [];

  useEffect(() => {
    categoryService.getAll()
      .then((res) => { if (res.success) setCategories(res.data ?? []); })
      .catch(() => {});
  }, []);

  useEffect(() => { fetchListings(); }, []);

  const fetchListings = async (overrides?: Partial<typeof filters>) => {
    setLoading(true);
    const params = { ...filters, ...overrides };
    try {
      const res = await listingService.getListings({
        search:      params.search || undefined,
        category_id: params.category_id,
        min_price:   params.min_price,
        max_price:   params.max_price,
        sort:        params.sort,
      });
      if (res.success) {
        setItems(res.data ?? []);
        setTotalCount((res.data ?? []).length);
      }
    } catch {}
    finally { setLoading(false); }
  };

  const applyFilters = () => {
    fetchListings();
    setFilterOpen(false);
  };

  const resetFilters = () => {
    const clean = { search: "", category_id: undefined, city: "", min_price: undefined, max_price: undefined, sort: "newest" as const };
    setFilters(clean);
    setDynamicFilters({});
    fetchListings(clean);
  };

  const updateFilter = (key: keyof typeof filters, value: any) => {
    if (key === "category_id") setDynamicFilters({});
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      <Header />

      <main className="pt-28 pb-24">
        <div className="container-main">

          {/* ── Page Header ── */}
          <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 ${dir === "rtl" ? "md:flex-row-reverse" : ""}`}>
            <div>
              <nav className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <a href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</a>
                <span>/</span>
                <span className="text-[var(--color-text-main)]">{t("listings")}</span>
              </nav>
              <h1 className="text-4xl md:text-5xl font-black text-[var(--color-text-main)] tracking-tighter leading-none">
                UAE <span className="text-[var(--color-primary)] italic">Listings</span>
              </h1>
              {!loading && (
                <p className="text-sm text-[var(--color-text-muted)] font-medium mt-2">
                  {totalCount} results found
                </p>
              )}
            </div>

            {/* Controls */}
            <div className={`flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              {/* Sort */}
              <div className="relative flex items-center gap-2 h-11 px-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl">
                <ChevronDown size={14} className="text-[var(--color-text-muted)]" />
                <select
                  value={filters.sort}
                  onChange={(e) => { updateFilter("sort", e.target.value); fetchListings({ sort: e.target.value as any }); }}
                  className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-wider text-[var(--color-text-main)] cursor-pointer appearance-none pr-1"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price ↑</option>
                  <option value="price_desc">Price ↓</option>
                </select>
              </div>

              {/* View toggle */}
              <div className="flex bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-1 gap-0.5">
                {(["grid", "list"] as const).map((v) => (
                  <button key={v} onClick={() => setViewMode(v)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${viewMode === v ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"}`}>
                    {v === "grid" ? <Grid size={16} /> : <List size={16} />}
                  </button>
                ))}
              </div>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 h-11 px-4 bg-[var(--color-primary)] text-white rounded-xl text-[11px] font-black uppercase tracking-wider"
              >
                <SlidersHorizontal size={15} /> Filters
              </button>
            </div>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${dir === "rtl" ? "lg:grid-flow-dense" : ""}`}>

            {/* ── Sidebar Filters (Desktop) ── */}
            <aside className={`hidden lg:block ${dir === "rtl" ? "lg:col-start-10 lg:col-span-3" : "lg:col-span-3"}`}>
              <FilterPanel
                filters={filters}
                categories={categories}
                dynamicFilters={dynamicFilters}
                catFilterFields={catFilterFields}
                onUpdate={updateFilter}
                onDynUpdate={(k: string, v: string) => setDynamicFilters(p => ({...p, [k]: v}))}
                onApply={applyFilters}
                onReset={resetFilters}
              />
            </aside>

            {/* ── Mobile Filter Drawer ── */}
            <AnimatePresence>
              {filterOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                    onClick={() => setFilterOpen(false)}
                  />
                  <motion.div
                    initial={{ x: dir === "rtl" ? "100%" : "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: dir === "rtl" ? "100%" : "-100%" }}
                    transition={{ type: "spring", damping: 25 }}
                    className={`fixed top-0 ${dir === "rtl" ? "right-0" : "left-0"} bottom-0 w-80 bg-[var(--color-bg-card)] z-50 overflow-y-auto shadow-2xl lg:hidden`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-[var(--color-text-main)] uppercase tracking-wider">Filters</h3>
                        <button onClick={() => setFilterOpen(false)} className="w-9 h-9 rounded-xl bg-[var(--color-bg-soft)] flex items-center justify-center text-[var(--color-text-muted)]">
                          <X size={18} />
                        </button>
                      </div>
                      <FilterPanel
                        filters={filters}
                        categories={categories}
                        dynamicFilters={dynamicFilters}
                        catFilterFields={catFilterFields}
                        onUpdate={updateFilter}
                        onDynUpdate={(k: string, v: string) => setDynamicFilters(p => ({...p, [k]: v}))}
                        onApply={() => { applyFilters(); setFilterOpen(false); }}
                        onReset={resetFilters}
                      />
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* ── Results ── */}
            <div className={`${dir === "rtl" ? "lg:col-start-1 lg:col-span-9" : "lg:col-span-9"}`}>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-40">
                    <Loader2 className="animate-spin text-[var(--color-primary)] mb-4" size={40} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-text-muted)]">Finding listings...</p>
                  </motion.div>
                ) : items.length > 0 ? (
                  <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className={viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "flex flex-col gap-4"}>
                    {items.map((item, i) => (
                      <ListingCard key={item.id} listing={item} index={i} viewMode={viewMode} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-[var(--color-border)] rounded-3xl text-center">
                    <Search size={48} className="text-[var(--color-text-muted)] mb-4" strokeWidth={1} />
                    <h3 className="text-xl font-black text-[var(--color-text-main)] italic mb-2">{t("noResults")}</h3>
                    <p className="text-[var(--color-text-muted)] text-sm font-medium mb-6">Try adjusting your filters</p>
                    <button onClick={resetFilters} className="btn-primary h-11 px-6 text-[10px]">{t("resetFilters")}</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────
function FilterPanel({ filters, categories, dynamicFilters, catFilterFields, onUpdate, onDynUpdate, onApply, onReset }: any) {
  const { dir } = useLanguage();
  const selectedCat = categories.find((c: any) => c.id === filters.category_id);

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6 sticky top-28">
      <div className={`flex items-center justify-between ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-text-main)]">Refine Results</h3>
        <button onClick={onReset} className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-wider hover:underline">Reset</button>
      </div>

      {/* Keyword */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Keyword</label>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onUpdate("search", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onApply()}
            placeholder="e.g. iPhone 15..."
            className="input-field pl-9 h-11 text-sm"
            dir={dir}
          />
        </div>
      </div>

      {/* Category */}
      {categories.length > 0 && (
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Category</label>
          <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
            <label className={`flex items-center gap-3 cursor-pointer group ${dir === "rtl" ? "flex-row-reverse" : ""}`}
              onClick={() => onUpdate("category_id", undefined)}>
              <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center flex-shrink-0 ${!filters.category_id ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-[var(--color-border-dark)]"}`}>
                {!filters.category_id && <div className="w-2 h-2 bg-white rounded-sm" />}
              </div>
              <span className="text-sm font-bold text-[var(--color-text-sub)] group-hover:text-[var(--color-text-main)] transition-colors">All Categories</span>
            </label>
            {categories.map((cat: any) => (
              <label key={cat.id} className={`flex items-center gap-3 cursor-pointer group ${dir === "rtl" ? "flex-row-reverse" : ""}`}
                onClick={() => onUpdate("category_id", filters.category_id === cat.id ? undefined : cat.id)}>
                <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center flex-shrink-0 ${filters.category_id === cat.id ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-[var(--color-border-dark)] group-hover:border-[var(--color-primary)]"}`}>
                  {filters.category_id === cat.id && <div className="w-2 h-2 bg-white rounded-sm" />}
                </div>
                <span className={`text-sm font-bold transition-colors ${filters.category_id === cat.id ? "text-[var(--color-primary)]" : "text-[var(--color-text-sub)] group-hover:text-[var(--color-text-main)]"}`}>
                  {cat.icon ? `${cat.icon} ` : ""}{cat.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── Dynamic Category-Specific Filters ── */}
      {catFilterFields.length > 0 && (
        <div className="border-t border-[var(--color-border)] pt-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-[var(--color-primary)] rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">
              {selectedCat?.name} Filters
            </span>
          </div>
          <DynamicFields
            fields={catFilterFields}
            values={dynamicFilters}
            onChange={onDynUpdate}
            mode="filter"
          />
        </div>
      )}

      {/* Price Range */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Price (AED)</label>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" placeholder="Min"
            value={filters.min_price ?? ""}
            onChange={(e) => onUpdate("min_price", e.target.value ? Number(e.target.value) : undefined)}
            className="input-field h-11 text-sm" />
          <input type="number" placeholder="Max"
            value={filters.max_price ?? ""}
            onChange={(e) => onUpdate("max_price", e.target.value ? Number(e.target.value) : undefined)}
            className="input-field h-11 text-sm" />
        </div>
      </div>

      <button onClick={onApply} className="btn-primary w-full h-12 text-[11px]">
        <Filter size={15} /> Apply Filters
      </button>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[var(--color-primary)]" size={40} /></div>}>
      <ListingsContent />
    </Suspense>
  );
}
