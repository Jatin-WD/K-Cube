"use client";

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Eye, EyeOff, Lock } from 'lucide-react';
import api from '@/lib/api';
import { copy } from '@/lib/kcubeContent';
import { useAppStore, type AuthMethod } from '@/store/useAppStore';

interface AuthExperienceProps {
  mode: 'signin' | 'signup' | 'admin';
  returnTo?: string | null;
  verified?: string | null;
  verifiedEmail?: string | null;
  referralParam?: string | null;
}

const authCopy = {
  en: {
    signinTitle: 'Sign in to your K-CUBE account',
    signupTitle: 'Create your K-CUBE account',
    adminTitle: 'Admin CMS login',
    subtitle: 'Use email and password to access your K-CUBE account. Your points balance is restored from the server after login.',
    name: 'Full name',
    username: 'Username',
    email: 'Email address',
    password: 'Password',
    emailLogin: 'Email login',
    submitSignin: 'Sign in',
    submitSignup: 'Create account',
    submitAdmin: 'Enter CMS',
    signedIn: 'Signed in successfully',
    switchSignup: 'Need a new account?',
    switchSignin: 'Already have an account?',
    realNote: 'Email login is the only sign-in method for now.',
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
    referralCode: typeof (record.referral_code ?? record.referralCode ?? nestedUser.referral_code ?? nestedUser.referralCode) === 'string'
      ? String(record.referral_code ?? record.referralCode ?? nestedUser.referral_code ?? nestedUser.referralCode)
      : undefined,
    role: (record.role ?? nestedUser.role ?? 'member') as 'admin' | 'member' | 'manager' | 'guest',
    adminScope: typeof (record.admin_scope ?? nestedUser.admin_scope) === 'string'
      ? String(record.admin_scope ?? nestedUser.admin_scope)
      : null,
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

const AuthExperience = ({
  mode,
  returnTo = null,
  verified = null,
  verifiedEmail = null,
  referralParam = null,
}: AuthExperienceProps) => {
  const router = useRouter();
  const language = useAppStore((state) => state.language);
  const user = useAppStore((state) => state.user);
  const points = useAppStore((state) => state.points);
  const signIn = useAppStore((state) => state.signIn);
  const signOut = useAppStore((state) => state.signOut);
  const t = authCopy[language];
  const global = copy[language];
  const [message, setMessage] = useState('');
  const [verificationLink, setVerificationLink] = useState('');
  const [signupReferralCode, setSignupReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    otp: '',
    referralCode: referralParam || '',
  });
  const safeReturnTo = sanitizeReturnTo(returnTo);

  useEffect(() => {
    if (mode !== 'signin' || verified !== '1') return;
    const timer = window.setTimeout(() => {
      setMessage('Email verified successfully. You can sign in now.');
      if (verifiedEmail) {
        setForm((current) => ({ ...current, email: verifiedEmail }));
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [mode, verified, verifiedEmail]);

  const authSwitchHref = (target: 'signin' | 'signup') => {
    const base = target === 'signin' ? '/signin' : '/signup';
    return safeReturnTo ? `${base}?returnTo=${encodeURIComponent(safeReturnTo)}` : base;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setVerificationLink('');
    setSignupReferralCode('');
    setIsSubmitting(true);

    try {
      let response;

      if (mode === 'signup') {
        response = await api.post('/auth/register', {
          full_name: form.fullName,
          username: form.username,
          email: form.email,
          password: form.password,
          referral_code: form.referralCode.trim() || undefined,
        });
      } else {
        response = await api.post('/auth/login', {
          email: form.email,
          password: form.password,
        });
      }

      const data = response.data?.data ?? response.data;
      const nextUser = normalizeUser(data.user ?? data, mode === 'admin' ? 'admin' : 'email');
      const nextPoints = readPoints(data.user?.points ?? data.points ?? nextUser.points);

      if (mode === 'signup' && data.verificationRequired) {
        setMessage(data.message || 'Verification email sent. Please check your inbox before signing in.');
        if (data.verificationEmailSent === false) {
          setMessage(
            typeof data.verificationEmailError === 'string' && data.verificationEmailError
              ? `${data.message || 'Account created, but verification email could not be delivered.'} ${data.verificationEmailError}`
              : data.message || 'Account created, but verification email could not be delivered.'
          );
        }
        const referralCode = typeof data.user?.referral_code === 'string'
          ? data.user.referral_code
          : typeof data.user?.referralCode === 'string'
            ? data.user.referralCode
            : '';
        setSignupReferralCode(referralCode);
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
        router.replace(safeReturnTo || '/dashboard');
      }
    } catch (error: unknown) {
      setMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
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
                <Link href={mode === 'admin' ? '/admin' : safeReturnTo || '/dashboard'} className="rounded-lg bg-[#ffc400] px-5 py-3 text-sm font-black text-[#090909]">
                  {mode === 'admin' ? 'Open CMS' : 'Continue'}
                </Link>
                <button type="button" onClick={signOut} className="rounded-lg border border-white/15 px-5 py-3 text-sm font-bold text-white">
                  {global.signOut}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
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

                {mode === 'signup' ? (
                  <label className="grid gap-2 text-sm font-bold text-white">
                    Referral code
                    <input
                      value={form.referralCode}
                      onChange={(event) => setForm((current) => ({ ...current, referralCode: event.target.value.toUpperCase() }))}
                      className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]"
                      placeholder="Optional referral code"
                    />
                    <span className="text-xs font-medium text-[#aab5c6]">Optional. If a friend invited you, enter their code here.</span>
                  </label>
                ) : null}

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
              </div>

              {message ? (
                <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#d4dbe7]">
                  <p>{message}</p>
                  {signupReferralCode ? (
                    <p className="mt-3 rounded-md border border-[#ffc400]/20 bg-[#ffc400]/10 px-3 py-2 text-sm font-bold text-[#ffc400]">
                      Your referral code: {signupReferralCode}
                    </p>
                  ) : null}
                  {verificationLink ? (
                    <a href={verificationLink} className="mt-3 inline-flex font-bold text-[#ffc400]" target="_blank" rel="noreferrer">
                      Open verification link
                    </a>
                  ) : null}
                </div>
              ) : null}

              <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#ffc400] px-5 py-4 text-sm font-black text-[#090909] transition hover:bg-[#ffd84a] disabled:cursor-not-allowed disabled:opacity-70">
                <Lock className="h-4 w-4" />
                {isSubmitting ? 'Please wait...' : mode === 'admin' ? t.submitAdmin : mode === 'signup' ? t.submitSignup : t.submitSignin}
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
