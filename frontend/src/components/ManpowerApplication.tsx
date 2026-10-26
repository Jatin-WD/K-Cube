'use client';
import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';
export default function ManpowerApplication() {
  const user = useAppStore(state => state.user);
  const [role, setRole] = useState('Event crew');
  const [experience, setExperience] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);
  const field = 'w-full rounded-xl border border-[var(--kc-border)] bg-white px-4 py-3 text-[var(--kc-text)]';
  return <section id="manpower-application" className="kc-content scroll-mt-32 py-12"><div className="mx-auto max-w-2xl rounded-2xl border border-[var(--kc-border)] bg-white p-6 sm:p-10"><h2 className="text-3xl font-black">Tell us about yourself.</h2><p className="mt-3 text-sm leading-6">Your application is sent securely to the K-CUBE team with your account contact details.</p>{!user ? <Link className="mt-6 inline-block rounded-xl bg-[var(--kc-blue-700)] px-5 py-3 font-bold text-white" href="/signin?returnTo=%2Fapply-for-manpower%23manpower-application">Sign in to apply</Link> : <form className="mt-6 grid gap-4" onSubmit={async event => { event.preventDefault(); if (saving || done) return; setSaving(true); try { await api.post('/manpower/apply', { role, experience }); setDone(true); setMessage('Application submitted. The K-CUBE team will review your details.'); } catch { setMessage('Application could not be submitted. Please try again.'); } finally { setSaving(false); } }}><p className="text-sm font-bold">Applying as {user.fullName}</p><label className="grid gap-2 text-sm font-bold">Role<select disabled={done || saving} className={field} value={role} onChange={event => setRole(event.target.value)}>{['Event crew', 'Content & creative', 'Operations'].map(item => <option key={item}>{item}</option>)}</select></label><label className="grid gap-2 text-sm font-bold">Experience &amp; interests<textarea required minLength={20} maxLength={5000} rows={6} disabled={done || saving} className={field} value={experience} onChange={event => setExperience(event.target.value)} /></label><p role="status" className="text-sm font-bold">{message}</p><button disabled={saving || done} className="rounded-xl bg-[var(--kc-blue-700)] px-5 py-3 font-bold text-white disabled:opacity-60">{done ? 'Application received' : saving ? 'Submitting…' : 'Submit application'}</button></form>}</div></section>;
}
