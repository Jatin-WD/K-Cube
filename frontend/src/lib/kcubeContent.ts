import type { Language } from '@/store/useAppStore';
import { shopMenuLinks } from '@/lib/shopCatalog';

export type PageKey = 'home' | 'activities' | 'learning' | 'kfood' | 'rewards' | 'events' | 'about' | 'apply' | 'trip' | 'studyAbroad';
export type DetailCategory = 'activities' | 'learning' | 'kfood' | 'rewards' | 'events';

export type LocalText = Record<Language, string>;

export interface MenuLink {
  label: LocalText;
  href: string;
  description: LocalText;
  points?: number;
  external?: boolean;
  featured?: boolean;
  children?: MenuLink[];
}

export interface MegaSection {
  title: LocalText;
  links: MenuLink[];
}

export interface NavItem {
  label: LocalText;
  href: string;
  dropdown?: MegaSection[];
}

export interface DetailSection {
  title: LocalText;
  content: LocalText[];
}

export interface DetailItem {
  category: DetailCategory;
  slug: string;
  title: LocalText;
  eyebrow: LocalText;
  summary: LocalText;
  seo: string;
  points?: number;
  protectedAction?: boolean;
  bullets: LocalText[];
  sections?: DetailSection[];
}

export interface PageContent {
  badge: LocalText;
  title: LocalText;
  subtitle: LocalText;
  description: LocalText;
  primaryCta: LocalText;
  primaryHref: string;
  cards: {
    title: LocalText;
    description: LocalText;
    href: string;
    cta: LocalText;
  }[];
}

