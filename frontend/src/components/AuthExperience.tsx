"use client";

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Eye, EyeOff, Lock, Mail, Phone } from 'lucide-react';
import api from '@/lib/api';
import { copy } from '@/lib/kcubeContent';
import { useAppStore, type AuthMethod } from '@/store/useAppStore';

interface AuthExperienceProps {
  mode: 'signin' | 'signup' | 'admin';
}

const authCopy = {
  en: {
    signinTitle: 'Sign in to your K-CUBE account',
    signupTitle: 'Create your K-CUBE account',
    adminTitle: 'Admin CMS login',
    subtitle: 'Use email/password or temporary mobile OTP. Your points balance is restored from the server after login.',
    name: 'Full name',
    username: 'Username',
    email: 'Email address',
    password: 'Password',
    phone: 'Mobile number',
    otp: 'OTP code',
    sendOtp: 'Send OTP',
    verifyOtp: 'Verify OTP',
    emailLogin: 'Email login',
    phoneLogin: 'Mobile OTP',
    submitSignin: 'Sign in',
    submitSignup: 'Create account',
    submitAdmin: 'Enter CMS',
    signedIn: 'Signed in successfully',
    switchSignup: 'Need a new account?',
    switchSignin: 'Already have an account?',
    realNote: 'Temporary OTP is generated instantly so signup and sign-in work without an SMS provider for now.',
    otpSent: 'Temporary OTP generated.',
  },
  ko: {
    signinTitle: 'K-CUBE 계정 로그인',
    signupTitle: 'K-CUBE 계정 만들기',
    adminTitle: '관리자 CMS 로그인',
    subtitle: '이메일/비밀번호 또는 임시 휴대폰 OTP를 사용하세요.',
    name: '이름',
    username: '사용자 이름',
    email: '이메일 주소',
    password: '비밀번호',
    phone: '휴대폰 번호',
    otp: 'OTP 코드',
    sendOtp: 'OTP 보내기',
    verifyOtp: 'OTP 확인',
    emailLogin: '이메일 로그인',
    phoneLogin: '휴대폰 OTP',
    submitSignin: '로그인',
    submitSignup: '계정 만들기',
    submitAdmin: 'CMS 입장',
    signedIn: '로그인 성공',
    switchSignup: '새 계정이 필요하신가요?',
    switchSignin: '이미 계정이 있으신가요?',
    realNote: '실제 Gmail은 Google Client ID와 Identity 토큰이 필요합니다. 실제 OTP는 백엔드 SMS 제공자 설정이 필요합니다.',
    otpSent: 'OTP가 전송되었습니다. 개발 중에는 SMS 제공자/백엔드 응답을 확인하세요.',
  },
  hi: {
    signinTitle: 'अपने K-CUBE खाते में साइन इन करें',
    signupTitle: 'अपना K-CUBE खाता बनाएँ',
    adminTitle: 'एडमिन CMS लॉगिन',
    subtitle: 'ईमेल/पासवर्ड या अस्थायी मोबाइल OTP का उपयोग करें।',
    name: 'पूरा नाम',
    username: 'यूज़रनेम',
    email: 'ईमेल पता',
    password: 'पासवर्ड',
    phone: 'मोबाइल नंबर',
    otp: 'OTP कोड',
    sendOtp: 'OTP भेजें',
    verifyOtp: 'OTP सत्यापित करें',
    emailLogin: 'ईमेल लॉगिन',
    phoneLogin: 'मोबाइल OTP',
    submitSignin: 'साइन इन करें',
    submitSignup: 'खाता बनाएँ',
    submitAdmin: 'CMS में प्रवेश करें',
    signedIn: 'सफलतापूर्वक साइन इन हो गया',
    switchSignup: 'नया खाता चाहिए?',
    switchSignin: 'पहले से खाता है?',
    realNote: 'वास्तविक Gmail लॉगिन के लिए Google Client ID और Identity टोकन चाहिए। वास्तविक OTP के लिए बैकएंड SMS प्रदाता कॉन्फ़िगरेशन चाहिए।',
    otpSent: 'OTP भेज दिया गया है। विकास के दौरान SMS प्रदाता/बैकएंड प्रतिक्रिया जाँचें।',
  },
};

const readRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

const readPoints = (value: unknown) => {
  const points = Number(value);
  return Number.isFinite(points) ? points : undefined;
};

const sanitizeReturnTo = (target: string | null) => {
  if (!target || !target.startsWith('/') || target.startsWith('//')) {
    return null;
  }
  return target;
};

