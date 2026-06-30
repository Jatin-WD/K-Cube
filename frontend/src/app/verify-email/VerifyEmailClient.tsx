"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const [verifiedEmail, setVerifiedEmail] = useState('');

  useEffect(() => {
    if (!token) {
      setState('error');
      setMessage('Verification token is missing.');
      return;
    }

    let isMounted = true;

    const confirm = async () => {
      try {
        const response = await api.post('/auth/verify-email', { token });
        const data = response.data?.data ?? response.data;
        if (!isMounted) return;
        setState('success');
        setMessage(data.message || 'Email verified successfully.');
        if (typeof data.email === 'string') {
          setVerifiedEmail(data.email);
        }
        setTimeout(() => {
          router.replace(`/signin?verified=1${data.email ? `&email=${encodeURIComponent(data.email)}` : ''}`);
        }, 1400);
      } catch (error: any) {
        if (!isMounted) return;
        const apiMessage = error?.response?.data?.error?.message || error?.response?.data?.message;
        setState('error');
        setMessage(apiMessage || 'Verification link is invalid or expired.');
      }
    };

    confirm();

    return () => {
      isMounted = false;
    };
  }, [router, token]);

  return (
    <main className="min-h-screen bg-[#070708] px-4 py-10 text-white sm:px-5 sm:py-14 lg:px-10 lg:py-20">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center">
        <section className="w-full rounded-xl border border-white/10 bg-[#111113] p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <p className="inline-flex rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-[#ffc400]">
            Email verification
          </p>
          <h1 className="mt-6 text-3xl font-black text-white sm:text-4xl">Confirming your account</h1>
          <p className="mt-4 text-base leading-7 text-[#d4dbe7]">{message}</p>
          {state === 'success' && verifiedEmail ? (
            <p className="mt-4 text-sm text-[#aab5c6]">Verified email: {verifiedEmail}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/signin" className="rounded-lg bg-[#ffc400] px-5 py-3 text-sm font-black text-[#090909]">
              Go to sign in
            </Link>
            <Link href="/signup" className="rounded-lg border border-white/15 px-5 py-3 text-sm font-bold text-white">
              Create another account
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