const hindiText: Record<string, string> = {
  'All': 'सभी',
  'Home': 'होम',
  'Activities': 'गतिविधियाँ',
  'Korean Learning': 'कोरियाई भाषा सीखना',
  'K-Food': 'के-फूड',
  'Rewards': 'पुरस्कार',
  'Events': 'इवेंट्स',
  'About': 'हमारे बारे में',
  'Manpower': 'मैनपावर',
  'Grand Reward': 'मुख्य पुरस्कार',
  'K-CUBE Store': 'के-क्यूब स्टोर',
  'Trip to Korea': 'कोरिया यात्रा',
  'Explore K-CUBE': 'के-क्यूब देखें',
  'Activity Pages': 'गतिविधि पेज',
  'Learning Pages': 'लर्निंग पेज',
  'K-Food Pages': 'के-फूड पेज',
  'Reward Pages': 'पुरस्कार पेज',
  'Event Pages': 'इवेंट पेज',
  'K-Pop Missions': 'के-पॉप मिशन',
  'K-Dance Covers': 'के-डांस कवर',
  'K-Drama & Culture Tasks': 'के-ड्रामा और संस्कृति कार्य',
  'Beginner Korean Learning': 'शुरुआती कोरियाई भाषा सीखना',
  'Korean Vocabulary Streaks': 'कोरियाई शब्दावली स्ट्रीक',
  'Korean Speaking Practice': 'कोरियाई बोलने का अभ्यास',
  'Korean Recipes': 'कोरियाई रेसिपी',
  'K-Food Missions': 'के-फूड मिशन',
  'K-CUBE Points System': 'के-क्यूब पॉइंट्स सिस्टम',
  'Korean Culture Workshops': 'कोरियाई संस्कृति वर्कशॉप',
  'Earn points': 'पॉइंट्स कमाएँ',
  'Open detail page': 'विस्तृत पेज खोलें',
  'Open lesson page': 'लेसन पेज खोलें',
  'Open food page': 'फूड पेज खोलें',
  'Open event page': 'इवेंट पेज खोलें',
  'Open recipes': 'रेसिपी खोलें',
  'Open workshops': 'वर्कशॉप खोलें',
  'See points system': 'पॉइंट्स सिस्टम देखें',
  'Start beginner Korean': 'शुरुआती कोरियाई शुरू करें',
  'Start earning': 'कमाना शुरू करें',
  'Sign up and get points': 'साइन अप करें और पॉइंट्स पाएँ',
  'Apply now': 'अभी आवेदन करें',
  'Contact K-CUBE': 'के-क्यूब से संपर्क करें',
  'Mission': 'मिशन',
  'Commerce bridge': 'कॉमर्स कनेक्शन',
  'CMS operations': 'CMS संचालन',
  'Event crew': 'इवेंट टीम',
  'Content team': 'कंटेंट टीम',
  'Operations': 'संचालन',
  'Qualification': 'योग्यता',
  'Monthly race': 'मासिक रेस',
  'Culture journey': 'संस्कृति यात्रा',
  'Redeem rewards': 'पुरस्कार रिडीम करें',
  'Shop on K-CUBE Shop': 'K-CUBE पर खरीदारी करें',
  'K-CUBE Shop': 'K-CUBE दुकान',
  'Grand reward page for highest point holders.': 'सबसे अधिक पॉइंट्स वाले उपयोगकर्ताओं के लिए मुख्य पुरस्कार पेज।',
  'Highest point holders ke liye grand reward page.': 'सबसे अधिक पॉइंट्स वाले उपयोगकर्ताओं के लिए मुख्य पुरस्कार पेज।',
  'K-Food bridge': 'के-फूड कनेक्शन',
  'Culture activities': 'संस्कृति गतिविधियाँ',
  'Korean learning': 'कोरियाई भाषा सीखना',
  'Korean culture activities that reward participation': 'भागीदारी पर पुरस्कार देने वाली कोरियाई संस्कृति गतिविधियाँ',
  'Korean learning paths with detailed lesson pages': 'विस्तृत लेसन पेजों के साथ कोरियाई भाषा सीखने के मार्ग',
  'Korean food content that connects to the K-CUBE shop': 'K-CUBE शॉप से जुड़ने वाला कोरियाई भोजन कंटेंट',
  'Korean events with RSVP pages and point rewards': 'RSVP पेज और पॉइंट पुरस्कारों वाले कोरियाई इवेंट्स',
  'Points system for signups, activities, learning, food, and events': 'साइनअप, गतिविधियों, सीखने, भोजन और इवेंट्स के लिए पॉइंट्स सिस्टम',
  'K-CUBE connects Korean culture, learning, rewards, and commerce': 'के-क्यूब कोरियाई संस्कृति, सीखने, पुरस्कार और कॉमर्स को जोड़ता है',
  'Trip to Korea for top K-CUBE point holders': 'शीर्ष के-क्यूब पॉइंट धारकों के लिए कोरिया यात्रा',
  'Earn points through Korean culture, learning, food, and events': 'कोरियाई संस्कृति, सीखने, भोजन और इवेंट्स से पॉइंट्स कमाएँ',
  'A points-first Korean ecosystem where every meaningful action moves users closer to rewards and the Korea trip.': 'यह पॉइंट-केंद्रित कोरियाई इकोसिस्टम है, जहाँ हर महत्वपूर्ण गतिविधि उपयोगकर्ताओं को पुरस्कारों और कोरिया यात्रा के करीब ले जाती है।',
  'K-CUBE.store is the engagement layer for activities, Korean language learning, K-Food discovery, events, points, and rewards.': 'K-CUBE.store गतिविधियों, कोरियाई भाषा सीखने, के-फूड खोज, इवेंट्स, पॉइंट्स और पुरस्कारों का एंगेजमेंट प्लेटफॉर्म है।',
  'Every activity page has its own detail page, SEO content, and login-gated point action.': 'हर गतिविधि पेज का अपना विस्तृत पेज, SEO कंटेंट और लॉगिन आधारित पॉइंट एक्शन है।',
  'Use activities for K-Pop fans, dancers, drama lovers, creators, and people exploring Korean culture in India.': 'ये गतिविधियाँ भारत में कोरियाई संस्कृति खोजने वाले के-पॉप प्रशंसकों, डांसर्स, ड्रामा प्रेमियों और क्रिएटर्स के लिए हैं।',
  'Beginner Korean, vocabulary streaks, and speaking practice are separate SEO-friendly pages.': 'शुरुआती कोरियाई, शब्दावली स्ट्रीक और बोलने का अभ्यास अलग-अलग SEO अनुकूल पेज हैं।',
  'Lessons are built for daily learning loops and point rewards after login.': 'लेसन रोज़ाना सीखने और लॉगिन के बाद पॉइंट पुरस्कारों के लिए बनाए गए हैं।',
  'Recipes and food missions attract users, then guide high-intent visitors toward ecommerce.': 'रेसिपी और फूड मिशन उपयोगकर्ताओं को आकर्षित करते हैं और खरीदारी में रुचि रखने वालों को ईकॉमर्स की ओर ले जाते हैं।',
  'K-CUBE handles discovery and points. The K-CUBE shop handles shopping and product purchase journeys.': 'के-क्यूब खोज और पॉइंट्स संभालता है। K-CUBE शॉप खरीदारी और उत्पाद खरीद यात्रा संभालता है।',
  'Users must be logged in to apply for points-based actions. Sign-out hides private wallet data.': 'पॉइंट आधारित एक्शन के लिए उपयोगकर्ता का लॉगिन होना आवश्यक है। साइन आउट करने पर निजी वॉलेट डेटा छिप जाता है।',
  'A backend point ledger should store every award, redemption, admin adjustment, and Korea trip qualification event.': 'बैकएंड पॉइंट लेजर में हर पुरस्कार, रिडेम्पशन, एडमिन बदलाव और कोरिया यात्रा योग्यता घटना दर्ज होनी चाहिए।',
  'Workshops and campaigns should have detailed SEO pages and login-gated RSVP actions.': 'वर्कशॉप और कैंपेन के लिए विस्तृत SEO पेज और लॉगिन आधारित RSVP एक्शन होने चाहिए।',
  'Events create repeat engagement moments across learning, food, dance, music, and culture.': 'इवेंट्स सीखने, भोजन, डांस, संगीत और संस्कृति में बार-बार जुड़ाव के अवसर बनाते हैं।',
  'About is a direct page, not a dropdown. It explains the full website concept for users, partners, and admins.': 'अबाउट एक सीधा पेज है, ड्रॉपडाउन नहीं। यह उपयोगकर्ताओं, पार्टनर्स और एडमिन के लिए पूरी वेबसाइट की अवधारणा समझाता है।',
  'K-CUBE.store drives engagement. The K-CUBE shop captures commerce. Points connect both and build the Korea trip race.': 'K-CUBE.store एंगेजमेंट बढ़ाता है। K-CUBE शॉप कॉमर्स संभालता है। पॉइंट्स दोनों को जोड़कर कोरिया यात्रा रेस बनाते हैं।',
  'Apply to support K-CUBE events, content, and operations': 'के-क्यूब इवेंट्स, कंटेंट और संचालन में सहायता के लिए आवेदन करें',
  'Recruit event crew, content creators, Korean language mentors, food contributors, and operations teams.': 'इवेंट टीम, कंटेंट क्रिएटर्स, कोरियाई भाषा मेंटर्स, फूड कंट्रीब्यूटर्स और ऑपरेशंस टीम की भर्ती करें।',
  'This page can later submit to backend CMS workflows for admin approval.': 'यह पेज बाद में एडमिन अनुमोदन के लिए बैकएंड CMS वर्कफ़्लो से जोड़ा जा सकता है।',
  'A dedicated reward page that makes the Korea trip visible, aspirational, and easy to understand.': 'यह समर्पित पुरस्कार पेज कोरिया यात्रा को स्पष्ट, आकर्षक और समझने में आसान बनाता है।',
  'Users qualify by earning verified points from activities, Korean learning, K-Food missions, events, referrals and admin-approved campaigns.': 'उपयोगकर्ता गतिविधियों, कोरियाई सीखने, के-फूड मिशन, इवेंट्स, रेफरल और एडमिन-अनुमोदित कैंपेन से सत्यापित पॉइंट्स कमाकर पात्र बनते हैं।',
  'Fan quizzes, artist discovery, voting campaigns, and music challenges that reward participation.': 'फैन क्विज़, आर्टिस्ट खोज, वोटिंग कैंपेन और संगीत चुनौतियाँ जो भागीदारी पर पुरस्कार देती हैं।',
  'Dance cover uploads, workshops, and challenges for Korean culture lovers.': 'कोरियाई संस्कृति प्रेमियों के लिए डांस कवर अपलोड, वर्कशॉप और चुनौतियाँ।',
  'Drama quizzes, beauty, fashion, lifestyle, and Korean culture tasks.': 'ड्रामा क्विज़, ब्यूटी, फैशन, लाइफस्टाइल और कोरियाई संस्कृति कार्य।',
  'Start with Hangul, greetings, numbers, and survival Korean phrases.': 'हंगुल, अभिवादन, संख्याओं और ज़रूरी कोरियाई वाक्यों से शुरुआत करें।',
  'Daily Korean word practice built for retention and rewards.': 'निरंतरता और पुरस्कारों के लिए बनाया गया दैनिक कोरियाई शब्द अभ्यास।',
  'Pronunciation, conversation prompts, and speaking challenges.': 'उच्चारण, बातचीत संकेत और बोलने की चुनौतियाँ।',
  'Recipe stories for bibimbap, tteokbokki, ramyeon, kimchi, sauces, and snacks.': 'बिबिम्बाप, ट्टेओकबोक्की, राम्योन, किमची, सॉस और स्नैक्स की रेसिपी कहानियाँ।',
  'Cook, review, share, and earn points through Korean food discovery.': 'कोरियाई भोजन खोजते हुए पकाएँ, समीक्षा करें, साझा करें और पॉइंट्स कमाएँ।',
  'Welcome bonus, activity points, learning streaks, food missions, events, referrals, and redemption.': 'वेलकम बोनस, गतिविधि पॉइंट्स, लर्निंग स्ट्रीक, फूड मिशन, इवेंट्स, रेफरल और रिडेम्पशन।',
  'Language, food, dance, K-Pop, K-Drama, and culture events with RSVP points.': 'भाषा, भोजन, डांस, के-पॉप, के-ड्रामा और संस्कृति इवेंट्स RSVP पॉइंट्स के साथ।',
  'Complete weekly K-Pop quizzes and collect points.': 'साप्ताहिक के-पॉप क्विज़ पूरा करें और पॉइंट्स जमा करें।',
  'Join fan voting and artist discovery campaigns.': 'फैन वोटिंग और आर्टिस्ट खोज कैंपेन में शामिल हों।',
  'SEO content can target Korean music fans in India.': 'SEO कंटेंट भारत में कोरियाई संगीत प्रशंसकों को लक्षित कर सकता है।',
  'Upload a cover and apply for challenge review.': 'कवर अपलोड करें और चुनौती समीक्षा के लिए आवेदन करें।',
  'Earn bonus points for approved submissions.': 'स्वीकृत सबमिशन पर बोनस पॉइंट्स कमाएँ।',
  'Great for social growth and creator campaigns.': 'सोशल ग्रोथ और क्रिएटर कैंपेन के लिए बेहतरीन।',
  'Take quizzes around Korean dramas and culture.': 'कोरियाई ड्रामा और संस्कृति पर क्विज़ लें।',
  'Join beauty, fashion, and lifestyle campaigns.': 'ब्यूटी, फैशन और लाइफस्टाइल कैंपेन में शामिल हों।',
  'Each verified task can add to the Korea trip score.': 'हर सत्यापित कार्य कोरिया यात्रा स्कोर में जुड़ सकता है।',
  'Learn Hangul reading and pronunciation basics.': 'हंगुल पढ़ना और उच्चारण की मूल बातें सीखें।',
  'Practice greetings, numbers, and daily phrases.': 'अभिवादन, संख्याएँ और दैनिक वाक्यांशों का अभ्यास करें।',
  'Finish lessons to earn learning points.': 'लर्निंग पॉइंट्स कमाने के लिए लेसन पूरा करें।',
  'Practice themed Korean word lists.': 'विषय आधारित कोरियाई शब्द सूचियों का अभ्यास करें।',
  'Build daily streaks for bonus points.': 'बोनस पॉइंट्स के लिए दैनिक स्ट्रीक बनाएँ।',
  'Useful for Korean food, travel, and culture vocabulary.': 'कोरियाई भोजन, यात्रा और संस्कृति शब्दावली के लिए उपयोगी।',
  'Practice short Korean conversation scripts.': 'छोटे कोरियाई बातचीत स्क्रिप्ट का अभ्यास करें।',
  'Submit speaking attempts for review workflows.': 'समीक्षा वर्कफ़्लो के लिए बोलने के प्रयास जमा करें।',
  'Speaking progress can unlock premium rewards.': 'बोलने की प्रगति प्रीमियम पुरस्कार खोल सकती है।',
  'Save recipes and discover ingredients.': 'रेसिपी सेव करें और सामग्री खोजें।',
  'Connect recipe intent to K-CUBE shop purchases.': 'रेसिपी रुचि को K-CUBE शॉप खरीदारी से जोड़ें।',
  'Food content can rank for Korean recipe search.': 'फूड कंटेंट कोरियाई रेसिपी खोज में रैंक कर सकता है।',
  'Share recipe attempts and product reviews.': 'रेसिपी प्रयास और उत्पाद समीक्षाएँ साझा करें।',
  'Reward users who move from content to commerce.': 'कंटेंट से कॉमर्स की ओर बढ़ने वाले उपयोगकर्ताओं को पुरस्कार दें।',
  'Track K-CUBE shop click intent for admin insights.': 'एडमिन इनसाइट्स के लिए K-CUBE शॉप क्लिक रुचि ट्रैक करें।',
  'Users earn only after verified actions.': 'उपयोगकर्ता केवल सत्यापित एक्शन के बाद ही पॉइंट्स कमाते हैं।',
  'Sign-out hides user wallet and private activity data.': 'साइन आउट करने पर उपयोगकर्ता वॉलेट और निजी गतिविधि डेटा छिप जाता है।',
  'Point history should be stored in backend ledger tables.': 'पॉइंट इतिहास बैकएंड लेजर टेबल में संग्रहित होना चाहिए।',
  'RSVP to events and earn verified participation points.': 'इवेंट्स के लिए RSVP करें और सत्यापित भागीदारी पॉइंट्स कमाएँ।',
  'Events create repeat engagement moments.': 'इवेंट्स दोबारा जुड़ने के अवसर बनाते हैं।',
  'Admin can publish event content from CMS.': 'एडमिन CMS से इवेंट कंटेंट प्रकाशित कर सकता है।',
  'K-Pop, K-Dance, culture and food missions.': 'के-पॉप, के-डांस, संस्कृति और फूड मिशन।',
  'K-Pop, K-Dance, drama, culture and food missions.': 'के-पॉप, के-डांस, ड्रामा, संस्कृति और फूड मिशन।',
  'Beginner lessons, vocabulary and speaking practice.': 'शुरुआती लेसन, शब्दावली और बोलने का अभ्यास।',
  'Recipes, food missions and K-CUBE shop commerce bridge.': 'रेसिपी, फूड मिशन और K-CUBE शॉप कॉमर्स कनेक्शन।',
  'Points wallet, redemption and Korea trip progress.': 'पॉइंट्स वॉलेट, रिडेम्पशन और कोरिया यात्रा प्रगति।',
  'Culture workshops and RSVP-based points.': 'संस्कृति वर्कशॉप और RSVP आधारित पॉइंट्स।',
  'Buy Korean food from the connected ecommerce store.': 'जुड़े हुए ईकॉमर्स स्टोर से कोरियाई भोजन खरीदें।',
  'SEO-friendly Korean lessons with points-based progress.': 'पॉइंट-आधारित प्रगति वाले SEO-अनुकूल कोरियाई लेसन।',
  'Recipes and food content guide users toward K-CUBE shop purchases.': 'रेसिपी और फूड कंटेंट उपयोगकर्ताओं को K-CUBE शॉप खरीदारी की ओर ले जाते हैं।',
  'Explore activities': 'गतिविधियाँ देखें',
  'Start learning': 'सीखना शुरू करें',
  'Discover K-Food': 'के-फूड देखें',
  'View activity pages': 'गतिविधि पेज देखें',
  'View trip page': 'यात्रा पेज देखें',
  'Open details': 'विवरण खोलें',
  'See redemption': 'रिडेम्पशन देखें',
  'See rules': 'नियम देखें',
  'See K-Food': 'के-फूड देखें',
  'Read mission': 'मिशन पढ़ें',
  'Admin panel': 'एडमिन पैनल',
  'Admin CMS': 'एडमिन CMS',
  'Explore': 'देखें',
  'Apply': 'आवेदन करें',
  'Details dekhein': 'विवरण देखें',
  'Activities dekhein': 'गतिविधियाँ देखें',
  'Learning start karein': 'सीखना शुरू करें',
  'K-Food dekhein': 'के-फूड देखें',
  'Activity pages dekhein': 'गतिविधि पेज देखें',
  'Detail page kholo': 'विस्तृत पेज खोलें',
  'Lesson page kholo': 'लेसन पेज खोलें',
  'Food page kholo': 'फूड पेज खोलें',
  'Event page kholo': 'इवेंट पेज खोलें',
  'Recipes kholo': 'रेसिपी खोलें',
  'Workshops kholo': 'वर्कशॉप खोलें',
  'Points system dekhein': 'पॉइंट्स सिस्टम देखें',
  'Rules dekhein': 'नियम देखें',
  'Trip page dekhein': 'यात्रा पेज देखें',
  'Redemption dekhein': 'रिडेम्पशन देखें',
  'Coupons, event access, K-Food offers, merch and premium benefits.': 'कूपन, इवेंट एक्सेस, के-फूड ऑफ़र, मर्च और प्रीमियम लाभ।',
  'Only verified points count toward trip eligibility.': 'यात्रा योग्यता में केवल सत्यापित पॉइंट्स गिने जाएँगे।',
  'Admins can review users, points, fraud flags and final winners.': 'एडमिन उपयोगकर्ता, पॉइंट्स, धोखाधड़ी संकेत और अंतिम विजेताओं की समीक्षा कर सकते हैं।',
  'The reward celebrates Korean culture, food, language and community.': 'यह पुरस्कार कोरियाई संस्कृति, भोजन, भाषा और समुदाय का उत्सव है।',
  'Support workshops, meetups and culture campaigns.': 'वर्कशॉप, मीटअप और संस्कृति कैंपेन में सहायता करें।',
  'Create Korean learning, K-Food and culture content.': 'कोरियाई सीखने, के-फूड और संस्कृति कंटेंट बनाएँ।',
  'Manage users, rewards, partners and fulfillment.': 'उपयोगकर्ताओं, पुरस्कारों, पार्टनर्स और फुलफिलमेंट को प्रबंधित करें।',
};

