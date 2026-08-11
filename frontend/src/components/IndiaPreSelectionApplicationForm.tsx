"use client";

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, CheckCircle2, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
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

const IndiaPreSelectionApplicationForm = () => {
  const user = useAppStore((state) => state.user);
  const awardPoints = useAppStore((state) => state.awardPoints);
  const [form, setForm] = useState<ApplicationFormState>(() => emptyForm(user || undefined));
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    setForm(emptyForm(user || undefined));
  }, [user?.id, user?.fullName, user?.email, user?.phone]);

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
        setPoints(Number(application.points_awarded || 0));
      } catch (requestError: any) {
        const code = requestError?.response?.status;
        if (code !== 404 && code !== 401) {
          setError(requestError?.response?.data?.error?.message || 'Could not load your saved application.');
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

    setSubmitting(true);
    try {
      const response = await api.post('/india-pre-selection/applications', form);
      const data = response.data?.data ?? response.data ?? {};
      const application = data.application ?? null;
      const awarded = Number(data.points_awarded || 0);

      if (awarded > 0) {
        awardPoints('india-pre-selection-application', awarded);
      }

      setStatus(application?.status || 'submitted');
      setPoints(Number(application?.points_awarded || awarded || 0));
      setMessage(
        awarded > 0
          ? `Application saved inside K-CUBE and ${awarded} points added.`
          : 'Application updated inside K-CUBE.',
      );

      if (application) {
        setForm({
          full_name: application.full_name || form.full_name,
          email: application.email || form.email,
          phone: application.phone || form.phone,
          nationality: application.nationality || form.nationality,
          current_city: application.current_city || form.current_city,
          date_of_birth: application.date_of_birth ? String(application.date_of_birth).slice(0, 10) : form.date_of_birth,
          performance_category: application.performance_category || form.performance_category,
          biography: application.biography || form.biography,
          video_link: application.video_link || form.video_link,
          message: application.message || form.message,
        });
      }
    } catch (requestError: any) {
      setError(requestError?.response?.data?.error?.message || 'Could not submit your application right now.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="mt-8 rounded-[28px] border border-[#f3a847]/30 bg-[#fff8df] p-6 shadow-sm">
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

  return (
    <div id="application" className="mt-8 rounded-[28px] border border-[#d5d9d9] bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">Application form</p>
          <h2 className="mt-2 text-2xl font-black text-[#111827] sm:text-3xl">Apply inside K-CUBE</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#fff2c2] px-3 py-1 text-xs font-black text-[#111827]">+130 points</span>
          <span className="rounded-full bg-[#f7fafa] px-3 py-1 text-xs font-black text-[#5d646d]">Saved to your account</span>
          <span className="rounded-full bg-[#f7fafa] px-3 py-1 text-xs font-black text-[#5d646d]">{status || 'Not submitted yet'}</span>
        </div>
      </div>

      <p className="mt-3 max-w-4xl text-sm leading-7 text-[#565959]">
        This form keeps the full application inside K-CUBE instead of sending it by email. Submit once, edit later if needed, and the first submission awards your points automatically.
      </p>

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
                placeholder="YouTube, Google Drive, or public video URL"
                className="rounded-2xl border border-[#d5d9d9] bg-[#f7fafa] px-4 py-3 font-medium text-[#111827] outline-none transition placeholder:text-[#8b95a1] focus:border-[#f3a847] focus:bg-white"
              />
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
