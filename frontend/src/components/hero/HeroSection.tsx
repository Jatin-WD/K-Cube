"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Search } from 'lucide-react';

const stats = [
  { label: 'Active members', value: '12.8K' },
  { label: 'Daily XP flows', value: '98K' },
  { label: 'Rewards unlocked', value: '3.6K' },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-10 lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(248,113,113,0.08),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(125,211,252,0.12),_transparent_28%)]" />
      <div className="relative mx-auto max-w-[1600px]">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.3em] text-amber-300 ring-1 ring-amber-300/20 shadow-sm shadow-amber-300/10">
              <Sparkles className="h-4 w-4 text-amber-300" />
              PREMIUM LAUNCH LIVE
            </div>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
                Welcome to K-CUBE
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                The premium Korean community for India — learn Hangul, join missions, earn rewards, and compete for the Seoul trip.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr] xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/30">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    placeholder="Search missions, badges, and K-food"
                    className="w-full rounded-full border border-white/10 bg-slate-950/90 py-4 pl-12 pr-4 text-sm text-white outline-none ring-1 ring-slate-700 transition focus:border-amber-300 focus:ring-amber-300/30"
                  />
                </div>
              </div>
              <Link
                href="/rewards"
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-4 text-sm font-semibold text-slate-950 shadow-xl shadow-amber-500/20 transition hover:brightness-110"
              >
                Join now
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 text-white shadow-2xl shadow-slate-950/25">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{item.label}</p>
                  <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/85 p-6 shadow-2xl shadow-slate-950/40"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_bottom,_rgba(250,204,21,0.12),transparent_28%)]" />
            <div className="relative grid gap-6">
              <div className="flex items-center justify-between rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Your K-journey</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Create account</h2>
                </div>
                <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-amber-300">Step 1</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: 'Choose City', subtitle: 'Select your chapter', icon: <MapPin className="h-5 w-5 text-cyan-300" /> },
                  { title: 'Matchmaking', subtitle: 'Join learning groups', icon: <Sparkles className="h-5 w-5 text-fuchsia-400" /> },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-800 text-white">{item.icon}</div>
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="mt-2 text-sm text-slate-400">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Progress meter</p>
                    <p className="mt-2 text-2xl font-semibold text-white">54% on the Korea journey</p>
                  </div>
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-300">Live</span>
                </div>
                <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-[54%] rounded-full bg-gradient-to-r from-amber-400 to-cyan-400" />
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] bg-slate-950/90 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Top competitor</p>
                    <p className="mt-3 text-lg font-semibold text-white">Aarav S.</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-950/90 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Tier</p>
                    <p className="mt-3 text-lg font-semibold text-white">Diamond</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