function txt(en: string, ko: string, hi: string): LocalText {
  return { en, ko, hi: hindiText[en] ?? hi };
}

export const allMenuQuickLinks: MenuLink[] = [
  {
    label: txt('K-CUBE Shop', 'K-CUBE दुकान', 'K-CUBE Shop'),
    href: '/shop',
    description: txt(
      'Browse the internal store and keep purchases on K-CUBE.',
      '내부 스토어에서 둘러보고 구매를 K-CUBE 안에서 완료하세요.',
      'Internal store browse karke purchase K-CUBE ke andar complete karein.',
    ),
  },
  {
    label: txt('Trip to Korea', '한국 여행', 'Trip to Korea'),
    href: '/trip-to-korea',
    description: txt(
      'Review the flagship reward and trip qualification flow.',
      '대표 리워드와 여행 자격 흐름을 확인하세요.',
      'Flagship reward aur trip qualification flow dekhein.',
    ),
  },
  {
    label: txt('India Pre-Selection', '인도 예선', 'India Pre-Selection'),
    href: '/india-pre-selection',
    description: txt(
      'Go straight to the festival submission hub.',
      '축제 제출 허브로 바로 이동하세요.',
      'Festival submission hub tak seedha jaayein.',
    ),
  },
  {
    label: txt('Apply for Manpower', '인력 지원', 'Apply for Manpower'),
    href: '/apply-for-manpower',
    description: txt(
      'Open the support application for events and operations.',
      '이벤트와 운영 지원 신청서를 여세요.',
      'Events aur operations support application kholen.',
    ),
  },
  {
    label: txt('About K-CUBE', 'K-CUBE 소개', 'About K-CUBE'),
    href: '/about',
    description: txt(
      'Read the platform overview for members and partners.',
      '회원과 파트너를 위한 플랫폼 개요를 확인하세요.',
      'Members aur partners ke liye platform overview padhein.',
    ),
  },
];

export const copy = {
  en: {
    search: 'Search activities, lessons, rewards, Korean food...',
    all: 'All',
    manpower: 'Apply for Manpower',
    contact: 'Contact',
    account: 'Account',
    hello: 'Hello',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    admin: 'Admin',
    language: 'Language',
    earnPoints: 'Earn points',
    loginRequired: 'Login required to apply and earn points',
    completed: 'Completed',
    pointsWallet: 'Points wallet',
    welcomeBonus: 'Sign up to unlock your 100 point welcome bonus.',
    koreaTrip: 'Trip to Korea',
    tripLine: 'Top point holders qualify for the flagship Korea trip reward.',
    applyNow: 'Apply now',
  },
  ko: {
    search: '활동, 수업, 리워드, 한국 음식을 검색하세요...',
    all: '전체',
    manpower: '인력 지원',
    contact: '문의',
    account: '계정',
    hello: '안녕하세요',
    signIn: '로그인',
    signUp: '회원가입',
    signOut: '로그아웃',
    admin: '관리자',
    language: '언어',
    earnPoints: '포인트 받기',
    loginRequired: '신청하고 포인트를 받으려면 로그인이 필요합니다',
    completed: '완료',
    pointsWallet: '포인트 지갑',
    welcomeBonus: '회원가입 후 100 포인트 웰컴 보너스를 받으세요.',
    koreaTrip: '한국 여행',
    tripLine: '상위 포인트 회원은 대표 한국 여행 리워드 대상이 됩니다.',
    applyNow: '신청하기',
  },
  hi: {
    search: 'गतिविधियाँ, लेसन, पुरस्कार और कोरियाई भोजन खोजें...',
    all: 'सभी',
    manpower: 'मैनपावर के लिए आवेदन करें',
    contact: 'संपर्क करें',
    account: 'खाता',
    hello: 'नमस्ते',
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    signOut: 'साइन आउट',
    admin: 'एडमिन',
    language: 'भाषा',
    earnPoints: 'पॉइंट्स कमाएँ',
    loginRequired: 'आवेदन करने और पॉइंट्स कमाने के लिए लॉगिन आवश्यक है',
    completed: 'पूरा हुआ',
    pointsWallet: 'पॉइंट्स वॉलेट',
    welcomeBonus: 'साइन अप करने पर 100 वेलकम पॉइंट्स पाएँ।',
    koreaTrip: 'कोरिया यात्रा',
    tripLine: 'सबसे अधिक पॉइंट्स वाले उपयोगकर्ता कोरिया यात्रा पुरस्कार के लिए पात्र होंगे।',
    applyNow: 'अभी आवेदन करें',
  },
} satisfies Record<Language, Record<string, string>>;

