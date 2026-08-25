"use client";
/* eslint-disable react-hooks/set-state-in-effect, @next/next/no-img-element */

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
  ExternalLink,
  FileText,
  LogOut,
  Mail,
  Send,
  PlayCircle,
  Trash2,
  X,
  Users,
} from 'lucide-react';
import api from '@/lib/api';
import { detailItems } from '@/lib/kcubeContent';
import { useAppStore } from '@/store/useAppStore';

type AdminSection =
  | 'overview'
  | 'sendEmail'
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

type KFoodProductForm = {
  id: string;
  slug: string;
  sku: string;
  title_en: string;
  title_ko: string;
  title_hi: string;
  subtitle_en: string;
  subtitle_ko: string;
  subtitle_hi: string;
  description_en: string;
  description_ko: string;
  description_hi: string;
  categoryKey: string;
  image: string;
  price: string;
  compareAtPrice: string;
  rewardPoints: string;
  inStock: boolean;
  stockLabel_en: string;
  stockLabel_ko: string;
  stockLabel_hi: string;
  badges_json: string;
  includes_json: string;
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

type SentEmailRow = {
  id: number;
  delivery_mode: 'bulk' | 'single';
  recipient_count: number;
  recipients_json: string | string[];
  recipient_names_json: string | string[] | null;
  cc_addresses: string | null;
  subject: string;
  body: string;
  status: 'sent' | 'failed';
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
};

const adminNav = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, description: 'Live metrics and shortcuts.' },
  { id: 'sendEmail', label: 'Send Email', icon: Mail, description: 'Bulk and individual email delivery.' },
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
  { title: 'Core', ids: ['overview', 'sendEmail', 'submissions', 'indiaPreSelection', 'website', 'learning'] },
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

const emptyEmailForm = {
  to: '',
  cc: '',
  subject: '',
  body: '',
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

const emptyKFoodProductForm: KFoodProductForm = {
  id: '',
  slug: '',
  sku: '',
  title_en: '',
  title_ko: '',
  title_hi: '',
  subtitle_en: '',
  subtitle_ko: '',
  subtitle_hi: '',
  description_en: '',
  description_ko: '',
  description_hi: '',
  categoryKey: 'sauces',
  image: '',
  price: '0',
  compareAtPrice: '',
  rewardPoints: '0',
  inStock: true,
  stockLabel_en: 'In stock',
  stockLabel_ko: 'In stock',
  stockLabel_hi: 'In stock',
  badges_json: '[]',
  includes_json: '[]',
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

const readLocalizedText = (value: unknown, fallback: string): LocalizedText => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const record = value as Partial<LocalizedText>;
    return {
      en: String(record.en || fallback),
      ko: String(record.ko || record.en || fallback),
      hi: String(record.hi || record.en || fallback),
    };
  }

  const text = String(value || fallback);
  return { en: text, ko: text, hi: text };
};

const readLocalizedArray = (value: unknown, fallbackPrefix: string) => {
  const entries = Array.isArray(value) ? value : [];
  return entries.map((item, index) => readLocalizedText(item, `${fallbackPrefix} ${index + 1}`));
};

const buildLocalizedText = (en: string, ko: string, hi: string, fallback = '') => ({
  en: en.trim() || fallback,
  ko: ko.trim() || en.trim() || fallback,
  hi: hi.trim() || en.trim() || fallback,
});

const parseKFoodProductForm = (form: KFoodProductForm) => ({
  id: form.id.trim() || form.slug.trim() || form.title_en.trim() || 'new-product',
  slug: form.slug.trim(),
  sku: form.sku.trim(),
  title: buildLocalizedText(form.title_en, form.title_ko, form.title_hi, form.slug || 'New product'),
  subtitle: buildLocalizedText(form.subtitle_en, form.subtitle_ko, form.subtitle_hi, form.title_en || 'New product'),
  description: buildLocalizedText(form.description_en, form.description_ko, form.description_hi, form.title_en || 'New product'),
  categoryKey: form.categoryKey.trim() || 'sauces',
  image: form.image.trim(),
  price: Number(form.price || 0),
  compareAtPrice: form.compareAtPrice.trim() ? Number(form.compareAtPrice) : undefined,
  rewardPoints: Number(form.rewardPoints || 0),
  inStock: Boolean(form.inStock),
  stockLabel: buildLocalizedText(form.stockLabel_en, form.stockLabel_ko, form.stockLabel_hi, form.inStock ? 'In stock' : 'Out of stock'),
  badges: readLocalizedArray(safeJson(form.badges_json, []), 'Badge'),
  includes: readLocalizedArray(safeJson(form.includes_json, []), 'Item'),
});

const formFromKFoodProduct = (product: KFoodProductRow): KFoodProductForm => ({
  id: product.id,
  slug: product.slug,
  sku: product.sku,
  title_en: product.title.en,
  title_ko: product.title.ko,
  title_hi: product.title.hi,
  subtitle_en: product.subtitle.en,
  subtitle_ko: product.subtitle.ko,
  subtitle_hi: product.subtitle.hi,
  description_en: product.description.en,
  description_ko: product.description.ko,
  description_hi: product.description.hi,
  categoryKey: product.categoryKey,
  image: product.image,
  price: String(product.price ?? 0),
  compareAtPrice: product.compareAtPrice == null ? '' : String(product.compareAtPrice),
  rewardPoints: String(product.rewardPoints ?? 0),
  inStock: product.inStock,
  stockLabel_en: product.stockLabel.en,
  stockLabel_ko: product.stockLabel.ko,
  stockLabel_hi: product.stockLabel.hi,
  badges_json: JSON.stringify(product.badges || [], null, 2),
  includes_json: JSON.stringify(product.includes || [], null, 2),
});

const normalize = (value: unknown) => String(value ?? '').toLowerCase();

const parseEmailList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map((entry) => String(entry)).filter(Boolean);
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map((entry) => String(entry)).filter(Boolean);
  } catch {
    // Older history rows can contain a plain comma-separated value.
  }
  return value.split(/[;,\n]/).map((entry) => entry.trim()).filter(Boolean);
};

const matchesQuery = (query: string, values: Array<unknown>) => {
  if (!query) return true;
  return values.some((value) => normalize(value).includes(query));
};

const readPayload = <T,>(result: PromiseSettledResult<unknown>, fallback: T): T => {
  if (result.status !== 'fulfilled') return fallback;
  const value = result.value as {
    data?: {
      data?: unknown;
    } | unknown;
  };
  const nested = value.data as { data?: unknown } | undefined;
  return ((nested?.data ?? value.data ?? fallback) as T);
};

const humanizeKey = (key: string) =>
  key
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const isProbablyUrl = (value: string) => /^https?:\/\/\S+$/i.test(value.trim());

const extractYouTubeId = (value: string) => {
  const match =
    value.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i) ||
    value.match(/[?&]v=([A-Za-z0-9_-]{6,})/i);
  return match?.[1] || null;
};

const tryParseStructuredValue = (value: unknown): unknown => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return value;

  const attempts = [trimmed];
  try {
    const maybeUnquoted = JSON.parse(trimmed);
    if (typeof maybeUnquoted === 'string') {
      attempts.push(maybeUnquoted.trim());
    } else {
      return maybeUnquoted;
    }
  } catch {
    // fall through to raw attempts
  }

  for (const attempt of attempts) {
    try {
      return JSON.parse(attempt);
    } catch {
      // keep trying
    }
  }

  return value;
};

const normalizeSubmissionPayload = (payload: unknown): Record<string, unknown> => {
  const parsed = tryParseStructuredValue(payload);
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return parsed as Record<string, unknown>;
  }
  return { payload: parsed };
};

