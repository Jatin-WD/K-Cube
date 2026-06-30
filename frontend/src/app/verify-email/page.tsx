import { Suspense } from 'react';
import VerifyEmailClient from './VerifyEmailClient';

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#070708] px-4 py-10 text-white sm:px-5 sm:py-14 lg:px-10 lg:py-20">
          <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center">
            <section className="w-full rounded-xl border border-white/10 bg-[#111113] p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              <p className="text-sm text-[#aab5c6]">Loading verification page...</p>
            </section>
          </div>
        </main>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
