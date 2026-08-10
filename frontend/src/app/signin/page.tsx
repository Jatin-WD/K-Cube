import { Suspense } from 'react';
import AuthExperience from '@/components/AuthExperience';

const SignInPage = () => {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#070708] px-4 py-10 text-white sm:px-5 sm:py-14 lg:px-10 lg:py-20">
          <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <section>
              <div className="h-8 w-32 rounded-full bg-white/10" />
              <div className="mt-6 h-16 w-full max-w-lg rounded-3xl bg-white/10" />
              <div className="mt-5 h-24 w-full rounded-2xl bg-white/5" />
            </section>
            <section className="rounded-xl border border-white/10 bg-[#111113] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              <div className="h-6 w-40 rounded-full bg-white/10" />
              <div className="mt-5 space-y-3">
                <div className="h-12 w-full rounded-lg bg-white/5" />
                <div className="h-12 w-full rounded-lg bg-white/5" />
                <div className="h-12 w-full rounded-lg bg-white/5" />
                <div className="h-12 w-full rounded-lg bg-white/5" />
              </div>
            </section>
          </div>
        </main>
      }
    >
      <AuthExperience mode="signin" />
    </Suspense>
  );
};

export default SignInPage;
