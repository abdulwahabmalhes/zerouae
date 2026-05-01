"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Package, MessageSquare, Heart, BarChart3, Plus,
  Eye, Trash2, LogOut, Home, CheckCircle,
  Clock, Upload, X, Loader2
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { listingService } from "@/lib/api/listingService";
import { categoryService } from "@/lib/api/categoryService";
import { DEMO_LISTINGS, DEMO_CATEGORIES } from "@/lib/data/demoData";
import { CATEGORY_FIELDS } from "@/lib/data/categoryFields";
import { DynamicFields } from "@/components/ui/DynamicFields";

const SIDE_NAV = [
  { id: "overview",  icon: BarChart3,    label: "Overview" },
  { id: "my-ads",    icon: Package,      label: "My Ads" },
  { id: "post",      icon: Plus,         label: "Post Ad" },
  { id: "favourites",icon: Heart,        label: "Saved" },
  { id: "messages",  icon: MessageSquare,label: "Messages" },
];

const STATUS_STYLE: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-700",
  review:   "bg-orange-100 text-orange-700",
  rejected: "bg-red-100 text-red-600",
};

export default function AdvertiserPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab]         = useState("overview");
  const [myAds, setMyAds]     = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>(DEMO_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [form, setForm]       = useState({ name: "", price: "", description: "", address: "", category_id: "", contact: "" });
  const [customVals, setCustomVals] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [success, setSuccess] = useState("");

  const catId = Number(form.category_id);
  const dynamicFields = catId ? (CATEGORY_FIELDS[catId] ?? []) : [];

  const handleCategoryChange = (catId: string) => {
    setForm(f => ({ ...f, category_id: catId }));
    setCustomVals({});
  };

  const handleCustomChange = (key: string, val: string) =>
    setCustomVals(prev => ({ ...prev, [key]: val }));

  useEffect(() => {
    listingService.getMyListings().then(res => {
      if (res.success) setMyAds(res.data ?? DEMO_LISTINGS.slice(0, 4));
    }).catch(() => setMyAds(DEMO_LISTINGS.slice(0, 4)));
    categoryService.getAll().then(res => { if (res.success && res.data?.length) setCategories(res.data); });
  }, []);

  // ── Auth Guard Guard ──
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login?redirect=/advertiser");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin" />
          <p className="text-[var(--color-text-muted)] font-bold text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      // Append dynamic custom fields
      Object.entries(customVals).forEach(([k, v]) => v && fd.append(`custom_fields[${k}]`, v));
      if (imageFile) fd.append("image", imageFile);
      const res = await listingService.createListing(fd);
      if (res?.success) {
        setSuccess("Ad submitted for review!");
        setForm({ name: "", price: "", description: "", address: "", category_id: "", contact: "" });
        setCustomVals({});
        setImageFile(null); setImagePreview(null);
        setTimeout(() => { setSuccess(""); setTab("my-ads"); }, 2000);
      }
    } catch (err: any) {
      setSuccess(err.response?.data?.message || "Error submitting ad. Please check all fields.");
    }
    setPosting(false);
  };

  const deleteAd = async (id: number) => {
    try { await listingService.deleteListing(id); } catch {}
    setMyAds(prev => prev.filter(a => a.id !== id));
  };

  const MY_STATS = [
    { label: "Total Ads",   value: myAds.length,                          icon: Package,  color: "text-blue-500",   bg: "bg-blue-50" },
    { label: "Active",      value: myAds.filter(a=>a.status==="approved").length, icon: CheckCircle,color:"text-emerald-500",bg:"bg-emerald-50" },
    { label: "Pending",     value: myAds.filter(a=>a.status==="review").length,   icon: Clock,  color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Total Views", value: myAds.reduce((s,a)=>s+(a.total_click||0),0).toLocaleString(), icon: Eye, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] flex">
      {/* Sidebar */}
      <aside className="w-20 bg-[var(--color-bg-card)] border-r border-[var(--color-border)] flex flex-col items-center py-8 fixed inset-y-0 z-40">
        <Link href="/" className="mb-10 flex items-center justify-center">
          <Image src="/Zoro Logo-01.png" alt="Zoro UAE" width={44} height={44} className="h-11 w-11 object-contain" />
        </Link>
        <nav className="flex flex-col gap-3 flex-1">
          {SIDE_NAV.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setTab(id)} title={label}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${tab === id ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-glow)]" : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-text-main)]"}`}>
              <Icon size={20} />
            </button>
          ))}
        </nav>
        <div className="flex flex-col gap-3">
          <Link href="/" className="w-12 h-12 rounded-2xl flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-bg-soft)] transition-all" title="Home">
            <Home size={20} />
          </Link>
          <button onClick={logout} title="Logout" className="w-12 h-12 rounded-2xl flex items-center justify-center text-red-400 hover:bg-red-50 transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-20 p-8">

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-1">Advertiser Portal</p>
              <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tighter">
                Welcome, <span className="text-[var(--color-primary)] italic">{user?.name ?? "User"}!</span>
              </h1>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {MY_STATS.map(({ label, value, icon: Icon, color, bg }) => (
                <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
                  <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-4`}>
                    <Icon size={22} className={color} />
                  </div>
                  <div className="text-2xl font-black text-[var(--color-text-main)] tracking-tighter">{value}</div>
                  <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mt-1">{label}</div>
                </motion.div>
              ))}
            </div>
            <div className="card p-6">
              <h2 className="text-sm font-black text-[var(--color-text-main)] uppercase tracking-widest mb-6">My Recent Ads</h2>
              <div className="space-y-3">
                {myAds.slice(0, 4).map(ad => (
                  <div key={ad.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--color-bg-soft)] transition-colors">
                    <div className="w-14 h-12 rounded-xl overflow-hidden relative bg-[var(--color-bg-soft)] flex-shrink-0">
                      <Image src={ad.image || `https://picsum.photos/seed/${ad.id}/80/60`} alt="" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-[var(--color-text-main)] truncate">{ad.name}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">{ad.total_click ?? 0} views</p>
                    </div>
                    <span className="font-black text-sm text-[var(--color-text-main)]">AED {Number(ad.price).toLocaleString()}</span>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${STATUS_STYLE[ad.status] ?? STATUS_STYLE.review}`}>{ad.status}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setTab("post")} className="btn-primary w-full mt-6 h-12 gap-2">
                <Plus size={18} /> Post New Ad
              </button>
            </div>
          </div>
        )}

        {/* ── My Ads ── */}
        {tab === "my-ads" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tighter">My Ads</h1>
              <button onClick={() => setTab("post")} className="btn-primary h-10 px-5 gap-2 text-[10px]">
                <Plus size={15} /> Post Ad
              </button>
            </div>
            {myAds.length === 0 ? (
              <div className="card p-16 text-center">
                <Package size={48} className="text-[var(--color-text-muted)] mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-black text-[var(--color-text-main)]">No ads yet</h3>
                <button onClick={() => setTab("post")} className="btn-primary h-11 px-8 mt-6 gap-2"><Plus size={16}/> Post Your First Ad</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {myAds.map(ad => (
                  <motion.div key={ad.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="card overflow-hidden group">
                    <div className="relative h-44">
                      <Image src={ad.image || `https://picsum.photos/seed/${ad.id}/400/200`} alt={ad.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase backdrop-blur-sm ${STATUS_STYLE[ad.status] ?? STATUS_STYLE.review}`}>{ad.status}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-sm font-black text-[var(--color-text-main)] truncate mb-1">{ad.name}</h3>
                      <p className="text-[10px] text-[var(--color-text-muted)] mb-4">{ad.total_click ?? 0} views · {ad.category?.name}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-[var(--color-primary)]">AED {Number(ad.price).toLocaleString()}</span>
                        <div className="flex gap-2">
                          <Link href={`/listing/${ad.id}`} className="w-9 h-9 rounded-xl bg-[var(--color-bg-soft)] flex items-center justify-center hover:text-[var(--color-primary)] transition-colors">
                            <Eye size={15} />
                          </Link>
                          <button onClick={() => deleteAd(ad.id)} className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Post Ad ── */}
        {tab === "post" && (
          <div className="max-w-2xl space-y-6">
            <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tighter">Post New Ad</h1>
            {success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 font-bold text-sm">
                <CheckCircle size={20} /> {success}
              </motion.div>
            )}
            <form onSubmit={handlePost} className="card p-8 space-y-5">
              {/* Image Upload */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Photo</label>
                <label className="relative block w-full h-44 border-2 border-dashed border-[var(--color-border)] rounded-2xl cursor-pointer hover:border-[var(--color-primary)] transition-colors overflow-hidden">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-[var(--color-text-muted)]">
                      <Upload size={32} strokeWidth={1.5} />
                      <span className="text-sm font-bold">Click to upload photo</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Title *</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="What are you selling?" className="input-field h-12" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Category *</label>
                  <select required value={form.category_id} onChange={e => handleCategoryChange(e.target.value)}
                    className="input-field h-12">
                    <option value="">Select category...</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.icon ? `${c.icon} ` : ""}{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Price (AED) *</label>
                  <input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                    placeholder="0" className="input-field h-12" />
                </div>
              </div>

              {/* ── Dynamic Category Fields ── */}
              {dynamicFields.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--color-border)]">
                    <div className="w-1.5 h-5 bg-[var(--color-primary)] rounded-full" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-[var(--color-text-main)]">
                      {categories.find((c: any) => c.id === catId)?.name} Details
                    </span>
                  </div>
                  <DynamicFields
                    fields={dynamicFields}
                    values={customVals}
                    onChange={handleCustomChange}
                    mode="form"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Location</label>
                  <input value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                    placeholder="e.g. Dubai, Marina" className="input-field h-12" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Contact</label>
                  <input value={form.contact} onChange={e => setForm({...form, contact: e.target.value})}
                    placeholder="+971 50 000 0000" className="input-field h-12" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Describe your item in detail..." rows={4} className="input-field py-3 resize-none" />
              </div>
              <button type="submit" disabled={posting} className="btn-primary w-full h-14 gap-2">
                {posting ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={18} /> Submit Ad</>}
              </button>
            </form>
          </div>
        )}

        {/* ── Saved ── */}
        {tab === "favourites" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tighter">Saved Ads</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {DEMO_LISTINGS.filter(i => i.is_featured).slice(0,3).map((ad, i) => (
                <Link key={ad.id} href={`/listing/${ad.id}`} className="card overflow-hidden group block">
                  <div className="relative h-44">
                    <Image src={ad.image} alt={ad.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-black text-[var(--color-text-main)] truncate">{ad.name}</h3>
                    <p className="text-[var(--color-primary)] font-black mt-2">AED {Number(ad.price).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Messages ── */}
        {tab === "messages" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tighter">Messages</h1>
            <div className="card overflow-hidden">
              {[
                { name: "Ahmed Al Mansouri", msg: "Is the Ferrari still available?", time: "2m ago", unread: true },
                { name: "Sara Khalid",       msg: "Can you do 850,000 for the car?",  time: "1h ago", unread: true },
                { name: "Omar Al Rashed",    msg: "Thank you, I'll come tomorrow.",   time: "3h ago", unread: false },
              ].map(({ name, msg, time, unread }) => (
                <div key={name} className="flex items-center gap-4 p-5 border-b border-[var(--color-border)] hover:bg-[var(--color-bg-soft)] transition-colors cursor-pointer">
                  <div className="w-11 h-11 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] font-black text-sm flex-shrink-0 relative">
                    {name.charAt(0)}
                    {unread && <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[var(--color-primary)] rounded-full border-2 border-[var(--color-bg-card)]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-[var(--color-text-main)]">{name}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)] truncate">{msg}</p>
                  </div>
                  <span className="text-[10px] text-[var(--color-text-muted)] font-bold flex-shrink-0">{time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
