"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ListChecks, Users, Tag, BarChart3,
  LogOut, Menu, X, Check, Trash2, Eye, TrendingUp,
  ShieldCheck, Clock, Star, AlertCircle
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
               <button onClick={async () => {
                 const name = prompt("Enter category name (e.g. Cars):");
                 if (name) {
                   await adminService.createCategory({ name });
                   fetchData();
                 }
               }} className="btn-primary h-10 px-5 gap-2 text-[10px]">
                 <Plus size={15} /> Add Category
               </button>
             </div>
             <div className="card divide-y divide-[var(--color-border)]">
               {categories.map(c => (
                 <div key={c.id} className="flex items-center gap-4 p-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black">{c.icon || <Tag size={16} />}</div>
                    <div className="flex-1"><p className="text-sm font-black">{c.name}</p></div>
                    <button onClick={async () => {
                       if(confirm(`Delete category ${c.name}?`)) {
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
    </div>
  );
}
