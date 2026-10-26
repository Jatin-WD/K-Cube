'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, ChevronLeft, ChevronRight, Gift, Music2, Pause, Play, Sparkles, Utensils } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const campaigns = [
  {
    image: '/assets/banners/kcube-kfood-campaign-v1.webp', theme: 'food',
    en: { tab: 'Your Korean food fix', tag: 'K-FOOD · BIG FLAVOURS, HAPPY MOMENTS', title: ['Seoul good.', 'Every single bite.'], text: 'Spicy ramyeon, irresistible snacks and new favourites. Bring a little Korea to your table.', action: 'Discover K-Food', secondary: 'Explore the shop' },
    hi: { tab: 'कोरियन फ़ूड का मज़ा', tag: 'K-FOOD · हर स्वाद में खुशी', title: ['कोरिया का स्वाद।', 'हर बाइट में मज़ा।'], text: 'स्पाइसी राम्योन, मज़ेदार स्नैक्स और नए पसंदीदा स्वाद। अपनी टेबल पर कोरिया का मज़ा लाएँ।', action: 'K-Food खोजें', secondary: 'शॉप देखें' },
    ko: { tab: '맛있는 한국의 발견', tag: 'K-FOOD · 맛있는 순간을 함께', title: ['한 입 가득,', '한국의 맛.'], text: '매콤한 라면부터 맛있는 간식까지. 식탁에서 만나는 새로운 한국의 맛.', action: 'K-Food 둘러보기', secondary: '쇼핑 둘러보기' },
    href: '/kfood', secondaryHref: '/shop',
  },
  {
    image: '/assets/banners/kcube-kbeauty-campaign-v1.webp', theme: 'beauty',
    en: { tab: 'A little everyday glow', tag: 'THE K-BEAUTY EDIT', title: ['Your ritual.', 'A fresh kind of glow.'], text: 'A little care. A little self-love. Discover Korean beauty and find your next everyday favourite.', action: 'Explore K-Beauty', secondary: 'Discover your K-world' },
    hi: { tab: 'हर दिन थोड़ा ग्लो', tag: 'K-BEAUTY की खास पसंद', title: ['अपना रिचुअल।', 'एक नया ग्लो।'], text: 'थोड़ी देखभाल, थोड़ा अपने लिए प्यार। कोरियन ब्यूटी में अपना अगला पसंदीदा प्रोडक्ट खोजें।', action: 'K-Beauty देखें', secondary: 'अपनी K-दुनिया खोजें' },
    ko: { tab: '매일 만나는 새로운 빛', tag: 'K-BEAUTY 셀렉션', title: ['나만의 루틴,', '새로운 빛.'], text: '나를 위한 작은 정성. 한국 뷰티에서 매일 함께할 새로운 아이템을 발견하세요.', action: 'K-Beauty 둘러보기', secondary: '나의 한국 발견하기' },
    href: '/shop?store=moa_beauty', secondaryHref: '#discover',
  },
];