export const detailItems: DetailItem[] = [
  {
    category: 'activities',
    slug: 'k-pop-missions',
    title: txt('K-Pop Missions', 'K-Pop 미션', 'K-Pop Missions'),
    eyebrow: txt('Activities', '활동', 'Activities'),
    summary: txt('Simple K-Pop tasks, pre-selection, and singing video submissions that earn points.', '간단한 K-Pop 미션, 예선, 노래 영상 제출로 포인트를 적립합니다.', 'Simple K-Pop tasks, pre-selection aur singing video submissions se points milte hain.'),
    seo: 'K-Pop missions, Korean music activities, fan quiz, K-CUBE points rewards',
    points: 80,
    protectedAction: true,
    bullets: [
      txt('Join the K-CUBE India Pre-Selection from this mission.', '이 미션에서 K-CUBE India 예선에 참여하세요.', 'Is mission se K-CUBE India Pre-Selection join karein.'),
      txt('Submit your singing video daily or weekly for more points.', '매일 또는 주간으로 노래 영상을 제출하면 더 많은 포인트를 받을 수 있습니다.', 'Daily ya weekly singing video submit karke more points earn karein.'),
      txt('Simple tasks keep the page easy for first-time users.', '처음 보는 사람도 이해하기 쉬운 구성입니다.', 'Simple tasks page ko first-time users ke liye easy rakhte hain.'),
    ],
    sections: [
      {
        title: txt('K-CUBE India Pre-Selection', 'K-CUBE India Pre-Selection', 'K-CUBE India Pre-Selection'),
        content: [
          txt('India-level pre-selection for singers and musical artists heading toward Seoul.', '서울로 향하는 가수와 음악가를 위한 인도 예선입니다.', 'India-level pre-selection for singers and musical artists heading toward Seoul.'),
          txt('Use this step to apply for the India stage and stay in the K-CUBE music journey.', '이 단계에서 인도 무대 지원을 진행하고 K-CUBE 음악 여정을 이어가세요.', 'Use this step to apply for the India stage and stay in the K-CUBE music journey.'),
        ],
      },
      {
        title: txt('Submit Your Singing Video', 'Submit Your Singing Video', 'Submit Your Singing Video'),
        content: [
          txt('Submit a short singing video daily or weekly for more points.', '짧은 노래 영상을 매일 또는 주간으로 제출하면 더 많은 포인트를 받을 수 있습니다.', 'Daily ya weekly short singing video submit karke more points earn karein.'),
          txt('This keeps the mission active and gives creators a simple way to participate.', '이 미션은 크리에이터가 쉽게 참여할 수 있는 형태로 유지됩니다.', 'Ye mission creators ke liye simple participation way deta hai.'),
        ],
      },
    ],
  },
  {
    category: 'activities',
    slug: 'k-dance-covers',
    title: txt('K-Dance Covers', 'K-Dance 커버', 'K-Dance Covers'),
    eyebrow: txt('Activities', '활동', 'Activities'),
    summary: txt('Dance cover uploads, workshops, and challenges for Korean culture lovers.', '한국 문화를 좋아하는 사람들을 위한 댄스 커버 업로드, 워크숍, 챌린지.', 'Dance cover upload, workshops aur Korean dance challenges.'),
    seo: 'K-Dance cover challenge, Korean dance workshop, K-CUBE activities',
    points: 150,
    protectedAction: true,
    bullets: [
      txt('Upload a cover and apply for challenge review.', '커버 영상을 업로드하고 챌린지 심사를 신청하세요.', 'Cover upload karke challenge review ke liye apply karein.'),
      txt('Earn bonus points for approved submissions.', '승인된 제출물에 보너스 포인트가 지급됩니다.', 'Approved submissions par bonus points milenge.'),
      txt('Great for social growth and creator campaigns.', '소셜 성장과 크리에이터 캠페인에 적합합니다.', 'Social growth aur creator campaigns ke liye perfect.'),
    ],
    sections: [
      {
        title: txt('Dance cover journey', '댄스 커버 여정', 'Dance cover journey'),
        content: [
          txt('Record your K-Dance cover, upload it with a story, and connect to community workshops for feedback and visibility.', 'K-Dance 커버를 녹화하여 스토리와 함께 업로드하고 피드백과 가시성을 위해 커뮤니티 워크숍에 연결하세요.', 'K-Dance cover record karo, story ke saath upload karo aur community workshops se feedback lo.'),
          txt('This page is built for creators who want both cultural expression and tangible engagement rewards.', '이 페이지는 문화적 표현과 실질적인 참여 보상을 모두 원하는 크리에이터를 위해 만들어졌습니다.', 'Ye page creators ke liye hai jo cultural expression aur engagement rewards dono chahte hain.'),
        ],
      },
      {
        title: txt('Why K-Dance matters', '왜 K-댄스가 중요한가', 'Why K-Dance matters'),
        content: [
          txt('Korean dance has become a global cultural connector; your covers help bring the movement into India’s digital creator ecosystem.', '한국 댄스는 글로벌 문화 연결자가 되었으며, 당신의 커버는 이 움직임을 인도의 디지털 크리에이터 생태계로 가져옵니다.', 'Korean dance global cultural connector hai; aapke covers India creator ecosystem tak le jaate hain.'),
          txt('Approved submissions earn extra points, and high-performing covers can be highlighted in campaign showcases.', '승인된 제출물은 추가 포인트를 얻고, 성과가 좋은 커버는 캠페인 쇼케이스에 강조될 수 있습니다.', 'Approved submissions extra points paate hain aur top covers showcase mein aa sakte hain.'),
        ],
      },
    ],
  },
  {
    category: 'activities',
    slug: 'k-drama-culture',
    title: txt('K-Drama & Culture Tasks', 'K-드라마와 문화 미션', 'K-Drama & Culture Tasks'),
    eyebrow: txt('Activities', '활동', 'Activities'),
    summary: txt('Drama quizzes, beauty, fashion, lifestyle, and Korean culture tasks.', '드라마 퀴즈, 뷰티, 패션, 라이프스타일, 한국 문화 미션.', 'Drama quizzes, beauty, fashion aur Korean culture tasks.'),
    seo: 'Korean drama quiz, K-culture activities, K-beauty fashion missions',
    points: 90,
    protectedAction: true,
    bullets: [
      txt('Take quizzes around Korean dramas and culture.', '한국 드라마와 문화 퀴즈를 풀어보세요.', 'K-Drama aur culture quizzes solve karein.'),
      txt('Join beauty, fashion, and lifestyle campaigns.', '뷰티, 패션, 라이프스타일 캠페인에 참여하세요.', 'Beauty, fashion aur lifestyle campaigns join karein.'),
      txt('Each verified task can add to the Korea trip score.', '검증된 미션은 한국 여행 점수에 반영됩니다.', 'Verified task Korea trip score mein add hoga.'),
    ],
    sections: [
      {
        title: txt('Story-driven culture tasks', '스토리 중심 문화 미션', 'Story-driven culture tasks'),
        content: [
          txt('Explore questions, mini-challenges, and creative prompts drawn from K-Dramas, beauty trends, and lifestyle stories.', 'K-드라마, 뷰티 트렌드, 라이프스타일 스토리에서 영감을 받은 질문, 미니 챌린지, 창의적인 프롬프트를 탐험하세요.', 'Explore questions, mini-challenges aur creative prompts from K-Dramas, beauty, lifestyle.'),
          txt('Each task is built to help you learn Korean culture while earning verified engagement points.', '각 미션은 검증된 참여 포인트를 얻는 동안 한국 문화를 배우도록 설계되었습니다.', 'Each task helps you learn Korean culture and earn verified engagement points.'),
        ],
      },
      {
        title: txt('Impact on your Korea trip', '한국 여행에 미치는 영향', 'Impact on your Korea trip'),
        content: [
          txt('Completing culture tasks strengthens your profile as a diverse participant in the K-CUBE ecosystem.', '문화 미션을 완료하면 K-CUBE 생태계에서 다양한 참여자로서 프로필이 강화됩니다.', 'Culture tasks complete karke aapka profile K-CUBE mein strong hota hai.'),
          txt('Verified participation in arts, fashion, and drama can set you apart when administrators select finalists.', '예술, 패션, 드라마에서 검증된 참여는 관리자가 최종 후보를 선택할 때 차별화될 수 있습니다.', 'Verified arts, fashion, drama participation aapko finalists mein alag banata hai.'),
        ],
      },
    ],
  },
  {
    category: 'learning',
    slug: 'beginner-korean',
    title: txt('Beginner Korean Learning', '초급 한국어 학습', 'Beginner Korean Learning'),
    eyebrow: txt('Korean Learning', '한국어 학습', 'Korean Learning'),
    summary: txt('Start with Hangul, greetings, numbers, and survival Korean phrases.', '한글, 인사, 숫자, 기초 한국어 표현부터 시작하세요.', 'Hangul, greetings, numbers aur basic Korean phrases se start karein.'),
    seo: 'Beginner Korean learning, Hangul lessons, Korean language course India',
    points: 60,
    protectedAction: true,
    bullets: [
      txt('Learn Hangul reading and pronunciation basics.', '한글 읽기와 발음 기초를 배웁니다.', 'Hangul reading aur pronunciation basics sikhein.'),
      txt('Practice greetings, numbers, and daily phrases.', '인사, 숫자, 일상 표현을 연습합니다.', 'Greetings, numbers aur daily phrases practice karein.'),
      txt('Finish lessons to earn learning points.', '수업을 완료하면 학습 포인트를 받습니다.', 'Lessons finish karke learning points earn karein.'),
    ],
    sections: [
      {
        title: txt('Your first Korean steps', '처음 한국어 단계', 'Your first Korean steps'),
        content: [
          txt('Beginner Korean is focused on building confidence with Hangul, simple greetings, and everyday phrases used in Seoul and beyond.', '초급 한국어는 한글, 간단한 인사말, 서울과 그 너머에서 사용되는 일상 표현으로 자신감을 높이는 데 중점을 둡니다.', 'Beginner Korean focuses on Hangul, simple greetings, and daily phrases used in Seoul and beyond.'),
          txt('The lessons layer vocabulary, pronunciation, and contextual phrases so you can use them in real conversations.', '이 수업은 단어, 발음 및 상황별 표현을 구성하여 실제 대화에서 사용할 수 있도록 합니다.', 'Lessons layer vocabulary, pronunciation, and context so you can use them in real conversations.'),
        ],
      },
      {
        title: txt('Learning with points', '포인트와 함께 학습', 'Learning with points'),
        content: [
          txt('Complete the beginner path to earn learning points and show progress in the K-CUBE dashboard.', '초급 과정을 완료하면 학습 포인트를 얻고 K-CUBE 대시보드에서 진도를 확인할 수 있습니다.', 'Complete the beginner path to earn points and show progress in the K-CUBE dashboard.'),
          txt('As you practice daily phrases, your streaks and rewards become a direct reflection of your study habit.', '일상 표현을 연습할수록 연속 학습과 보상이 학습 습관을 직접 반영합니다.', 'Daily phrase practice makes your streaks and rewards a direct reflection of your habit.'),
        ],
      },
    ],
  },
  {
    category: 'learning',
    slug: 'vocabulary-streaks',
    title: txt('Korean Vocabulary Streaks', '한국어 단어 연속 학습', 'Korean Vocabulary Streaks'),
    eyebrow: txt('Korean Learning', '한국어 학습', 'Korean Learning'),
    summary: txt('Daily Korean word practice built for retention and rewards.', '유지율과 리워드를 위한 매일 한국어 단어 학습.', 'Daily Korean words practice with streak rewards.'),
    seo: 'Korean vocabulary practice, daily Korean words, language streak rewards',
    points: 45,
    protectedAction: true,
    bullets: [
      txt('Practice themed Korean word lists.', '주제별 한국어 단어를 연습합니다.', 'Themed Korean word lists practice karein.'),
      txt('Build daily streaks for bonus points.', '매일 연속 학습으로 보너스 포인트를 받습니다.', 'Daily streaks se bonus points milenge.'),
      txt('Useful for Korean food, travel, and culture vocabulary.', '음식, 여행, 문화 단어 학습에 유용합니다.', 'Food, travel aur culture vocabulary ke liye useful.'),
    ],
    sections: [
      {
        title: txt('Strengthen your vocabulary', '어휘력을 강화하세요', 'Strengthen your vocabulary'),
        content: [
          txt('Use daily word lists aimed at food, travel, culture, and common Korean expressions to build practical retention.', '음식, 여행, 문화 및 일반 한국어 표현을 대상으로 한 일일 단어 목록을 사용하여 실용적인 기억력을 높이세요.', 'Use daily word lists for food, travel, culture, and common Korean expressions.'),
          txt('The streak system rewards consistency and makes small, frequent practice feel motivating every day.', '연속 학습 시스템은 일관성을 보상하여 작고 자주 하는 연습이 매일 동기를 부여하도록 합니다.', 'The streak system rewards consistency and makes daily practice motivating.'),
        ],
      },
      {
        title: txt('From words to fluency', '단어에서 유창성으로', 'From words to fluency'),
        content: [
          txt('Each list is designed to help you recognize words in real Korean media, food menus, and travel conversations.', '각 목록은 실제 한국 미디어, 음식 메뉴 및 여행 대화에서 단어를 인식하는 데 도움이 되도록 설계되었습니다.', 'Each list helps you recognize words in Korean media, menus, and travel conversations.'),
          txt('Earn points with every completed streak, then use them to unlock deeper learning challenges and rewards.', '완료된 연속 학습마다 포인트를 얻고, 이를 사용하여 더 깊은 학습 챌린지와 보상을 잠금 해제하세요.', 'Earn points with each streak and unlock deeper learning challenges.'),
        ],
      },
    ],
  },
  {
    category: 'learning',
    slug: 'speaking-practice',
    title: txt('Korean Speaking Practice', '한국어 말하기 연습', 'Korean Speaking Practice'),
    eyebrow: txt('Korean Learning', '한국어 학습', 'Korean Learning'),
    summary: txt('Pronunciation, conversation prompts, and speaking challenges.', '발음, 회화 프롬프트, 말하기 챌린지.', 'Pronunciation aur conversation speaking challenges.'),
    seo: 'Korean speaking practice, Korean pronunciation, conversation lessons',
    points: 70,
    protectedAction: true,
    bullets: [
      txt('Practice short Korean conversation scripts.', '짧은 한국어 회화 스크립트를 연습합니다.', 'Short Korean conversation scripts practice karein.'),
      txt('Submit speaking attempts for review workflows.', '말하기 시도를 제출하여 리뷰를 받을 수 있습니다.', 'Speaking attempts review ke liye submit karein.'),
      txt('Speaking progress can unlock premium rewards.', '말하기 진도는 프리미엄 리워드를 열 수 있습니다.', 'Speaking progress premium rewards unlock karega.'),
    ],
    sections: [
      {
        title: txt('Speak Korean with confidence', '자신감을 가지고 한국어 말하기', 'Speak Korean with confidence'),
        content: [
          txt('Practice sample dialogues, pronunciation drills, and scenario prompts tailored to everyday conversations.', '일상 대화에 맞춘 샘플 대화, 발음 연습, 상황별 프롬프트를 연습하세요.', 'Practice sample dialogues, pronunciation drills, and scenario prompts.'),
          txt('This module helps you move from memorized phrases to natural, confident speaking in short exchanges.', '이 모듈은 암기된 문구에서 짧은 대화에서 자연스럽고 자신있는 말하기로 이동하도록 도와줍니다.', 'Move from memorized phrases to natural, confident speaking in short exchanges.'),
        ],
      },
      {
        title: txt('Review and reward', '리뷰와 보상', 'Review and reward'),
        content: [
          txt('Submit your speaking attempts for review, earn points for verified practice, and track progress in a growth-focused learning loop.', '말하기 시도를 리뷰에 제출하고 검증된 연습에 대해 포인트를 얻으며 성장 중심 학습 루프에서 진행 상황을 추적하세요.', 'Submit speaking attempts for review, earn points, and track progress.'),
          txt('Speaking practice is a high-value activity in K-CUBE, designed to build useful Korean confidence fast.', '말하기 연습은 K-CUBE에서 높은 가치 활동으로, 빠르게 유용한 한국어 자신감을 쌓도록 설계되었습니다.', 'Speaking practice is a high-value K-CUBE activity for fast confidence building.'),
        ],
      },
    ],
  },
  {
    category: 'learning',
    slug: 'class-content',
    title: txt('Korean Class Content', '한국 수업 콘텐츠', 'Korean Class Content'),
    eyebrow: txt('Korean Learning', '한국어 학습', 'Korean Learning'),
    summary: txt('Structured Korean class content for learners and point rewards.', '학습자와 포인트 보상을 위한 구조화된 한국어 수업 콘텐츠입니다.', 'Structured Korean class content with lesson rewards.'),
    seo: 'Korean class content, Korean lessons, language class page',
    points: 65,
    protectedAction: true,
    bullets: [
      txt('Access structured class content and lesson modules.', '구조화된 수업 콘텐츠와 레슨 모듈에 액세스하세요.', 'Access structured class content and lesson modules.'),
      txt('Practice curated vocabulary, grammar, and culture sections.', '선별된 어휘, 문법, 문화 섹션을 연습하세요.', 'Practice curated vocabulary, grammar, and culture sections.'),
      txt('Earn points for lesson completion and review sessions.', '수업 완료 및 리뷰 세션에 대해 포인트를 얻으세요.', 'Earn points for lesson completion and review sessions.'),
    ],
    sections: [
      {
        title: txt('Classroom learning experience', '클래스 학습 경험', 'Classroom learning experience'),
        content: [
          txt('Explore curated class content with lesson units, examples, and cultural notes.', '수업 단원, 예제 및 문화 노트를 포함한 선별된 수업 콘텐츠를 탐색하세요.', 'Explore curated class content with lesson units, examples, and cultural notes.'),
          txt('Each class is built to help learners improve Korean reading, listening, and speaking skills.', '각 수업은 학습자가 한국어 읽기, 듣기, 말하기 능력을 향상하도록 설계되었습니다.', 'Each class is built to help learners improve Korean reading, listening, and speaking skills.'),
        ],
      },
      {
        title: txt('Class content with points', '포인트가 있는 수업 콘텐츠', 'Class content with points'),
        content: [
          txt('Complete lessons and quizzes to earn verified learning points and track progress.', '수업과 퀴즈를 완료하여 검증된 학습 포인트를 획득하고 진도를 추적하세요.', 'Complete lessons and quizzes to earn verified learning points and track progress.'),
          txt('This page helps learners turn structured content into real progress and rewards.', '이 페이지는 학습자가 구조화된 콘텐츠를 실제 진전과 보상으로 전환하도록 돕습니다.', 'This page helps learners turn structured content into real progress and rewards.'),
        ],
      },
    ],
  },
  {
    category: 'kfood',
    slug: 'korean-recipes',
    title: txt('Korean Recipes', '한국 음식 레시피', 'Korean Recipes'),
    eyebrow: txt('K-Food', 'K-푸드', 'K-Food'),
    summary: txt('Recipe stories for bibimbap, tteokbokki, ramyeon, kimchi, sauces, and snacks.', '비빔밥, 떡볶이, 라면, 김치, 소스, 스낵 레시피 이야기.', 'Bibimbap, tteokbokki, ramyeon, kimchi aur snacks recipes.'),
    seo: 'Korean recipes India, K-Food recipes, buy Korean ingredients online',
    points: 40,
    protectedAction: true,
    bullets: [
      txt('Save recipes and discover ingredients.', '레시피를 저장하고 재료를 발견하세요.', 'Recipes save karke ingredients discover karein.'),
      txt('Connect recipe intent to K-CUBE shop purchases.', '레시피 관심을 K-CUBE shop 구매로 연결합니다.', 'Recipe intent ko K-CUBE shop purchase se connect karein.'),
      txt('Food content can rank for Korean recipe search.', '음식 콘텐츠는 한국 레시피 검색에 적합합니다.', 'Food content Korean recipe search ke liye SEO friendly.'),
    ],
    sections: [
      {
        title: txt('Cook Korean classics', '한국 클래식 요리하기', 'Cook Korean classics'),
        content: [
          txt('Follow step-by-step recipe stories for bibimbap, tteokbokki, ramyeon, kimchi, and more to bring Korean flavor into your kitchen.', '비빔밥, 떡볶이, 라면, 김치 등 한국의 맛을 주방으로 가져오는 단계별 레시피 이야기를 따라 하세요.', 'Follow recipe stories for bibimbap, tteokbokki, ramyeon, kimchi, and more.'),
          txt('Each recipe includes cultural background, ingredient notes, and easy adaptation tips for Indian kitchens.', '각 레시피에는 문화적 배경, 재료 노트 및 인도 주방에 맞춘 쉬운 적응 팁이 포함되어 있습니다.', 'Each recipe includes cultural background, ingredient notes, and adaptation tips for Indian kitchens.'),
        ],
      },
      {
        title: txt('From taste to purchase', '맛에서 구매까지', 'From taste to purchase'),
        content: [
          txt('Discover how recipe interest can connect to K-CUBE shop product journeys, making it easier to source ingredients and shop Korean food items.', '레시피 관심이 K-CUBE shop 제품 여정과 어떻게 연결되어 한국 식재료를 쉽게 구매할 수 있는지 알아보세요.', 'Discover how recipe interest connects to K-CUBE shop and shopping for Korean ingredients.'),
          txt('This page is designed to turn culinary curiosity into action, with food stories that support discovery and commerce.', '이 페이지는 발견과 상거래를 지원하는 음식 이야기를 통해 요리적 호기심을 행동으로 전환하도록 설계되었습니다.', 'This page turns culinary curiosity into action with food stories that support discovery and commerce.'),
        ],
      },
    ],
  },
  {
    category: 'kfood',
    slug: 'food-missions',
    title: txt('K-Food Missions', 'K-Food 미션', 'K-Food Missions'),
    eyebrow: txt('K-Food', 'K-푸드', 'K-Food'),
    summary: txt('Cook, review, share, and earn points through Korean food discovery.', '요리, 리뷰, 공유로 한국 음식 발견 포인트를 받으세요.', 'Cook, review, share aur Korean food discovery par points earn karein.'),
    seo: 'Korean food missions, K-Food rewards, Korean ingredients India',
    points: 55,
    protectedAction: true,
    bullets: [
      txt('Share recipe attempts and product reviews.', '레시피 시도와 상품 리뷰를 공유하세요.', 'Recipe attempts aur product reviews share karein.'),
      txt('Reward users who move from content to commerce.', '콘텐츠에서 커머스로 이동하는 사용자를 보상합니다.', 'Content se commerce journey par users ko reward karein.'),
      txt('Track K-CUBE shop click intent for admin insights.', 'K-CUBE shop 클릭 의도를 관리자 인사이트로 추적합니다.', 'K-CUBE shop click intent admin insights mein track hoga.'),
    ],
    sections: [
      {
        title: txt('Your food discovery mission', '음식 발견 미션', 'Your food discovery mission'),
        content: [
          txt('Explore Korean dishes, review recipes, and share your taste journey with the K-CUBE community.', '한국 요리를 탐험하고 레시피를 리뷰하며 K-CUBE 커뮤니티와 맛 여정을 공유하세요.', 'Explore Korean dishes, review recipes, and share your taste journey.'),
          txt('This mission connects content and commerce by encouraging cooking experiments and thoughtful feedback.', '이 미션은 요리 실험과 신중한 피드백을 권장하여 콘텐츠와 커머스를 연결합니다.', 'This mission connects content and commerce through cooking experiments and feedback.'),
        ],
      },
      {
        title: txt('Points and product intent', '포인트 및 상품 의도', 'Points and product intent'),
        content: [
          txt('When you engage with K-Food content, your interest is captured as intent that can help shape future promotions and partnerships.', 'K-Food 콘텐츠에 참여하면 관심이 의도로 포착되어 향후 프로모션 및 파트너십에 도움이 될 수 있습니다.', 'Your K-Food engagement is captured as intent for future promotions and partnerships.'),
          txt('Verified reviews and active participation earn rewards while also improving the K-Food discovery experience for other users.', '검증된 리뷰와 적극적인 참여는 보상을 받는 동시에 다른 사용자를 위한 K-Food 발견 경험을 향상시킵니다.', 'Verified reviews and participation earn rewards and enhance discovery for everyone.'),
        ],
      },
    ],
  },
  {
    category: 'rewards',
    slug: 'points-system',
    title: txt('K-CUBE Points System', 'K-CUBE 포인트 시스템', 'K-CUBE Points System'),
    eyebrow: txt('Rewards', '리워드', 'Rewards'),
    summary: txt('Welcome bonus, activity points, learning streaks, food missions, events, referrals, and redemption.', '웰컴 보너스, 활동 포인트, 학습 연속, 음식 미션, 이벤트, 추천, 교환.', 'Welcome bonus, activities, learning, food, events aur referrals ka points system.'),
    seo: 'K-CUBE points system, Korean culture rewards, loyalty points',
    bullets: [
      txt('Users earn only after verified actions.', '검증된 행동 후에만 포인트를 받습니다.', 'Verified actions ke baad hi points milte hain.'),
      txt('Sign-out hides user wallet and private activity data.', '로그아웃하면 지갑과 개인 활동 데이터가 숨겨집니다.', 'Sign out ke baad wallet aur private data hide hota hai.'),
      txt('Point history should be stored in backend ledger tables.', '포인트 기록은 백엔드 원장 테이블에 저장되어야 합니다.', 'Point history backend ledger tables mein maintain hogi.'),
    ],
    sections: [
      {
        title: txt('How K-CUBE points work', 'K-CUBE 포인트 작동 방식', 'How K-CUBE points work'),
        content: [
          txt('Points are awarded for verified activities across learning, culture, food, and events, with extra value for high-quality contributions.', '포인트는 학습, 문화, 음식, 이벤트 전반의 검증된 활동에 대해 부여되며, 고품질 기여에 대해 추가 가치를 제공합니다.', 'Points are awarded for verified activities in learning, culture, food, and events.'),
          txt('The system is built to reward consistency and make every meaningful action count toward the Korea trip.', '이 시스템은 일관성을 보상하고 의미 있는 모든 행동이 한국 여행을 향해 기여하도록 설계되었습니다.', 'The system rewards consistency and makes every meaningful action count toward the Korea trip.'),
        ],
      },
      {
        title: txt('Qualification and redemption', '자격 및 교환', 'Qualification and redemption'),
        content: [
          txt('Use points to monitor progress, unlock reward milestones, and understand which activities are most valuable for your journey.', '포인트를 사용하여 진행 상황을 모니터링하고 리워드 이정표를 잠금 해제하며 여정에서 가장 가치 있는 활동을 이해하세요.', 'Use points to monitor progress and unlock rewards milestones.'),
          txt('The K-CUBE wallet is a live reflection of your verified efforts; logging in reveals your private balance and reward status.', 'K-CUBE 지갑은 검증된 노력을 실시간으로 반영합니다. 로그인하면 개인 잔액과 보상 상태가 표시됩니다.', 'Your K-CUBE wallet reflects verified effort and reveals balance and reward status when logged in.'),
        ],
      },
    ],
  },
  {
    category: 'events',
    slug: 'culture-workshops',
    title: txt('Korean Culture Workshops', '한국 문화 워크숍', 'Korean Culture Workshops'),
    eyebrow: txt('Events', '이벤트', 'Events'),
    summary: txt('Language, food, dance, K-Pop, K-Drama, and culture events with RSVP points.', '언어, 음식, 댄스, K-Pop, K-드라마, 문화 이벤트와 RSVP 포인트.', 'Language, food, dance, K-Pop, K-Drama events with RSVP points.'),
    seo: 'Korean culture events India, Korean workshops, K-CUBE events',
    points: 100,
    protectedAction: true,
    bullets: [
      txt('RSVP to events and earn verified participation points.', '이벤트 RSVP 후 검증된 참여 포인트를 받습니다.', 'Events RSVP karke verified participation points earn karein.'),
      txt('Events create repeat engagement moments.', '이벤트는 반복 참여 순간을 만듭니다.', 'Events repeat engagement create karte hain.'),
      txt('Admin can publish event content from CMS.', '관리자는 CMS에서 이벤트 콘텐츠를 게시할 수 있습니다.', 'Admin CMS se event content publish kar sakta hai.'),
    ],
    sections: [
      {
        title: txt('Live culture events', '라이브 문화 이벤트', 'Live culture events'),
        content: [
          txt('Reserve your spot for workshops and meetups that spotlight language, dance, food, and K-Drama culture.', '언어, 춤, 음식, K-드라마 문화를 조명하는 워크숍과 밋업을 예약하세요.', 'Reserve your spot for workshops and meetups showcasing language, dance, food, and K-Drama.'),
          txt('Every RSVP is a verified action that builds momentum in the community and moves you closer to reward milestones.', '모든 RSVP는 커뮤니티에서 모멘텀을 쌓고 보상 이정표에 더 가까워지는 검증된 행동입니다.', 'Every RSVP is a verified action that builds momentum and brings you closer to rewards.'),
        ],
      },
      {
        title: txt('Community and discovery', '커뮤니티와 발견', 'Community and discovery'),
        content: [
          txt('Events create repeated engagement opportunities across culture, food, and entertainment, encouraging users to return and explore more.', '이벤트는 문화, 음식, 엔터테인먼트 전반에서 반복 참여 기회를 만들어 사용자가 더 많이 돌아오고 탐험하도록 합니다.', 'Events create repeated engagement across culture, food, and entertainment.'),
          txt('Admin-approved event content can also be published from the CMS, giving the best experiences more visibility.', '관리자 승인 이벤트 콘텐츠는 CMS에서 게시될 수 있어 최상의 경험이 더 많은 가시성을 얻을 수 있습니다.', 'Admin-approved event content can be published from the CMS to give top experiences more visibility.'),
        ],
      },
    ],
  },
  {
    category: 'events',
    slug: 'seoul-conference',
    title: txt('Seoul Culture Conference', '서울 문화 콘퍼런스', 'Seoul Culture Conference'),
    eyebrow: txt('Events', '이벤트', 'Events'),
    summary: txt('A hybrid conference exploring K-Drama, K-Pop, food, and Korean culture with RSVP rewards.', 'K-Drama, K-Pop, 음식 및 한국 문화를 탐구하는 RSVP 보상 하이브리드 콘퍼런스입니다.', 'A hybrid conference exploring K-Drama, K-Pop, food, and Korean culture with RSVP rewards.'),
    seo: 'Seoul conference event, Korean culture conference, RSVP points',
    points: 120,
    protectedAction: true,
    bullets: [
      txt('Attend a live Seoul conference with culture and performance sessions.', '문화와 공연 세션이 포함된 서울 라이브 콘퍼런스에 참여하세요.', 'Attend a live Seoul conference with culture and performance sessions.'),
      txt('Engage with K-CUBE sessions on K-Pop, K-Drama, food, and language.', 'K-Pop, K-Drama, 음식, 언어에 관한 K-CUBE 세션에 참여하세요.', 'Engage with K-CUBE sessions on K-Pop, K-Drama, food, and language.'),
      txt('Earn RSVP and participation points for verified event attendance.', '검증된 이벤트 참석에 대해 RSVP 및 참여 포인트를 받으세요.', 'Earn RSVP and participation points for verified event attendance.'),
    ],
    sections: [
      {
        title: txt('Meet Korean culture in Seoul', '서울에서 한국 문화를 만나요', 'Meet Korean culture in Seoul'),
        content: [
          txt('Reserve your place for a conference that celebrates Korean entertainment, fashion, and food culture.', '한국의 엔터테인먼트, 패션 및 음식 문화를 기념하는 콘퍼런스에 자리를 예약하세요.', 'Reserve your place for a conference that celebrates Korean entertainment, fashion, and food culture.'),
          txt('This event page highlights core sessions, speakers, and verified RSVP rewards for attendees.', '이 이벤트 페이지는 주요 세션, 연사 및 참석자를 위한 검증된 RSVP 보상을 강조합니다.', 'This event page highlights core sessions, speakers, and verified RSVP rewards for attendees.'),
        ],
      },
      {
        title: txt('Verified event participation', '검증된 이벤트 참여', 'Verified event participation'),
        content: [
          txt('Join live sessions and earn points for your verified participation in culture, language, and food workshops.', '라이브 세션에 참여하고 문화, 언어, 음식 워크숍에서 검증된 참여에 대해 포인트를 받으세요.', 'Join live sessions and earn points for verified participation in culture, language, and food workshops.'),
          txt('Seoul Conference content is built to showcase community engagement and measurable reward progress.', '서울 콘퍼런스 콘텐츠는 커뮤니티 참여와 측정 가능한 보상 진행을 보여주도록 설계되었습니다.', 'Seoul Conference content is built to showcase community engagement and measurable reward progress.'),
        ],
      },
    ],
  },
];

