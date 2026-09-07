'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CircleMarker, LayerGroup, Map as LeafletMap } from 'leaflet';
import { BarChart3, ChevronDown, ExternalLink, Maximize2, Map as MapIcon, Minimize2, RefreshCw, Search, Users, X } from 'lucide-react';
import api from '@/lib/api';

type MapLevel = 'country' | 'state' | 'city' | 'unknown';

type LocationSummary = {
  key: string;
  level: MapLevel;
  label: string;
  country: string | null;
  state: string | null;
  city: string | null;
  users: number;
  activeUsers: number;
  verifiedUsers: number;
  totalPoints: number;
  newThisMonth: number;
  latitude: number | null;
  longitude: number | null;
  mapped: boolean;
};

type CommunityMapUser = {
  id: number;
  full_name: string;
  status: string;
  points: number;
  city: string | null;
  state: string | null;
  country: string | null;
  created_at: string;
  last_login: string | null;
};

type MapPayload = {
  metrics: {
    totalUsers: number;
    mappedUsers: number;
    unmappedUsers: number;
    countries: number;
    states: number;
    cities: number;
    newThisMonth: number;
    activeUsers: number;
    verifiedUsers: number;
  };
  locations: {
    countries: LocationSummary[];
    states: LocationSummary[];
    cities: LocationSummary[];
    unknown: LocationSummary[];
  };
  selectedUsers: CommunityMapUser[];
};

type Props = {
  onViewUser?: (userId: number) => void;
};

const emptyPayload: MapPayload = {
  metrics: { totalUsers: 0, mappedUsers: 0, unmappedUsers: 0, countries: 0, states: 0, cities: 0, newThisMonth: 0, activeUsers: 0, verifiedUsers: 0 },
  locations: { countries: [], states: [], cities: [], unknown: [] },
  selectedUsers: [],
};

const inputClass = 'w-full rounded-[8px] border border-[#ccd9e6] bg-white px-3 py-2 text-sm text-[#102a43] outline-none transition placeholder:text-[#6b7c93] focus:border-[#0b4eae] focus:ring-2 focus:ring-[#0b4eae]/10';
const selectClass = 'w-full rounded-[8px] border border-[#ccd9e6] bg-white px-3 py-2 text-sm text-[#102a43] outline-none transition focus:border-[#0b4eae] focus:ring-2 focus:ring-[#0b4eae]/10';

const formatNumber = (value: number) => new Intl.NumberFormat('en-IN').format(Number(value || 0));
const normalize = (value: string | null | undefined) => String(value || '').trim().toLocaleLowerCase();

