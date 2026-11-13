'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Gift, Music2, ShoppingBag, Utensils, X } from 'lucide-react';
import type { Language } from '@/store/useAppStore';
import type { MegaSection, MenuLink } from '@/lib/kcubeContent';
import { allMenuCategories } from '@/lib/kcubeContent';
import { megaMenuFeatures } from '@/lib/megaMenuFeatures';
import { repairMojibakeTree } from '@/lib/repairMojibake';

interface MegaMenuProps {
  sections: MegaSection[];
  language: Language;
  title?: string;
  href?: string;
  onNavigate?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  variant?: 'default' | 'all';
}

const labels = {
  en: { explore: 'Explore K-CUBE', hint: 'Find what you love. Go straight there.', view: 'View all', quick: 'Quick links', close: 'Close navigation', rewards: 'Points & rewards', updates: 'Festival updates', trip: 'Trip to Korea' },
  hi: { explore: 'K-CUBE एक्सप्लोर करें', hint: 'अपनी पसंद चुनें और सीधे पेज खोलें।', view: 'सभी देखें', quick: 'ज़रूरी लिंक', close: 'मेन्यू बंद करें', rewards: 'पॉइंट्स और रिवॉर्ड्स', updates: 'फ़ेस्टिवल अपडेट्स', trip: 'कोरिया यात्रा' },
  ko: { explore: 'K-CUBE 둘러보기', hint: '관심 있는 페이지로 바로 이동하세요.', view: '전체 보기', quick: '바로가기', close: '메뉴 닫기', rewards: '포인트 및 리워드', updates: '페스티벌 소식', trip: '한국 여행' },
};

const iconFor = (href: string) => href.startsWith('/learning') ? BookOpen : href.startsWith('/kfood') ? Utensils : href.startsWith('/shop') ? ShoppingBag : href.startsWith('/rewards') ? Gift : href.startsWith('/activities') ? Music2 : CalendarDays;