const detailHref = (category: DetailCategory, slug: string) => `/${category}/${slug}`;

const buildSectionPreviewLinks = (item: DetailItem): MenuLink[] =>
  item.sections?.slice(0, 3).map((section) => ({
    label: section.title,
    href: item.slug === 'k-pop-missions' ? '/india-pre-selection' : detailHref(item.category, item.slug),
    description: section.content[0] ?? item.summary,
    points: item.points,
  })) ?? [];

const buildCategoryPreviewLinks = (category: DetailCategory): MenuLink[] =>
  detailItems
    .filter((item) => item.category === category)
    .slice(0, 3)
    .map((item) => ({
      label: item.title,
      href: detailHref(item.category, item.slug),
      description: item.summary,
      points: item.points,
    }));

export interface AllMenuCategory {
  label: LocalText;
  href: string;
  description: LocalText;
  services: MenuLink[];
}

const buildShopServiceLinks = (): MenuLink[] => shopMenuLinks.slice(0, 5);

const itaewonSubmissionLink: MenuLink = {
  label: txt('Itaewon World Music Spirit 2026', 'Itaewon World Music Spirit 2026', 'Itaewon World Music Spirit 2026'),
  href: '/india-pre-selection',
  description: txt(
    'Official India pre-selection and festival submission hub for the ITAEWON World Music Spirit Festival 2026.',
    'ITAEWON World Music Spirit Festival 2026을 위한 공식 인도 예선 및 제출 허브입니다.',
    'ITAEWON World Music Spirit Festival 2026 ke liye official India pre-selection aur submission hub.',
  ),
  points: 200,
  featured: true,
  children: [
    {
      label: txt('Information', 'Information', 'Information'),
      href: '/india-pre-selection/information',
      description: txt(
        'Festival background, dates, and participation overview.',
        '축제 배경, 일정, 참여 개요입니다.',
        'Festival background, dates, aur participation overview.',
      ),
    },
    {
      label: txt('Announcement', 'Announcement', 'Announcement'),
      href: '/india-pre-selection/announcement',
      description: txt(
        'Official notices, updates, and important reminders.',
        '공식 공지, 업데이트, 중요한 안내입니다.',
        'Official notices, updates, aur important reminders.',
      ),
    },
    {
      label: txt('Apply', 'Apply', 'Apply'),
      href: '/india-pre-selection/apply',
      description: txt(
        'Open the application page and send your submission.',
        '신청 페이지를 열고 지원서를 제출하세요.',
        'Application page kholkar apna submission bhejein.',
      ),
    },
  ],
};

