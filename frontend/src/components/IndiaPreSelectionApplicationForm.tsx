"use client";

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck, Sparkles, X } from 'lucide-react';
import api from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';

type ApplicationFormState = {
  full_name: string;
  email: string;
  phone: string;
  nationality: string;
  current_city: string;
  date_of_birth: string;
  performance_category: string;
  biography: string;
  video_link: string;
  message: string;
};

type IndiaPreSelectionApplicationFormProps = {
  compact?: boolean;
};

type SavedApplication = ApplicationFormState & {
  id?: number | null;
  status?: string | null;
  points_awarded?: number | null;
  submitted_at?: string | null;
  updated_at?: string | null;
  review_note?: string | null;
  reviewed_by_name?: string | null;
  reviewed_by_email?: string | null;
  reviewed_at?: string | null;
};

const emptyForm = (profile?: { fullName?: string; email?: string; phone?: string }): ApplicationFormState => ({
  full_name: profile?.fullName || '',
  email: profile?.email || '',
  phone: profile?.phone || '',
  nationality: 'India',
  current_city: '',
  date_of_birth: '',
  performance_category: '',
  biography: '',
  video_link: '',
  message: '',
});

const categoryOptions = [
  'Singer',
  'Musical artist',
  'Dancer',
  'Group performance',
  'Instrumentalist',
  'Other',
];

const isValidVideoLink = (value: string) => {
  const text = value.trim();
  if (!text) return false;
  const candidate = /^https?:\/\//i.test(text) ? text : `https://${text}`;
  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol)) return false;
    if (!url.hostname) return false;
    return true;
  } catch {
    return false;
  }
};

const normalizeVideoLink = (value: string) => {
  const text = value.trim();
  if (!text) return '';
  return /^https?:\/\//i.test(text) ? text : `https://${text}`;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleString();
};

