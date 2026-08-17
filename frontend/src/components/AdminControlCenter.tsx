"use client";

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clapperboard,
  Coins,
  FilePenLine,
  Gift,
  LayoutDashboard,
  Save,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  KeyRound,
  UserCog,
  Mic2,
  Trash2,
  Users,
} from 'lucide-react';
import api from '@/lib/api';
import { detailItems } from '@/lib/kcubeContent';
import { useAppStore } from '@/store/useAppStore';

type AdminSection =
  | 'overview'
  | 'adminProfile'
  | 'adminAccounts'
  | 'submissions'
  | 'website'
  | 'learning'
  | 'users'
  | 'points'
  | 'chapters'
  | 'uploads'
  | 'indiaPreSelection'
  | 'kfood'
  | 'events'
  | 'rewards'
  | 'announcements'
  | 'calendar'
  | 'analytics';

type LearningTrackRow = {
  id: number;
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  accent: string;
  rewardPoints: number;
  bankSize: number;
  stepSize: number;
  overview: string[];
  loginCopy: string[];
  active: boolean;
  sortOrder: number;
};

type LearningQuestionRow = {
  id: number;
  trackId: number;
  trackSlug: string;
  trackTitle: string;
  questionKey: string;
  type: string;
  tag: string;
  prompt: string;
  korean: string;
  answer: string;
  options: string[];
  words: string[];
  cards: Array<{ korean: string; label: string; visual: string }>;
  pairs: Array<{ korean: string; label: string }>;
  hint: string;
  points: number;
  sortOrder: number;
  active: boolean;
};

type CmsPageRow = {
  id: number;
  slug: string;
  pageType: string;
  titleEn: string;
  titleKo: string | null;
  titleHi: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: string;
  publishedAt: string | null;
};

type ChapterRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  city: string;
  state: string;
  country: string;
  leader_id: number | null;
  leader_name: string | null;
  leader_email: string | null;
  member_count: number;
  latitude: number | null;
  longitude: number | null;
  status: string;
  created_at: string;
  updated_at: string;
};

type CmsBlockRow = {
  id: number;
  page_id: number;
  page_slug: string;
  page_title: string;
  block_key: string;
  block_type: string;
  sort_order: number;
  content_en: unknown;
  content_ko: unknown;
  content_hi: unknown;
  status: string;
  created_at: string;
  updated_at: string;
};

type UserRow = {
  id: number;
  full_name: string;
  username: string;
  email: string;
  phone: string | null;
  role: string;
  category_access: string;
  xp: number;
  points: number;
  level: number;
  streak: number;
  status: string;
  city: string | null;
  state: string | null;
  country: string | null;
  profile_image: string | null;
  referral_code: string | null;
  referred_by: string | null;
  created_at: string;
  last_login: string | null;
};

type UploadRow = {
  id: number;
  title: string;
  category: string;
  status: string;
  points_reward: number;
  review_note: string | null;
  full_name: string | null;
  email: string | null;
  created_at: string;
};

type PointTxRow = {
  id: number;
  source_type: string;
  source_slug: string | null;
  points_delta: number;
  balance_after: number;
  status: string;
  full_name: string;
  email: string;
  created_at: string;
};

type KFoodClaimRow = {
  id: number;
  order_id: string;
  order_total: string;
  status: string;
  points_reward: number;
  review_note: string | null;
  full_name: string;
  email: string;
  created_at: string;
};

type IndiaPreSelectionApplicationRow = {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone: string | null;
  nationality: string | null;
  current_city: string | null;
  date_of_birth: string | null;
  performance_category: string | null;
  biography: string | null;
  video_link: string | null;
  message: string | null;
  status: string;
  points_awarded: number;
  submitted_at: string;
  updated_at: string;
  user_full_name: string;
  user_email: string;
  user_phone: string | null;
  reviewed_by_name: string | null;
  reviewed_by_email: string | null;
  review_note: string | null;
  reviewed_at: string | null;
};

type EventRow = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  starts_at: string;
  ends_at: string;
  timezone: string;
  location_name: string | null;
  location_address: string | null;
  online_meeting_url: string | null;
  capacity: number | null;
  points_reward: number;
  status: string;
  sync_status: string;
  google_calendar_html_link: string | null;
};

type RewardRow = {
  id: number;
  name: string;
  description: string | null;
  tier: string;
  cost_points: number;
  active: boolean;
  image_url: string | null;
  created_at: string;
};

type AnnouncementRow = {
  id: number;
  title: string;
  body: string;
  status: string;
  creator_name: string | null;
  creator_email: string | null;
  created_at: string;
};

type CalendarConnectionRow = {
  id: number;
  provider: string;
  calendar_id: string;
  calendar_name: string | null;
  sync_mode: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type ActivityRow = {
  id: number;
  action: string;
  entity_type: string;
  entity_id: number | null;
  created_at: string;
  ip_address: string | null;
  admin_name: string | null;
  admin_email: string | null;
  before_status: string | null;
  after_status: string | null;
  review_note: string | null;
};

type AdminProfileRow = UserRow;

type AdminAccountRow = UserRow;

type LocalizedText = {
  en: string;
  ko: string;
  hi: string;
};

type KFoodProductRow = {
  id: string;
  slug: string;
  sku: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  category: LocalizedText;
  categoryKey: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  rewardPoints: number;
  inStock: boolean;
  stockLabel: LocalizedText;
  badges: LocalizedText[];
  includes: LocalizedText[];
};

type KFoodOrderRow = {
  id: number;
  receipt: string;
  context_ref: string | null;
  amount: string;
  currency: string;
  payment_status: string;
  dispatch_status: string;
  tracking_number: string | null;
  carrier: string | null;
  commission_rate: number | string;
  commission_amount: number | string;
  customer_email: string | null;
  customer_phone: string | null;
  created_at: string;
  fulfillment_id: number | null;
  fulfillment_status: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  courier_notes: string | null;
  dispatch_method: string | null;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;
};

type KFoodFulfillmentRow = {
  id: number;
  payment_order_id: number;
  fulfillment_status: string;
  tracking_number: string | null;
  carrier: string | null;
  dispatch_method: string | null;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  courier_notes: string | null;
  receipt: string;
  context_ref: string | null;
  amount: string;
  currency: string;
  payment_status: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
};

type SubmissionRow = {
  id: number;
  source_type: string;
  source_label: string;
  submission_kind: string | null;
  title: string;
  description: string | null;
  status: string;
  review_note: string | null;
  points_reward: number;
  submitted_at: string;
  reviewed_at: string | null;
  applicant_name: string | null;
  applicant_email: string | null;
  applicant_phone: string | null;
  payload: Record<string, unknown>;
};

type KFoodOverviewRow = {
  productSummary: {
    totalProducts: number;
    inStockProducts: number;
    outOfStockProducts: number;
  };
  products: KFoodProductRow[];
  orders: KFoodOrderRow[];
  paymentSummary: Array<{ payment_status: string; total_orders: number; total_amount: string }>;
  weeklyReport: Array<{ period: string; total_orders: number; total_amount: string; commission_amount: string }>;
  monthlyReport: Array<{ period: string; total_orders: number; total_amount: string; commission_amount: string }>;
  claimSummary: Array<{ claim_status: string; total_claims: number; total_amount: string; commission_amount: string }>;
  fulfillments: KFoodFulfillmentRow[];
};

const adminNav = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, description: 'Live metrics and shortcuts.' },
  { id: 'adminProfile', label: 'Profile', icon: UserCog, description: 'Your admin identity and security.' },
  { id: 'adminAccounts', label: 'Admin Accounts', icon: ShieldCheck, description: 'Multiple admin users and roles.' },
  { id: 'submissions', label: 'Submissions', icon: FilePenLine, description: 'All participation and form submissions.' },
  { id: 'indiaPreSelection', label: 'India Pre-Selection', icon: Mic2, description: 'Festival applications and review.' },
  { id: 'website', label: 'Website CMS', icon: FilePenLine, description: 'Pages, inventory, copy blocks.' },
  { id: 'learning', label: 'Learning', icon: BookOpen, description: 'Tracks and question bank.' },
  { id: 'users', label: 'Users', icon: Users, description: 'Profiles, roles and access.' },
  { id: 'points', label: 'Points', icon: Coins, description: 'Ledger and manual adjustments.' },
  { id: 'chapters', label: 'Chapters', icon: Users, description: 'Community chapters and leaders.' },
  { id: 'uploads', label: 'Uploads', icon: Clapperboard, description: 'Content moderation.' },
  { id: 'kfood', label: 'K-Food', icon: ShoppingBag, description: 'Purchase claims and review.' },
  { id: 'events', label: 'Events', icon: CalendarDays, description: 'Event builder and archive.' },
  { id: 'rewards', label: 'Rewards', icon: Gift, description: 'Reward catalog control.' },
  { id: 'announcements', label: 'Announcements', icon: Bell, description: 'CMS notices and broadcasts.' },
  { id: 'calendar', label: 'Calendar', icon: Settings2, description: 'Google Calendar sync.' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Usage and activity summary.' },
] as const;

const adminSidebarGroups = [
  { title: 'Core', ids: ['overview', 'submissions', 'indiaPreSelection', 'website', 'learning'] },
  { title: 'Operations', ids: ['users', 'points', 'chapters', 'uploads', 'kfood', 'events', 'rewards'] },
  { title: 'System', ids: ['adminProfile', 'adminAccounts', 'announcements', 'calendar', 'analytics'] },
] as const;

const emptyTrackForm = {
  id: '',
  slug: '',
  title: '',
  eyebrow: '',
  intro: '',
  accent: '#19c37d',
  rewardPoints: 0,
  stepSize: 10,
  overview: '[]',
  loginCopy: '[]',
  active: true,
  sortOrder: 0,
};

const emptyQuestionForm = {
  id: '',
  trackId: '',
  questionKey: '',
  type: 'choice',
  tag: '',
  prompt: '',
  korean: '',
  answer: '',
  options: '[]',
  words: '[]',
  cards: '[]',
  pairs: '[]',
  hint: '',
  points: 0,
  sortOrder: 0,
  active: true,
};

const emptyPageForm = {
  id: '',
  slug: '',
  pageType: 'learning',
  titleEn: '',
  titleKo: '',
  titleHi: '',
  seoTitle: '',
  seoDescription: '',
  status: 'draft',
};

const emptyBlockForm = {
  id: '',
  page_id: '',
  block_key: '',
  block_type: 'hero',
  sort_order: 0,
  content_en: '{}',
  content_ko: '{}',
  content_hi: '{}',
  status: 'published',
};

const emptyChapterForm = {
  id: '',
  name: '',
  slug: '',
  description: '',
  city: '',
  state: '',
  country: 'India',
  leader_id: '',
  member_count: 0,
  latitude: '',
  longitude: '',
  status: 'pending',
};

const emptyUserForm = {
  id: '',
  full_name: '',
  phone: '',
  role: 'member',
  category_access: 'category_c',
  status: 'active',
  city: '',
  state: '',
  country: '',
  profile_image: '',
};

const emptyPointsForm = {
  user_id: '',
  points_delta: 0,
  reason: '',
};

const emptyAnnouncementForm = {
  title: '',
  body: '',
  created_by: '',
};

const emptyAdminAccountForm = {
  full_name: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  status: 'active',
  category_access: 'category_c',
};

const emptyProfileForm = {
  full_name: '',
  phone: '',
  city: '',
  state: '',
  country: '',
  profile_image: '',
};

const emptyPasswordForm = {
  current_password: '',
  new_password: '',
  confirm_password: '',
};

const emptyRewardForm = {
  id: '',
  name: '',
  description: '',
  tier: 'bronze',
  cost_points: 0,
  active: true,
  image_url: '',
  metadata: '[]',
};

const emptyEventForm = {
  id: '',
  title: '',
  slug: '',
  description: '',
  category: 'k_culture',
  starts_at: '',
  ends_at: '',
  timezone: 'Asia/Kolkata',
  location_name: '',
  location_address: '',
  online_meeting_url: '',
  capacity: '',
  points_reward: 0,
  status: 'draft',
};

const emptyCalendarForm = {
  calendar_id: 'primary',
  calendar_name: 'K-CUBE Calendar',
  sync_mode: 'admin_oauth',
};