const buildEventsServiceLinks = (): MenuLink[] => [
  itaewonSubmissionLink,
  ...detailItems
    .filter((item) => item.category === 'events')
    .map((item) => ({
      label: item.title,
      href: detailHref(item.category, item.slug),
      description: item.summary,
      points: item.points,
      children: buildSectionPreviewLinks(item),
    })),
];

export const allMenuCategories: AllMenuCategory[] = [
  {
    label: txt('Events', '이벤트', 'Events'),
    href: '/events',
    description: txt('Culture workshops and RSVP-based points.', '문화 워크숍과 RSVP 포인트.', 'Culture workshops aur RSVP based points.'),
    services: buildEventsServiceLinks(),
  },
  {
    label: txt('Activities', '활동', 'Activities'),
    href: '/activities',
    description: txt('K-Pop, K-Dance, culture and food missions.', 'K-Pop, K-Dance, 문화와 음식 미션.', 'K-Pop, K-Dance, culture aur food missions.'),
    services: detailItems
      .filter((item) => item.category === 'activities')
      .map((item) => ({
        label: item.title,
        href: detailHref(item.category, item.slug),
        description: item.summary,
        points: item.points,
        featured: item.slug === 'k-pop-missions',
        children: buildSectionPreviewLinks(item),
      })),
  },
  {
    label: txt('Korean Learning', '한국어 학습', 'Korean Learning'),
    href: '/learning',
    description: txt('Beginner lessons, vocabulary and speaking practice.', '초급 수업, 단어, 말하기 연습.', 'Beginner lessons, vocabulary aur speaking practice.'),
    services: detailItems
      .filter((item) => item.category === 'learning')
      .map((item) => ({
        label: item.title,
        href: detailHref(item.category, item.slug),
        description: item.summary,
        points: item.points,
        children: buildSectionPreviewLinks(item),
      })),
  },
  {
    label: txt('K-Food', 'K-푸드', 'K-Food'),
    href: '/kfood',
    description: txt('Recipes, food missions and K-CUBE shop commerce bridge.', '레시피, 음식 미션, K-CUBE shop 연결.', 'Recipes, food missions aur K-CUBE shop bridge.'),
    services: detailItems
      .filter((item) => item.category === 'kfood')
      .map((item) => ({
        label: item.title,
        href: detailHref(item.category, item.slug),
        description: item.summary,
        points: item.points,
        children: buildSectionPreviewLinks(item),
      })),
  },
  {
    label: txt('Shop', '샵', 'Shop'),
    href: '/shop',
    description: txt('Buy Korean products directly on K-CUBE with account rewards.', 'K-CUBE에서 한국 상품을 직접 구매하고 계정 리워드를 받으세요.', 'K-CUBE par Korean products directly buy karo aur account rewards pao.'),
    services: buildShopServiceLinks(),
  },
];

