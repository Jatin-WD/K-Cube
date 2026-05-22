"use client";

import Link from 'next/link';
import { BarChart3, BookOpen, CalendarDays, Clapperboard, FilePenLine, Gift, ShieldCheck, ShoppingBag, Trophy, Users } from 'lucide-react';
import { detailItems } from '@/lib/kcubeContent';
import { useAppStore } from '@/store/useAppStore';

const cmsModules = [
  { title: 'Content CMS', description: 'Manage SEO pages, homepage sections, detail pages and banners.', icon: FilePenLine },
  { title: 'Users', description: 'Review users, roles, status, login methods and account history.', icon: Users },
  { title: 'Points Ledger', description: 'Approve, audit, adjust and export point transactions.', icon: BarChart3 },
  { title: 'Culture Upload Review', description: 'Approve dance, song, drama and culture uploads, then award verified points.', icon: Clapperboard },
  { title: 'Korean Lessons', description: 'Manage daily Hangul chapters, tasks, streaks and learning rewards.', icon: BookOpen },
  { title: 'K-Food Claims', description: 'Review k-food.in order claims, coupons, click attribution and purchase points.', icon: ShoppingBag },
  { title: 'Korea Trip Winner', description: 'Audit leaderboard totals and announce the verified Korea trip winner.', icon: Trophy },
  { title: 'Events & Rewards', description: 'Publish events, rewards, Korea trip rules and redemption offers.', icon: Gift },
];

const AdminCms = () => {
  const user = useAppStore((state) => state.user);

  if (!user || user.role !== 'admin') {
    return (
      <main className="min-h-screen bg-[#070708] px-5 py-16 text-white lg:px-10">
        <section className="mx-auto max-w-[760px] rounded-xl border border-white/10 bg-[#111113] p-8 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-[#ffc400]" />
          <h1 className="mt-5 text-3xl font-black">Admin access required</h1>
          <p className="mt-3 text-sm leading-7 text-[#aab5c6]">
            Please sign in with an admin account to manage K-CUBE content, users, points, events and rewards.
          </p>
          <Link href="/admin/login" className="mt-6 inline-flex rounded-lg bg-[#ffc400] px-5 py-3 text-sm font-black text-[#090909]">
            Admin login
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070708] px-5 py-12 text-white lg:px-10">
      <div className="mx-auto max-w-[1480px]">
        <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.26em] text-[#ffc400]">Admin CMS</p>
            <h1 className="mt-3 text-4xl font-black">K-CUBE control center</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#aab5c6]">
              Foundation dashboard for managing website content, users, points ledger, activities, Korean lessons, K-Food content, events and Korea trip rewards.
            </p>
          </div>
          <Link href="/admin/login" className="rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-white hover:border-[#ffc400] hover:text-[#ffc400]">
            Switch admin
          </Link>
        </div>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cmsModules.map((module) => {
            const Icon = module.icon;
            return (
              <article key={module.title} className="rounded-xl border border-white/10 bg-[#111113] p-6">
                <Icon className="h-7 w-7 text-[#ffc400]" />
                <h2 className="mt-4 text-2xl font-black">{module.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#aab5c6]">{module.description}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-8 rounded-xl border border-white/10 bg-[#111113] p-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-6 w-6 text-[#ffc400]" />
            <h2 className="text-2xl font-black">CMS content inventory</h2>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-[#ffc400]">
                <tr>
                  <th className="border-b border-white/10 py-3">Type</th>
                  <th className="border-b border-white/10 py-3">Slug</th>
                  <th className="border-b border-white/10 py-3">Title</th>
                  <th className="border-b border-white/10 py-3">Points</th>
                  <th className="border-b border-white/10 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-[#d4dbe7]">
                {detailItems.map((item) => (
                  <tr key={`${item.category}-${item.slug}`}>
                    <td className="border-b border-white/10 py-3 capitalize">{item.category}</td>
                    <td className="border-b border-white/10 py-3">{item.slug}</td>
                    <td className="border-b border-white/10 py-3">{item.title.en}</td>
                    <td className="border-b border-white/10 py-3">{item.points ?? '-'}</td>
                    <td className="border-b border-white/10 py-3">Published</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminCms;
