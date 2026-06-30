'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import type { Language } from '@/store/useAppStore';
import type { MegaSection, MenuLink } from '@/lib/kcubeContent';

interface MegaMenuProps {
  sections: MegaSection[];
  language: Language;
}

const getLinkKey = (link: MenuLink) => `${link.label.en}-${link.href}`;

const panelCard =
  'flex w-full items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f3a847]';

const MegaMenu = ({ sections, language }: MegaMenuProps) => {
  const [activeLinkIndex, setActiveLinkIndex] = useState(0);
  const [activeChildIndex, setActiveChildIndex] = useState(0);

  const activeSection = sections[0];
  const serviceLinks = activeSection?.links ?? [];
  const activeLink = serviceLinks[activeLinkIndex] ?? serviceLinks[0];
  const activeChildren = activeLink?.children ?? [];
  const activeChild = activeChildren[activeChildIndex] ?? activeChildren[0];

  useEffect(() => {
    setActiveLinkIndex(0);
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

  return (
    <div className="mx-auto w-full max-w-[1760px] px-3 sm:px-4 lg:px-10">
      <div className="grid max-h-[min(72vh,560px)] gap-3 overflow-hidden rounded-b-[28px] border border-t-0 border-[#d5d9d9] bg-[#fffdf7] p-3 shadow-[0_24px_56px_rgba(0,0,0,0.24)] lg:grid-cols-[minmax(240px,0.92fr)_minmax(260px,1fr)_minmax(300px,1.04fr)]">
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#d5d9d9] bg-white">
          <div className="border-b border-[#eef0f1] px-4 py-3">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b12704]">Services</p>
          </div>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            {serviceLinks.map((link, index) => {
              const active = index === activeLinkIndex;
              return (
                <button
                  key={getLinkKey(link)}
                  type="button"
                  onClick={() => {
                    setActiveLinkIndex(index);
                    setActiveChildIndex(0);
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
                    active
                      ? 'border-[#f3a847] bg-[#fff4cc] text-[#111827]'
                      : 'border-transparent bg-[#f7fafa] text-[#111827] hover:border-[#d5d9d9] hover:bg-white'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black">{link.label[language]}</span>
                    <span className="mt-1 block text-[11px] font-semibold text-[#5d646d]">
                      {link.children?.length ? `${link.children.length} step${link.children.length === 1 ? '' : 's'}` : 'Open service'}
                    </span>
                  </span>
                  <ChevronRight className={`mt-0.5 h-4 w-4 shrink-0 ${active ? 'text-[#b12704]' : 'text-[#8b95a1]'}`} />
                </button>
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
                  <button
                    key={getLinkKey(child)}
                    type="button"
                    onClick={() => setActiveChildIndex(index)}
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
                  </button>
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
            <p className="mt-3 text-sm leading-6 text-[#d5d9d9]">{activeLink?.description[language]}</p>

            {activeChild ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9fb2bd]">Inside this service</p>
                <Link href={activeChild.href} className="mt-2 block">
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

            {activeLink ? (
              activeLink.external ? (
                <a
                  href={activeLink.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#ffd814] px-4 py-3 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00]"
                >
                  Open external service
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href={activeLink.href}
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
