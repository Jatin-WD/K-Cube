import { Suspense } from 'react';
import AuthExperience from '@/components/AuthExperience';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Admin Login | K-CUBE CMS',
  description: 'Admin login for K-CUBE CMS.',
};

const LoginFallback = () => (
  <main className="min-h-screen bg-[#070708] px-4 py-10 text-white sm:px-5 sm:py-14 lg:px-10 lg:py-20">
    <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
      <section>
        <p className="inline-flex rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-[#ffc400]">
          Admin
        </p>
        <h1 className="mt-6 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-6xl">Admin CMS login</h1>
        <p className="mt-5 text-base leading-7 text-[#d4dbe7] sm:text-lg sm:leading-8">
          Use email/password to access the control center.
        </p>
        <p className="mt-5 rounded-xl border border-white/10 bg-[#111113] p-4 text-sm leading-6 text-[#aab5c6]">
          Loading secure admin workspace...
        </p>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#111113] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="h-6 w-36 rounded bg-white/10" />
        <div className="mt-8 space-y-4">
          <div className="h-12 rounded-lg bg-white/10" />
          <div className="h-12 rounded-lg bg-white/10" />
          <div className="h-12 rounded-lg bg-white/10" />
          <div className="h-14 rounded-lg bg-[#ffc400]/20" />
        </div>
      </section>
    </div>
  </main>
);

const AdminLoginPage = () => {
  return (
    <Suspense fallback={<LoginFallback />}>
      <AuthExperience mode="admin" />
    </Suspense>
  );
};

export default AdminLoginPage;
