"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Shield, Users, Globe, Award } from "lucide-react";

const TEAM = [
  { name: "Ahmed Al Mansouri", role: "CEO & Co-Founder", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
  { name: "Sara Khalid",       role: "Head of Product",  img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" },
  { name: "Omar Al Rashed",    role: "CTO",              img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80" },
  { name: "Fatima Al Zaabi",   role: "Head of Marketing", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80" },
];

const VALUES = [
  { icon: Shield, title: "Trust First",    desc: "Every listing is reviewed. Every seller is verified. Zero tolerance for fraud." },
  { icon: Users,  title: "Community",      desc: "We serve buyers and sellers from all 7 Emirates, every day." },
  { icon: Globe,  title: "UAE-Focused",    desc: "Built for the UAE market — Arabic, English, local laws, local prices." },
  { icon: Award,  title: "Excellence",     desc: "We're obsessed with quality — from UI to customer support." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      <Header/>
      <main>
        {/* Hero */}
        <section className="relative h-[65vh] flex items-end overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&q=85"
            alt="Dubai skyline"
            fill className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"/>
          <div className="container-main relative z-10 pb-20">
            <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">Our Story</p>
              <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">
                Built for the<br/>
                <span className="text-[var(--color-primary)] italic">UAE.</span>
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-24 bg-[var(--color-bg-card)]">
          <div className="container-main">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">Our Mission</p>
                <h2 className="text-4xl font-black text-[var(--color-text-main)] tracking-tighter mb-6 leading-tight">
                  Making Buying &amp; Selling<br/>
                  <span className="text-[var(--color-primary)] italic">Simple & Trusted</span>
                </h2>
                <p className="text-[var(--color-text-sub)] font-medium leading-relaxed mb-6">
                  ZORO UAE was founded in Dubai to solve a simple problem: the UAE needed a classified ads platform that truly understood its people, languages, and culture.
                </p>
                <p className="text-[var(--color-text-sub)] font-medium leading-relaxed mb-10">
                  Today, we serve buyers and sellers across all 7 Emirates — from luxury cars in Dubai to apartments in Abu Dhabi, electronics in Sharjah, and jobs across the country.
                </p>
                <Link href="/listings" className="btn-primary h-12 px-8 gap-2 inline-flex">
                  Explore Listings <ArrowRight size={16}/>
                </Link>
              </motion.div>
              <motion.div initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
                className="relative h-96 rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=85"
                  alt="UAE marketplace"
                  fill className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-[var(--color-bg-page)]">
          <div className="container-main">
            <div className="text-center mb-16">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-3">What We Stand For</p>
              <h2 className="text-4xl font-black text-[var(--color-text-main)] tracking-tighter">
                Our Core <span className="text-[var(--color-primary)] italic">Values</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map(({icon:Icon,title,desc},i)=>(
                <motion.div key={i}
                  initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.08}}
                  className="card p-8 text-center group">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Icon size={24}/>
                  </div>
                  <h3 className="text-sm font-black text-[var(--color-text-main)] mb-3">{title}</h3>
                  <p className="text-sm text-[var(--color-text-sub)] font-medium leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 bg-[var(--color-bg-card)]">
          <div className="container-main">
            <div className="text-center mb-16">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-3">The People</p>
              <h2 className="text-4xl font-black text-[var(--color-text-main)] tracking-tighter">
                Meet the <span className="text-[var(--color-primary)] italic">Team</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM.map(({name,role,img},i)=>(
                <motion.div key={i}
                  initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.08}}
                  className="card overflow-hidden group text-center">
                  <div className="relative h-52 overflow-hidden bg-[var(--color-bg-soft)]">
                    <Image src={img} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-700"/>
                  </div>
                  <div className="p-5">
                    <h4 className="text-sm font-black text-[var(--color-text-main)]">{name}</h4>
                    <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest mt-1">{role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
}
