import { Request, Response } from 'express';
import pool from '../db/pool';
import { fail, ok } from '../lib/apiResponse';

type MapLevel = 'country' | 'state' | 'city' | 'unknown';

type CommunityUser = {
  id: number;
  full_name: string;
  status: string;
  points: number;
  city: string | null;
  state: string | null;
  country: string | null;
  created_at: string;
  last_login: string | null;
  verified: number;
};

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
  bounds: [[number, number], [number, number]] | null;
  mapped: boolean;
};

const normalizePart = (value: unknown) => String(value || '').replace(/\s+/g, ' ').trim();
const keyPart = (value: unknown) => normalizePart(value).toLocaleLowerCase();

const countryCoordinates: Record<string, [number, number]> = {
  india: [22.5937, 78.9629],
  'south korea': [35.9078, 127.7669],
  korea: [35.9078, 127.7669],
  usa: [39.8283, -98.5795],
  'united states': [39.8283, -98.5795],
  'united states of america': [39.8283, -98.5795],
  canada: [56.1304, -106.3468],
  'united kingdom': [55.3781, -3.436],
  uk: [55.3781, -3.436],
  nepal: [28.3949, 84.124],
  bangladesh: [23.685, 90.3563],
  australia: [-25.2744, 133.7751],
  japan: [36.2048, 138.2529],
  singapore: [1.3521, 103.8198],
  germany: [51.1657, 10.4515],
  france: [46.2276, 2.2137],
  'united arab emirates': [23.4241, 53.8478],
  uae: [23.4241, 53.8478],
};

const countryBounds: Record<string, [[number, number], [number, number]]> = {
  india: [[6.4, 68.1], [35.7, 97.4]],
  'south korea': [[33.1, 124.5], [38.6, 130.9]],
  korea: [[33.1, 124.5], [38.6, 130.9]],
  usa: [[24.3, -124.8], [49.4, -66.9]],
  'united states': [[24.3, -124.8], [49.4, -66.9]],
  'united states of america': [[24.3, -124.8], [49.4, -66.9]],
  canada: [[41.7, -141], [83.1, -52.6]],
  'united kingdom': [[49.8, -8.6], [60.9, 1.8]],
  uk: [[49.8, -8.6], [60.9, 1.8]],
  nepal: [[26.3, 80], [30.5, 88.2]],
  bangladesh: [[20.7, 88], [26.7, 92.7]],
  australia: [[-43.7, 113], [-10.6, 153.6]],
  japan: [[24, 122.9], [45.6, 145.8]],
  singapore: [[1.1, 103.6], [1.5, 104.1]],
};

const stateCoordinates: Record<string, [number, number]> = {
  'india|delhi': [28.7041, 77.1025],
  'india|manipur': [24.6637, 93.9063],
  'india|maharashtra': [19.7515, 75.7139],
  'india|haryana': [29.0588, 76.0856],
  'india|uttar pradesh': [26.8467, 80.9462],
  'india|karnataka': [15.3173, 75.7139],
  'india|west bengal': [22.9868, 87.855],
  'india|tamil nadu': [11.1271, 78.6569],
  'india|telangana': [18.1124, 79.0193],
  'india|kerala': [10.8505, 76.2711],
  'india|rajasthan': [27.0238, 74.2179],
  'india|gujarat': [22.2587, 71.1924],
  'india|punjab': [31.1471, 75.3412],
  'india|assam': [26.2006, 92.9376],
};

const cityCoordinates: Record<string, [number, number]> = {
  'india|delhi|new delhi': [28.6139, 77.209],
  'india|delhi|delhi': [28.6139, 77.209],
  'india|uttar pradesh|noida': [28.5355, 77.391],
  'india|haryana|gurugram': [28.4595, 77.0266],
  'india|haryana|gurgaon': [28.4595, 77.0266],
  'india|maharashtra|mumbai': [19.076, 72.8777],
  'india|maharashtra|pune': [18.5204, 73.8567],
  'india|manipur|imphal': [24.817, 93.9368],
  'india|karnataka|bengaluru': [12.9716, 77.5946],
  'india|karnataka|bangalore': [12.9716, 77.5946],
  'india|west bengal|kolkata': [22.5726, 88.3639],
  'india|tamil nadu|chennai': [13.0827, 80.2707],
  'india|telangana|hyderabad': [17.385, 78.4867],
  'india|kerala|kochi': [9.9312, 76.2673],
  'india|rajasthan|jaipur': [26.9124, 75.7873],
  'india|gujarat|ahmedabad': [23.0225, 72.5714],
  'india|assam|guwahati': [26.1445, 91.7362],
  'south korea||seoul': [37.5665, 126.978],
  'south korea||busan': [35.1796, 129.0756],
  'japan||tokyo': [35.6762, 139.6503],
  'singapore||singapore': [1.3521, 103.8198],
};

