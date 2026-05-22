'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import type { Language } from '@/store/useAppStore';
import type { MegaSection } from '@/lib/kcubeContent';

interface MegaMenuProps {
  sections: MegaSection[];
  language: Language;
}

const MegaMenu = ({ sections, language }: MegaMenuProps) => {
  const containerClasses = sections.length > 1 ? 'md:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1';

  return (
    <div className={`mx-auto grid max-w-[1760px] gap-5 px-5 py-6 ${containerClasses} lg:px-10`}>
      {sections.map((section) => (
        <div key={section.title.en} className="min-w-0">
          <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#b12704]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f3a847]" />
            {section.title[language]}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {section.links.map((link) => {
              const className =
                'group/link flex min-h-[96px] flex-col justify-between rounded-sm border border-[#d5d9d9] bg-[#f7fafa] px-4 py-4 text-left transition hover:border-[#f3a847] hover:bg-[#fff4cc] focus-visible:border-[#f3a847] focus-visible:bg-[#fff4cc] focus-visible:outline-none';
              const content = (
                <>
                  <span className="flex items-center justify-between gap-3 text-sm font-semibold text-[#111827]">
                    <span className="inline-flex items-center gap-2">
                      {link.label[language]}
                      {link.external ? <ExternalLink className="h-3.5 w-3.5" /> : null}
                    </span>
                    {link.points ? (
                      <span className="rounded-sm bg-[#fff4cc] px-2 py-0.5 text-[11px] font-bold text-[#b12704] group-hover/link:bg-white">
                        +{link.points}
                      </span>
                    ) : null}
                  </span>
                  <p className="mt-2 text-xs leading-5 text-[#565959]">
                    {link.description[language]}
                  </p>
                </>
              );

              if (link.external) {
                return (
                  <a
                    key={link.label.en}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={className}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link key={link.label.en} href={link.href} className={className}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MegaMenu;
