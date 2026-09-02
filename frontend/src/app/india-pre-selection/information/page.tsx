import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Camera,
  Sparkles,
  Video,
} from 'lucide-react';
import type { ReactNode } from 'react';
import IndiaPreSelectionInformationHero from '@/components/home/IndiaPreSelectionInformationHero';
import FestivalVideoPlayer from '@/components/home/FestivalVideoPlayer';

export const metadata = {
  title: 'ITAEWON World Music Festival | India Participation & Festival Highlights | K-CUBE',
  description: "Explore the ITAEWON World Music Festival, view previous festival highlights, learn about K-CUBE's India pre-selection journey and stay informed about future participation opportunities.",
};

const mediaSources = [
  {
    title: '2025 ITAEWON WORLD MUSIC SPIRIT Festival archive',
    description: 'Official festival/news source for organizer coverage and approved archive media.',
    source: 'ITAEWONNEWS',
    year: 2025,
    mediaType: 'source archive',
    url: 'https://www.itaewonnews.com/main/index.html',
  },
] as const;

const pointsJourney = [
  ['01', '100 points', 'Register with K-CUBE', 'Register with K-CUBE'],
  ['02', '+200 points', 'Submit Preliminary Video', 'Submit a video for the preliminary round'],
  ['03', '+300 points', 'Pass Preliminary Round', 'Selection stage for approximately five people'],
  ['04', '+1,000 points', 'Final Selection Stage', 'Awarded for passing the final selection'],
] as const;

const storyCards = [
  ['01', 'Remembrance', 'A festival created with a spirit of remembrance, healing and respect.'],
  ['02', 'Music & culture', 'Artists and communities connect through music, performance and cultural exchange.'],
  ['03', 'Global community', 'People from different countries and backgrounds share one stage and one message.'],
  ['04', 'Itaewon, Seoul', 'A globally recognized cultural district where international communities, music, food and culture meet.'],
] as const;

const journey = ['India', 'K-CUBE', 'India pre-selection', 'Official festival process', 'Seoul, Korea'] as const;

const timeline = [
  ['2025', 'Previous festival highlights', 'Photos and videos from Seoul will be added after media approval.'],
  ['30 AUG 2026', 'India pre-selection', 'Conducted through K-CUBE.'],
  ['4-6 OCT 2026', 'ITAEWON World Music Festival', 'Seoul, South Korea.'],
  ['2027', 'Next participation cycle', 'Updates to be announced after official confirmation.'],
] as const;

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#b77900]">{children}</p>;
}

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight text-[#102a43] sm:text-4xl">{title}</h2>
      </div>
      {children && <p className="max-w-2xl text-sm leading-7 text-[#526f8f]">{children}</p>}
    </div>
  );
}

