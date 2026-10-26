import { Country, State, City } from 'country-state-city';

export const locationKey = (value: unknown) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase().replace(/\s+/g, ' ');
const aliases: Record<string, string> = { korea: 'KR', 'south korea': 'KR', usa: 'US', uk: 'GB', uae: 'AE', 'united states of america': 'US' };
export const findCountry = (name: unknown) => {
  const key = locationKey(name);
  return Country.getCountryByCode(aliases[key] || String(name || '').toUpperCase()) || Country.getAllCountries().find(country => locationKey(country.name) === key);
};
export const findState = (country: string | null, state: string | null) => {
  const match = findCountry(country);
  return match ? State.getStatesOfCountry(match.isoCode).find(item => locationKey(item.name) === locationKey(state) || item.isoCode.toLowerCase() === locationKey(state)) : undefined;
};
const cityCache = new Map<string, NonNullable<ReturnType<typeof City.getCitiesOfCountry>>>();
const resolvedCities = new Map<string, ReturnType<typeof City.getCitiesOfState>[number] | undefined>();
export const findCity = (country: string | null, state: string | null, city: string | null) => {
  const match = findCountry(country);
  if (!match || !city) return undefined;
  const region = findState(country, state);
  if (state && !region) return undefined;
  const lookupKey = `${match.isoCode}|${region?.isoCode || ''}|${locationKey(city)}`;
  if (resolvedCities.has(lookupKey)) return resolvedCities.get(lookupKey);
  let cities = cityCache.get(match.isoCode);
  if (!cities) { cities = City.getCitiesOfCountry(match.isoCode) || []; cityCache.set(match.isoCode, cities); }
  const aliases: Record<string, string> = { bangalore: 'bengaluru', gurgaon: 'gurugram' };
  const name = aliases[locationKey(city)] || locationKey(city);
  const matches = cities.filter(item => (locationKey(item.name) === name || locationKey(item.name) === locationKey(city)) && (!region || item.stateCode === region.isoCode));
  // A repeated city name without a state is ambiguous; never guess a pin.
  const result = matches.length === 1 ? matches[0] : undefined;
  resolvedCities.set(lookupKey, result);
  return result;
};
export const geographicCoordinates = (country: string | null, state: string | null, city: string | null, level: string) => {
  const entry = level === 'city' ? findCity(country, state, city) : level === 'state' ? findState(country, state) : findCountry(country);
  if (!entry?.latitude || !entry.longitude) return undefined;
  const latitude = Number(entry.latitude), longitude = Number(entry.longitude);
  return Number.isFinite(latitude) && Number.isFinite(longitude) ? [latitude, longitude] as [number, number] : undefined;
};
export const inferredState = (country: string | null, city: string | null) => {
  const match = findCity(country, null, city);
  return match ? State.getStateByCodeAndCountry(match.stateCode, match.countryCode)?.name || null : null;
};
export const locationOptions = (country?: string, state?: string) => {
  if (!country) return Country.getAllCountries().map(item => ({ name: item.name, code: item.isoCode }));
  const match = findCountry(country);
  if (!match) return [];
  if (!state) return State.getStatesOfCountry(match.isoCode).map(item => ({ name: item.name, code: item.isoCode }));
  const region = findState(country, state);
  return region ? City.getCitiesOfState(match.isoCode, region.isoCode).map(item => ({ name: item.name, code: item.name })) : [];
};