export const navItems: NavItem[] = [
  {
    label: txt('All', '전체', 'All'),
    href: '/',
    dropdown: [
      {
        title: txt('Explore K-CUBE', 'K-CUBE 둘러보기', 'K-CUBE Explore'),
        links: allMenuCategories.map((category) => ({
          label: category.label,
          href: category.href,
          description: category.description,
          children: category.services.slice(0, 4),
        })),
      },
    ],
  },
  {
    label: txt('Events', '이벤트', 'Events'),
    href: '/events',
    dropdown: [
      {
        title: txt('Event Pages', '이벤트 페이지', 'Event Pages'),
        links: [
          itaewonSubmissionLink,
          ...detailItems
            .filter((item) => item.category === 'events')
            .map((item) => ({
              label: item.title,
              href: detailHref(item.category, item.slug),
              description: item.summary,
              points: item.points,
              children: buildSectionPreviewLinks(item),
            })),
        ],
      },
      {
        title: txt('Featured event', '추천 이벤트', 'Featured event'),
        links: [
          {
            label: txt('K-CUBE India Pre-Selection', 'K-CUBE India Pre-Selection', 'K-CUBE India Pre-Selection'),
            href: '/india-pre-selection',
            description: txt('Dedicated submission page for the K-CUBE India Pre-Selection and singing video applications.', 'K-CUBE India 예선 및 노래 영상 지원 전용 페이지입니다.', 'Dedicated submission page for the K-CUBE India Pre-Selection and singing video applications.'),
            featured: true,
          },
        ],
      },
    ],
  },
  {
    label: txt('Shop', '샵', 'Shop'),
    href: '/shop',
  },
  {
    label: txt('Activities', '활동', 'Activities'),
    href: '/activities',
    dropdown: [
      {
        title: txt('Activity Pages', '활동 페이지', 'Activity Pages'),
        links: detailItems.filter((item) => item.category === 'activities').map((item) => ({
          label: item.title,
          href: detailHref(item.category, item.slug),
          description: item.summary,
          points: item.points,
          featured: item.slug === 'k-pop-missions',
          children: buildSectionPreviewLinks(item),
        })),
      },
    ],
  },
  {
    label: txt('K-Food', 'K-푸드', 'K-Food'),
    href: '/kfood',
    dropdown: [
      {
        title: txt('K-Food Pages', 'K-Food 페이지', 'K-Food Pages'),
        links: [
          ...detailItems.filter((item) => item.category === 'kfood').map((item) => ({
            label: item.title,
            href: detailHref(item.category, item.slug),
            description: item.summary,
            points: item.points,
            children: buildSectionPreviewLinks(item),
          })),
          { label: txt('Shop on K-CUBE', 'K-CUBE 쇼핑', 'K-CUBE Shop'), href: '/shop', description: txt('Buy Korean food directly on K-CUBE with login-gated checkout and rewards.', 'K-CUBE에서 로그인 기반 결제와 리워드로 한국 식품을 직접 구매하세요.', 'K-CUBE par login-gated checkout aur rewards ke saath Korean food kharidein.'), children: shopMenuLinks.slice(0, 4) },
        ],
      },
    ],
  },
  {
    label: txt('Rewards', '리워드', 'Rewards'),
    href: '/rewards',
    dropdown: [
      {
        title: txt('Reward Pages', '리워드 페이지', 'Reward Pages'),
        links: [
          ...detailItems.filter((item) => item.category === 'rewards').map((item) => ({
            label: item.title,
            href: detailHref(item.category, item.slug),
            description: item.summary,
            children: buildSectionPreviewLinks(item),
          })),
          { label: txt('Trip to Korea', '한국 여행', 'Trip to Korea'), href: '/trip-to-korea', description: txt('Grand reward page for highest point holders.', '상위 포인트 회원을 위한 대표 리워드 페이지.', 'Highest point holders ke liye grand reward page.') },
        ],
      },
    ],
  },
  {
    label: txt('Korean Learning', '한국어 학습', 'Korean Learning'),
    href: '/learning',
    dropdown: [
      {
        title: txt('Learning Pages', '학습 페이지', 'Learning Pages'),
        links: detailItems.filter((item) => item.category === 'learning').map((item) => ({
          label: item.title,
          href: detailHref(item.category, item.slug),
          description: item.summary,
          points: item.points,
          children: buildSectionPreviewLinks(item),
        })),
      },
    ],
  },
  { label: txt('About', '소개', 'About'), href: '/about' },
];

