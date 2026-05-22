"use client";

import Link from 'next/link';
import { Bell, BriefcaseBusiness, ChevronDown, ExternalLink, Globe2, Languages, Phone, Plane, Search, User } from 'lucide-react';
import MegaMenu from './MegaMenu';
import { copy, navItems } from '@/lib/kcubeContent';
import { useAppStore, type Language } from '@/store/useAppStore';

const languageLabels: Record<Language, string> = {
  en: 'EN',
  ko: '한국어',
  hi: 'हिन्दी',
};

const Header = () => {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const user = useAppStore((state) => state.user);
  const signOut = useAppStore((state) => state.signOut);
  const t = copy[language];

  return (
    <header className="sticky top-0 z-50 border-b border-[#232f3e] bg-[#131921] text-white shadow-[0_10px_24px_rgba(0,0,0,0.24)]">
      <div className="border-b border-[#232f3e] bg-[#131921]">
        <div className="mx-auto flex max-w-[1760px] flex-wrap items-center justify-end gap-5 px-5 py-2 text-sm text-[#d5d9d9] lg:px-10">
          <Link href="/apply-for-manpower" className="inline-flex items-center gap-2 transition hover:text-[#f3a847]">
            <BriefcaseBusiness className="h-4 w-4" />
            {t.manpower}
          </Link>
          <Link href="/about#contact" className="inline-flex items-center gap-2 transition hover:text-[#f3a847]">
            <Phone className="h-4 w-4" />
            {t.contact}
          </Link>
          <Link href="/admin" className="font-bold text-[#f3a847] transition hover:text-white">
            {t.admin}
          </Link>
        </div>
      </div>

      <div className="border-b border-[#232f3e] bg-[#131921]">
        <div className="mx-auto grid max-w-[1760px] gap-4 px-5 py-3 lg:grid-cols-[260px_minmax(340px,1fr)_auto] lg:items-center lg:px-10">
          <Link href="/" className="flex items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#f3a847] text-lg font-black text-[#111827]">
              K
            </span>
            <span>
              <span className="block text-[22px] font-black leading-none tracking-tight text-white">K-CUBE</span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.34em] text-[#f3a847]">Korean Ecosystem</span>
            </span>
          </Link>

          <form className="flex min-h-[48px] overflow-hidden rounded-sm border-2 border-transparent bg-white text-[#101012] shadow-[0_8px_18px_rgba(0,0,0,0.2)] focus-within:border-[#f3a847]">
            <label className="sr-only" htmlFor="header-search">
              Search K-CUBE
            </label>
            <input
              id="header-search"
              className="min-w-0 flex-1 px-5 text-base text-[#171717] outline-none placeholder:text-[#8f95a3]"
              placeholder={t.search}
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex w-16 items-center justify-center bg-[#f3a847] text-[#111827] transition hover:bg-[#ffa41c]"
            >
              <Search className="h-6 w-6" />
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <div className="group/lang relative">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-sm border border-[#f3a847]/50 bg-[#232f3e] px-4 text-sm font-black text-[#f3a847] transition hover:bg-[#f3a847] hover:text-[#111827]"
              >
                <Languages className="h-4 w-4" />
                {languageLabels[language]}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <div className="invisible absolute right-0 top-full z-20 mt-2 w-52 rounded-sm border border-[#d5d9d9] bg-white p-2 opacity-0 shadow-2xl transition group-hover/lang:visible group-hover/lang:opacity-100 group-focus-within/lang:visible group-focus-within/lang:opacity-100">
                {(['en', 'ko', 'hi'] as Language[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setLanguage(option)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-bold transition ${
                      language === option ? 'bg-[#ffd814] text-[#111827]' : 'text-[#111827] hover:bg-[#f7fafa]'
                    }`}
                  >
                    <Globe2 className="h-4 w-4" />
                    {languageLabels[option]}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/trip-to-korea"
              className="inline-flex h-10 items-center gap-2 rounded-sm bg-[#ffd814] px-4 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00]"
            >
              <Plane className="h-4 w-4" />
              {t.koreaTrip}
            </Link>
            <button aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-sm bg-[#232f3e] transition hover:bg-[#37475a]">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#ff4d4d]" />
            </button>
            {user ? (
              <div className="group/account relative">
                <button className="flex items-center gap-2 text-sm leading-tight">
                  <User className="h-5 w-5 text-[#c8d2e1]" />
                  <span>
                    <span className="block text-[#b9c5d6]">{t.hello}</span>
                    <span className="block text-base font-bold text-white">
                      {user.fullName} <ChevronDown className="inline h-4 w-4" />
                    </span>
                  </span>
                </button>
                <div className="invisible absolute right-0 top-full z-20 mt-2 w-44 rounded-sm border border-[#d5d9d9] bg-white p-2 opacity-0 shadow-2xl transition group-hover/account:visible group-hover/account:opacity-100 group-focus-within/account:visible group-focus-within/account:opacity-100">
                  <Link href="/rewards" className="block rounded-sm px-3 py-2 text-sm font-bold text-[#111827] hover:bg-[#f7fafa]">
                    {t.pointsWallet}
                  </Link>
                  <Link href="/dashboard" className="block rounded-sm px-3 py-2 text-sm font-bold text-[#111827] hover:bg-[#f7fafa]">
                    Dashboard
                  </Link>
                  <button onClick={signOut} className="block w-full rounded-sm px-3 py-2 text-left text-sm font-bold text-[#b12704] hover:bg-[#f7fafa]">
                    {t.signOut}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/signin" className="rounded-sm border border-white/30 px-3 py-2 text-sm font-bold text-white hover:border-[#f3a847] hover:text-[#f3a847]">
                  {t.signIn}
                </Link>
                <Link href="/signup" className="rounded-sm bg-[#ffd814] px-3 py-2 text-sm font-black text-[#111827] hover:bg-[#f7ca00]">
                  {t.signUp}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav aria-label="Primary navigation" className="relative border-b border-[#232f3e] bg-[#232f3e]">
        <div className="mx-auto flex max-w-[1760px] min-h-[54px] items-center gap-1 overflow-x-auto px-5 lg:px-10">
          {navItems.map((item) => (
            <div key={item.label.en} className="group/menu">
              <Link
                href={item.href}
                className="flex h-[54px] items-center gap-2 whitespace-nowrap px-4 text-base font-bold text-white transition hover:outline hover:outline-1 hover:outline-white focus-visible:text-[#f3a847] focus-visible:outline-none"
              >
                {item.label[language]}
                {item.dropdown ? <ChevronDown className="h-3.5 w-3.5 text-[#8792a3]" /> : null}
              </Link>

              {item.dropdown ? (
                <div className="invisible absolute left-0 top-full w-full translate-y-2 border-y border-[#d5d9d9] bg-white opacity-0 shadow-[0_24px_50px_rgba(0,0,0,0.28)] transition duration-150 group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:translate-y-0 group-focus-within/menu:opacity-100">
                  <MegaMenu sections={item.dropdown} language={language} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
