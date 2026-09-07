'use client';

/* The initial geographic context is intentionally synchronized from the API payload. */
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CircleMarker, LayerGroup, LatLngBoundsExpression, Map as LeafletMap } from 'leaflet';
import { BarChart3, ChevronDown, ChevronRight, Maximize2, Map as MapIcon, Minimize2, RefreshCw, Search, X } from 'lucide-react';
import api from '@/lib/api';

type MapLevel = 'country' | 'state' | 'city' | 'unknown';
export type CommunityMapLocation = { key: string; level: MapLevel; label: string; country: string | null; state: string | null; city: string | null; users: number; activeUsers: number; verifiedUsers: number; totalPoints: number; newThisMonth: number; latitude: number | null; longitude: number | null; bounds: [[number, number], [number, number]] | null; mapped: boolean };
type LocationSummary = CommunityMapLocation;
type Focus = { country: LocationSummary | null; state: LocationSummary | null; city: LocationSummary | null };
type CommunityMapUser = { id: number; full_name: string; status: string; points: number; city: string | null; state: string | null; country: string | null; created_at: string; last_login: string | null };
type MapPayload = { metrics: { totalUsers: number; mappedUsers: number; unmappedUsers: number; countries: number; states: number; cities: number; newThisMonth: number; activeUsers: number; verifiedUsers: number }; locations: { countries: LocationSummary[]; states: LocationSummary[]; cities: LocationSummary[]; unknown: LocationSummary[] }; selectedUsers: CommunityMapUser[] };
type Props = { onViewUser?: (userId: number) => void; onViewMembers?: (location: LocationSummary) => void };

const emptyPayload: MapPayload = { metrics: { totalUsers: 0, mappedUsers: 0, unmappedUsers: 0, countries: 0, states: 0, cities: 0, newThisMonth: 0, activeUsers: 0, verifiedUsers: 0 }, locations: { countries: [], states: [], cities: [], unknown: [] }, selectedUsers: [] };
const emptyFocus: Focus = { country: null, state: null, city: null };
const inputClass = 'w-full rounded-[8px] border border-[#ccd9e6] bg-white px-3 py-2 text-sm text-[#102a43] outline-none transition placeholder:text-[#6b7c93] focus:border-[#0b4eae] focus:ring-2 focus:ring-[#0b4eae]/10';
const selectClass = 'w-full rounded-[8px] border border-[#ccd9e6] bg-white px-3 py-2 text-sm text-[#102a43] outline-none transition focus:border-[#0b4eae] focus:ring-2 focus:ring-[#0b4eae]/10';
const formatNumber = (value: number) => new Intl.NumberFormat('en-IN').format(Number(value || 0));
const normalize = (value: string | null | undefined) => String(value || '').trim().toLocaleLowerCase();
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character] || character));

