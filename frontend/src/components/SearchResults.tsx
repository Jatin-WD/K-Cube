"use client";

import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { detailItems } from '@/lib/kcubeContent';
import { useAppStore, type Language } from '@/store/useAppStore';

const copy: Record<Language, { eyebrow: string; title: string; empty: string; prompt: string; results: string; view: string }> = {
  en: { eyebrow: 'K-CUBE SEARCH', title: 'Find your next experience', empty: 'No matching results found.', prompt: 'Try another activity, lesson, event or Korean food keyword.', results: 'results', view: 'View details' },
  ko: { eyebrow: 'K-CUBE 검색', title: '다음 경험을 찾아보세요', empty: '일치하는 결과가 없습니다.', prompt: '활동, 수업, 이벤트 또는 한국 음식 키워드를 다시 검색해 보세요.', results: '결과', view: '자세히 보기' },
  hi: { eyebrow: 'K-CUBE SEARCH', title: 'अपना अगला अनुभव खोजें', empty: 'कोई मिलते-जुलते परिणाम नहीं मिले।', prompt: 'Activity, lesson, event ya Korean food keyword try karein.', results: 'results', view: 'Details देखें' },
};

const SearchResults = ({ query }: { query: string }) => {
  const language = useAppStore((state) => state.language);
  const t = copy[language];
  const normalizedQuery = query.trim().toLowerCase();
  const results = detailItems.filter((item) => {
    if (!normalizedQuery) return false;
    const searchable = [
      ...Object.values(item.title),
      ...Object.values(item.summary),
      ...(item.sections ?? []).flatMap((section) => [
        ...Object.values(section.title),
        ...section.content.flatMap((content) => Object.values(content)),
      ]),
    ].join(' ').toLowerCase();
    return searchable.includes(normalizedQuery);
  });

  return (
    <main className="min-h-[calc(100vh-1px)] bg-[#eef4f8] px-4 py-10 text-[#102a43] sm:px-6 sm:py-14 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1180px]">
        <section className="rounded-2xl border border-[#d8e4f0] bg-white p-7 shadow-[0_18px_50px_rgba(15,55,95,0.07)] sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b36a00]">{t.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-black sm:text-5xl">{t.title}</h1>
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#d8e4f0] bg-[#f7fafd] px-4 py-3 text-[#486581]">
            <Search className="h-5 w-5 shrink-0 text-[#0b4eae]" aria-hidden="true" />
            <span className="min-w-0 truncate font-semibold">{query || '—'}</span>
          </div>
        </section>

        {results.length ? (
          <section className="mt-6 rounded-2xl border border-[#d8e4f0] bg-white p-5 shadow-sm sm:p-7">
            <p className="text-sm font-black text-[#0b4eae]">{results.length} {t.results}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {results.map((item) => (
                <Link key={`${item.category}-${item.slug}`} href={`/${item.category}/${item.slug}`} className="group rounded-xl border border-[#d8e4f0] bg-[#f8fbff] p-5 transition hover:-translate-y-0.5 hover:border-[#0b4eae] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#0b4eae]">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b36a00]">{item.category}</p>
                  <h2 className="mt-2 text-xl font-black">{item.title[language]}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#486581]">{item.summary[language]}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#0b4eae]">{t.view}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-6 rounded-2xl border border-dashed border-[#b8cce3] bg-white p-10 text-center sm:p-14">
            <h2 className="text-2xl font-black">{t.empty}</h2>
            <p className="mt-3 text-sm leading-6 text-[#486581]">{t.prompt}</p>
            <Link href="/" className="mt-6 inline-flex rounded-lg bg-[#0b4eae] px-5 py-3 text-sm font-black text-white">Back to home</Link>
          </section>
        )}
      </div>
    </main>
  );
};

export default SearchResults;
