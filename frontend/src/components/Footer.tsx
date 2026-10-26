"use client";

import { contact } from '@/lib/contact';
import Link from 'next/link';
import Image from 'next/image';
import { useAppStore, type Language } from '@/store/useAppStore';
import { repairMojibakeTree } from '@/lib/repairMojibake';

const footerCopyData: Record<Language, Record<string, string>> = {
  en: {
    line: 'A points-first Korean culture, learning, K-Food, events, and rewards ecosystem.',
    platform: 'Platform',
    support: 'Support',
    commerce: 'Commerce',
    rights: 'Designed for K-CUBE.store and the internal K-CUBE shop.',
    activities: 'Activities',
    learning: 'Korean Learning',
    kfood: 'K-Food',
    rewards: 'Rewards',
    events: 'Events',
    about: 'About',
    contact: 'Contact',
    manpower: 'Manpower',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    trip: 'Trip to Korea',
  },
  ko: {
    line: 'í¬ì¸íŠ¸ ì¤‘ì‹¬ì˜ í•œêµ­ ë¬¸í™”, í•™ìŠµ, K-Food, ì´ë²¤íŠ¸, ë¦¬ì›Œë“œ ìƒíƒœê³„.',
    platform: 'í”Œëž«í¼',
    support: 'ì§€ì›',
    commerce: 'ì»¤ë¨¸ìŠ¤',
    rights: 'K-CUBE.storeì™€ ë‚´ë¶ K-CUBE shopì„ ìœ„í•´ ì„¤ê³„ë˜ì—ˆìŠµë‹ˆë‹¤.',
    activities: 'í™œë™',
    learning: 'í•œêµ­ì–´ í•™ìŠµ',
    kfood: 'K-í‘¸ë“œ',
    rewards: 'ë¦¬ì›Œë“œ',
    events: 'ì´ë²¤íŠ¸',
    about: 'ì†Œê°œ',
    contact: 'ë¬¸ì˜',
    manpower: 'ì¸ë ¥ ì§€ì›',
    signIn: 'ë¡œê·¸ì¸',
    signUp: 'íšŒì›ê°€ìž…',
    trip: 'í•œêµ­ ì—¬í–‰',
  },
  hi: {
    line: 'à¤ªà¥‰à¤‡à¤‚à¤Ÿà¥à¤¸-à¤•à¥‡à¤‚à¤¦à¥à¤°à¤¿à¤¤ à¤•à¥‹à¤°à¤¿à¤¯à¤¾à¤ˆ à¤¸à¤‚à¤¸à¥à¤•à¥ƒà¤¤à¤¿, à¤¸à¥€à¤–à¤¨à¥‡, à¤•à¥‡-à¤«à¥‚à¤¡, à¤‡à¤µà¥‡à¤‚à¤Ÿà¥à¤¸ à¤”à¤° à¤ªà¥à¤°à¤¸à¥à¤•à¤¾à¤°à¥‹à¤‚ à¤•à¤¾ à¤‡à¤•à¥‹à¤¸à¤¿à¤¸à¥à¤Ÿà¤®à¥¤',
    platform: 'à¤ªà¥à¤²à¥‡à¤Ÿà¤«à¤¼à¥‰à¤°à¥à¤®',
    support: 'à¤¸à¤¹à¤¾à¤¯à¤¤à¤¾',
    commerce: 'à¤•à¥‰à¤®à¤°à¥à¤¸',
    rights: 'K-CUBE.store à¤”à¤° internal K-CUBE shop à¤•à¥‡ à¤²à¤¿à¤ à¤¡à¤¿à¤œà¤¼à¤¾à¤‡à¤¨ à¤•à¤¿à¤¯à¤¾ à¤—à¤¯à¤¾à¥¤',
    activities: 'à¤—à¤¤à¤¿à¤µà¤¿à¤§à¤¿à¤¯à¤¾à¤',
    learning: 'à¤•à¥‹à¤°à¤¿à¤¯à¤¾à¤ˆ à¤­à¤¾à¤·à¤¾ à¤¸à¥€à¤–à¤¨à¤¾',
    kfood: 'à¤•à¥‡-à¤«à¥‚à¤¡',
    rewards: 'à¤ªà¥à¤°à¤¸à¥à¤•à¤¾à¤°',
    events: 'à¤‡à¤µà¥‡à¤‚à¤Ÿà¥à¤¸',
    about: 'à¤¹à¤®à¤¾à¤°à¥‡ à¤¬à¤¾à¤°à¥‡ à¤®à¥‡à¤‚',
    contact: 'à¤¸à¤‚à¤ªà¤°à¥à¤•',
    manpower: 'à¤®à¥ˆà¤¨à¤ªà¤¾à¤µà¤°',
    signIn: 'à¤¸à¤¾à¤‡à¤¨ à¤‡à¤¨',
    signUp: 'à¤¸à¤¾à¤‡à¤¨ à¤…à¤ª',
    trip: 'à¤•à¥‹à¤°à¤¿à¤¯à¤¾ à¤¯à¤¾à¤¤à¥à¤°à¤¾',
  },
};

