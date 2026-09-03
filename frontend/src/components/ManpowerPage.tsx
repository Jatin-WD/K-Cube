"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowRight, Check, Mail, Sparkles } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const roles = [
  {
    number: '01',
    title: 'Event crew',
    short: 'Make the room come alive.',
    description: 'Help bring K-CUBE workshops, festivals, meetups and cultural programs to life.',
    areas: ['Event support', 'Guest coordination', 'On-ground execution', 'Community interaction'],
    image: '/assets/itaewon.jpg',
  },
  {
    number: '02',
    title: 'Content & creative',
    short: 'Turn culture into stories.',
    description: 'Create content around Korean culture, K-Food, learning, events and community stories.',
    areas: ['Social content', 'Photography / video', 'Design', 'K-Culture storytelling'],
    image: '/assets/k-cube-banner.png',
  },
  {
    number: '03',
    title: 'Operations',
    short: 'Keep the ecosystem moving.',
    description: 'Support the systems and coordination behind K-CUBE programs, users, partners and activities.',
    areas: ['Program coordination', 'Community operations', 'Partner support', 'Platform operations'],
    image: '/assets/kcube-india-preselection-cube.png',
  },
];

const workAreas = [
  ['EVENTS', 'Gather people around memorable cultural moments.'],
  ['CONTENT', 'Shape the stories that introduce Korean culture.'],
  ['LEARNING', 'Make language practice feel welcoming and useful.'],
  ['K-FOOD', 'Connect discovery, recipes and everyday experiences.'],
  ['COMMUNITY', 'Build participation that feels personal and open.'],
  ['OPERATIONS', 'Create the structure that lets good work scale.'],
];

const benefits = [
  ['Build real experience', 'Work across cultural events, content and digital programs.'],
  ['Grow with Korean culture', 'Participate closely in Korean culture-led projects and experiences.'],
  ['Create an impact', 'Help shape experiences for the K-CUBE community.'],
  ['Earn recognition', 'Eligible contributions may connect with K-CUBE recognition programs where applicable.'],
];

const journey = [
  ['01', 'Choose your role', 'Explore the opportunity that matches how you would like to contribute.'],
  ['02', 'Tell us about yourself', 'Share your experience, strengths and the kind of work you want to do.'],
  ['03', 'K-CUBE review', 'The team reviews your details and considers the best fit for the current need.'],
  ['04', 'Next-step communication', 'If there is a fit, the K-CUBE team will contact you with the next step.'],
];

const applicationHref = 'mailto:kcubeadm@gmail.com?subject=K-CUBE%20Manpower%20Application&body=Hello%20K-CUBE%20team,%0A%0ARole%20I%20am%20interested%20in:%0A%0AAbout%20me:%0A';

const reveal = { hidden: { opacity: 0, y: 34 }, visible: { opacity: 1, y: 0 } };

