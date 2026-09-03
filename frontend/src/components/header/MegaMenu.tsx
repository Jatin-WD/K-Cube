'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ExternalLink } from 'lucide-react';
import type { Language } from '@/store/useAppStore';
import type { LocalText, MegaSection, MenuLink } from '@/lib/kcubeContent';
import { allMenuCategories } from '@/lib/kcubeContent';

interface MegaMenuProps {
  sections: MegaSection[];
  language: Language;
  onNavigate?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  variant?: 'default' | 'all';
}

const getLinkKey = (link: MenuLink) => `${link.label.en}-${link.href}`;

const panelCard =
  'flex w-full items-start justify-between gap-3 rounded-[10px] border px-4 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b4eae]';

const festivalPreview = (childHref: string | undefined): { eyebrow: LocalText; title: LocalText; badge: LocalText; description: LocalText; cta: LocalText } => {
  if (childHref === '/india-pre-selection/announcement') {
    return {
      eyebrow: { en: 'OFFICIAL UPDATES', ko: '공식 업데이트', hi: 'OFFICIAL UPDATES' },
      title: { en: 'Follow the 2026 Festival Journey', ko: '2026 축제 여정을 따라가세요', hi: '2026 festival journey follow karein' },
      badge: { en: 'NEXT OFFICIAL STAGE · 30 SEP 2026', ko: '다음 공식 단계 · 2026년 9월 30일', hi: 'NEXT OFFICIAL STAGE · 30 SEP 2026' },
      description: { en: 'Stay informed about selection updates, official rounds, participant notices and festival announcements.', ko: '선발 업데이트, 공식 라운드, 참가자 공지 및 축제 안내를 확인하세요.', hi: 'Selection updates, official rounds, participant notices aur festival announcements se updated rahein.' },
      cta: { en: 'View Latest Updates', ko: '최신 업데이트 보기', hi: 'Latest updates dekhein' },
    };
  }

  if (childHref === '/india-pre-selection/apply') {
    return {
      eyebrow: { en: '2026 APPLICATION', ko: '2026 신청', hi: '2026 APPLICATION' },
      title: { en: 'Applications Are Closed', ko: '신청이 마감되었습니다', hi: 'Applications band ho chuki hain' },
      badge: { en: 'COMPLETED ✓', ko: '완료 ✓', hi: 'COMPLETED ✓' },
      description: { en: 'The India Pre-Selection application period concluded on 30 August 2026.', ko: '인도 예선 신청 기간은 2026년 8월 30일에 종료되었습니다.', hi: 'India Pre-Selection application period 30 August 2026 ko conclude ho gaya.' },
      cta: { en: 'View Application Status', ko: '신청 상태 보기', hi: 'Application status dekhein' },
    };
  }

  return {
    eyebrow: { en: 'FESTIVAL INFORMATION', ko: '축제 정보', hi: 'FESTIVAL INFORMATION' },
    title: { en: 'Discover the ITAEWON World Music Spirit Festival', ko: 'ITAEWON World Music Spirit Festival 알아보기', hi: 'ITAEWON World Music Spirit Festival ko samjhein' },
    badge: { en: 'INDIA PRE-SELECTION · COMPLETED', ko: '인도 예선 · 완료', hi: 'INDIA PRE-SELECTION · COMPLETED' },
    description: { en: "Explore the festival story, official India representation, important dates, previous festival moments and India's journey to Itaewon.", ko: '축제 이야기, 공식 인도 대표, 주요 일정, 지난 축제의 순간과 인도에서 ITAEWON으로 이어지는 여정을 확인하세요.', hi: 'Festival story, official India representation, important dates aur India se Itaewon tak ki journey dekhein.' },
    cta: { en: 'Explore Festival', ko: '축제 둘러보기', hi: 'Festival explore karein' },
  };
};

