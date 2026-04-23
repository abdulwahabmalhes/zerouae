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
import { categoryService } from "@/lib/api/categoryService";
import {
  DEMO_STATS, DEMO_LISTINGS, DEMO_PENDING_LISTINGS,
  DEMO_USERS, DEMO_CATEGORIES, DEMO_CHART_DATA
} from "@/lib/data/demoData";

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
  const [listings, setListings] = useState<any[]>(DEMO_LISTINGS);
  const [pending, setPending]   = useState<any[]>(DEMO_PENDING_LISTINGS);
  const [stats]   = useState(DEMO_STATS);

  const approveItem = (id: number) => {
    listingService.updateStatus(id, "approved");
    setPending(p => p.filter(i => i.id !== id));
    setListings(l => [...l, { ...DEMO_PENDING_LISTINGS.find(i => i.id === id), status: "approved" }]);
  };
  const rejectItem  = (id: number) => setPending(p => p.filter(i => i.id !== id));
  const deleteItem  = (id: number) => setListings(l => l.filter(i => i.id !== id));

  const STAT_CARDS = [
    { label: "Total Users",    value: stats.total_users.toLocaleString(),   icon: Users,       color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Total Listings", value: stats.total_items.toLocaleString(),   icon: ListChecks,  color: "text-emerald-500",bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "Pending Review", value: stats.pending_items.toLocaleString(), icon: Clock,       color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
    { label: "Monthly Visitors",value: stats.monthly_visitors.toLocaleString(), icon: TrendingUp, color: "text-purple-500",bg: "bg-purple-50 dark:bg-purple-950/30" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] flex">
      {/* Sidebar */}
      <aside className={`${sidebar ? "w-64" : "w-20"} bg-[var(--color-bg-card)] border-r border-[var(--color-border)] flex flex-col transition-all duration-300 fixed inset-y-0 z-40`}>
        <div className="h-16 flex items-center justify-between border-b border-[var(--color-border)] px-4">
          <Link href="/" className={`flex items-center ${!sidebar && "justify-center w-full"}`}>
            <Image src="/Zoro Logo-01.png" alt="Zoro UAE" width={90} height={36}
              className={`object-contain transition-all ${sidebar ? "h-9 w-auto" : "h-8 w-8 object-contain"}`} />
          </Link>
          {sidebar && (
            <button onClick={() => setSidebar(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]">
              <X size={18} />
            </button>
          )}
        </div>
        {!sidebar && (
          <button onClick={() => setSidebar(true)} className="m-3 p-2 rounded-xl hover:bg-[var(--color-bg-soft)] text-[var(--color-text-muted)] flex justify-center">
            <Menu size={20} />
          </button>
        )}
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
          <button onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-black uppercase text-red-500 hover:bg-red-50 transition-all ${!sidebar && "justify-center"}`}>
            <LogOut size={18} />
            {sidebar && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 transition-all duration-300 ${sidebar ? "ml-64" : "ml-20"} p-8`}>

        {/* ── Dashboard ── */}
        {tab === "dashboard" && (
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-1">Welcome back</p>
              <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tighter">Admin Dashboard</h1>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
                <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  className="card p-6">
                  <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-4`}>
                    <Icon size={22} className={color} />
                  </div>
                  <div className="text-2xl font-black text-[var(--color-text-main)] tracking-tighter">{value}</div>
                  <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mt-1">{label}</div>
                </motion.div>
              ))}
            </div>

            {/* Chart */}
            <div className="card p-8">
              <h2 className="text-sm font-black text-[var(--color-text-main)] uppercase tracking-widest mb-8">Monthly Growth</h2>
              <div className="flex items-end gap-4 h-48">
                {DEMO_CHART_DATA.map(({ month, listings: l, users: u }) => {
                  const maxL = Math.max(...DEMO_CHART_DATA.map(d => d.listings));
                  return (
                    <div key={month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex items-end gap-1 h-36">
                        <div className="flex-1 bg-[var(--color-primary)] rounded-t-lg transition-all duration-700"
                          style={{ height: `${(l / maxL) * 100}%` }} title={`${l} listings`} />
                        <div className="flex-1 bg-blue-400/60 rounded-t-lg transition-all duration-700"
                          style={{ height: `${(u / maxL) * 100}%` }} title={`${u} users`} />
                      </div>
                      <span className="text-[10px] font-black text-[var(--color-text-muted)] uppercase">{month}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[var(--color-primary)]" /><span className="text-[10px] font-bold text-[var(--color-text-muted)]">Listings</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-400/60" /><span className="text-[10px] font-bold text-[var(--color-text-muted)]">Users</span></div>
              </div>
            </div>

            {/* Recent Ads */}
            <div className="card overflow-hidden">
              <div className="p-6 border-b border-[var(--color-border)]">
                <h2 className="text-sm font-black text-[var(--color-text-main)] uppercase tracking-widest">Recent Listings</h2>
              </div>
              <div className="divide-y divide-[var(--color-border)]">
                {listings.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-[var(--color-bg-soft)] transition-colors">
                    <div className="w-14 h-12 rounded-xl overflow-hidden bg-[var(--color-bg-soft)] flex-shrink-0 relative">
                      <Image src={item.image || `https://picsum.photos/seed/${item.id}/80/60`} alt="" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-[var(--color-text-main)] truncate">{item.name}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] font-bold">{item.category?.name} · {item.address}</p>
                    </div>
                    <span className="text-sm font-black text-[var(--color-text-main)]">AED {Number(item.price).toLocaleString()}</span>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${item.status === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── All Listings ── */}
        {tab === "listings" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tighter">All Listings <span className="text-[var(--color-primary)]">({listings.length})</span></h1>
            <div className="card overflow-hidden">
              <div className="divide-y divide-[var(--color-border)]">
                {listings.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-[var(--color-bg-soft)] transition-colors group">
                    <div className="w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 relative bg-[var(--color-bg-soft)]">
                      <Image src={item.image || `https://picsum.photos/seed/${item.id}/80/60`} alt="" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-[var(--color-text-main)] truncate">{item.name}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">{item.category?.name} · {item.address} · <span className="text-[var(--color-primary)]">{item.user?.name}</span></p>
                    </div>
                    <span className="text-sm font-black text-[var(--color-text-main)] whitespace-nowrap">AED {Number(item.price).toLocaleString()}</span>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/listing/${item.id}`} className="w-9 h-9 rounded-lg bg-[var(--color-bg-soft)] flex items-center justify-center hover:text-[var(--color-primary)] transition-colors">
                        <Eye size={15} />
                      </Link>
                      <button onClick={() => deleteItem(item.id)} className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Pending ── */}
        {tab === "pending" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tighter">
              Pending Review <span className="text-[var(--color-primary)]">({pending.length})</span>
            </h1>
            {pending.length === 0 ? (
              <div className="card p-16 text-center">
                <ShieldCheck size={48} className="text-emerald-500 mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-black text-[var(--color-text-main)]">All Clear!</h3>
                <p className="text-[var(--color-text-muted)] mt-2 font-medium">No listings pending review.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pending.map(item => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="card p-5 flex items-center gap-4">
                    <div className="w-2 h-12 bg-orange-400 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-black text-[var(--color-text-main)]">{item.name}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] font-bold mt-0.5">{item.category?.name} · {item.address} · by {item.user?.name}</p>
                    </div>
                    <span className="text-sm font-black text-[var(--color-text-main)]">AED {Number(item.price).toLocaleString()}</span>
                    <div className="flex gap-2">
                      <button onClick={() => approveItem(item.id)}
                        className="h-9 px-4 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider hover:bg-emerald-600 flex items-center gap-1.5 transition-colors">
                        <Check size={14} /> Approve
                      </button>
                      <button onClick={() => rejectItem(item.id)}
                        className="h-9 px-4 rounded-xl bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-wider hover:bg-red-200 flex items-center gap-1.5 transition-colors">
                        <X size={14} /> Reject
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Users ── */}
        {tab === "users" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tighter">Users <span className="text-[var(--color-primary)]">({DEMO_USERS.length})</span></h1>
            <div className="card overflow-hidden">
              <div className="divide-y divide-[var(--color-border)]">
                {DEMO_USERS.map(u => (
                  <div key={u.id} className="flex items-center gap-4 p-4 hover:bg-[var(--color-bg-soft)] transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] font-black text-sm flex-shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-[var(--color-text-main)]">{u.name}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">{u.email} · {u.mobile}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${u.type === "admin" ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]" : "bg-[var(--color-bg-soft)] text-[var(--color-text-muted)]"}`}>
                      {u.type}
                    </span>
                    <div className={`w-2.5 h-2.5 rounded-full ${u.is_active ? "bg-emerald-500" : "bg-red-400"}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Categories ── */}
        {tab === "categories" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tighter">Categories</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {DEMO_CATEGORIES.map((cat, i) => (
                <motion.div key={cat.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }} className="card p-6 text-center">
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="text-sm font-black text-[var(--color-text-main)]">{cat.name}</h3>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{cat.name_ar}</p>
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    <span className="text-lg font-black text-[var(--color-primary)]">{cat.items_count.toLocaleString()}</span>
                    <p className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider font-bold">listings</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
