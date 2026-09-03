import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Camera,
  Sparkles,
  Video,
} from 'lucide-react';
import type { ReactNode } from 'react';
import IndiaPreSelectionInformationHero from '@/components/home/IndiaPreSelectionInformationHero';
import FestivalVideoPlayer from '@/components/home/FestivalVideoPlayer';
import OfficialRepresentationSection from '@/components/home/OfficialRepresentationSection';

export const metadata = {
  title: 'ITAEWON World Music Festival India | K-CUBE',
  description: 'Explore the ITAEWON World Music Spirit Festival, the completed 2026 India Pre-Selection, official India representation, festival updates, Seoul event information and future participation opportunities through K-CUBE.',
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
  ['01', 'Registration', 'Create a K-CUBE Account', 'Create an account and complete registration.'],
  ['02', 'Preliminary submission', 'Submit Performance Video', 'Submit a performance video for review.'],
  ['03', 'Shortlisting', 'Preliminary Review', 'Preliminary review and shortlisting stage.'],
  ['04', 'Continued participation', 'Final Evaluation Journey', 'Continue following official K-CUBE participation guidance.'],
] as const;

const storyCards = [
  ['01', 'Remembrance', 'A festival created with a spirit of remembrance, healing and respect.'],
  ['02', 'Music & culture', 'Artists and communities connect through music, performance and cultural exchange.'],
  ['03', 'Global community', 'People from different countries and backgrounds share one stage and one message.'],
  ['04', 'Itaewon, Seoul', 'A globally recognized cultural district where international communities, music, food and culture meet.'],
] as const;

const journey = ['India', 'K-CUBE - India Participation Platform', 'India Pre-Selection', 'Official Festival Process', 'Itaewon, Seoul'] as const;