function RoleCard({ role, index, progress, reducedMotion }: { role: (typeof roles)[number]; index: number; progress: ReturnType<typeof useScroll>['scrollYProgress']; reducedMotion: boolean }) {
  const start = index / roles.length;
  const end = (index + 1) / roles.length;
  const opacity = useTransform(progress, [Math.max(0, start - .12), start, end, Math.min(1, end + .12)], [0.28, 1, 1, 0.28]);
  const scale = useTransform(progress, [Math.max(0, start - .12), start, end, Math.min(1, end + .12)], [.96, 1, 1, .96]);
  const y = useTransform(progress, [Math.max(0, start - .12), start, end, Math.min(1, end + .12)], [28, 0, 0, -28]);

  return <motion.article style={{ opacity: reducedMotion ? 1 : opacity, scale: reducedMotion ? 1 : scale, y: reducedMotion ? 0 : y }} className="overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_rgba(16,42,67,.14)] lg:absolute lg:inset-0 lg:grid lg:grid-cols-[.95fr_1.05fr]">
    <div className="relative min-h-64 overflow-hidden bg-[#082b61] lg:min-h-0"><Image src={role.image} alt="" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover opacity-80" /><div className="absolute inset-0 bg-gradient-to-t from-[#082b61]/80 to-transparent" /><span className="absolute bottom-6 left-6 text-7xl font-black text-white/80">{role.number}</span></div>
    <div className="flex flex-col justify-center p-7 sm:p-10"><p className="kc-eyebrow">Role {role.number}</p><h3 className="mt-3 text-4xl font-black tracking-tight text-[#0b2850] sm:text-5xl">{role.title}</h3><p className="mt-3 text-xl font-bold text-[#1460c2]">{role.short}</p><p className="mt-5 leading-7 text-[#486581]">{role.description}</p><ul className="mt-6 grid gap-2 text-sm font-bold text-[#284e75] sm:grid-cols-2">{role.areas.map((area) => <li key={area} className="flex items-center gap-2"><Check className="h-4 w-4 text-[#1460c2]" />{area}</li>)}</ul><a href={applicationHref} className="mt-8 inline-flex w-fit items-center gap-2 font-black text-[#1460c2] hover:text-[#082b61]">Apply for {role.title} <ArrowRight className="h-4 w-4" /></a></div>
  </motion.article>;
}

export default function ManpowerPage() {
  const reducedMotion = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement>(null);
  const rolesRef = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const { scrollYProgress: rolesProgress } = useScroll({ target: rolesRef, offset: ['start start', 'end end'] });
  const { scrollYProgress: journeyProgress } = useScroll({ target: journeyRef, offset: ['start end', 'end start'] });
  const heroImageY = useTransform(heroProgress, [0, 1], ['0%', '12%']);
  const heroImageScale = useTransform(heroProgress, [0, 1], [1.04, 1.12]);
  const heroTypeY = useTransform(heroProgress, [0, 1], ['0%', '-10%']);
  const journeyLine = useTransform(journeyProgress, [0.12, 0.78], ['0%', '100%']);

  return (
    <div className="overflow-hidden bg-[#f1f6fb] text-[#102a43]">
      <section ref={heroRef} className="relative isolate min-h-[calc(100vh-126px)] overflow-hidden bg-[#082b61] text-white">
        <motion.div style={{ y: reducedMotion ? 0 : heroImageY, scale: reducedMotion ? 1 : heroImageScale }} className="absolute inset-0 -z-20 bg-[url('/assets/itaewon.jpg')] bg-cover bg-center opacity-65" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,31,72,.96),rgba(5,31,72,.72)_42%,rgba(5,31,72,.18)),linear-gradient(0deg,rgba(5,31,72,.55),transparent_55%)]" />
        <motion.div style={{ y: reducedMotion ? 0 : heroImageY }} className="absolute right-[8%] top-[18%] -z-10 hidden h-56 w-56 rotate-12 rounded-[42px] border border-white/25 bg-white/10 backdrop-blur-sm lg:block" aria-hidden="true" />
        <div className="mx-auto flex min-h-[calc(100vh-126px)] max-w-[1480px] items-end px-6 pb-20 pt-24 sm:px-10 lg:px-16 lg:pb-28">
          <motion.div style={{ y: reducedMotion ? 0 : heroTypeY }} className="max-w-4xl">
            <p className="mb-7 flex items-center gap-3 text-xs font-black uppercase tracking-[.28em] text-[#ffc400]"><Sparkles className="h-4 w-4" /> K-CUBE MANPOWER</p>
            <h1 className="max-w-4xl text-5xl font-black leading-[.96] tracking-[-.055em] sm:text-7xl lg:text-[clamp(5rem,9vw,9.5rem)]">Build Korea&apos;s culture ecosystem with us.</h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#d9e8fb] sm:text-xl">Join the people behind K-CUBE events, Korean culture content, learning, community programs and operations.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#roles" className="inline-flex items-center gap-3 rounded-full bg-[#1460c2] px-6 py-3.5 font-black text-white transition hover:bg-[#1d73df]">Explore opportunities <ArrowDown className="h-4 w-4" /></a>
              <a href={applicationHref} className="inline-flex items-center gap-3 rounded-full border border-white/50 px-6 py-3.5 font-black text-white transition hover:bg-white hover:text-[#082b61]">Apply now <ArrowRight className="h-4 w-4" /></a>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-7 right-8 hidden text-xs font-bold uppercase tracking-[.2em] text-white/60 lg:block">Scroll to meet the team</div>
      </section>

      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: .35 }} variants={reveal} transition={{ duration: .7 }} className="mx-auto max-w-[1480px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <p className="kc-eyebrow">Work with K-CUBE</p>
        <h2 className="mt-6 max-w-5xl text-5xl font-black leading-[.98] tracking-[-.045em] text-[#0b2850] sm:text-7xl">Culture is built by people.</h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-24"><p className="text-xl leading-9 text-[#486581]">K-CUBE brings together Korean culture, events, learning, food, community experiences and digital participation.</p><p className="text-xl leading-9 text-[#486581]">Behind every experience is a team that makes it happen. Bring your perspective, your craft and your energy to the ecosystem.</p></div>
      </motion.section>

      <section ref={rolesRef} id="roles" className="relative bg-[#e3eefb] lg:min-h-[220vh]">
        <div className="mx-auto max-w-[1480px] px-6 py-20 sm:px-10 lg:sticky lg:top-[126px] lg:flex lg:h-[calc(100vh-126px)] lg:items-center lg:gap-16 lg:px-16 lg:py-12">
          <div className="max-w-md shrink-0 lg:w-[35%]"><p className="kc-eyebrow">02 — Explore roles</p><h2 className="mt-5 text-5xl font-black leading-[.98] tracking-[-.045em] text-[#0b2850] sm:text-6xl">Find your place inside K-CUBE.</h2><p className="mt-6 text-lg leading-8 text-[#486581]">Scroll to explore opportunities and find the kind of work that feels like yours.</p><div className="mt-10 hidden h-1 w-40 overflow-hidden bg-[#c8d8eb] lg:block"><motion.div style={{ scaleX: reducedMotion ? 1 : rolesProgress }} className="h-full origin-left bg-[#1460c2]" /></div></div>
          <div className="mt-14 grid gap-5 lg:relative lg:mt-0 lg:h-[min(620px,72vh)] lg:flex-1">
            {roles.map((role, index) => <RoleCard key={role.number} role={role} index={index} progress={rolesProgress} reducedMotion={reducedMotion} />)}
          </div>
        </div>
      </section>

      <section className="bg-[#082b61] py-28 text-white sm:py-36"><div className="mx-auto max-w-[1480px] px-6 sm:px-10 lg:px-16"><p className="text-xs font-black uppercase tracking-[.28em] text-[#ffc400]">03 — What you could work on</p><h2 className="mt-6 max-w-4xl text-5xl font-black leading-[.95] tracking-[-.045em] sm:text-7xl">Work behind real experiences.</h2><div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{workAreas.map(([title, text], index) => <motion.div key={title} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .4 }} variants={reveal} transition={{ duration: .55, delay: index * .04 }} className="border-t border-white/25 pt-5"><p className="text-sm font-black tracking-[.24em] text-[#ffc400]">{title}</p><p className="mt-4 max-w-xs text-xl leading-8 text-[#d9e8fb]">{text}</p></motion.div>)}</div></div></section>

      <section className="mx-auto max-w-[1480px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40"><p className="kc-eyebrow">04 — Why join K-CUBE</p><h2 className="mt-6 max-w-3xl text-5xl font-black leading-[.98] tracking-[-.045em] text-[#0b2850] sm:text-7xl">Bring your point of view.</h2><div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2">{benefits.map(([title, text], index) => <motion.article key={title} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .35 }} variants={reveal} transition={{ duration: .6, delay: index * .08 }} className={index % 2 ? 'sm:mt-16' : ''}><p className="text-sm font-black text-[#1460c2]">0{index + 1}</p><h3 className="mt-4 text-3xl font-black text-[#0b2850]">{title}</h3><p className="mt-4 max-w-md text-lg leading-8 text-[#486581]">{text}</p></motion.article>)}</div></section>

      <section ref={journeyRef} className="bg-white px-6 py-28 sm:px-10 lg:px-16 lg:py-36"><div className="mx-auto grid max-w-[1480px] gap-16 lg:grid-cols-[.8fr_1.2fr]"><div className="lg:sticky lg:top-44 lg:h-fit"><p className="kc-eyebrow">05 — Application journey</p><h2 className="mt-6 max-w-md text-5xl font-black leading-[.98] tracking-[-.045em] text-[#0b2850] sm:text-6xl">Your journey into K-CUBE.</h2><p className="mt-6 max-w-md text-lg leading-8 text-[#486581]">A clear conversation about where your skills can contribute. No automatic acceptance is promised.</p></div><div className="relative"><div className="absolute bottom-7 left-[21px] top-7 w-px bg-[#d8e4f0]" /><motion.div style={{ height: reducedMotion ? '100%' : journeyLine }} className="absolute left-[20px] top-7 w-0.5 origin-top bg-[#1460c2]" />{journey.map(([number, title, text]) => <div key={number} className="relative flex gap-7 pb-16 last:pb-0"><span className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#1460c2] bg-white text-sm font-black text-[#1460c2]">{number}</span><div><h3 className="text-3xl font-black text-[#0b2850]">{title}</h3><p className="mt-3 max-w-lg text-lg leading-8 text-[#486581]">{text}</p></div></div>)}</div></div></section>

      <section id="application" className="relative overflow-hidden bg-[#1460c2] px-6 py-28 text-white sm:px-10 lg:px-16 lg:py-40"><div className="absolute inset-0 bg-[url('/assets/k-cube-banner.png')] bg-cover bg-center opacity-15" /><div className="relative mx-auto max-w-[1480px]"><p className="text-xs font-black uppercase tracking-[.28em] text-[#ffc400]">06 — Start the conversation</p><h2 className="mt-6 max-w-4xl text-5xl font-black leading-[.95] tracking-[-.05em] sm:text-7xl">Ready to build with K-CUBE?</h2><p className="mt-8 max-w-2xl text-xl leading-8 text-white/85">Choose the opportunity that fits you and tell us how you&apos;d like to contribute.</p><div className="mt-10 flex flex-wrap gap-4"><a href={applicationHref} className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 font-black text-[#082b61] transition hover:bg-[#ffc400]">Apply to K-CUBE <Mail className="h-4 w-4" /></a><Link href="/about" className="inline-flex items-center gap-3 rounded-full border border-white/60 px-6 py-3.5 font-black transition hover:bg-white hover:text-[#082b61]">Explore K-CUBE <ArrowRight className="h-4 w-4" /></Link></div><p className="mt-6 text-sm text-white/70">For role applications, email the K-CUBE team with your preferred role and a short introduction.</p></div></section>
      <style jsx>{`@media (prefers-reduced-motion: reduce) { :global(html) { scroll-behavior: auto; } }`}</style>
    </div>
  );
}