const MegaMenu = ({ sections, language, onNavigate, onMouseEnter, onMouseLeave, variant = 'default' }: MegaMenuProps) => {
  const initialFeaturedIndex = sections[0]?.links.findIndex((link) => link.featured) ?? -1;
  const [activeLinkIndex, setActiveLinkIndex] = useState(initialFeaturedIndex >= 0 ? initialFeaturedIndex : 0);
  const [activeChildIndex, setActiveChildIndex] = useState(0);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const isAllMenu = variant === 'all';

  const activeSection = sections[0];
  const serviceLinks = activeSection?.links ?? [];
  const activeLink = serviceLinks[activeLinkIndex] ?? serviceLinks[0];
  const activeChildren = activeLink?.children ?? [];
  const activeChild = activeChildren[activeChildIndex] ?? activeChildren[0];
  const openHref = activeChild?.href ?? activeLink?.href;
  const activeCategory = allMenuCategories[activeCategoryIndex] ?? allMenuCategories[0];
  const categoryServices = activeCategory?.services ?? [];
  const activeCategoryService = categoryServices[activeServiceIndex] ?? categoryServices[0];
  const activeCategoryChildren = activeCategoryService?.children ?? [];
  const activeCategoryChild = activeCategoryChildren[activeChildIndex] ?? activeCategoryChildren[0];
  const activeCategoryHref = activeCategoryChild?.href ?? activeCategoryService?.href ?? activeCategory?.href;
  const isItaewonService = activeLink?.href === '/india-pre-selection';
  const isAllItaewonService = activeCategoryService?.href === '/india-pre-selection';
  const selectedFestivalChild = isAllItaewonService ? activeCategoryChild : activeChild;
  const selectedFestivalPreview = festivalPreview(selectedFestivalChild?.href);

  if (!activeSection) return null;

  if (isAllMenu) {
    return (
      <div id="desktop-mega-menu" data-mega-panel className="pointer-events-auto mx-auto w-full max-w-[1320px] px-3 sm:px-4 lg:px-6" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="max-h-[calc(100vh-172px)] overflow-y-auto overflow-x-hidden rounded-b-[14px] border border-t-0 border-[#dce6f0] bg-[#f7fafd] p-2.5 pb-3 shadow-[0_18px_40px_rgba(15,55,95,0.12)]">
          <div className="mb-2.5 flex flex-wrap items-center gap-2 rounded-[10px] border border-[#dce6f0] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#486581]">
            <span className="mr-1 text-[#0b4eae]">Explore by path</span>
            <span className="rounded-full bg-[#eaf3ff] px-2 py-1 text-[#0b4eae]">1 Choose category</span>
            <span className="text-[#9aaabd]" aria-hidden="true">→</span>
            <span className="rounded-full bg-[#f5f9fe] px-2 py-1">2 Choose service</span>
            <span className="text-[#9aaabd]" aria-hidden="true">→</span>
            <span className="rounded-full bg-[#f5f9fe] px-2 py-1">3 Choose a page</span>
            <span className="text-[#9aaabd]" aria-hidden="true">→</span>
            <span className="rounded-full bg-[#eefaf4] px-2 py-1 text-[#168354]">4 View preview</span>
          </div>
          <div className="grid min-h-0 items-start gap-3 lg:grid-cols-[minmax(190px,0.78fr)_minmax(210px,0.82fr)_minmax(260px,0.98fr)_minmax(340px,1.45fr)]">
          <aside className="flex min-h-0 flex-col overflow-hidden rounded-[12px] border border-[#dce6f0] bg-white">
            <div className="border-b border-[#eef0f1] px-4 py-3">
              <div className="flex items-center justify-between gap-2"><p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#2457d6]">1 · Categories</p><span className="rounded-full bg-[#eaf3ff] px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#0b4eae]">Start here</span></div>
            </div>
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
              {allMenuCategories.map((category, index) => {
                const active = index === activeCategoryIndex;
                return (
                  <Link
                    key={`${category.label.en}-${category.href}`}
                    href={category.href}
                    onClick={() => {
                      setActiveCategoryIndex(index);
                      setActiveServiceIndex(0);
                      setActiveChildIndex(0);
                      onNavigate?.();
                    }}
                    onMouseEnter={() => {
                      setActiveCategoryIndex(index);
                      setActiveServiceIndex(0);
                      setActiveChildIndex(0);
                    }}
                    onFocus={() => {
                      setActiveCategoryIndex(index);
                      setActiveServiceIndex(0);
                      setActiveChildIndex(0);
                    }}
                    className={`${panelCard} cursor-pointer ${
                      active
                        ? 'border-[#0b4eae] bg-[#eaf3ff] text-[#102a43]'
                        : 'border-transparent bg-[#f5f9fe] text-[#102a43] hover:border-[#dce6f0] hover:bg-white'
                    }`}
                    aria-current={active ? 'true' : undefined}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black">{category.label[language]}</span>
                      <span className="mt-1 block text-[11px] font-semibold text-[#486581]">
                        {category.services.length} service{category.services.length === 1 ? '' : 's'}
                      </span>
                    </span>
                    <ChevronRight className={`mt-0.5 h-4 w-4 shrink-0 ${active ? 'text-[#0b4eae]' : 'text-[#6b7c93]'}`} />
                  </Link>
                );
              })}
            </div>
          </aside>

          <section className="flex min-h-0 flex-col overflow-hidden rounded-[12px] border border-[#dce6f0] bg-white">
            <div className="border-b border-[#eef0f1] px-4 py-3">
              <div className="flex items-center justify-between gap-2"><p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#2457d6]">2 · Services</p><span className="rounded-full bg-[#f5f9fe] px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#486581]">Choose one</span></div>
            </div>
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
              {categoryServices.map((service, index) => {
                const active = index === activeServiceIndex;
                return (
                  <Link
                    key={getLinkKey(service)}
                    href={service.href}
                    onClick={() => {
                      setActiveServiceIndex(index);
                      setActiveChildIndex(0);
                      onNavigate?.();
                    }}
                    onMouseEnter={() => {
                      setActiveServiceIndex(index);
                      setActiveChildIndex(0);
                    }}
                    onFocus={() => {
                      setActiveServiceIndex(index);
                      setActiveChildIndex(0);
                    }}
                    className={`${panelCard} cursor-pointer ${
                      service.featured
                        ? active
                          ? 'border-[#0b4eae] bg-[#eaf3ff] text-[#102a43] shadow-[0_8px_18px_rgba(11,78,174,0.10)]'
                          : 'border-[#dce6f0] bg-[#f7fafd] text-[#102a43] hover:border-[#9fc1ee] hover:bg-white'
                        : active
                          ? 'border-[#0b4eae] bg-[#eaf3ff] text-[#102a43]'
                          : 'border-transparent bg-[#f5f9fe] text-[#102a43] hover:border-[#dce6f0] hover:bg-white'
                    }`}
                    aria-current={active ? 'true' : undefined}
                  >
                    <span className="min-w-0">
                      <span className={`block text-sm font-black ${service.href === '/india-pre-selection' ? 'line-clamp-2 leading-5' : 'truncate'}`}>{service.label[language]}</span>
                      <span className="mt-1 block text-[11px] font-semibold text-[#486581]">
                        {service.status?.[language] ?? (service.children?.length ? `${service.children.length} step${service.children.length === 1 ? '' : 's'}` : 'Open service')}
                      </span>
                      {service.featured ? (
                        <span className="mt-2 inline-flex rounded-full bg-[#dceaff] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#0b4eae]">
                          Featured
                        </span>
                      ) : null}
                    </span>
                    <ChevronRight className={`mt-0.5 h-4 w-4 shrink-0 ${active ? 'text-[#0b4eae]' : 'text-[#6b7c93]'}`} />
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="flex min-h-0 flex-col overflow-hidden rounded-[12px] border border-[#dce6f0] bg-white">
            <div className="border-b border-[#eef0f1] px-4 py-3">
              <div className="flex items-center justify-between gap-2"><p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0b4eae]">3 · Pages</p><span className="rounded-full bg-[#f5f9fe] px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#486581]">Choose one</span></div>
            </div>
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
              {activeCategoryChildren.length ? (
                activeCategoryChildren.map((child, index) => {
                  const active = index === activeChildIndex;
                  return (
                    <Link
                      key={getLinkKey(child)}
                      href={child.href}
                      onClick={() => {
                        setActiveChildIndex(index);
                        onNavigate?.();
                      }}
                      onMouseEnter={() => setActiveChildIndex(index)}
                      onFocus={() => setActiveChildIndex(index)}
                      className={`${panelCard} cursor-pointer ${
                        active
                          ? 'border-[#0b4eae] bg-[#eaf3ff]'
                          : 'border-transparent bg-[#f5f9fe] hover:border-[#dce6f0] hover:bg-white'
                      }`}
                      aria-current={active ? 'true' : undefined}
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-black text-[#102a43]">{child.label[language]}</span>
                        <span className="mt-1 block text-xs leading-5 text-[#486581]">{child.description[language]}</span>
                      </span>
                      <span className={`ml-3 inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${child.href === '/india-pre-selection/apply' ? 'border border-[#b8e0cf] bg-[#eefaf4] text-[#168354]' : child.href === '/india-pre-selection/announcement' ? 'bg-[#e8f0ff] text-[#0b4eae]' : 'bg-[#f5f9fe] text-[#486581]'}`}>
                        {child.status?.[language] ?? `Step ${index + 1}`}
                      </span>
                    </Link>
                  );
                })
              ) : (
                <div className="rounded-[10px] border border-[#dce6f0] bg-[#f5f9fe] px-4 py-4 text-sm text-[#486581]">
                  This category opens directly.
                </div>
              )}
            </div>
          </section>

          <aside className="flex min-h-0 flex-col overflow-hidden rounded-[12px] border border-[#dce6f0] bg-white p-4 pb-6 text-[#102a43] shadow-[0_10px_24px_rgba(15,55,95,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center justify-between gap-2"><p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0b4eae]">4 · Preview</p><span className="rounded-full bg-[#eefaf4] px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#168354]">Selected</span></div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1 pb-2">
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-[#0b4eae]">{isAllItaewonService ? selectedFestivalPreview.eyebrow[language] : activeCategory?.label[language]}</p>
              <h3 className="mt-2 text-[clamp(1.4rem,1.8vw,1.95rem)] font-black leading-[1.12] text-[#102a43]">{isAllItaewonService ? selectedFestivalPreview.title[language] : activeCategoryService?.label[language]}</h3>
              {isAllItaewonService ? <p className="mt-2 inline-flex rounded-full border border-[#b8e0cf] bg-[#eefaf4] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#168354]">{selectedFestivalPreview.badge[language]}</p> : null}
              {activeCategoryService?.featured && !isAllItaewonService ? (
                <p className="mt-2 inline-flex rounded-full border border-[#f59e0b]/40 bg-[#fff8e8] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#b36a00]">
                  K-Pop spotlight
                </p>
              ) : null}
              <p className="mt-3 text-sm leading-6 text-[#486581]">{isAllItaewonService ? selectedFestivalPreview.description[language] : activeCategoryService?.description[language]}</p>

              {isAllItaewonService ? <div className="mt-4 space-y-2 rounded-[10px] border border-[#dce6f0] bg-[#f8fbff] p-3"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b4eae]">2026 Journey</p><div className="grid gap-2 text-xs"><div className="flex items-center justify-between gap-2"><span><strong>30 AUG</strong> · India Pre-Selection</span><span className="font-black text-[#168354]">COMPLETED ✓</span></div><div className="flex items-center justify-between gap-2"><span><strong>30 SEP</strong> · Official Second Round</span><span className="font-black text-[#b36a00]">UPCOMING</span></div><div className="flex items-center justify-between gap-2"><span><strong>4–6 OCT</strong> · Festival, Seoul</span><span className="font-black text-[#b36a00]">UPCOMING</span></div></div></div> : null}

              {activeCategoryChild && !isAllItaewonService ? (
                <div className="mt-4 rounded-[10px] border border-[#f3d39b] bg-[#fffaf0] p-4 shadow-[0_8px_18px_rgba(15,55,95,0.05)]">
                  <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#b36a00]">Inside this service</p>
                  <Link href={activeCategoryChild.href} onClick={onNavigate} className="mt-2 block">
                    <span className="block text-base font-black text-[#102a43]">{activeCategoryChild.label[language]}</span>
                    <span className="mt-1 block text-sm leading-6 text-[#486581]">{activeCategoryChild.description[language]}</span>
                  </Link>
                </div>
              ) : null}

              {!isAllItaewonService ? <div className="mt-4 flex flex-wrap gap-2">{activeCategoryService?.points ? <span className="rounded-full border border-[#f3d39b] bg-[#fff8e8] px-4 py-2 text-sm font-black tracking-[0.02em] text-[#9a5b00]">+{activeCategoryService.points} points</span> : null}<span className="rounded-full border border-[#d8e1ee] bg-[#f8fbff] px-4 py-2 text-sm font-black text-[#475569]">{activeCategoryService?.external ? 'External service' : 'Internal service'}</span></div> : null}

              {activeCategoryHref ? (
                activeCategoryService?.external ? (
                  <a
                    href={activeCategoryHref}
                    target="_blank"
                    rel="noreferrer"
                    onClick={onNavigate}
                    className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-[#0b4eae] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#073a82]"
                  >
                    Open external service
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    href={activeCategoryHref}
                    onClick={onNavigate}
                    className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-[#0b4eae] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#073a82]"
                  >
                    {isAllItaewonService ? selectedFestivalPreview.cta[language] : 'Open service'}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )
              ) : null}
            </div>
          </aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="desktop-mega-menu" data-mega-panel className="pointer-events-auto mx-auto w-full max-w-[1320px] px-3 sm:px-4 lg:px-6" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div
        className={`grid max-h-[calc(100vh-172px)] min-h-0 gap-2.5 overflow-y-auto overflow-x-hidden rounded-b-[14px] border border-t-0 border-[#dce6f0] bg-[#f7fafd] p-2.5 shadow-[0_18px_40px_rgba(15,55,95,0.12)] ${
          isAllMenu
            ? 'lg:grid-cols-[minmax(250px,0.96fr)_minmax(250px,0.92fr)_minmax(300px,1.06fr)_minmax(260px,0.92fr)]'
            : 'lg:grid-cols-[minmax(240px,0.92fr)_minmax(260px,1fr)_minmax(300px,1.04fr)]'
        }`}
      >
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-[12px] border border-[#dce6f0] bg-white">
          <div className="border-b border-[#eef0f1] px-4 py-3">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#2457d6]">Services</p>
          </div>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            {serviceLinks.map((link, index) => {
              const active = index === activeLinkIndex;
              return (
                <Link
                  key={getLinkKey(link)}
                  href={link.href}
                  onClick={() => {
                    setActiveLinkIndex(index);
                    setActiveChildIndex(0);
                    onNavigate?.();
                  }}
                  onMouseEnter={() => {
                    setActiveLinkIndex(index);
                    setActiveChildIndex(0);
                  }}
                  onFocus={() => {
                    setActiveLinkIndex(index);
                    setActiveChildIndex(0);
                  }}
                  className={`${panelCard} cursor-pointer ${
                    link.featured
                      ? active
                        ? 'border-[#0b4eae] bg-[#eaf3ff] text-[#102a43] shadow-[0_8px_18px_rgba(11,78,174,0.10)]'
                        : 'border-[#dce6f0] bg-[#f7fafd] text-[#102a43] hover:border-[#9fc1ee] hover:bg-white'
                      : active
                        ? 'border-[#0b4eae] bg-[#eaf3ff] text-[#102a43]'
                        : 'border-transparent bg-[#f5f9fe] text-[#102a43] hover:border-[#dce6f0] hover:bg-white'
                  }`}
                >
                  <span className="min-w-0">
                    <span className={`block text-sm font-black ${link.href === '/india-pre-selection' ? 'line-clamp-2 leading-5' : 'truncate'}`}>{link.label[language]}</span>
                    <span className="mt-1 block text-[11px] font-semibold text-[#486581]">
                      {link.status?.[language] ?? (link.children?.length ? `${link.children.length} step${link.children.length === 1 ? '' : 's'}` : 'Open service')}
                    </span>
                    {link.featured ? (
                      <span className="mt-2 inline-flex rounded-full bg-[#dceaff] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#0b4eae]">
                        Featured
                      </span>
                    ) : null}
                  </span>
                  <ChevronRight className={`mt-0.5 h-4 w-4 shrink-0 ${active ? 'text-[#0b4eae]' : 'text-[#6b7c93]'}`} />
                </Link>
              );
            })}
          </div>
        </aside>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-[12px] border border-[#dce6f0] bg-white">
          <div className="border-b border-[#eef0f1] px-4 py-3">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#2457d6]">Sub services</p>
          </div>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            {activeChildren.length ? (
              activeChildren.map((child, index) => {
                const active = index === activeChildIndex;
                return (
                  <Link
                    key={getLinkKey(child)}
                    href={child.href}
                    onClick={() => {
                      setActiveChildIndex(index);
                      onNavigate?.();
                    }}
                    onMouseEnter={() => setActiveChildIndex(index)}
                    onFocus={() => setActiveChildIndex(index)}
                    className={`${panelCard} cursor-pointer ${
                      active
                        ? 'border-[#2457d6] bg-[#e8f0ff]'
                        : 'border-transparent bg-[#f5f9fe] hover:border-[#dce6f0] hover:bg-white'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-black text-[#102a43]">{child.label[language]}</span>
                      <span className="mt-1 block text-xs leading-5 text-[#486581]">{child.description[language]}</span>
                    </span>
                    <span className={`ml-3 inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${child.href === '/india-pre-selection/apply' ? 'border border-[#b8e0cf] bg-[#eefaf4] text-[#168354]' : child.href === '/india-pre-selection/announcement' ? 'bg-[#e8f0ff] text-[#0b4eae]' : 'bg-[#f5f9fe] text-[#486581]'}`}>
                      {child.status?.[language] ?? `Step ${index + 1}`}
                    </span>
                  </Link>
                );
              })
            ) : (
              <div className="rounded-[10px] border border-[#dce6f0] bg-[#f5f9fe] px-4 py-4 text-sm text-[#486581]">
                This service opens directly.
              </div>
            )}
          </div>
        </section>

          <aside className="flex min-h-0 flex-col overflow-hidden rounded-[12px] border border-[#dce6f0] bg-white p-4 text-[#102a43] shadow-[0_10px_24px_rgba(15,55,95,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0b4eae]">Service preview</p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-[#0b4eae]">{isItaewonService ? selectedFestivalPreview.eyebrow[language] : activeSection.title[language]}</p>
            <h3 className="mt-2 text-[clamp(1.4rem,1.8vw,1.95rem)] font-black leading-[1.12] text-[#102a43]">{isItaewonService ? selectedFestivalPreview.title[language] : activeLink?.label[language]}</h3>
            {isItaewonService ? <p className="mt-2 inline-flex rounded-full border border-[#b8e0cf] bg-[#eefaf4] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#168354]">{selectedFestivalPreview.badge[language]}</p> : null}
            {activeLink?.featured && !isItaewonService ? (
              <p className="mt-2 inline-flex rounded-full border border-[#f59e0b]/40 bg-[#fff8e8] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#b36a00]">
                K-Pop spotlight
              </p>
            ) : null}
            <p className="mt-3 text-sm leading-6 text-[#486581]">{isItaewonService ? selectedFestivalPreview.description[language] : activeLink?.description[language]}</p>

            {isItaewonService ? <div className="mt-4 space-y-2 rounded-[10px] border border-[#dce6f0] bg-[#f8fbff] p-3"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b4eae]">2026 Journey</p><div className="grid gap-2 text-xs"><div className="flex items-center justify-between gap-2"><span><strong>30 AUG</strong> · India Pre-Selection</span><span className="font-black text-[#168354]">COMPLETED ✓</span></div><div className="flex items-center justify-between gap-2"><span><strong>30 SEP</strong> · Official Second Round</span><span className="font-black text-[#b36a00]">UPCOMING</span></div><div className="flex items-center justify-between gap-2"><span><strong>4–6 OCT</strong> · Festival, Seoul</span><span className="font-black text-[#b36a00]">UPCOMING</span></div></div></div> : null}

            {activeChild && !isItaewonService ? (
              <div className="mt-4 rounded-[10px] border border-[#f3d39b] bg-[#fffaf0] p-4 shadow-[0_8px_18px_rgba(15,55,95,0.05)]">
                <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#b36a00]">Inside this service</p>
                <Link href={activeChild.href} onClick={onNavigate} className="mt-2 block">
                  <span className="block text-base font-black text-[#102a43]">{activeChild.label[language]}</span>
                  <span className="mt-1 block text-sm leading-6 text-[#486581]">{activeChild.description[language]}</span>
                </Link>
              </div>
            ) : null}

            {!isItaewonService ? <div className="mt-4 flex flex-wrap gap-2">{activeLink?.points ? <span className="rounded-full border border-[#f3d39b] bg-[#fff8e8] px-4 py-2 text-sm font-black tracking-[0.02em] text-[#9a5b00]">+{activeLink.points} points</span> : null}<span className="rounded-full border border-[#d8e1ee] bg-[#f8fbff] px-4 py-2 text-sm font-black text-[#475569]">{activeLink?.external ? 'External service' : 'Internal service'}</span></div> : null}

            {openHref ? (
              activeLink.external ? (
                <a
                  href={openHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={onNavigate}
                  className="mt-4 inline-flex items-center gap-2 rounded-[8px] bg-[#0b4eae] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#073a82]"
                >
                  Open external service
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href={openHref}
                  onClick={onNavigate}
                className="mt-4 inline-flex items-center gap-2 rounded-[8px] bg-[#0b4eae] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#073a82]"
                >
                  {isItaewonService ? selectedFestivalPreview.cta[language] : 'Open service'}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MegaMenu;