export default function InformationPage() {
  return (
    <main className="kc-india-page min-h-screen bg-[#eef4f8] text-[#102a43]">
      <IndiaPreSelectionInformationHero />

      <section className="px-3 pb-7 sm:px-4 sm:pb-9 lg:px-10" aria-labelledby="status-heading">
        <div className="mx-auto grid max-w-[1320px] gap-6 rounded-[24px] border border-[#cbd9ea] bg-white p-5 shadow-[0_12px_35px_rgba(15,55,95,0.07)] sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center lg:p-9">
          <div>
            <Eyebrow>Application status</Eyebrow>
            <h2 id="status-heading" className="mt-2 text-2xl font-black text-[#102a43] sm:text-3xl">2026 India Pre-Selection Has Closed</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#526f8f]">Thank you to everyone who participated in the 2026 ITAEWON World Music Festival India Pre-Selection through K-CUBE. The application period concluded on 30 August 2026. Applicants and selected participants should follow official K-CUBE announcements for further updates regarding the current festival cycle.</p>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#b9d9d0] bg-[#effaf6] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#19745d]"><CheckCircle2 className="h-4 w-4" />2026 participation closed</div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/india-pre-selection/announcement" className="kc-button kc-button-primary whitespace-nowrap">Latest announcements<ArrowRight className="h-4 w-4" /></Link>
              <a href="#festival-story" className="kc-button kc-button-secondary whitespace-nowrap">Learn about the festival</a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-3 pb-7 sm:px-4 sm:pb-9 lg:px-10" aria-labelledby="next-cycle-heading">
        <div className="mx-auto grid max-w-[1320px] gap-6 overflow-hidden rounded-[24px] border border-[#d9c4f0] bg-[#f7f1ff] p-5 sm:p-7 lg:grid-cols-[1fr_260px] lg:items-center lg:p-9">
          <div>
            <Eyebrow>Next participation cycle</Eyebrow>
            <h2 id="next-cycle-heading" className="mt-2 text-3xl font-black text-[#102a43] sm:text-4xl">Want to Represent India Next Time?</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#526f8f]">The 2026 India Pre-Selection has concluded. K-CUBE plans to open participation opportunities again for the next ITAEWON World Music Festival cycle in 2027. Future eligibility, submission requirements, schedules and participation details will be published on K-CUBE after official confirmation.</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/india-pre-selection/announcement" className="kc-button kc-button-primary">View announcements<ArrowRight className="h-4 w-4" /></Link>
              <a href="https://www.instagram.com/k_cube_store/" target="_blank" rel="noreferrer" className="kc-button kc-button-secondary"><Camera className="h-4 w-4" />Follow K-CUBE updates</a>
            </div>
          </div>
          <div className="rounded-[20px] border border-[#d7b8ef] bg-white p-5 text-center shadow-sm"><p className="text-5xl font-black text-[#5c2a8d]">2027</p><p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-[#7b4da4]">Next participation updates</p><p className="mt-3 text-sm leading-6 text-[#526f8f]">Stay connected with K-CUBE for the next announcement.</p></div>
        </div>
      </section>

      <section className="px-3 pb-7 sm:px-4 sm:pb-9 lg:px-10" aria-labelledby="media-heading">
        <div className="mx-auto max-w-[1320px] rounded-[24px] border border-[#cbd9ea] bg-[#102a43] p-5 text-white shadow-[0_18px_45px_rgba(15,55,95,0.14)] sm:p-7 lg:p-9">
          <SectionHeading eyebrow="Experience Itaewon" title="Experience the ITAEWON World Music Festival">Take a look back at moments from the 2025 festival in Seoul.</SectionHeading>
          <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[20px] border border-[#4772a8] bg-[radial-gradient(circle_at_75%_20%,#3d74c5_0%,transparent_33%),linear-gradient(135deg,#164d93,#081a35)] p-6 sm:min-h-[340px] sm:p-8">
              <div className="absolute -bottom-20 -right-8 h-56 w-56 rounded-full border-[28px] border-[#d29b24]/25" aria-hidden="true" />
              <div className="relative"><Video className="h-8 w-8 text-[#e5b441]" /><p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-[#bed7ff]">2025 festival archive</p><h3 id="media-heading" className="mt-3 max-w-lg text-2xl font-black sm:text-3xl">Real festival media, added with permission</h3><p className="mt-3 max-w-xl text-sm leading-7 text-[#d5e5fb]">Verified 2025 photos and videos will appear here once approved by the festival organizer. We are not filling this archive with unrelated stock or unverified event media.</p></div>
              <a href={mediaSources[0].url} target="_blank" rel="noreferrer" className="relative mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20">Open official festival source<ExternalLink className="h-4 w-4" /></a>
            </div>
            <div className="overflow-hidden rounded-[20px] border border-[#d8e1ee] bg-white text-[#102a43]">
              <div className="flex items-center gap-3 p-5 pb-4 sm:p-6 sm:pb-4"><Video className="h-7 w-7 text-[#2457d6]" /><h3 className="text-xl font-black">Watch the festival</h3></div>
              <FestivalVideoPlayer />
              <p className="p-5 text-sm leading-7 text-[#526f8f] sm:p-6">2025 festival archive video from Seoul. Hover or focus the video to reveal the pause control.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="festival-story" className="px-3 pb-7 sm:px-4 sm:pb-9 lg:px-10" aria-labelledby="story-heading">
        <div className="mx-auto max-w-[1320px] rounded-[24px] border border-[#cbd9ea] bg-white p-5 sm:p-7 lg:p-9">
          <SectionHeading eyebrow="About the festival" title="More Than a Music Festival">A cultural meeting point shaped by music, remembrance and international community.</SectionHeading>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {storyCards.map(([number, title, text]) => <article key={title} className="rounded-[18px] border border-[#d8e1ee] bg-[#f8fbff] p-5"><p className="text-xs font-black tracking-[0.16em] text-[#2457d6]">{number}</p><h3 id={number === '01' ? 'story-heading' : undefined} className="mt-4 text-lg font-black capitalize text-[#102a43]">{title}</h3><p className="mt-3 text-sm leading-7 text-[#526f8f]">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="px-3 pb-7 sm:px-4 sm:pb-9 lg:px-10" aria-labelledby="journey-heading">
        <div className="mx-auto max-w-[1320px] rounded-[24px] border border-[#cbd9ea] bg-white p-5 sm:p-7 lg:p-9">
          <SectionHeading eyebrow="India × K-CUBE" title="From India to Itaewon">K-CUBE provides the India-side platform through which participants can discover opportunities, follow official announcements and take part in the India pre-selection process when applications are open.</SectionHeading>
          <div id="journey-heading" className="mt-7 grid overflow-hidden rounded-[18px] border border-[#d8e1ee] bg-[#f8fbff] md:grid-cols-5">
            {journey.map((item, index) => <div key={item} className="relative flex items-center gap-3 border-b border-[#d8e1ee] p-4 last:border-b-0 md:flex-col md:items-start md:border-b-0 md:border-r md:last:border-r-0 md:p-5"><span className="text-xs font-black tracking-[0.16em] text-[#2457d6]">0{index + 1}</span><span className="text-sm font-bold capitalize text-[#102a43]">{item}</span>{index < journey.length - 1 && <ArrowRight className="absolute right-4 hidden h-4 w-4 text-[#b77900] md:block" />}</div>)}
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row"><span className="inline-flex items-center gap-2 rounded-full border border-[#b9d9d0] bg-[#effaf6] px-4 py-2 text-xs font-bold text-[#19745d]"><CheckCircle2 className="h-4 w-4" />2026 pre-selection completed</span><span className="inline-flex items-center gap-2 rounded-full border border-[#d7b8ef] bg-[#f7f1ff] px-4 py-2 text-xs font-bold text-[#5c2a8d]"><Sparkles className="h-4 w-4" />2027 updates planned</span></div>
        </div>
      </section>

      <section className="px-3 pb-7 sm:px-4 sm:pb-9 lg:px-10" aria-labelledby="points-heading">
        <div className="mx-auto max-w-[1320px] rounded-[24px] border border-[#cbd9ea] bg-white p-5 sm:p-7 lg:p-9">
          <SectionHeading eyebrow="2026 participation journey" title="How the 2026 India Pre-Selection Worked">This section reflects the 2026 India Pre-Selection journey and is retained for reference. These stage points are not an active registration offer.</SectionHeading>
          <div id="points-heading" className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{pointsJourney.map(([number, points, title, description]) => <article key={title} className="rounded-[18px] border border-[#d8e1ee] bg-[#f8fbff] p-5"><div className="flex items-center justify-between"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eaf3ff] text-xs font-black text-[#2457d6]">{number}</span><span className="text-sm font-black text-[#b77900]">{points}</span></div><h3 className="mt-5 text-base font-black text-[#102a43]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#526f8f]">{description}</p></article>)}</div>
        </div>
      </section>

      <section className="px-3 pb-7 sm:px-4 sm:pb-9 lg:px-10" aria-labelledby="timeline-heading">
        <div className="mx-auto max-w-[1320px] rounded-[24px] border border-[#cbd9ea] bg-white p-5 sm:p-7 lg:p-9"><SectionHeading eyebrow="Festival timeline" title="A journey across seasons">The 2026 India stage is complete; the next participation cycle will be announced after confirmation.</SectionHeading><div id="timeline-heading" className="mt-7 grid gap-4 lg:grid-cols-4">{timeline.map(([date, title, text], index) => <article key={date} className="relative rounded-[18px] border border-[#d8e1ee] bg-[#f8fbff] p-5"><div className="flex items-center gap-2 text-[#2457d6]"><CalendarDays className="h-4 w-4" /><span className="text-xs font-black tracking-[0.16em]">{date}</span></div><h3 className="mt-4 text-base font-black text-[#102a43]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#526f8f]">{text}</p>{index < timeline.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 rounded-full bg-white text-[#b77900] lg:block" />}</article>)}</div></div>
      </section>

      <section className="px-3 pb-10 sm:px-4 sm:pb-12 lg:px-10"><div className="mx-auto grid max-w-[1320px] gap-6 rounded-[24px] bg-[#082f68] p-6 text-white shadow-[0_18px_45px_rgba(15,55,95,0.16)] sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10"><div><Eyebrow>Your next stage</Eyebrow><h2 className="mt-2 text-3xl font-black sm:text-4xl">Your Next Stage Could Begin in 2027</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-[#d5e5fb]">The 2026 India participation window has closed, but the journey continues. Follow K-CUBE announcements to know when the next India participation opportunity becomes available.</p><p className="mt-3 text-xs text-[#bcd7ff]">Application dates and requirements will be announced after official confirmation.</p></div><div className="flex flex-col gap-3 sm:flex-row lg:flex-col"><Link href="/india-pre-selection/announcement" className="kc-button kc-button-primary whitespace-nowrap">View announcements<ArrowRight className="h-4 w-4" /></Link><a href="https://www.instagram.com/k_cube_store/" target="_blank" rel="noreferrer" className="kc-button kc-button-secondary whitespace-nowrap"><Camera className="h-4 w-4" />Follow on Instagram</a></div></div></section>

      <div className="sr-only">Media source record: {mediaSources.map((source) => `${source.title}, ${source.source}, ${source.year}, ${source.mediaType}, ${source.url}`).join(' | ')}</div>
    </main>
  );
}
