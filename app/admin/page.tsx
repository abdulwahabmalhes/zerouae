"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ListChecks, Users, Tag, BarChart3,
  LogOut, Menu, X, Check, Trash2, Eye, TrendingUp,
  ShieldCheck, Clock, Star, AlertCircle, Plus, Edit, Image as ImageIcon, Loader2
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { listingService } from "@/lib/api/listingService";
import { adminService } from "@/lib/api/adminService";
import { categoryService } from "@/lib/api/categoryService";
import { DEMO_STATS, DEMO_CATEGORIES, DEMO_CHART_DATA } from "@/lib/data/demoData";

const NAV = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "listings",  icon: ListChecks,      label: "Listings" },
  { id: "pending",   icon: Clock,           label: "Pending" },
  { id: "users",     icon: Users,           label: "Users" },
  { id: "categories",icon: Tag,             label: "Categories" },
];

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [tab, setTab]       = useState("dashboard");
  const [sidebar, setSidebar] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [pending, setPending]   = useState<any[]>([]);
  const [stats, setStats]       = useState(DEMO_STATS);
  const [users, setUsers]       = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Category Modal State
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [catForm, setCatForm] = useState({ name: "", name_ar: "", icon: "" });
  const [catImage, setCatImage] = useState<File | null>(null);
  const [catSaving, setCatSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    try {
      if (tab === "dashboard") {
        const s = await adminService.getStats();
        if (s.success) setStats(s.data);
        const i = await adminService.getItems();
        if (i.success) setListings(i.data);
      } else if (tab === "listings") {
        const i = await adminService.getItems();
        if (i.success) setListings(i.data);
      } else if (tab === "pending") {
        const i = await adminService.getItems({ status: "review" });
        if (i.success) setPending(i.data);
      } else if (tab === "users") {
        const u = await adminService.getUsers();
        if (u.success) setUsers(u.data);
      } else if (tab === "categories") {
        const c = await categoryService.getAll();
        if (c.success) setCategories(c.data);
      }
    } catch (e) { console.error(e); }
  };

  const approveItem = async (id: number) => {
    const res = await listingService.updateStatus(id, "approved");
    if (res?.success) fetchData();
  };
  const rejectItem  = async (id: number) => {
    const res = await listingService.updateStatus(id, "rejected");
    if (res?.success) fetchData();
  };
  const deleteItem  = async (id: number) => {
    const res = await listingService.deleteListing(id);
    if (res?.success) fetchData();
  };

  const STAT_CARDS = [
    { label: "Total Users",    value: stats.total_users,   icon: Users,       color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Total Listings", value: stats.total_items,   icon: ListChecks,  color: "text-emerald-500",bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "Pending Review", value: stats.pending_items, icon: Clock,       color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
    { label: "Monthly Ads",    value: stats.total_items,   icon: TrendingUp,  color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] flex">
      {/* Sidebar */}
      <aside className={`${sidebar ? "w-64" : "w-20"} bg-[var(--color-bg-card)] border-r border-[var(--color-border)] flex flex-col transition-all duration-300 fixed inset-y-0 z-40`}>
        <div className="h-16 flex items-center justify-between border-b border-[var(--color-border)] px-4">
          <Link href="/" className={`flex items-center ${!sidebar && "justify-center w-full"}`}>
            <Image src="/Zoro Logo-01.png" alt="Zoro UAE" width={90} height={36} className="h-9 w-auto object-contain" />
          </Link>
          {sidebar && (
            <button onClick={() => setSidebar(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]">
              <X size={18} />
            </button>
          )}
        </div>
        <nav className="flex-1 p-3 space-y-1 pt-4">
          {NAV.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${tab === id ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-sub)] hover:bg-[var(--color-bg-soft)]"} ${!sidebar && "justify-center"}`}>
              <Icon size={18} />
              {sidebar && label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-[var(--color-border)]">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-black uppercase text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={18} />
            {sidebar && "Logout"}
          </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${sidebar ? "ml-64" : "ml-20"} p-8`}>
        {tab === "dashboard" && (
          <div className="space-y-8">
            <div><h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tighter">Admin Dashboard</h1></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="card p-6">
                  <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-4`}><Icon size={22} className={color} /></div>
                  <div className="text-2xl font-black text-[var(--color-text-main)]">{value}</div>
                  <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>
            <div className="card overflow-hidden">
              <div className="p-6 border-b border-[var(--color-border)]"><h2 className="text-sm font-black uppercase tracking-widest">Recent Listings</h2></div>
              <div className="divide-y divide-[var(--color-border)]">
                {listings.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-[var(--color-bg-soft)]">
                    <div className="w-14 h-12 rounded-xl overflow-hidden bg-[var(--color-bg-soft)] relative">
                      <img src={item.image || "https://picsum.photos/seed/1/80/60"} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1"><p className="text-sm font-black truncate">{item.name}</p></div>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${item.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "pending" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-black tracking-tighter">Pending Review <span className="text-[var(--color-primary)]">({pending.length})</span></h1>
            <div className="space-y-4">
              {pending.map(item => (
                <div key={item.id} className="card p-5 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-black">{item.name}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] font-bold">{item.category?.name} · by {item.user?.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approveItem(item.id)} className="h-9 px-4 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase hover:bg-emerald-600">Approve</button>
                    <button onClick={() => rejectItem(item.id)} className="h-9 px-4 rounded-xl bg-red-100 text-red-600 text-[10px] font-black uppercase hover:bg-red-200">Reject</button>
                  </div>
                </div>
              ))}
              {pending.length === 0 && <div className="card p-16 text-center"><ShieldCheck size={48} className="text-emerald-500 mx-auto mb-4" /><p className="font-black">All Clear!</p></div>}
            </div>
          </div>
        )}

        {tab === "listings" && (
           <div className="space-y-6">
             <h1 className="text-3xl font-black tracking-tighter">All Listings ({listings.length})</h1>
             <div className="card divide-y divide-[var(--color-border)]">
               {listings.map(item => (
                 <div key={item.id} className="flex items-center gap-4 p-4 group">
                    <div className="w-14 h-12 rounded-xl overflow-hidden relative"><img src={item.image || "https://picsum.photos/seed/1/80/60"} className="w-full h-full object-cover" /></div>
                    <div className="flex-1"><p className="text-sm font-black truncate">{item.name}</p><p className="text-[10px] text-[var(--color-text-muted)]">{item.category?.name} · {item.user?.name}</p></div>
                    <button onClick={() => deleteItem(item.id)} className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100"><Trash2 size={15} /></button>
                 </div>
               ))}
             </div>
           </div>
        )}

        {tab === "users" && (
          <div className="space-y-6">
             <h1 className="text-3xl font-black tracking-tighter">Users ({users.length})</h1>
             <div className="card divide-y divide-[var(--color-border)]">
               {users.map(u => (
                 <div key={u.id} className="flex items-center gap-4 p-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black">{u.name[0]}</div>
                    <div className="flex-1"><p className="text-sm font-black">{u.name}</p><p className="text-[10px] text-[var(--color-text-muted)]">{u.email}</p></div>
                    <span className="text-[10px] font-black uppercase px-2 py-1 bg-gray-100 rounded-lg">{u.type}</span>
                 </div>
               ))}
             </div>
          </div>
        )}

        {tab === "categories" && (
          <div className="space-y-6">
             <div className="flex items-center justify-between">
               <h1 className="text-3xl font-black tracking-tighter">Categories ({categories.length})</h1>
               <button onClick={() => {
                 setEditingCat(null);
                 setCatForm({ name: "", name_ar: "", icon: "" });
                 setCatImage(null);
                 setShowCatModal(true);
               }} className="btn-primary h-10 px-5 gap-2 text-[10px]">
                 <Plus size={15} /> Add Category
               </button>
             </div>
             <div className="card divide-y divide-[var(--color-border)]">
               {categories.map(c => (
                 <div key={c.id} className="flex items-center gap-4 p-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative bg-[var(--color-bg-soft)] flex-shrink-0 flex items-center justify-center">
                      {c.image ? (
                        <Image src={c.image} alt={c.name} fill className="object-cover" />
                      ) : (
                        c.icon ? <span className="font-black text-[var(--color-text-muted)]">{c.icon}</span> : <Tag size={20} className="text-[var(--color-text-muted)]"/>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black">{c.name}</p>
                      {c.name_ar && <p className="text-[10px] text-[var(--color-text-muted)] font-bold">{c.name_ar}</p>}
                    </div>
                    <button onClick={() => {
                       setEditingCat(c);
                       setCatForm({ name: c.name, name_ar: c.name_ar || "", icon: c.icon || "" });
                       setCatImage(null);
                       setShowCatModal(true);
                    }} className="w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--color-bg-soft)] text-[var(--color-text-main)] hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                      <Edit size={15} />
                    </button>
                    <button onClick={async () => {
                       if(confirm(`Are you sure you want to delete ${c.name}?`)) {
                         await adminService.deleteCategory(c.id);
                         fetchData();
                       }
                    }} className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                      <Trash2 size={15} />
                    </button>
                 </div>
               ))}
               {categories.length === 0 && (
                 <div className="p-10 text-center text-[var(--color-text-muted)] font-bold">
                   No categories found. Click "Add Category" to create one!
                 </div>
               )}
             </div>
          </div>
        )}
      </main>

      {/* ── Category Modal ── */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
              <h3 className="text-lg font-black">{editingCat ? "Edit Category" : "Add New Category"}</h3>
              <button onClick={() => setShowCatModal(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"><X size={20}/></button>
            </div>
            <div className="p-5 overflow-y-auto space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">English Name *</label>
                <input required value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="input-field h-12" placeholder="e.g. Cars" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Arabic Name / Description</label>
                <input value={catForm.name_ar} onChange={e => setCatForm({...catForm, name_ar: e.target.value})} className="input-field h-12" placeholder="e.g. سيارات" dir="auto" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Icon Text (Optional)</label>
                <input value={catForm.icon} onChange={e => setCatForm({...catForm, icon: e.target.value})} className="input-field h-12" placeholder="e.g. 🚗 or 'Car'" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Category Image (Optional)</label>
                <label className="relative flex items-center justify-center w-full h-32 border-2 border-dashed border-[var(--color-border)] rounded-xl cursor-pointer hover:border-[var(--color-primary)] transition-colors overflow-hidden bg-[var(--color-bg-soft)]">
                  {catImage ? (
                    <Image src={URL.createObjectURL(catImage)} alt="Preview" fill className="object-cover" />
                  ) : editingCat?.image ? (
                    <Image src={editingCat.image} alt="Current" fill className="object-cover" />
                  ) : (
                    <div className="text-center text-[var(--color-text-muted)]">
                      <ImageIcon size={24} className="mx-auto mb-2" />
                      <span className="text-xs font-bold">Click to upload image</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={e => setCatImage(e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>
            <div className="p-5 border-t border-[var(--color-border)] bg-[var(--color-bg-soft)] flex justify-end gap-3">
              <button onClick={() => setShowCatModal(false)} className="px-5 h-11 rounded-xl text-xs font-black hover:bg-[var(--color-border)] transition-colors">Cancel</button>
              <button disabled={!catForm.name || catSaving} onClick={async () => {
                setCatSaving(true);
                try {
                  const fd = new FormData();
                  fd.append("name", catForm.name);
                  if (catForm.name_ar) fd.append("name_ar", catForm.name_ar);
                  if (catForm.icon) fd.append("icon", catForm.icon);
                  if (catImage) fd.append("image", catImage);

                  if (editingCat) {
                    await adminService.updateCategory(editingCat.id, fd);
                  } else {
                    await adminService.createCategory(fd);
                  }
                  await fetchData();
                  setShowCatModal(false);
                } catch (e) {
                  alert("Failed to save category");
                }
                setCatSaving(false);
              }} className="btn-primary px-6 h-11 gap-2">
                {catSaving ? <Loader2 size={16} className="animate-spin" /> : "Save Category"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
