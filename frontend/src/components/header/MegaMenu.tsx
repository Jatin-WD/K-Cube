'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import type { Language } from '@/store/useAppStore';
import type { MegaSection, MenuLink } from '@/lib/kcubeContent';
import { allMenuCategories } from '@/lib/kcubeContent';

interface MegaMenuProps {
  sections: MegaSection[];
  language: Language;
  onNavigate?: () => void;
  variant?: 'default' | 'all';
}

const getLinkKey = (link: MenuLink) => `${link.label.en}-${link.href}`;

const panelCard =
  'flex w-full items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f3a847]';

const MegaMenu = ({ sections, language, onNavigate, variant = 'default' }: MegaMenuProps) => {
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

  useEffect(() => {
    setActiveCategoryIndex(0);
    setActiveServiceIndex(0);
    setActiveChildIndex(0);
  }, [isAllMenu, sections]);

  useEffect(() => {
    const featuredIndex = sections[0]?.links.findIndex((link) => link.featured) ?? -1;
    setActiveLinkIndex(featuredIndex >= 0 ? featuredIndex : 0);
    setActiveChildIndex(0);
  }, [sections]);

  useEffect(() => {
    if (activeLinkIndex > serviceLinks.length - 1) {
      setActiveLinkIndex(0);
    }
    if (activeChildIndex > activeChildren.length - 1) {
      setActiveChildIndex(0);
    }
  }, [activeLinkIndex, activeChildIndex, serviceLinks.length, activeChildren.length]);

  if (!activeSection) return null;

  if (isAllMenu) {
    return (
      <div className="mx-auto w-full max-w-[1760px] px-3 sm:px-4 lg:px-10">
        <div className="max-h-[calc(100vh-186px)] overflow-y-auto overflow-x-hidden rounded-b-[28px] border border-t-0 border-[#d5d9d9] bg-[#fffdf7] p-3 pb-4 shadow-[0_24px_56px_rgba(0,0,0,0.24)]">
          <div className="grid min-h-[min(72vh,560px)] gap-3 lg:grid-cols-[minmax(250px,0.96fr)_minmax(250px,0.92fr)_minmax(300px,1.06fr)_minmax(260px,0.92fr)]">
          <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#d5d9d9] bg-white">
            <div className="border-b border-[#eef0f1] px-4 py-3">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b12704]">Categories</p>
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
                        ? 'border-[#f3a847] bg-[#fff4cc] text-[#111827]'
                        : 'border-transparent bg-[#f7fafa] text-[#111827] hover:border-[#d5d9d9] hover:bg-white'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black">{category.label[language]}</span>
                      <span className="mt-1 block text-[11px] font-semibold text-[#5d646d]">
                        {category.services.length} service{category.services.length === 1 ? '' : 's'}
                      </span>
                    </span>
                    <ChevronRight className={`mt-0.5 h-4 w-4 shrink-0 ${active ? 'text-[#b12704]' : 'text-[#8b95a1]'}`} />
                  </Link>
                );
              })}
            </div>
          </aside>

          <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#d5d9d9] bg-white">
            <div className="border-b border-[#eef0f1] px-4 py-3">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b12704]">Services</p>
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
                          ? 'border-[#f3a847] bg-[#fff4cc] text-[#111827] shadow-[0_10px_24px_rgba(243,168,71,0.12)]'
                          : 'border-[#f3a847]/40 bg-[#fff8df] text-[#111827] hover:border-[#f3a847] hover:bg-[#fff4cc]'
                        : active
                          ? 'border-[#f3a847] bg-[#fff4cc] text-[#111827]'
                          : 'border-transparent bg-[#f7fafa] text-[#111827] hover:border-[#d5d9d9] hover:bg-white'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black">{service.label[language]}</span>
                      <span className="mt-1 block text-[11px] font-semibold text-[#5d646d]">
                        {service.children?.length ? `${service.children.length} step${service.children.length === 1 ? '' : 's'}` : 'Open service'}
                      </span>
                      {service.featured ? (
                        <span className="mt-2 inline-flex rounded-full bg-[#f3a847] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#111827]">
                          Featured
                        </span>
                      ) : null}
                    </span>
                    <ChevronRight className={`mt-0.5 h-4 w-4 shrink-0 ${active ? 'text-[#b12704]' : 'text-[#8b95a1]'}`} />
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#d5d9d9] bg-white">
            <div className="border-b border-[#eef0f1] px-4 py-3">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b12704]">Sub services</p>
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
                          ? 'border-[#f3a847] bg-[#fff8e1]'
                          : 'border-transparent bg-[#f7fafa] hover:border-[#d5d9d9] hover:bg-white'
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-black text-[#111827]">{child.label[language]}</span>
                        <span className="mt-1 block text-xs leading-5 text-[#5d646d]">{child.description[language]}</span>
                      </span>
                      <span className="ml-3 inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#b12704]">
                        Step {index + 1}
                      </span>
                    </Link>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-[#d5d9d9] bg-[#f7fafa] px-4 py-4 text-sm text-[#5d646d]">
                  This category opens directly.
                </div>
              )}
            </div>
          </section>

          <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#131921] bg-[#131921] p-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f3a847]">Service preview</p>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-[#d5d9d9]">
                <Sparkles className="h-3.5 w-3.5 text-[#f3a847]" />
                Click to switch
              </span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-[#f3a847]">{activeCategory?.label[language]}</p>
              <h3 className="mt-2 text-[clamp(1.7rem,2vw,2.35rem)] font-black leading-tight text-white">{activeCategoryService?.label[language]}</h3>
              {activeCategoryService?.featured ? (
                <p className="mt-2 inline-flex rounded-full border border-[#f3a847]/40 bg-[#f3a847]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#f3a847]">
                  K-Pop spotlight
                </p>
              ) : null}
              <p className="mt-3 text-sm leading-6 text-[#d5d9d9]">{activeCategoryService?.description[language]}</p>

              {activeCategoryChild ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9fb2bd]">Inside this service</p>
                  <Link href={activeCategoryChild.href} onClick={onNavigate} className="mt-2 block">
                    <span className="block text-sm font-black text-white">{activeCategoryChild.label[language]}</span>
                    <span className="mt-1 block text-xs leading-5 text-[#d5d9d9]">{activeCategoryChild.description[language]}</span>
                  </Link>
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                {activeCategoryService?.points ? <span className="rounded-full bg-[#fff2c2] px-3 py-1 text-xs font-black text-[#111827]">+{activeCategoryService.points} points</span> : null}
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-[#d5d9d9]">
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
                    className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#ffd814] px-4 py-3 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00]"
                  >
                    Open external service
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    href={activeCategoryHref}
                    onClick={onNavigate}
                    className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#ffd814] px-4 py-3 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00]"
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
    <div className="mx-auto w-full max-w-[1760px] px-3 sm:px-4 lg:px-10">
      <div
        className={`grid max-h-[min(72vh,560px)] gap-3 overflow-hidden rounded-b-[28px] border border-t-0 border-[#d5d9d9] bg-[#fffdf7] p-3 shadow-[0_24px_56px_rgba(0,0,0,0.24)] ${
          isAllMenu
            ? 'lg:grid-cols-[minmax(250px,0.96fr)_minmax(250px,0.92fr)_minmax(300px,1.06fr)_minmax(260px,0.92fr)]'
            : 'lg:grid-cols-[minmax(240px,0.92fr)_minmax(260px,1fr)_minmax(300px,1.04fr)]'
        }`}
      >
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#d5d9d9] bg-white">
          <div className="border-b border-[#eef0f1] px-4 py-3">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b12704]">Services</p>
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
                        ? 'border-[#f3a847] bg-[#fff4cc] text-[#111827] shadow-[0_10px_24px_rgba(243,168,71,0.12)]'
                        : 'border-[#f3a847]/40 bg-[#fff8df] text-[#111827] hover:border-[#f3a847] hover:bg-[#fff4cc]'
                      : active
                        ? 'border-[#f3a847] bg-[#fff4cc] text-[#111827]'
                        : 'border-transparent bg-[#f7fafa] text-[#111827] hover:border-[#d5d9d9] hover:bg-white'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black">{link.label[language]}</span>
                    <span className="mt-1 block text-[11px] font-semibold text-[#5d646d]">
                      {link.children?.length ? `${link.children.length} step${link.children.length === 1 ? '' : 's'}` : 'Open service'}
                    </span>
                    {link.featured ? (
                      <span className="mt-2 inline-flex rounded-full bg-[#f3a847] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#111827]">
                        Featured
                      </span>
                    ) : null}
                  </span>
                  <ChevronRight className={`mt-0.5 h-4 w-4 shrink-0 ${active ? 'text-[#b12704]' : 'text-[#8b95a1]'}`} />
                </Link>
              );
            })}
          </div>
        </aside>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#d5d9d9] bg-white">
          <div className="border-b border-[#eef0f1] px-4 py-3">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b12704]">Sub services</p>
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
                        ? 'border-[#f3a847] bg-[#fff8e1]'
                        : 'border-transparent bg-[#f7fafa] hover:border-[#d5d9d9] hover:bg-white'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-black text-[#111827]">{child.label[language]}</span>
                      <span className="mt-1 block text-xs leading-5 text-[#5d646d]">{child.description[language]}</span>
                    </span>
                    <span className="ml-3 inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#b12704]">
                      Step {index + 1}
                    </span>
                  </Link>
                );
              })
            ) : (
              <div className="rounded-2xl border border-[#d5d9d9] bg-[#f7fafa] px-4 py-4 text-sm text-[#5d646d]">
                This service opens directly.
              </div>
            )}
          </div>
        </section>

        <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#131921] bg-[#131921] p-4 text-white">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f3a847]">Service preview</p>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-[#d5d9d9]">
              <Sparkles className="h-3.5 w-3.5 text-[#f3a847]" />
              Click to switch
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-[#f3a847]">{activeSection.title[language]}</p>
            <h3 className="mt-2 text-[clamp(1.7rem,2vw,2.35rem)] font-black leading-tight text-white">{activeLink?.label[language]}</h3>
            {activeLink?.featured ? (
              <p className="mt-2 inline-flex rounded-full border border-[#f3a847]/40 bg-[#f3a847]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#f3a847]">
                K-Pop spotlight
              </p>
            ) : null}
            <p className="mt-3 text-sm leading-6 text-[#d5d9d9]">{activeLink?.description[language]}</p>

            {activeChild ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9fb2bd]">Inside this service</p>
                <Link href={activeChild.href} onClick={onNavigate} className="mt-2 block">
                  <span className="block text-sm font-black text-white">{activeChild.label[language]}</span>
                  <span className="mt-1 block text-xs leading-5 text-[#d5d9d9]">{activeChild.description[language]}</span>
                </Link>
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              {activeLink?.points ? <span className="rounded-full bg-[#fff2c2] px-3 py-1 text-xs font-black text-[#111827]">+{activeLink.points} points</span> : null}
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-[#d5d9d9]">
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
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#ffd814] px-4 py-3 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00]"
                >
                  Open external service
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href={openHref}
                  onClick={onNavigate}
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#ffd814] px-4 py-3 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00]"
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
