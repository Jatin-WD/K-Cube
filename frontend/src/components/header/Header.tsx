"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BriefcaseBusiness, ChevronDown, Globe2, Languages, Menu, Phone, Plane, Search, User, X } from 'lucide-react';
import MegaMenu from './MegaMenu';
import { copy, navItems } from '@/lib/kcubeContent';
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
  const headerRef = useRef<HTMLElement | null>(null);
  const openMenuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeMenuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const user = useAppStore((state) => state.user);
  const signOut = useAppStore((state) => state.signOut);
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const t = copy[language];
  const activeMenu = navItems.find((item) => item.label.en === activeMenuKey && item.dropdown?.length) ?? null;

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
  };

  useEffect(
    () => {
      const handlePointerDown = (event: MouseEvent | PointerEvent) => {
        if (!headerRef.current) return;
        if (!headerRef.current.contains(event.target as Node)) {
          setActiveMenuKey(null);
          setLanguageMenuOpen(false);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setActiveMenuKey(null);
          setLanguageMenuOpen(false);
        }
      };

      document.addEventListener('pointerdown', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        clearMenuTimers();
        document.removeEventListener('pointerdown', handlePointerDown);
        document.removeEventListener('keydown', handleKeyDown);
      };
    },
    [],
  );

  const openMenu = (key: string) => {
    clearMenuTimers();
    setActiveMenuKey(key);
  };

  const scheduleOpenMenu = (key: string) => {
    clearMenuTimers();
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
    }, 140);
  };

  if (isAdminRoute) {
    return null;
  }

  return (
    <header ref={headerRef} className="relative z-50 border-b border-[#232f3e] bg-[#131921] text-white shadow-[0_10px_24px_rgba(0,0,0,0.24)] md:sticky md:top-0">
      <div className="hidden border-b border-[#232f3e] bg-[#131921] sm:block">
        <div className="mx-auto flex max-w-[1760px] items-center gap-4 overflow-x-auto px-4 py-1.5 text-[11px] text-[#d5d9d9] sm:justify-end sm:text-xs lg:px-10">
          <Link href="/apply-for-manpower" className="inline-flex shrink-0 items-center gap-2 transition hover:text-[#f3a847]">
            <BriefcaseBusiness className="h-4 w-4" />
            {t.manpower}
          </Link>
          <Link href="/about#contact" className="inline-flex shrink-0 items-center gap-2 transition hover:text-[#f3a847]">
            <Phone className="h-4 w-4" />
            {t.contact}
          </Link>
          <Link href="/admin" className="shrink-0 font-bold text-[#f3a847] transition hover:text-white">
            {t.admin}
          </Link>
        </div>
      </div>

      <div className="border-b border-[#232f3e] bg-[#131921]">
        <div className="mx-auto grid max-w-[1760px] grid-cols-[1fr_auto] gap-2.5 px-3 py-2.5 sm:px-4 md:grid-cols-[210px_minmax(260px,1fr)] xl:grid-cols-[250px_minmax(360px,1fr)_auto] xl:items-center xl:px-10">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#f3a847] text-[15px] font-black text-[#111827] sm:h-9 sm:w-9">
              K
            </span>
            <span className="min-w-0">
              <span className="block text-[17px] font-black leading-none tracking-tight text-white sm:text-[20px]">K-CUBE</span>
              <span className="block text-[8px] font-bold uppercase tracking-[0.18em] text-[#f3a847] sm:text-[10px] sm:tracking-[0.3em]">Korean Ecosystem</span>
            </span>
          </Link>

          <form className="order-3 col-span-full flex min-h-[38px] overflow-hidden rounded-sm border-2 border-transparent bg-white text-[#101012] shadow-[0_8px_18px_rgba(0,0,0,0.2)] focus-within:border-[#f3a847] md:order-none md:col-span-1 md:min-h-[40px]">
            <label className="sr-only" htmlFor="header-search">
              Search K-CUBE
            </label>
            <input
              id="header-search"
              className="min-w-0 flex-1 px-3 text-sm text-[#171717] outline-none placeholder:text-[#8f95a3] sm:px-4 sm:text-sm"
              placeholder={t.search}
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex w-11 items-center justify-center bg-[#f3a847] text-[#111827] transition hover:bg-[#ffa41c] sm:w-12"
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
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#232f3e] text-white transition hover:bg-[#37475a] md:hidden"
            >
              {mobileMenuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
            </button>
            <div
              className="relative"
              onMouseEnter={() => setLanguageMenuOpen(true)}
              onMouseLeave={() => setLanguageMenuOpen(false)}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={languageMenuOpen}
                onClick={() => setLanguageMenuOpen((open) => !open)}
                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-sm border border-[#f3a847]/50 bg-[#232f3e] px-2.5 text-[11px] font-black text-[#f3a847] transition hover:bg-[#f3a847] hover:text-[#111827] xl:h-9 xl:text-xs"
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
                <div className="rounded-sm border border-[#d5d9d9] bg-white p-2 shadow-2xl">
                {(['en', 'ko', 'hi'] as Language[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setLanguage(option);
                      setLanguageMenuOpen(false);
                    }}
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
            </div>

            <Link
              href="/trip-to-korea"
              className="hidden h-8 shrink-0 items-center gap-2 rounded-sm bg-[#ffd814] px-3 text-[11px] font-black text-[#111827] transition hover:bg-[#f7ca00] sm:inline-flex xl:h-9 xl:px-3.5 xl:text-xs"
            >
              <Plane className="h-3.5 w-3.5" />
              {t.koreaTrip}
            </Link>
            {user ? (
              <div className="group/account relative">
                <button type="button" aria-haspopup="menu" className="flex shrink-0 items-center gap-2 text-[11px] leading-tight xl:text-xs">
                  <User className="h-[18px] w-[18px] text-[#c8d2e1]" />
                  <span>
                    <span className="block text-[#b9c5d6]">{t.hello}</span>
                    <span className="block text-sm font-bold text-white xl:text-[15px]">
                      {user.fullName} <ChevronDown className="inline h-3.5 w-3.5" />
                    </span>
                  </span>
                </button>
                <div className="invisible absolute right-0 top-full z-20 w-44 pt-2 opacity-0 transition group-hover/account:visible group-hover/account:opacity-100 group-focus-within/account:visible group-focus-within/account:opacity-100">
                  <div className="rounded-sm border border-[#d5d9d9] bg-white p-2 shadow-2xl">
                    <Link href="/rewards" className="block rounded-sm px-3 py-2 text-sm font-bold text-[#111827] hover:bg-[#f7fafa]">
                      {t.pointsWallet}
                    </Link>
                    <Link href="/dashboard" className="block rounded-sm px-3 py-2 text-sm font-bold text-[#111827] hover:bg-[#f7fafa]">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="block rounded-sm px-3 py-2 text-sm font-bold text-[#111827] hover:bg-[#f7fafa]">
                      My profile
                    </Link>
                    <button type="button" onClick={signOut} className="block w-full rounded-sm px-3 py-2 text-left text-sm font-bold text-[#b12704] hover:bg-[#f7fafa]">
                      {t.signOut}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/signin" className="shrink-0 rounded-sm border border-white/30 px-3 py-1.5 text-xs font-bold text-white hover:border-[#f3a847] hover:text-[#f3a847] xl:text-[13px]">
                  {t.signIn}
                </Link>
                <Link href="/signup" className="shrink-0 rounded-sm bg-[#ffd814] px-3 py-1.5 text-xs font-black text-[#111827] hover:bg-[#f7ca00] xl:text-[13px]">
                  {t.signUp}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="border-b border-[#232f3e] bg-[#232f3e] px-3 py-3 md:hidden">
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-sm border border-white/20 px-3 py-2 text-sm font-bold text-white"
              >
                {t.signIn}
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-sm bg-[#ffd814] px-3 py-2 text-sm font-black text-[#111827]"
              >
                {t.signUp}
              </Link>
            </div>
            <Link
              href="/trip-to-korea"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#ffd814] px-3 py-3 text-sm font-black text-[#111827]"
            >
              <Plane className="h-4 w-4" />
              {t.koreaTrip}
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/study-abroad"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-sm border border-[#ffd814] bg-[#ffd814] px-3 py-2 text-sm font-black text-[#111827] shadow-sm transition hover:bg-[#f7ca00]"
              >
                Study Abroad
              </Link>
              <Link
                href="/india-pre-selection"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-sm border border-[#f3a847]/70 bg-[#f3a847]/12 px-3 py-2 text-sm font-black text-[#f3a847]"
              >
                India Pre-Selection
              </Link>
            </div>
            <div className="grid gap-1 rounded-sm border border-white/10 bg-[#131921] p-2">
              {navItems.map((item) => (
                <div key={item.label.en} className="border-b border-white/10 last:border-b-0">
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-2 py-3 text-sm font-black text-white"
                  >
                    {item.label[language]}
                    {item.dropdown ? <ChevronDown className="h-4 w-4 text-[#8792a3]" /> : null}
                  </Link>
                  {item.dropdown ? (
                    <div className="grid gap-3 px-2 pb-2">
                      {item.dropdown.map((section) => (
                        <div key={section.title.en} className="grid gap-2 rounded-sm border border-white/10 bg-white/[0.03] p-2">
                          <p className="px-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#f3a847]">
                            {section.title[language]}
                          </p>
                          {section.links.slice(0, 3).map((link) => (
                            <div key={`${section.title.en}-${link.label.en}`} className="grid gap-1">
                              <Link
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-sm bg-white/[0.04] px-3 py-2 text-xs font-semibold text-[#d5d9d9]"
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
                                      className="rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2 text-[11px] font-medium text-[#b9c5d6]"
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
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/10 bg-[#131921] px-3 py-2 text-xs font-bold text-[#d5d9d9]"
              >
                <BriefcaseBusiness className="h-4 w-4" />
                {t.manpower}
              </Link>
              <Link
                href="/about#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/10 bg-[#131921] px-3 py-2 text-xs font-bold text-[#d5d9d9]"
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
        className="group/nav relative hidden border-b border-[#232f3e] bg-[#232f3e] md:block"
        onMouseEnter={clearMenuTimers}
        onMouseLeave={scheduleCloseMenus}
      >
        <div className="mx-auto flex max-w-[1760px] items-center gap-2 px-3 sm:px-4 lg:px-10">
          <div className="flex min-h-[34px] flex-1 items-center gap-0.5 overflow-visible px-0 lg:min-h-[40px]">
            {navItems.map((item) => {
              const isActive = activeMenuKey === item.label.en;
              if (item.dropdown) {
                return (
                  <button
                    key={item.label.en}
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isActive}
                    onMouseEnter={() => scheduleOpenMenu(item.label.en)}
                    onMouseLeave={scheduleCloseMenus}
                    onFocus={() => openMenu(item.label.en)}
                    onClick={() => {
                      if (isActive) {
                        closeAllMenus();
                        return;
                      }
                      openMenu(item.label.en);
                    }}
                    className={`flex h-[34px] items-center gap-1 whitespace-nowrap px-2 text-[11px] font-bold transition focus-visible:outline-none sm:h-[38px] sm:px-2.5 sm:text-xs lg:h-[40px] lg:px-3 lg:text-sm ${
                      isActive
                        ? 'bg-white/5 text-[#f3a847] outline outline-1 outline-white/30'
                        : 'text-white hover:outline hover:outline-1 hover:outline-white'
                    }`}
                  >
                    {item.label[language]}
                    <ChevronDown className={`h-3.5 w-3.5 transition ${isActive ? 'text-[#f3a847]' : 'text-[#8792a3]'}`} />
                  </button>
                );
              }

              return (
                <Link
                  key={item.label.en}
                  href={item.href}
                  onClick={closeAllMenus}
                  className="flex h-[34px] items-center gap-1 whitespace-nowrap px-2 text-[11px] font-bold text-white transition hover:outline hover:outline-1 hover:outline-white focus-visible:text-[#f3a847] focus-visible:outline-none sm:h-[38px] sm:px-2.5 sm:text-xs lg:h-[40px] lg:px-3 lg:text-sm"
                >
                  {item.label[language]}
                </Link>
              );
            })}
          </div>
          <Link
            href="/study-abroad"
            onClick={closeAllMenus}
            className="hidden shrink-0 items-center gap-1.5 rounded-sm border border-[#ffd814] bg-[#ffd814] px-2.5 py-1 text-[11px] font-black text-[#111827] shadow-sm transition hover:bg-[#f7ca00] xl:inline-flex xl:px-3 xl:text-xs"
          >
            Study Abroad
          </Link>
          <Link
            href="/india-pre-selection"
            onClick={closeAllMenus}
            className="hidden shrink-0 items-center gap-1.5 rounded-sm border border-[#f3a847]/60 bg-[#f3a847]/12 px-2.5 py-1 text-[11px] font-black text-[#f3a847] transition hover:bg-[#f3a847] hover:text-[#111827] xl:inline-flex xl:px-3 xl:text-xs"
          >
            India Pre-Selection
          </Link>
          {activeMenu?.dropdown ? (
            <div
              className="absolute inset-x-0 top-full z-[130] pt-0"
              onMouseEnter={() => openMenu(activeMenu.label.en)}
              onMouseLeave={scheduleCloseMenus}
            >
              <MegaMenu
                key={`${activeMenu.label.en}-${activeMenu.dropdown.length}`}
                sections={activeMenu.dropdown}
                language={language}
                onNavigate={closeAllMenus}
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
