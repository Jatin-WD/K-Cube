"use client";

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BriefcaseBusiness, Camera, ChevronDown, Globe2, Languages, Menu, Phone, Plane, Search, User, X } from 'lucide-react';
import MegaMenu from './MegaMenu';
import { copy, navItems } from '@/lib/kcubeContent';
import api from '@/lib/api';
import { useAppStore, type Language } from '@/store/useAppStore';

const languageLabels: Record<Language, string> = {
  en: 'EN',
  ko: '\uD55C\uAD6D\uC5B4',
  hi: '\u0939\u093F\u0928\u094D\u0926\u0940',
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenuKey, setActiveMenuKey] = useState<string | null>(null);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const headerRef = useRef<HTMLElement | null>(null);
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);
  const openMenuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeMenuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const user = useAppStore((state) => state.user);
  const signOut = useAppStore((state) => state.signOut);
  const pathname = usePathname();
  const router = useRouter();
  const isAdminRoute = pathname.startsWith('/admin');
  const t = copy[language];
  const activeMenu = navItems.find((item) => item.label.en === activeMenuKey && item.dropdown?.length) ?? null;

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const clearMenuTimers = () => {
    if (openMenuTimerRef.current) {
      clearTimeout(openMenuTimerRef.current);
      openMenuTimerRef.current = null;
    }

    if (closeMenuTimerRef.current) {
      clearTimeout(closeMenuTimerRef.current);
      closeMenuTimerRef.current = null;
    }
  };

  const closeAllMenus = () => {
    clearMenuTimers();
    setActiveMenuKey(null);
    setLanguageMenuOpen(false);
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | PointerEvent) => {
      const target = event.target as Node;
      const insideTrigger = target instanceof Element && Boolean(target.closest('[data-mega-trigger]'));
      const insidePanel = target instanceof Element && Boolean(target.closest('[data-mega-panel]'));
      const insideLanguageMenu = target instanceof Element && Boolean(target.closest('[data-language-menu]'));
      const insideAccountMenu = target instanceof Element && Boolean(target.closest('[data-account-menu]'));
      if (!insideTrigger && !insidePanel && !insideLanguageMenu && !insideAccountMenu) {
        setActiveMenuKey(null);
        setLanguageMenuOpen(false);
        setAccountMenuOpen(false);
      }
    };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          const hadMegaMenu = Boolean(activeMenuKey);
          setActiveMenuKey(null);
          setLanguageMenuOpen(false);
          setAccountMenuOpen(false);
          setMobileMenuOpen(false);
          if (hadMegaMenu) activeTriggerRef.current?.focus();
        }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearMenuTimers();
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeMenuKey]);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setWalletBalance(null);
      setWalletLoading(false);
      return () => { cancelled = true; };
    }
    setWalletLoading(true);
    api.get('/users/points-wallet')
      .then((response) => {
        if (!cancelled && typeof response.data?.data?.balance === 'number') setWalletBalance(response.data.data.balance);
      })
      .catch(() => { if (!cancelled) setWalletBalance(null); })
      .finally(() => { if (!cancelled) setWalletLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const openMenu = (key: string) => {
    clearMenuTimers();
    setActiveMenuKey(key);
  };

  const scheduleOpenMenu = (key: string) => {
    clearMenuTimers();
    if (activeMenuKey) {
      setActiveMenuKey(key);
      return;
    }
    openMenuTimerRef.current = setTimeout(() => {
      setActiveMenuKey(key);
      openMenuTimerRef.current = null;
    }, 90);
  };

  const scheduleCloseMenus = () => {
    clearMenuTimers();
    closeMenuTimerRef.current = setTimeout(() => {
      setActiveMenuKey(null);
      closeMenuTimerRef.current = null;
    }, 160);
  };

  if (isAdminRoute) {
    return null;
  }

  return (
    <header ref={headerRef} className="relative z-50 border-b border-[#d8e1ee] bg-white/90 text-[#0f172a] shadow-[0_14px_40px_rgba(15,23,42,0.08)] backdrop-blur md:sticky md:top-0">
      <div className="hidden border-b border-[#e6edf6] bg-[#f4f7fb] sm:block">
        <div className="mx-auto flex max-w-[1320px] items-center gap-4 overflow-x-auto px-4 py-1.5 text-[11px] text-[#5b6b7f] sm:justify-end sm:text-xs lg:px-8">
          <Link href="/apply-for-manpower" className="inline-flex shrink-0 items-center gap-2 transition hover:text-[#2457d6]">
            <BriefcaseBusiness className="h-4 w-4" />
            {t.manpower}
          </Link>
          <Link href="/about#contact" className="inline-flex shrink-0 items-center gap-2 transition hover:text-[#2457d6]">
            <Phone className="h-4 w-4" />
            {t.contact}
          </Link>
          <Link href="/admin" className="shrink-0 font-bold text-[#2457d6] transition hover:text-[#0f172a]">
            {t.admin}
          </Link>
        </div>
      </div>

      <div className="border-b border-[#e6edf6] bg-white/95">
        <div className="mx-auto grid max-w-[1320px] grid-cols-[1fr_auto] gap-2.5 px-3 py-2.5 sm:px-4 md:grid-cols-[210px_minmax(260px,1fr)] xl:grid-cols-[250px_minmax(360px,1fr)_auto] xl:items-center xl:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2457d6] text-[15px] font-black text-white shadow-[0_10px_20px_rgba(36,87,214,0.22)] sm:h-9 sm:w-9">
              K
            </span>
            <span className="min-w-0">
              <span className="block text-[17px] font-black leading-none tracking-tight text-[#0f172a] sm:text-[20px]">K-CUBE</span>
              <span className="block text-[8px] font-bold uppercase tracking-[0.18em] text-[#2457d6] sm:text-[10px] sm:tracking-[0.3em]">Korean Ecosystem</span>
            </span>
          </Link>

          <form onSubmit={submitSearch} className="order-3 col-span-full flex min-h-[38px] overflow-hidden rounded-full border border-[#d6dfeb] bg-[#f8fbff] text-[#101012] shadow-[0_8px_18px_rgba(15,23,42,0.06)] focus-within:border-[#2457d6] md:order-none md:col-span-1 md:min-h-[40px]">
            <label className="sr-only" htmlFor="header-search">
              Search K-CUBE
            </label>
            <input
              id="header-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="min-w-0 flex-1 px-3 text-sm text-[#171717] outline-none placeholder:text-[#8f95a3] sm:px-4 sm:text-sm"
              placeholder={t.search}
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex w-11 items-center justify-center bg-[#2457d6] text-white transition hover:bg-[#1f4bb8] sm:w-12"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          <div className="order-2 flex min-w-0 flex-wrap items-center justify-end gap-2 md:order-3 md:col-span-2 md:justify-start xl:order-none xl:col-span-1 xl:justify-end">
            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef3f9] text-[#0f172a] transition hover:bg-[#dbe7f5] md:hidden"
            >
              {mobileMenuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
            </button>
            <div
              className="relative"
              data-language-menu
              onMouseEnter={() => setLanguageMenuOpen(true)}
              onMouseLeave={() => setLanguageMenuOpen(false)}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={languageMenuOpen}
                onClick={() => setLanguageMenuOpen((open) => !open)}
                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-[#d6dfeb] bg-white px-2.5 text-[11px] font-black text-[#2457d6] transition hover:border-[#2457d6] hover:bg-[#f4f7fb] xl:h-9 xl:text-xs"
              >
                <Languages className="h-3.5 w-3.5" />
                {languageLabels[language]}
                <ChevronDown className="h-3 w-3" />
              </button>
              <div
                className={`absolute right-0 top-full z-[140] w-52 pt-2 transition ${
                  languageMenuOpen ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'
                }`}
              >
                <div className="rounded-2xl border border-[#d6dfeb] bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                  {(['en', 'ko', 'hi'] as Language[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setLanguage(option);
                        setLanguageMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-bold transition ${
                        language === option ? 'bg-[#2457d6] text-white' : 'text-[#111827] hover:bg-[#f4f7fb]'
                      }`}
                    >
                      <Globe2 className="h-4 w-4" />
                      {languageLabels[option]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/trip-to-korea"
              className="hidden h-8 shrink-0 items-center gap-2 rounded-full bg-[#2457d6] px-3 text-[11px] font-black text-white transition hover:bg-[#1f4bb8] sm:inline-flex xl:h-9 xl:px-3.5 xl:text-xs"
            >
              <Plane className="h-3.5 w-3.5" />
              {t.koreaTrip}
            </Link>
            {user ? (
              <div className="group/account relative" data-account-menu>
                <button type="button" aria-haspopup="menu" aria-expanded={accountMenuOpen} aria-controls="account-menu" onClick={() => setAccountMenuOpen((open) => !open)} className="flex shrink-0 items-center gap-2 text-[11px] leading-tight xl:text-xs">
                  <User className="h-[18px] w-[18px] text-[#2457d6]" />
                  <span>
                    <span className="block text-[#5b6b7f]">{t.hello}</span>
                    <span className="block text-sm font-bold text-[#0f172a] xl:text-[15px]">
                      {user.fullName} <ChevronDown className="inline h-3.5 w-3.5" />
                    </span>
                  </span>
                </button>
                <div id="account-menu" role="menu" className={`absolute right-0 top-full z-20 w-56 pt-2 transition ${accountMenuOpen ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0'} group-hover/account:visible group-hover/account:opacity-100 group-focus-within/account:visible group-focus-within/account:opacity-100`}>
                  <div className="rounded-2xl border border-[#d6dfeb] bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                    <div className="mb-2 border-b border-[#e6edf6] px-3 pb-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#64748b]">{language === 'ko' ? '내 포인트' : language === 'hi' ? 'मेरे पॉइंट्स' : 'My points'}</p>
                      <p className="mt-1 text-2xl font-black text-[#2457d6]" aria-live="polite">
                        {walletLoading ? <span className="inline-block h-6 w-16 animate-pulse rounded bg-[#e8f0ff]" aria-label="Loading points" /> : walletBalance !== null ? `${walletBalance} pts` : '—'}
                      </p>
                      <Link href="/dashboard" onClick={() => setAccountMenuOpen(false)} className="mt-1 inline-flex text-xs font-black text-[#2457d6] hover:text-[#1f4bb8]">
                        {language === 'ko' ? '포인트 지갑 보기 →' : language === 'hi' ? 'पॉइंट्स वॉलेट देखें →' : 'View points wallet →'}
                      </Link>
                    </div>
                    <Link href="/dashboard" onClick={() => setAccountMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-bold text-[#111827] hover:bg-[#f4f7fb]">
                      Dashboard
                    </Link>
                    <Link href="/profile" onClick={() => setAccountMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-bold text-[#111827] hover:bg-[#f4f7fb]">
                      My profile
                    </Link>
                    <Link href="/rewards" onClick={() => setAccountMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-bold text-[#111827] hover:bg-[#f4f7fb]">
                      Rewards Hub
                    </Link>
                    <button type="button" onClick={signOut} className="block w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-[#b12704] hover:bg-[#f4f7fb]">
                      {t.signOut}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/signin" className="shrink-0 rounded-full border border-[#d6dfeb] px-3 py-1.5 text-xs font-bold text-[#0f172a] hover:border-[#2457d6] hover:text-[#2457d6] xl:text-[13px]">
                  {t.signIn}
                </Link>
                <Link href="/signup" className="shrink-0 rounded-full bg-[#2457d6] px-3 py-1.5 text-xs font-black text-white hover:bg-[#1f4bb8] xl:text-[13px]">
                  {t.signUp}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="border-b border-[#d8e1ee] bg-white px-3 py-3 md:hidden">
          <div className="grid gap-3">
            {user ? (
              <div className="grid gap-1 rounded-2xl border border-[#d6dfeb] bg-[#f8fbff] p-2">
                <p className="px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#64748b]">My points · {walletBalance !== null ? `${walletBalance} pts` : '—'}</p>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="rounded-lg bg-white px-3 py-2 text-sm font-black text-[#2457d6]">View points wallet →</Link>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-bold text-[#0f172a]">Dashboard</Link>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-bold text-[#0f172a]">My profile</Link>
                <Link href="/rewards" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-bold text-[#0f172a]">Rewards Hub</Link>
                <button type="button" onClick={signOut} className="border-t border-[#e6edf6] px-3 pt-2 text-left text-sm font-bold text-[#b12704]">{t.signOut}</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/signin" onClick={() => setMobileMenuOpen(false)} className="inline-flex items-center justify-center rounded-full border border-[#d6dfeb] px-3 py-2 text-sm font-bold text-[#0f172a]">{t.signIn}</Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="inline-flex items-center justify-center rounded-full bg-[#2457d6] px-3 py-2 text-sm font-black text-white">{t.signUp}</Link>
              </div>
            )}
            <Link
              href="/trip-to-korea"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2457d6] px-3 py-3 text-sm font-black text-white"
            >
              <Plane className="h-4 w-4" />
              {t.koreaTrip}
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/study-abroad"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-[#d6dfeb] bg-[#f8fbff] px-3 py-2 text-sm font-black text-[#0f172a] shadow-sm transition hover:border-[#2457d6] hover:text-[#2457d6]"
              >
                Study Abroad
              </Link>
              <Link
                href="/india-pre-selection"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-[#2457d6]/20 bg-[#2457d6]/8 px-3 py-2 text-sm font-black text-[#2457d6]"
              >
                India Pre-Selection
              </Link>
            </div>
            <div className="grid gap-1 rounded-2xl border border-[#d6dfeb] bg-[#f8fbff] p-2">
              {navItems.map((item) => (
                <div key={item.label.en} className="border-b border-[#e6edf6] last:border-b-0">
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-2 py-3 text-sm font-black text-[#0f172a]"
                  >
                    {item.label[language]}
                    {item.dropdown ? <ChevronDown className="h-4 w-4 text-[#7a8797]" /> : null}
                  </Link>
                  {item.dropdown ? (
                    <div className="grid gap-3 px-2 pb-2">
                      {item.dropdown.map((section) => (
                        <div key={section.title.en} className="grid gap-2 rounded-2xl border border-[#e6edf6] bg-white p-2">
                          <p className="px-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#2457d6]">
                            {section.title[language]}
                          </p>
                          {section.links.slice(0, 3).map((link) => (
                            <div key={`${section.title.en}-${link.label.en}`} className="grid gap-1">
                              <Link
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-lg bg-[#f8fbff] px-3 py-2 text-xs font-semibold text-[#4b5563]"
                              >
                                {link.label[language]}
                              </Link>
                              {link.children?.length ? (
                                <div className="grid gap-1 pl-2">
                                  {link.children.slice(0, 2).map((child) => (
                                    <Link
                                      key={`${section.title.en}-${link.label.en}-${child.label.en}`}
                                      href={child.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="rounded-lg border border-[#e6edf6] bg-white px-3 py-2 text-[11px] font-medium text-[#617085]"
                                    >
                                      {child.label[language]}
                                    </Link>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/apply-for-manpower"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d6dfeb] bg-white px-3 py-2 text-xs font-bold text-[#4b5563]"
              >
                <BriefcaseBusiness className="h-4 w-4" />
                {t.manpower}
              </Link>
              <Link
                href="/about#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d6dfeb] bg-white px-3 py-2 text-xs font-bold text-[#4b5563]"
              >
                <Phone className="h-4 w-4" />
                {t.contact}
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <nav
        aria-label="Primary navigation"
        className="group/nav relative hidden border-b border-[#e6edf6] bg-[#f8fbff] md:block"
        onMouseEnter={clearMenuTimers}
        onMouseLeave={scheduleCloseMenus}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) scheduleCloseMenus();
        }}
      >
        <div className="mx-auto flex max-w-[1320px] items-center gap-2 px-3 sm:px-4 lg:px-8">
          <div className="flex min-h-[34px] flex-1 items-center gap-0.5 overflow-visible px-0 lg:min-h-[40px]">
            {navItems.map((item) => {
              const isActive = activeMenuKey === item.label.en;
              if (item.dropdown) {
                return (
                  <button
                    key={item.label.en}
                    type="button"
                    ref={isActive ? activeTriggerRef : undefined}
                    data-mega-trigger
                    aria-controls="desktop-mega-menu"
                    aria-haspopup="menu"
                    aria-expanded={isActive}
                    onMouseEnter={() => scheduleOpenMenu(item.label.en)}
                    onMouseLeave={scheduleCloseMenus}
                    onFocus={(event) => {
                      activeTriggerRef.current = event.currentTarget;
                      openMenu(item.label.en);
                    }}
                    onClick={() => {
                      if (isActive) {
                        closeAllMenus();
                        return;
                      }
                      openMenu(item.label.en);
                    }}
                    className={`flex h-[34px] items-center gap-1 whitespace-nowrap px-2 text-[11px] font-bold transition focus-visible:outline-none sm:h-[38px] sm:px-2.5 sm:text-xs lg:h-[40px] lg:px-3 lg:text-sm ${
                      isActive
                        ? 'relative bg-white text-[#2457d6] outline outline-1 outline-[#2457d6]/25 after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-[#0b4eae]'
                        : 'text-[#0f172a] hover:bg-white hover:text-[#2457d6] hover:outline hover:outline-1 hover:outline-[#d6dfeb]'
                    }`}
                  >
                    {item.label[language]}
                    <ChevronDown className={`h-3.5 w-3.5 transition ${isActive ? 'text-[#2457d6]' : 'text-[#7a8797]'}`} />
                  </button>
                );
              }

              return (
                <Link
                  key={item.label.en}
                  href={item.href}
                  onClick={closeAllMenus}
                  className="flex h-[34px] items-center gap-1 whitespace-nowrap px-2 text-[11px] font-bold text-[#0f172a] transition hover:bg-white hover:outline hover:outline-1 hover:outline-[#d6dfeb] focus-visible:text-[#2457d6] focus-visible:outline-none sm:h-[38px] sm:px-2.5 sm:text-xs lg:h-[40px] lg:px-3 lg:text-sm"
                >
                  {item.label[language]}
                </Link>
              );
            })}
          </div>
          <Link
            href="/study-abroad"
            onClick={closeAllMenus}
            className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[#d6dfeb] bg-white px-2.5 py-1 text-[11px] font-black text-[#0f172a] shadow-sm transition hover:border-[#2457d6] hover:text-[#2457d6] xl:inline-flex xl:px-3 xl:text-xs"
          >
            Study Abroad
          </Link>
          <a
            href="https://www.instagram.com/k_cube_store/"
            target="_blank"
            rel="noreferrer"
            onClick={closeAllMenus}
            aria-label="K-CUBE on Instagram"
            className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[#dd2a7b]/35 bg-[linear-gradient(135deg,#f58529,#dd2a7b_45%,#8134af_75%,#515bd4)] px-2.5 py-1 text-[11px] font-black text-white shadow-sm transition hover:brightness-105 xl:inline-flex xl:px-3 xl:text-xs"
          >
            <Camera className="h-3.5 w-3.5" />
            Instagram
          </a>
          {activeMenu?.dropdown ? (
            <div
              className="pointer-events-none absolute inset-x-0 top-full z-[130]"
            >
              <MegaMenu
                key={`${activeMenu.label.en}-${activeMenu.dropdown.length}`}
                sections={activeMenu.dropdown}
                language={language}
                onNavigate={closeAllMenus}
                onMouseEnter={() => openMenu(activeMenu.label.en)}
                onMouseLeave={scheduleCloseMenus}
                variant={activeMenu.label.en === 'All' ? 'all' : 'default'}
              />
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
};

export default Header;