export const pages: Record<PageKey, PageContent> = {
  home: {
    badge: txt('K-CUBE Store', 'K-CUBE 스토어', 'K-CUBE Store'),
    title: txt('Earn points through Korean culture, learning, food, and events', '한국 문화, 학습, 음식, 이벤트로 포인트를 모으세요', 'Korean culture, learning, food aur events se points earn karein'),
    subtitle: txt('A points-first Korean ecosystem where every meaningful action moves users closer to rewards and the Korea trip.', '모든 의미 있는 활동이 리워드와 한국 여행에 가까워지는 포인트 중심 생태계입니다.', 'Har meaningful action users ko rewards aur Korea trip ke closer le jaata hai.'),
    description: txt('K-CUBE.store is the engagement layer for activities, Korean language learning, K-Food discovery, events, points, and rewards.', 'K-CUBE.store는 활동, 한국어 학습, K-Food, 이벤트, 포인트, 리워드 참여 레이어입니다.', 'K-CUBE.store activities, Korean learning, K-Food, events, points aur rewards ka engagement layer hai.'),
    primaryCta: txt('Sign up and get points', '회원가입하고 포인트 받기', 'Sign up karke points lo'),
    primaryHref: '/signup',
    cards: [
      { title: txt('Culture activities', '문화 활동', 'Culture activities'), description: txt('K-Pop, K-Dance, drama, culture and food missions.', 'K-Pop, K-Dance, 드라마, 문화, 음식 미션.', 'K-Pop, K-Dance, drama, culture aur food missions.'), href: '/activities', cta: txt('Explore activities', '활동 보기', 'Activities dekhein') },
      { title: txt('Korean learning', '한국어 학습', 'Korean learning'), description: txt('SEO-friendly Korean lessons with points-based progress.', '포인트 기반 진도를 가진 SEO 친화 한국어 수업.', 'SEO-friendly Korean lessons with points progress.'), href: '/learning', cta: txt('Start learning', '학습 시작', 'Learning start karein') },
      { title: txt('K-Food bridge', 'K-Food 연결', 'K-Food bridge'), description: txt('Recipes and food content guide users toward K-CUBE shop purchases.', '레시피와 음식 콘텐츠가 K-CUBE 쇼핑 구매로 이어집니다.', 'Recipes users ko K-CUBE shop purchase tak guide karte hain.'), href: '/shop', cta: txt('Discover K-Food', 'K-Food 보기', 'K-Food dekhein') },
    ],
  },
  activities: {
    badge: txt('Activities', '활동', 'Activities'),
    title: txt('Korean culture activities that reward participation', '참여를 보상하는 한국 문화 활동', 'Korean culture activities jahan participation par rewards milte hain'),
    subtitle: txt('Every activity page has its own detail page, SEO content, and login-gated point action.', '모든 활동 페이지에는 상세 페이지, SEO 콘텐츠, 로그인 기반 포인트 액션이 있습니다.', 'Har activity ka detail page, SEO content aur login-gated point action hai.'),
    description: txt('Use activities for K-Pop fans, dancers, drama lovers, creators, and people exploring Korean culture in India.', '인도에서 한국 문화를 탐색하는 팬, 댄서, 드라마 애호가, 크리에이터를 위한 활동입니다.', 'India mein Korean culture explore karne wale fans aur creators ke liye activities.'),
    primaryCta: txt('View activity pages', '활동 페이지 보기', 'Activity pages dekhein'),
    primaryHref: '/activities/k-pop-missions',
    cards: detailItems.filter((item) => item.category === 'activities').map((item) => ({
      title: item.title,
      description: item.summary,
      href: detailHref(item.category, item.slug),
      cta: txt('Open detail page', '상세 페이지 열기', 'Detail page kholo'),
    })),
  },
  learning: {
    badge: txt('Korean Learning', '한국어 학습', 'Korean Learning'),
    title: txt('Korean learning paths with detailed lesson pages', '상세 수업 페이지가 있는 한국어 학습 경로', 'Detailed lesson pages ke saath Korean learning paths'),
    subtitle: txt('Beginner Korean, vocabulary streaks, and speaking practice are separate SEO-friendly pages.', '초급 한국어, 단어 연속 학습, 말하기 연습은 각각 SEO 친화 페이지입니다.', 'Beginner Korean, vocabulary streaks aur speaking practice separate SEO pages hain.'),
    description: txt('Lessons are built for daily learning loops and point rewards after login.', '수업은 매일 학습 루프와 로그인 후 포인트 보상을 위해 설계되었습니다.', 'Lessons daily learning loops aur login ke baad point rewards ke liye built hain.'),
    primaryCta: txt('Start beginner Korean', '초급 한국어 시작', 'Beginner Korean start karein'),
    primaryHref: '/learning/beginner-korean',
    cards: detailItems.filter((item) => item.category === 'learning').map((item) => ({
      title: item.title,
      description: item.summary,
      href: detailHref(item.category, item.slug),
      cta: txt('Open lesson page', '수업 페이지 열기', 'Lesson page kholo'),
    })),
  },
  kfood: {
    badge: txt('K-Food', 'K-푸드', 'K-Food'),
    title: txt('Korean food content that connects to the K-CUBE shop', 'K-CUBE 샵과 연결되는 한국 음식 콘텐츠', 'K-CUBE shop se connected Korean food content'),
    subtitle: txt('Recipes and food missions attract users, then guide high-intent visitors toward ecommerce.', '레시피와 음식 미션이 사용자를 끌어오고 구매 의도가 높은 방문자를 커머스로 안내합니다.', 'Recipes aur food missions users ko attract karke ecommerce tak guide karte hain.'),
    description: txt('K-CUBE now handles discovery, shopping, login-gated checkout, and product purchase rewards in one place.', 'K-CUBE가 이제 탐색, 쇼핑, 로그인 기반 결제, 상품 구매 리워드를 한 곳에서 처리합니다.', 'K-CUBE ab discovery, shopping, login-gated checkout aur product purchase rewards ek hi jagah handle karega.'),
    primaryCta: txt('Open shop', '샵 열기', 'Shop kholo'),
    primaryHref: '/shop',
    cards: detailItems.filter((item) => item.category === 'kfood').map((item) => ({
      title: item.title,
      description: item.summary,
      href: detailHref(item.category, item.slug),
      cta: txt('Open food page', '음식 페이지 열기', 'Food page kholo'),
    })),
  },
  rewards: {
    badge: txt('Rewards', '리워드', 'Rewards'),
    title: txt('Points system for signups, activities, learning, food, and events', '가입, 활동, 학습, 음식, 이벤트를 위한 포인트 시스템', 'Signups, activities, learning, food aur events ke liye points system'),
    subtitle: txt('Users must be logged in to apply for points-based actions. Sign-out hides private wallet data.', '포인트 기반 액션 신청은 로그인이 필요하며 로그아웃 시 개인 지갑 데이터가 숨겨집니다.', 'Points actions ke liye login zaruri hai. Sign out ke baad private wallet hide hota hai.'),
    description: txt('A backend point ledger should store every award, redemption, admin adjustment, and Korea trip qualification event.', '백엔드 포인트 원장은 모든 지급, 교환, 관리자 조정, 한국 여행 자격 이벤트를 저장해야 합니다.', 'Backend point ledger every award, redemption, admin adjustment aur Korea trip qualification store karega.'),
    primaryCta: txt('See points system', '포인트 시스템 보기', 'Points system dekhein'),
    primaryHref: '/rewards/points-system',
    cards: [
      { title: txt('Earn points', '포인트 적립', 'Points earn'), description: txt('Welcome bonus, activity tasks, lessons, K-Food missions, RSVPs and referrals.', '웰컴 보너스, 활동, 수업, K-Food 미션, RSVP, 추천.', 'Welcome bonus, tasks, lessons, K-Food, RSVP aur referrals.'), href: '/rewards/points-system', cta: txt('Open details', '상세 보기', 'Details dekhein') },
      { title: txt('Trip to Korea', '한국 여행', 'Trip to Korea'), description: txt('A dedicated page for the grand reward and qualification rules.', '대표 리워드와 자격 규칙을 위한 전용 페이지.', 'Grand reward aur qualification rules ka dedicated page.'), href: '/trip-to-korea', cta: txt('View trip page', '여행 페이지 보기', 'Trip page dekhein') },
      { title: txt('Redeem rewards', '리워드 교환', 'Rewards redeem'), description: txt('Coupons, event access, K-Food offers, merch and premium benefits.', '쿠폰, 이벤트 입장, K-Food 혜택, 굿즈, 프리미엄 혜택.', 'Coupons, event access, K-Food offers, merch aur benefits.'), href: '/rewards/points-system', cta: txt('See redemption', '교환 보기', 'Redemption dekhein') },
    ],
  },
  events: {
    badge: txt('Events', '이벤트', 'Events'),
    title: txt('Korean events with RSVP pages and point rewards', 'RSVP 페이지와 포인트 리워드가 있는 한국 이벤트', 'RSVP pages aur point rewards ke saath Korean events'),
    subtitle: txt('Workshops and campaigns should have detailed SEO pages and login-gated RSVP actions.', '워크숍과 캠페인에는 상세 SEO 페이지와 로그인 기반 RSVP 액션이 필요합니다.', 'Workshops aur campaigns ke detailed SEO pages aur login-gated RSVP actions.'),
    description: txt('Events create repeat engagement moments across learning, food, dance, music, and culture.', '이벤트는 학습, 음식, 댄스, 음악, 문화 전반에서 반복 참여를 만듭니다.', 'Events learning, food, dance, music aur culture mein repeat engagement create karte hain.'),
    primaryCta: txt('Open workshops', '워크숍 열기', 'Workshops kholo'),
    primaryHref: '/events/culture-workshops',
    cards: [
      {
        title: itaewonSubmissionLink.label,
        description: itaewonSubmissionLink.description,
        href: itaewonSubmissionLink.href,
        cta: txt('Open dedicated page', '전용 페이지 열기', 'Dedicated page kholo'),
      },
      {
        title: txt('K-CUBE India Pre-Selection', 'K-CUBE India Pre-Selection', 'K-CUBE India Pre-Selection'),
        description: txt('Dedicated submission page for the ITAEWON World Music Spirit Festival 2026 with exact timeline and application details.', 'ITAEWON World Music Spirit Festival 2026을 위한 전용 신청 페이지입니다.', 'ITAEWON World Music Spirit Festival 2026 ke liye dedicated submission page.'),
        href: '/india-pre-selection',
        cta: txt('Open dedicated page', '전용 페이지 열기', 'Dedicated page kholo'),
      },
      ...detailItems.filter((item) => item.category === 'events').map((item) => ({
        title: item.title,
        description: item.summary,
        href: detailHref(item.category, item.slug),
        cta: txt('Open event page', '이벤트 페이지 열기', 'Event page kholo'),
      })),
    ],
  },
  about: {
    badge: txt('About K-CUBE', 'K-CUBE 소개', 'About K-CUBE'),
    title: txt('K-CUBE connects Korean culture, learning, rewards, and commerce', 'K-CUBE는 한국 문화, 학습, 리워드, 커머스를 연결합니다', 'K-CUBE Korean culture, learning, rewards aur commerce connect karta hai'),
    subtitle: txt('About is a direct page, not a dropdown. It explains the full website concept for users, partners, and admins.', '소개는 드롭다운이 아닌 직접 페이지이며 사용자, 파트너, 관리자를 위한 전체 개념을 설명합니다.', 'About direct page hai, dropdown nahi. Ye full website concept explain karta hai.'),
    description: txt('K-CUBE.store now combines engagement and commerce so points, products, and checkout all stay in one ecosystem.', 'K-CUBE.store는 이제 참여와 커머스를 결합해 포인트, 상품, 결제가 모두 하나의 생태계 안에 머물도록 합니다.', 'K-CUBE.store ab engagement aur commerce ko ek saath laata hai taaki points, products aur checkout sab ek hi ecosystem me rahein.'),
    primaryCta: txt('Contact K-CUBE', 'K-CUBE 문의', 'K-CUBE contact'),
    primaryHref: '#contact',
    cards: [
      { title: txt('Mission', '미션', 'Mission'), description: txt('Make Korean culture discoverable, participatory, and rewarding.', '한국 문화를 발견 가능하고 참여적이며 보상 있게 만듭니다.', 'Korean culture ko discoverable, participatory aur rewarding banana.'), href: '#mission', cta: txt('Read mission', '미션 보기', 'Mission padhein') },
      { title: txt('Commerce bridge', '커머스 연결', 'Commerce bridge'), description: txt('Attach food content to K-CUBE shop buying journeys.', '음식 콘텐츠를 K-CUBE 샵 구매 여정에 연결합니다.', 'Food content ko K-CUBE shop buying journeys se attach karna.'), href: '/shop', cta: txt('See K-Food', 'K-Food 보기', 'K-Food dekhein') },
      { title: txt('CMS operations', 'CMS 운영', 'CMS operations'), description: txt('Admins manage content, users, points, events, lessons and rewards.', '관리자는 콘텐츠, 사용자, 포인트, 이벤트, 수업, 리워드를 관리합니다.', 'Admins content, users, points, events, lessons aur rewards manage karte hain.'), href: '/admin', cta: txt('Admin panel', '관리자 패널', 'Admin panel') },
    ],
  },
  apply: {
    badge: txt('Manpower', '인력', 'Manpower'),
    title: txt('Apply to support K-CUBE events, content, and operations', 'K-CUBE 이벤트, 콘텐츠, 운영 지원에 신청하세요', 'K-CUBE events, content aur operations support ke liye apply karein'),
    subtitle: txt('Recruit event crew, content creators, Korean language mentors, food contributors, and operations teams.', '이벤트 크루, 콘텐츠 크리에이터, 한국어 멘토, 음식 기여자, 운영팀을 모집합니다.', 'Event crew, creators, Korean mentors, food contributors aur operations teams.'),
    description: txt('This page can later submit to backend CMS workflows for admin approval.', '이 페이지는 나중에 관리자 승인용 백엔드 CMS 워크플로우에 제출할 수 있습니다.', 'Ye page baad mein admin approval CMS workflow se connect hoga.'),
    primaryCta: txt('Apply now', '지금 신청', 'Apply now'),
    primaryHref: '#application',
    cards: [
      { title: txt('Event crew', '이벤트 크루', 'Event crew'), description: txt('Support workshops, meetups and culture campaigns.', '워크숍, 모임, 문화 캠페인을 지원합니다.', 'Workshops, meetups aur culture campaigns support karein.'), href: '#application', cta: txt('Apply', '신청', 'Apply') },
      { title: txt('Content team', '콘텐츠 팀', 'Content team'), description: txt('Create Korean learning, K-Food and culture content.', '한국어 학습, K-Food, 문화 콘텐츠를 만듭니다.', 'Korean learning, K-Food aur culture content create karein.'), href: '#application', cta: txt('Apply', '신청', 'Apply') },
      { title: txt('Operations', '운영', 'Operations'), description: txt('Manage users, rewards, partners and fulfillment.', '사용자, 리워드, 파트너, 이행을 관리합니다.', 'Users, rewards, partners aur fulfillment manage karein.'), href: '#application', cta: txt('Apply', '신청', 'Apply') },
    ],
  },
  trip: {
    badge: txt('Grand Reward', '대표 리워드', 'Grand Reward'),
    title: txt('Trip to Korea for top K-CUBE point holders', '상위 K-CUBE 포인트 회원을 위한 한국 여행', 'Top K-CUBE point holders ke liye Trip to Korea'),
    subtitle: txt('A dedicated reward page that makes the Korea trip visible, aspirational, and easy to understand.', '한국 여행을 눈에 띄고 매력적이며 이해하기 쉽게 만드는 전용 리워드 페이지입니다.', 'Korea trip ko visible, aspirational aur easy-to-understand banane wala reward page.'),
    description: txt('Users qualify by earning verified points from activities, Korean learning, K-Food missions, events, referrals and admin-approved campaigns.', '사용자는 활동, 한국어 학습, K-Food 미션, 이벤트, 추천, 관리자 승인 캠페인으로 검증 포인트를 모아 자격을 얻습니다.', 'Users verified points activities, learning, K-Food, events, referrals aur admin campaigns se qualify karte hain.'),
    primaryCta: txt('Start earning', '포인트 모으기', 'Earning start karein'),
    primaryHref: '/signup',
    cards: [
      { title: txt('Qualification', '자격', 'Qualification'), description: txt('Only verified points count toward trip eligibility.', '검증된 포인트만 여행 자격에 반영됩니다.', 'Sirf verified points trip eligibility mein count honge.'), href: '/rewards/points-system', cta: txt('See rules', '규칙 보기', 'Rules dekhein') },
      { title: txt('Monthly race', '월간 레이스', 'Monthly race'), description: txt('Admins can review users, points, fraud flags and final winners.', '관리자는 사용자, 포인트, 부정 플래그, 최종 우승자를 검토합니다.', 'Admins users, points, fraud flags aur winners review karte hain.'), href: '/admin', cta: txt('Admin CMS', '관리자 CMS', 'Admin CMS') },
      { title: txt('Culture journey', '문화 여정', 'Culture journey'), description: txt('The reward celebrates Korean culture, food, language and community.', '이 리워드는 한국 문화, 음식, 언어, 커뮤니티를 기념합니다.', 'Reward Korean culture, food, language aur community celebrate karta hai.'), href: '/activities', cta: txt('Explore', '둘러보기', 'Explore') },
    ],
  },
  studyAbroad: {
    badge: txt('Study Abroad', '유학', 'Study Abroad'),
    title: txt('Study abroad guidance for Korean language, education, and cultural preparation', '한국어, 교육, 문화 준비를 위한 유학 안내', 'Korean language, education aur cultural prep ke liye study abroad guidance'),
    subtitle: txt('A highlighted admin-facing landing page for program inquiries, visa guidance, intake tracking, and partner college workflows.', '프로그램 문의, 비자 안내, 모집 추적, 파트너 대학 워크플로우를 위한 강조된 랜딩 페이지입니다.', 'Program inquiries, visa guidance, intake tracking aur partner college workflows ke liye highlighted landing page.'),
    description: txt('Use this page to surface study abroad opportunities, partner institutions, admissions guidance, document checklists, and support workflows.', '이 페이지에서 유학 기회, 파트너 기관, 입학 안내, 서류 체크리스트, 지원 워크플로우를 보여줄 수 있습니다.', 'Is page par study abroad opportunities, partner institutions, admissions guidance aur support workflows dikhaye ja sakte hain.'),
    primaryCta: txt('Open inquiry form', '문의 양식 열기', 'Inquiry form kholo'),
    primaryHref: '/contact',
    cards: [
      { title: txt('Partner colleges', '파트너 대학', 'Partner colleges'), description: txt('Track institutions, programs, and intake cycles.', '기관, 프로그램, 모집 주기를 추적합니다.', 'Institutions, programs aur intake cycles track karein.'), href: '/about#contact', cta: txt('See partners', '파트너 보기', 'Partners dekhein') },
      { title: txt('Visa support', '비자 지원', 'Visa support'), description: txt('Document checklists, deadlines, and support notes.', '서류 체크리스트, 마감일, 지원 메모.', 'Document checklists, deadlines aur support notes.'), href: '/about#contact', cta: txt('View support', '지원 보기', 'Support dekhein') },
      { title: txt('Intake tracking', '모집 추적', 'Intake tracking'), description: txt('Keep inquiries, applicants, and follow-ups organized.', '문의, 지원자, 후속 조치를 정리합니다.', 'Inquiries, applicants aur follow-ups organize karein.'), href: '/admin', cta: txt('Open admin', '관리자 열기', 'Admin kholo') },
    ],
  },
};

export const findDetail = (category: string, slug: string) =>
  detailItems.find((item) => item.category === category && item.slug === slug);

export const actions = detailItems
  .filter((item) => item.protectedAction && item.points)
  .map((item) => ({
    id: `${item.category}-${item.slug}`,
    title: item.title,
    description: item.summary,
    points: item.points ?? 0,
    category: item.eyebrow,
  }));