// One shared panel and grid keeps every category aligned with Explore.
export default function MegaMenu({ sections, language, title, href, onNavigate, onMouseEnter, onMouseLeave, variant = 'default' }: MegaMenuProps) {
  const t = labels[language];
  const all = variant === 'all';
  const eventsMenu = !all && href === '/events';
  const categories = repairMojibakeTree(allMenuCategories);
  const seen = new Set<string>();
  const links = repairMojibakeTree(sections.flatMap((section) => section.links)).filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    link.children?.forEach((child) => seen.add(child.href));
    return true;
  });
  const descriptions: Record<string, string> = {
    '/events': 'Classes, workshops & festivals',
    '/activities': 'K-Pop, dance & culture challenges',
    '/learning': 'Learn Korean, one step at a time',
    '/kfood': 'Korean recipes & food challenges',
    '/shop': 'Korean food, skincare & lifestyle',
    '/rewards': 'Ways to earn points & unlock rewards',
    '/trip-to-korea': 'Trip programme & qualification details',
    '/india-pre-selection': 'Past event: 4-6 October 2026. View the archive.',
    '/india-pre-selection/information': 'Discover the festival and India participation',
    '/events/korean-language-culture-class': 'Class details, attendance & learning rewards',
    '/events/culture-workshops': 'Discover language, food, dance & culture workshops',
    '/events/seoul-culture-conference': 'Explore Korean music, drama, food & culture',
    '/activities/k-pop-missions': 'Music quizzes & fan challenges',
    '/activities/k-dance-covers': 'Share your dance covers & join challenges',
    '/activities/k-drama-culture': 'Explore dramas, lifestyle & Korean culture',
    '/learning/beginner-korean': 'Start with Hangul, greetings & everyday phrases',
    '/learning/vocabulary-streaks': 'Build your Korean vocabulary with daily practice',
    '/learning/speaking-practice': 'Practise pronunciation & everyday conversations',
    '/kfood/korean-recipes': 'Find Korean dishes to try at home',
    '/kfood/food-missions': 'Cook, share & take part in food challenges',
  };
  const cards: MenuLink[] = all ? [
    ...categories.map((category) => ({ label: category.label, href: category.href, description: category.description })),
    { label: { en: t.rewards, hi: labels.hi.rewards, ko: labels.ko.rewards }, href: '/rewards', description: { en: descriptions['/rewards'], hi: labels.hi.rewards, ko: labels.ko.rewards } },
  ] : links;
  const featureKey = !all && href && href in megaMenuFeatures ? href as keyof typeof megaMenuFeatures : '/';
  const feature = megaMenuFeatures[featureKey];
  const sparse = !eventsMenu && cards.length <= 4 && cards.length !== 3;
  const moreLabel = { en: 'More options', hi: '\u0914\u0930 \u0935\u093f\u0915\u0932\u094d\u092a', ko: '\ub354 \ubcf4\uae30' }[language];

  return <div id="desktop-mega-menu" data-mega-panel className="kc-menu-wrap kc-header-container" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    <section className={`kc-menu-panel${!all && href ? ` kc-menu-${href.replace(/^\//, '').split('/')[0].replace(/[^a-z0-9-]/gi, '')}` : ' kc-menu-all'}`} aria-label={all ? t.explore : title}>
      <div className={`kc-menu-heading${eventsMenu ? ' kc-menu-heading-events' : ''}`}>
        {eventsMenu && <div className="kc-menu-cultural-mark" aria-hidden="true"><span lang="ko">문화</span><i /></div>}
        <div><h2>{all ? t.explore : title}</h2><p>{t.hint}</p></div>
        <div className="kc-menu-heading-actions">{!all && href && <Link href={href} onClick={onNavigate}>{t.view} {title}<ArrowRight size={15} /></Link>}<button type="button" onClick={onNavigate} aria-label={t.close}><X size={18} /></button></div>
      </div>
      <div className="kc-menu-body">
      <div className={`kc-menu-cards${eventsMenu ? ' kc-menu-events' : ''}${sparse ? ' kc-menu-compact' : ''}${cards.length === 4 && !eventsMenu ? ' kc-menu-four' : ''}`}>{cards.map((link) => {
        const Icon = iconFor(link.href);
        const children = link.children?.filter((child) => child.href !== link.href) ?? [];
        const festival = link.href === '/india-pre-selection';
        const description = language === 'en' ? descriptions[link.href] ?? link.description.en : link.description[language];
        const childLinks = children.map((child) => <Link key={`${child.href}-${child.label.en}`} href={child.href} onClick={onNavigate} {...(child.external ? { target: '_blank', rel: 'noreferrer' } : {})}>{child.label[language]}{child.external ? <ArrowUpRight size={12} /> : <ArrowRight size={12} />}</Link>);
        const eventVisual = eventsMenu ? link.href.includes('language') ? ' kc-event-language' : link.href.includes('workshops') ? ' kc-event-workshops' : link.href.includes('conference') ? ' kc-event-conference' : festival ? ' kc-event-festival' : '' : '';
        return <article key={`${link.href}-${link.label.en}`} className={`kc-menu-card${eventVisual}`}>
          <Link className="kc-menu-card-main" href={link.href} onClick={onNavigate} {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
            <span className="kc-menu-icon"><Icon size={21} strokeWidth={1.7} /></span>
            <span className="kc-menu-card-copy">{eventsMenu && festival && <small className="kc-event-eyebrow">{language === 'en' ? 'Completed | 4-6 Oct 2026' : language === 'ko' ? '2026 | \uc885\ub8cc' : '2026 | \u0938\u0902\u092a\u0928\u094d\u0928'}</small>}<strong>{link.label[language]}</strong><span title={description}>{description}</span></span>
            {link.external ? <ArrowUpRight size={16} /> : <ArrowRight size={16} />}
          </Link>
          {!!children.length && ((festival || !all) ? <div className="kc-menu-card-children">{childLinks}</div> : <details className="kc-menu-more" open={!all}><summary>{moreLabel}</summary><div className="kc-menu-card-children">{childLinks}</div></details>)}
        </article>;
      })}</div>
      <aside className={`kc-menu-editorial ${feature.theme}`} aria-label={feature.title[language]}>
        <div className="kc-menu-editorial-mark" aria-hidden="true"><span lang="ko">{feature.word}</span><span className="kc-menu-editorial-diamond" /></div>
        <p className="kc-menu-editorial-gloss">{feature.gloss}</p>
        <h3>{feature.title[language]}</h3>
        <p className="kc-menu-editorial-description">{feature.description[language]}</p>
        <Link href={feature.href} onClick={onNavigate}>{feature.action[language]}<ArrowUpRight size={16} aria-hidden="true" /></Link>
      </aside>
      </div>
      <div className="kc-menu-quick"><Link href="/india-pre-selection/announcement" onClick={onNavigate}>{t.updates}<ArrowUpRight size={13} /></Link><Link href="/rewards" onClick={onNavigate}>{t.rewards}<ArrowUpRight size={13} /></Link><Link href="/trip-to-korea" onClick={onNavigate}>{t.trip}<ArrowUpRight size={13} /></Link></div>
    </section>
  </div>;
}