const CommunityMapPanel = ({ onViewUser }: Props) => {
  const [payload, setPayload] = useState<MapPayload>(emptyPayload);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pointsMin, setPointsMin] = useState('');
  const [pointsMax, setPointsMax] = useState('');
  const [view, setView] = useState<'map' | 'statistics'>('map');
  const [zoom, setZoom] = useState(3);
  const [selected, setSelected] = useState<LocationSummary | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerLayerRef = useRef<LayerGroup | null>(null);
  const markersRef = useRef<CircleMarker[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('q', debouncedSearch);
      if (status !== 'all') params.set('status', status);
      if (country) params.set('country', country);
      if (state) params.set('state', state);
      if (city) params.set('city', city);
      if (pointsMin) params.set('pointsMin', pointsMin);
      if (pointsMax) params.set('pointsMax', pointsMax);
      if (selected?.country) params.set('selectedCountry', selected.country);
      if (selected?.state) params.set('selectedState', selected.state);
      if (selected?.city) params.set('selectedCity', selected.city);
      try {
        const response = await api.get(`/admin/community-map${params.toString() ? `?${params.toString()}` : ''}`);
        const nextPayload = response.data?.data ?? response.data;
        if (!cancelled) setPayload(nextPayload || emptyPayload);
      } catch {
        if (!cancelled) setError('Community map data could not be loaded.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [city, country, debouncedSearch, pointsMax, pointsMin, selected?.city, selected?.country, selected?.state, state, status]);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapElementRef.current || mapRef.current) return;
    let cancelled = false;
    void import('leaflet').then((leaflet) => {
      if (cancelled || !mapElementRef.current || mapRef.current) return;
      const map = leaflet.map(mapElementRef.current, { center: [22.5, 78.9], zoom: 3, minZoom: 2, maxZoom: 18, zoomControl: false, worldCopyJump: true });
      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', maxZoom: 19 }).addTo(map);
      leaflet.control.zoom({ position: 'bottomright' }).addTo(map);
      const markerLayer = leaflet.layerGroup().addTo(map);
      mapRef.current = map;
      markerLayerRef.current = markerLayer;
      map.on('zoomend', () => setZoom(map.getZoom()));
      const observer = new ResizeObserver(() => map.invalidateSize());
      observer.observe(mapElementRef.current);
      resizeObserverRef.current = observer;
      window.setTimeout(() => map.invalidateSize(), 100);
    });
    return () => {
      cancelled = true;
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  const activeLevel: MapLevel = zoom < 4.5 ? 'country' : zoom < 7.5 ? 'state' : 'city';
  const visibleLocations = useMemo(() => {
    const locations = payload.locations[activeLevel === 'country' ? 'countries' : activeLevel === 'state' ? 'states' : 'cities'];
    return locations.filter((location) => location.mapped && location.latitude !== null && location.longitude !== null);
  }, [activeLevel, payload.locations]);
  const allKnownCountries = useMemo(() => payload.locations.countries, [payload.locations.countries]);
  const knownStates = useMemo(() => payload.locations.states.filter((entry) => !country || normalize(entry.country) === normalize(country)), [country, payload.locations.states]);
  const knownCities = useMemo(() => payload.locations.cities.filter((entry) => (!country || normalize(entry.country) === normalize(country)) && (!state || normalize(entry.state) === normalize(state))), [country, payload.locations.cities, state]);
  const topCountries = payload.locations.countries.slice(0, 7);
  const topStates = payload.locations.states.slice(0, 7);
  const topCities = payload.locations.cities.slice(0, 7);

  useEffect(() => {
    const map = mapRef.current;
    const markerLayer = markerLayerRef.current;
    if (!map || !markerLayer) return;
    void import('leaflet').then((leaflet) => {
      markerLayer.clearLayers();
      markersRef.current = [];
      visibleLocations.forEach((location) => {
        const count = Math.max(1, location.users);
        const radius = Math.min(30, 9 + Math.sqrt(count) * 2.3);
        const marker = leaflet.circleMarker([location.latitude as number, location.longitude as number], {
          radius,
          color: '#0b4eae',
          weight: 2,
          fillColor: '#1460c2',
          fillOpacity: 0.82,
          className: selected?.key === location.key ? 'community-map-marker-selected' : '',
        });
        marker.bindTooltip(formatNumber(location.users), { permanent: true, direction: 'center', opacity: 1, className: 'community-map-count-tooltip' });
        marker.bindPopup(`<strong>${location.label}</strong><br />${formatNumber(location.users)} registered users`);
        marker.on('click', () => {
          setSelected(location);
          map.flyTo([location.latitude as number, location.longitude as number], location.level === 'country' ? 5 : location.level === 'state' ? 8 : 11, { duration: 0.7 });
        });
        marker.addTo(markerLayer);
        markersRef.current.push(marker);
      });
    });
  }, [selected?.key, visibleLocations]);

  useEffect(() => {
    window.setTimeout(() => mapRef.current?.invalidateSize(), 120);
  }, [fullscreen, view]);

  const clearFilters = () => {
    setSearch('');
    setStatus('all');
    setCountry('');
    setState('');
    setCity('');
    setPointsMin('');
    setPointsMax('');
    setSelected(null);
  };

  const selectLocation = (location: LocationSummary) => {
    setSelected(location);
    const map = mapRef.current;
    if (map && location.latitude !== null && location.longitude !== null) map.flyTo([location.latitude, location.longitude], location.level === 'country' ? 5 : location.level === 'state' ? 8 : 11, { duration: 0.7 });
  };

  const kpis = [
    ['Total users', payload.metrics.totalUsers, Users],
    ['Mapped', payload.metrics.mappedUsers, MapIcon],
    ['Countries', payload.metrics.countries, MapIcon],
    ['Cities', payload.metrics.cities, MapIcon],
    ['Active users', payload.metrics.activeUsers, Users],
    ['New this month', payload.metrics.newThisMonth, BarChart3],
  ] as const;

  return (
    <div className={fullscreen ? 'fixed inset-0 z-[100] overflow-y-auto bg-[#eef4f8] p-3 sm:p-5' : 'space-y-4'}>
      <section className="admin-section-shell rounded-[10px] border border-[#dce6f0] bg-white p-5 shadow-[0_3px_12px_rgba(15,55,95,0.05)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-sm font-black uppercase tracking-[0.26em] text-[#0b4eae]">K-CUBE Community Map</p><h2 className="mt-1 text-2xl font-black text-[#102a43]">Explore where the community is growing.</h2><p className="mt-1 text-sm leading-6 text-[#486581]">Live geographic analytics from registered K-CUBE users.</p></div>
          <div className="flex flex-wrap gap-2"><button type="button" onClick={() => setView(view === 'map' ? 'statistics' : 'map')} className="inline-flex items-center gap-2 rounded-lg border border-[#ccd9e6] px-3 py-2 text-xs font-black text-[#0b4eae]">{view === 'map' ? <BarChart3 className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}{view === 'map' ? 'Statistics' : 'Map'}</button><button type="button" onClick={() => setFullscreen(!fullscreen)} className="inline-flex items-center gap-2 rounded-lg bg-[#0b4eae] px-3 py-2 text-xs font-black text-white">{fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}{fullscreen ? 'Exit fullscreen' : 'Fullscreen'}</button></div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {kpis.map(([label, value, Icon]) => <div key={label} className="rounded-xl border border-[#dce6f0] bg-[#f8fbff] p-3"><div className="flex items-center justify-between gap-2"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#627d98]">{label}</p><Icon className="h-4 w-4 text-[#0b4eae]" /></div><p className="mt-2 text-2xl font-black text-[#102a43]">{loading ? '—' : formatNumber(value)}</p></div>)}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[10px] border border-[#dce6f0] bg-white p-4 shadow-[0_3px_12px_rgba(15,55,95,0.05)]">
          <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#0b4eae]">Explore</p><h3 className="mt-1 text-lg font-black text-[#102a43]">Filters & locations</h3></div>{(search || country || state || city || status !== 'all' || pointsMin || pointsMax) ? <button type="button" onClick={clearFilters} className="text-xs font-black text-[#b12704]">Clear</button> : null}</div>
          <label className="relative mt-4 block"><span className="sr-only">Search community</span><Search className="absolute left-3 top-2.5 h-4 w-4 text-[#627d98]" /><input className={`${inputClass} pl-9`} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users or locations" /></label>
          <div className="mt-3 grid gap-3"><label><span className="mb-1 block text-[10px] font-black uppercase tracking-[0.16em] text-[#0b4eae]">Status</span><select className={selectClass} value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All accounts</option><option value="active">Active</option><option value="suspended">Suspended</option><option value="pending">Pending</option></select></label><label><span className="mb-1 block text-[10px] font-black uppercase tracking-[0.16em] text-[#0b4eae]">Country</span><select className={selectClass} value={country} onChange={(event) => { setCountry(event.target.value); setState(''); setCity(''); }}><option value="">All countries</option>{allKnownCountries.map((entry) => <option key={entry.key} value={entry.country || ''}>{entry.label}</option>)}</select></label><label><span className="mb-1 block text-[10px] font-black uppercase tracking-[0.16em] text-[#0b4eae]">State / region</span><select className={selectClass} value={state} onChange={(event) => { setState(event.target.value); setCity(''); }}><option value="">All states</option>{knownStates.map((entry) => <option key={entry.key} value={entry.state || ''}>{entry.label}</option>)}</select></label><label><span className="mb-1 block text-[10px] font-black uppercase tracking-[0.16em] text-[#0b4eae]">City</span><select className={selectClass} value={city} onChange={(event) => setCity(event.target.value)}><option value="">All cities</option>{knownCities.map((entry) => <option key={entry.key} value={entry.city || ''}>{entry.label}</option>)}</select></label><div className="grid grid-cols-2 gap-2"><label><span className="mb-1 block text-[10px] font-black uppercase tracking-[0.16em] text-[#0b4eae]">Min points</span><input className={inputClass} type="number" min="0" value={pointsMin} onChange={(event) => setPointsMin(event.target.value)} /></label><label><span className="mb-1 block text-[10px] font-black uppercase tracking-[0.16em] text-[#0b4eae]">Max points</span><input className={inputClass} type="number" min="0" value={pointsMax} onChange={(event) => setPointsMax(event.target.value)} /></label></div></div>
          <div className="mt-5 border-t border-[#e8eef5] pt-4"><div className="flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#0b4eae]">Location hierarchy</p><span className="text-xs font-bold text-[#627d98]">Zoom: {zoom.toFixed(1)}</span></div><div className="mt-3 space-y-1.5">{[...payload.locations.countries.slice(0, 5), ...payload.locations.unknown].map((entry) => <button type="button" key={entry.key} onClick={() => entry.mapped ? selectLocation(entry) : setView('statistics')} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${selected?.key === entry.key ? 'bg-[#eaf3ff] text-[#0b4eae]' : 'hover:bg-[#f5f8fc] text-[#486581]'}`}><span className="truncate font-bold">{entry.label}</span><span className="ml-3 shrink-0 text-xs font-black">{formatNumber(entry.users)}</span></button>)}</div></div>
        </aside>

        <section className={fullscreen ? 'min-h-[calc(100vh-2rem)] rounded-[10px] border border-[#dce6f0] bg-white p-3 shadow-[0_3px_12px_rgba(15,55,95,0.05)]' : 'min-w-0 rounded-[10px] border border-[#dce6f0] bg-white p-3 shadow-[0_3px_12px_rgba(15,55,95,0.05)]'}>
          {error ? <div className="flex min-h-[520px] flex-col items-center justify-center rounded-lg bg-[#f8fbff] p-6 text-center"><p className="font-black text-[#102a43]">Unable to load the map</p><p className="mt-2 text-sm text-[#627d98]">{error}</p><button type="button" onClick={() => { setError(''); setDebouncedSearch(`${search} `); window.setTimeout(() => setDebouncedSearch(search), 10); }} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0b4eae] px-4 py-2 text-sm font-black text-white"><RefreshCw className="h-4 w-4" /> Retry</button></div> : view === 'statistics' ? <div className="grid gap-4 p-2 md:grid-cols-3"><StatList title="Top countries" items={topCountries} onSelect={selectLocation} /><StatList title="Top states" items={topStates} onSelect={selectLocation} /><StatList title="Top cities" items={topCities} onSelect={selectLocation} /><div className="rounded-xl border border-[#dce6f0] bg-[#f8fbff] p-4 md:col-span-3"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#0b4eae]">Coverage</p><p className="mt-1 text-lg font-black text-[#102a43]">{formatNumber(payload.metrics.mappedUsers)} mapped · {formatNumber(payload.metrics.unmappedUsers)} unmapped</p></div><p className="max-w-md text-sm leading-6 text-[#627d98]">Unknown locations remain included in the totals. Add a country, state, or city to the user profile to place them on the map.</p></div><div className="mt-4 h-3 overflow-hidden rounded-full bg-[#dce6f0]"><div className="h-full rounded-full bg-[#0b4eae]" style={{ width: `${payload.metrics.totalUsers ? (payload.metrics.mappedUsers / payload.metrics.totalUsers) * 100 : 0}%` }} /></div></div></div> : <div className="relative min-h-[560px] overflow-hidden rounded-lg border border-[#cfddea] bg-[#dfeaf4]"><div ref={mapElementRef} className="absolute inset-0 z-0" />{loading ? <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/65 backdrop-blur-[1px]"><div className="rounded-xl border border-[#dce6f0] bg-white px-4 py-3 text-sm font-bold text-[#486581]">Loading community map…</div></div> : null}<div className="absolute left-3 top-3 z-[400] rounded-lg border border-[#dce6f0] bg-white/95 px-3 py-2 text-xs font-bold text-[#486581] shadow-sm"><span className="font-black text-[#0b4eae]">{activeLevel === 'country' ? 'Countries' : activeLevel === 'state' ? 'States / regions' : 'Cities'}</span><span className="mx-1">·</span>{formatNumber(visibleLocations.reduce((sum, location) => sum + location.users, 0))} users</div>{selected ? <div className="absolute bottom-3 left-3 z-[400] w-[min(360px,calc(100%-1.5rem))] rounded-xl border border-[#dce6f0] bg-white/95 p-4 shadow-lg backdrop-blur-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0b4eae]">Selected {selected.level}</p><h3 className="mt-1 text-lg font-black text-[#102a43]">{selected.label}</h3></div><button type="button" onClick={() => setSelected(null)} className="rounded-full p-1 text-[#627d98] hover:bg-[#eef4f8]" aria-label="Close selected location"><X className="h-4 w-4" /></button></div><div className="mt-3 grid grid-cols-3 gap-2"><div><p className="text-[10px] uppercase text-[#627d98]">Users</p><p className="font-black text-[#102a43]">{formatNumber(selected.users)}</p></div><div><p className="text-[10px] uppercase text-[#627d98]">Active</p><p className="font-black text-[#102a43]">{formatNumber(selected.activeUsers)}</p></div><div><p className="text-[10px] uppercase text-[#627d98]">Points</p><p className="font-black text-[#102a43]">{formatNumber(selected.totalPoints)}</p></div></div><div className="mt-3 flex items-center justify-between gap-3"><p className="text-xs text-[#627d98]">{formatNumber(selected.newThisMonth)} new this month</p><button type="button" onClick={() => setView('statistics')} className="inline-flex items-center gap-1 text-xs font-black text-[#0b4eae]">View users <ChevronDown className="h-3.5 w-3.5 -rotate-90" /></button></div></div> : null}<div className="absolute bottom-3 right-3 z-[400] rounded-lg border border-[#dce6f0] bg-white/90 px-3 py-2 text-[10px] text-[#627d98] shadow-sm">OpenStreetMap · K-CUBE live data</div></div>}
        </section>
      </div>

      {selected ? <section className="rounded-[10px] border border-[#dce6f0] bg-white p-5 shadow-[0_3px_12px_rgba(15,55,95,0.05)]"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#0b4eae]">Users in {selected.label}</p><h3 className="mt-1 text-xl font-black text-[#102a43]">{formatNumber(payload.selectedUsers.length)} shown{selected.users > 100 ? ' · showing first 100' : ''}</h3></div><button type="button" onClick={() => setView('map')} className="text-sm font-black text-[#0b4eae]">Back to map</button></div>{payload.selectedUsers.length ? <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead><tr className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0b4eae]"><th className="border-b border-[#e8eef5] py-3">User</th><th className="border-b border-[#e8eef5] py-3">Status</th><th className="border-b border-[#e8eef5] py-3">Points</th><th className="border-b border-[#e8eef5] py-3">Joined</th><th className="border-b border-[#e8eef5] py-3">Action</th></tr></thead><tbody>{payload.selectedUsers.map((user) => <tr key={user.id}><td className="border-b border-[#e8eef5] py-3"><p className="font-bold text-[#102a43]">{user.full_name}</p><p className="text-xs text-[#627d98]">#{user.id}</p></td><td className="border-b border-[#e8eef5] py-3 capitalize text-[#486581]">{user.status}</td><td className="border-b border-[#e8eef5] py-3 font-bold text-[#102a43]">{formatNumber(user.points)}</td><td className="whitespace-nowrap border-b border-[#e8eef5] py-3 text-[#486581]">{new Date(user.created_at).toLocaleDateString()}</td><td className="border-b border-[#e8eef5] py-3"><button type="button" onClick={() => onViewUser?.(user.id)} className="inline-flex items-center gap-1 rounded-lg bg-[#0b4eae] px-3 py-2 text-xs font-black text-white">View user <ExternalLink className="h-3.5 w-3.5" /></button></td></tr>)}</tbody></table></div> : <div className="mt-4 rounded-xl border border-dashed border-[#cfddea] bg-[#f8fbff] p-6 text-center text-sm text-[#627d98]">No users match this location and filter combination.</div>}</section> : null}
    </div>
  );
};

const StatList = ({ title, items, onSelect }: { title: string; items: LocationSummary[]; onSelect: (item: LocationSummary) => void }) => (
  <div className="rounded-xl border border-[#dce6f0] bg-[#f8fbff] p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#0b4eae]">{title}</p><BarChart3 className="h-4 w-4 text-[#0b4eae]" /></div><div className="mt-3 space-y-2">{items.length ? items.map((item) => <button type="button" key={item.key} onClick={() => onSelect(item)} className="flex w-full items-center justify-between gap-3 text-left"><span className="min-w-0 truncate text-sm font-bold text-[#486581]">{item.label}</span><span className="shrink-0 text-sm font-black text-[#102a43]">{formatNumber(item.users)}</span></button>) : <p className="text-sm text-[#627d98]">No location data yet.</p>}</div></div>
);

export default CommunityMapPanel;