const safeJson = (value: string, fallback: unknown[]) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const safeJsonObject = (value: string, fallback: Record<string, unknown> = {}) => {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const normalize = (value: unknown) => String(value ?? '').toLowerCase();

const matchesQuery = (query: string, values: Array<unknown>) => {
  if (!query) return true;
  return values.some((value) => normalize(value).includes(query));
};

const readPayload = <T,>(result: PromiseSettledResult<any>, fallback: T): T => {
  if (result.status !== 'fulfilled') return fallback;
  return (result.value?.data?.data ?? result.value?.data ?? fallback) as T;
};

const SectionShell = ({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) => (
  <section className="min-w-0 rounded-2xl border border-white/10 bg-[#101014] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
    <div className="flex flex-col gap-3 border-b border-white/10 pb-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h2 className="text-2xl font-black text-white">{title}</h2>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-7 text-[#aab5c6]">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
    <div className="min-w-0 pt-5">{children}</div>
  </section>
);

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#ffc400]">{label}</span>
    {children}
  </label>
);

const inputClass =
  'w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-[#627085] focus:border-[#ffc400]';
const selectClass =
  'w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#ffc400]';

const AdminControlCenter = () => {
  const user = useAppStore((state) => state.user);
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [notice, setNotice] = useState('');
  const [adminQuery, setAdminQuery] = useState('');

  const [dashboardMetrics, setDashboardMetrics] = useState<Record<string, number>>({});
  const [analytics, setAnalytics] = useState<Record<string, number>>({});
  const [users, setUsers] = useState<UserRow[]>([]);
  const [uploads, setUploads] = useState<UploadRow[]>([]);
  const [indiaApplications, setIndiaApplications] = useState<IndiaPreSelectionApplicationRow[]>([]);
  const [pointTransactions, setPointTransactions] = useState<PointTxRow[]>([]);
  const [claims, setClaims] = useState<KFoodClaimRow[]>([]);
  const [tracks, setTracks] = useState<LearningTrackRow[]>([]);
  const [questions, setQuestions] = useState<LearningQuestionRow[]>([]);
  const [pages, setPages] = useState<CmsPageRow[]>([]);
  const [blocks, setBlocks] = useState<CmsBlockRow[]>([]);
  const [chapters, setChapters] = useState<ChapterRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [rewards, setRewards] = useState<RewardRow[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([]);
  const [calendarConnections, setCalendarConnections] = useState<CalendarConnectionRow[]>([]);
  const [recentActions, setRecentActions] = useState<ActivityRow[]>([]);
  const [adminProfile, setAdminProfile] = useState<AdminProfileRow | null>(null);
  const [adminAccounts, setAdminAccounts] = useState<AdminAccountRow[]>([]);
  const [kfoodProducts, setKfoodProducts] = useState<KFoodProductRow[]>([]);
  const [kfoodOverview, setKfoodOverview] = useState<KFoodOverviewRow | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);
  const [selectedFulfillmentId, setSelectedFulfillmentId] = useState<number | null>(null);
  const [fulfillmentForm, setFulfillmentForm] = useState({
    payment_order_id: '',
    fulfillment_status: 'pending',
    tracking_number: '',
    carrier: '',
    dispatch_method: '',
    shipping_name: '',
    shipping_phone: '',
    shipping_address: '',
    shipped_at: '',
    delivered_at: '',
    courier_notes: '',
  });

  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);
  const [trackForm, setTrackForm] = useState(emptyTrackForm);
  const [questionForm, setQuestionForm] = useState(emptyQuestionForm);
  const [pageForm, setPageForm] = useState(emptyPageForm);
  const [blockForm, setBlockForm] = useState(emptyBlockForm);
  const [chapterForm, setChapterForm] = useState(emptyChapterForm);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [pointsForm, setPointsForm] = useState(emptyPointsForm);
  const [announcementForm, setAnnouncementForm] = useState(emptyAnnouncementForm);
  const [adminAccountForm, setAdminAccountForm] = useState(emptyAdminAccountForm);
  const [adminProfileForm, setAdminProfileForm] = useState(emptyProfileForm);
  const [adminPasswordForm, setAdminPasswordForm] = useState(emptyPasswordForm);
  const [rewardForm, setRewardForm] = useState(emptyRewardForm);
  const [eventForm, setEventForm] = useState(emptyEventForm);
  const [calendarForm, setCalendarForm] = useState(emptyCalendarForm);

  const [selectedUploadId, setSelectedUploadId] = useState<number | null>(null);
  const [uploadReview, setUploadReview] = useState({ status: 'approved', points_reward: 0, review_note: '' });
  const [selectedIndiaApplicationId, setSelectedIndiaApplicationId] = useState<number | null>(null);
  const [indiaApplicationReview, setIndiaApplicationReview] = useState({ status: 'reviewing', review_note: '' });
  const [selectedClaimId, setSelectedClaimId] = useState<number | null>(null);
  const [claimReview, setClaimReview] = useState({ status: 'approved', points_reward: 0, review_note: '' });
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);

  const query = adminQuery.trim().toLowerCase();

  const selectedTrack = useMemo(
    () => tracks.find((track) => track.id === selectedTrackId) || null,
    [selectedTrackId, tracks],
  );
  const visibleQuestions = useMemo(
    () => questions.filter((question) => question.trackId === selectedTrackId && matchesQuery(query, [question.questionKey, question.type, question.tag, question.prompt, question.korean, question.answer, question.trackTitle, question.trackSlug])),
    [questions, query, selectedTrackId],
  );
  const selectedUser = useMemo(
    () => users.find((entry) => entry.id === Number(userForm.id)) || null,
    [userForm.id, users],
  );
  const topWinner = useMemo(
    () => [...users].sort((left, right) => right.points - left.points || right.xp - left.xp)[0] || null,
    [users],
  );
  const selectedReward = useMemo(
    () => rewards.find((entry) => entry.id === Number(rewardForm.id)) || null,
    [rewardForm.id, rewards],
  );
  const selectedChapter = useMemo(
    () => chapters.find((entry) => entry.id === Number(chapterForm.id)) || null,
    [chapterForm.id, chapters],
  );
  const selectedEvent = useMemo(
    () => events.find((entry) => entry.id === Number(eventForm.id)) || null,
    [eventForm.id, events],
  );
  const selectedUpload = useMemo(
    () => uploads.find((entry) => entry.id === selectedUploadId) || null,
    [selectedUploadId, uploads],
  );
  const selectedIndiaApplication = useMemo(
    () => indiaApplications.find((entry) => entry.id === selectedIndiaApplicationId) || null,
    [indiaApplications, selectedIndiaApplicationId],
  );
  const selectedClaim = useMemo(
    () => claims.find((entry) => entry.id === selectedClaimId) || null,
    [claims, selectedClaimId],
  );
  const selectedSubmission = useMemo(
    () => submissions.find((entry) => entry.id === selectedSubmissionId) || null,
    [selectedSubmissionId, submissions],
  );
  const selectedFulfillment = useMemo(
    () => kfoodOverview?.fulfillments.find((entry) => entry.id === selectedFulfillmentId) || kfoodOverview?.fulfillments[0] || null,
    [kfoodOverview, selectedFulfillmentId],
  );
  const selectedCmsPage = useMemo(
    () => pages.find((entry) => entry.id === selectedPageId) || null,
    [pages, selectedPageId],
  );
  const visibleBlocks = useMemo(
    () => blocks.filter((block) => !selectedPageId || block.page_id === selectedPageId),
    [blocks, selectedPageId],
  );
  const filteredUsers = useMemo(
    () => users.filter((entry) => matchesQuery(query, [entry.full_name, entry.username, entry.email, entry.role, entry.status, entry.city, entry.state, entry.country])),
    [query, users],
  );
  const filteredAdminAccounts = useMemo(
    () => adminAccounts.filter((entry) => matchesQuery(query, [entry.full_name, entry.username, entry.email, entry.phone, entry.status, entry.city, entry.state, entry.country])),
    [adminAccounts, query],
  );
  const filteredKFoodProducts = useMemo(
    () => kfoodProducts.filter((entry) => matchesQuery(query, [entry.slug, entry.sku, entry.title.en, entry.subtitle.en, entry.category.en, entry.categoryKey, entry.inStock ? 'in stock' : 'out of stock'])),
    [kfoodProducts, query],
  );
  const filteredChapters = useMemo(
    () => chapters.filter((entry) => matchesQuery(query, [entry.name, entry.slug, entry.city, entry.state, entry.country, entry.status, entry.leader_name, entry.leader_email])),
    [chapters, query],
  );
  const filteredPages = useMemo(
    () => pages.filter((entry) => matchesQuery(query, [entry.slug, entry.pageType, entry.titleEn, entry.titleKo, entry.titleHi, entry.status])),
    [pages, query],
  );
  const filteredBlocks = useMemo(
    () => visibleBlocks.filter((entry) => matchesQuery(query, [entry.block_key, entry.block_type, entry.status, entry.page_title, entry.page_slug])),
    [query, visibleBlocks],
  );
  const filteredEvents = useMemo(
    () => events.filter((entry) => matchesQuery(query, [entry.title, entry.slug, entry.category, entry.status, entry.location_name, entry.location_address])),
    [events, query],
  );
  const filteredRewards = useMemo(
    () => rewards.filter((entry) => matchesQuery(query, [entry.name, entry.tier, entry.description, entry.active ? 'active' : 'inactive', entry.cost_points])),
    [query, rewards],
  );
  const filteredAnnouncements = useMemo(
    () => announcements.filter((entry) => matchesQuery(query, [entry.title, entry.body, entry.status, entry.creator_name, entry.creator_email])),
    [announcements, query],
  );
  const filteredUploads = useMemo(
    () => uploads.filter((entry) => matchesQuery(query, [entry.title, entry.category, entry.status, entry.full_name, entry.email])),
    [query, uploads],
  );
  const filteredIndiaApplications = useMemo(
    () => indiaApplications.filter((entry) => matchesQuery(query, [entry.full_name, entry.email, entry.status, entry.performance_category, entry.nationality, entry.current_city, entry.review_note])),
    [indiaApplications, query],
  );
  const latestIndiaApplications = useMemo(() => indiaApplications.slice(0, 3), [indiaApplications]);
  const filteredRecentActions = useMemo(
    () => recentActions.filter((entry) => matchesQuery(query, [entry.action, entry.entity_type, entry.admin_name, entry.admin_email, entry.after_status, entry.before_status, entry.review_note])),
    [query, recentActions],
  );
  const filteredSubmissions = useMemo(
    () =>
      submissions.filter((entry) =>
        matchesQuery(query, [
          entry.source_label,
          entry.source_type,
          entry.submission_kind,
          entry.title,
          entry.description,
          entry.status,
          entry.review_note,
          entry.applicant_name,
          entry.applicant_email,
          entry.applicant_phone,
        ]),
      ),
    [query, submissions],
  );
  const filteredClaims = useMemo(
    () => claims.filter((entry) => matchesQuery(query, [entry.order_id, entry.status, entry.full_name, entry.email, entry.order_total])),
    [claims, query],
  );
  const filteredPoints = useMemo(
    () => pointTransactions.filter((entry) => matchesQuery(query, [entry.source_type, entry.source_slug, entry.full_name, entry.email, entry.points_delta, entry.balance_after])),
    [pointTransactions, query],
  );
  const filteredTracks = useMemo(
    () => tracks.filter((entry) => matchesQuery(query, [entry.slug, entry.title, entry.eyebrow, entry.intro, entry.active ? 'active' : 'inactive'])),
    [query, tracks],
  );

  const loadAdminData = async () => {
    const requests = await Promise.allSettled([
      api.get('/admin/dashboard'),
      api.get('/admin/analytics'),
      api.get('/users'),
      api.get('/admin/profile'),
      api.get('/admin/accounts'),
      api.get('/admin/uploads'),
      api.get('/admin/india-pre-selection/applications'),
      api.get('/admin/points'),
      api.get('/admin/kfood/claims'),
      api.get('/admin/kfood/products'),
      api.get('/admin/kfood/overview'),
      api.get('/admin/kfood/fulfillments'),
      api.get('/admin/submissions'),
      api.get('/learning/admin/tracks'),
      api.get('/learning/admin/questions'),
      api.get('/learning/cms/pages'),
      api.get('/admin/cms/blocks'),
      api.get('/admin/chapters'),
      api.get('/admin/events'),
      api.get('/admin/rewards'),
      api.get('/admin/announcements'),
      api.get('/admin/google-calendar/connections'),
      api.get('/admin/recent-actions'),
    ]);

    const dashboardPayload = readPayload<any>(requests[0], {});
    const analyticsPayload = readPayload<Record<string, number>>(requests[1], {});
    const userRows = readPayload<UserRow[]>(requests[2], []);
    const profileRow = readPayload<AdminProfileRow | null>(requests[3], null);
    const adminAccountRows = readPayload<AdminAccountRow[]>(requests[4], []);
    const uploadRows = readPayload<UploadRow[]>(requests[5], []);
    const indiaRows = readPayload<IndiaPreSelectionApplicationRow[]>(requests[6], []);
    const pointRows = readPayload<PointTxRow[]>(requests[7], []);
    const claimRows = readPayload<KFoodClaimRow[]>(requests[8], []);
    const kfoodProductRows = readPayload<KFoodProductRow[]>(requests[9], []);
    const kfoodOverviewRows = readPayload<KFoodOverviewRow>(requests[10], null as any);
    const fulfillmentRows = readPayload<KFoodFulfillmentRow[]>(requests[11], []);
    const submissionRows = readPayload<SubmissionRow[]>(requests[12], []);
    const trackRows = readPayload<LearningTrackRow[]>(requests[13], []);
    const questionRows = readPayload<LearningQuestionRow[]>(requests[14], []);
    const pageRows = readPayload<CmsPageRow[]>(requests[15], []);
    const blockRows = readPayload<CmsBlockRow[]>(requests[16], []);
    const chapterRows = readPayload<ChapterRow[]>(requests[17], []);
    const eventRows = readPayload<EventRow[]>(requests[18], []);
    const rewardRows = readPayload<RewardRow[]>(requests[19], []);
    const announcementRows = readPayload<AnnouncementRow[]>(requests[20], []);
    const connectionRows = readPayload<CalendarConnectionRow[]>(requests[21], []);
    const activityRows = readPayload<ActivityRow[]>(requests[22], []);

    setDashboardMetrics(dashboardPayload.metrics || {});
    setAnalytics(analyticsPayload);
    setUsers(userRows);
    setAdminProfile(profileRow || null);
    setAdminAccounts(adminAccountRows);
    setUploads(uploadRows);
    setIndiaApplications(indiaRows);
    setPointTransactions(pointRows);
    setClaims(claimRows);
    setKfoodProducts(kfoodProductRows);
    setKfoodOverview(kfoodOverviewRows ? { ...kfoodOverviewRows, fulfillments: fulfillmentRows } : null);
    setSubmissions(submissionRows);
    setTracks(trackRows);
    setQuestions(questionRows);
    setPages(pageRows);
    setBlocks(blockRows);
    setChapters(chapterRows);
    setEvents(eventRows);
    setRewards(rewardRows);
    setAnnouncements(announcementRows);
    setCalendarConnections(connectionRows);
    setRecentActions(activityRows);

    if (profileRow) {
      setAdminProfileForm({
        full_name: profileRow.full_name || '',
        phone: profileRow.phone || '',
        city: profileRow.city || '',
        state: profileRow.state || '',
        country: profileRow.country || '',
        profile_image: profileRow.profile_image || '',
      });
    }

    if (!selectedTrackId && trackRows.length) {
      setSelectedTrackId(trackRows[0].id);
    }
    if (!userForm.id && userRows.length) {
      const first = userRows[0];
      setUserForm({
        id: String(first.id),
        full_name: first.full_name,
        phone: first.phone || '',
        role: first.role,
        category_access: first.category_access,
        status: first.status,
        city: first.city || '',
        state: first.state || '',
        country: first.country || '',
        profile_image: first.profile_image || '',
      });
    }
    if (!rewardForm.id && rewardRows.length) {
      const first = rewardRows[0];
      setRewardForm({
        id: String(first.id),
        name: first.name,
        description: first.description || '',
        tier: first.tier,
        cost_points: first.cost_points,
        active: first.active,
        image_url: first.image_url || '',
        metadata: '[]',
      });
    }
    if (!eventForm.id && eventRows.length) {
      const first = eventRows[0];
      setEventForm({
        id: String(first.id),
        title: first.title,
        slug: first.slug,
        description: first.description || '',
        category: first.category,
        starts_at: first.starts_at.slice(0, 16),
        ends_at: first.ends_at.slice(0, 16),
        timezone: first.timezone,
        location_name: first.location_name || '',
        location_address: first.location_address || '',
        online_meeting_url: first.online_meeting_url || '',
        capacity: first.capacity ? String(first.capacity) : '',
        points_reward: first.points_reward,
        status: first.status,
      });
    }
    if (!calendarConnections.length && connectionRows.length) {
      const first = connectionRows[0];
      setCalendarForm({
        calendar_id: first.calendar_id,
        calendar_name: first.calendar_name || 'K-CUBE Calendar',
        sync_mode: first.sync_mode,
      });
    }
    if (!selectedIndiaApplicationId && indiaRows.length) {
      setSelectedIndiaApplicationId(indiaRows[0].id);
    }
    if (!selectedSubmissionId && submissionRows.length) {
      setSelectedSubmissionId(submissionRows[0].id);
    }
    if (!selectedFulfillmentId && fulfillmentRows.length) {
      setSelectedFulfillmentId(fulfillmentRows[0].id);
      setFulfillmentForm({
        payment_order_id: String(fulfillmentRows[0].payment_order_id),
        fulfillment_status: fulfillmentRows[0].fulfillment_status,
        tracking_number: fulfillmentRows[0].tracking_number || '',
        carrier: fulfillmentRows[0].carrier || '',
        dispatch_method: fulfillmentRows[0].dispatch_method || '',
        shipping_name: fulfillmentRows[0].shipping_name || '',
        shipping_phone: fulfillmentRows[0].shipping_phone || '',
        shipping_address: fulfillmentRows[0].shipping_address || '',
        shipped_at: fulfillmentRows[0].shipped_at ? fulfillmentRows[0].shipped_at.slice(0, 16) : '',
        delivered_at: fulfillmentRows[0].delivered_at ? fulfillmentRows[0].delivered_at.slice(0, 16) : '',
        courier_notes: fulfillmentRows[0].courier_notes || '',
      });
    }
    if (!selectedPageId && pageRows.length) {
      setSelectedPageId(pageRows[0].id);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    loadAdminData().catch(() => setNotice('Failed to load admin data.'));
  }, [user]);

  useEffect(() => {
    if (!selectedTrack) return;
    setTrackForm({
      id: String(selectedTrack.id),
      slug: selectedTrack.slug,
      title: selectedTrack.title,
      eyebrow: selectedTrack.eyebrow,
      intro: selectedTrack.intro,
      accent: selectedTrack.accent,
      rewardPoints: selectedTrack.rewardPoints,
      stepSize: selectedTrack.stepSize,
      overview: JSON.stringify(selectedTrack.overview, null, 2),
      loginCopy: JSON.stringify(selectedTrack.loginCopy, null, 2),
      active: selectedTrack.active,
      sortOrder: selectedTrack.sortOrder,
    });
    setQuestionForm((current) => ({ ...current, trackId: String(selectedTrack.id) }));
  }, [selectedTrack]);

  useEffect(() => {
    if (selectedUser) {
      setUserForm({
        id: String(selectedUser.id),
        full_name: selectedUser.full_name,
        phone: selectedUser.phone || '',
        role: selectedUser.role,
        category_access: selectedUser.category_access,
        status: selectedUser.status,
        city: selectedUser.city || '',
        state: selectedUser.state || '',
        country: selectedUser.country || '',
        profile_image: selectedUser.profile_image || '',
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedReward) {
      setRewardForm({
        id: String(selectedReward.id),
        name: selectedReward.name,
        description: selectedReward.description || '',
        tier: selectedReward.tier,
        cost_points: selectedReward.cost_points,
        active: selectedReward.active,
        image_url: selectedReward.image_url || '',
        metadata: '[]',
      });
    }
  }, [selectedReward]);

  useEffect(() => {
    if (selectedFulfillment) {
      setFulfillmentForm({
        payment_order_id: String(selectedFulfillment.payment_order_id),
        fulfillment_status: selectedFulfillment.fulfillment_status,
        tracking_number: selectedFulfillment.tracking_number || '',
        carrier: selectedFulfillment.carrier || '',
        dispatch_method: selectedFulfillment.dispatch_method || '',
        shipping_name: selectedFulfillment.shipping_name || '',
        shipping_phone: selectedFulfillment.shipping_phone || '',
        shipping_address: selectedFulfillment.shipping_address || '',
        shipped_at: selectedFulfillment.shipped_at ? selectedFulfillment.shipped_at.slice(0, 16) : '',
        delivered_at: selectedFulfillment.delivered_at ? selectedFulfillment.delivered_at.slice(0, 16) : '',
        courier_notes: selectedFulfillment.courier_notes || '',
      });
    }
  }, [selectedFulfillment]);

  useEffect(() => {
    if (selectedIndiaApplication) {
      setIndiaApplicationReview({
        status: selectedIndiaApplication.status,
        review_note: selectedIndiaApplication.review_note || '',
      });
    }
  }, [selectedIndiaApplication]);

  useEffect(() => {
    if (!indiaApplications.length) {
      if (selectedIndiaApplicationId !== null) {
        setSelectedIndiaApplicationId(null);
      }
      return;
    }

    const stillExists = indiaApplications.some((entry) => entry.id === selectedIndiaApplicationId);
    if (!stillExists) {
      setSelectedIndiaApplicationId(indiaApplications[0].id);
    }
  }, [indiaApplications, selectedIndiaApplicationId]);

  useEffect(() => {
    if (selectedEvent) {
      setEventForm({
        id: String(selectedEvent.id),
        title: selectedEvent.title,
        slug: selectedEvent.slug,
        description: selectedEvent.description || '',
        category: selectedEvent.category,
        starts_at: selectedEvent.starts_at.slice(0, 16),
        ends_at: selectedEvent.ends_at.slice(0, 16),
        timezone: selectedEvent.timezone,
        location_name: selectedEvent.location_name || '',
        location_address: selectedEvent.location_address || '',
        online_meeting_url: selectedEvent.online_meeting_url || '',
        capacity: selectedEvent.capacity ? String(selectedEvent.capacity) : '',
        points_reward: selectedEvent.points_reward,
        status: selectedEvent.status,
      });
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (selectedCmsPage) {
      setPageForm({
        id: String(selectedCmsPage.id),
        slug: selectedCmsPage.slug,
        pageType: selectedCmsPage.pageType,
        titleEn: selectedCmsPage.titleEn,
        titleKo: selectedCmsPage.titleKo || '',
        titleHi: selectedCmsPage.titleHi || '',
        seoTitle: selectedCmsPage.seoTitle || '',
        seoDescription: selectedCmsPage.seoDescription || '',
        status: selectedCmsPage.status,
      });
      setBlockForm((state) => ({ ...state, page_id: String(selectedCmsPage.id) }));
    }
  }, [selectedCmsPage]);

  useEffect(() => {
    if (selectedChapter) {
      setChapterForm({
        id: String(selectedChapter.id),
        name: selectedChapter.name,
        slug: selectedChapter.slug,
        description: selectedChapter.description || '',
        city: selectedChapter.city,
        state: selectedChapter.state,
        country: selectedChapter.country,
        leader_id: selectedChapter.leader_id ? String(selectedChapter.leader_id) : '',
        member_count: selectedChapter.member_count,
        latitude: selectedChapter.latitude !== null && selectedChapter.latitude !== undefined ? String(selectedChapter.latitude) : '',
        longitude: selectedChapter.longitude !== null && selectedChapter.longitude !== undefined ? String(selectedChapter.longitude) : '',
        status: selectedChapter.status,
      });
    }
  }, [selectedChapter]);

  if (!user || user.role !== 'admin') {
    return (
      <main className="min-h-screen bg-[#070708] px-5 py-16 text-white lg:px-10">
        <section className="mx-auto max-w-[760px] rounded-2xl border border-white/10 bg-[#111113] p-8 text-center">
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

  const saveTrack = async () => {
    const payload = {
      id: trackForm.id ? Number(trackForm.id) : undefined,
      slug: trackForm.slug,
      title: trackForm.title,
      eyebrow: trackForm.eyebrow,
      intro: trackForm.intro,
      accent: trackForm.accent,
      rewardPoints: Number(trackForm.rewardPoints || 0),
      stepSize: Number(trackForm.stepSize || 10),
      overview: safeJson(trackForm.overview, []),
      loginCopy: safeJson(trackForm.loginCopy, []),
      active: trackForm.active,
      sortOrder: Number(trackForm.sortOrder || 0),
    };

    if (trackForm.id) {
      await api.patch(`/learning/admin/tracks/${trackForm.id}`, payload);
    } else {
      await api.post('/learning/admin/tracks', payload);
    }
    setNotice('Learning track saved.');
    await loadAdminData();
  };

  const deleteTrack = async (id: number) => {
    await api.delete(`/learning/admin/tracks/${id}`);
    setNotice('Learning track deleted.');
    setTrackForm(emptyTrackForm);
    setSelectedTrackId(null);
    await loadAdminData();
  };

  const saveQuestion = async () => {
    if (!questionForm.trackId) {
      setNotice('Pick a track first.');
      return;
    }

    const payload = {
      id: questionForm.id ? Number(questionForm.id) : undefined,
      trackId: Number(questionForm.trackId),
      questionKey: questionForm.questionKey,
      type: questionForm.type,
      tag: questionForm.tag,
      prompt: questionForm.prompt,
      korean: questionForm.korean,
      answer: questionForm.answer,
      options: safeJson(questionForm.options, []),
      words: safeJson(questionForm.words, []),
      cards: safeJson(questionForm.cards, []),
      pairs: safeJson(questionForm.pairs, []),
      hint: questionForm.hint,
      points: Number(questionForm.points || 0),
      sortOrder: Number(questionForm.sortOrder || 0),
      active: questionForm.active,
    };

    if (questionForm.id) {
      await api.patch(`/learning/admin/questions/${questionForm.id}`, payload);
    } else {
      await api.post('/learning/admin/questions', payload);
    }

    setNotice('Learning question saved.');
    setQuestionForm({ ...emptyQuestionForm, trackId: questionForm.trackId });
    await loadAdminData();
  };

  const deleteQuestion = async (id: number) => {
    await api.delete(`/learning/admin/questions/${id}`);
    setNotice('Learning question deleted.');
    await loadAdminData();
  };

  const savePage = async () => {
    const payload = {
      id: pageForm.id ? Number(pageForm.id) : undefined,
      slug: pageForm.slug,
      pageType: pageForm.pageType,
      titleEn: pageForm.titleEn,
      titleKo: pageForm.titleKo || null,
      titleHi: pageForm.titleHi || null,
      seoTitle: pageForm.seoTitle || null,
      seoDescription: pageForm.seoDescription || null,
      status: pageForm.status,
    };

    if (pageForm.id) {
      await api.patch(`/learning/cms/pages/${pageForm.id}`, payload);
    } else {
      await api.post('/learning/cms/pages', payload);
    }

    setNotice('CMS page saved.');
    setPageForm(emptyPageForm);
    await loadAdminData();
  };

  const saveBlock = async () => {
    if (!blockForm.page_id) {
      setNotice('Pick a page first.');
      return;
    }

    const payload = {
      id: blockForm.id ? Number(blockForm.id) : undefined,
      page_id: Number(blockForm.page_id),
      block_key: blockForm.block_key,
      block_type: blockForm.block_type,
      sort_order: Number(blockForm.sort_order || 0),
      content_en: safeJsonObject(blockForm.content_en),
      content_ko: safeJsonObject(blockForm.content_ko),
      content_hi: safeJsonObject(blockForm.content_hi),
      status: blockForm.status,
    };

    if (blockForm.id) {
      await api.patch(`/admin/cms/blocks/${blockForm.id}`, payload);
    } else {
      await api.post('/admin/cms/blocks', payload);
    }

    setNotice('CMS block saved.');
    setBlockForm(emptyBlockForm);
    setBlockForm((state) => ({ ...state, page_id: payload.page_id ? String(payload.page_id) : '' }));
    await loadAdminData();
  };

  const deleteBlock = async (id: number) => {
    await api.delete(`/admin/cms/blocks/${id}`);
    setNotice('CMS block deleted.');
    setBlockForm((state) => ({ ...emptyBlockForm, page_id: state.page_id }));
    await loadAdminData();
  };

  const saveUser = async () => {
    if (!userForm.id) return;
    await api.patch(`/users/${userForm.id}`, {
      full_name: userForm.full_name,
      phone: userForm.phone || null,
      role: userForm.role,
      category_access: userForm.category_access,
      status: userForm.status,
      city: userForm.city || null,
      state: userForm.state || null,
      country: userForm.country || null,
      profile_image: userForm.profile_image || null,
    });
    setNotice('User updated.');
    await loadAdminData();
  };

  const deleteUser = async () => {
    if (!userForm.id) return;
    await api.delete(`/users/${userForm.id}`);
    setNotice('User deleted.');
    setUserForm(emptyUserForm);
    await loadAdminData();
  };

  const saveAdminProfile = async () => {
    await api.patch('/admin/profile', {
      full_name: adminProfileForm.full_name,
      phone: adminProfileForm.phone || null,
      city: adminProfileForm.city || null,
      state: adminProfileForm.state || null,
      country: adminProfileForm.country || null,
      profile_image: adminProfileForm.profile_image || null,
    });
    setNotice('Admin profile updated.');
    await loadAdminData();
  };

  const changeAdminPassword = async () => {
    if (!adminPasswordForm.current_password || !adminPasswordForm.new_password) {
      setNotice('Enter both current and new password.');
      return;
    }
    if (adminPasswordForm.new_password !== adminPasswordForm.confirm_password) {
      setNotice('New password confirmation does not match.');
      return;
    }
    await api.patch('/admin/profile/password', {
      current_password: adminPasswordForm.current_password,
      new_password: adminPasswordForm.new_password,
    });
    setNotice('Password changed successfully.');
    setAdminPasswordForm(emptyPasswordForm);
  };

  const createAdminAccount = async () => {
    await api.post('/admin/accounts', {
      full_name: adminAccountForm.full_name,
      username: adminAccountForm.username,
      email: adminAccountForm.email,
      phone: adminAccountForm.phone || null,
      password: adminAccountForm.password,
      status: adminAccountForm.status,
      category_access: adminAccountForm.category_access,
    });
    setNotice('Admin account created.');
    setAdminAccountForm(emptyAdminAccountForm);
    await loadAdminData();
  };

  const saveChapter = async () => {
    const payload = {
      id: chapterForm.id ? Number(chapterForm.id) : undefined,
      name: chapterForm.name,
      slug: chapterForm.slug,
      description: chapterForm.description || null,
      city: chapterForm.city,
      state: chapterForm.state,
      country: chapterForm.country,
      leader_id: chapterForm.leader_id ? Number(chapterForm.leader_id) : null,
      member_count: Number(chapterForm.member_count || 0),
      latitude: chapterForm.latitude === '' ? null : Number(chapterForm.latitude),
      longitude: chapterForm.longitude === '' ? null : Number(chapterForm.longitude),
      status: chapterForm.status,
    };

    if (chapterForm.id) {
      await api.patch(`/admin/chapters/${chapterForm.id}`, payload);
    } else {
      await api.post('/admin/chapters', payload);
    }

    setNotice('Chapter saved.');
    setChapterForm(emptyChapterForm);
    await loadAdminData();
  };

  const deleteChapter = async (id: number) => {
    await api.delete(`/admin/chapters/${id}`);
    setNotice('Chapter deleted.');
    setChapterForm(emptyChapterForm);
    await loadAdminData();
  };

  const sendPoints = async () => {
    await api.post('/admin/points/adjust', {
      user_id: Number(pointsForm.user_id),
      points_delta: Number(pointsForm.points_delta || 0),
      reason: pointsForm.reason,
    });
    setNotice('Points adjustment submitted.');
    setPointsForm(emptyPointsForm);
    await loadAdminData();
  };

  const reviewUpload = async (status: 'approved' | 'rejected') => {
    if (!selectedUpload) return;
    await api.patch(`/admin/uploads/${selectedUpload.id}/review`, {
      status,
      points_reward: Number(uploadReview.points_reward || 0),
      review_note: uploadReview.review_note,
    });
    setNotice(`Upload ${status}.`);
    setSelectedUploadId(null);
    setUploadReview({ status: 'approved', points_reward: 0, review_note: '' });
    await loadAdminData();
  };

  const reviewIndiaApplication = async () => {
    if (!selectedIndiaApplication) return;
    await api.patch(`/admin/india-pre-selection/applications/${selectedIndiaApplication.id}`, {
      status: indiaApplicationReview.status,
      review_note: indiaApplicationReview.review_note,
    });
    setNotice(`India pre-selection application ${indiaApplicationReview.status}.`);
    await loadAdminData();
  };

  const reviewClaim = async (status: 'approved' | 'rejected') => {
    if (!selectedClaim) return;
    await api.patch(`/admin/kfood/claims/${selectedClaim.id}/review`, {
      status,
      points_reward: Number(claimReview.points_reward || 0),
      review_note: claimReview.review_note,
    });
    setNotice(`K-Food claim ${status}.`);
    setSelectedClaimId(null);
    setClaimReview({ status: 'approved', points_reward: 0, review_note: '' });
    await loadAdminData();
  };

  const saveFulfillment = async () => {
    const payload = {
      payment_order_id: Number(fulfillmentForm.payment_order_id || 0),
      fulfillment_status: fulfillmentForm.fulfillment_status,
      tracking_number: fulfillmentForm.tracking_number || null,
      carrier: fulfillmentForm.carrier || null,
      dispatch_method: fulfillmentForm.dispatch_method || null,
      shipping_name: fulfillmentForm.shipping_name || null,
      shipping_phone: fulfillmentForm.shipping_phone || null,
      shipping_address: fulfillmentForm.shipping_address || null,
      shipped_at: fulfillmentForm.shipped_at || null,
      delivered_at: fulfillmentForm.delivered_at || null,
      courier_notes: fulfillmentForm.courier_notes || null,
    };

    await api.post('/admin/kfood/fulfillments', payload);
    setNotice('K-Food fulfillment saved.');
    await loadAdminData();
  };

  const saveReward = async () => {
    const payload = {
      name: rewardForm.name,
      description: rewardForm.description || null,
      tier: rewardForm.tier,
      cost_points: Number(rewardForm.cost_points || 0),
      active: rewardForm.active,
      image_url: rewardForm.image_url || null,
      metadata: safeJson(rewardForm.metadata, []),
    };

    if (rewardForm.id) {
      await api.patch(`/admin/rewards/${rewardForm.id}`, payload);
    } else {
      await api.post('/admin/rewards', payload);
    }
    setNotice('Reward saved.');
    setRewardForm(emptyRewardForm);
    await loadAdminData();
  };

  const deleteReward = async (id: number) => {
    await api.delete(`/admin/rewards/${id}`);
    setNotice('Reward disabled.');
    setRewardForm(emptyRewardForm);
    await loadAdminData();
  };

  const saveEvent = async () => {
    const payload = {
      title: eventForm.title,
      slug: eventForm.slug || undefined,
      description: eventForm.description || null,
      category: eventForm.category,
      starts_at: eventForm.starts_at,
      ends_at: eventForm.ends_at,
      timezone: eventForm.timezone,
      location_name: eventForm.location_name || null,
      location_address: eventForm.location_address || null,
      online_meeting_url: eventForm.online_meeting_url || null,
      capacity: eventForm.capacity ? Number(eventForm.capacity) : null,
      points_reward: Number(eventForm.points_reward || 0),
      status: eventForm.status,
    };

    if (eventForm.id) {
      await api.patch(`/admin/events/${eventForm.id}`, payload);
    } else {
      await api.post('/admin/events', payload);
    }
    setNotice('Event saved.');
    setEventForm(emptyEventForm);
    await loadAdminData();
  };

  const archiveEvent = async (id: number) => {
    await api.delete(`/admin/events/${id}`);
    setNotice('Event archived.');
    setEventForm(emptyEventForm);
    await loadAdminData();
  };

  const publishAnnouncement = async () => {
    await api.post('/admin/announcement', {
      title: announcementForm.title,
      body: announcementForm.body,
      created_by: Number(announcementForm.created_by || user.id),
    });
    setNotice('Announcement published.');
    setAnnouncementForm(emptyAnnouncementForm);
    await loadAdminData();
  };

  const prepareWinnerAnnouncement = () => {
    const winner = topWinner || selectedUser || users[0] || null;
    const winnerName = winner?.full_name || 'K-CUBE Admin';
    const winnerPoints = winner?.points ?? 0;
    setAnnouncementForm({
      title: 'Korea Trip Winner Announcement',
      body: `Congratulations to ${winnerName} for leading the K-CUBE leaderboard with ${winnerPoints} points. This winner announcement is ready for publication from the admin panel.`,
      created_by: String(user?.id || ''),
    });
    setNotice('Winner announcement template loaded.');
  };

  const saveCalendar = async () => {
    await api.post('/admin/google-calendar/connections', calendarForm);
    setNotice('Google Calendar connection saved.');
    await loadAdminData();
  };

  const syncCalendar = async () => {
    await api.post('/admin/google-calendar/sync', {});
    setNotice('Calendar sync queued.');
    await loadAdminData();
  };

  const renderOverview = () => (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Users', value: dashboardMetrics.totalUsers ?? users.length, icon: Users },
          { label: 'Points', value: dashboardMetrics.totalPoints ?? 0, icon: CircleDollarSign },
          { label: 'XP', value: dashboardMetrics.totalXp ?? 0, icon: Activity },
          { label: 'Published pages', value: pages.filter((page) => page.status === 'published').length, icon: FilePenLine },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <Icon className="h-6 w-6 text-[#ffc400]" />
              <p className="mt-4 text-sm text-[#aab5c6]">{item.label}</p>
              <p className="mt-2 text-3xl font-black">{item.value}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.06fr)_minmax(340px,0.94fr)]">
        <SectionShell
          title="Priority workspaces"
          description="Jump straight into the sections that usually need attention first."
          actions={<button type="button" onClick={() => setActiveSection('indiaPreSelection')} className="text-sm font-bold text-[#ffc400]">Open India queue</button>}
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { id: 'submissions', label: 'Submissions', description: `${submissions.length} rows`, icon: FilePenLine },
              { id: 'indiaPreSelection', label: 'India Pre-Selection', description: `${indiaApplications.length} submissions`, icon: Mic2 },
              { id: 'uploads', label: 'Uploads', description: `${uploads.length} items`, icon: Clapperboard },
              { id: 'kfood', label: 'K-Food', description: `${claims.length} claims`, icon: ShoppingBag },
              { id: 'events', label: 'Events', description: `${events.length} events`, icon: CalendarDays },
              { id: 'website', label: 'Website CMS', description: `${pages.length} pages`, icon: FilePenLine },
              { id: 'analytics', label: 'Analytics', description: 'Usage summary', icon: BarChart3 },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id as AdminSection)}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-[#ffc400]/60 hover:bg-black/30"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Icon className="h-5 w-5 text-[#ffc400]" />
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#aab5c6]">
                      Open
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-black text-white">{item.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#aab5c6]">{item.description}</p>
                </button>
              );
            })}
          </div>
        </SectionShell>

        <SectionShell
          title="Recent actions"
          description="The latest admin activity and moderation history pulled from the audit log."
          actions={<span className="text-sm font-bold text-[#ffc400]">{filteredRecentActions.length} records</span>}
        >
          <div className="space-y-3">
            {filteredRecentActions.length ? (
              filteredRecentActions.slice(0, 6).map((entry) => (
                <article key={entry.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ffc400]">{entry.action.replace(/_/g, ' ')}</p>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#aab5c6]">
                      {entry.entity_type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-white">
                    {entry.admin_name || entry.admin_email || 'System'} updated {entry.entity_type.replace(/_/g, ' ')}
                    {entry.entity_id ? ` #${entry.entity_id}` : ''}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#aab5c6]">
                    {entry.before_status && entry.after_status ? `${entry.before_status} -> ${entry.after_status}` : entry.after_status || 'Status changed'}
                  </p>
                  {entry.review_note ? (
                    <p className="mt-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm leading-6 text-[#d4dbe7]">
                      {entry.review_note}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs text-[#98a4b1]">
                    {entry.created_at ? new Date(entry.created_at).toLocaleString() : 'No timestamp'}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-bold text-white">No recent actions yet.</p>
                <p className="mt-2 text-sm leading-6 text-[#aab5c6]">
                  Once reviews and edits happen, the latest admin activity will appear here.
                </p>
              </div>
            )}
          </div>
        </SectionShell>

        <SectionShell
          title="India Pre-Selection submissions"
          description="The latest festival applications are surfaced here so reviewers can jump into the queue without digging through the sidebar."
          actions={
            <button
              type="button"
              onClick={() => setActiveSection('indiaPreSelection')}
              className="text-sm font-bold text-[#ffc400]"
            >
              Open review queue
            </button>
          }
        >
          <div className="grid gap-3">
            {latestIndiaApplications.length ? (
              latestIndiaApplications.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setActiveSection('indiaPreSelection')}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-[#ffc400]/60 hover:bg-black/30"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-black text-white">{entry.full_name}</p>
                    <span className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#ffc400]">
                      {entry.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#aab5c6]">
                    {entry.performance_category || 'Unspecified'} - {entry.email} - {entry.submitted_at ? new Date(entry.submitted_at).toLocaleString() : 'No timestamp'}
                  </p>
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-bold text-white">No India Pre-Selection submissions yet.</p>
                <p className="mt-2 text-sm leading-6 text-[#aab5c6]">
                  Once applicants submit the form, their rows will appear here and in the dedicated review queue.
                </p>
              </div>
            )}
          </div>
        </SectionShell>
      </div>
    </div>
  );

  const renderWebsite = () => (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <SectionShell title="CMS content inventory" description="Every key page in the product is tracked here. Edit page metadata, SEO and publish state from the panel.">
        <div className="overflow-x-auto">
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
      </SectionShell>

      <SectionShell title="CMS pages" description="Pick a page first, then edit its metadata and attached CMS blocks." actions={<span className="text-sm font-bold text-[#ffc400]">{filteredPages.length} pages</span>}>
        <div className="grid gap-3 md:grid-cols-2">
          {filteredPages.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => {
                setSelectedPageId(page.id);
                setPageForm({
                  id: String(page.id),
                  slug: page.slug,
                  pageType: page.pageType,
                  titleEn: page.titleEn,
                  titleKo: page.titleKo || '',
                  titleHi: page.titleHi || '',
                  seoTitle: page.seoTitle || '',
                  seoDescription: page.seoDescription || '',
                  status: page.status,
                });
                setBlockForm((state) => ({ ...state, page_id: String(page.id) }));
              }}
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                selectedPageId === page.id ? 'border-[#ffc400] bg-black/40' : 'border-white/10 bg-black/20'
              }`}
            >
              <p className="text-xs uppercase tracking-[0.22em] text-[#98a4b1]">{page.pageType}</p>
              <p className="mt-2 font-black">{page.titleEn}</p>
              <p className="mt-1 text-sm text-[#aab5c6]">{page.slug}</p>
            </button>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        title={pageForm.id ? 'Edit page' : 'Create page'}
        description="Use this for SEO pages, landing pages and any content block that needs to be published or archived."
        actions={pageForm.id ? (
          <button type="button" onClick={() => setPageForm(emptyPageForm)} className="text-sm font-bold text-[#ffc400]">
            Reset
          </button>
        ) : null}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Slug">
              <input className={inputClass} value={pageForm.slug} onChange={(event) => setPageForm((state) => ({ ...state, slug: event.target.value }))} />
            </Field>
            <Field label="Page Type">
              <input className={inputClass} value={pageForm.pageType} onChange={(event) => setPageForm((state) => ({ ...state, pageType: event.target.value }))} />
            </Field>
          </div>
          <Field label="Title EN">
            <input className={inputClass} value={pageForm.titleEn} onChange={(event) => setPageForm((state) => ({ ...state, titleEn: event.target.value }))} />
          </Field>
          <Field label="Title KO">
            <input className={inputClass} value={pageForm.titleKo} onChange={(event) => setPageForm((state) => ({ ...state, titleKo: event.target.value }))} />
          </Field>
          <Field label="Title HI">
            <input className={inputClass} value={pageForm.titleHi} onChange={(event) => setPageForm((state) => ({ ...state, titleHi: event.target.value }))} />
          </Field>
          <Field label="SEO Title">
            <input className={inputClass} value={pageForm.seoTitle} onChange={(event) => setPageForm((state) => ({ ...state, seoTitle: event.target.value }))} />
          </Field>
          <Field label="SEO Description">
            <textarea className={`${inputClass} min-h-24`} value={pageForm.seoDescription} onChange={(event) => setPageForm((state) => ({ ...state, seoDescription: event.target.value }))} />
          </Field>
          <div className="flex items-center justify-between gap-3">
            <select className={selectClass} value={pageForm.status} onChange={(event) => setPageForm((state) => ({ ...state, status: event.target.value }))}>
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
            <button type="button" onClick={savePage} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
              <Save className="h-4 w-4" /> Save page
            </button>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        title={blockForm.id ? 'Edit CMS block' : 'Create CMS block'}
        description="Blocks let you manage hero sections, rich text, FAQs, cards and CTAs independently under each page."
        actions={blockForm.id ? (
          <button type="button" onClick={() => setBlockForm((state) => ({ ...emptyBlockForm, page_id: state.page_id }))} className="text-sm font-bold text-[#ffc400]">
            Reset
          </button>
        ) : null}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Page ID">
              <input className={inputClass} value={blockForm.page_id} onChange={(event) => setBlockForm((state) => ({ ...state, page_id: event.target.value }))} />
            </Field>
            <Field label="Block Key">
              <input className={inputClass} value={blockForm.block_key} onChange={(event) => setBlockForm((state) => ({ ...state, block_key: event.target.value }))} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Block Type">
              <select className={selectClass} value={blockForm.block_type} onChange={(event) => setBlockForm((state) => ({ ...state, block_type: event.target.value }))}>
                <option value="hero">hero</option>
                <option value="rich_text">rich_text</option>
                <option value="card_grid">card_grid</option>
                <option value="faq">faq</option>
                <option value="cta">cta</option>
                <option value="form">form</option>
                <option value="reward_rule">reward_rule</option>
                <option value="seo_schema">seo_schema</option>
              </select>
            </Field>
            <Field label="Sort Order">
              <input className={inputClass} type="number" value={blockForm.sort_order} onChange={(event) => setBlockForm((state) => ({ ...state, sort_order: Number(event.target.value) }))} />
            </Field>
          </div>
          <div className="grid gap-3 xl:grid-cols-3">
            <Field label="Content EN JSON">
              <textarea className={`${inputClass} min-h-24`} value={blockForm.content_en} onChange={(event) => setBlockForm((state) => ({ ...state, content_en: event.target.value }))} />
            </Field>
            <Field label="Content KO JSON">
              <textarea className={`${inputClass} min-h-24`} value={blockForm.content_ko} onChange={(event) => setBlockForm((state) => ({ ...state, content_ko: event.target.value }))} />
            </Field>
            <Field label="Content HI JSON">
              <textarea className={`${inputClass} min-h-24`} value={blockForm.content_hi} onChange={(event) => setBlockForm((state) => ({ ...state, content_hi: event.target.value }))} />
            </Field>
          </div>
          <div className="flex items-center justify-between gap-3">
            <select className={selectClass} value={blockForm.status} onChange={(event) => setBlockForm((state) => ({ ...state, status: event.target.value }))}>
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
            <div className="flex gap-3">
              <button type="button" onClick={saveBlock} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
                <Save className="h-4 w-4" /> Save block
              </button>
              {blockForm.id ? (
                <button type="button" onClick={() => deleteBlock(Number(blockForm.id))} className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-3 text-sm font-black text-red-300">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell title="Block library" description="All blocks attached to the selected page are listed below." actions={<span className="text-sm font-bold text-[#ffc400]">{filteredBlocks.length} blocks</span>}>
        <div className="space-y-3">
          {filteredBlocks.map((block) => (
            <button
              key={block.id}
              type="button"
              onClick={() =>
                setBlockForm({
                  id: String(block.id),
                  page_id: String(block.page_id),
                  block_key: block.block_key,
                  block_type: block.block_type,
                  sort_order: block.sort_order,
                  content_en: JSON.stringify(block.content_en, null, 2),
                  content_ko: JSON.stringify(block.content_ko, null, 2),
                  content_hi: JSON.stringify(block.content_hi, null, 2),
                  status: block.status,
                })
              }
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-black">{block.block_key}</p>
                <span className="text-xs font-black text-[#ffc400]">{block.status}</span>
              </div>
              <p className="mt-2 text-sm text-[#aab5c6]">
                {block.page_title} · {block.block_type} · order {block.sort_order}
              </p>
            </button>
          ))}
          {!visibleBlocks.length ? <p className="text-sm text-[#aab5c6]">No blocks yet for this page.</p> : null}
        </div>
      </SectionShell>
    </div>
  );

  const renderLearning = () => (
    <div className="grid gap-5 xl:grid-cols-[minmax(320px,360px)_minmax(0,1fr)]">
      <SectionShell title="Learning track editor" description="Create and maintain lesson tracks, reward points and JSON copy blocks used by the learning journeys." actions={<span className="text-sm font-bold text-[#ffc400]">{filteredTracks.length} tracks</span>}>
        <div className="space-y-3">
          {filteredTracks.map((track) => (
            <button
              key={track.id}
              type="button"
              onClick={() => setSelectedTrackId(track.id)}
              className={`w-full rounded-2xl border px-4 py-4 text-left transition ${selectedTrackId === track.id ? 'border-[#ffc400] bg-black/40' : 'border-white/10 bg-black/20'}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-black">{track.title}</span>
                <span className="text-xs font-black text-[#ffc400]">{track.bankSize} questions</span>
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[#98a4b1]">{track.slug}</p>
            </button>
          ))}
        </div>
        <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black">{trackForm.id ? 'Edit track' : 'Create track'}</h3>
            <button type="button" onClick={() => setTrackForm(emptyTrackForm)} className="text-sm font-bold text-[#ffc400]">
              Reset
            </button>
          </div>
          <Field label="Slug">
            <input className={inputClass} value={trackForm.slug} onChange={(event) => setTrackForm((state) => ({ ...state, slug: event.target.value }))} />
          </Field>
          <Field label="Title">
            <input className={inputClass} value={trackForm.title} onChange={(event) => setTrackForm((state) => ({ ...state, title: event.target.value }))} />
          </Field>
          <Field label="Eyebrow">
            <input className={inputClass} value={trackForm.eyebrow} onChange={(event) => setTrackForm((state) => ({ ...state, eyebrow: event.target.value }))} />
          </Field>
          <Field label="Intro">
            <textarea className={`${inputClass} min-h-24`} value={trackForm.intro} onChange={(event) => setTrackForm((state) => ({ ...state, intro: event.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Accent">
              <input className={inputClass} value={trackForm.accent} onChange={(event) => setTrackForm((state) => ({ ...state, accent: event.target.value }))} />
            </Field>
            <Field label="Reward Points">
              <input className={inputClass} type="number" value={trackForm.rewardPoints} onChange={(event) => setTrackForm((state) => ({ ...state, rewardPoints: Number(event.target.value) }))} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Step Size">
              <input className={inputClass} type="number" value={trackForm.stepSize} onChange={(event) => setTrackForm((state) => ({ ...state, stepSize: Number(event.target.value) }))} />
            </Field>
            <Field label="Sort Order">
              <input className={inputClass} type="number" value={trackForm.sortOrder} onChange={(event) => setTrackForm((state) => ({ ...state, sortOrder: Number(event.target.value) }))} />
            </Field>
          </div>
          <Field label="Overview JSON">
            <textarea className={`${inputClass} min-h-24`} value={trackForm.overview} onChange={(event) => setTrackForm((state) => ({ ...state, overview: event.target.value }))} />
          </Field>
          <Field label="Login Copy JSON">
            <textarea className={`${inputClass} min-h-24`} value={trackForm.loginCopy} onChange={(event) => setTrackForm((state) => ({ ...state, loginCopy: event.target.value }))} />
          </Field>
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-white">
              <input type="checkbox" checked={trackForm.active} onChange={(event) => setTrackForm((state) => ({ ...state, active: event.target.checked }))} />
              Active
            </label>
            <div className="flex gap-3">
              <button type="button" onClick={saveTrack} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
                <Save className="h-4 w-4" /> Save track
              </button>
              {trackForm.id ? (
                <button type="button" onClick={() => deleteTrack(Number(trackForm.id))} className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-3 text-sm font-black text-red-300">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell title="Question bank editor" description="Pick a track on the left, then create or modify the linked questions and structured payloads.">
        <div className="grid gap-4 lg:grid-cols-[minmax(320px,360px)_minmax(0,1fr)]">
          <div className="space-y-3">
            {visibleQuestions.map((question) => (
              <button
                key={question.id}
                type="button"
                onClick={() =>
                  setQuestionForm({
                    id: String(question.id),
                    trackId: String(question.trackId),
                    questionKey: question.questionKey,
                    type: question.type,
                    tag: question.tag,
                    prompt: question.prompt,
                    korean: question.korean,
                    answer: question.answer,
                    options: JSON.stringify(question.options, null, 2),
                    words: JSON.stringify(question.words, null, 2),
                    cards: JSON.stringify(question.cards, null, 2),
                    pairs: JSON.stringify(question.pairs, null, 2),
                    hint: question.hint,
                    points: question.points,
                    sortOrder: question.sortOrder,
                    active: question.active,
                  })
                }
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-left"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-[#98a4b1]">
                  {question.type} / {question.tag}
                </p>
                <p className="mt-2 font-black">{question.questionKey}</p>
                <p className="mt-1 text-sm text-[#aab5c6]">{question.prompt}</p>
              </button>
            ))}
          {!visibleQuestions.length ? <p className="text-sm text-[#aab5c6]">Select a track and start creating questions.</p> : null}
          </div>

          <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black">{questionForm.id ? 'Edit question' : 'Create question'}</h3>
              <button type="button" onClick={() => setQuestionForm({ ...emptyQuestionForm, trackId: questionForm.trackId })} className="text-sm font-bold text-[#ffc400]">
                Reset
              </button>
            </div>
            <Field label="Track ID">
              <input className={inputClass} value={questionForm.trackId} onChange={(event) => setQuestionForm((state) => ({ ...state, trackId: event.target.value }))} />
            </Field>
            <Field label="Question Key">
              <input className={inputClass} value={questionForm.questionKey} onChange={(event) => setQuestionForm((state) => ({ ...state, questionKey: event.target.value }))} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Type">
                <input className={inputClass} value={questionForm.type} onChange={(event) => setQuestionForm((state) => ({ ...state, type: event.target.value }))} />
              </Field>
              <Field label="Tag">
                <input className={inputClass} value={questionForm.tag} onChange={(event) => setQuestionForm((state) => ({ ...state, tag: event.target.value }))} />
              </Field>
            </div>
            <Field label="Prompt">
              <textarea className={`${inputClass} min-h-20`} value={questionForm.prompt} onChange={(event) => setQuestionForm((state) => ({ ...state, prompt: event.target.value }))} />
            </Field>
            <Field label="Korean">
              <input className={inputClass} value={questionForm.korean} onChange={(event) => setQuestionForm((state) => ({ ...state, korean: event.target.value }))} />
            </Field>
            <Field label="Answer">
              <input className={inputClass} value={questionForm.answer} onChange={(event) => setQuestionForm((state) => ({ ...state, answer: event.target.value }))} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Points">
                <input className={inputClass} type="number" value={questionForm.points} onChange={(event) => setQuestionForm((state) => ({ ...state, points: Number(event.target.value) }))} />
              </Field>
              <Field label="Sort Order">
                <input className={inputClass} type="number" value={questionForm.sortOrder} onChange={(event) => setQuestionForm((state) => ({ ...state, sortOrder: Number(event.target.value) }))} />
              </Field>
            </div>
            <Field label="Options JSON">
              <textarea className={`${inputClass} min-h-20`} value={questionForm.options} onChange={(event) => setQuestionForm((state) => ({ ...state, options: event.target.value }))} />
            </Field>
            <Field label="Words JSON">
              <textarea className={`${inputClass} min-h-20`} value={questionForm.words} onChange={(event) => setQuestionForm((state) => ({ ...state, words: event.target.value }))} />
            </Field>
            <Field label="Cards JSON">
              <textarea className={`${inputClass} min-h-20`} value={questionForm.cards} onChange={(event) => setQuestionForm((state) => ({ ...state, cards: event.target.value }))} />
            </Field>
            <Field label="Pairs JSON">
              <textarea className={`${inputClass} min-h-20`} value={questionForm.pairs} onChange={(event) => setQuestionForm((state) => ({ ...state, pairs: event.target.value }))} />
            </Field>
            <Field label="Hint">
              <textarea className={`${inputClass} min-h-20`} value={questionForm.hint} onChange={(event) => setQuestionForm((state) => ({ ...state, hint: event.target.value }))} />
            </Field>
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-white">
                <input type="checkbox" checked={questionForm.active} onChange={(event) => setQuestionForm((state) => ({ ...state, active: event.target.checked }))} />
                Active
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={saveQuestion} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
                  <Save className="h-4 w-4" /> Save question
                </button>
                {questionForm.id ? (
                  <button type="button" onClick={() => deleteQuestion(Number(questionForm.id))} className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-3 text-sm font-black text-red-300">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </SectionShell>
    </div>
  );

  const renderUsers = () => (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      <SectionShell title="Users" description="Review roles, account state, city/state, profile image and membership classification." actions={<span className="text-sm font-bold text-[#ffc400]">{filteredUsers.length} records</span>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-[#ffc400]">
              <tr>
                <th className="border-b border-white/10 py-3">Name</th>
                <th className="border-b border-white/10 py-3">Email</th>
                <th className="border-b border-white/10 py-3">Role</th>
                <th className="border-b border-white/10 py-3">Status</th>
                <th className="border-b border-white/10 py-3">Points</th>
                <th className="border-b border-white/10 py-3">Streak</th>
              </tr>
            </thead>
            <tbody className="text-[#d4dbe7]">
              {filteredUsers.map((entry) => (
                <tr
                  key={entry.id}
                  className="cursor-pointer hover:bg-white/5"
                  onClick={() =>
                    setUserForm({
                      id: String(entry.id),
                      full_name: entry.full_name,
                      phone: entry.phone || '',
                      role: entry.role,
                      category_access: entry.category_access,
                      status: entry.status,
                      city: entry.city || '',
                      state: entry.state || '',
                      country: entry.country || '',
                      profile_image: entry.profile_image || '',
                    })
                  }
                >
                  <td className="border-b border-white/10 py-3 font-bold">{entry.full_name}</td>
                  <td className="border-b border-white/10 py-3">{entry.email}</td>
                  <td className="border-b border-white/10 py-3 capitalize">{entry.role}</td>
                  <td className="border-b border-white/10 py-3 capitalize">{entry.status}</td>
                  <td className="border-b border-white/10 py-3">{entry.points}</td>
                  <td className="border-b border-white/10 py-3">{entry.streak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionShell>

      <SectionShell title="Edit user" description="Update access, category access, profile details and account status directly from the admin panel.">
        <div className="space-y-3">
          <Field label="Full Name">
            <input className={inputClass} value={userForm.full_name} onChange={(event) => setUserForm((state) => ({ ...state, full_name: event.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Role">
              <select className={selectClass} value={userForm.role} onChange={(event) => setUserForm((state) => ({ ...state, role: event.target.value }))}>
                <option value="member">member</option>
                <option value="manager">manager</option>
                <option value="admin">admin</option>
                <option value="guest">guest</option>
              </select>
            </Field>
            <Field label="Status">
              <select className={selectClass} value={userForm.status} onChange={(event) => setUserForm((state) => ({ ...state, status: event.target.value }))}>
                <option value="active">active</option>
                <option value="pending">pending</option>
                <option value="suspended">suspended</option>
                <option value="deleted">deleted</option>
              </select>
            </Field>
          </div>
          <Field label="Category Access">
            <select className={selectClass} value={userForm.category_access} onChange={(event) => setUserForm((state) => ({ ...state, category_access: event.target.value }))}>
              <option value="category_a">category_a</option>
              <option value="category_b">category_b</option>
              <option value="category_c">category_c</option>
            </select>
          </Field>
          <Field label="Phone">
            <input className={inputClass} value={userForm.phone} onChange={(event) => setUserForm((state) => ({ ...state, phone: event.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City">
              <input className={inputClass} value={userForm.city} onChange={(event) => setUserForm((state) => ({ ...state, city: event.target.value }))} />
            </Field>
            <Field label="State">
              <input className={inputClass} value={userForm.state} onChange={(event) => setUserForm((state) => ({ ...state, state: event.target.value }))} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Country">
              <input className={inputClass} value={userForm.country} onChange={(event) => setUserForm((state) => ({ ...state, country: event.target.value }))} />
            </Field>
            <Field label="Profile Image">
              <input className={inputClass} value={userForm.profile_image} onChange={(event) => setUserForm((state) => ({ ...state, profile_image: event.target.value }))} />
            </Field>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={saveUser} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
              <Save className="h-4 w-4" /> Save user
            </button>
            {userForm.id ? (
              <button type="button" onClick={deleteUser} className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-3 text-sm font-black text-red-300">
                <Trash2 className="h-4 w-4" /> Delete user
              </button>
            ) : null}
          </div>
        </div>
      </SectionShell>
    </div>
  );

  const renderAdminProfile = () => {
    const profile = adminProfile || user;
    const profileName = adminProfile?.full_name || (user as any).full_name || (user as any).fullName || 'Admin';
    const profileEmail = adminProfile?.email || user.email || '';
    const profileRole = adminProfile?.role || user.role || 'admin';
    const profileStatus = adminProfile?.status || 'active';
    const profileLastLogin = adminProfile?.last_login || null;
    const profileReferralCode = adminProfile?.referral_code || 'No code';
    return (
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(340px,420px)]">
        <SectionShell
          title="Admin profile"
          description="Keep your identity and contact details current, then rotate your password when needed."
          actions={<span className="text-sm font-bold text-[#ffc400]">Account #{profile.id}</span>}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: 'Role', value: profileRole },
              { label: 'Status', value: profileStatus },
              { label: 'Last login', value: profileLastLogin ? new Date(profileLastLogin).toLocaleString() : 'No login recorded' },
              { label: 'Referral', value: profileReferralCode },
            ].map((item) => (
              <article key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">{item.label}</p>
                <p className="mt-2 text-sm font-bold text-white">{item.value}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-3">
              <Field label="Full name">
                <input className={inputClass} value={adminProfileForm.full_name} onChange={(event) => setAdminProfileForm((state) => ({ ...state, full_name: event.target.value }))} />
              </Field>
              <Field label="Phone">
                <input className={inputClass} value={adminProfileForm.phone} onChange={(event) => setAdminProfileForm((state) => ({ ...state, phone: event.target.value }))} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="City">
                  <input className={inputClass} value={adminProfileForm.city} onChange={(event) => setAdminProfileForm((state) => ({ ...state, city: event.target.value }))} />
                </Field>
                <Field label="State">
                  <input className={inputClass} value={adminProfileForm.state} onChange={(event) => setAdminProfileForm((state) => ({ ...state, state: event.target.value }))} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Country">
                  <input className={inputClass} value={adminProfileForm.country} onChange={(event) => setAdminProfileForm((state) => ({ ...state, country: event.target.value }))} />
                </Field>
                <Field label="Profile image">
                  <input className={inputClass} value={adminProfileForm.profile_image} onChange={(event) => setAdminProfileForm((state) => ({ ...state, profile_image: event.target.value }))} />
                </Field>
              </div>
              <button type="button" onClick={saveAdminProfile} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
                <Save className="h-4 w-4" />
                Save profile
              </button>
            </div>

            <div className="space-y-3 rounded-3xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ffc400]">Security</p>
              <Field label="Current password">
                <input type="password" className={inputClass} value={adminPasswordForm.current_password} onChange={(event) => setAdminPasswordForm((state) => ({ ...state, current_password: event.target.value }))} />
              </Field>
              <Field label="New password">
                <input type="password" className={inputClass} value={adminPasswordForm.new_password} onChange={(event) => setAdminPasswordForm((state) => ({ ...state, new_password: event.target.value }))} />
              </Field>
              <Field label="Confirm password">
                <input type="password" className={inputClass} value={adminPasswordForm.confirm_password} onChange={(event) => setAdminPasswordForm((state) => ({ ...state, confirm_password: event.target.value }))} />
              </Field>
              <button type="button" onClick={changeAdminPassword} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-black text-white">
                <KeyRound className="h-4 w-4" />
                Change password
              </button>
            </div>
          </div>
        </SectionShell>

        <SectionShell title="Profile notes" description="Use this area as a clean reference for the current admin identity and operational posture.">
          <div className="space-y-3">
            <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">Identity</p>
              <p className="mt-2 text-sm font-bold text-white">{profileName}</p>
              <p className="mt-1 text-sm text-[#aab5c6]">{profileEmail}</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">Workspace</p>
              <p className="mt-2 text-sm font-bold text-white">Admin console access</p>
              <p className="mt-1 text-sm leading-6 text-[#aab5c6]">
                Keep profile details current so review history, sign-offs and escalations always point to the right person.
              </p>
            </article>
          </div>
        </SectionShell>
      </div>
    );
  };

  const renderAdminAccounts = () => (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
      <SectionShell
        title="Admin accounts"
        description="Create additional admin users and keep a tight roster of who has control-center access."
        actions={<span className="text-sm font-bold text-[#ffc400]">{filteredAdminAccounts.length} admins</span>}
      >
        <div className="space-y-3">
          {filteredAdminAccounts.map((account) => (
            <article key={account.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-black text-white">{account.full_name}</p>
                  <p className="mt-1 text-sm text-[#aab5c6]">{account.email}</p>
                </div>
                <span className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#ffc400]">
                  {account.status}
                </span>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-[#aab5c6] sm:grid-cols-2">
                <p>Username: {account.username}</p>
                <p>Phone: {account.phone || 'Not set'}</p>
                <p>Role: {account.role}</p>
                <p>Created: {account.created_at ? new Date(account.created_at).toLocaleString() : 'Unknown'}</p>
              </div>
            </article>
          ))}
          {!filteredAdminAccounts.length ? (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm font-bold text-white">No admin accounts found.</p>
              <p className="mt-2 text-sm leading-6 text-[#aab5c6]">Create the first admin account from the panel on the right.</p>
            </div>
          ) : null}
        </div>
      </SectionShell>

      <SectionShell title="Create admin" description="Add another admin account with full control-center access.">
        <div className="space-y-3">
          <Field label="Full name">
            <input className={inputClass} value={adminAccountForm.full_name} onChange={(event) => setAdminAccountForm((state) => ({ ...state, full_name: event.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Username">
              <input className={inputClass} value={adminAccountForm.username} onChange={(event) => setAdminAccountForm((state) => ({ ...state, username: event.target.value }))} />
            </Field>
            <Field label="Email">
              <input className={inputClass} value={adminAccountForm.email} onChange={(event) => setAdminAccountForm((state) => ({ ...state, email: event.target.value }))} />
            </Field>
          </div>
          <Field label="Phone">
            <input className={inputClass} value={adminAccountForm.phone} onChange={(event) => setAdminAccountForm((state) => ({ ...state, phone: event.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Password">
              <input type="password" className={inputClass} value={adminAccountForm.password} onChange={(event) => setAdminAccountForm((state) => ({ ...state, password: event.target.value }))} />
            </Field>
            <Field label="Status">
              <select className={selectClass} value={adminAccountForm.status} onChange={(event) => setAdminAccountForm((state) => ({ ...state, status: event.target.value }))}>
                <option value="active">active</option>
                <option value="pending">pending</option>
                <option value="suspended">suspended</option>
              </select>
            </Field>
          </div>
          <Field label="Category access">
            <select className={selectClass} value={adminAccountForm.category_access} onChange={(event) => setAdminAccountForm((state) => ({ ...state, category_access: event.target.value }))}>
              <option value="category_a">category_a</option>
              <option value="category_b">category_b</option>
              <option value="category_c">category_c</option>
            </select>
          </Field>
          <button type="button" onClick={createAdminAccount} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
            <ShieldCheck className="h-4 w-4" />
            Create admin account
          </button>
        </div>
      </SectionShell>
    </div>
  );

  const renderChapters = () => (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      <SectionShell title="Chapter directory" description="Manage branch chapters, leaders and member counts from the admin panel." actions={<span className="text-sm font-bold text-[#ffc400]">{filteredChapters.length} records</span>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] text-left text-sm">
            <thead className="text-[#ffc400]">
              <tr>
                <th className="border-b border-white/10 py-3">Name</th>
                <th className="border-b border-white/10 py-3">Slug</th>
                <th className="border-b border-white/10 py-3">City</th>
                <th className="border-b border-white/10 py-3">Leader</th>
                <th className="border-b border-white/10 py-3">Members</th>
                <th className="border-b border-white/10 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-[#d4dbe7]">
              {filteredChapters.map((chapter) => (
                <tr
                  key={chapter.id}
                  className="cursor-pointer hover:bg-white/5"
                  onClick={() =>
                    setChapterForm({
                      id: String(chapter.id),
                      name: chapter.name,
                      slug: chapter.slug,
                      description: chapter.description || '',
                      city: chapter.city,
                      state: chapter.state,
                      country: chapter.country,
                      leader_id: chapter.leader_id ? String(chapter.leader_id) : '',
                      member_count: chapter.member_count,
                      latitude: chapter.latitude !== null && chapter.latitude !== undefined ? String(chapter.latitude) : '',
                      longitude: chapter.longitude !== null && chapter.longitude !== undefined ? String(chapter.longitude) : '',
                      status: chapter.status,
                    })
                  }
                >
                  <td className="border-b border-white/10 py-3 font-bold">{chapter.name}</td>
                  <td className="border-b border-white/10 py-3">{chapter.slug}</td>
                  <td className="border-b border-white/10 py-3">{chapter.city}, {chapter.state}</td>
                  <td className="border-b border-white/10 py-3">{chapter.leader_name || chapter.leader_email || '-'}</td>
                  <td className="border-b border-white/10 py-3">{chapter.member_count}</td>
                  <td className="border-b border-white/10 py-3 capitalize">{chapter.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionShell>

      <SectionShell
        title={chapterForm.id ? 'Edit chapter' : 'Create chapter'}
        description="Create or refine chapter records for the map, leaders and community directory."
        actions={chapterForm.id ? (
          <button type="button" onClick={() => setChapterForm(emptyChapterForm)} className="text-sm font-bold text-[#ffc400]">
            Reset
          </button>
        ) : null}
      >
        <div className="space-y-3">
          <Field label="Name">
            <input className={inputClass} value={chapterForm.name} onChange={(event) => setChapterForm((state) => ({ ...state, name: event.target.value }))} />
          </Field>
          <Field label="Slug">
            <input className={inputClass} value={chapterForm.slug} onChange={(event) => setChapterForm((state) => ({ ...state, slug: event.target.value }))} />
          </Field>
          <Field label="Description">
            <textarea className={`${inputClass} min-h-24`} value={chapterForm.description} onChange={(event) => setChapterForm((state) => ({ ...state, description: event.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City">
              <input className={inputClass} value={chapterForm.city} onChange={(event) => setChapterForm((state) => ({ ...state, city: event.target.value }))} />
            </Field>
            <Field label="State">
              <input className={inputClass} value={chapterForm.state} onChange={(event) => setChapterForm((state) => ({ ...state, state: event.target.value }))} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Country">
              <input className={inputClass} value={chapterForm.country} onChange={(event) => setChapterForm((state) => ({ ...state, country: event.target.value }))} />
            </Field>
            <Field label="Leader ID">
              <input className={inputClass} value={chapterForm.leader_id} onChange={(event) => setChapterForm((state) => ({ ...state, leader_id: event.target.value }))} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Members">
              <input className={inputClass} type="number" value={chapterForm.member_count} onChange={(event) => setChapterForm((state) => ({ ...state, member_count: Number(event.target.value) }))} />
            </Field>
            <Field label="Latitude">
              <input className={inputClass} value={chapterForm.latitude} onChange={(event) => setChapterForm((state) => ({ ...state, latitude: event.target.value }))} />
            </Field>
            <Field label="Longitude">
              <input className={inputClass} value={chapterForm.longitude} onChange={(event) => setChapterForm((state) => ({ ...state, longitude: event.target.value }))} />
            </Field>
          </div>
          <Field label="Status">
            <select className={selectClass} value={chapterForm.status} onChange={(event) => setChapterForm((state) => ({ ...state, status: event.target.value }))}>
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="archived">archived</option>
            </select>
          </Field>
          <div className="flex gap-3">
            <button type="button" onClick={saveChapter} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
              <Save className="h-4 w-4" /> Save chapter
            </button>
            {chapterForm.id ? (
              <button type="button" onClick={() => deleteChapter(Number(chapterForm.id))} className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-3 text-sm font-black text-red-300">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            ) : null}
          </div>
        </div>
      </SectionShell>
    </div>
  );

  const renderPoints = () => (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      <SectionShell title="Points ledger" description="Manual adjustments and audit history for point balance changes." actions={<span className="text-sm font-bold text-[#ffc400]">{filteredPoints.length} records</span>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-[#ffc400]">
              <tr>
                <th className="border-b border-white/10 py-3">User</th>
                <th className="border-b border-white/10 py-3">Source</th>
                <th className="border-b border-white/10 py-3">Delta</th>
                <th className="border-b border-white/10 py-3">Balance</th>
                <th className="border-b border-white/10 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="text-[#d4dbe7]">
              {filteredPoints.map((tx) => (
                <tr key={tx.id}>
                  <td className="border-b border-white/10 py-3">{tx.full_name}</td>
                  <td className="border-b border-white/10 py-3">{tx.source_type}</td>
                  <td className="border-b border-white/10 py-3">{tx.points_delta}</td>
                  <td className="border-b border-white/10 py-3">{tx.balance_after}</td>
                  <td className="border-b border-white/10 py-3">{new Date(tx.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionShell>

      <SectionShell title="Manual points adjustment" description="Issue or subtract points with an audit note.">
        <div className="space-y-3">
          <Field label="User ID">
            <input className={inputClass} value={pointsForm.user_id} onChange={(event) => setPointsForm((state) => ({ ...state, user_id: event.target.value }))} />
          </Field>
          <Field label="Points Delta">
            <input className={inputClass} type="number" value={pointsForm.points_delta} onChange={(event) => setPointsForm((state) => ({ ...state, points_delta: Number(event.target.value) }))} />
          </Field>
          <Field label="Reason">
            <textarea className={`${inputClass} min-h-24`} value={pointsForm.reason} onChange={(event) => setPointsForm((state) => ({ ...state, reason: event.target.value }))} />
          </Field>
          <button type="button" onClick={sendPoints} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
            <Save className="h-4 w-4" /> Submit adjustment
          </button>
        </div>
      </SectionShell>
    </div>
  );

  const renderUploads = () => (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      <SectionShell title="Content upload review" description="Approve or reject user generated uploads and attach verified points." actions={<span className="text-sm font-bold text-[#ffc400]">{filteredUploads.length} records</span>}>
        <div className="space-y-3">
          {filteredUploads.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => {
                setSelectedUploadId(entry.id);
                setUploadReview({ status: 'approved', points_reward: entry.points_reward || 0, review_note: entry.review_note || '' });
              }}
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-black">{entry.title}</p>
                <span className="text-xs font-black text-[#ffc400]">{entry.status}</span>
              </div>
              <p className="mt-2 text-sm text-[#aab5c6]">
                {entry.category} · {entry.full_name || 'Unknown user'} · {entry.email || 'No email'}
              </p>
            </button>
          ))}
        </div>
      </SectionShell>

      <SectionShell title="Review upload" description="Select an item on the left to review it.">
        {selectedUpload ? (
          <div className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[#ffc400]">{selectedUpload.category}</p>
              <h3 className="mt-2 text-xl font-black">{selectedUpload.title}</h3>
              <p className="mt-2 text-sm text-[#aab5c6]">{selectedUpload.full_name || 'Unknown user'}</p>
            </div>
            <Field label="Points Reward">
              <input className={inputClass} type="number" value={uploadReview.points_reward} onChange={(event) => setUploadReview((state) => ({ ...state, points_reward: Number(event.target.value) }))} />
            </Field>
            <Field label="Review Note">
              <textarea className={`${inputClass} min-h-24`} value={uploadReview.review_note} onChange={(event) => setUploadReview((state) => ({ ...state, review_note: event.target.value }))} />
            </Field>
            <div className="flex gap-3">
              <button type="button" onClick={() => reviewUpload('approved')} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
                <CheckCircle2 className="h-4 w-4" /> Approve
              </button>
              <button type="button" onClick={() => reviewUpload('rejected')} className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-3 text-sm font-black text-red-300">
                <Trash2 className="h-4 w-4" /> Reject
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#aab5c6]">Select a submission to review it here.</p>
        )}
      </SectionShell>
    </div>
  );

  const renderIndiaPreSelection = () => {
    const counts = {
      submitted: filteredIndiaApplications.filter((entry) => entry.status === 'submitted').length,
      reviewing: filteredIndiaApplications.filter((entry) => entry.status === 'reviewing').length,
      shortlisted: filteredIndiaApplications.filter((entry) => entry.status === 'shortlisted').length,
      selected: filteredIndiaApplications.filter((entry) => entry.status === 'selected').length,
      rejected: filteredIndiaApplications.filter((entry) => entry.status === 'rejected').length,
    };

    return (
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: 'Submitted', value: counts.submitted },
            { label: 'Reviewing', value: counts.reviewing },
            { label: 'Shortlisted', value: counts.shortlisted },
            { label: 'Selected', value: counts.selected },
            { label: 'Rejected', value: counts.rejected },
          ].map((item) => (
            <article key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#98a4b1]">{item.label}</p>
              <p className="mt-2 text-3xl font-black text-white">{item.value}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <SectionShell
            title="India Pre-Selection queue"
            description="A compact reviewer queue with live status chips and audit-safe submission handling."
            actions={<span className="text-sm font-bold text-[#ffc400]">{filteredIndiaApplications.length} records</span>}
          >
            <div className="space-y-3">
              {filteredIndiaApplications.map((entry) => {
                const active = selectedIndiaApplicationId === entry.id;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setSelectedIndiaApplicationId(entry.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      active ? 'border-[#ffc400] bg-black/40 shadow-[0_0_0_1px_rgba(255,196,0,0.12)]' : 'border-white/10 bg-black/20 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-lg font-black text-white">{entry.full_name}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#ffc400]">
                            {entry.status}
                          </span>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#d4dbe7]">
                            {entry.performance_category || 'Application'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-[#98a4b1]">
                        <p>{entry.current_city || 'No city'}</p>
                        <p className="mt-1">{entry.nationality || 'No nationality'}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-[#aab5c6] sm:grid-cols-3">
                      <p className="truncate">{entry.email}</p>
                      <p>{entry.phone || 'No phone'}</p>
                      <p>{entry.submitted_at ? new Date(entry.submitted_at).toLocaleString() : 'No timestamp'}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionShell>

          <SectionShell
            title="Applicant profile + decision"
            description="Review the applicant on the left, then finalize moderation from the sticky decision stack."
          >
            {selectedIndiaApplication ? (
              <div className="space-y-4">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
                  <div className="space-y-4">
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffc400]">Applicant profile</p>
                          <h3 className="mt-2 text-3xl font-black text-white">{selectedIndiaApplication.full_name}</h3>
                          <p className="mt-2 text-sm text-[#aab5c6]">{selectedIndiaApplication.user_email || selectedIndiaApplication.email}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#ffc400]">
                            {selectedIndiaApplication.status}
                          </span>
                          {selectedIndiaApplication.points_awarded ? (
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#d4dbe7]">
                              +{selectedIndiaApplication.points_awarded} points
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { label: 'Phone', value: selectedIndiaApplication.user_phone || selectedIndiaApplication.phone || 'No phone' },
                        { label: 'City', value: selectedIndiaApplication.current_city || 'No city' },
                        { label: 'Nationality', value: selectedIndiaApplication.nationality || 'No nationality' },
                        { label: 'DOB', value: selectedIndiaApplication.date_of_birth || 'Not provided' },
                      ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">{item.label}</p>
                          <p className="mt-2 text-sm font-bold text-white">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">Submitted</p>
                        <p className="mt-2 text-sm font-bold text-white">
                          {selectedIndiaApplication.submitted_at ? new Date(selectedIndiaApplication.submitted_at).toLocaleString() : 'Unknown'}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">Reviewed</p>
                        <p className="mt-2 text-sm font-bold text-white">
                          {selectedIndiaApplication.reviewed_at ? new Date(selectedIndiaApplication.reviewed_at).toLocaleString() : 'Not reviewed yet'}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">Biography</p>
                      <p className="mt-2 text-sm leading-7 text-[#d4dbe7]">{selectedIndiaApplication.biography || 'No biography provided.'}</p>
                      {selectedIndiaApplication.video_link ? (
                        <a href={selectedIndiaApplication.video_link} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-bold text-[#ffc400]">
                          View performance link
                        </a>
                      ) : null}
                    </div>

                    {selectedIndiaApplication.message ? (
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">Applicant message</p>
                        <p className="mt-2 text-sm leading-7 text-[#aab5c6]">{selectedIndiaApplication.message}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="xl:sticky xl:top-6 space-y-3 self-start">
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffc400]">Decision</p>
                      <Field label="Status">
                        <select
                          className={selectClass}
                          value={indiaApplicationReview.status}
                          onChange={(event) => setIndiaApplicationReview((state) => ({ ...state, status: event.target.value }))}
                        >
                          <option value="submitted">submitted</option>
                          <option value="reviewing">reviewing</option>
                          <option value="shortlisted">shortlisted</option>
                          <option value="selected">selected</option>
                          <option value="rejected">rejected</option>
                          <option value="withdrawn">withdrawn</option>
                        </select>
                      </Field>
                      <Field label="Review note">
                        <textarea
                          className={`${inputClass} min-h-32`}
                          value={indiaApplicationReview.review_note}
                          onChange={(event) => setIndiaApplicationReview((state) => ({ ...state, review_note: event.target.value }))}
                          placeholder="Short executive note for moderation history."
                        />
                      </Field>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#ffc400]">Current review</p>
                      <p className="mt-2 text-sm font-bold text-white">
                        {selectedIndiaApplication.reviewed_by_name || selectedIndiaApplication.reviewed_by_email || 'No reviewer yet'}
                      </p>
                      <p className="mt-1 text-sm text-[#aab5c6]">
                        {selectedIndiaApplication.reviewed_at ? new Date(selectedIndiaApplication.reviewed_at).toLocaleString() : 'No review timestamp'}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#f3a847]/20 bg-[#fff8df] p-4">
                      <p className="text-sm font-black text-[#111827]">Decision policy</p>
                      <p className="mt-2 text-sm leading-7 text-[#565959]">
                        The points award is locked at submission time. Review only adjusts moderation state and the audit trail.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button type="button" onClick={reviewIndiaApplication} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
                        <CheckCircle2 className="h-4 w-4" />
                        Save review
                      </button>
                      <button type="button" onClick={() => setIndiaApplicationReview((state) => ({ ...state, status: 'reviewing' }))} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white">
                        Reviewing
                      </button>
                      <button type="button" onClick={() => setIndiaApplicationReview((state) => ({ ...state, status: 'shortlisted' }))} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white">
                        Shortlist
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#aab5c6]">Select an application to review it here.</p>
            )}
          </SectionShell>
        </div>
      </div>
    );
  };

  const renderKFood = () => (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      <SectionShell title="K-Food claims" description="Audit purchase claims, coupon references and reward eligibility." actions={<span className="text-sm font-bold text-[#ffc400]">{filteredClaims.length} records</span>}>
        <div className="space-y-3">
          {filteredClaims.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => {
                setSelectedClaimId(entry.id);
                setClaimReview({ status: 'approved', points_reward: entry.points_reward || 0, review_note: entry.review_note || '' });
              }}
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-black">{entry.order_id}</p>
                <span className="text-xs font-black text-[#ffc400]">{entry.status}</span>
              </div>
              <p className="mt-2 text-sm text-[#aab5c6]">
                {entry.full_name} · {entry.email} · {entry.order_total}
              </p>
            </button>
          ))}
        </div>
      </SectionShell>

      <SectionShell title="Review claim" description="Approve or reject K-Food purchase claims from the admin panel.">
        {selectedClaim ? (
          <div className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[#ffc400]">{selectedClaim.order_id}</p>
              <h3 className="mt-2 text-xl font-black">{selectedClaim.full_name}</h3>
              <p className="mt-2 text-sm text-[#aab5c6]">{selectedClaim.order_total}</p>
            </div>
            <Field label="Points Reward">
              <input className={inputClass} type="number" value={claimReview.points_reward} onChange={(event) => setClaimReview((state) => ({ ...state, points_reward: Number(event.target.value) }))} />
            </Field>
            <Field label="Review Note">
              <textarea className={`${inputClass} min-h-24`} value={claimReview.review_note} onChange={(event) => setClaimReview((state) => ({ ...state, review_note: event.target.value }))} />
            </Field>
            <div className="flex gap-3">
              <button type="button" onClick={() => reviewClaim('approved')} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
                <CheckCircle2 className="h-4 w-4" /> Approve
              </button>
              <button type="button" onClick={() => reviewClaim('rejected')} className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-3 text-sm font-black text-red-300">
                <Trash2 className="h-4 w-4" /> Reject
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#aab5c6]">Select a claim to review it here.</p>
        )}
      </SectionShell>
    </div>
  );

  const renderSubmissions = () => {
    const counts = {
      total: filteredSubmissions.length,
      pending: filteredSubmissions.filter((entry) => ['submitted', 'pending', 'reviewing'].includes(entry.status)).length,
      reviewed: filteredSubmissions.filter((entry) => ['approved', 'selected', 'shortlisted', 'delivered', 'published'].includes(entry.status)).length,
      sources: new Set(filteredSubmissions.map((entry) => entry.source_label)).size,
    };

    return (
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'All submissions', value: counts.total },
            { label: 'Pending', value: counts.pending },
            { label: 'Reviewed', value: counts.reviewed },
            { label: 'Sources', value: counts.sources },
          ].map((item) => (
            <article key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#98a4b1]">{item.label}</p>
              <p className="mt-2 text-3xl font-black text-white">{item.value}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,420px)]">
          <SectionShell
            title="Submission inbox"
            description="All participation, event, singing, dancing and form rows are normalized into a single queue."
            actions={<span className="text-sm font-bold text-[#ffc400]">{filteredSubmissions.length} records</span>}
          >
            <div className="space-y-3">
              {filteredSubmissions.map((entry) => {
                const active = selectedSubmissionId === entry.id;
                return (
                  <button
                    key={`${entry.source_type}-${entry.id}`}
                    type="button"
                    onClick={() => setSelectedSubmissionId(entry.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      active ? 'border-[#ffc400] bg-black/40 shadow-[0_0_0_1px_rgba(255,196,0,0.12)]' : 'border-white/10 bg-black/20 hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffc400]">{entry.source_label}</p>
                        <h3 className="mt-2 truncate text-lg font-black text-white">{entry.title}</h3>
                      </div>
                      <span className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#ffc400]">
                        {entry.status}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-[#aab5c6] sm:grid-cols-2">
                      <p>{entry.applicant_name || 'Anonymous applicant'}</p>
                      <p>{entry.submission_kind || 'General submission'}</p>
                      <p className="sm:col-span-2">{entry.applicant_email || 'No email'} · {entry.applicant_phone || 'No phone'}</p>
                      <p className="sm:col-span-2">{entry.submitted_at ? new Date(entry.submitted_at).toLocaleString() : 'No timestamp'}</p>
                    </div>
                  </button>
                );
              })}
              {!filteredSubmissions.length ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-bold text-white">No submissions match the current search.</p>
                  <p className="mt-2 text-sm leading-6 text-[#aab5c6]">Try clearing the search box or switching source filters.</p>
                </div>
              ) : null}
            </div>
          </SectionShell>

          <SectionShell title="Submission detail" description="Review the full record, payload and audit trail in one clean panel.">
            {selectedSubmission ? (
              <div className="space-y-4 xl:sticky xl:top-6 self-start">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffc400]">{selectedSubmission.source_label}</p>
                      <h3 className="mt-2 text-3xl font-black text-white">{selectedSubmission.title}</h3>
                      <p className="mt-2 text-sm text-[#aab5c6]">{selectedSubmission.submission_kind || 'General submission'}</p>
                    </div>
                    <span className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#ffc400]">
                      {selectedSubmission.status}
                    </span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: 'Applicant', value: selectedSubmission.applicant_name || 'Not provided' },
                    { label: 'Email', value: selectedSubmission.applicant_email || 'Not provided' },
                    { label: 'Phone', value: selectedSubmission.applicant_phone || 'Not provided' },
                    { label: 'Points', value: String(selectedSubmission.points_reward || 0) },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">{item.label}</p>
                      <p className="mt-2 text-sm font-bold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">Description</p>
                  <p className="mt-2 text-sm leading-7 text-[#d4dbe7]">{selectedSubmission.description || 'No description provided.'}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">Review note</p>
                  <p className="mt-2 text-sm leading-7 text-[#d4dbe7]">{selectedSubmission.review_note || 'No review note yet.'}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">Submitted</p>
                    <p className="mt-2 text-sm font-bold text-white">{selectedSubmission.submitted_at ? new Date(selectedSubmission.submitted_at).toLocaleString() : 'Unknown'}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">Reviewed</p>
                    <p className="mt-2 text-sm font-bold text-white">{selectedSubmission.reviewed_at ? new Date(selectedSubmission.reviewed_at).toLocaleString() : 'Not reviewed yet'}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">Payload</p>
                  <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-4 text-xs leading-6 text-[#d4dbe7]">
                    {JSON.stringify(selectedSubmission.payload, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#aab5c6]">Select a submission to review it here.</p>
            )}
          </SectionShell>
        </div>
      </div>
    );
  };

  const renderKFoodPremium = () => {
    const productSummary = kfoodOverview?.productSummary;
    const paymentSummary = kfoodOverview?.paymentSummary || [];
    const weeklyReport = kfoodOverview?.weeklyReport || [];
    const monthlyReport = kfoodOverview?.monthlyReport || [];
    const orders = kfoodOverview?.orders || [];
    const fulfillments = kfoodOverview?.fulfillments || [];
    const pendingFulfillments = fulfillments.filter((entry) => ['pending', 'packed', 'dispatched', 'in_transit'].includes(entry.fulfillment_status)).length;

    return (
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: 'Products', value: productSummary?.totalProducts ?? kfoodProducts.length },
            { label: 'In stock', value: productSummary?.inStockProducts ?? kfoodProducts.filter((product) => product.inStock).length },
            { label: 'Orders', value: orders.length || filteredClaims.length },
            { label: 'Fulfillments', value: fulfillments.length },
            { label: 'Pending dispatch', value: pendingFulfillments },
          ].map((item) => (
            <article key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#98a4b1]">{item.label}</p>
              <p className="mt-2 text-3xl font-black text-white">{item.value}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(340px,420px)]">
          <SectionShell
            title="K-Food product listing"
            description="A product-first admin view with stock state, reward value and live operational markers."
            actions={<span className="text-sm font-bold text-[#ffc400]">{filteredKFoodProducts.length} products</span>}
          >
            <div className="grid gap-3 lg:grid-cols-2">
              {filteredKFoodProducts.map((product) => (
                <article key={product.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">{product.sku}</p>
                      <h3 className="mt-2 text-lg font-black text-white">{product.title.en}</h3>
                      <p className="mt-2 text-sm text-[#aab5c6]">{product.subtitle.en}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${product.inStock ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border border-red-500/30 bg-red-500/10 text-red-300'}`}>
                      {product.inStock ? 'In stock' : 'Out of stock'}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#d4dbe7]">{product.category.en}</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#d4dbe7]">{product.rewardPoints} pts</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#d4dbe7]">₹{product.price}</span>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-[#aab5c6] sm:grid-cols-2">
                    <p>Stock: {product.stockLabel.en}</p>
                    <p>Listing: {product.inStock ? 'Live' : 'Paused'}</p>
                  </div>
                </article>
              ))}
            </div>
          </SectionShell>

          <div className="space-y-5 xl:sticky xl:top-6 self-start">
            <SectionShell title="Fulfillment desk" description="Dispatch, tracking, shipping and delivery are first-class records now." actions={<span className="text-sm font-bold text-[#ffc400]">{fulfillments.length} records</span>}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead className="text-[#ffc400]">
                    <tr>
                      <th className="border-b border-white/10 py-3">Order</th>
                      <th className="border-b border-white/10 py-3">Payment</th>
                      <th className="border-b border-white/10 py-3">Fulfillment</th>
                      <th className="border-b border-white/10 py-3">Tracking</th>
                      <th className="border-b border-white/10 py-3">Carrier</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#d4dbe7]">
                    {fulfillments.map((entry) => (
                      <tr key={entry.id}>
                        <td className="border-b border-white/10 py-3">
                          <button type="button" onClick={() => setSelectedFulfillmentId(entry.id)} className="text-left font-black text-white">
                            {entry.receipt}
                          </button>
                          <p className="text-xs text-[#98a4b1]">{entry.email || 'No customer email'}</p>
                        </td>
                        <td className="border-b border-white/10 py-3">
                          <span className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#ffc400]">
                            {entry.payment_status}
                          </span>
                        </td>
                        <td className="border-b border-white/10 py-3">
                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#d4dbe7]">
                            {entry.fulfillment_status}
                          </span>
                        </td>
                        <td className="border-b border-white/10 py-3">{entry.tracking_number || 'Pending'}</td>
                        <td className="border-b border-white/10 py-3">{entry.carrier || 'Not assigned'}</td>
                      </tr>
                    ))}
                    {!fulfillments.length ? (
                      <tr>
                        <td className="py-4 text-sm text-[#aab5c6]" colSpan={5}>
                          No fulfillment rows yet. The table will populate as soon as dispatch records are created.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffc400]">Selected fulfillment</p>
                    <h3 className="mt-2 text-2xl font-black text-white">{selectedFulfillment?.receipt || 'No fulfillment selected'}</h3>
                    <p className="mt-2 text-sm text-[#aab5c6]">{selectedFulfillment?.email || 'Choose a row from the table above.'}</p>
                  </div>
                  {selectedFulfillment ? (
                    <span className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#ffc400]">
                      {selectedFulfillment.fulfillment_status}
                    </span>
                  ) : null}
                </div>

                {selectedFulfillment ? (
                  <div className="mt-4 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Payment Order ID">
                        <input className={inputClass} value={fulfillmentForm.payment_order_id} onChange={(event) => setFulfillmentForm((state) => ({ ...state, payment_order_id: event.target.value }))} />
                      </Field>
                      <Field label="Fulfillment Status">
                        <select className={selectClass} value={fulfillmentForm.fulfillment_status} onChange={(event) => setFulfillmentForm((state) => ({ ...state, fulfillment_status: event.target.value }))}>
                          <option value="pending">pending</option>
                          <option value="packed">packed</option>
                          <option value="dispatched">dispatched</option>
                          <option value="in_transit">in_transit</option>
                          <option value="delivered">delivered</option>
                          <option value="returned">returned</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </Field>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Tracking Number">
                        <input className={inputClass} value={fulfillmentForm.tracking_number} onChange={(event) => setFulfillmentForm((state) => ({ ...state, tracking_number: event.target.value }))} />
                      </Field>
                      <Field label="Carrier">
                        <input className={inputClass} value={fulfillmentForm.carrier} onChange={(event) => setFulfillmentForm((state) => ({ ...state, carrier: event.target.value }))} />
                      </Field>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Dispatch Method">
                        <input className={inputClass} value={fulfillmentForm.dispatch_method} onChange={(event) => setFulfillmentForm((state) => ({ ...state, dispatch_method: event.target.value }))} />
                      </Field>
                      <Field label="Shipping Name">
                        <input className={inputClass} value={fulfillmentForm.shipping_name} onChange={(event) => setFulfillmentForm((state) => ({ ...state, shipping_name: event.target.value }))} />
                      </Field>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Shipping Phone">
                        <input className={inputClass} value={fulfillmentForm.shipping_phone} onChange={(event) => setFulfillmentForm((state) => ({ ...state, shipping_phone: event.target.value }))} />
                      </Field>
                      <Field label="Shipped At">
                        <input className={inputClass} type="datetime-local" value={fulfillmentForm.shipped_at} onChange={(event) => setFulfillmentForm((state) => ({ ...state, shipped_at: event.target.value }))} />
                      </Field>
                    </div>
                    <Field label="Shipping Address">
                      <textarea className={`${inputClass} min-h-24`} value={fulfillmentForm.shipping_address} onChange={(event) => setFulfillmentForm((state) => ({ ...state, shipping_address: event.target.value }))} />
                    </Field>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Delivered At">
                        <input className={inputClass} type="datetime-local" value={fulfillmentForm.delivered_at} onChange={(event) => setFulfillmentForm((state) => ({ ...state, delivered_at: event.target.value }))} />
                      </Field>
                      <Field label="Courier Notes">
                        <textarea className={`${inputClass} min-h-24`} value={fulfillmentForm.courier_notes} onChange={(event) => setFulfillmentForm((state) => ({ ...state, courier_notes: event.target.value }))} />
                      </Field>
                    </div>
                    <button type="button" onClick={saveFulfillment} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
                      <Save className="h-4 w-4" /> Save fulfillment
                    </button>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-[#aab5c6]">Select any order row to open the fulfillment editor.</p>
                )}
              </div>
            </SectionShell>

            <SectionShell title="Operations board" description="Order status, payment state, dispatch and tracking in one executive rail.">
              <div className="space-y-3">
                {orders.slice(0, 6).map((order) => (
                  <article key={order.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-white">{order.receipt}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#98a4b1]">{order.context_ref || 'Shop order'}</p>
                      </div>
                      <span className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#ffc400]">
                        {order.payment_status}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-[#aab5c6]">
                      <p>Dispatch: {order.dispatch_status}</p>
                      <p>Tracking: {order.tracking_number || 'Pending'}</p>
                      <p>Commission: ₹{Number(order.commission_amount || 0).toFixed(2)} @ {order.commission_rate}%</p>
                    </div>
                  </article>
                ))}
              </div>
            </SectionShell>

            <SectionShell title="Payment summary" description="A quick read on K-Food order status and payment health.">
              <div className="space-y-3">
                {paymentSummary.length ? (
                  paymentSummary.map((row) => (
                    <article key={row.payment_status} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-black text-white">{row.payment_status}</p>
                        <span className="text-xs font-black text-[#ffc400]">{row.total_orders} orders</span>
                      </div>
                      <p className="mt-2 text-sm text-[#aab5c6]">Revenue ₹{Number(row.total_amount || 0).toFixed(2)}</p>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-[#aab5c6]">No payment-order data yet.</p>
                )}
              </div>
            </SectionShell>

            <SectionShell title="Weekly report" description="Recent K-Food activity, revenue and commission snapshots.">
              <div className="space-y-3">
                {weeklyReport.slice(0, 5).map((row) => (
                  <article key={row.period} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-black text-white">{row.period}</p>
                      <span className="text-xs font-black text-[#ffc400]">{row.total_orders} orders</span>
                    </div>
                    <p className="mt-2 text-sm text-[#aab5c6]">Revenue ₹{Number(row.total_amount || 0).toFixed(2)}</p>
                    <p className="mt-1 text-sm text-[#aab5c6]">Commission ₹{Number(row.commission_amount || 0).toFixed(2)}</p>
                  </article>
                ))}
              </div>
            </SectionShell>

            <SectionShell title="Monthly report" description="Longer cycle performance for leadership review.">
              <div className="space-y-3">
                {monthlyReport.slice(0, 4).map((row) => (
                  <article key={row.period} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-black text-white">{row.period}</p>
                      <span className="text-xs font-black text-[#ffc400]">{row.total_orders} orders</span>
                    </div>
                    <p className="mt-2 text-sm text-[#aab5c6]">Revenue ₹{Number(row.total_amount || 0).toFixed(2)}</p>
                    <p className="mt-1 text-sm text-[#aab5c6]">Commission ₹{Number(row.commission_amount || 0).toFixed(2)}</p>
                  </article>
                ))}
              </div>
            </SectionShell>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
          <SectionShell title="K-Food claims" description="Audit purchase claims, coupon references and reward eligibility." actions={<span className="text-sm font-bold text-[#ffc400]">{filteredClaims.length} records</span>}>
            <div className="space-y-3">
              {filteredClaims.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => {
                    setSelectedClaimId(entry.id);
                    setClaimReview({ status: 'approved', points_reward: entry.points_reward || 0, review_note: entry.review_note || '' });
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-left"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-white">{entry.order_id}</p>
                    <span className="text-xs font-black text-[#ffc400]">{entry.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#aab5c6]">
                    {entry.full_name} · {entry.email} · {entry.order_total}
                  </p>
                </button>
              ))}
            </div>
          </SectionShell>

          <SectionShell title="Review claim" description="Approve or reject K-Food purchase claims from the admin panel.">
            {selectedClaim ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#ffc400]">{selectedClaim.order_id}</p>
                  <h3 className="mt-2 text-xl font-black text-white">{selectedClaim.full_name}</h3>
                  <p className="mt-2 text-sm text-[#aab5c6]">{selectedClaim.order_total}</p>
                </div>
                <Field label="Points Reward">
                  <input className={inputClass} type="number" value={claimReview.points_reward} onChange={(event) => setClaimReview((state) => ({ ...state, points_reward: Number(event.target.value) }))} />
                </Field>
                <Field label="Review Note">
                  <textarea className={`${inputClass} min-h-24`} value={claimReview.review_note} onChange={(event) => setClaimReview((state) => ({ ...state, review_note: event.target.value }))} />
                </Field>
                <div className="flex gap-3">
                  <button type="button" onClick={() => reviewClaim('approved')} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </button>
                  <button type="button" onClick={() => reviewClaim('rejected')} className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-3 text-sm font-black text-red-300">
                    <Trash2 className="h-4 w-4" /> Reject
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#aab5c6]">Select a claim to review it here.</p>
            )}
          </SectionShell>
        </div>
      </div>
    );
  };

  const renderEvents = () => (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      <SectionShell title="Event inventory" description="Create, edit and archive platform events from one place." actions={<span className="text-sm font-bold text-[#ffc400]">{filteredEvents.length} records</span>}>
        <div className="space-y-3">
          {filteredEvents.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() =>
                setEventForm({
                  id: String(entry.id),
                  title: entry.title,
                  slug: entry.slug,
                  description: entry.description || '',
                  category: entry.category,
                  starts_at: entry.starts_at.slice(0, 16),
                  ends_at: entry.ends_at.slice(0, 16),
                  timezone: entry.timezone,
                  location_name: entry.location_name || '',
                  location_address: entry.location_address || '',
                  online_meeting_url: entry.online_meeting_url || '',
                  capacity: entry.capacity ? String(entry.capacity) : '',
                  points_reward: entry.points_reward,
                  status: entry.status,
                })
              }
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-black">{entry.title}</p>
                <span className="text-xs font-black text-[#ffc400]">{entry.status}</span>
              </div>
              <p className="mt-2 text-sm text-[#aab5c6]">{entry.slug} · {entry.starts_at}</p>
            </button>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        title={eventForm.id ? 'Edit event' : 'Create event'}
        description="Event creation includes schedule, points, location, and sync settings."
        actions={eventForm.id ? (
          <button type="button" onClick={() => setEventForm(emptyEventForm)} className="text-sm font-bold text-[#ffc400]">
            Reset
          </button>
        ) : null}
      >
        <div className="space-y-3">
          <Field label="Title">
            <input className={inputClass} value={eventForm.title} onChange={(event) => setEventForm((state) => ({ ...state, title: event.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Slug">
              <input className={inputClass} value={eventForm.slug} onChange={(event) => setEventForm((state) => ({ ...state, slug: event.target.value }))} />
            </Field>
            <Field label="Category">
              <input className={inputClass} value={eventForm.category} onChange={(event) => setEventForm((state) => ({ ...state, category: event.target.value }))} />
            </Field>
          </div>
          <Field label="Description">
            <textarea className={`${inputClass} min-h-24`} value={eventForm.description} onChange={(event) => setEventForm((state) => ({ ...state, description: event.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Starts At">
              <input className={inputClass} type="datetime-local" value={eventForm.starts_at} onChange={(event) => setEventForm((state) => ({ ...state, starts_at: event.target.value }))} />
            </Field>
            <Field label="Ends At">
              <input className={inputClass} type="datetime-local" value={eventForm.ends_at} onChange={(event) => setEventForm((state) => ({ ...state, ends_at: event.target.value }))} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Timezone">
              <input className={inputClass} value={eventForm.timezone} onChange={(event) => setEventForm((state) => ({ ...state, timezone: event.target.value }))} />
            </Field>
            <Field label="Capacity">
              <input className={inputClass} type="number" value={eventForm.capacity} onChange={(event) => setEventForm((state) => ({ ...state, capacity: event.target.value }))} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Location Name">
              <input className={inputClass} value={eventForm.location_name} onChange={(event) => setEventForm((state) => ({ ...state, location_name: event.target.value }))} />
            </Field>
            <Field label="Points Reward">
              <input className={inputClass} type="number" value={eventForm.points_reward} onChange={(event) => setEventForm((state) => ({ ...state, points_reward: Number(event.target.value) }))} />
            </Field>
          </div>
          <Field label="Location Address">
            <textarea className={`${inputClass} min-h-20`} value={eventForm.location_address} onChange={(event) => setEventForm((state) => ({ ...state, location_address: event.target.value }))} />
          </Field>
          <Field label="Meeting URL">
            <input className={inputClass} value={eventForm.online_meeting_url} onChange={(event) => setEventForm((state) => ({ ...state, online_meeting_url: event.target.value }))} />
          </Field>
          <Field label="Status">
            <select className={selectClass} value={eventForm.status} onChange={(event) => setEventForm((state) => ({ ...state, status: event.target.value }))}>
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="cancelled">cancelled</option>
              <option value="archived">archived</option>
            </select>
          </Field>
          <div className="flex gap-3">
            <button type="button" onClick={saveEvent} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
              <Save className="h-4 w-4" /> Save event
            </button>
            {eventForm.id ? (
              <button type="button" onClick={() => archiveEvent(Number(eventForm.id))} className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-3 text-sm font-black text-red-300">
                <Trash2 className="h-4 w-4" /> Archive
              </button>
            ) : null}
          </div>
        </div>
      </SectionShell>
    </div>
  );

  const renderRewards = () => (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      <SectionShell title="Reward catalog" description="Add, update or disable rewards from the same control center." actions={<span className="text-sm font-bold text-[#ffc400]">{filteredRewards.length} records</span>}>
        <div className="space-y-3">
          {filteredRewards.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() =>
                setRewardForm({
                  id: String(entry.id),
                  name: entry.name,
                  description: entry.description || '',
                  tier: entry.tier,
                  cost_points: entry.cost_points,
                  active: entry.active,
                  image_url: entry.image_url || '',
                  metadata: '[]',
                })
              }
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-black">{entry.name}</p>
                <span className="text-xs font-black text-[#ffc400]">{entry.active ? 'active' : 'disabled'}</span>
              </div>
              <p className="mt-2 text-sm text-[#aab5c6]">{entry.tier} · {entry.cost_points} points</p>
            </button>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        title={rewardForm.id ? 'Edit reward' : 'Create reward'}
        description="Configure tiers, costs and metadata for the internal reward system."
        actions={rewardForm.id ? (
          <button type="button" onClick={() => setRewardForm(emptyRewardForm)} className="text-sm font-bold text-[#ffc400]">
            Reset
          </button>
        ) : null}
      >
        <div className="space-y-3">
          <Field label="Name">
            <input className={inputClass} value={rewardForm.name} onChange={(event) => setRewardForm((state) => ({ ...state, name: event.target.value }))} />
          </Field>
          <Field label="Description">
            <textarea className={`${inputClass} min-h-24`} value={rewardForm.description} onChange={(event) => setRewardForm((state) => ({ ...state, description: event.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tier">
              <select className={selectClass} value={rewardForm.tier} onChange={(event) => setRewardForm((state) => ({ ...state, tier: event.target.value }))}>
                <option value="bronze">bronze</option>
                <option value="silver">silver</option>
                <option value="gold">gold</option>
                <option value="diamond">diamond</option>
              </select>
            </Field>
            <Field label="Cost Points">
              <input className={inputClass} type="number" value={rewardForm.cost_points} onChange={(event) => setRewardForm((state) => ({ ...state, cost_points: Number(event.target.value) }))} />
            </Field>
          </div>
          <Field label="Image URL">
            <input className={inputClass} value={rewardForm.image_url} onChange={(event) => setRewardForm((state) => ({ ...state, image_url: event.target.value }))} />
          </Field>
          <Field label="Metadata JSON">
            <textarea className={`${inputClass} min-h-24`} value={rewardForm.metadata} onChange={(event) => setRewardForm((state) => ({ ...state, metadata: event.target.value }))} />
          </Field>
          <label className="flex items-center gap-2 text-sm text-white">
            <input type="checkbox" checked={rewardForm.active} onChange={(event) => setRewardForm((state) => ({ ...state, active: event.target.checked }))} />
            Active
          </label>
          <div className="flex gap-3">
            <button type="button" onClick={saveReward} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
              <Save className="h-4 w-4" /> Save reward
            </button>
            {rewardForm.id ? (
              <button type="button" onClick={() => deleteReward(Number(rewardForm.id))} className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-3 text-sm font-black text-red-300">
                <Trash2 className="h-4 w-4" /> Disable
              </button>
            ) : null}
          </div>
        </div>
      </SectionShell>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      <SectionShell title="Recent announcements" description="Broadcast urgent CMS notes, release updates or internal notices." actions={<span className="text-sm font-bold text-[#ffc400]">{filteredAnnouncements.length} records</span>}>
        <div className="space-y-3">
          {filteredAnnouncements.map((entry) => (
            <article key={entry.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-black">{entry.title}</h3>
                <span className="text-xs font-black text-[#ffc400]">{entry.status}</span>
              </div>
              <p className="mt-2 text-sm text-[#aab5c6]">{entry.body}</p>
              <p className="mt-3 text-xs text-[#98a4b1]">{entry.creator_name || entry.creator_email || 'System'} · {new Date(entry.created_at).toLocaleString()}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell title="Publish announcement" description="Create a sitewide message visible to your admin team.">
        <div className="space-y-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-[#ffc400]">Winner helper</p>
            <p className="mt-2 text-sm text-[#aab5c6]">
              Load a prefilled winner announcement for the current top user or leaderboard leader.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" onClick={prepareWinnerAnnouncement} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-white">
                Fill winner template
              </button>
              {topWinner ? <span className="rounded-xl bg-white/5 px-4 py-2.5 text-sm text-[#d4dbe7]">{topWinner.full_name} · {topWinner.points} pts</span> : null}
            </div>
          </div>
          <Field label="Title">
            <input className={inputClass} value={announcementForm.title} onChange={(event) => setAnnouncementForm((state) => ({ ...state, title: event.target.value }))} />
          </Field>
          <Field label="Body">
            <textarea className={`${inputClass} min-h-32`} value={announcementForm.body} onChange={(event) => setAnnouncementForm((state) => ({ ...state, body: event.target.value }))} />
          </Field>
          <Field label="Created By">
            <input className={inputClass} value={announcementForm.created_by} onChange={(event) => setAnnouncementForm((state) => ({ ...state, created_by: event.target.value }))} placeholder={String(user.id)} />
          </Field>
          <button type="button" onClick={publishAnnouncement} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
            <Save className="h-4 w-4" /> Publish
          </button>
        </div>
      </SectionShell>
    </div>
  );

  const renderCalendar = () => (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      <SectionShell title="Calendar connections" description="See the configured Google Calendar integration and keep sync active.">
        <div className="space-y-3">
          {calendarConnections.map((entry) => (
            <article key={entry.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-black">{entry.calendar_name || entry.calendar_id}</h3>
                <span className="text-xs font-black text-[#ffc400]">{entry.status}</span>
              </div>
              <p className="mt-2 text-sm text-[#aab5c6]">{entry.provider} · {entry.sync_mode} · {entry.calendar_id}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell title="Google Calendar sync" description="Attach a calendar and trigger sync directly from the admin panel.">
        <div className="space-y-3">
          <Field label="Calendar ID">
            <input className={inputClass} value={calendarForm.calendar_id} onChange={(event) => setCalendarForm((state) => ({ ...state, calendar_id: event.target.value }))} />
          </Field>
          <Field label="Calendar Name">
            <input className={inputClass} value={calendarForm.calendar_name} onChange={(event) => setCalendarForm((state) => ({ ...state, calendar_name: event.target.value }))} />
          </Field>
          <Field label="Sync Mode">
            <select className={selectClass} value={calendarForm.sync_mode} onChange={(event) => setCalendarForm((state) => ({ ...state, sync_mode: event.target.value }))}>
              <option value="admin_oauth">admin_oauth</option>
              <option value="service_account">service_account</option>
            </select>
          </Field>
          <div className="flex gap-3">
            <button type="button" onClick={saveCalendar} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
              <Save className="h-4 w-4" /> Save connection
            </button>
            <button type="button" onClick={syncCalendar} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-black text-white">
              <Activity className="h-4 w-4" /> Sync now
            </button>
          </div>
        </div>
      </SectionShell>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Active users', value: analytics.activeUsers ?? 0 },
          { label: 'Sessions 24h', value: analytics.sessionsLast24h ?? 0 },
          { label: 'Active lessons', value: analytics.activeLessons ?? 0 },
          { label: 'Active rewards', value: analytics.activeRewards ?? 0 },
        ].map((item) => (
          <article key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-[#aab5c6]">{item.label}</p>
            <p className="mt-2 text-3xl font-black">{item.value}</p>
          </article>
        ))}
      </div>

      <SectionShell title="Raw dashboard snapshot" description="This panel can be extended with charts later, but the data source is already live.">
        <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-6 text-[#d4dbe7]">
          {JSON.stringify({ dashboardMetrics, analytics }, null, 2)}
        </pre>
      </SectionShell>
    </div>
  );

  const sectionBody = () => {
    switch (activeSection) {
      case 'adminProfile':
        return renderAdminProfile();
      case 'adminAccounts':
        return renderAdminAccounts();
      case 'submissions':
        return renderSubmissions();
      case 'website':
        return renderWebsite();
      case 'learning':
        return renderLearning();
      case 'users':
        return renderUsers();
      case 'chapters':
        return renderChapters();
      case 'points':
        return renderPoints();
      case 'uploads':
        return renderUploads();
      case 'indiaPreSelection':
        return renderIndiaPreSelection();
      case 'kfood':
        return renderKFoodPremium();
      case 'events':
        return renderEvents();
      case 'rewards':
        return renderRewards();
      case 'announcements':
        return renderAnnouncements();
      case 'calendar':
        return renderCalendar();
      case 'analytics':
        return renderAnalytics();
      case 'overview':
      default:
        return renderOverview();
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070708] text-white">
      <div className="grid min-h-screen overflow-x-hidden lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-[#0b0b0d] lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 px-5 py-6">
              <p className="text-xs font-black uppercase tracking-[0.35em] text-[#ffc400]">Admin CMS</p>
              <h1 className="mt-3 text-3xl font-black leading-tight">K-CUBE control center</h1>
              <p className="mt-3 text-sm leading-6 text-[#9aa6b4]">
                WordPress-style operational control for content, users, learning, rewards, events and commerce.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
              <div className="space-y-5">
                {adminSidebarGroups.map((group) => (
                  <div key={group.title} className="space-y-2">
                    <p className="px-3 text-[10px] font-black uppercase tracking-[0.28em] text-[#6f7d8d]">{group.title}</p>
                    <div className="space-y-2">
                      {group.ids.map((id) => {
                        const item = adminNav.find((entry) => entry.id === id);
                        if (!item) return null;
                        const Icon = item.icon;
                        const active = activeSection === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveSection(item.id as AdminSection)}
                            className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                              active ? 'border-[#ffc400] bg-[#17171a]' : 'border-white/10 bg-black/20 hover:border-white/20'
                            }`}
                          >
                            <Icon className={`mt-0.5 h-5 w-5 ${active ? 'text-[#ffc400]' : 'text-[#9aa6b4]'}`} />
                            <div className="min-w-0">
                              <p className="font-black">{item.label}</p>
                              <p className="mt-1 text-xs leading-5 text-[#9aa6b4]">{item.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 p-5">
              <Link href="/admin/login" className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-black text-white transition hover:border-[#ffc400] hover:text-[#ffc400]">
                Switch admin
              </Link>
            </div>
          </div>
        </aside>

        <div className="min-w-0 px-5 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto min-w-0 max-w-[1600px] space-y-6">
            <section className="min-w-0 rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,196,0,0.18),_transparent_34%),linear-gradient(180deg,_rgba(17,17,19,0.96),_rgba(10,10,12,0.98))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.4)]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.26em] text-[#ffc400]">Admin Dashboard</p>
                  <h2 className="mt-3 text-4xl font-black">Full website control, all in one place.</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-[#aab5c6]">
                    Edit pages, learning content, users, points, rewards, events, announcements and integrations from a single admin workspace.
                  </p>
                  {notice ? <p className="mt-4 text-sm font-bold text-[#ffcf86]">{notice}</p> : null}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="min-w-[260px] flex-1">
                    <input
                      value={adminQuery}
                      onChange={(event) => setAdminQuery(event.target.value)}
                      placeholder="Search users, pages, rewards, events..."
                      className={inputClass}
                    />
                  </div>
                  <button type="button" onClick={() => setActiveSection('overview')} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white">
                    Overview
                  </button>
                  <Link href="/" className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white">
                    Open site
                  </Link>
                </div>
              </div>
            </section>

            {sectionBody()}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminControlCenter;
