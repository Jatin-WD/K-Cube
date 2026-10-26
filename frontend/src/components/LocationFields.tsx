'use client';
import { useEffect, useId, useState } from 'react';
import api from '@/lib/api';
type Location = { country: string; state: string; city: string };
type Option = { name: string; code: string };
export default function LocationFields({ value, onChange }: { value: Location; onChange: (location: Location) => void }) {
  const [options, setOptions] = useState<{ country: Option[]; state: Option[]; city: Option[] }>({ country: [], state: [], city: [] });
  const listId = useId();
  useEffect(() => {
    const controller = new AbortController();
    api.get('/locations', { signal: controller.signal }).then(response => setOptions(current => ({ ...current, country: response.data.data }))).catch(() => {});
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!value.country) return;
    const controller = new AbortController();
    api.get('/locations', { params: { country: value.country }, signal: controller.signal }).then(response => setOptions(current => ({ ...current, state: response.data.data }))).catch(() => {});
    return () => controller.abort();
  }, [value.country]);
  useEffect(() => {
    if (!value.country || !value.state) return;
    const controller = new AbortController();
    api.get('/locations', { params: { country: value.country, state: value.state }, signal: controller.signal }).then(response => setOptions(current => ({ ...current, city: response.data.data }))).catch(() => {});
    return () => controller.abort();
  }, [value.country, value.state]);
  return <fieldset className="grid min-w-0 gap-3"><legend className="mb-2 text-sm font-bold">Your community location</legend><p className="text-xs leading-5 text-[var(--kc-text-secondary)]">Used to connect your local K-CUBE community. No street address or GPS tracking is collected here.</p>{(['country', 'state', 'city'] as const).map(field => <label key={field} className="grid gap-2 text-sm font-bold">{field === 'state' ? 'State / region' : field === 'country' ? 'Country *' : 'City / town *'}<input required={field !== 'state' || options.state.length > 0} maxLength={100} autoComplete={field === 'country' ? 'country-name' : field === 'state' ? 'address-level1' : 'address-level2'} list={`${listId}-${field}`} value={value[field]} onChange={event => { onChange({ ...value, [field]: event.target.value, ...(field === 'country' ? { state: '', city: '' } : field === 'state' ? { city: '' } : {}) }); if (field === 'country') setOptions(current => ({ ...current, state: [], city: [] })); if (field === 'state') setOptions(current => ({ ...current, city: [] })); }} className="min-w-0 w-full rounded-lg border border-[var(--kc-border)] bg-[var(--kc-surface-soft)] px-4 py-3 text-[var(--kc-text)] outline-none focus:border-[var(--kc-blue-700)]" /><datalist id={`${listId}-${field}`}>{options[field].map((item, index) => <option key={`${item.code}-${index}`} value={item.name} />)}</datalist></label>)}</fieldset>;
}