const cityCoordinateEntry = (countryKey: string, stateKey: string, cityKey: string) => Object.entries(cityCoordinates).find(([key]) => {
  const [entryCountry, entryState, entryCity] = key.split('|');
  return entryCountry === countryKey && entryCity === cityKey && (!stateKey || entryState === stateKey);
  });

const knownStateForCity = (country: string | null, state: string | null, city: string | null) => {
  const entry = cityCoordinateEntry(keyPart(country), keyPart(state), keyPart(city));
  return entry?.[0].split('|')[1] || null;
};

const coordinatesFor = (country: string | null, state: string | null, city: string | null, level: MapLevel) => {
  const countryKey = keyPart(country);
  const stateKey = keyPart(state);
  const cityKey = keyPart(city);
  const coords = level === 'city'
    ? cityCoordinateEntry(countryKey, stateKey, cityKey)?.[1]
    : level === 'state'
      ? stateCoordinates[`${countryKey}|${stateKey}`]
      : countryCoordinates[countryKey];
  return coords ? { latitude: coords[0], longitude: coords[1], bounds: level === 'country' ? countryBounds[countryKey] || null : null, mapped: true } : { latitude: null, longitude: null, bounds: null, mapped: false };
};

// City is preferred over state. For known cities, infer the state only for hierarchy/map context.
// The current business rule places Indian profiles without city and state in Delhi for map presentation.
// The stored user record is never modified; this only supplies a conservative display fallback.
const effectiveState = (user: CommunityUser) => normalizePart(user.state) || knownStateForCity(user.country, user.state, user.city) || (!normalizePart(user.city) && keyPart(user.country) === 'india' ? 'Delhi' : null);

const locationLevel = (user: CommunityUser): MapLevel => {
  const state = effectiveState(user);
  if (normalizePart(user.city) && coordinatesFor(user.country, state, user.city, 'city').mapped) return 'city';
  if (state && coordinatesFor(user.country, state, user.city, 'state').mapped) return 'state';
  if (normalizePart(user.country) && coordinatesFor(user.country, user.state, user.city, 'country').mapped) return 'country';
  return 'unknown';
};

const emptySummary = (key: string, level: MapLevel, country: string | null, state: string | null, city: string | null, label: string): LocationSummary => ({
  key,
  level,
  label,
  country,
  state,
  city,
  users: 0,
  activeUsers: 0,
  verifiedUsers: 0,
  totalPoints: 0,
  newThisMonth: 0,
  ...coordinatesFor(country, state, city, level),
});

const addUserToSummary = (summary: LocationSummary, user: CommunityUser, monthStart: number) => {
  summary.users += 1;
  summary.activeUsers += user.status === 'active' ? 1 : 0;
  summary.verifiedUsers += Number(user.verified) ? 1 : 0;
  summary.totalPoints += Number(user.points || 0);
  summary.newThisMonth += new Date(user.created_at).getTime() >= monthStart ? 1 : 0;
};

const buildLocation = (user: CommunityUser, level: MapLevel): LocationSummary => {
  const country = normalizePart(user.country) || null;
  const state = effectiveState(user);
  const city = normalizePart(user.city) || null;
  if (level === 'unknown') return emptySummary('unknown', 'unknown', null, null, null, 'Unknown / unmapped');
  if (level === 'country') return emptySummary(`country:${keyPart(country)}`, level, country, null, null, country || 'Unknown country');
  if (level === 'state') return emptySummary(`state:${keyPart(country)}:${keyPart(state)}`, level, country, state, null, state || 'Unknown state');
  return emptySummary(`city:${keyPart(country)}:${keyPart(state)}:${keyPart(city)}`, level, country, state, city, city || 'Unknown city');
};

const aggregate = (users: CommunityUser[], level: MapLevel, monthStart: number) => {
  const groups = new Map<string, LocationSummary>();
  users.forEach((user) => {
    const resolved = locationLevel(user);
    const groupLevel: MapLevel | null = level === 'unknown' ? (resolved === 'unknown' ? 'unknown' : null) : resolved === 'unknown' ? 'unknown' : level;
    if (!groupLevel) return;
    const summary = buildLocation(user, groupLevel);
    const existing = groups.get(summary.key) || summary;
    addUserToSummary(existing, user, monthStart);
    groups.set(summary.key, existing);
  });
  return [...groups.values()].sort((left, right) => right.users - left.users || left.label.localeCompare(right.label));
};