const normalizeUser = (payload: unknown, method: AuthMethod) => {
  const record = readRecord(payload);
  const nestedUser = readRecord(record.user);

  return {
    id: String(record.id ?? nestedUser.id ?? crypto.randomUUID()),
    fullName: String(record.full_name ?? record.fullName ?? nestedUser.full_name ?? record.username ?? 'K-CUBE Member'),
    email: typeof (record.email ?? nestedUser.email) === 'string' ? String(record.email ?? nestedUser.email) : undefined,
    phone: typeof (record.phone ?? nestedUser.phone) === 'string' ? String(record.phone ?? nestedUser.phone) : undefined,
    points: readPoints(record.points ?? nestedUser.points),
    role: (record.role ?? nestedUser.role ?? 'member') as 'admin' | 'member' | 'manager' | 'guest',
    method,
  };
};

const getErrorMessage = (error: unknown) => {
  const response = readRecord(readRecord(error).response);
  const data = readRecord(response.data);
  const structuredError = readRecord(data.error);
  return typeof structuredError.message === 'string'
    ? structuredError.message
    : typeof data.error === 'string'
      ? data.error
      : 'Unable to complete request.';
};

const AuthExperience = ({ mode }: AuthExperienceProps) => {
  const router = useRouter();
  const language = useAppStore((state) => state.language);
  const user = useAppStore((state) => state.user);
  const points = useAppStore((state) => state.points);
  const signIn = useAppStore((state) => state.signIn);
  const signOut = useAppStore((state) => state.signOut);
  const searchParams = useSearchParams();
  const verifiedParam = searchParams.get('verified');
  const verifiedEmailParam = searchParams.get('email');
  const t = authCopy[language];
  const global = copy[language];
  const [method, setMethod] = useState<AuthMethod>(mode === 'admin' ? 'admin' : 'email');
  const [message, setMessage] = useState('');
  const [verificationLink, setVerificationLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    otp: '',
  });
  const returnTo = sanitizeReturnTo(searchParams.get('returnTo'));

  useEffect(() => {
    if (mode !== 'signin' || verifiedParam !== '1') return;
    setMessage('Email verified successfully. You can sign in now.');
    if (verifiedEmailParam) {
      setForm((current) => ({ ...current, email: verifiedEmailParam }));
    }
  }, [mode, verifiedEmailParam, verifiedParam]);

  const returnHref = useMemo(() => returnTo || '/dashboard', [returnTo]);

  const authSwitchHref = (target: 'signin' | 'signup') => {
    const base = target === 'signin' ? '/signin' : '/signup';
    return returnTo ? `${base}?returnTo=${encodeURIComponent(returnTo)}` : base;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setVerificationLink('');
    setIsSubmitting(true);

    try {
      let response;

      if (method === 'phone') {
        response = await api.post('/auth/otp/verify', {
          phone: form.phone,
          otp_code: form.otp,
          full_name: form.fullName || undefined,
          username: form.username || undefined,
          email: form.email || undefined,
        });
      } else if (mode === 'signup') {
        response = await api.post('/auth/register', {
          full_name: form.fullName,
          username: form.username,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
        });
      } else {
        response = await api.post('/auth/login', {
          email: form.email,
          password: form.password,
        });
      }

      const data = response.data?.data ?? response.data;
      const nextUser = normalizeUser(data.user ?? data, method);
      const nextPoints = readPoints(data.user?.points ?? data.points ?? nextUser.points);

      if (mode === 'signup' && data.verificationRequired) {
        setMessage(data.message || 'Verification email sent. Please check your inbox before signing in.');
        if (typeof data.verificationUrl === 'string') {
          setVerificationLink(data.verificationUrl);
        }
        return;
      }

      if (mode === 'admin' && nextUser.role !== 'admin') {
        setMessage('Admin access required.');
        return;
      }

      signIn(nextUser, data.token, data.refreshToken, nextPoints);
      setMessage(t.signedIn);
      if (mode === 'admin') {
        router.replace('/admin');
      } else {
        router.replace(returnTo || '/dashboard');
      }
    } catch (error: unknown) {
      setMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendOtp = async () => {
    setMessage('');
    if (!form.phone.trim()) {
      setMessage('Phone number is required.');
      return;
    }
    try {
      const response = await api.post('/auth/otp/send', { phone: form.phone });
      const data = response.data?.data ?? response.data;
      const otpCode = typeof data?.otpCode === 'string' ? data.otpCode : '';
      if (otpCode) {
        setForm((current) => ({ ...current, otp: otpCode }));
        setMessage(`Temporary OTP generated: ${otpCode}`);
      } else {
        setMessage(t.otpSent);
      }
    } catch (error: unknown) {
      setMessage(getErrorMessage(error));
    }
  };

  const title = mode === 'admin' ? t.adminTitle : mode === 'signup' ? t.signupTitle : t.signinTitle;

  return (
    <main className="min-h-screen bg-[#070708] px-4 py-10 text-white sm:px-5 sm:py-14 lg:px-10 lg:py-20">
      <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <section>
          <p className="inline-flex rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-[#ffc400]">
            {mode === 'admin' ? global.admin : mode === 'signup' ? global.signUp : global.signIn}
          </p>
          <h1 className="mt-6 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-6xl">{title}</h1>
          <p className="mt-5 text-base leading-7 text-[#d4dbe7] sm:text-lg sm:leading-8">{t.subtitle}</p>
          <p className="mt-5 rounded-xl border border-white/10 bg-[#111113] p-4 text-sm leading-6 text-[#aab5c6]">{t.realNote}</p>
        </section>

        <section className="rounded-xl border border-white/10 bg-[#111113] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          {false ? (
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#ffc400] text-[#090909]">
                <Check className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-3xl font-black text-white">{t.signedIn}</h2>
              <p className="mt-2 text-[#aab5c6]">
                {user!.fullName} · {user!.email ?? user!.phone} · {user!.role ?? 'member'}
              </p>
              <div className="mt-6 rounded-xl border border-[#ffc400]/20 bg-[#ffc400]/10 p-5">
                <p className="text-sm text-[#d4dbe7]">{global.pointsWallet}</p>
                <p className="mt-1 text-4xl font-black text-[#ffc400]">{points}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={mode === 'admin' ? '/admin' : returnHref} className="rounded-lg bg-[#ffc400] px-5 py-3 text-sm font-black text-[#090909]">
                  {mode === 'admin' ? 'Open CMS' : 'Continue'}
                </Link>
                <button type="button" onClick={signOut} className="rounded-lg border border-white/15 px-5 py-3 text-sm font-bold text-white">
                  {global.signOut}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              {mode !== 'admin' ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { key: 'email' as AuthMethod, label: t.emailLogin, icon: Mail },
                    { key: 'phone' as AuthMethod, label: t.phoneLogin, icon: Phone },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setMethod(item.key)}
                        className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-black transition ${
                          method === item.key ? 'border-[#ffc400] bg-[#ffc400] text-[#090909]' : 'border-white/10 bg-white/[0.04] text-white'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <div className="mt-6 grid gap-4">
                {mode === 'signup' ? (
                  <label className="grid gap-2 text-sm font-bold text-white">
                    {t.name}
                    <input value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" />
                  </label>
                ) : null}

                {mode === 'signup' ? (
                  <label className="grid gap-2 text-sm font-bold text-white">
                    {t.username}
                    <input value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" />
                  </label>
                ) : null}

                {method === 'phone' ? (
                  <>
                    <label className="grid gap-2 text-sm font-bold text-white">
                      {t.phone}
                      <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" placeholder="+91 99999 99999" />
                    </label>
                    {mode === 'signup' ? (
                      <label className="grid gap-2 text-sm font-bold text-white">
                        {t.email}
                        <input
                          type="email"
                          value={form.email}
                          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                          className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]"
                          placeholder="optional@email.com"
                        />
                      </label>
                    ) : null}
                    <button type="button" onClick={sendOtp} className="rounded-lg border border-[#ffc400]/40 bg-[#ffc400]/10 px-4 py-3 text-sm font-black text-[#ffc400]">
                      {t.sendOtp}
                    </button>
                    <label className="grid gap-2 text-sm font-bold text-white">
                      {t.otp}
                      <input value={form.otp} onChange={(event) => setForm((current) => ({ ...current, otp: event.target.value }))} className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" />
                    </label>
                  </>
                ) : (
                  <>
                    <label className="grid gap-2 text-sm font-bold text-white">
                      {t.email}
                      <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-white">
                      {t.password}
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={form.password}
                          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                          className="w-full rounded-lg border border-white/10 bg-[#070708] px-4 py-3 pr-12 text-white outline-none focus:border-[#ffc400]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((current) => !current)}
                          className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-4 text-[#aab5c6] transition hover:text-white"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </label>
                  </>
                )}
              </div>

              {message ? (
                <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#d4dbe7]">
                  <p>{message}</p>
                  {verificationLink ? (
                    <a href={verificationLink} className="mt-3 inline-flex font-bold text-[#ffc400]" target="_blank" rel="noreferrer">
                      Open verification link
                    </a>
                  ) : null}
                </div>
              ) : null}

              <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#ffc400] px-5 py-4 text-sm font-black text-[#090909] transition hover:bg-[#ffd84a] disabled:cursor-not-allowed disabled:opacity-70">
                <Lock className="h-4 w-4" />
                {isSubmitting ? 'Please wait...' : mode === 'admin' ? t.submitAdmin : mode === 'signup' ? t.submitSignup : method === 'phone' ? t.verifyOtp : t.submitSignin}
              </button>

              <div className="mt-5 text-center text-sm text-[#aab5c6]">
                {mode === 'signin' ? (
                  <Link href={authSwitchHref('signup')} className="font-bold text-[#ffc400]">{t.switchSignup}</Link>
                ) : mode === 'signup' ? (
                  <Link href={authSwitchHref('signin')} className="font-bold text-[#ffc400]">{t.switchSignin}</Link>
                ) : null}
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
};

export default AuthExperience;
