'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
type Member = { id: number; full_name: string; email: string; points: number; status: string; city: string | null; state: string | null; country: string | null };
export default function PointsManager({ onChanged }: { onChanged: () => Promise<void> }) {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [data, setData] = useState<{ users: Member[]; total: number; totalPoints: number; pageSize: number } | null>(null);
  const [selected, setSelected] = useState<Member | null>(null);
  const [mode, setMode] = useState('add');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => { const timer = setTimeout(() => { setSearch(query.trim()); setPage(1); }, 300); return () => clearTimeout(timer); }, [query]);
  useEffect(() => {
    const controller = new AbortController();
    // Reset request feedback when the selected server resource changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    api.get('/admin/points/users', { params: { q: search, page }, signal: controller.signal }).then(response => { setData(response.data.data); setMessage(''); }).catch(() => { if (!controller.signal.aborted) setMessage('Unable to load balances. Please retry.'); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [search, page, revision]);
  const field = 'w-full rounded-lg border border-[#ccd9e6] bg-white px-3 py-2 text-sm text-[#102a43]';
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected || saving) return;
    const points = Number(amount);
    if (!Number.isSafeInteger(points) || points <= 0 || !reason.trim()) { setMessage('Enter a positive whole-number amount and an audit reason.'); return; }
    if (mode === 'deduct' && points > Number(selected.points)) { setMessage('Deduction cannot exceed the current balance.'); return; }
    setSaving(true);
    try {
      const response = await api.post('/admin/points/adjust', { user_id: selected.id, points_delta: mode === 'deduct' ? -points : points, reason: reason.trim() });
      setSelected(null); setAmount(''); setReason(''); setRevision(value => value + 1);
      await onChanged();
      setMessage(`Adjustment saved. New balance: ${response.data.data.balance} points.`);
    } catch (error) {
      const result = error as { response?: { data?: { error?: { message?: string } } } };
      setMessage(result.response?.data?.error?.message || 'Adjustment failed. Refresh balances before retrying.');
    } finally { setSaving(false); }
  };
  return <section className="space-y-4 rounded-xl border border-[#dce6f0] bg-white p-4 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-xl font-black">All user balances</h3><p className="mt-1 text-sm text-[#486581]">Includes users with zero points. Every adjustment is recorded with your admin identity and reason.</p></div><button type="button" disabled={loading} onClick={() => setRevision(value => value + 1)} className="rounded-lg border px-3 py-2 text-sm font-bold">Refresh balances</button></div><input aria-label="Search balances by name, email or user ID" className={field} value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by name, email or user ID" /><p role="status" aria-live="polite" className="text-sm font-bold">{loading ? 'Loading balances…' : message || `${Number(data?.total || 0).toLocaleString()} users · ${Number(data?.totalPoints || 0).toLocaleString()} total points`}</p>
    {selected ? <form onSubmit={save} className="space-y-3 rounded-xl border border-[#cfe0f1] bg-[#f8fbff] p-4"><h4 className="font-black">Adjust {selected.full_name} · #{selected.id}</h4><p className="text-sm">Current balance: {Number(selected.points).toLocaleString()} points</p><div className="grid gap-3 sm:grid-cols-2"><select aria-label="Adjustment direction" className={field} value={mode} onChange={event => setMode(event.target.value)}><option value="add">Increase points</option><option value="deduct">Decrease points</option></select><input required aria-label="Points amount" className={field} type="number" min="1" step="1" value={amount} onChange={event => setAmount(event.target.value)} /></div><label className="grid gap-2 text-sm font-bold">Audit reason<textarea required maxLength={1000} className={field} value={reason} onChange={event => setReason(event.target.value)} /></label><div className="flex gap-2"><button disabled={saving} className="rounded-lg bg-[#0b4eae] px-4 py-2 text-sm font-bold text-white">{saving ? 'Saving…' : 'Confirm adjustment'}</button><button type="button" disabled={saving} onClick={() => setSelected(null)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button></div></form> : null}
    <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead><tr>{['User', 'Location', 'Balance', 'Actions'].map(label => <th className="border-b py-3" key={label}>{label}</th>)}</tr></thead><tbody>{data?.users.map(user => <tr key={user.id}><td className="border-b py-3"><p className="font-bold">{user.full_name} <span className="text-xs text-[#627d98]">#{user.id}</span></p><p className="text-xs text-[#486581]">{user.email}</p></td><td className="border-b py-3">{[user.city, user.state, user.country].filter(Boolean).join(', ') || 'Not provided'}</td><td className="border-b py-3 text-lg font-black">{Number(user.points).toLocaleString()}</td><td className="border-b py-3"><button type="button" disabled={loading || saving} onClick={() => { setSelected(user); setAmount(''); setReason(''); setMessage(''); }} className="rounded-lg border px-3 py-2 font-bold">Adjust points</button></td></tr>)}</tbody></table></div><div className="flex items-center justify-between text-sm"><button disabled={page <= 1 || loading} onClick={() => setPage(value => value - 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Previous</button><span>Page {page} of {Math.max(1, Math.ceil((data?.total || 0) / (data?.pageSize || 40)))}</span><button disabled={loading || page * (data?.pageSize || 40) >= (data?.total || 0)} onClick={() => setPage(value => value + 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Next</button></div>
  </section>;
}