const stringifySubmissionValue = (value: unknown) => {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const isMediaKey = (key: string) => /video|media|url|link|attachment|attachment_url/i.test(key);

const submissionFieldsFromPayload = (payload: unknown) => {
  const structuredPayload = normalizeSubmissionPayload(payload);
  const entries = Object.entries(structuredPayload).map(([key, rawValue]) => {
    const value = tryParseStructuredValue(rawValue);
    if (Array.isArray(value)) {
      return {
        key,
        label: humanizeKey(key),
        kind: 'list' as const,
        value: value.map((item) => stringifySubmissionValue(item)).filter(Boolean),
        rawValue: value,
      };
    }
    if (value && typeof value === 'object') {
      return {
        key,
        label: humanizeKey(key),
        kind: 'object' as const,
        value: value as Record<string, unknown>,
        rawValue: value,
      };
    }
    if (typeof value === 'string' && isProbablyUrl(value)) {
      return {
        key,
        label: humanizeKey(key),
        kind: extractYouTubeId(value) ? ('video' as const) : ('url' as const),
        value,
        rawValue: value,
      };
    }
    return {
      key,
      label: humanizeKey(key),
      kind: 'text' as const,
      value: stringifySubmissionValue(value) || '-',
      rawValue: value,
    };
  });

  const mediaEntries = entries.filter((entry) => entry.kind === 'video' || entry.kind === 'url' || isMediaKey(entry.key));
  const contentEntries = entries.filter((entry) => !mediaEntries.includes(entry));

  return { entries, mediaEntries, contentEntries };
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
  <section className="admin-section-shell min-w-0 rounded-xl border border-white/10 bg-[#101014] p-4">
    <div className="flex flex-col gap-2 border-b border-white/10 pb-3 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h2 className="text-xl font-black text-white">{title}</h2>
        {description ? <p className="mt-1 max-w-3xl text-sm leading-6 text-[#aab5c6]">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
    <div className="min-w-0 pt-4">{children}</div>
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
  'w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition placeholder:text-[#627085] focus:border-[#ffc400]';
const selectClass =
  'w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-[#ffc400]';

const PaginatedList = <T,>({
  items,
  pageSize = 20,
  children,
}: {
  items: T[];
  pageSize?: number;
  children: (visibleItems: T[], offset: number) => ReactNode;
}) => {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, pageCount);

  useEffect(() => {
    setPage(1);
  }, [items.length]);

  return (
    <>
      {children(items.slice((safePage - 1) * pageSize, safePage * pageSize), (safePage - 1) * pageSize)}
      {items.length > pageSize ? (
        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <p className="text-xs text-[#7d8a99]">Page {safePage} of {pageCount}</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={safePage === 1} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
            <button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={safePage === pageCount} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Next</button>
          </div>
        </div>
      ) : null}
    </>
  );
};

const AdminControlCenter = () => {
  const user = useAppStore((state) => state.user);
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [notice, setNotice] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [userSuccess, setUserSuccess] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [userDeleteConfirm, setUserDeleteConfirm] = useState(false);
  const [adminQuery, setAdminQuery] = useState('');
  const sidebarOpen = true;

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
  const [sentEmails, setSentEmails] = useState<SentEmailRow[]>([]);
  const [emailRecipientCount, setEmailRecipientCount] = useState(0);
  const [adminProfile, setAdminProfile] = useState<AdminProfileRow | null>(null);
  const [adminAccounts, setAdminAccounts] = useState<AdminAccountRow[]>([]);
  const [kfoodProducts, setKfoodProducts] = useState<KFoodProductRow[]>([]);
  const [kfoodOverview, setKfoodOverview] = useState<KFoodOverviewRow | null>(null);
  const [selectedKFoodProductSlug, setSelectedKFoodProductSlug] = useState('');
  const [kfoodProductForm, setKFoodProductForm] = useState<KFoodProductForm>(emptyKFoodProductForm);
  const [kfoodImportUrls, setKFoodImportUrls] = useState('');
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);
  const [submissionDetailOpen, setSubmissionDetailOpen] = useState(false);
  const [submissionPage, setSubmissionPage] = useState(1);
  const submissionsPerPage = 20;
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
  const [bulkEmailForm, setBulkEmailForm] = useState(emptyEmailForm);
  const [singleEmailForm, setSingleEmailForm] = useState(emptyEmailForm);
  const [sentEmailQuery, setSentEmailQuery] = useState('');
  const [sentEmailStatusFilter, setSentEmailStatusFilter] = useState('all');
  const [selectedSentEmail, setSelectedSentEmail] = useState<SentEmailRow | null>(null);
  const [adminAccountForm, setAdminAccountForm] = useState(emptyAdminAccountForm);
  const [adminProfileForm, setAdminProfileForm] = useState(emptyProfileForm);
  const [adminPasswordForm, setAdminPasswordForm] = useState(emptyPasswordForm);
  const [rewardForm, setRewardForm] = useState(emptyRewardForm);
  const [eventForm, setEventForm] = useState(emptyEventForm);
  const [calendarForm, setCalendarForm] = useState(emptyCalendarForm);

  const [selectedUploadId, setSelectedUploadId] = useState<number | null>(null);
  const [uploadReview, setUploadReview] = useState({ status: 'approved', points_reward: 0, review_note: '' });
  const [selectedIndiaApplicationId, setSelectedIndiaApplicationId] = useState<number | null>(null);
  const [indiaReviewModalOpen, setIndiaReviewModalOpen] = useState(false);
  const [indiaApplicationReview, setIndiaApplicationReview] = useState({ status: 'reviewing', review_note: '' });
  const [selectedClaimId, setSelectedClaimId] = useState<number | null>(null);
  const [claimReview, setClaimReview] = useState({ status: 'approved', points_reward: 0, review_note: '' });
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);

  const query = adminQuery.trim().toLowerCase();
  const adminInitials = (user?.fullName || 'K-CUBE Admin')
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

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
  const selectedKFoodProduct = useMemo(
    () => kfoodProducts.find((entry) => entry.slug === selectedKFoodProductSlug) || null,
    [kfoodProducts, selectedKFoodProductSlug],
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
  const filteredSentEmails = useMemo(
    () => sentEmails.filter((entry) => {
      const matchesStatus = sentEmailStatusFilter === 'all' || entry.status === sentEmailStatusFilter;
      const names = parseEmailList(entry.recipient_names_json).join(' ');
      const recipients = parseEmailList(entry.recipients_json).join(' ');
      const haystack = [entry.subject, entry.body, entry.delivery_mode, entry.cc_addresses, names, recipients];
      return matchesStatus && matchesQuery(sentEmailQuery.trim().toLowerCase(), haystack);
    }),
    [sentEmails, sentEmailQuery, sentEmailStatusFilter],
  );
  const latestIndiaApplications = useMemo(() => indiaApplications.slice(0, 3), [indiaApplications]);
  const filteredRecentActions = useMemo(
    () => recentActions.filter((entry) => matchesQuery(query, [entry.action, entry.entity_type, entry.admin_name, entry.admin_email, entry.after_status, entry.before_status, entry.review_note])),
    [query, recentActions],
  );
  const filteredSubmissions = useMemo(
    () =>
      submissions.filter((entry) =>
        entry.source_type !== 'kfood_purchase' &&
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
  const prioritizedSubmissions = useMemo(
    () =>
      [...filteredSubmissions].sort((left, right) => {
        return new Date(String(right.submitted_at || right.reviewed_at || 0)).getTime() - new Date(String(left.submitted_at || left.reviewed_at || 0)).getTime();
      }),
    [filteredSubmissions],
  );
  const submissionPageCount = Math.max(1, Math.ceil(prioritizedSubmissions.length / submissionsPerPage));
  const safeSubmissionPage = Math.min(submissionPage, submissionPageCount);
  const paginatedSubmissions = useMemo(
    () => prioritizedSubmissions.slice((safeSubmissionPage - 1) * submissionsPerPage, safeSubmissionPage * submissionsPerPage),
    [prioritizedSubmissions, safeSubmissionPage],
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
      api.get('/admin/email/sent'),
      api.get('/admin/email/recipients'),
    ]);

    const dashboardPayload = readPayload<Record<string, unknown>>(requests[0], {});
    const analyticsPayload = readPayload<Record<string, number>>(requests[1], {});
    const userRows = readPayload<UserRow[]>(requests[2], []);
    const profileRow = readPayload<AdminProfileRow | null>(requests[3], null);
    const adminAccountRows = readPayload<AdminAccountRow[]>(requests[4], []);
    const uploadRows = readPayload<UploadRow[]>(requests[5], []);
    const indiaRows = readPayload<IndiaPreSelectionApplicationRow[]>(requests[6], []);
    const pointRows = readPayload<PointTxRow[]>(requests[7], []);
    const claimRows = readPayload<KFoodClaimRow[]>(requests[8], []);
    const kfoodProductRows = readPayload<KFoodProductRow[]>(requests[9], []);
    const kfoodOverviewRows = readPayload<KFoodOverviewRow | null>(requests[10], null);
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
    const sentEmailRows = readPayload<SentEmailRow[]>(requests[23], []);
    const recipientCountPayload = readPayload<{ count: number }>(requests[24], { count: 0 });

    setDashboardMetrics((dashboardPayload.metrics as Record<string, number>) || {});
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
    setSentEmails(sentEmailRows);
    setEmailRecipientCount(Number(recipientCountPayload.count || 0));

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
      const prioritySubmission = submissionRows.find((entry) => entry.source_type === 'india_pre_selection') || submissionRows[0];
      setSelectedSubmissionId(prioritySubmission.id);
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
    if (!selectedKFoodProductSlug && kfoodProductRows.length) {
      setSelectedKFoodProductSlug(kfoodProductRows[0].slug);
      setKFoodProductForm(formFromKFoodProduct(kfoodProductRows[0]));
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    loadAdminData().catch(() => setNotice('Failed to load admin data.'));
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!selectedKFoodProductSlug && kfoodProducts.length) {
      setSelectedKFoodProductSlug(kfoodProducts[0].slug);
      setKFoodProductForm(formFromKFoodProduct(kfoodProducts[0]));
    }
  }, [kfoodProducts, selectedKFoodProductSlug]);

  useEffect(() => {
    if (!selectedKFoodProduct) return;
    setKFoodProductForm(formFromKFoodProduct(selectedKFoodProduct));
  }, [selectedKFoodProduct]);

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
    if (!submissionDetailOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSubmissionDetailOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [submissionDetailOpen]);

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
    setUserSuccess('User account updated successfully.');
    await loadAdminData();
  };

  const deleteUser = async (idOverride?: string) => {
    const targetId = idOverride || userForm.id;
    if (!targetId) return;
    await api.delete(`/users/${targetId}`);
    setNotice('User deleted.');
    setUserSuccess('User account deleted successfully.');
    setUserForm(emptyUserForm);
    await loadAdminData();
  };

  const closeUserSuccess = () => {
    setUserSuccess('');
    setUserDeleteConfirm(false);
    setUserForm(emptyUserForm);
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

  const logoutAdmin = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      useAppStore.getState().signOut();
      window.location.assign('/admin/login');
    }
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
    if (status === 'rejected' && !uploadReview.review_note.trim()) {
      setNotice('Rejection reason is required before rejecting an upload.');
      return;
    }
    await api.patch(`/admin/uploads/${selectedUpload.id}/review`, {
      status,
      points_reward: Number(uploadReview.points_reward || 0),
      review_note: uploadReview.review_note,
    });
    setNotice(`Upload ${status}.`);
    setReviewSuccess(`Content upload ${status} review submitted successfully.`);
    setSelectedUploadId(null);
    setUploadReview({ status: 'approved', points_reward: 0, review_note: '' });
    await loadAdminData();
  };

  const closeReviewSuccess = () => {
    setReviewSuccess('');
    setSubmissionDetailOpen(false);
    setIndiaReviewModalOpen(false);
    setSelectedSubmissionId(null);
    setSelectedIndiaApplicationId(null);
  };

  const prepareUploadReview = (submission: SubmissionRow) => {
    const upload = uploads.find((entry) => entry.id === submission.id);
    setSelectedUploadId(submission.id);
    setUploadReview({
      status: upload?.status === 'rejected' ? 'rejected' : 'approved',
      points_reward: upload?.points_reward || submission.points_reward || 0,
      review_note: upload?.review_note || submission.review_note || '',
    });
  };

  const reviewIndiaApplication = async () => {
    if (!selectedIndiaApplication) return;
    if (indiaApplicationReview.status === 'rejected' && !indiaApplicationReview.review_note.trim()) {
      setNotice('Rejection reason is required before sending the decision.');
      return;
    }
    await api.patch(`/admin/india-pre-selection/applications/${selectedIndiaApplication.id}`, {
      status: indiaApplicationReview.status,
      review_note: indiaApplicationReview.review_note,
    });
    setNotice(`India pre-selection application ${indiaApplicationReview.status}.`);
    setReviewSuccess(`India Pre-Selection ${indiaApplicationReview.status} review submitted successfully.`);
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
    setReviewSuccess(`K-Food ${status} review submitted successfully.`);
    setSelectedClaimId(null);
    setClaimReview({ status: 'approved', points_reward: 0, review_note: '' });
    await loadAdminData();
  };

  const reviewGenericSubmission = async (submission: SubmissionRow, status: 'approved' | 'rejected') => {
    await api.patch(`/admin/submissions/${submission.source_type}/${submission.id}/review`, { status });
    setReviewSuccess(`${submission.source_label} ${status} review submitted successfully.`);
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

  const selectKFoodProduct = (product: KFoodProductRow) => {
    setSelectedKFoodProductSlug(product.slug);
    setKFoodProductForm(formFromKFoodProduct(product));
  };

  const resetKFoodProductForm = () => {
    setSelectedKFoodProductSlug('');
    setKFoodProductForm(emptyKFoodProductForm);
  };

  const saveKFoodProduct = async () => {
    const payload = parseKFoodProductForm(kfoodProductForm);
    if (selectedKFoodProduct) {
      await api.patch(`/admin/kfood/products/${selectedKFoodProduct.slug}`, payload);
      setNotice(`K-Food product "${payload.title.en}" updated.`);
    } else {
      await api.post('/admin/kfood/products', payload);
      setNotice(`K-Food product "${payload.title.en}" created.`);
    }
    await loadAdminData();
    const nextProducts = (await api.get('/admin/kfood/products')).data?.data ?? [];
    const savedProduct = nextProducts.find((product: KFoodProductRow) => product.slug === payload.slug) || nextProducts[0] || null;
    if (savedProduct) {
      setSelectedKFoodProductSlug(savedProduct.slug);
      setKFoodProductForm(formFromKFoodProduct(savedProduct));
    } else {
      resetKFoodProductForm();
    }
  };

  const deleteKFoodProduct = async () => {
    if (!selectedKFoodProduct) return;
    await api.delete(`/admin/kfood/products/${selectedKFoodProduct.slug}`);
    setNotice(`K-Food product "${selectedKFoodProduct.title.en}" deleted.`);
    await loadAdminData();
    resetKFoodProductForm();
  };

  const syncKFoodProducts = async () => {
    const urls = kfoodImportUrls
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean);

    if (!urls.length) {
      setNotice('Add at least one WooCommerce URL first.');
      return;
    }

    await api.post('/admin/kfood/products/import', { urls });
    setNotice(`Imported ${urls.length} WooCommerce source URL(s).`);
    await loadAdminData();
    const refreshed = (await api.get('/admin/kfood/products')).data?.data ?? [];
    const first = refreshed[0];
    if (first) {
      setSelectedKFoodProductSlug(first.slug);
      setKFoodProductForm(formFromKFoodProduct(first));
    }
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

  const sendEmailMessage = async (mode: 'bulk' | 'single') => {
    const form = mode === 'bulk' ? bulkEmailForm : singleEmailForm;
    if (mode === 'bulk' && typeof window !== 'undefined' && !window.confirm(`Send this email to all ${users.length} non-deleted users with email addresses?`)) return;

    try {
      const response = await api.post('/admin/email/send', { ...form, mode });
      const count = Number(response.data?.data?.recipient_count || 0);
      setEmailSuccess(`${mode === 'bulk' ? 'Promotional email' : 'Email'} sent successfully to ${count} recipient${count === 1 ? '' : 's'}.`);
      if (mode === 'bulk') setBulkEmailForm(emptyEmailForm);
      else setSingleEmailForm(emptyEmailForm);
      await loadAdminData();
    } catch (error: unknown) {
      const response = (error as { response?: { data?: { error?: { message?: string } } } }).response;
      setNotice(response?.data?.error?.message || 'Email could not be sent. Check the details and try again.');
    }
  };

  const closeEmailSuccess = () => setEmailSuccess('');

  const renderSendEmail = () => (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <SectionShell
          title="All users"
          description={`Send one promotional email to all ${emailRecipientCount || users.length} non-deleted user accounts with an email address. The recipient list is fetched fresh at send time, and recipients are sent as BCC for privacy.`}
          actions={<span className="text-sm font-bold text-[#ffc400]">Bulk campaign</span>}
        >
          <div className="space-y-4">
            <Field label="Email title">
              <input className={inputClass} maxLength={255} placeholder="A special update from K-CUBE" value={bulkEmailForm.subject} onChange={(event) => setBulkEmailForm((state) => ({ ...state, subject: event.target.value }))} />
            </Field>
            <Field label="Message">
              <textarea className={`${inputClass} min-h-48`} placeholder="Write the promotional message..." value={bulkEmailForm.body} onChange={(event) => setBulkEmailForm((state) => ({ ...state, body: event.target.value }))} />
            </Field>
            <button type="button" onClick={() => void sendEmailMessage('bulk')} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
              <Send className="h-4 w-4" /> Send to all users
            </button>
          </div>
        </SectionShell>

        <SectionShell
          title="Single email"
          description="Send a personal email to one address with optional CC recipients, just like Gmail. Separate CC addresses with commas."
          actions={<span className="text-sm font-bold text-[#ffc400]">To + CC</span>}
        >
          <div className="space-y-4">
            <Field label="To">
              <input className={inputClass} type="email" placeholder="recipient@example.com" value={singleEmailForm.to} onChange={(event) => setSingleEmailForm((state) => ({ ...state, to: event.target.value }))} />
            </Field>
            <Field label="CC">
              <input className={inputClass} placeholder="manager@example.com, team@example.com" value={singleEmailForm.cc} onChange={(event) => setSingleEmailForm((state) => ({ ...state, cc: event.target.value }))} />
            </Field>
            <Field label="Email title">
              <input className={inputClass} maxLength={255} placeholder="Your K-CUBE update" value={singleEmailForm.subject} onChange={(event) => setSingleEmailForm((state) => ({ ...state, subject: event.target.value }))} />
            </Field>
            <Field label="Message">
              <textarea className={`${inputClass} min-h-32`} placeholder="Write your message..." value={singleEmailForm.body} onChange={(event) => setSingleEmailForm((state) => ({ ...state, body: event.target.value }))} />
            </Field>
            <button type="button" onClick={() => void sendEmailMessage('single')} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
              <Send className="h-4 w-4" /> Send email
            </button>
          </div>
        </SectionShell>
      </div>

      <SectionShell title="Sent emails" description="Search your email history, filter delivery status, and open any message for its full details." actions={<span className="text-sm font-bold text-[#ffc400]">{filteredSentEmails.length} records</span>}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <input className={`${inputClass} flex-1`} placeholder="Search title, recipient name, email, CC..." value={sentEmailQuery} onChange={(event) => setSentEmailQuery(event.target.value)} />
          <select className={`${selectClass} sm:w-40`} value={sentEmailStatusFilter} onChange={(event) => setSentEmailStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="hidden grid-cols-[56px_minmax(180px,1fr)_120px_140px_170px_minmax(180px,1.3fr)] gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#98a4b1] lg:grid">
            <span>S.No.</span><span>Title</span><span>Type</span><span>Recipients</span><span>Sent</span><span>Status</span>
          </div>
          <div className="divide-y divide-white/10">
            <PaginatedList items={filteredSentEmails}>
              {(visibleEmails, emailOffset) => visibleEmails.map((email, index) => (
                <button key={email.id} type="button" onClick={() => setSelectedSentEmail(email)} className="grid w-full gap-3 px-5 py-4 text-left transition hover:bg-white/[0.04] lg:grid-cols-[56px_minmax(180px,1fr)_120px_140px_170px_minmax(180px,1.3fr)] lg:items-center">
                  <span className="text-sm font-bold text-[#7d8a99]">{emailOffset + index + 1}</span>
                  <div className="min-w-0"><p className="truncate text-sm font-black text-white">{email.subject}</p><p className="mt-1 truncate text-xs text-[#aab5c6]">{email.delivery_mode === 'bulk' ? 'All users' : (parseEmailList(email.recipient_names_json)[0] || parseEmailList(email.recipients_json)[0] || 'Recipient')}</p></div>
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-[#aab5c6]">{email.delivery_mode}</span>
                  <span className="text-sm text-[#d4dbe7]">{email.recipient_count}</span>
                  <span className="text-sm text-[#aab5c6]">{email.sent_at ? new Date(email.sent_at).toLocaleString() : 'Not sent'}</span>
                  <div><span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${email.status === 'sent' ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-red-400/30 bg-red-400/10 text-red-300'}`}>{email.status}</span>{email.error_message ? <p className="mt-2 text-xs text-red-300">{email.error_message}</p> : null}</div>
                </button>
              ))}
            </PaginatedList>
            {!filteredSentEmails.length ? <p className="px-5 py-10 text-center text-sm text-[#aab5c6]">No matching emails found.</p> : null}
          </div>
        </div>
      </SectionShell>
      {selectedSentEmail ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setSelectedSentEmail(null)}>
          <div className="flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#101014] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#ffc400]">Sent email details</p><h2 className="mt-2 text-2xl font-black text-white">{selectedSentEmail.subject}</h2></div><button type="button" onClick={() => setSelectedSentEmail(null)} className="rounded-full border border-white/10 p-2 text-white" aria-label="Close email details"><X className="h-5 w-5" /></button></div>
            <div className="space-y-4 overflow-y-auto p-6">
              <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-white/10 bg-black/20 p-3"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#98a4b1]">Type</p><p className="mt-2 font-bold text-white">{selectedSentEmail.delivery_mode}</p></div><div className="rounded-xl border border-white/10 bg-black/20 p-3"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#98a4b1]">Recipients</p><p className="mt-2 font-bold text-white">{selectedSentEmail.recipient_count}</p></div><div className="rounded-xl border border-white/10 bg-black/20 p-3"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#98a4b1]">Status</p><p className="mt-2 font-bold text-emerald-300">{selectedSentEmail.status}</p></div></div>
              <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">Recipient names</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#d4dbe7]">{parseEmailList(selectedSentEmail.recipient_names_json).join(', ') || 'Names not available for this older email.'}</p></div>
              <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">Email addresses</p><p className="mt-2 break-words text-sm leading-6 text-[#d4dbe7]">{parseEmailList(selectedSentEmail.recipients_json).join(', ')}</p></div>
              {selectedSentEmail.cc_addresses ? <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">CC</p><p className="mt-2 break-words text-sm text-[#d4dbe7]">{selectedSentEmail.cc_addresses}</p></div> : null}
              <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">Message</p><p className="mt-2 whitespace-pre-wrap rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-[#d4dbe7]">{selectedSentEmail.body}</p></div>
              <p className="text-xs text-[#98a4b1]">{selectedSentEmail.sent_at ? new Date(selectedSentEmail.sent_at).toLocaleString() : 'Not sent'}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );

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
              <article key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-3.5">
              <Icon className="h-5 w-5 text-[#ffc400]" />
              <p className="mt-2 text-sm text-[#aab5c6]">{item.label}</p>
              <p className="mt-1 text-2xl font-black">{item.value}</p>
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
          <PaginatedList items={filteredPages}>
            {(visiblePages) => visiblePages.map((page) => (
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
          </PaginatedList>
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
          <PaginatedList items={filteredBlocks}>
            {(visibleBlocksPage) => visibleBlocksPage.map((block) => (
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
          </PaginatedList>
          {!visibleBlocks.length ? <p className="text-sm text-[#aab5c6]">No blocks yet for this page.</p> : null}
        </div>
      </SectionShell>
    </div>
  );

  const renderLearning = () => (
    <div className="grid gap-5 xl:grid-cols-[minmax(320px,360px)_minmax(0,1fr)]">
      <SectionShell title="Learning track editor" description="Create and maintain lesson tracks, reward points and JSON copy blocks used by the learning journeys." actions={<span className="text-sm font-bold text-[#ffc400]">{filteredTracks.length} tracks</span>}>
        <div className="space-y-3">
          <PaginatedList items={filteredTracks}>
            {(visibleTracks) => visibleTracks.map((track) => (
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
          </PaginatedList>
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
            <PaginatedList items={visibleQuestions}>
              {(visibleQuestionPage) => visibleQuestionPage.map((question) => (
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
            </PaginatedList>
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

  const renderUsers = () => {
    const selectUser = (entry: UserRow) => setUserForm({
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
    });

    return (
      <>
        <SectionShell title="Users" description="Manage account access, profile details and user actions from one compact list." actions={<span className="text-sm font-bold text-[#ffc400]">{filteredUsers.length} records</span>}>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <div className="hidden grid-cols-[45px_minmax(180px,1.2fr)_minmax(220px,1.4fr)_100px_100px_90px_90px_150px] gap-3 bg-white/[0.04] px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#ffc400] lg:grid">
              <span>S.No.</span><span>Name</span><span>Email</span><span>Role</span><span>Status</span><span>Points</span><span>Streak</span><span>Actions</span>
            </div>
            <PaginatedList items={filteredUsers}>
              {(visibleUsers, userOffset) => visibleUsers.map((entry, index) => (
                <div key={entry.id} className="grid gap-3 border-t border-white/10 bg-black/20 px-4 py-3 transition hover:bg-white/[0.04] lg:grid-cols-[45px_minmax(180px,1.2fr)_minmax(220px,1.4fr)_100px_100px_90px_90px_150px] lg:items-center">
                  <p className="text-xs font-black text-[#7d8a99]">{userOffset + index + 1}</p>
                  <div><p className="font-bold text-white">{entry.full_name}</p><p className="mt-1 text-xs text-[#7d8a99]">#{entry.id}</p></div>
                  <p className="truncate text-sm text-[#aab5c6]">{entry.email}</p>
                  <p className="text-sm capitalize text-[#d4dbe7]">{entry.role}</p>
                  <p className="text-sm capitalize text-[#d4dbe7]">{entry.status}</p>
                  <p className="text-sm font-bold text-white">{entry.points}</p>
                  <p className="text-sm text-[#aab5c6]">{entry.streak}</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => selectUser(entry)} className="rounded-lg bg-[#ffc400] px-3 py-2 text-xs font-black text-[#111]">Edit</button>
                    <button type="button" onClick={() => { selectUser(entry); setUserDeleteConfirm(true); }} className="rounded-lg border border-red-500/40 px-3 py-2 text-xs font-black text-red-300">Delete</button>
                  </div>
                </div>
              ))}
            </PaginatedList>
          </div>
        </SectionShell>

        {userForm.id ? (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setUserForm(emptyUserForm)}>
            <div className="max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#101014] p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#ffc400]">User account</p><h2 className="mt-2 text-2xl font-black text-white">Edit user</h2></div><button type="button" onClick={() => setUserForm(emptyUserForm)} className="rounded-full border border-white/10 p-2 text-white"><X className="h-5 w-5" /></button></div>
              <div className="mt-5 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2"><Field label="User ID"><input className={inputClass} value={userForm.id} readOnly /></Field><Field label="Account Email"><input className={inputClass} value={selectedUser?.email || ''} readOnly /></Field></div>
                <Field label="Full Name"><input className={inputClass} value={userForm.full_name} onChange={(event) => setUserForm((state) => ({ ...state, full_name: event.target.value }))} /></Field>
                <div className="grid gap-3 sm:grid-cols-2"><Field label="Role"><select className={selectClass} value={userForm.role} onChange={(event) => setUserForm((state) => ({ ...state, role: event.target.value }))}><option value="member">member</option><option value="manager">manager</option><option value="admin">admin</option><option value="guest">guest</option></select></Field><Field label="Status"><select className={selectClass} value={userForm.status} onChange={(event) => setUserForm((state) => ({ ...state, status: event.target.value }))}><option value="active">active</option><option value="pending">pending</option><option value="suspended">suspended</option><option value="deleted">deleted</option></select></Field></div>
                <Field label="Category Access"><select className={selectClass} value={userForm.category_access} onChange={(event) => setUserForm((state) => ({ ...state, category_access: event.target.value }))}><option value="category_a">category_a</option><option value="category_b">category_b</option><option value="category_c">category_c</option></select></Field>
                <Field label="Phone"><input className={inputClass} value={userForm.phone} onChange={(event) => setUserForm((state) => ({ ...state, phone: event.target.value }))} /></Field>
                <div className="grid gap-3 sm:grid-cols-2"><Field label="City"><input className={inputClass} value={userForm.city} onChange={(event) => setUserForm((state) => ({ ...state, city: event.target.value }))} /></Field><Field label="State"><input className={inputClass} value={userForm.state} onChange={(event) => setUserForm((state) => ({ ...state, state: event.target.value }))} /></Field></div>
                <div className="grid gap-3 sm:grid-cols-2"><Field label="Country"><input className={inputClass} value={userForm.country} onChange={(event) => setUserForm((state) => ({ ...state, country: event.target.value }))} /></Field><Field label="Profile Image"><input className={inputClass} value={userForm.profile_image} onChange={(event) => setUserForm((state) => ({ ...state, profile_image: event.target.value }))} /></Field></div>
                <div className="flex flex-wrap gap-3 pt-2"><button type="button" onClick={saveUser} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]"><Save className="h-4 w-4" /> Save user</button><button type="button" onClick={() => setUserDeleteConfirm(true)} className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-3 text-sm font-black text-red-300"><Trash2 className="h-4 w-4" /> Delete user</button></div>
              </div>
            </div>
          </div>
        ) : null}
        {userDeleteConfirm ? <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-3xl border border-red-400/30 bg-[#101014] p-6 text-white shadow-2xl"><p className="text-xs font-black uppercase tracking-[0.22em] text-red-300">Confirm action</p><h3 className="mt-2 text-xl font-black">Delete this user account?</h3><p className="mt-2 text-sm leading-6 text-[#aab5c6]">This action will remove the account and its access from the admin panel.</p><div className="mt-5 flex gap-3"><button type="button" onClick={() => { setUserDeleteConfirm(false); setUserForm(emptyUserForm); }} className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white">Cancel</button><button type="button" onClick={() => { setUserDeleteConfirm(false); void deleteUser(); }} className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-black text-white">Delete</button></div></div></div> : null}
        {userSuccess ? <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-3xl border border-emerald-400/30 bg-[#101014] p-6 text-white shadow-2xl"><div className="flex items-start gap-3"><CheckCircle2 className="mt-1 h-6 w-6 text-emerald-300" /><div><p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">Action completed</p><h3 className="mt-2 text-xl font-black">User action successful</h3><p className="mt-2 text-sm text-[#aab5c6]">{userSuccess}</p></div></div><button type="button" onClick={closeUserSuccess} className="mt-5 w-full rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">Continue</button></div></div> : null}
      </>
    );
  };

  const renderAdminProfile = () => {
    const profile = adminProfile || user;
    const fallbackUser = user as { full_name?: string; fullName?: string } | null;
    const profileName = adminProfile?.full_name || fallbackUser?.full_name || fallbackUser?.fullName || 'Admin';
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
              <button type="button" onClick={logoutAdmin} className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 px-4 py-3 text-sm font-black text-red-300 transition hover:border-red-400/60 hover:bg-red-500/10">
                <LogOut className="h-4 w-4" />
                Log out securely
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
        description="Create full administrator accounts here. Manager access is assigned from Users; event-only access is not yet available as a separate permission scope."
        actions={<span className="text-sm font-bold text-[#ffc400]">{filteredAdminAccounts.length} admins</span>}
      >
        <div className="space-y-3">
          <PaginatedList items={filteredAdminAccounts}>
            {(visibleAdminAccounts) => visibleAdminAccounts.map((account) => (
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
          </PaginatedList>
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
        <PaginatedList items={filteredChapters}>
          {(visibleChapterPage, chapterOffset) => (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] text-left text-sm">
            <thead className="text-[#ffc400]">
              <tr>
                <th className="border-b border-white/10 py-3">S.No.</th><th className="border-b border-white/10 py-3">Name</th>
                <th className="border-b border-white/10 py-3">Slug</th>
                <th className="border-b border-white/10 py-3">City</th>
                <th className="border-b border-white/10 py-3">Leader</th>
                <th className="border-b border-white/10 py-3">Members</th>
                <th className="border-b border-white/10 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-[#d4dbe7]">
              {visibleChapterPage.map((chapter, index) => (
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
                  <td className="border-b border-white/10 py-3 text-xs text-[#7d8a99]">{chapterOffset + index + 1}</td><td className="border-b border-white/10 py-3 font-bold">{chapter.name}</td>
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
          )}
        </PaginatedList>
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
        <PaginatedList items={filteredPoints}>
          {(visiblePointPage, pointOffset) => (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-[#ffc400]">
              <tr>
                <th className="border-b border-white/10 py-3">S.No.</th><th className="border-b border-white/10 py-3">User</th>
                <th className="border-b border-white/10 py-3">Source</th>
                <th className="border-b border-white/10 py-3">Delta</th>
                <th className="border-b border-white/10 py-3">Balance</th>
                <th className="border-b border-white/10 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="text-[#d4dbe7]">
              {visiblePointPage.map((tx, index) => (
                <tr key={tx.id}>
                  <td className="border-b border-white/10 py-3 text-xs text-[#7d8a99]">{pointOffset + index + 1}</td><td className="border-b border-white/10 py-3">{tx.full_name}</td>
                  <td className="border-b border-white/10 py-3">{tx.source_type}</td>
                  <td className="border-b border-white/10 py-3">{tx.points_delta}</td>
                  <td className="border-b border-white/10 py-3">{tx.balance_after}</td>
                  <td className="border-b border-white/10 py-3">{new Date(tx.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          )}
        </PaginatedList>
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
          <PaginatedList items={filteredUploads}>
            {(visibleUploads) => visibleUploads.map((entry) => (
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
          </PaginatedList>
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
      pending: filteredIndiaApplications.filter((entry) => entry.status === 'pending').length,
      submitted: filteredIndiaApplications.filter((entry) => entry.status === 'submitted').length,
      reviewing: filteredIndiaApplications.filter((entry) => entry.status === 'reviewing').length,
      shortlisted: filteredIndiaApplications.filter((entry) => entry.status === 'shortlisted').length,
      selected: filteredIndiaApplications.filter((entry) => entry.status === 'selected').length,
      rejected: filteredIndiaApplications.filter((entry) => entry.status === 'rejected').length,
    };

    return (
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {[
            { label: 'Pending', value: counts.pending },
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

        <div className="min-w-0">
          <SectionShell
            title="India Pre-Selection queue"
            description="Review every applicant from one full-width queue. Open a submission for complete details, moderation, and email follow-up."
            actions={<span className="text-sm font-bold text-[#ffc400]">{filteredIndiaApplications.length} records</span>}
          >
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="hidden grid-cols-[56px_minmax(220px,1.4fr)_minmax(180px,1fr)_150px_170px_190px] gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#98a4b1] lg:grid">
                <span>S.No.</span>
                <span>Applicant</span>
                <span>Contact</span>
                <span>Location</span>
                <span>Submitted</span>
                <span className="text-right">Actions</span>
              </div>
              <div className="divide-y divide-white/10">
               <PaginatedList items={filteredIndiaApplications}>
                 {(visibleIndiaApplications, indiaOffset) => visibleIndiaApplications.map((entry, index) => {
                const active = selectedIndiaApplicationId === entry.id;
                const applicantEmail = entry.user_email || entry.email;
                const mailHref = `mailto:${applicantEmail}?subject=${encodeURIComponent(`K-CUBE India Pre-Selection update for ${entry.full_name}`)}&body=${encodeURIComponent(`Hello ${entry.full_name},\n\nThank you for your India Pre-Selection application.\n\nRegards,\nK-CUBE Admin`)}`;
                return (
                  <div
                    key={entry.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => { setSelectedIndiaApplicationId(entry.id); setIndiaReviewModalOpen(true); }}
                    onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedIndiaApplicationId(entry.id); setIndiaReviewModalOpen(true); } }}
                    className={`grid cursor-pointer gap-3 px-5 py-4 text-left transition hover:bg-white/[0.04] lg:grid-cols-[56px_minmax(220px,1.4fr)_minmax(180px,1fr)_150px_170px_190px] lg:items-center ${active ? 'bg-[#ffc400]/[0.06]' : 'bg-black/10'}`}
                  >
                    <span className="text-sm font-bold text-[#7d8a99]">{indiaOffset + index + 1}</span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-base font-black text-white">{entry.full_name}</p>
                        <span className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#ffc400]">{entry.status}</span>
                      </div>
                      <p className="mt-1 text-xs text-[#aab5c6]">{entry.performance_category || 'Application'} / {entry.points_awarded || 0} points</p>
                    </div>
                    <div className="min-w-0 text-sm text-[#aab5c6]">
                      <p className="truncate">{applicantEmail}</p>
                      <p className="mt-1">{entry.phone || 'No phone'}</p>
                    </div>
                    <div className="text-sm text-[#d4dbe7]">
                      <p>{entry.current_city || 'No city'}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#98a4b1]">{entry.nationality || 'No nationality'}</p>
                    </div>
                    <p className="text-sm text-[#aab5c6]">{entry.submitted_at ? new Date(entry.submitted_at).toLocaleString() : 'No timestamp'}</p>
                    <div className="flex flex-wrap gap-2 lg:justify-end" onClick={(event) => event.stopPropagation()}>
                      <button type="button" onClick={() => { setSelectedIndiaApplicationId(entry.id); setIndiaReviewModalOpen(true); }} className="rounded-lg bg-[#ffc400] px-3 py-2 text-xs font-black text-[#111]">Review</button>
                      <a href={mailHref} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white hover:border-[#ffc400]/50">Email</a>
                    </div>
                  </div>
                );
                 })}
               </PaginatedList>
              {!filteredIndiaApplications.length ? <p className="px-5 py-10 text-center text-sm text-[#aab5c6]">No applications match your search.</p> : null}
              </div>
            </div>
          </SectionShell>

          <div className={indiaReviewModalOpen && selectedIndiaApplication ? 'fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm' : 'hidden'} onClick={() => setIndiaReviewModalOpen(false)}>
          <div className="flex max-h-[calc(100dvh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#101014] shadow-[0_32px_100px_rgba(0,0,0,0.7)]" onClick={(event) => event.stopPropagation()}>
          <div className="mb-5 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffc400]">India Pre-Selection review</p>
              <h2 className="mt-2 text-2xl font-black text-white">Applicant details and decision</h2>
              <p className="mt-2 text-sm text-[#aab5c6]">Review the submission carefully, update its status, and contact the applicant when needed.</p>
            </div>
            <button type="button" onClick={() => setIndiaReviewModalOpen(false)} className="rounded-full border border-white/10 p-2 text-[#d4dbe7] hover:border-[#ffc400]/50 hover:text-white" aria-label="Close review"><X className="h-5 w-5" /></button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <SectionShell
            title="Applicant profile + decision"
            description="Complete application information and moderation controls."
          >
            {selectedIndiaApplication ? (
              <div className="min-w-0 space-y-4">
                <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_minmax(280px,300px)]">
                  <div className="space-y-4">
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffc400]">Applicant profile</p>
                          <h3 className="mt-2 text-3xl font-black text-white">{selectedIndiaApplication.full_name}</h3>
                          <p className="mt-2 text-sm text-[#aab5c6]">{selectedIndiaApplication.user_email || selectedIndiaApplication.email}</p>
                          <a
                            href={`mailto:${selectedIndiaApplication.user_email || selectedIndiaApplication.email}?subject=${encodeURIComponent(`K-CUBE India Pre-Selection update for ${selectedIndiaApplication.full_name}`)}`}
                            className="mt-3 inline-flex rounded-xl border border-[#ffc400]/40 bg-[#ffc400]/10 px-3 py-2 text-xs font-black text-[#ffc400] hover:bg-[#ffc400]/20"
                          >
                            Reply by email
                          </a>
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
                          <option value="pending">pending</option>
                          <option value="submitted">submitted</option>
                          <option value="reviewing">reviewing</option>
                          <option value="shortlisted">shortlisted</option>
                          <option value="selected">selected (legacy)</option>
                          <option value="approved">approved</option>
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
                        Submission par points nahi milte. Approval par 200 points add honge; rejection ke liye reason mandatory hai aur applicant ko email jayegi.
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
                      <button type="button" onClick={() => setIndiaApplicationReview((state) => ({ ...state, status: 'approved' }))} className="rounded-xl border border-[#ffc400]/40 px-4 py-3 text-sm font-bold text-[#ffc400]">
                        Approve
                      </button>
                      <button type="button" onClick={() => setIndiaApplicationReview((state) => ({ ...state, status: 'rejected' }))} className="rounded-xl border border-red-500/40 px-4 py-3 text-sm font-bold text-red-300">
                        Reject
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
        </div>
        </div>
      </div>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderKFood = () => (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      <SectionShell title="K-Food claims" description="Audit purchase claims, coupon references and reward eligibility." actions={<span className="text-sm font-bold text-[#ffc400]">{filteredClaims.length} records</span>}>
        <div className="space-y-3">
          <PaginatedList items={filteredClaims}>
            {(visibleClaims) => visibleClaims.map((entry) => (
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
          </PaginatedList>
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
      india: filteredSubmissions.filter((entry) => entry.source_type === 'india_pre_selection').length,
      other: filteredSubmissions.filter((entry) => entry.source_type !== 'india_pre_selection').length,
    };
    const submissionPayloadView = selectedSubmission ? submissionFieldsFromPayload(selectedSubmission.payload) : null;

    return (
      <>
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {[
              { label: 'All submissions', value: counts.total },
              { label: 'Pending', value: counts.pending },
              { label: 'Reviewed', value: counts.reviewed },
              { label: 'Sources', value: counts.sources },
              { label: 'India Pre-Selection', value: counts.india },
              { label: 'Other sources', value: counts.other },
            ].map((item) => (
              <article
                key={item.label}
                className={`rounded-2xl border p-5 ${
                  item.label === 'India Pre-Selection'
                    ? 'border-[#ffc400]/35 bg-gradient-to-br from-[#ffc400]/12 via-black/20 to-black/25 shadow-[0_0_0_1px_rgba(255,196,0,0.12)]'
                    : 'border-white/10 bg-black/20'
                }`}
              >
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#98a4b1]">{item.label}</p>
                <p className="mt-2 text-3xl font-black text-white">{item.value}</p>
              </article>
            ))}
          </div>

          <SectionShell
            title="Submission inbox"
            description="All participation, event, singing, dancing and form rows are normalized into a single queue."
            actions={<span className="text-sm font-bold text-[#ffc400]">{filteredSubmissions.length} records</span>}
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#ffc400]/20 bg-[#ffc400]/5 px-4 py-3">
                <span className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#ffc400]">
                  Priority source
                </span>
                <p className="text-sm text-[#d4dbe7]">
                  India Pre-Selection submissions are highlighted first so the festival workflow is easy to scan.
                </p>
              </div>
              <div className="hidden grid-cols-[35px_minmax(150px,1.1fr)_minmax(180px,1.2fr)_minmax(150px,1fr)_minmax(150px,.8fr)_auto_auto] gap-3 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#7d8a99] lg:grid">
                <span>S.No.</span><span>Submission</span>
                <span>Applicant</span>
                <span>Contact</span>
                <span>Submitted</span>
                <span>Status</span>
                <span>Action</span>
              </div>
              {paginatedSubmissions.map((entry, index) => {
                const active = selectedSubmissionId === entry.id;
                const isIndia = entry.source_type === 'india_pre_selection';
                return (
                  <button
                    key={`${entry.source_type}-${entry.id}`}
                    type="button"
                     onClick={() => {
                       setSelectedSubmissionId(entry.id);
                       if (entry.source_type === 'india_pre_selection') {
                         setSelectedIndiaApplicationId(entry.id);
                       } else {
                         if (entry.source_type === 'content_upload') prepareUploadReview(entry);
                       }
                       setSubmissionDetailOpen(true);
                     }}
                    className={`group w-full overflow-hidden rounded-lg border text-left transition ${
                      active
                        ? isIndia
                          ? 'border-[#ffc400] bg-gradient-to-br from-[#ffc400]/18 via-black/40 to-black/35 shadow-[0_0_0_1px_rgba(255,196,0,0.18)]'
                          : 'border-[#ffc400] bg-black/40 shadow-[0_0_0_1px_rgba(255,196,0,0.12)]'
                        : isIndia
                          ? 'border-[#ffc400]/35 bg-gradient-to-br from-[#ffc400]/10 via-black/25 to-black/20 hover:border-[#ffc400]/60'
                          : 'border-white/10 bg-black/20 hover:border-white/20'
                    }`}
                  >
                    <div className={`grid items-center gap-3 px-4 py-3 lg:grid-cols-[35px_minmax(150px,1.1fr)_minmax(180px,1.2fr)_minmax(150px,1fr)_minmax(150px,.8fr)_auto_auto] ${isIndia ? 'border-l-4 border-[#ffc400]' : 'border-l-4 border-transparent'}`}>
                      <span className="text-xs font-black text-[#7d8a99]">{(safeSubmissionPage - 1) * submissionsPerPage + index + 1}</span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-[10px] font-black uppercase tracking-[0.2em] text-[#ffc400]">{entry.source_label}</p>
                          {isIndia ? <span className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#ffc400]">Priority</span> : null}
                        </div>
                        <h3 className="mt-1 truncate text-sm font-black text-white">{entry.title}</h3>
                        <p className="mt-0.5 truncate text-xs text-[#7d8a99]">{entry.submission_kind || 'General submission'}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">{entry.applicant_name || 'Anonymous applicant'}</p>
                        <p className="mt-0.5 truncate text-xs text-[#aab5c6]">{entry.applicant_phone || 'No phone'}</p>
                      </div>
                      <p className="truncate text-sm text-[#aab5c6]">{entry.applicant_email || 'No email'}</p>
                      <p className="text-xs text-[#aab5c6]">{entry.submitted_at ? new Date(entry.submitted_at).toLocaleString() : 'No timestamp'}</p>
                      <span className={`justify-self-start rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] ${isIndia ? 'border-[#ffc400]/40 bg-[#ffc400]/15 text-[#ffc400]' : 'border-white/10 bg-white/5 text-[#d4dbe7]'}`}>
                        {entry.status}
                      </span>
                       <span className="hidden text-xs font-bold text-[#7d8a99] group-hover:text-[#ffc400] lg:inline">
                         {entry.source_type === 'content_upload' ? 'Open / review' : 'Open'}
                       </span>
                    </div>
                  </button>
                );
              })}
              {prioritizedSubmissions.length > submissionsPerPage ? (
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <p className="text-xs text-[#7d8a99]">Page {safeSubmissionPage} of {submissionPageCount}</p>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setSubmissionPage((page) => Math.max(1, page - 1))} disabled={safeSubmissionPage === 1} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
                    <button type="button" onClick={() => setSubmissionPage((page) => Math.min(submissionPageCount, page + 1))} disabled={safeSubmissionPage === submissionPageCount} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Next</button>
                  </div>
                </div>
              ) : null}
              {!filteredSubmissions.length ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-bold text-white">No submissions match the current search.</p>
                  <p className="mt-2 text-sm leading-6 text-[#aab5c6]">Try clearing the search box or switching source filters.</p>
                </div>
              ) : null}
            </div>
          </SectionShell>
        </div>

        {submissionDetailOpen && selectedSubmission ? (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSubmissionDetailOpen(false)}
          >
            <div
              className="flex max-h-[calc(100dvh-2rem)] w-full max-w-7xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0d12] shadow-[0_32px_100px_rgba(0,0,0,0.65)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffc400]">{selectedSubmission.source_label}</p>
                    {selectedSubmission.source_type === 'india_pre_selection' ? (
                      <span className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/15 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.22em] text-[#ffc400]">
                        Priority review
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">{selectedSubmission.title}</h3>
                  <p className="mt-2 text-sm text-[#aab5c6]">{selectedSubmission.submission_kind || 'General submission'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmissionDetailOpen(false)}
                  className="rounded-full border border-white/10 bg-black/30 p-3 text-[#d4dbe7] transition hover:border-[#ffc400]/40 hover:text-white"
                  aria-label="Close submission details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid min-h-0 flex-1 overflow-y-auto gap-0 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,380px)]">
                <div className="space-y-5 p-5">
                  <div className={`rounded-3xl border p-5 ${selectedSubmission.source_type === 'india_pre_selection' ? 'border-[#ffc400]/40 bg-gradient-to-br from-[#ffc400]/15 via-black/30 to-black/20' : 'border-white/10 bg-black/20'}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-3">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${selectedSubmission.source_type === 'india_pre_selection' ? 'border-[#ffc400]/40 bg-[#ffc400]/15 text-[#ffc400]' : 'border-white/10 bg-white/5 text-[#d4dbe7]'}`}>
                          {selectedSubmission.status}
                        </span>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-[#aab5c6]">
                          <span>{selectedSubmission.applicant_name || 'Not provided'}</span>
                          <span className="text-[#4b5563]">|</span>
                          <span>{selectedSubmission.applicant_email || 'No email'}</span>
                          <span className="text-[#4b5563]">|</span>
                          <span>{selectedSubmission.applicant_phone || 'No phone'}</span>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-right">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">Points</p>
                        <p className="mt-1 text-2xl font-black text-white">{selectedSubmission.points_reward || 0}</p>
                      </div>
                    </div>
                  </div>

                  {submissionPayloadView?.contentEntries.length ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#ffc400]" />
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#98a4b1]">Submission content</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {submissionPayloadView.contentEntries.map((entry) => {
                          if (entry.kind === 'list') {
                            return (
                              <div key={entry.key} className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:col-span-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">{entry.label}</p>
                                <ul className="mt-3 space-y-2 text-sm text-[#d4dbe7]">
                                  {entry.value.length ? entry.value.map((item) => <li key={`${entry.key}-${item}`} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">{item}</li>) : <li className="text-[#7d8a99]">No items provided</li>}
                                </ul>
                              </div>
                            );
                          }

                          if (entry.kind === 'object') {
                            return (
                              <div key={entry.key} className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:col-span-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">{entry.label}</p>
                                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-4 text-xs leading-6 text-[#d4dbe7]">
                                  {JSON.stringify(entry.value, null, 2)}
                                </pre>
                              </div>
                            );
                          }

                          return (
                            <div key={entry.key} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">{entry.label}</p>
                              <p className="mt-2 text-sm leading-6 text-[#d4dbe7] break-words">{entry.value}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {submissionPayloadView?.mediaEntries.length ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="h-4 w-4 text-[#ffc400]" />
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#98a4b1]">Media and links</p>
                      </div>
                      <div className="grid gap-3">
                        {submissionPayloadView.mediaEntries.map((entry) => {
                          const stringValue = stringifySubmissionValue(entry.rawValue);
                          const youtubeId = typeof stringValue === 'string' ? extractYouTubeId(stringValue) : null;
                          return (
                            <div key={entry.key} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">{entry.label}</p>
                                  <p className="mt-2 text-sm text-[#d4dbe7] break-all">{stringValue || 'No link provided'}</p>
                                </div>
                                {youtubeId ? (
                                  <a
                                    href={`https://www.youtube.com/watch?v=${youtubeId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl border border-[#ffc400]/30 bg-[#ffc400]/10 px-3 py-2 text-xs font-black text-[#ffc400]"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    Open
                                  </a>
                                ) : isProbablyUrl(stringValue) ? (
                                  <a
                                    href={stringValue}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl border border-[#ffc400]/30 bg-[#ffc400]/10 px-3 py-2 text-xs font-black text-[#ffc400]"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    Open
                                  </a>
                                ) : null}
                              </div>
                              {youtubeId ? (
                                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                                  <iframe
                                    className="aspect-video w-full"
                                    src={`https://www.youtube.com/embed/${youtubeId}`}
                                    title={`${entry.label} preview`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {selectedSubmission.description ? (
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">Description</p>
                      <p className="mt-2 text-sm leading-7 text-[#d4dbe7]">{selectedSubmission.description}</p>
                    </div>
                  ) : null}

                  <details className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <summary className="cursor-pointer list-none text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">
                      Raw payload
                    </summary>
                    <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-4 text-xs leading-6 text-[#d4dbe7]">
                      {JSON.stringify(selectedSubmission.payload, null, 2)}
                    </pre>
                  </details>
                </div>

                <div className="border-t border-white/10 p-5 xl:border-l xl:border-t-0">
                  <div className="sticky top-0 space-y-4">
                    <div className="rounded-3xl border border-[#ffc400]/35 bg-gradient-to-br from-[#ffc400]/12 via-black/25 to-black/20 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffc400]">Applicant profile</p>
                          <h4 className="mt-2 text-2xl font-black text-white">{selectedSubmission.applicant_name || 'Applicant'}</h4>
                          <p className="mt-2 text-sm text-[#aab5c6]">{selectedSubmission.submission_kind || 'Submission'}</p>
                        </div>
                        <span className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#ffc400]">
                          {selectedSubmission.source_type.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                      {[
                        { label: 'Applicant', value: selectedSubmission.applicant_name || 'Not provided' },
                        { label: 'Email', value: selectedSubmission.applicant_email || 'Not provided' },
                        { label: 'Phone', value: selectedSubmission.applicant_phone || 'Not provided' },
                        { label: 'Source', value: selectedSubmission.source_label || 'Unknown source' },
                        { label: 'Submitted', value: selectedSubmission.submitted_at ? new Date(selectedSubmission.submitted_at).toLocaleString() : 'Unknown' },
                        { label: 'Reviewed', value: selectedSubmission.reviewed_at ? new Date(selectedSubmission.reviewed_at).toLocaleString() : 'Not reviewed yet' },
                      ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">{item.label}</p>
                          <p className="mt-2 text-sm font-bold text-white break-words">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {selectedSubmission.review_note ? (
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">Review note</p>
                        <p className="mt-2 text-sm leading-7 text-[#d4dbe7]">{selectedSubmission.review_note}</p>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">Review note</p>
                        <p className="mt-2 text-sm leading-7 text-[#aab5c6]">No review note yet.</p>
                      </div>
                    )}

                    {selectedSubmission.source_type === 'india_pre_selection' && selectedIndiaApplication ? (
                      <div className="space-y-3 rounded-2xl border border-[#ffc400]/30 bg-[#ffc400]/5 p-4">
                        <p className="text-sm font-black text-[#ffc400]">Review controls</p>
                        <label className="block">
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#98a4b1]">Status</span>
                          <select className={selectClass} value={indiaApplicationReview.status} onChange={(event) => setIndiaApplicationReview((state) => ({ ...state, status: event.target.value }))}>
                            <option value="pending">pending</option>
                            <option value="reviewing">reviewing</option>
                            <option value="shortlisted">shortlisted</option>
                            <option value="selected">selected (legacy)</option>
                            <option value="approved">approved</option>
                            <option value="rejected">rejected</option>
                            <option value="withdrawn">withdrawn</option>
                          </select>
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#98a4b1]">Review note</span>
                          <textarea className={`${inputClass} min-h-24`} value={indiaApplicationReview.review_note} onChange={(event) => setIndiaApplicationReview((state) => ({ ...state, review_note: event.target.value }))} placeholder="Required when rejecting" />
                        </label>
                        <button type="button" onClick={reviewIndiaApplication} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]"><CheckCircle2 className="h-4 w-4" /> Save review</button>
                      </div>
                    ) : selectedSubmission.source_type === 'content_upload' ? (
                      <div className="space-y-3 rounded-2xl border border-[#ffc400]/30 bg-[#ffc400]/5 p-4">
                        <p className="text-sm font-black text-[#ffc400]">Review controls</p>
                        <label className="block">
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#98a4b1]">Points reward</span>
                          <input className={inputClass} type="number" min="0" value={uploadReview.points_reward} onChange={(event) => setUploadReview((state) => ({ ...state, points_reward: Number(event.target.value) }))} />
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#98a4b1]">Review note</span>
                          <textarea className={`${inputClass} min-h-24`} value={uploadReview.review_note} onChange={(event) => setUploadReview((state) => ({ ...state, review_note: event.target.value }))} placeholder="Required when rejecting" />
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => reviewUpload('approved')} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]"><CheckCircle2 className="h-4 w-4" /> Approve</button>
                          <button type="button" onClick={() => reviewUpload('rejected')} className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-3 text-sm font-black text-red-300"><Trash2 className="h-4 w-4" /> Reject</button>
                        </div>
                      </div>
                    ) : selectedSubmission.source_type === 'event_rsvp' || selectedSubmission.source_type === 'learning_course' ? (
                      <div className="space-y-3 rounded-2xl border border-[#ffc400]/30 bg-[#ffc400]/5 p-4">
                        <p className="text-sm font-black text-[#ffc400]">Review controls</p>
                        <p className="text-xs leading-5 text-[#aab5c6]">Approve keeps this record active. Reject marks it cancelled.</p>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => reviewGenericSubmission(selectedSubmission, 'approved')} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]"><CheckCircle2 className="h-4 w-4" /> Approve</button>
                          <button type="button" onClick={() => reviewGenericSubmission(selectedSubmission, 'rejected')} className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-3 text-sm font-black text-red-300"><Trash2 className="h-4 w-4" /> Reject</button>
                        </div>
                      </div>
                    ) : null}

                    <div className="rounded-2xl border border-[#ffc400]/20 bg-[#ffc400]/5 p-4">
                      <p className="text-sm font-black text-[#ffc400]">Priority review</p>
                      <p className="mt-2 text-sm leading-7 text-[#d4dbe7]">
                        India Pre-Selection submissions stay highlighted at the top of the queue, but every source now opens in the same readable popup.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </>
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

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(360px,420px)]">
          <SectionShell
            title="K-Food product manager"
            description="Click any product to edit it, review live stock status, or create a new item from the sticky editor."
            actions={<span className="text-sm font-bold text-[#ffc400]">{filteredKFoodProducts.length} products</span>}
          >
            <div className="space-y-3">
              {filteredKFoodProducts.map((product) => {
                const isSelected = product.slug === selectedKFoodProductSlug;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => selectKFoodProduct(product)}
                    className={`w-full rounded-3xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-[#ffc400]/70 bg-[#ffc400]/10 shadow-[0_0_0_1px_rgba(255,196,0,0.24)]'
                        : 'border-white/10 bg-black/20 hover:border-[#ffc400]/30 hover:bg-black/25'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                        {product.image ? <img src={product.image} alt={product.title.en} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs font-black text-[#98a4b1]">No image</div>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ffc400]">{product.category.en}</p>
                              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#d4dbe7]">{product.sku || product.slug}</span>
                            </div>
                            <h3 className="mt-2 text-lg font-black text-white">{product.title.en}</h3>
                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#aab5c6]">{product.subtitle.en}</p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${
                              product.inStock ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border border-red-500/30 bg-red-500/10 text-red-300'
                            }`}
                          >
                            {product.inStock ? 'In stock' : 'Out of stock'}
                          </span>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#d4dbe7]">Rs {Number(product.price || 0).toFixed(0)}</span>
                          <span className="rounded-full border border-[#ffc400]/25 bg-[#ffc400]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#ffc400]">{product.rewardPoints} points</span>
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#d4dbe7]">{product.stockLabel.en}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
              {!filteredKFoodProducts.length ? (
                <div className="rounded-3xl border border-dashed border-white/15 bg-black/20 p-6 text-sm text-[#aab5c6]">
                  No K-Food products found. Add one from the editor or import WooCommerce links below.
                </div>
              ) : null}
            </div>
          </SectionShell>

          <div className="space-y-5 xl:sticky xl:top-6 self-start">
            <SectionShell
              title={selectedKFoodProductSlug ? 'Edit product' : 'Create product'}
              description="Update product fields, pricing, labels, badges and listing state."
              actions={
                <div className="flex items-center gap-3">
                  {selectedKFoodProduct ? <span className="text-sm font-bold text-[#ffc400]">{selectedKFoodProduct.slug}</span> : null}
                  {selectedKFoodProductSlug ? (
                    <button type="button" onClick={resetKFoodProductForm} className="text-sm font-bold text-[#ffc400]">
                      Reset
                    </button>
                  ) : null}
                </div>
              }
            >
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Slug">
                    <input className={inputClass} value={kfoodProductForm.slug} onChange={(event) => setKFoodProductForm((state) => ({ ...state, slug: event.target.value }))} />
                  </Field>
                  <Field label="SKU">
                    <input className={inputClass} value={kfoodProductForm.sku} onChange={(event) => setKFoodProductForm((state) => ({ ...state, sku: event.target.value }))} />
                  </Field>
                </div>

                <Field label="Title">
                  <div className="grid gap-2 sm:grid-cols-3">
                    <input className={inputClass} placeholder="English" value={kfoodProductForm.title_en} onChange={(event) => setKFoodProductForm((state) => ({ ...state, title_en: event.target.value }))} />
                    <input className={inputClass} placeholder="Korean" value={kfoodProductForm.title_ko} onChange={(event) => setKFoodProductForm((state) => ({ ...state, title_ko: event.target.value }))} />
                    <input className={inputClass} placeholder="Hindi" value={kfoodProductForm.title_hi} onChange={(event) => setKFoodProductForm((state) => ({ ...state, title_hi: event.target.value }))} />
                  </div>
                </Field>

                <Field label="Subtitle">
                  <div className="grid gap-2 sm:grid-cols-3">
                    <input className={inputClass} placeholder="English" value={kfoodProductForm.subtitle_en} onChange={(event) => setKFoodProductForm((state) => ({ ...state, subtitle_en: event.target.value }))} />
                    <input className={inputClass} placeholder="Korean" value={kfoodProductForm.subtitle_ko} onChange={(event) => setKFoodProductForm((state) => ({ ...state, subtitle_ko: event.target.value }))} />
                    <input className={inputClass} placeholder="Hindi" value={kfoodProductForm.subtitle_hi} onChange={(event) => setKFoodProductForm((state) => ({ ...state, subtitle_hi: event.target.value }))} />
                  </div>
                </Field>

                <Field label="Description">
                  <div className="grid gap-2 sm:grid-cols-3">
                    <textarea className={`${inputClass} min-h-24`} placeholder="English" value={kfoodProductForm.description_en} onChange={(event) => setKFoodProductForm((state) => ({ ...state, description_en: event.target.value }))} />
                    <textarea className={`${inputClass} min-h-24`} placeholder="Korean" value={kfoodProductForm.description_ko} onChange={(event) => setKFoodProductForm((state) => ({ ...state, description_ko: event.target.value }))} />
                    <textarea className={`${inputClass} min-h-24`} placeholder="Hindi" value={kfoodProductForm.description_hi} onChange={(event) => setKFoodProductForm((state) => ({ ...state, description_hi: event.target.value }))} />
                  </div>
                </Field>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Category key">
                    <input className={inputClass} value={kfoodProductForm.categoryKey} onChange={(event) => setKFoodProductForm((state) => ({ ...state, categoryKey: event.target.value }))} />
                  </Field>
                  <Field label="Image URL">
                    <input className={inputClass} value={kfoodProductForm.image} onChange={(event) => setKFoodProductForm((state) => ({ ...state, image: event.target.value }))} />
                  </Field>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Price">
                    <input className={inputClass} type="number" value={kfoodProductForm.price} onChange={(event) => setKFoodProductForm((state) => ({ ...state, price: event.target.value }))} />
                  </Field>
                  <Field label="Compare at">
                    <input className={inputClass} type="number" value={kfoodProductForm.compareAtPrice} onChange={(event) => setKFoodProductForm((state) => ({ ...state, compareAtPrice: event.target.value }))} />
                  </Field>
                  <Field label="Reward points">
                    <input className={inputClass} type="number" value={kfoodProductForm.rewardPoints} onChange={(event) => setKFoodProductForm((state) => ({ ...state, rewardPoints: event.target.value }))} />
                  </Field>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Stock label">
                    <input className={inputClass} value={kfoodProductForm.stockLabel_en} onChange={(event) => setKFoodProductForm((state) => ({ ...state, stockLabel_en: event.target.value }))} />
                  </Field>
                  <Field label="Stock label ko">
                    <input className={inputClass} value={kfoodProductForm.stockLabel_ko} onChange={(event) => setKFoodProductForm((state) => ({ ...state, stockLabel_ko: event.target.value }))} />
                  </Field>
                  <Field label="Stock label hi">
                    <input className={inputClass} value={kfoodProductForm.stockLabel_hi} onChange={(event) => setKFoodProductForm((state) => ({ ...state, stockLabel_hi: event.target.value }))} />
                  </Field>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Badges JSON">
                    <textarea className={`${inputClass} min-h-24`} value={kfoodProductForm.badges_json} onChange={(event) => setKFoodProductForm((state) => ({ ...state, badges_json: event.target.value }))} />
                  </Field>
                  <Field label="Includes JSON">
                    <textarea className={`${inputClass} min-h-24`} value={kfoodProductForm.includes_json} onChange={(event) => setKFoodProductForm((state) => ({ ...state, includes_json: event.target.value }))} />
                  </Field>
                </div>

                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[#d4dbe7]">
                  <input type="checkbox" checked={kfoodProductForm.inStock} onChange={(event) => setKFoodProductForm((state) => ({ ...state, inStock: event.target.checked }))} />
                  Active stock / visible on live shop
                </label>

                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={saveKFoodProduct} className="inline-flex items-center gap-2 rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
                    <Save className="h-4 w-4" />
                    {selectedKFoodProduct ? 'Save product' : 'Create product'}
                  </button>
                  {selectedKFoodProduct ? (
                    <button type="button" onClick={deleteKFoodProduct} className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-3 text-sm font-black text-red-300">
                      <Trash2 className="h-4 w-4" />
                      Delete product
                    </button>
                  ) : null}
                </div>
              </div>
            </SectionShell>

            <SectionShell
              title="WooCommerce import"
              description="Paste k-food.in product category or page URLs and sync them into the product catalog."
              actions={
                <button type="button" onClick={syncKFoodProducts} className="inline-flex items-center gap-2 text-sm font-bold text-[#ffc400]">
                  <ExternalLink className="h-4 w-4" />
                  Sync now
                </button>
              }
            >
              <div className="space-y-3">
                <textarea
                  className={`${inputClass} min-h-40`}
                  placeholder="https://k-food.in/shop/\nhttps://k-food.in/shop/page/2/\nhttps://k-food.in/shop/page/3/"
                  value={kfoodImportUrls}
                  onChange={(event) => setKFoodImportUrls(event.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  {[
                    'https://k-food.in/shop/',
                    'https://k-food.in/shop/page/2/',
                    'https://k-food.in/shop/page/3/',
                    'https://k-food.in/shop/page/4/',
                    'https://k-food.in/shop/page/5/',
                  ].map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setKFoodImportUrls((current) => (current.includes(url) ? current : `${current}${current ? '\n' : ''}${url}`))}
                      className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#d4dbe7]"
                    >
                      + Add page {url.match(/page\/(\d+)/)?.[1] || '1'}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={syncKFoodProducts} className="inline-flex items-center gap-2 rounded-xl border border-[#ffc400]/40 bg-[#ffc400]/10 px-4 py-3 text-sm font-black text-[#ffc400]">
                  <ExternalLink className="h-4 w-4" />
                  Import and sync products
                </button>
              </div>
            </SectionShell>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
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

          <div className="space-y-5 self-start xl:sticky xl:top-6">
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
                      <p>Commission: Rs {Number(order.commission_amount || 0).toFixed(2)} @ {order.commission_rate}%</p>
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
                      <p className="mt-2 text-sm text-[#aab5c6]">Revenue Rs {Number(row.total_amount || 0).toFixed(2)}</p>
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
                    <p className="mt-2 text-sm text-[#aab5c6]">Revenue Rs {Number(row.total_amount || 0).toFixed(2)}</p>
                    <p className="mt-1 text-sm text-[#aab5c6]">Commission Rs {Number(row.commission_amount || 0).toFixed(2)}</p>
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
                    <p className="mt-2 text-sm text-[#aab5c6]">Revenue Rs {Number(row.total_amount || 0).toFixed(2)}</p>
                    <p className="mt-1 text-sm text-[#aab5c6]">Commission Rs {Number(row.commission_amount || 0).toFixed(2)}</p>
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
          <PaginatedList items={filteredEvents}>
            {(visibleEvents) => visibleEvents.map((entry) => (
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
          </PaginatedList>
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
          <PaginatedList items={filteredRewards}>
            {(visibleRewards) => visibleRewards.map((entry) => (
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
          </PaginatedList>
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
          <PaginatedList items={filteredAnnouncements}>
            {(visibleAnnouncements) => visibleAnnouncements.map((entry) => (
            <article key={entry.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-black">{entry.title}</h3>
                <span className="text-xs font-black text-[#ffc400]">{entry.status}</span>
              </div>
              <p className="mt-2 text-sm text-[#aab5c6]">{entry.body}</p>
              <p className="mt-3 text-xs text-[#98a4b1]">{entry.creator_name || entry.creator_email || 'System'} · {new Date(entry.created_at).toLocaleString()}</p>
            </article>
            ))}
          </PaginatedList>
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
          <PaginatedList items={calendarConnections}>
            {(visibleConnections) => visibleConnections.map((entry) => (
            <article key={entry.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-black">{entry.calendar_name || entry.calendar_id}</h3>
                <span className="text-xs font-black text-[#ffc400]">{entry.status}</span>
              </div>
              <p className="mt-2 text-sm text-[#aab5c6]">{entry.provider} · {entry.sync_mode} · {entry.calendar_id}</p>
            </article>
            ))}
          </PaginatedList>
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

  const renderAnalytics = () => {
    const executiveMetrics = [
      { label: 'Active users', value: analytics.activeUsers ?? 0, note: 'Accounts active in the current window' },
      { label: 'Sessions 24h', value: analytics.sessionsLast24h ?? 0, note: 'Recent site and admin activity' },
      { label: 'Active lessons', value: analytics.activeLessons ?? 0, note: 'Learning surfaces currently published' },
      { label: 'Active rewards', value: analytics.activeRewards ?? 0, note: 'Reward catalog items available now' },
    ];

    const moduleHealth = [
      { label: 'Users', value: dashboardMetrics.totalUsers ?? users.length, detail: 'Identity and access roster' },
      { label: 'Points', value: dashboardMetrics.totalPoints ?? 0, detail: 'Ledger-backed balance total' },
      { label: 'XP', value: dashboardMetrics.totalXp ?? 0, detail: 'Progress and engagement score' },
      { label: 'Published pages', value: pages.filter((page) => page.status === 'published').length, detail: 'Live CMS inventory' },
      { label: 'Submissions', value: submissions.length, detail: 'Unified inbox rows' },
      { label: 'India queue', value: indiaApplications.length, detail: 'Highlighted festival applications' },
      { label: 'K-Food claims', value: claims.length, detail: 'Purchase claims and fulfillment state' },
      { label: 'Events', value: events.length, detail: 'Scheduled platform events' },
    ];

    const pulseItems = filteredRecentActions.slice(0, 5);

    return (
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {executiveMetrics.map((item) => (
            <article key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#98a4b1]">{item.label}</p>
              <p className="mt-2 text-3xl font-black text-white">{item.value}</p>
              <p className="mt-2 text-sm leading-6 text-[#aab5c6]">{item.note}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)]">
          <SectionShell
            title="Live operational snapshot"
            description="A clean executive read on the major surfaces that drive the admin console."
            actions={<span className="text-sm font-bold text-[#ffc400]">Live data</span>}
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {moduleHealth.map((item) => (
                <article key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">{item.label}</p>
                  <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-[#aab5c6]">{item.detail}</p>
                </article>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#98a4b1]">Module focus</p>
                  <p className="mt-2 text-sm leading-6 text-[#aab5c6]">
                    Use this area as a quick operational map before jumping into detailed sections.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Submissions', value: submissions.length },
                    { label: 'India', value: indiaApplications.length },
                    { label: 'K-Food', value: claims.length },
                    { label: 'CMS', value: pages.length },
                  ].map((item) => (
                    <span
                      key={item.label}
                      className="rounded-full border border-[#ffc400]/25 bg-[#ffc400]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#ffc400]"
                    >
                      {item.label} {item.value}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                <div className="grid grid-cols-2 border-b border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#98a4b1] sm:grid-cols-[1.4fr_0.8fr_0.8fr]">
                  <span>Surface</span>
                  <span>Count</span>
                  <span>Status</span>
                </div>
                {[
                  { label: 'Users', count: users.length, status: 'Connected' },
                  { label: 'Submissions', count: submissions.length, status: submissions.length ? 'Flowing' : 'Idle' },
                  { label: 'India Pre-Selection', count: indiaApplications.length, status: indiaApplications.length ? 'Priority' : 'Waiting' },
                  { label: 'K-Food', count: claims.length, status: claims.length ? 'Active' : 'Waiting' },
                  { label: 'Announcements', count: announcements.length, status: announcements.length ? 'Publishing' : 'Idle' },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className={`grid grid-cols-2 px-4 py-3 text-sm sm:grid-cols-[1.4fr_0.8fr_0.8fr] ${index !== 4 ? 'border-b border-white/10' : ''}`}
                  >
                    <span className="font-bold text-white">{item.label}</span>
                    <span className="text-[#d4dbe7]">{item.count}</span>
                    <span className={`font-black uppercase tracking-[0.16em] ${item.status === 'Priority' ? 'text-[#ffc400]' : 'text-[#aab5c6]'}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionShell>

          <SectionShell
            title="Activity pulse"
            description="The latest admin activity and moderation history, presented as a compact feed."
            actions={<span className="text-sm font-bold text-[#ffc400]">{pulseItems.length} records</span>}
          >
            <div className="space-y-3">
              {pulseItems.length ? (
                pulseItems.map((entry) => (
                  <article key={entry.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffc400]">{entry.action.replace(/_/g, ' ')}</p>
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
        </div>

        <SectionShell
          title="Executive guidance"
          description="The panel is now arranged around the busiest workflows so reviewers and operators can work faster."
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Review first', value: 'Submissions and India Pre-Selection stay highlighted in the queue.' },
              { label: 'Operate clearly', value: 'K-Food now exposes products, fulfillments, orders, payment and reports.' },
              { label: 'Manage safely', value: 'Admin profile, password and extra admin accounts are first-class controls.' },
              { label: 'Ship faster', value: 'Announcements, events, CMS and calendar tools are kept in dedicated workspaces.' },
            ].map((item) => (
              <article key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ffc400]">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-[#d4dbe7]">{item.value}</p>
              </article>
            ))}
          </div>
        </SectionShell>
      </div>
    );
  };

  const sectionBody = () => {
    switch (activeSection) {
      case 'sendEmail':
        return renderSendEmail();
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
    <main className="admin-control-center min-h-screen overflow-x-hidden bg-[#070708] text-white">
      <div className="flex min-h-screen flex-col">
        <header className="fixed inset-x-0 top-0 z-40 flex h-[64px] items-center border-b border-[#2c3338] bg-[#1d2327] px-4">
          <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffb900] text-lg font-black text-[#111111]">
                K
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.42em] text-[#ffb900]">Admin Panel</p>
                <h1 className="truncate text-lg font-black leading-tight text-[#f0f0f1]">K-CUBE control center</h1>
                <p className="mt-0.5 text-xs text-[#b4b9be]">Compact workspace for content, users, rewards, events, and commerce.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-1 rounded-full border border-[#3c434a] bg-[#23282d] px-1 py-1 text-[11px] font-bold text-[#b4b9be] md:flex">
                <button type="button" className="rounded-full px-3 py-1 transition hover:bg-[#2c3338] hover:text-[#f0f0f1]">
                  Screen Options
                </button>
                <button type="button" className="rounded-full px-3 py-1 transition hover:bg-[#2c3338] hover:text-[#f0f0f1]">
                  Help
                </button>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('announcements')}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#3c434a] bg-[#2c3338] text-[#f0f0f1] transition hover:bg-[#32373c] hover:text-white"
                aria-label="Notifications"
              >
                <span className="relative inline-flex">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-[#1d2327] bg-[#ffb900]" />
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('overview')}
                className="hidden rounded-full border border-[#3c434a] bg-[#2c3338] px-4 py-2 text-sm font-bold text-[#f0f0f1] transition hover:bg-[#32373c] md:inline-flex"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('adminProfile')}
                className="inline-flex items-center gap-3 rounded-lg border border-[#3c434a] bg-[#2c3338] px-3 py-2 text-left transition hover:bg-[#32373c]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffb900] text-xs font-black text-[#111111]">
                  {adminInitials || 'KA'}
                </span>
                <span className="hidden min-w-0 flex-col text-left sm:flex">
                  <span className="truncate text-sm font-black text-[#f0f0f1]">{user?.fullName || 'K-CUBE Admin'}</span>
                  <span className="text-[11px] uppercase tracking-[0.22em] text-[#b4b9be]">Administrator</span>
                </span>
              </button>
              <Link href="/" className="hidden items-center gap-2 rounded-full bg-[#ffb900] px-4 py-2 text-sm font-black text-[#111111] transition hover:brightness-110 lg:inline-flex">
                <ExternalLink className="h-4 w-4" />
                Open site
              </Link>
            </div>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 overflow-x-hidden pt-[64px] lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside
            className={`border-b border-[#2c3338] bg-[#1d2327] lg:fixed lg:left-0 lg:top-[64px] lg:z-30 lg:block lg:h-[calc(100vh-64px)] lg:w-[220px] lg:border-b-0 lg:border-r lg:overflow-hidden ${
              sidebarOpen ? 'w-full' : 'w-full'
            }`}
          >
            <div className="flex h-full min-h-0 flex-col">
              <div className="admin-scrollbar flex-1 overflow-y-auto px-1 py-1.5">
                <div className="space-y-1.5">
                  {adminSidebarGroups.map((group) => (
                    <div key={group.title} className="space-y-1">
                      <p className="sr-only">{group.title}</p>
                      <div className="space-y-1">
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
                              title={item.label}
                              className={`flex w-full items-center rounded-lg border px-2 py-1.5 text-left transition ${
                                sidebarOpen ? 'gap-3' : 'justify-center'
                              } ${
                                active
                                  ? 'border-[#2271b1] border-l-4 border-l-[#2271b1] bg-[#2c3338] text-white shadow-[inset_0_0_0_1px_rgba(255,185,0,0.15)]'
                                  : 'border-[#2c3338] bg-[#1d2327] text-[#f0f0f1] hover:border-[#3c434a] hover:bg-[#23282d]'
                              }`}
                            >
                              <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-[#ffb900] text-[#111111]' : 'bg-[#2c3338] text-[#b4b9be]'}`}>
                                <Icon className="h-4 w-4" />
                              </span>
                              <div className={`admin-nav-copy min-w-0 ${sidebarOpen ? '' : 'lg:hidden'}`}>
                                <p className="text-sm font-black">{item.label}</p>
                                <p className="mt-0.5 text-[11px] leading-4 text-[#b4b9be]">{item.description}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#2c3338] p-3">
                <Link
                  href="/admin/login"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-[#2c3338] bg-[#23282d] px-3 py-2.5 text-sm font-black text-[#f0f0f1] transition hover:border-[#2271b1] hover:bg-[#2c3338]"
                >
                  Switch admin
                </Link>
              </div>
            </div>
          </aside>

          <div className="min-w-0 px-5 py-6 lg:col-start-2 lg:px-8 lg:py-8">
            <div className="mx-auto min-w-0 max-w-[1600px] space-y-4">
            <section className="admin-hero-panel min-w-0 rounded-xl border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,196,0,0.18),_transparent_34%),linear-gradient(180deg,_rgba(17,17,19,0.96),_rgba(10,10,12,0.98))] p-4">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.26em] text-[#ffc400]">Admin Dashboard</p>
                  <h2 className="mt-1 text-2xl font-black">Full website control, all in one place.</h2>
                  <p className="mt-1 max-w-none text-sm leading-5 text-[#aab5c6] lg:whitespace-nowrap">
                    Edit pages, learning content, users, points, rewards, events, announcements and integrations from a single admin workspace.
                  </p>
                  {notice ? <p className="mt-4 text-sm font-bold text-[#ffcf86]">{notice}</p> : null}
                </div>
                <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
                  <div className="min-w-[220px] flex-1">
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
      {reviewSuccess ? (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm" role="alertdialog" aria-modal="true">
          <div className="w-full max-w-md rounded-3xl border border-emerald-400/30 bg-[#101014] p-6 text-white shadow-2xl">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"><CheckCircle2 className="h-5 w-5" /></span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">Review submitted</p>
                <h3 className="mt-2 text-xl font-black">Action saved successfully</h3>
                <p className="mt-2 text-sm leading-6 text-[#aab5c6]">{reviewSuccess}</p>
              </div>
            </div>
            <button type="button" onClick={closeReviewSuccess} className="mt-5 w-full rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">Continue</button>
          </div>
        </div>
      ) : null}
      {emailSuccess ? (
        <div className="fixed inset-0 z-[145] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm" role="alertdialog" aria-modal="true">
          <div className="w-full max-w-md rounded-3xl border border-emerald-400/30 bg-[#101014] p-6 text-white shadow-2xl">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"><CheckCircle2 className="h-5 w-5" /></span>
              <div><p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">Email sent</p><h3 className="mt-2 text-xl font-black">Message delivered successfully</h3><p className="mt-2 text-sm leading-6 text-[#aab5c6]">{emailSuccess}</p></div>
            </div>
            <button type="button" onClick={closeEmailSuccess} className="mt-5 w-full rounded-xl bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">Continue</button>
          </div>
        </div>
      ) : null}
      </div>
    </main>
  );
};

export default AdminControlCenter;
