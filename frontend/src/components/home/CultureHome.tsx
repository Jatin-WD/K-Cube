'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight, Sparkles, Heart, BookOpen, Utensils, ShoppingBag, Music2, Plane, Gift } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { ShopProduct } from '@/lib/shopCatalog';
import IndiaPreSelectionSection from './IndiaPreSelectionSection';
import OfficialRepresentationSection from './OfficialRepresentationSection';
import HomeCampaignBanner from './HomeCampaignBanner';
import LiveProductGrid from '@/components/LiveProductGrid';
import HomeMotion from './HomeMotion';

const photo = (id: string, width = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
const categories = [
  { title: 'Korean Learning', detail: 'A little Hangul, every day', href: '/learning', icon: BookOpen, color: 'lilac', mark: '안녕' },
  { title: 'K-Food', detail: 'Your next delicious discovery', href: '/kfood', icon: Utensils, color: 'peach', mark: '맛있다' },
  { title: 'K-Shopping', detail: 'Find your Korean favourites', href: '/shop', icon: ShoppingBag, color: 'pink', mark: '좋아요' },
  { title: 'Culture & Events', detail: 'Find your people. Feel the energy.', href: '/events', icon: Music2, color: 'mint', mark: '함께' },
];
const copy = {
  en: { discover: 'Find your kind of Korea', sub: 'One world. So many ways to fall in love.', edit: 'The K-CUBE edit', picks: 'Little finds. Big favourites.', all: 'Explore the shop', community: 'Your people. Your passions.', together: 'Your K-CUBE community.', join: 'Find your people', journey: 'Every discovery takes you further.', start: 'Start your K-journey', intro: 'Learn, take part and explore eligible activities to earn points. Find your next reward and follow the Trip to Korea programme.' },
  hi: { discover: 'अपनी पसंद का कोरिया खोजें', sub: 'एक दुनिया, पसंद करने की अनगिनत वजहें।', edit: 'K-CUBE की खास पसंद', picks: 'छोटी खोज। बड़ी खुशियाँ।', all: 'शॉप देखें', community: 'आपके लोग। आपका जुनून।', together: 'आपकी K-CUBE कम्युनिटी।', join: 'कम्युनिटी से जुड़ें', journey: 'हर खोज आपको आगे ले जाती है।', start: 'अपना K-सफ़र शुरू करें', intro: 'सीखें, भाग लें और योग्य गतिविधियों से पॉइंट्स कमाएँ। रिवॉर्ड्स और Trip to Korea कार्यक्रम की जानकारी देखें।' },
  ko: { discover: '나만의 한국을 발견하세요', sub: '하나의 세계, 사랑할 이유는 무궁무진.', edit: 'K-CUBE 셀렉션', picks: '작은 발견, 큰 즐거움.', all: '쇼핑 둘러보기', community: '같은 관심사로 만나는 우리.', together: '나의 K-CUBE 커뮤니티.', join: '커뮤니티 참여하기', journey: '모든 발견이 새로운 시작이 됩니다.', start: '한국 여행 시작하기', intro: '배우고 참여하며 적립 대상 활동으로 포인트를 모으세요. 리워드와 한국 여행 프로그램을 확인하세요.' },
};

export default function CultureHome({ initialProducts }: { initialProducts: ShopProduct[] | null }) {
  const language = useAppStore((state) => state.language);
  const t = copy[language];


  return <HomeMotion>
    <h1 className="sr-only">K-CUBE - Your Little World of Korea</h1>
    <div className="culture-welcome"><Sparkles size={14} /> A whole world of Korea, closer to you. <Link href="/signup">Make it yours <ArrowRight size={13} /></Link></div>
    <HomeCampaignBanner />
    <div className="culture-ticker" aria-hidden="true">K-CULTURE <span>✳</span> LITTLE DISCOVERIES <span>✳</span> BIG EXPERIENCES <span>✳</span> MADE FOR YOU <span>✳</span> K-CULTURE <span>✳</span> LITTLE DISCOVERIES</div>
    <section className="culture-section culture-motion-discovery" id="discover">
      <span className="culture-motion-hangul" data-hangul-parallax="" lang="ko" aria-hidden="true">발견<span className="culture-motion-diamond" /></span>
      <div className="culture-section-heading"><div><p className="culture-kicker">CHOOSE YOUR MOOD</p><h2>{t.discover}</h2></div><p>{t.sub}</p></div>
      <div className="culture-category-grid">{categories.map(({ title, detail, href, icon: Icon, color, mark }, i) => <Link href={href} className={`culture-category ${color}`} key={href}><div className="culture-category-top"><Icon size={24} strokeWidth={1.5} aria-hidden="true" /><span>0{i + 1}</span></div><span className="culture-category-mark" lang="ko" aria-hidden="true">{mark}</span><div><h3>{title}</h3><p>{detail}</p></div><span className="culture-round-arrow"><ArrowUpRight size={20} /></span></Link>)}</div>
    </section>
    <section className="culture-section culture-feature-grid">
      <Link href="/shop?store=moa_beauty" className="culture-feature beauty"><div><span className="culture-kicker">THE K-BEAUTY FEELING</span><h2>A fresh kind<br />of glow.</h2><p>Discover your next skincare ritual.</p><span className="culture-text-link">Explore K-Beauty <ArrowUpRight size={17} /></span></div><Image src={photo('photo-1608248543803-ba4f8c70ae0b', 700)} alt="Korean skincare inspired beauty essentials" loading="lazy" sizes="(max-width: 600px) 45vw, 26vw" width={700} height={700} /></Link>
      <Link href="/kfood" className="culture-feature food"><div><span className="culture-kicker">CRAVINGS, MEET YOUR MATCH</span><h2>Bring on<br />the flavour.</h2><p>Your K-drama night starts here.</p><span className="culture-text-link">Discover K-Food <ArrowUpRight size={17} /></span></div><Image src={photo('photo-1498654896293-37aacf113fd9', 700)} alt="Colourful Korean food served with side dishes" loading="lazy" sizes="(max-width: 600px) 45vw, 26vw" width={700} height={700} /></Link>
    </section>
    <section className="culture-section culture-shop"><div className="culture-section-heading"><div><p className="culture-kicker"><span lang="ko" className="culture-editorial-korean">오늘의 픽</span><span aria-hidden="true"> / </span>{language === 'en' ? "Today's picks" : t.edit}</p><h2>{t.picks}</h2></div><Link className="culture-text-link" href="/shop">{t.all} <ArrowRight size={17} /></Link></div><LiveProductGrid initialProducts={initialProducts} limit={4} /></section>
    <section className="culture-community"><div className="culture-community-art" aria-hidden="true"><span>안녕</span><Heart className="culture-big-heart" /><span className="culture-community-star">✳</span><div>K-CUBE<br /><strong>CLUB</strong><small>A LITTLE MORE CONNECTED.</small></div></div><div className="culture-community-copy"><span className="culture-kicker">{t.community}</span><h2>Same love.<br />New friends.<br /><em>{t.together}</em></h2><p>From your first Korean word to your next cultural adventure—everything feels better when you share it.</p><Link className="culture-cta" href="/activities">{t.join}<ArrowUpRight size={19} /></Link></div></section>
    <div className="culture-official"><IndiaPreSelectionSection /><OfficialRepresentationSection /></div>
    <section className="culture-section"><div className="culture-journey"><div><span className="culture-kicker"><Gift size={15} /> EXPLORE. PARTICIPATE. EARN.</span><h2>{t.journey}</h2><p>{t.intro}</p><Link className="culture-cta" href="/rewards">{t.start} <ArrowUpRight size={18} /></Link></div><div className="culture-boarding">
      <div className="culture-boarding-header"><span><Plane size={17} strokeWidth={1.7} aria-hidden="true" /> K-CUBE JOURNEYS</span><span lang="ko">한국</span></div>
      <p className="culture-boarding-kicker">YOUR NEXT CHAPTER</p>
      <div className="culture-boarding-route">
        <div><strong>IND</strong><span>India</span></div>
        <span className="culture-boarding-flight" aria-hidden="true"><span /><Plane size={24} strokeWidth={1.5} /><span /></span>
        <div><strong>KOR</strong><span>South Korea</span></div>
      </div>
      <p className="culture-boarding-note">One passion. Endless possibilities.</p>
      <div className="culture-boarding-bottom"><span>Discover the programme</span><Link href="/trip-to-korea">Explore Trip to Korea <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </div></div></section>
    <div className="culture-values"><span><Heart /> A love for Korean culture</span><span><BookOpen /> Learn something new</span><span><Music2 /> Experiences that connect</span><span><Gift /> Discover eligible rewards</span></div>
  </HomeMotion>;
}