const CommunityMapPanel = ({ onViewUser, onViewMembers }: Props) => {
  const [payload, setPayload] = useState<MapPayload>(emptyPayload);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [countryFilter, setCountryFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [pointsMin, setPointsMin] = useState('');
  const [pointsMax, setPointsMax] = useState('');
  const [visibleAggregationLevel, setVisibleAggregationLevel] = useState<MapLevel>('country');
  const [focus, setFocus] = useState<Focus>(emptyFocus);
  const [selectedLocation, setSelectedLocation] = useState<LocationSummary | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [view, setView] = useState<'map' | 'statistics'>('map');
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState('');
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerLayerRef = useRef<LayerGroup | null>(null);
  const markersRef = useRef<CircleMarker[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const autoFocusDoneRef = useRef(false);
  const semanticLevelRef = useRef<MapLevel>('country');

  useEffect(() => { const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 250); return () => window.clearTimeout(timer); }, [search]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true); setError('');
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('q', debouncedSearch);
      if (status !== 'all') params.set('status', status);
      if (countryFilter) params.set('country', countryFilter);
      if (stateFilter) params.set('state', stateFilter);
      if (cityFilter) params.set('city', cityFilter);
      if (pointsMin) params.set('pointsMin', pointsMin);
      if (pointsMax) params.set('pointsMax', pointsMax);
      if (selectedLocation?.country) params.set('selectedCountry', selectedLocation.country);
      if (selectedLocation?.state) params.set('selectedState', selectedLocation.state);
      if (selectedLocation?.city) params.set('selectedCity', selectedLocation.city);
      try { const response = await api.get(`/admin/community-map${params.toString() ? `?${params.toString()}` : ''}`); if (!cancelled) setPayload(response.data?.data ?? response.data ?? emptyPayload); } catch { if (!cancelled) setError('Community map data could not be loaded.'); } finally { if (!cancelled) setLoading(false); }
    };
    void load();
    return () => { cancelled = true; };
  }, [cityFilter, countryFilter, debouncedSearch, pointsMax, pointsMin, selectedLocation?.city, selectedLocation?.country, selectedLocation?.state, stateFilter, status]);

  const fitLocations = useCallback((locations: LocationSummary[], preferred?: LocationSummary | null) => {
    const map = mapRef.current;
    if (!map) return;
    if (preferred?.bounds) { map.fitBounds(preferred.bounds as LatLngBoundsExpression, { padding: [28, 28], maxZoom: preferred.level === 'country' ? 6 : 10, animate: true, duration: 0.7 }); return; }
    const mapped = locations.filter((location) => location.mapped && location.latitude !== null && location.longitude !== null);
    if (!mapped.length) return;
    if (mapped.length === 1) { map.flyTo([mapped[0].latitude as number, mapped[0].longitude as number], mapped[0].level === 'city' ? 11 : mapped[0].level === 'state' ? 8 : 5, { duration: 0.7 }); return; }
    map.fitBounds(mapped.map((location) => [location.latitude as number, location.longitude as number]) as LatLngBoundsExpression, { padding: [36, 36], maxZoom: 8, animate: true, duration: 0.7 });
  }, []);

  useEffect(() => {
    if (loading || !mapReady || autoFocusDoneRef.current || !payload.locations.countries.length) return;
    autoFocusDoneRef.current = true;
    if (payload.locations.countries.length === 1) {
      const onlyCountry = payload.locations.countries[0];
      const states = payload.locations.states.filter((entry) => normalize(entry.country) === normalize(onlyCountry.country));
      const cities = payload.locations.cities.filter((entry) => normalize(entry.country) === normalize(onlyCountry.country));
      setFocus({ country: onlyCountry, state: null, city: null }); setExpandedKeys(new Set([onlyCountry.key])); setVisibleAggregationLevel(states.length ? 'state' : cities.length ? 'city' : 'country');
      window.setTimeout(() => fitLocations([onlyCountry], onlyCountry), 120);
    } else window.setTimeout(() => fitLocations(payload.locations.countries), 120);
  }, [loading, mapReady, payload.locations.cities, payload.locations.countries, payload.locations.states, fitLocations]);

  useEffect(() => {
    if (view !== 'map' || !mapElementRef.current || mapRef.current) return;
    let cancelled = false;
    void import('leaflet').then((leaflet) => {
      if (cancelled || !mapElementRef.current || mapRef.current) return;
      const map = leaflet.map(mapElementRef.current, { center: [22.5, 78.9], zoom: 3, minZoom: 2, maxZoom: 18, zoomControl: false, worldCopyJump: true });
      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', maxZoom: 19 }).addTo(map);
      leaflet.control.zoom({ position: 'bottomright' }).addTo(map); mapRef.current = map; markerLayerRef.current = leaflet.layerGroup().addTo(map); setMapReady(true);
      const observer = new ResizeObserver(() => map.invalidateSize()); observer.observe(mapElementRef.current); resizeObserverRef.current = observer; window.setTimeout(() => map.invalidateSize(), 100);
    });
    return () => { cancelled = true; resizeObserverRef.current?.disconnect(); resizeObserverRef.current = null; mapRef.current?.remove(); mapRef.current = null; markerLayerRef.current = null; setMapReady(false); };
  }, [view]);

  useEffect(() => {
    semanticLevelRef.current = visibleAggregationLevel;
  }, [visibleAggregationLevel]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const syncSemanticLevel = () => {
      const zoom = map.getZoom();
      const currentLevel = semanticLevelRef.current;
      const nextLevel: MapLevel = currentLevel === 'country'
        ? zoom > 5.5 && payload.locations.states.length ? 'state' : 'country'
        : currentLevel === 'state'
          ? zoom < 4.5 ? 'country' : zoom > 8 && payload.locations.cities.length ? 'city' : 'state'
          : zoom < 7 && payload.locations.states.length ? 'state' : 'city';
      if (currentLevel === nextLevel) return;
      semanticLevelRef.current = nextLevel;
      setVisibleAggregationLevel(nextLevel);
      setSelectedLocation(null);
      setFocus((current) => nextLevel === 'country'
        ? { country: current.country, state: null, city: null }
        : nextLevel === 'state'
          ? { country: current.country, state: current.state, city: null }
          : current);
    };
    map.on('zoomend', syncSemanticLevel);
    syncSemanticLevel();
    return () => { map.off('zoomend', syncSemanticLevel); };
  }, [mapReady, payload.locations.cities.length, payload.locations.states.length]);

  const visibleMarkers = useMemo(() => {
    if (visibleAggregationLevel === 'country') return payload.locations.countries.filter((entry) => entry.mapped);
    if (visibleAggregationLevel === 'state') return payload.locations.states.filter((entry) => entry.mapped && (!focus.country || normalize(entry.country) === normalize(focus.country.country)));
    if (visibleAggregationLevel === 'city') return payload.locations.cities.filter((entry) => entry.mapped && (!focus.country || normalize(entry.country) === normalize(focus.country.country)) && (!focus.state || normalize(entry.state) === normalize(focus.state.state)));
    return [];
  }, [focus.country, focus.state, payload.locations.cities, payload.locations.countries, payload.locations.states, visibleAggregationLevel]);

  const selectLocation = useCallback((location: LocationSummary) => {
    if (location.level === 'unknown') { setView('statistics'); return; }
    if (location.country) setCountryFilter(location.country);
    if (location.level === 'country') { setStateFilter(''); setCityFilter(''); }
    if (location.level === 'state') { setStateFilter(location.state || ''); setCityFilter(''); }
    if (location.level === 'city') { setStateFilter(location.state || ''); setCityFilter(location.city || ''); }
    const country = payload.locations.countries.find((entry) => normalize(entry.country) === normalize(location.country)) || focus.country;
    const state = payload.locations.states.find((entry) => normalize(entry.country) === normalize(location.country) && normalize(entry.state) === normalize(location.state)) || focus.state;
    const nextFocus: Focus = location.level === 'country' ? { country: location, state: null, city: null } : location.level === 'state' ? { country, state: location, city: null } : { country, state, city: location };
    setFocus(nextFocus); setSelectedLocation(location); setExpandedKeys((current) => { const next = new Set(current); if (nextFocus.country) next.add(nextFocus.country.key); if (nextFocus.state) next.add(nextFocus.state.key); return next; });
    const nextLevel: MapLevel = location.level === 'country' ? (payload.locations.states.some((entry) => normalize(entry.country) === normalize(location.country)) ? 'state' : 'country') : location.level === 'state' ? (payload.locations.cities.some((entry) => normalize(entry.country) === normalize(location.country) && normalize(entry.state) === normalize(location.state)) ? 'city' : 'state') : 'city';
    setVisibleAggregationLevel(nextLevel);
    const nextMarkers = nextLevel === 'state' ? payload.locations.states.filter((entry) => normalize(entry.country) === normalize(location.country)) : nextLevel === 'city' ? payload.locations.cities.filter((entry) => normalize(entry.country) === normalize(location.country) && (!location.state || normalize(entry.state) === normalize(location.state))) : [location];
    window.setTimeout(() => fitLocations(nextMarkers, location.level === 'country' && location.bounds ? location : null), 60);
  }, [fitLocations, focus.country, focus.state, payload.locations.cities, payload.locations.countries, payload.locations.states]);

  useEffect(() => {
    if (!mapReady || loading || selectedLocation) return;
    const preferred = visibleAggregationLevel === 'country' && payload.locations.countries.length === 1 ? payload.locations.countries[0] : null;
    window.setTimeout(() => fitLocations(visibleMarkers, preferred), 80);
  }, [cityFilter, countryFilter, fitLocations, focus.country, focus.state, loading, mapReady, payload.locations.cities, payload.locations.countries, payload.locations.states, pointsMax, pointsMin, selectedLocation, stateFilter, status, visibleAggregationLevel, visibleMarkers]);

  useEffect(() => {
    const map = mapRef.current; const markerLayer = markerLayerRef.current; if (!map || !markerLayer) return;
    let cancelled = false;
    void import('leaflet').then((leaflet) => {
      if (cancelled) return;
      markerLayer.clearLayers(); markersRef.current = [];
      visibleMarkers.filter((location) => location.mapped && location.latitude !== null && location.longitude !== null).forEach((location) => {
        const radius = Math.min(30, 9 + Math.sqrt(Math.max(1, location.users)) * 2.3); const selected = selectedLocation?.key === location.key;
        const marker = leaflet.circleMarker([location.latitude as number, location.longitude as number], { radius, color: location.level === 'country' ? '#073a82' : location.level === 'state' ? '#0b4eae' : '#2979e8', weight: selected ? 4 : 2, fillColor: location.level === 'country' ? '#073a82' : location.level === 'state' ? '#0b4eae' : '#2979e8', fillOpacity: selected ? 0.95 : 0.8, className: selected ? 'community-map-marker-selected' : '' });
        marker.bindTooltip(`<strong>${formatNumber(location.users)}</strong><span>${escapeHtml(location.label)}</span>`, { permanent: true, direction: 'center', opacity: 1, className: 'community-map-count-tooltip' });
        marker.bindPopup(`<strong>${escapeHtml(location.label)}</strong><br />${formatNumber(location.users)} members`, { closeButton: false, offset: [0, -4] });
        marker.on('click', () => selectLocation(location)); marker.addTo(markerLayer); markersRef.current.push(marker);
      });
    });
    return () => { cancelled = true; markerLayer.clearLayers(); markersRef.current = []; };
  }, [selectLocation, selectedLocation?.key, visibleMarkers]);

  useEffect(() => { window.setTimeout(() => mapRef.current?.invalidateSize(), 120); }, [fullscreen, view]);

  const toggleExpanded = (key: string) => setExpandedKeys((current) => { const next = new Set(current); if (next.has(key)) next.delete(key); else next.add(key); return next; });
  const clearFilters = () => { setSearch(''); setStatus('all'); setCountryFilter(''); setStateFilter(''); setCityFilter(''); setPointsMin(''); setPointsMax(''); setFocus(emptyFocus); setSelectedLocation(null); setExpandedKeys(new Set()); setVisibleAggregationLevel('country'); autoFocusDoneRef.current = false; };
  const handleFilterCountry = (value: string) => { setCountryFilter(value); setStateFilter(''); setCityFilter(''); const entry = payload.locations.countries.find((candidate) => normalize(candidate.country) === normalize(value)); if (entry) selectLocation(entry); else { setFocus(emptyFocus); setSelectedLocation(null); setVisibleAggregationLevel('country'); } };
  const handleFilterState = (value: string) => { setStateFilter(value); setCityFilter(''); const entry = payload.locations.states.find((candidate) => normalize(candidate.state) === normalize(value) && (!countryFilter || normalize(candidate.country) === normalize(countryFilter))); if (entry) { if (entry.country) setCountryFilter(entry.country); selectLocation(entry); } };
  const handleFilterCity = (value: string) => { setCityFilter(value); const entry = payload.locations.cities.find((candidate) => normalize(candidate.city) === normalize(value) && (!stateFilter || normalize(candidate.state) === normalize(stateFilter))); if (entry) { if (entry.country) setCountryFilter(entry.country); if (entry.state) setStateFilter(entry.state); selectLocation(entry); } };
  const knownStates = payload.locations.states.filter((entry) => !countryFilter || normalize(entry.country) === normalize(countryFilter));
  const knownCities = payload.locations.cities.filter((entry) => (!countryFilter || normalize(entry.country) === normalize(countryFilter)) && (!stateFilter || normalize(entry.state) === normalize(stateFilter)));
  const breadcrumb = [<button key="world" type="button" onClick={clearFilters} className="hover:underline">World</button>];
  if (focus.country) breadcrumb.push(<><ChevronRight key="country-icon" className="inline h-3.5 w-3.5" /><button key="country" type="button" onClick={() => selectLocation(focus.country as LocationSummary)} className="hover:underline">{focus.country.label}</button></>);
  if (focus.state) breadcrumb.push(<><ChevronRight key="state-icon" className="inline h-3.5 w-3.5" /><button key="state" type="button" onClick={() => selectLocation(focus.state as LocationSummary)} className="hover:underline">{focus.state.label}</button></>);
  if (focus.city) breadcrumb.push(<><ChevronRight key="city-icon" className="inline h-3.5 w-3.5" /><span key="city">{focus.city.label}</span></>);
  const kpis = [['Community users', payload.metrics.totalUsers], ['Mapped', payload.metrics.mappedUsers], ['Unmapped', payload.metrics.unmappedUsers], ['Countries', payload.metrics.countries], ['Cities', payload.metrics.cities], ['Active accounts', payload.metrics.activeUsers]] as const;

  return <div className={fullscreen ? 'fixed inset-0 z-[100] overflow-y-auto bg-[#eef4f8] p-3 sm:p-5' : 'space-y-4'}>
    <section className="admin-section-shell rounded-[10px] border border-[#dce6f0] bg-white p-5 shadow-[0_3px_12px_rgba(15,55,95,0.05)]"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-black uppercase tracking-[0.26em] text-[#0b4eae]">K-CUBE Community Map</p><h2 className="mt-1 text-2xl font-black text-[#102a43]">Explore where the community is growing.</h2><div className="mt-2 flex items-center gap-1 text-sm font-bold text-[#486581]">{breadcrumb}</div></div><div className="flex gap-2"><button type="button" onClick={() => setView(view === 'map' ? 'statistics' : 'map')} className="inline-flex items-center gap-2 rounded-lg border border-[#ccd9e6] px-3 py-2 text-xs font-black text-[#0b4eae]">{view === 'map' ? <BarChart3 className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}{view === 'map' ? 'Statistics' : 'Map'}</button><button type="button" onClick={() => setFullscreen((current) => !current)} className="inline-flex items-center gap-2 rounded-lg bg-[#0b4eae] px-3 py-2 text-xs font-black text-white">{fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}{fullscreen ? 'Exit fullscreen' : 'Fullscreen'}</button></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">{kpis.map(([label, value]) => <div key={label} className="rounded-xl border border-[#dce6f0] bg-[#f8fbff] p-3"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#627d98]">{label}</p><p className="mt-2 text-2xl font-black text-[#102a43]">{loading ? '—' : formatNumber(value)}</p></div>)}</div></section>
    <div className="grid gap-4 xl:grid-cols-[270px_minmax(0,1fr)]"><aside className="rounded-[10px] border border-[#dce6f0] bg-white p-4 shadow-[0_3px_12px_rgba(15,55,95,0.05)]"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#0b4eae]">Explore</p><h3 className="mt-1 text-lg font-black text-[#102a43]">Filters & hierarchy</h3></div>{(search || countryFilter || stateFilter || cityFilter || status !== 'all' || pointsMin || pointsMax) ? <button type="button" onClick={clearFilters} className="text-xs font-black text-[#b12704]">Clear</button> : null}</div><label className="relative mt-4 block"><Search className="absolute left-3 top-2.5 h-4 w-4 text-[#627d98]" /><input className={`${inputClass} pl-9`} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users or places" aria-label="Search users or places" /></label><div className="mt-3 grid gap-2"><select className={selectClass} value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by account status"><option value="all">All accounts</option><option value="active">Active accounts</option><option value="suspended">Suspended</option><option value="pending">Pending</option></select><select className={selectClass} value={countryFilter} onChange={(event) => handleFilterCountry(event.target.value)} aria-label="Filter by country"><option value="">All countries</option>{payload.locations.countries.map((entry) => <option key={entry.key} value={entry.country || ''}>{entry.label}</option>)}</select><select className={selectClass} value={stateFilter} onChange={(event) => handleFilterState(event.target.value)} aria-label="Filter by state"><option value="">All states / regions</option>{knownStates.map((entry) => <option key={entry.key} value={entry.state || ''}>{entry.label}</option>)}</select><select className={selectClass} value={cityFilter} onChange={(event) => handleFilterCity(event.target.value)} aria-label="Filter by city"><option value="">All cities</option>{knownCities.map((entry) => <option key={entry.key} value={entry.city || ''}>{entry.label}</option>)}</select><div className="grid grid-cols-2 gap-2"><input className={inputClass} type="number" min="0" value={pointsMin} onChange={(event) => setPointsMin(event.target.value)} placeholder="Min points" aria-label="Minimum points" /><input className={inputClass} type="number" min="0" value={pointsMax} onChange={(event) => setPointsMax(event.target.value)} placeholder="Max points" aria-label="Maximum points" /></div></div><div className="mt-5 border-t border-[#e8eef5] pt-4"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#0b4eae]">Location hierarchy</p><div className="mt-3 space-y-1.5"><Hierarchy locations={payload.locations.countries} states={payload.locations.states} cities={payload.locations.cities} focus={focus} expandedKeys={expandedKeys} onToggle={toggleExpanded} onSelect={selectLocation} /></div></div></aside><section className={fullscreen ? 'min-h-[calc(100vh-2rem)] rounded-[10px] border border-[#dce6f0] bg-white p-3 shadow-[0_3px_12px_rgba(15,55,95,0.05)]' : 'min-w-0 rounded-[10px] border border-[#dce6f0] bg-white p-3 shadow-[0_3px_12px_rgba(15,55,95,0.05)]'}>{error ? <div className="flex min-h-[560px] flex-col items-center justify-center rounded-lg bg-[#f8fbff] p-6 text-center"><p className="font-black text-[#102a43]">Unable to load the map</p><p className="mt-2 text-sm text-[#627d98]">{error}</p><button type="button" onClick={() => { setError(''); setDebouncedSearch(`${search} `); window.setTimeout(() => setDebouncedSearch(search), 10); }} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0b4eae] px-4 py-2 text-sm font-black text-white"><RefreshCw className="h-4 w-4" /> Retry</button></div> : view === 'statistics' ? <div className="grid gap-4 p-2 md:grid-cols-3"><StatList title="Top countries" items={payload.locations.countries.slice(0, 8)} onSelect={selectLocation} /><StatList title="Top states" items={payload.locations.states.slice(0, 8)} onSelect={selectLocation} /><StatList title="Top cities" items={payload.locations.cities.slice(0, 8)} onSelect={selectLocation} /><div className="rounded-xl border border-[#dce6f0] bg-[#f8fbff] p-4 md:col-span-3"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#0b4eae]">Coverage</p><p className="mt-1 text-lg font-black text-[#102a43]">{formatNumber(payload.metrics.mappedUsers)} mapped · {formatNumber(payload.metrics.unmappedUsers)} unmapped</p><div className="mt-4 h-3 overflow-hidden rounded-full bg-[#dce6f0]"><div className="h-full rounded-full bg-[#0b4eae]" style={{ width: `${payload.metrics.totalUsers ? (payload.metrics.mappedUsers / payload.metrics.totalUsers) * 100 : 0}%` }} /></div></div></div> : <div className="relative min-h-[560px] overflow-hidden rounded-lg border border-[#cfddea] bg-[#dfeaf4]"><div ref={mapElementRef} className="absolute inset-0 z-0" />{loading ? <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/65"><div className="rounded-xl border border-[#dce6f0] bg-white px-4 py-3 text-sm font-bold text-[#486581]">Loading community map…</div></div> : null}<div className="absolute left-3 top-3 z-[400] rounded-lg border border-[#dce6f0] bg-white/95 px-3 py-2 text-xs font-bold text-[#486581] shadow-sm"><span className="font-black text-[#0b4eae]">{visibleAggregationLevel === 'country' ? 'World' : visibleAggregationLevel === 'state' ? 'States / regions' : 'Cities'}</span><span className="mx-1">·</span>{formatNumber(visibleMarkers.reduce((sum, location) => sum + location.users, 0))} members</div>{selectedLocation ? <SelectedLocationCard location={selectedLocation} users={payload.selectedUsers} onClose={() => setSelectedLocation(null)} onViewMembers={() => onViewMembers?.(selectedLocation)} onViewUser={onViewUser} /> : null}<div className="absolute bottom-3 right-3 z-[400] rounded-lg border border-[#dce6f0] bg-white/90 px-3 py-2 text-[10px] text-[#627d98] shadow-sm">OpenStreetMap · K-CUBE live data</div></div>}</section></div>
    {!selectedLocation && !loading && !payload.metrics.mappedUsers ? <div className="rounded-xl border border-dashed border-[#cfddea] bg-white p-6 text-center text-sm text-[#627d98]">No mapped location data is available yet. {formatNumber(payload.metrics.unmappedUsers)} users remain in the unmapped total.</div> : null}
  </div>;
};