export default function HomeCampaignBanner() {
  const language = useAppStore((state) => state.language);
  const feature = {
    en: { learn: 'KOREAN LEARNING', learnTitle: 'Your first 안녕.\nA whole new world.', learnText: 'Hangul, everyday words and speaking practice. Start at your own pace.', learnAction: 'Start learning', play: 'CULTURE, COMMUNITY & YOU', playTitle: 'Do what you love.\nMake it rewarding.', playText: 'Explore K-Pop, dance, culture activities and eligible point rewards.', activities: 'Explore activities', events: 'Find events', rewards: 'Points & rewards' },
    hi: { learn: 'कोरियन लर्निंग', learnTitle: 'पहला 안녕।\nएक नई दुनिया।', learnText: 'हंगुल, रोज़मर्रा के शब्द और बोलने की प्रैक्टिस। अपनी गति से सीखें।', learnAction: 'सीखना शुरू करें', play: 'कल्चर और कम्युनिटी', playTitle: 'अपनी पसंद चुनें।\nकुछ नया करें।', playText: 'K-Pop, डांस और कल्चर एक्टिविटीज़ में हिस्सा लें और योग्य पॉइंट रिवॉर्ड्स खोजें।', activities: 'एक्टिविटीज़ देखें', events: 'इवेंट्स खोजें', rewards: 'पॉइंट्स और रिवॉर्ड्स' },
    ko: { learn: '한국어 학습', learnTitle: '첫 번째 안녕.\n새로운 세상의 시작.', learnText: '한글부터 일상 단어와 말하기 연습까지. 나만의 속도로 배워보세요.', learnAction: '학습 시작하기', play: '문화와 커뮤니티', playTitle: '좋아하는 활동,\n새로운 즐거움.', playText: 'K-Pop, 댄스, 문화 활동과 적립 대상 포인트 리워드를 만나보세요.', activities: '활동 둘러보기', events: '이벤트 찾기', rewards: '포인트 및 리워드' },
  }[language];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    preference.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      preference.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);
  useEffect(() => {
    if (paused || hovered || focused || reducedMotion || !pageVisible) return;
    const timer = window.setInterval(() => setIndex((previous) => (previous + 1) % campaigns.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused, index, reducedMotion, pageVisible]);

  const select = (next: number) => setIndex((next + campaigns.length) % campaigns.length);
  const controls = { en: { previous: 'Previous banner', next: 'Next banner', pause: 'Pause slideshow', play: 'Play slideshow', label: 'K-CUBE featured collections' }, hi: { previous: 'पिछला बैनर', next: 'अगला बैनर', pause: 'स्लाइडशो रोकें', play: 'स्लाइडशो चलाएँ', label: 'K-CUBE की खास कलेक्शन' }, ko: { previous: '이전 배너', next: '다음 배너', pause: '슬라이드쇼 일시 정지', play: '슬라이드쇼 재생', label: 'K-CUBE 추천 컬렉션' } }[language];

  return <div className="kc-hero-layout"><section className="kc-campaign-shell" aria-roledescription="carousel" aria-label={controls.label} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
    <div className="kc-campaign-stage">
      {campaigns.map((campaign, i) => {
        const text = campaign[language];
        const active = index === i;
        return <div key={campaign.theme} className={`kc-campaign-slide ${campaign.theme}${active ? ' is-active' : ''}`} aria-hidden={!active} inert={!active} role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${campaigns.length}`}>
          <Image className="kc-campaign-art" src={campaign.image} alt="" width={2172} height={724} quality={70} sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1050px) calc(100vw - 64px), (min-width: 1384px) 897px, calc(68.75vw - 55px)" loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'low'} />
          <div className="kc-campaign-copy"><span className="kc-campaign-eyebrow"><Sparkles size={14} />{text.tag}</span><h2 className="kc-campaign-title">{text.title[0]}<br /><em>{text.title[1]}</em></h2><p>{text.text}</p><div className="kc-campaign-actions"><Link className="kc-campaign-button" href={campaign.href}>{text.action}<ArrowRight size={18} /></Link><Link className="kc-campaign-secondary" href={campaign.secondaryHref}>{text.secondary}<ArrowRight size={14} /></Link></div></div>
        </div>;
      })}
      <div className="kc-campaign-controls"><button onClick={() => select(index - 1)} aria-label={controls.previous}><ChevronLeft size={18} /></button><span>0{index + 1} <span>/ 0{campaigns.length}</span></span><button onClick={() => select(index + 1)} aria-label={controls.next}><ChevronRight size={18} /></button><span className="kc-campaign-control-divider" /><button onClick={() => setPaused((previous) => !previous)} aria-pressed={paused} aria-label={paused ? controls.play : controls.pause}>{paused ? <Play size={14} /> : <Pause size={14} />}</button></div>
    </div>
    <div className="kc-campaign-tabs">{campaigns.map((campaign, i) => <button key={campaign.theme} aria-pressed={index === i} onClick={() => select(i)} className={index === i ? 'is-active' : ''}><span className="kc-campaign-tab-number">0{i + 1}</span>{i === 0 ? <Utensils size={17} /> : <Sparkles size={17} />}<span>{campaign[language].tab}</span><ArrowRight size={16} /></button>)}</div>
  </section>
    <div className="kc-hero-features">
      <Link href="/learning" className="kc-hero-feature kc-hero-learn">
        <span className="kc-hero-feature-kicker"><BookOpen size={14} />{feature.learn}</span>
        <h2>{feature.learnTitle}</h2><p>{feature.learnText}</p>
        <span className="kc-hero-feature-action">{feature.learnAction}<ArrowUpRight size={17} /></span>
        <span className="kc-hero-hangul" aria-hidden="true">한<br />글</span>
        <span className="kc-hero-feature-spark" aria-hidden="true">✳</span>
      </Link>
      <article className="kc-hero-feature kc-hero-participate">
        <span className="kc-hero-feature-kicker"><Music2 size={14} />{feature.play}</span>
        <h2>{feature.playTitle}</h2><p>{feature.playText}</p>
        <Link href="/activities" className="kc-hero-feature-action">{feature.activities}<ArrowUpRight size={17} /></Link>
        <div className="kc-hero-feature-links"><Link href="/events">{feature.events}<ArrowRight size={12} /></Link><Link href="/rewards">{feature.rewards}<ArrowRight size={12} /></Link></div>
        <span className="kc-hero-gift" aria-hidden="true"><Gift size={46} strokeWidth={1.25} /></span>
      </article>
    </div>
  </div>;
}
