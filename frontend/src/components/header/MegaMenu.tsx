'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import type { Language } from '@/store/useAppStore';
import type { MegaSection, MenuLink } from '@/lib/kcubeContent';
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

  if (!activeSection) return null;

  if (isAllMenu) {
    return (
      <div id="desktop-mega-menu" data-mega-panel className="pointer-events-auto mx-auto w-full max-w-[1320px] px-3 sm:px-4 lg:px-6" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <div className="max-h-[calc(100vh-172px)] overflow-y-auto overflow-x-hidden rounded-b-[14px] border border-t-0 border-[#dce6f0] bg-[#f7fafd] p-2.5 pb-3 shadow-[0_18px_40px_rgba(15,55,95,0.12)]">
          <div className="grid min-h-0 gap-3 lg:grid-cols-[minmax(220px,0.92fr)_minmax(240px,1fr)_minmax(280px,1.08fr)_minmax(260px,0.96fr)]">
          <aside className="flex min-h-0 flex-col overflow-hidden rounded-[12px] border border-[#dce6f0] bg-white">
            <div className="border-b border-[#eef0f1] px-4 py-3">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#2457d6]">Categories</p>
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
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#2457d6]">Services</p>
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
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black">{service.label[language]}</span>
                      <span className="mt-1 block text-[11px] font-semibold text-[#486581]">
                        {service.children?.length ? `${service.children.length} step${service.children.length === 1 ? '' : 's'}` : 'Open service'}
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
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0b4eae]">Sub services</p>
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
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-black text-[#102a43]">{child.label[language]}</span>
                        <span className="mt-1 block text-xs leading-5 text-[#486581]">{child.description[language]}</span>
                      </span>
                      <span className="ml-3 inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#0b4eae]">
                        Step {index + 1}
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
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0b4eae]">Service preview</p>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f9fe] px-3 py-1 text-[11px] font-black text-[#486581]">
                <Sparkles className="h-3.5 w-3.5 text-[#0b4eae]" />
                Click to switch
              </span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1 pb-2">
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-[#0b4eae]">{activeCategory?.label[language]}</p>
              <h3 className="mt-2 text-[clamp(1.4rem,1.8vw,1.95rem)] font-black leading-[1.12] text-[#102a43]">{activeCategoryService?.label[language]}</h3>
              {activeCategoryService?.featured ? (
                <p className="mt-2 inline-flex rounded-full border border-[#f59e0b]/40 bg-[#fff8e8] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#b36a00]">
                  K-Pop spotlight
                </p>
              ) : null}
              <p className="mt-3 text-sm leading-6 text-[#486581]">{activeCategoryService?.description[language]}</p>

              {activeCategoryChild ? (
                <div className="mt-4 rounded-[10px] border border-[#f3d39b] bg-[#fffaf0] p-4 shadow-[0_8px_18px_rgba(15,55,95,0.05)]">
                  <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#b36a00]">Inside this service</p>
                  <Link href={activeCategoryChild.href} onClick={onNavigate} className="mt-2 block">
                    <span className="block text-base font-black text-[#102a43]">{activeCategoryChild.label[language]}</span>
                    <span className="mt-1 block text-sm leading-6 text-[#486581]">{activeCategoryChild.description[language]}</span>
                  </Link>
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                {activeCategoryService?.points ? <span className="rounded-full border border-[#f3d39b] bg-[#fff8e8] px-4 py-2 text-sm font-black tracking-[0.02em] text-[#9a5b00]">+{activeCategoryService.points} points</span> : null}
                <span className="rounded-full border border-[#d8e1ee] bg-[#f8fbff] px-4 py-2 text-sm font-black text-[#475569]">
                  {activeCategoryService?.external ? 'External service' : 'Internal service'}
                </span>
              </div>

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
                    Open service
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
                    <span className="block truncate text-sm font-black">{link.label[language]}</span>
                    <span className="mt-1 block text-[11px] font-semibold text-[#486581]">
                      {link.children?.length ? `${link.children.length} step${link.children.length === 1 ? '' : 's'}` : 'Open service'}
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
                    <span className="ml-3 inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#0b4eae]">
                      Step {index + 1}
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
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f9fe] px-3 py-1 text-[11px] font-black text-[#486581]">
              <Sparkles className="h-3.5 w-3.5 text-[#0b4eae]" />
              Click to switch
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-[#0b4eae]">{activeSection.title[language]}</p>
            <h3 className="mt-2 text-[clamp(1.4rem,1.8vw,1.95rem)] font-black leading-[1.12] text-[#102a43]">{activeLink?.label[language]}</h3>
            {activeLink?.featured ? (
              <p className="mt-2 inline-flex rounded-full border border-[#f59e0b]/40 bg-[#fff8e8] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#b36a00]">
                K-Pop spotlight
              </p>
            ) : null}
            <p className="mt-3 text-sm leading-6 text-[#486581]">{activeLink?.description[language]}</p>

            {activeChild ? (
              <div className="mt-4 rounded-[10px] border border-[#f3d39b] bg-[#fffaf0] p-4 shadow-[0_8px_18px_rgba(15,55,95,0.05)]">
                <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#b36a00]">Inside this service</p>
                <Link href={activeChild.href} onClick={onNavigate} className="mt-2 block">
                  <span className="block text-base font-black text-[#102a43]">{activeChild.label[language]}</span>
                  <span className="mt-1 block text-sm leading-6 text-[#486581]">{activeChild.description[language]}</span>
                </Link>
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              {activeLink?.points ? <span className="rounded-full border border-[#f3d39b] bg-[#fff8e8] px-4 py-2 text-sm font-black tracking-[0.02em] text-[#9a5b00]">+{activeLink.points} points</span> : null}
              <span className="rounded-full border border-[#d8e1ee] bg-[#f8fbff] px-4 py-2 text-sm font-black text-[#475569]">
                {activeLink?.external ? 'External service' : 'Internal service'}
              </span>
            </div>

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
                  Open service
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