const IndiaPreSelectionApplicationForm = ({ compact = false }: IndiaPreSelectionApplicationFormProps) => {
  const user = useAppStore((state) => state.user);
  const awardPoints = useAppStore((state) => state.awardPoints);
  const [form, setForm] = useState<ApplicationFormState>(() => emptyForm(user || undefined));
  const [submittedApplication, setSubmittedApplication] = useState<SavedApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewedBy, setReviewedBy] = useState('');
  const [reviewedAt, setReviewedAt] = useState('');
  const [successVisible, setSuccessVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setForm(emptyForm(user || undefined));
    }, 0);

    return () => window.clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    let alive = true;

    const loadApplication = async () => {
      if (!user) {
        if (alive) setLoading(false);
        return;
      }

      try {
        const response = await api.get('/india-pre-selection/applications/me');
        const application = response.data?.data?.application ?? response.data?.application ?? null;
        if (!alive || !application) {
          if (alive) setLoading(false);
          return;
        }

        const nextApplication: SavedApplication = {
          id: application.id ?? null,
          full_name: application.full_name || user.fullName || '',
          email: application.email || user.email || '',
          phone: application.phone || user.phone || '',
          nationality: application.nationality || 'India',
          current_city: application.current_city || '',
          date_of_birth: application.date_of_birth ? String(application.date_of_birth).slice(0, 10) : '',
          performance_category: application.performance_category || '',
          biography: application.biography || '',
          video_link: application.video_link || '',
          message: application.message || '',
          status: application.status || 'submitted',
          points_awarded: Number(application.points_awarded || 0),
          submitted_at: application.submitted_at || null,
          updated_at: application.updated_at || null,
          review_note: application.review_note || '',
          reviewed_by_name: application.reviewed_by_name || '',
          reviewed_by_email: application.reviewed_by_email || '',
          reviewed_at: application.reviewed_at || '',
        };

        setSubmittedApplication(nextApplication);
        setForm({
          full_name: application.full_name || user.fullName || '',
          email: application.email || user.email || '',
          phone: application.phone || user.phone || '',
          nationality: application.nationality || 'India',
          current_city: application.current_city || '',
          date_of_birth: application.date_of_birth ? String(application.date_of_birth).slice(0, 10) : '',
          performance_category: application.performance_category || '',
          biography: application.biography || '',
          video_link: application.video_link || '',
          message: application.message || '',
        });
        setStatus(application.status || 'submitted');
        setReviewNote(application.review_note || '');
        setReviewedBy(application.reviewed_by_name || application.reviewed_by_email || '');
        setReviewedAt(application.reviewed_at ? new Date(application.reviewed_at).toLocaleString() : '');
      } catch (requestError: unknown) {
        const error = requestError as {
          response?: {
            status?: number;
            data?: { error?: { message?: string } };
          };
        };
        const code = error.response?.status;
        if (code !== 404 && code !== 401) {
          setError(error.response?.data?.error?.message || 'Could not load your saved application.');
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadApplication();
    return () => {
      alive = false;
    };
  }, [user]);

  const updateField = (key: keyof ApplicationFormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!user) {
      setError('Please sign in first to submit your application inside K-CUBE.');
      return;
    }

    if (!isValidVideoLink(form.video_link)) {
      setError('Please enter a valid YouTube, Google Drive, or public video URL.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        video_link: normalizeVideoLink(form.video_link),
      };
      const response = await api.post('/india-pre-selection/applications', payload);
      const data = response.data?.data ?? response.data ?? {};
      const application = data.application ?? null;
      const awarded = Number(data.points_awarded || 0);

      if (awarded > 0) {
        awardPoints('india-pre-selection-application', awarded);
      }

      setStatus(application?.status || 'submitted');
      setReviewNote(application?.review_note || '');
      setReviewedBy(application?.reviewed_by_name || application?.reviewed_by_email || '');
      setReviewedAt(application?.reviewed_at ? new Date(application.reviewed_at).toLocaleString() : '');
      const nextApplication: SavedApplication = {
        id: application?.id ?? null,
        full_name: application?.full_name || payload.full_name,
        email: application?.email || payload.email,
        phone: application?.phone ?? payload.phone,
        nationality: application?.nationality ?? payload.nationality,
        current_city: application?.current_city ?? payload.current_city,
        date_of_birth: application?.date_of_birth ? String(application.date_of_birth).slice(0, 10) : payload.date_of_birth,
        performance_category: application?.performance_category || payload.performance_category,
        biography: application?.biography ?? payload.biography,
        video_link: application?.video_link || payload.video_link,
        message: application?.message ?? payload.message,
        status: application?.status || 'submitted',
        points_awarded: Number(application?.points_awarded || awarded || 0),
        submitted_at: application?.submitted_at || new Date().toISOString(),
        updated_at: application?.updated_at || new Date().toISOString(),
        review_note: application?.review_note || '',
        reviewed_by_name: application?.reviewed_by_name || '',
        reviewed_by_email: application?.reviewed_by_email || '',
        reviewed_at: application?.reviewed_at || '',
      };

      setSubmittedApplication(nextApplication);
      setMessage(
        awarded > 0
          ? `Application saved inside K-CUBE and ${awarded} points added.`
          : 'Application submitted inside K-CUBE.',
      );
      setSuccessVisible(true);
    } catch (requestError: unknown) {
      const error = requestError as {
        response?: { data?: { error?: { message?: string } } };
      };
      setError(error.response?.data?.error?.message || 'Could not submit your application right now.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className={`${compact ? '' : 'mt-8'} rounded-[28px] border border-[#f3a847]/30 bg-[#fff8df] p-6 shadow-sm`}>
        <p className="inline-flex items-center gap-2 rounded-sm border border-[#f3a847]/30 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#b12704]">
          <ShieldCheck className="h-4 w-4" />
          Internal application
        </p>
        <h2 className="mt-4 text-2xl font-black text-[#111827]">Sign in to apply inside K-CUBE</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#565959]">
          Your application is saved directly inside the platform. Once you are signed in, you can submit the form, keep your record in one place, and earn the application points automatically.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signin?returnTo=/india-pre-selection/apply"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00]"
          >
            Sign in to apply
          </Link>
          <Link
            href="/signup?returnTo=/india-pre-selection/apply"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#d5d9d9] bg-white px-5 py-3 text-sm font-bold text-[#111827] transition hover:border-[#f3a847] hover:text-[#b12704]"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  if (!loading && submittedApplication) {
    return (
      <div className={`${compact ? '' : 'mt-8'} rounded-[28px] border border-[#d5d9d9] bg-[#0b1220] p-5 text-white shadow-sm sm:p-6 lg:p-8`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-sm border border-[#f3a847]/30 bg-[#f3a847]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#f3a847]">
              <CheckCircle2 className="h-4 w-4" />
              Submission received
            </p>
            <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">Your application is already saved</h2>
            <p className="mt-3 text-sm leading-7 text-[#d5d9d9]">
              We have stored your India pre-selection submission inside your K-CUBE account. You do not need to submit the same form again.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[#f3a847]/40 bg-[#fff8df] px-3 py-1 text-xs font-black text-[#111827]">
              {submittedApplication.status || 'submitted'}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-white">
              Saved to account
            </span>
          </div>
        </div>

        {message ? (
          <div className="mt-5 rounded-[22px] border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-100">
            {message}
          </div>
        ) : null}

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f3a847]">Submitted by</p>
            <p className="mt-2 text-sm font-bold text-white">{submittedApplication.full_name}</p>
            <p className="mt-1 text-sm text-[#d5d9d9]">{submittedApplication.email}</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f3a847]">Performance category</p>
            <p className="mt-2 text-sm font-bold text-white">{submittedApplication.performance_category}</p>
            <p className="mt-1 text-sm text-[#d5d9d9]">{submittedApplication.current_city || 'Current city not added'}</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f3a847]">Submitted at</p>
            <p className="mt-2 text-sm font-bold text-white">{formatDateTime(submittedApplication.submitted_at) || 'Just now'}</p>
            <p className="mt-1 text-sm text-[#d5d9d9]">The application is now locked to your account.</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f3a847]">Video link</p>
            <a
              href={submittedApplication.video_link}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-white underline decoration-white/40 underline-offset-4 transition hover:text-[#ffd814]"
            >
              Open submitted video link
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f3a847]">Next step</p>
            <p className="mt-2 text-sm leading-7 text-[#d5d9d9]">
              Keep checking Announcement for live updates. If the review team adds feedback, it will appear in your account.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f3a847]">Review note</p>
            <p className="mt-2 text-sm leading-7 text-[#d5d9d9]">
              {reviewNote || 'Your submission is waiting for admin review.'}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/india-pre-selection/announcement"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00]"
          >
            Check announcement
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:border-[#ffd814] hover:text-[#ffd814]"
          >
            Back to home
          </Link>
        </div>

        {successVisible ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-[#0b1220] p-5 text-white shadow-2xl sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-sm border border-[#f3a847]/30 bg-[#f3a847]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#f3a847]">
                    <CheckCircle2 className="h-4 w-4" />
                    Submission successful
                  </p>
                  <h3 className="mt-4 text-2xl font-black text-white">Application saved successfully</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSuccessVisible(false)}
                  className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-white transition hover:bg-white/[0.08]"
                  aria-label="Close success message"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#d5d9d9]">
                Your application is now stored in K-CUBE and linked to your account. The same form will not appear again for this account.
              </p>
              <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f3a847]">What happens next</p>
                <p className="mt-2 text-sm leading-7 text-[#d5d9d9]">
                  We will keep the data in your account, and if Google Sheets sync is enabled on the backend, the same submission will also be pushed into the team spreadsheet.
                </p>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setSuccessVisible(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00]"
                >
                  Continue
                </button>
                <Link
                  href="/india-pre-selection/announcement"
                  className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:border-[#ffd814] hover:text-[#ffd814]"
                >
                  View announcement
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div id="application" className={`${compact ? '' : 'mt-8'} rounded-[28px] border border-[#d5d9d9] bg-white p-5 shadow-sm sm:p-6 lg:p-8`}>
      {compact ? null : (
        <>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">Application form</p>
              <h2 className="mt-2 text-2xl font-black text-[#111827] sm:text-3xl">Apply inside K-CUBE</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#fff2c2] px-3 py-1 text-xs font-black text-[#111827]">+200 points</span>
              <span className="rounded-full bg-[#f7fafa] px-3 py-1 text-xs font-black text-[#5d646d]">Saved to your account</span>
              <span className="rounded-full bg-[#f7fafa] px-3 py-1 text-xs font-black text-[#5d646d]">{status || 'Not submitted yet'}</span>
            </div>
          </div>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-[#565959]">
            This form keeps the full application inside K-CUBE instead of sending it by email. Submit once, edit later if needed, and the first submission awards your points automatically.
          </p>

          {(status || reviewNote) ? (
            <div className="mt-5 grid gap-3 rounded-[24px] border border-[#d5d9d9] bg-[#f7fafa] p-4 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8b95a1]">Current status</p>
                <p className="mt-2 text-sm font-bold text-[#111827]">{status || 'Not submitted yet'}</p>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8b95a1]">Reviewed by</p>
                <p className="mt-2 text-sm font-bold text-[#111827]">{reviewedBy || 'Awaiting admin review'}</p>
                {reviewedAt ? <p className="mt-1 text-xs text-[#565959]">{reviewedAt}</p> : null}
              </div>
              <div className="sm:col-span-1">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8b95a1]">Review note</p>
                <p className="mt-2 text-sm leading-6 text-[#565959]">
                  {reviewNote || 'Your application is saved. Once the admin reviews it, the note will appear here.'}
                </p>
              </div>
            </div>
          ) : null}
        </>
      )}

      {loading ? (
        <div className="mt-6 flex items-center gap-3 rounded-[22px] border border-[#d5d9d9] bg-[#f7fafa] px-4 py-4 text-sm font-semibold text-[#565959]">
          <Loader2 className="h-4 w-4 animate-spin text-[#b12704]" />
          Loading your application profile...
        </div>
      ) : (
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {error ? (
            <div className="rounded-[22px] border border-[#f3a847]/30 bg-[#fff8df] px-4 py-3 text-sm font-semibold text-[#8a3b00]">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              {message}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-[#111827]">
              Full name
              <input
                required
                value={form.full_name}
                onChange={(event) => updateField('full_name', event.target.value)}
                className="rounded-2xl border border-[#d5d9d9] bg-[#f7fafa] px-4 py-3 font-medium text-[#111827] outline-none transition focus:border-[#f3a847] focus:bg-white"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#111827]">
              Email address
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                className="rounded-2xl border border-[#d5d9d9] bg-[#f7fafa] px-4 py-3 font-medium text-[#111827] outline-none transition focus:border-[#f3a847] focus:bg-white"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#111827]">
              Phone or WhatsApp
              <input
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                className="rounded-2xl border border-[#d5d9d9] bg-[#f7fafa] px-4 py-3 font-medium text-[#111827] outline-none transition focus:border-[#f3a847] focus:bg-white"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#111827]">
              Nationality
              <input
                value={form.nationality}
                onChange={(event) => updateField('nationality', event.target.value)}
                className="rounded-2xl border border-[#d5d9d9] bg-[#f7fafa] px-4 py-3 font-medium text-[#111827] outline-none transition focus:border-[#f3a847] focus:bg-white"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#111827]">
              Current city
              <input
                value={form.current_city}
                onChange={(event) => updateField('current_city', event.target.value)}
                className="rounded-2xl border border-[#d5d9d9] bg-[#f7fafa] px-4 py-3 font-medium text-[#111827] outline-none transition focus:border-[#f3a847] focus:bg-white"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#111827]">
              Date of birth
              <input
                type="date"
                value={form.date_of_birth}
                onChange={(event) => updateField('date_of_birth', event.target.value)}
                className="rounded-2xl border border-[#d5d9d9] bg-[#f7fafa] px-4 py-3 font-medium text-[#111827] outline-none transition focus:border-[#f3a847] focus:bg-white"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#111827] md:col-span-2">
              Performance category
              <select
                required
                value={form.performance_category}
                onChange={(event) => updateField('performance_category', event.target.value)}
                className="rounded-2xl border border-[#d5d9d9] bg-[#f7fafa] px-4 py-3 font-medium text-[#111827] outline-none transition focus:border-[#f3a847] focus:bg-white"
              >
                <option value="">Select a category</option>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#111827] md:col-span-2">
              Short biography
              <textarea
                rows={4}
                value={form.biography}
                onChange={(event) => updateField('biography', event.target.value)}
                placeholder="Tell us about your background, style, and stage experience."
                className="rounded-2xl border border-[#d5d9d9] bg-[#f7fafa] px-4 py-3 font-medium text-[#111827] outline-none transition placeholder:text-[#8b95a1] focus:border-[#f3a847] focus:bg-white"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#111827] md:col-span-2">
              Performance video link
              <input
                required
                value={form.video_link}
                onChange={(event) => updateField('video_link', event.target.value)}
                placeholder="https://youtube.com, Google Drive, or public video URL"
                className="rounded-2xl border border-[#d5d9d9] bg-[#f7fafa] px-4 py-3 font-medium text-[#111827] outline-none transition placeholder:text-[#8b95a1] focus:border-[#f3a847] focus:bg-white"
              />
              <p className="text-xs font-medium leading-5 text-[#565959]">
                Paste a public video link. YouTube and Google Drive links are supported, and links without http:// or https:// will be normalized.
              </p>
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#111827] md:col-span-2">
              Message to the K-CUBE team
              <textarea
                rows={4}
                value={form.message}
                onChange={(event) => updateField('message', event.target.value)}
                placeholder="Share any extra context, group size, or scheduling note."
                className="rounded-2xl border border-[#d5d9d9] bg-[#f7fafa] px-4 py-3 font-medium text-[#111827] outline-none transition placeholder:text-[#8b95a1] focus:border-[#f3a847] focus:bg-white"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 rounded-[24px] border border-[#d5d9d9] bg-[#f7fafa] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#b12704]" />
              <div>
                <p className="text-sm font-bold text-[#111827]">Submission stays inside K-CUBE</p>
                <p className="mt-1 text-sm leading-6 text-[#565959]">
                  No email submission is needed. Your saved application can be updated later, but the first successful submission is what earns the points.
                </p>
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {submitting ? 'Submitting...' : 'Submit application'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default IndiaPreSelectionApplicationForm;