const footerCopy = repairMojibakeTree(footerCopyData);

const Footer = () => {
  const language = useAppStore((state) => state.language);
  const t = footerCopy[language];

  return (
    <footer className="border-t border-[var(--kc-border)] bg-white/90 px-5 py-12 text-[var(--kc-text-secondary)] lg:px-10">
      <div className="mx-auto grid kc-content gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" aria-label="K-CUBE home" className="inline-flex">
            <Image src="/assets/k-cube-logo.png" alt="K-CUBE" width={1316} height={1195} sizes="110px" className="h-24 w-auto object-contain" />
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-7">{t.line}</p>
          <address className="mt-4 flex flex-col items-start gap-2 text-sm not-italic">
            <a href={contact.phoneHref} className="font-semibold underline-offset-4 hover:underline">{contact.phone}</a>
            <a href={`mailto:${contact.email}`} className="break-all font-semibold underline-offset-4 hover:underline">{contact.email}</a>
          </address>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--kc-blue-700)]">{t.platform}</p>
          <Link href="/activities" className="block text-sm hover:text-[var(--kc-blue-700)]">{t.activities}</Link>
          <Link href="/learning" className="block text-sm hover:text-[var(--kc-blue-700)]">{t.learning}</Link>
          <Link href="/kfood" className="block text-sm hover:text-[var(--kc-blue-700)]">{t.kfood}</Link>
          <Link href="/rewards" className="block text-sm hover:text-[var(--kc-blue-700)]">{t.rewards}</Link>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--kc-blue-700)]">{t.support}</p>
          <Link href="/events" className="block text-sm hover:text-[var(--kc-blue-700)]">{t.events}</Link>
          <Link href="/about" className="block text-sm hover:text-[var(--kc-blue-700)]">{t.about}</Link>
          <Link href="/contact" className="block text-sm hover:text-[var(--kc-blue-700)]">{t.contact}</Link>
          <Link href="/apply-for-manpower" className="block text-sm hover:text-[var(--kc-blue-700)]">{t.manpower}</Link>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--kc-blue-700)]">{t.commerce}</p>
          <Link href="/shop" className="block text-sm hover:text-[var(--kc-blue-700)]">K-CUBE Shop</Link>
          <Link href="/signin" className="block text-sm hover:text-[var(--kc-blue-700)]">{t.signIn}</Link>
          <Link href="/signup" className="block text-sm hover:text-[var(--kc-blue-700)]">{t.signUp}</Link>
          <Link href="/trip-to-korea" className="block text-sm hover:text-[var(--kc-blue-700)]">{t.trip}</Link>
        </div>
      </div>
      <div className="mx-auto mt-10 kc-content border-t border-[var(--kc-border-soft)] pt-6 text-sm text-[var(--kc-text-muted)]">
        © 2026 K-CUBE. {t.rights}
      </div>
    </footer>
  );
};

export default Footer;