const queryUsers = async (req: Request) => {
  const { q, status, country, state, city, dateFrom, dateTo, pointsMin, pointsMax } = req.query;
  const where: string[] = ["u.status <> 'deleted'", "u.role NOT IN ('admin', 'manager')"];
  const values: unknown[] = [];
  if (q) {
    where.push('(u.full_name LIKE ? OR u.email LIKE ? OR u.city LIKE ? OR u.state LIKE ? OR u.country LIKE ?)');
    const search = `%${String(q).trim()}%`;
    values.push(search, search, search, search, search);
  }
  if (status && ['active', 'suspended', 'pending'].includes(String(status))) {
    where.push('u.status = ?');
    values.push(status);
  }
  if (country) { where.push('LOWER(TRIM(u.country)) = LOWER(TRIM(?))'); values.push(country); }
  if (state) { where.push('LOWER(TRIM(u.state)) = LOWER(TRIM(?))'); values.push(state); }
  if (city) { where.push('LOWER(TRIM(u.city)) = LOWER(TRIM(?))'); values.push(city); }
  if (dateFrom) { where.push('u.created_at >= ?'); values.push(dateFrom); }
  if (dateTo) { where.push('u.created_at < DATE_ADD(?, INTERVAL 1 DAY)'); values.push(dateTo); }
  if (pointsMin !== undefined && pointsMin !== '') { where.push('u.points >= ?'); values.push(Number(pointsMin)); }
  if (pointsMax !== undefined && pointsMax !== '') { where.push('u.points <= ?'); values.push(Number(pointsMax)); }
  const [rows] = await pool.query(
    `SELECT u.id, u.full_name, u.status, u.points, u.city, u.state, u.country, u.created_at, u.last_login,
      COALESCE(MAX(CASE WHEN ai.verified = TRUE THEN 1 ELSE 0 END), 0) AS verified
     FROM users u
     LEFT JOIN auth_identities ai ON ai.user_id = u.id
     WHERE ${where.join(' AND ')}
     GROUP BY u.id, u.full_name, u.status, u.points, u.city, u.state, u.country, u.created_at, u.last_login
     ORDER BY u.created_at DESC, u.id DESC`,
    values,
  );
  return rows as CommunityUser[];
};

export const getCommunityMap = async (req: Request, res: Response) => {
  try {
    const users = await queryUsers(req);
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthStartTime = monthStart.getTime();
    const mappedUsers = users.filter((user) => locationLevel(user) !== 'unknown');
    const selectedCountry = normalizePart(req.query.selectedCountry);
    const selectedState = normalizePart(req.query.selectedState);
    const selectedCity = normalizePart(req.query.selectedCity);
    const selectedUsers = users
      .filter((user) => (!selectedCountry || keyPart(user.country) === keyPart(selectedCountry)) && (!selectedState || keyPart(effectiveState(user)) === keyPart(selectedState)) && (!selectedCity || keyPart(user.city) === keyPart(selectedCity)))
      .slice(0, 100)
      .map(({ id, full_name, status, points, city, state, country, created_at, last_login }) => ({ id, full_name, status, points, city, state, country, created_at, last_login }));
    const metrics = {
      totalUsers: users.length,
      mappedUsers: mappedUsers.length,
      unmappedUsers: users.length - mappedUsers.length,
      countries: new Set(users.map((user) => keyPart(user.country)).filter(Boolean)).size,
      states: new Set(aggregate(users, 'state', monthStartTime).map((location) => location.key)).size,
      cities: new Set(aggregate(users, 'city', monthStartTime).map((location) => location.key)).size,
      newThisMonth: users.filter((user) => new Date(user.created_at).getTime() >= monthStartTime).length,
      activeUsers: users.filter((user) => user.status === 'active').length,
      verifiedUsers: users.filter((user) => Number(user.verified)).length,
    };
    return ok(res, {
      metrics,
      locations: {
        countries: aggregate(users, 'country', monthStartTime),
        states: aggregate(users, 'state', monthStartTime),
        cities: aggregate(users, 'city', monthStartTime),
        unknown: aggregate(users, 'unknown', monthStartTime),
      },
      selectedUsers,
    });
  } catch (error) {
    console.error('Community map query failed', error);
    return fail(res, 500, 'COMMUNITY_MAP_ERROR', 'Community map data could not be loaded');
  }
};
