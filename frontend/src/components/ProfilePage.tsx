"use client";

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, MapPin, Save, ShieldCheck, UserRound } from 'lucide-react';
import api from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';

type ProfileData = {
  id: number;
  full_name: string;
  username: string;
  email: string;
  phone: string | null;
  profile_image: string | null;
  role: string;
  points: number;
  xp: number;
  level: number;
  streak: number;
  city: string | null;
  state: string | null;
  country: string | null;
  referral_code: string | null;
  created_at: string;
  last_login: string | null;
  status: string;
};

const emptyForm = { full_name: '', phone: '', city: '', state: '', country: '' };

const ProfilePage = () => {
  const user = useAppStore((state) => state.user);
  const updateUser = useAppStore((state) => state.updateUser);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    api.get('/users/profile')
      .then((response) => {
        if (cancelled) return;
        const data = response.data?.data ?? response.data;
        setProfile(data);
        setForm({
          full_name: data.full_name || '',
          phone: data.phone || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || '',
        });
      })
      .catch(() => {
        if (!cancelled) setError('Profile load nahi ho paya. Please refresh karke try karein.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const initials = useMemo(() => (profile?.full_name || user?.fullName || 'K').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(), [profile?.full_name, user?.fullName]);

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const response = await api.patch('/users/profile', form);
      const data = response.data?.data ?? response.data;
      setProfile(data);
      setForm({ full_name: data.full_name || '', phone: data.phone || '', city: data.city || '', state: data.state || '', country: data.country || '' });
      updateUser({ fullName: data.full_name, phone: data.phone || undefined, city: data.city, state: data.state, country: data.country, profileImage: data.profile_image });
      setMessage('Profile updated successfully.');
    } catch {
      setError('Profile save nahi ho paya. Please details check karke try karein.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-[#070708] px-5 py-16 text-white lg:px-10">
        <section className="mx-auto max-w-2xl rounded-xl border border-white/10 bg-[#111113] p-8 text-center">
          <UserRound className="mx-auto h-12 w-12 text-[#ffc400]" />
          <h1 className="mt-5 text-3xl font-black">Sign in to view your profile</h1>
          <p className="mt-3 text-sm leading-7 text-[#aab5c6]">Your personal details, points and account activity will appear here.</p>
          <Link href="/signin?returnTo=/profile" className="mt-6 inline-flex rounded-lg bg-[#ffc400] px-5 py-3 text-sm font-black text-[#090909]">Sign in</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070708] px-4 py-8 text-white sm:px-5 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[1180px]">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-[#aab5c6] transition hover:text-[#ffc400]"><ArrowLeft className="h-4 w-4" /> Back to dashboard</Link>
        <section className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#111113]">
          <div className="border-b border-white/10 bg-[linear-gradient(110deg,rgba(255,196,0,0.16),rgba(17,17,19,0.2)_48%,rgba(17,17,19,1))] p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {profile?.profile_image ? <img src={profile.profile_image} alt="Profile" className="h-20 w-20 rounded-xl object-cover" /> : <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[#ffc400] text-2xl font-black text-[#111]"><span>{initials}</span></div>}
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffc400]">My profile</p>
                  <h1 className="mt-2 text-3xl font-black sm:text-4xl">{profile?.full_name || user.fullName}</h1>
                  <p className="mt-1 text-sm text-[#aab5c6]">@{profile?.username || user.username || 'member'} · {profile?.email || user.email}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 self-start rounded-full border border-[#70d6a5]/30 bg-[#70d6a5]/10 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#9be7c2]"><ShieldCheck className="h-4 w-4" /> {profile?.status || 'active'}</span>
            </div>
          </div>

          {loading ? <div className="p-8 text-sm text-[#aab5c6]">Loading your profile...</div> : (
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_0.7fr]">
              <form onSubmit={saveProfile} className="space-y-5">
                <div><h2 className="text-2xl font-black">Personal details</h2><p className="mt-1 text-sm text-[#aab5c6]">Keep your contact and location information up to date.</p></div>
                <label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">Full name</span><input required value={form.full_name} onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))} className="w-full rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" /></label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">Phone</span><input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="+91..." className="w-full rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" /></label>
                  <label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">Country</span><input value={form.country} onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))} placeholder="India" className="w-full rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" /></label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">City</span><input value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} className="w-full rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" /></label><label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">State</span><input value={form.state} onChange={(event) => setForm((current) => ({ ...current, state: event.target.value }))} className="w-full rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" /></label></div>
                <div className="grid gap-3 sm:grid-cols-2"><div><p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#98a4b1]">Email</p><p className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#aab5c6]">{profile?.email}</p></div><div><p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#98a4b1]">Username</p><p className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#aab5c6]">@{profile?.username}</p></div></div>
                {message ? <p className="flex items-center gap-2 text-sm font-bold text-[#9be7c2]"><CheckCircle2 className="h-4 w-4" /> {message}</p> : null}{error ? <p className="text-sm font-bold text-red-300">{error}</p> : null}
                <button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#ffc400] px-5 py-3 text-sm font-black text-[#090909] disabled:opacity-60"><Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save changes'}</button>
              </form>

              <aside className="space-y-4">
                <h2 className="text-2xl font-black">Your K-CUBE account</h2>
                <div className="grid grid-cols-2 gap-3"><div className="rounded-lg border border-[#ffc400]/25 bg-[#ffc400]/10 p-4"><p className="text-xs font-bold text-[#aab5c6]">Points</p><p className="mt-1 text-3xl font-black text-[#ffc400]">{profile?.points ?? 0}</p></div><div className="rounded-lg border border-white/10 bg-white/[0.04] p-4"><p className="text-xs font-bold text-[#aab5c6]">Level</p><p className="mt-1 text-3xl font-black">{profile?.level ?? 1}</p></div><div className="rounded-lg border border-white/10 bg-white/[0.04] p-4"><p className="text-xs font-bold text-[#aab5c6]">XP</p><p className="mt-1 text-3xl font-black">{profile?.xp ?? 0}</p></div><div className="rounded-lg border border-white/10 bg-white/[0.04] p-4"><p className="text-xs font-bold text-[#aab5c6]">Streak</p><p className="mt-1 text-3xl font-black">{profile?.streak ?? 0}</p></div></div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffc400]">Referral</p><p className="mt-3 text-sm text-[#aab5c6]">Invite friends and earn points when they join.</p><p className="mt-3 rounded-lg bg-[#070708] px-4 py-3 text-lg font-black tracking-[0.12em]">{profile?.referral_code || 'Not available'}</p><Link href="/dashboard" className="mt-4 inline-flex text-sm font-black text-[#ffc400]">Manage from dashboard →</Link></div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-[#aab5c6]"><MapPin className="mb-2 h-5 w-5 text-[#ffc400]" />{[profile?.city, profile?.state, profile?.country].filter(Boolean).join(', ') || 'Add your location to complete your profile.'}</div>
              </aside>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