const Hierarchy = ({ locations, states, cities, focus, expandedKeys, onToggle, onSelect }: { locations: LocationSummary[]; states: LocationSummary[]; cities: LocationSummary[]; focus: Focus; expandedKeys: Set<string>; onToggle: (key: string) => void; onSelect: (location: LocationSummary) => void }) => <>{locations.map((country) => { const countryStates = states.filter((entry) => normalize(entry.country) === normalize(country.country)); const expanded = expandedKeys.has(country.key); return <div key={country.key}><div className="flex items-center gap-1"><button type="button" onClick={() => onToggle(country.key)} className="rounded p-1 text-[#627d98] hover:bg-[#eef4f8]" aria-label={`${expanded ? 'Collapse' : 'Expand'} ${country.label}`}>{countryStates.length ? (expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />) : <span className="inline-block w-3.5" />}</button><button type="button" onClick={() => onSelect(country)} className={`flex min-w-0 flex-1 items-center justify-between rounded-lg px-2 py-2 text-left text-sm ${focus.country?.key === country.key && !focus.state ? 'bg-[#eaf3ff] text-[#0b4eae]' : 'text-[#486581] hover:bg-[#f5f8fc]'}`}><span className="truncate font-black">{country.label}</span><span className="ml-2 shrink-0 text-xs font-black">{formatNumber(country.users)}</span></button></div>{expanded ? <div className="ml-5 border-l border-[#dce6f0] pl-2">{countryStates.map((state) => { const stateCities = cities.filter((entry) => normalize(entry.country) === normalize(state.country) && normalize(entry.state) === normalize(state.state)); const stateExpanded = expandedKeys.has(state.key); return <div key={state.key}><div className="flex items-center gap-1"><button type="button" onClick={() => onToggle(state.key)} className="rounded p-1 text-[#627d98] hover:bg-[#eef4f8]" aria-label={`${stateExpanded ? 'Collapse' : 'Expand'} ${state.label}`}>{stateCities.length ? (stateExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />) : <span className="inline-block w-3.5" />}</button><button type="button" onClick={() => onSelect(state)} className={`flex min-w-0 flex-1 items-center justify-between rounded-lg px-2 py-2 text-left text-sm ${focus.state?.key === state.key ? 'bg-[#eaf3ff] text-[#0b4eae]' : 'text-[#486581] hover:bg-[#f5f8fc]'}`}><span className="truncate font-bold">{state.label}</span><span className="ml-2 shrink-0 text-xs font-black">{formatNumber(state.users)}</span></button></div>{stateExpanded ? <div className="ml-5 space-y-1 border-l border-[#e8eef5] pl-2">{stateCities.map((city) => <button type="button" key={city.key} onClick={() => onSelect(city)} className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs ${focus.city?.key === city.key ? 'bg-[#eaf3ff] text-[#0b4eae]' : 'text-[#627d98] hover:bg-[#f5f8fc]'}`}><span className="truncate">{city.label}</span><span className="ml-2 shrink-0 font-black">{formatNumber(city.users)}</span></button>)}</div> : null}</div>; })}</div> : null}</div>; })}</>;

const SelectedLocationCard = ({ location, users, onClose, onViewMembers, onViewUser }: { location: LocationSummary; users: CommunityMapUser[]; onClose: () => void; onViewMembers: () => void; onViewUser?: (userId: number) => void }) => <div className="absolute right-3 top-3 z-[410] w-[min(330px,calc(100%-1.5rem))] rounded-xl border border-[#dce6f0] bg-white/95 p-4 shadow-lg backdrop-blur-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0b4eae]">Selected {location.level}</p><h3 className="mt-1 text-lg font-black text-[#102a43]">{location.label}</h3></div><button type="button" onClick={onClose} className="rounded-full p-1 text-[#627d98] hover:bg-[#eef4f8]" aria-label="Close selected location"><X className="h-4 w-4" /></button></div><div className="mt-3 grid grid-cols-3 gap-2"><div><p className="text-[10px] uppercase text-[#627d98]">Members</p><p className="font-black text-[#102a43]">{formatNumber(location.users)}</p></div><div><p className="text-[10px] uppercase text-[#627d98]">Active</p><p className="font-black text-[#102a43]">{formatNumber(location.activeUsers)}</p></div><div><p className="text-[10px] uppercase text-[#627d98]">Points</p><p className="font-black text-[#102a43]">{formatNumber(location.totalPoints)}</p></div></div><p className="mt-2 text-xs text-[#627d98]">{formatNumber(location.newThisMonth)} new registrations this month</p><div className="mt-3 border-t border-[#e8eef5] pt-3"><div className="flex items-center justify-between gap-2"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0b4eae]">Member preview</p><button type="button" onClick={onViewMembers} className="text-xs font-black text-[#0b4eae]">View all →</button></div><div className="mt-2 space-y-1.5">{users.slice(0, 5).map((user) => <button type="button" key={user.id} onClick={() => onViewUser?.(user.id)} className="flex w-full items-center justify-between gap-3 text-left text-xs hover:text-[#0b4eae]"><span className="truncate font-bold text-[#486581]">{user.full_name}</span><span className="shrink-0 font-black text-[#102a43]">{formatNumber(user.points)} pts</span></button>)}{!users.length ? <p className="text-xs text-[#627d98]">No members match the current filters.</p> : null}</div></div></div>;

const StatList = ({ title, items, onSelect }: { title: string; items: LocationSummary[]; onSelect: (item: LocationSummary) => void }) => <div className="rounded-xl border border-[#dce6f0] bg-[#f8fbff] p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#0b4eae]">{title}</p><BarChart3 className="h-4 w-4 text-[#0b4eae]" /></div><div className="mt-3 space-y-2">{items.length ? items.map((item) => <button type="button" key={item.key} onClick={() => onSelect(item)} className="flex w-full items-center justify-between gap-3 text-left"><span className="min-w-0 truncate text-sm font-bold text-[#486581]">{item.label}</span><span className="shrink-0 text-sm font-black text-[#102a43]">{formatNumber(item.users)}</span></button>) : <p className="text-sm text-[#627d98]">No location data yet.</p>}</div></div>;

export default CommunityMapPanel;