const timeline = [
  ['2025', 'Previous Festival Highlights - Archive', 'Music, culture and international voices from Seoul.'],
  ['30 AUG 2026', 'India Pre-Selection - Completed', 'The India application period concluded through K-CUBE.'],
  ['CURRENT', 'Selection & Festival Journey - In Progress', 'Follow official announcements for current-cycle updates.'],
  ['4-6 OCT 2026', 'ITAEWON World Music Spirit Festival - Upcoming', 'The festival is scheduled for Seoul, South Korea.'],
  ['2027', 'Next India Participation Cycle - To Be Announced', 'Future dates and requirements are subject to official confirmation.'],
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
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#526f8f]">Thank you to everyone who participated in the 2026 ITAEWON World Music Festival India Pre-Selection through K-CUBE. The application period concluded on 30 August 2026. Applicants and shortlisted participants should continue following official K-CUBE announcements for updates regarding the current festival cycle.</p>
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

      <OfficialRepresentationSection />

      <section className="px-3 pb-7 sm:px-4 sm:pb-9 lg:px-10" aria-labelledby="current-cycle-heading">
        <div className="mx-auto max-w-[1320px] rounded-[24px] border border-[#cbd9ea] bg-white p-5 shadow-[0_12px_35px_rgba(15,55,95,0.07)] sm:p-7 lg:p-9">
          <SectionHeading eyebrow="Current festival cycle" title="The 2026 Journey Continues">India registration is closed, while the current festival cycle continues through official selection and festival updates.</SectionHeading>
          <div id="current-cycle-heading" className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['30 AUG 2026', 'India Pre-Selection', 'Completed', 'border-[#b9d9d0] bg-[#effaf6] text-[#19745d]'],
              ['CURRENT STAGE', 'Selection & Festival Updates', 'In Progress', 'border-[#b9cdec] bg-[#eef4ff] text-[#2457d6]'],
              ['4–6 OCT 2026', 'ITAEWON World Music Spirit Festival', 'Upcoming', 'border-[#d9c4f0] bg-[#f7f1ff] text-[#5c2a8d]'],
              ['2027', 'Next India Participation Cycle', 'To Be Announced', 'border-[#d8e1ee] bg-[#f8fbff] text-[#526f8f]'],
            ].map(([date, title, status, tone], index) => <article key={title} className={`rounded-[18px] border p-5 ${tone}`}><p className="text-xs font-black tracking-[0.16em]">{date}</p><h3 className="mt-4 text-lg font-black text-[#102a43]">{title}</h3><p className="mt-3 text-xs font-black uppercase tracking-[0.16em]">{status}</p>{index < 3 ? <div className="mt-4 h-1 rounded-full bg-current/20"><div className="h-full w-2/3 rounded-full bg-current" /></div> : null}</article>)}
          </div>
        </div>
      </section>

      <section className="px-3 pb-7 sm:px-4 sm:pb-9 lg:px-10" aria-labelledby="next-cycle-heading">
        <div className="mx-auto grid max-w-[1320px] gap-6 overflow-hidden rounded-[24px] border border-[#d9c4f0] bg-[#f7f1ff] p-5 sm:p-7 lg:grid-cols-[1fr_260px] lg:items-center lg:p-9">
          <div>
            <Eyebrow>Next participation cycle</Eyebrow>
            <h2 id="next-cycle-heading" className="mt-2 text-3xl font-black text-[#102a43] sm:text-4xl">Want to Represent India Next Time?</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#526f8f]">The 2026 India Pre-Selection has concluded. K-CUBE plans to share future India participation opportunities for the next ITAEWON World Music Festival cycle after official confirmation. Eligibility, submission requirements, schedules and participation details will be published through official K-CUBE announcements.</p>
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
          <SectionHeading eyebrow="Experience Itaewon" title="See the Festival in Seoul">Music, culture, remembrance and international voices came together in Itaewon, Seoul.</SectionHeading>
          <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="order-2 overflow-hidden rounded-[20px] border border-[#d8e1ee] bg-white text-[#102a43] lg:order-1">
              <div className="flex items-center gap-3 p-5 pb-4 sm:p-6 sm:pb-4"><Video className="h-7 w-7 text-[#2457d6]" /><h3 className="text-xl font-black">Watch the festival</h3></div>
              <FestivalVideoPlayer />
              <p className="p-5 text-sm leading-7 text-[#526f8f] sm:p-6">2025 Festival Archive. Explore moments from the previous festival to understand the atmosphere and purpose behind ITAEWON World Music Spirit Festival.</p>
            </div>
            <div className="order-1 relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[20px] border border-[#4772a8] bg-[radial-gradient(circle_at_76%_18%,#3d74c5_0%,transparent_34%),linear-gradient(135deg,#164d93,#081a35)] p-6 sm:min-h-[340px] sm:p-8 lg:order-2">
              <div className="absolute -bottom-20 -right-8 h-56 w-56 rounded-full border-[28px] border-[#d29b24]/25" aria-hidden="true" />
              <div className="relative"><div className="flex items-end justify-between gap-4"><Video className="h-8 w-8 text-[#e5b441]" /><span className="text-6xl font-black leading-none text-white/10 sm:text-8xl">2025</span></div><p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-[#bed7ff]">Festival archive - Seoul</p><h3 id="media-heading" className="mt-3 max-w-lg text-2xl font-black sm:text-3xl">A moment from the world music stage</h3><p className="mt-3 max-w-xl text-sm leading-7 text-[#d5e5fb]">Take a look back at the 2025 ITAEWON World Music Festival through the supplied archive video. Music, remembrance and international voices come together in one visual record.</p></div>
              <div className="relative mt-8 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#cfe0f7]"><span className="rounded-full border border-white/25 bg-white/10 px-3 py-2">Itaewon</span><span className="rounded-full border border-white/25 bg-white/10 px-3 py-2">Seoul, Korea</span><span className="rounded-full border border-[#e5b441]/45 bg-[#e5b441]/10 px-3 py-2 text-[#f4ca61]">Archive video</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="festival-story" className="px-3 pb-7 sm:px-4 sm:pb-9 lg:px-10" aria-labelledby="story-heading">
        <div className="mx-auto max-w-[1320px] rounded-[24px] border border-[#cbd9ea] bg-white p-5 sm:p-7 lg:p-9">
          <SectionHeading eyebrow="About the festival" title="Four Ideas at the Heart of the Festival">A cultural meeting point shaped by music, remembrance and international community.</SectionHeading>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {storyCards.map(([number, title, text]) => <article key={title} className="rounded-[18px] border border-[#d8e1ee] bg-[#f8fbff] p-5"><p className="text-xs font-black tracking-[0.16em] text-[#2457d6]">{number}</p><h3 id={number === '01' ? 'story-heading' : undefined} className="mt-4 text-lg font-black capitalize text-[#102a43]">{title}</h3><p className="mt-3 text-sm leading-7 text-[#526f8f]">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="px-3 pb-7 sm:px-4 sm:pb-9 lg:px-10" aria-labelledby="journey-heading">
        <div className="mx-auto max-w-[1320px] rounded-[24px] border border-[#cbd9ea] bg-white p-5 sm:p-7 lg:p-9">
          <SectionHeading eyebrow="India x K-CUBE" title="From India to Itaewon">India participation is supported through the appointed International Director representing India. K-CUBE provides the India-side platform for official announcements and participation guidance.</SectionHeading>
          <div id="journey-heading" className="mt-7 grid overflow-hidden rounded-[18px] border border-[#d8e1ee] bg-[#f8fbff] md:grid-cols-5">
            {journey.map((item, index) => <div key={item} className="relative flex items-center gap-3 border-b border-[#d8e1ee] p-4 last:border-b-0 md:flex-col md:items-start md:border-b-0 md:border-r md:last:border-r-0 md:p-5"><span className="text-xs font-black tracking-[0.16em] text-[#2457d6]">0{index + 1}</span><span className="text-sm font-bold capitalize text-[#102a43]">{item}</span>{index < journey.length - 1 && <ArrowRight className="absolute right-4 hidden h-4 w-4 text-[#b77900] md:block" />}</div>)}
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row"><span className="inline-flex items-center gap-2 rounded-full border border-[#b9d9d0] bg-[#effaf6] px-4 py-2 text-xs font-bold text-[#19745d]"><CheckCircle2 className="h-4 w-4" />2026 pre-selection completed</span><a href="#official-india-representation" className="inline-flex items-center gap-2 rounded-full border border-[#d7b8ef] bg-[#f7f1ff] px-4 py-2 text-xs font-bold text-[#5c2a8d] hover:border-[#5c2a8d]"><Sparkles className="h-4 w-4" />View official appointment</a></div>
        </div>
      </section>

      <section className="px-3 pb-7 sm:px-4 sm:pb-9 lg:px-10" aria-labelledby="points-heading">
        <div className="mx-auto max-w-[1320px] rounded-[24px] border border-[#cbd9ea] bg-white p-5 sm:p-7 lg:p-9">
          <SectionHeading eyebrow="2026 participation journey - archive / for reference" title="How the 2026 India Pre-Selection Worked">This section reflects the completed 2026 India Pre-Selection journey and is retained for historical reference only. These stages are not an active registration offer.</SectionHeading>
          <div id="points-heading" className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{pointsJourney.map(([number, points, title, description]) => <article key={title} className="rounded-[18px] border border-[#d8e1ee] bg-[#f8fbff] p-5"><div className="flex items-center justify-between"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eaf3ff] text-xs font-black text-[#2457d6]">{number}</span><span className="text-sm font-black text-[#b77900]">{points}</span></div><h3 className="mt-5 text-base font-black text-[#102a43]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#526f8f]">{description}</p></article>)}</div>
        </div>
      </section>

      <section className="px-3 pb-7 sm:px-4 sm:pb-9 lg:px-10" aria-labelledby="timeline-heading">
        <div className="mx-auto max-w-[1320px] rounded-[24px] border border-[#cbd9ea] bg-white p-5 sm:p-7 lg:p-9"><SectionHeading eyebrow="Festival timeline" title="A journey across seasons">The current festival journey continues through October; future participation dates will be announced after confirmation.</SectionHeading><div id="timeline-heading" className="mt-7 grid gap-4 xl:grid-cols-5">{timeline.map(([date, title, text], index) => <article key={date} className={`relative rounded-[18px] border p-5 ${index === 2 ? 'border-[#b9cdec] bg-[#eef4ff]' : 'border-[#d8e1ee] bg-[#f8fbff]'}`}><div className="flex items-center gap-2 text-[#2457d6]"><CalendarDays className="h-4 w-4" /><span className="text-xs font-black tracking-[0.14em]">{date}</span></div><h3 className="mt-4 text-base font-black leading-6 text-[#102a43]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#526f8f]">{text}</p>{index === 0 && <a href="#media-heading" className="mt-4 inline-flex text-xs font-black text-[#2457d6] hover:underline">View archive video <ArrowRight className="ml-1 h-4 w-4" /></a>}{index < timeline.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 rounded-full bg-white text-[#b77900] xl:block" />}</article>)}</div></div>
      </section>

      <section className="px-3 pb-12 sm:px-4 sm:pb-16 lg:px-10" aria-labelledby="stay-connected-heading"><div className="mx-auto max-w-[1320px] rounded-[24px] border border-[#cbd9ea] bg-white p-6 text-center sm:p-9"><Eyebrow>Stay connected</Eyebrow><h2 id="stay-connected-heading" className="mt-2 text-3xl font-black text-[#102a43] sm:text-4xl">Stay Connected to the Festival Journey</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#526f8f]">The 2026 journey is still underway. Follow official K-CUBE announcements for updates from the current India selection process, the ITAEWON World Music Spirit Festival in Seoul, and future India participation opportunities.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/india-pre-selection/announcement" className="kc-button kc-button-primary">View latest announcements<ArrowRight className="h-4 w-4" /></Link><a href="https://www.instagram.com/k_cube_store/" target="_blank" rel="noreferrer" className="kc-button kc-button-secondary"><Camera className="h-4 w-4" />Follow on Instagram</a></div><p className="mt-4 text-xs text-[#8290a3]">Future India participation dates are subject to official confirmation.</p></div></section>

      <div className="sr-only">Media source record: {mediaSources.map((source) => `${source.title}, ${source.source}, ${source.year}, ${source.mediaType}, ${source.url}`).join(' | ')}</div>
    </main>
  );
}
