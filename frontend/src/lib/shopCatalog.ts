import type { LocalText, MenuLink } from '@/lib/kcubeContent';
import type { Language } from '@/store/useAppStore';

export interface ShopProduct {
  id: string;
  slug: string;
  sku: string;
  title: LocalText;
  subtitle: LocalText;
  description: LocalText;
  category: LocalText;
  categoryKey: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  rewardPoints: number;
  inStock: boolean;
  stockLabel: LocalText;
  badges: LocalText[];
  includes: LocalText[];
  store?: ShopStore;
  externalProductUrl?: string;
}

export type ShopStore = 'koreanshop' | 'moa_beauty';

export const shopStores: Record<ShopStore, { name: string; url: string; label: string; description: string }> = {
  koreanshop: {
    name: 'Koreanshop',
    url: 'https://koreanshop.in/',
    label: 'Korean food & lifestyle',
    description: 'Korean food, pantry essentials, snacks and everyday lifestyle products.',
  },
  moa_beauty: {
    name: 'MOA Beauty',
    url: 'https://www.moabeauty.in/',
    label: 'K-Beauty',
    description: 'Korean skincare, cosmetics and beauty essentials.',
  },
};

export const getStoreMeta = (store: ShopStore = 'koreanshop') => shopStores[store];

export interface ShopCategoryOption {
  key: string;
  label: LocalText;
  description: LocalText;
}

const txt = (en: string, ko: string, hi: string): LocalText => ({ en, ko, hi });

const stock = {
  inStock: txt('In stock', '재고 있음', 'In stock'),
  lowStock: txt('Low stock', '재고 적음', 'Low stock'),
  outOfStock: txt('Out of stock', '품절', 'Out of stock'),
  fastMoving: txt('Fast moving', '빠르게 판매 중', 'Fast moving'),
};

export const shopCategories: ShopCategoryOption[] = [
  {
    key: 'all',
    label: txt('All products', '전체 상품', 'All products'),
    description: txt(
      'Everything in the K-CUBE internal shop sorted for discovery.',
      'K-CUBE 내부 쇼핑몰의 전체 상품입니다.',
      'K-CUBE internal shop ke sabhi products.',
    ),
  },
  {
    key: 'noodles',
    label: txt('Noodles', '면류', 'Noodles'),
    description: txt(
      'Ramen, cup noodles and pantry-ready Korean comfort food.',
      '라면, 컵면, 간편식 면류 모음입니다.',
      'Ramen, cup noodles aur quick noodles.',
    ),
  },
  {
    key: 'snacks',
    label: txt('Snacks', '스낵', 'Snacks'),
    description: txt(
      'Street-food bites, chips and sweet Korean treats.',
      '길거리 간식과 과자, 달콤한 트릿입니다.',
      'Street snacks, chips aur sweet treats.',
    ),
  },
  {
    key: 'tea-coffee',
    label: txt('Tea & Coffee', '차와 커피', 'Tea & Coffee'),
    description: txt(
      'Daily sips, cafe staples and gift-ready drink boxes.',
      '매일 즐기는 차와 커피 상품입니다.',
      'Tea, coffee aur drink bundles.',
    ),
  },
  {
    key: 'seaweed',
    label: txt('Seaweed', '김/해조류', 'Seaweed'),
    description: txt(
      'Roasted gim, soup seaweed and snackable packs.',
      '구운 김과 미역, 간식용 해조류입니다.',
      'Roasted gim, miyeok aur seaweed packs.',
    ),
  },
  {
    key: 'health',
    label: txt('Health & Supplements', '건강식품', 'Health & Supplements'),
    description: txt(
      'Korean red ginseng and wellness-focused premium items.',
      '홍삼과 프리미엄 건강식품입니다.',
      'Ginseng aur wellness products.',
    ),
  },
  {
    key: 'sauces',
    label: txt('Sauces & Pantry', '소스/팬트리', 'Sauces & Pantry'),
    description: txt(
      'Marinades, cooking sauces and meal-building pantry picks.',
      '양념과 소스, 팬트리 상품입니다.',
      'Sauces, marinades aur pantry staples.',
    ),
  },
];

const byKey = Object.fromEntries(shopCategories.map((category) => [category.key, category]));

const product = (
  id: string,
  sku: string,
  title: LocalText,
  subtitle: LocalText,
  description: LocalText,
  categoryKey: string,
  image: string,
  price: number,
  compareAtPrice: number | undefined,
  rewardPoints: number,
  inStock: boolean,
  stockLabel: LocalText,
  badges: LocalText[],
  includes: LocalText[],
): ShopProduct => ({
  id,
  slug: id,
  sku,
  title,
  subtitle,
  description,
  categoryKey,
  category: byKey[categoryKey]?.label ?? shopCategories[0].label,
  image,
  price,
  compareAtPrice,
  rewardPoints,
  inStock,
  stockLabel,
  badges,
  includes,
  store: 'koreanshop',
});

export const shopCopy: Record<Language, Record<string, string>> = {
  en: {
    badge: 'K-CUBE Shop',
    title: 'A complete K-CUBE shop with A-Z Korean products, login-gated checkout and built-in rewards',
    subtitle:
      'Browse the full internal catalog, sort it A-Z, filter by category and keep purchase rewards on K-CUBE instead of sending members to an external store.',
    cart: 'Cart summary',
    checkout: 'Complete order',
    empty: 'Your cart is empty. Add a few Korean favorites to start checkout.',
    loginGate: 'Sign in or create an account before checkout to unlock signup rewards and product purchase rewards.',
    rewardsLine: 'Earn rewards when your order is completed on K-CUBE.',
    addToCart: 'Add to cart',
    buyNow: 'Buy now',
    signInToBuy: 'Sign in to buy',
    continueShopping: 'Continue shopping',
    viewDetails: 'View details',
    orderPlaced: 'Order placed on K-CUBE. Rewards have been added to the member wallet.',
    qty: 'Qty',
    orderRewards: 'Order rewards',
    accountPrompt: 'Create account and unlock your welcome bonus plus purchase rewards.',
    shopCategory: 'Shop',
    breadcrumb: 'Home / Shop',
    catalogTitle: 'Shop catalog',
    allProducts: 'All products',
    sortBy: 'Sort by',
    sortAz: 'A-Z',
    sortPriceLow: 'Price: low to high',
    sortPriceHigh: 'Price: high to low',
    sortRewards: 'Rewards: high to low',
    filters: 'Filters',
    results: 'results',
    page: 'Page',
    previous: 'Previous',
    next: 'Next',
    featured: 'Featured collection',
    featuredLine: 'Internal K-CUBE storefront',
    stock: 'Stock',
    sku: 'SKU',
    relatedProducts: 'Related products',
    recentOrder: 'Recent order',
    outOfStock: 'Out of stock',
    protectedCheckout: 'Checkout is protected behind sign in and signup rewards.',
    backToShop: 'Back to shop',
    discoverMore: 'Discover more',
  },
  ko: {
    badge: 'K-CUBE 쇼핑',
    title: 'A-Z 정렬, 로그인 기반 결제, 리워드를 갖춘 K-CUBE 통합 쇼핑몰',
    subtitle:
      '외부 스토어로 보내지 않고 K-CUBE 안에서 전체 상품을 탐색하고 카테고리 필터와 정렬로 구매까지 이어집니다.',
    cart: '장바구니 요약',
    checkout: '주문 완료하기',
    empty: '장바구니가 비어 있습니다. 결제를 시작하려면 상품을 담아 주세요.',
    loginGate: '가입 보너스와 구매 리워드를 받으려면 결제 전에 로그인하거나 계정을 만드세요.',
    rewardsLine: 'K-CUBE에서 주문이 완료되면 리워드가 적립됩니다.',
    addToCart: '장바구니 담기',
    buyNow: '바로 구매',
    signInToBuy: '로그인 후 구매',
    continueShopping: '쇼핑 계속하기',
    viewDetails: '상세 보기',
    orderPlaced: 'K-CUBE에서 주문이 완료되었습니다. 리워드가 회원 지갑에 적립되었습니다.',
    qty: '수량',
    orderRewards: '주문 리워드',
    accountPrompt: '계정을 만들고 가입 보너스와 구매 리워드를 받으세요.',
    shopCategory: 'Shop',
    breadcrumb: 'Home / Shop',
    catalogTitle: '쇼핑 카탈로그',
    allProducts: '전체 상품',
    sortBy: '정렬',
    sortAz: 'A-Z',
    sortPriceLow: '낮은 가격순',
    sortPriceHigh: '높은 가격순',
    sortRewards: '리워드 높은 순',
    filters: '필터',
    results: '개 상품',
    page: '페이지',
    previous: '이전',
    next: '다음',
    featured: '추천 컬렉션',
    featuredLine: 'K-CUBE 내부 스토어',
    stock: '재고',
    sku: 'SKU',
    relatedProducts: '관련 상품',
    recentOrder: '최근 주문',
    outOfStock: '품절',
    protectedCheckout: '결제는 로그인과 가입 리워드 뒤에 보호됩니다.',
    backToShop: '샵으로 돌아가기',
    discoverMore: '더 둘러보기',
  },
  hi: {
    badge: 'K-CUBE Shop',
    title: 'Proper K-CUBE shop jahan A-Z Korean products, login checkout aur rewards sab ek hi jagah milen',
    subtitle:
      'External site par bhejne ke bajay poora catalog isi K-CUBE shop me rakha gaya hai jahan filters, sorting aur rewards flow sab internal hai.',
    cart: 'Cart summary',
    checkout: 'Complete order',
    empty: 'Aapka cart abhi empty hai. Checkout start karne ke liye kuch products add karein.',
    loginGate: 'Checkout se pehle sign in ya account create karein taaki signup rewards aur purchase rewards unlock ho sakein.',
    rewardsLine: 'K-CUBE par order complete hone par rewards milenge.',
    addToCart: 'Add to cart',
    buyNow: 'Buy now',
    signInToBuy: 'Sign in to buy',
    continueShopping: 'Continue shopping',
    viewDetails: 'View details',
    orderPlaced: 'Order K-CUBE par place ho gaya. Rewards member wallet me add ho gaye hain.',
    qty: 'Qty',
    orderRewards: 'Order rewards',
    accountPrompt: 'Account create karke welcome bonus aur purchase rewards unlock karein.',
    shopCategory: 'Shop',
    breadcrumb: 'Home / Shop',
    catalogTitle: 'Shop catalog',
    allProducts: 'All products',
    sortBy: 'Sort by',
    sortAz: 'A-Z',
    sortPriceLow: 'Price: low to high',
    sortPriceHigh: 'Price: high to low',
    sortRewards: 'Rewards: high to low',
    filters: 'Filters',
    results: 'results',
    page: 'Page',
    previous: 'Previous',
    next: 'Next',
    featured: 'Featured collection',
    featuredLine: 'Internal K-CUBE storefront',
    stock: 'Stock',
    sku: 'SKU',
    relatedProducts: 'Related products',
    recentOrder: 'Recent order',
    outOfStock: 'Out of stock',
    protectedCheckout: 'Checkout sign in aur signup rewards ke baad protected rahega.',
    backToShop: 'Back to shop',
    discoverMore: 'Discover more',
  },
};

export const shopProducts: ShopProduct[] = [
  product('brown-rice-green-tea-100t', 'TC-101', txt('Brown Rice Green Tea (100T)', '현미녹차 100T', 'Brown Rice Green Tea (100T)'), txt('Roasted rice and green tea sachets for an everyday calming cup.', '현미와 녹차가 어우러진 데일리 티입니다.', 'Roasted rice aur green tea sachets ka daily pack.'), txt('A mellow tea box that works for pantry shoppers, gifting and repeat beverage orders.', '잔잔한 풍미로 재구매가 잘 나오는 차 상품입니다.', 'Mild tea box jo gifting aur repeat orders dono ke liye strong hai.'), 'tea-coffee', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80', 720, undefined, 72, false, stock.outOfStock, [txt('Tea staple', '차 스테디셀러', 'Tea staple')], [txt('100 tea bags', '티백 100개', '100 tea bags'), txt('Smooth roasted finish', '고소한 마무리', 'Smooth roasted finish'), txt('Reward eligible on checkout', '결제 리워드 대상', 'Reward eligible on checkout')]),
  product('bibigo-kimchi-jar', 'PN-202', txt('Bibigo Kimchi Jar', '비비고 김치 자', 'Bibigo Kimchi Jar'), txt('Crunchy fermented kimchi jar for bowls, grills and side dishes.', '그릴과 밥상에 잘 어울리는 아삭한 김치입니다.', 'Crunchy kimchi jar jo bowls aur meals ke saath perfect hai.'), txt('Balanced spice, clean tang and a pantry-ready size make this an easy first basket add-on.', '깔끔한 산미와 적당한 매운맛으로 첫 장바구니 진입 상품입니다.', 'Balanced spice aur clean tang ke saath easy first cart add-on.'), 'sauces', 'https://images.unsplash.com/photo-1607301405390-d831c242f59b?auto=format&fit=crop&w=1200&q=80', 549, 620, 55, true, stock.lowStock, [txt('Best for first-time buyers', '첫 구매 추천', 'Best for first-time buyers')], [txt('450g glass jar', '450g 유리병', '450g glass jar'), txt('Cold-side serving', '차갑게 바로 서빙', 'Cold-side serving'), txt('High reward multiplier', '높은 리워드 배수', 'High reward multiplier')]),
  product('buldak-hot-chicken-topokki', 'SN-301', txt('Buldak Hot Chicken Flavour Topokki', '불닭 핫치킨 떡볶이', 'Buldak Hot Chicken Flavour Topokki'), txt('Spicy rice cake cup for fast Korean street-food cravings.', '매콤한 컵 떡볶이로 빠르게 즐기는 길거리 맛입니다.', 'Spicy rice cake cup for quick street-food cravings.'), txt('Heat, chew and finish in minutes. Great as a hero product on snack collections.', '빠르게 조리되는 대표 스낵형 떡볶이 상품입니다.', 'Minutes me ready hone wala strong hero snack product.'), 'snacks', 'https://images.unsplash.com/photo-1583224964978-2f4f7aaf4230?auto=format&fit=crop&w=1200&q=80', 290, 350, 45, true, stock.fastMoving, [txt('Street-food style', '길거리 간식', 'Street-food style')], [txt('Single heat-and-eat cup', '즉석 컵 1개', 'Single heat-and-eat cup'), txt('Hot chicken profile', '핫치킨 풍미', 'Hot chicken profile'), txt('Checkout rewards enabled', '결제 리워드 적용', 'Checkout rewards enabled')]),
  product('buldak-sauce', 'SC-401', txt('Buldak Sauce', '불닭 소스', 'Buldak Sauce'), txt('A fiery finishing sauce for noodles, fried rice and Korean bowls.', '면과 볶음밥에 잘 맞는 매운 마무리 소스입니다.', 'Fiery finishing sauce for noodles aur bowls.'), txt('A small bottle with high repeat-purchase potential and strong cross-sell performance.', '반복 구매와 크로스셀에 강한 팬트리 상품입니다.', 'Small bottle but strong repeat-purchase pantry item.'), 'sauces', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80', 290, 450, 38, false, stock.outOfStock, [txt('Pantry booster', '팬트리 부스터', 'Pantry booster')], [txt('Table-side drizzle', '테이블 드리즐용', 'Table-side drizzle'), txt('Spice-heavy finish', '강한 매운맛', 'Spice-heavy finish'), txt('Bundle friendly', '번들 구성 적합', 'Bundle friendly')]),
  product('buldak-sauce-2x-spice', 'SC-402', txt('Buldak Sauce 2x Spice', '불닭 소스 2배 매운맛', 'Buldak Sauce 2x Spice'), txt('Extra-hot sauce built for spicy challenge lovers.', '더 강한 매운맛을 원하는 고객용 소스입니다.', 'Extra-hot sauce for spice challenge lovers.'), txt('A hotter version for challenge bundles, spicy events and high-energy product drops.', '도전형 캠페인과 이벤트에 적합한 강매운맛 소스입니다.', 'Challenge bundles aur spicy campaigns ke liye hotter version.'), 'sauces', 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80', 250, 450, 36, false, stock.outOfStock, [txt('Challenge pick', '도전용 상품', 'Challenge pick')], [txt('2x spice profile', '2배 매운맛', '2x spice profile'), txt('Ideal cart booster', '장바구니 상승 상품', 'Ideal cart booster'), txt('Reward eligible on checkout', '결제 리워드 대상', 'Reward eligible on checkout')]),
  product('cream-carbonara-buldak-pack-of-5', 'ND-501', txt('Cream Carbonara Buldak (Pack Of 5)', '크림 카르보나라 불닭 5입', 'Cream Carbonara Buldak (Pack Of 5)'), txt('Creamy spicy noodles for shoppers who want heat with a softer finish.', '부드러운 크림감과 매운맛을 함께 즐기는 라면입니다.', 'Creamy-spicy noodle pack with softer finish.'), txt('A strong premium instant-noodle entry for multipack buyers and gifting-focused orders.', '묶음 구매 수요가 높은 프리미엄 라면 상품입니다.', 'Premium instant noodle multipack for bundle buyers.'), 'noodles', 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1200&q=80', 716, 750, 80, false, stock.outOfStock, [txt('Multipack', '멀티팩', 'Multipack')], [txt('5 noodle packs', '라면 5개', '5 noodle packs'), txt('Creamy spice balance', '크림 매운맛 밸런스', 'Creamy spice balance'), txt('Giftable box format', '선물용 구성', 'Giftable box format')]),
  product('dongsuh-instant-coffee-mix-white-gold-100t', 'TC-102', txt('Dongsuh Instant Coffee Mix White Gold (100T)', '동서 화이트골드 100T', 'Dongsuh Instant Coffee Mix White Gold (100T)'), txt('A cafe-style Korean coffee mix box for office, pantry and gifting demand.', '사무실과 홈팬트리에 잘 맞는 커피믹스 박스입니다.', 'Cafe-style Korean coffee mix box for pantry aur gifting.'), txt('Creamy sticks with strong repeat demand and reliable order value support.', '재구매가 강한 커피 스틱형 상품입니다.', 'Creamy coffee sticks with strong repeat demand.'), 'tea-coffee', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80', 3200, undefined, 210, true, stock.inStock, [txt('Premium beverage', '프리미엄 음료', 'Premium beverage')], [txt('100 coffee sticks', '커피 스틱 100개', '100 coffee sticks'), txt('Office pantry fit', '오피스 팬트리 적합', 'Office pantry fit'), txt('High reward multiplier', '높은 리워드 배수', 'High reward multiplier')]),
  product('ginseng-tea-100t', 'TC-103', txt('Ginseng Tea (100T)', '인삼차 100T', 'Ginseng Tea (100T)'), txt('Sweet herbal tea sticks with a classic Korean gift-store profile.', '전통 선물형 감성의 인삼차 스틱 세트입니다.', 'Classic Korean herbal tea sticks with gift-store feel.'), txt('Popular for premium baskets, family orders and wellness-themed campaigns.', '프리미엄 바스켓과 웰니스 캠페인에 잘 어울립니다.', 'Premium basket aur wellness campaign friendly tea.'), 'tea-coffee', 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=1200&q=80', 700, 800, 68, true, stock.inStock, [txt('Gift favorite', '선물 인기', 'Gift favorite')], [txt('100 sachets', '스틱 100개', '100 sachets'), txt('Herbal profile', '허브/인삼 풍미', 'Herbal profile'), txt('Checkout rewards enabled', '결제 리워드 적용', 'Checkout rewards enabled')]),
  product('glass-noodles-300g-pack-of-1', 'ND-502', txt('Glass Noodles (300g)', '당면 300g', 'Glass Noodles (300g)'), txt('Springy Korean glass noodles for japchae and stir-fry meals.', '잡채와 볶음요리에 적합한 당면입니다.', 'Springy Korean glass noodles for japchae aur stir-fry.'), txt('A pantry staple for recipe-led shopping and repeat family baskets.', '레시피 기반 구매에 강한 기본 팬트리 상품입니다.', 'Pantry staple for recipe-led shopping.'), 'noodles', 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1200&q=80', 240, undefined, 22, false, stock.outOfStock, [txt('Pantry essential', '기본 팬트리', 'Pantry essential')], [txt('Japchae ready', '잡채용', 'Japchae ready'), txt('300g pack', '300g 포장', '300g pack'), txt('Repeat purchase friendly', '재구매 친화적', 'Repeat purchase friendly')]),
  product('glass-noodles-500g', 'ND-503', txt('Glass Noodles (500g)', '당면 500g', 'Glass Noodles (500g)'), txt('Larger format noodles for families and meal-prep shoppers.', '가정용과 대용량 요리에 맞는 큰 포장입니다.', 'Larger format noodles for family buyers.'), txt('A family-size pantry line that raises basket size without changing the shopping flow.', '장바구니 금액을 자연스럽게 높이는 패밀리형 상품입니다.', 'Family-size pantry line that lifts basket value.'), 'noodles', 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1200&q=80', 650, undefined, 40, false, stock.outOfStock, [txt('Family size', '가정용 대용량', 'Family size')], [txt('500g pack', '500g 포장', '500g pack'), txt('Meal-prep friendly', '밀프렙 적합', 'Meal-prep friendly'), txt('Bundle ready', '번들 구성 가능', 'Bundle ready')]),
  product('hong-sam-won-pouch-50ml-5pc', 'HL-601', txt('Hong Sam Won Pouch 50ml 5pc', '홍삼원 50ml 5포', 'Hong Sam Won Pouch 50ml 5pc'), txt('Portable Korean red ginseng drink pouches with a wellness-first profile.', '휴대가 쉬운 홍삼 음료 파우치 세트입니다.', 'Portable Korean red ginseng drink pouches.'), txt('A high-trust wellness product for premium baskets, gifting and account-reward purchases.', '웰니스 중심의 프리미엄 장바구니 상품입니다.', 'Wellness-focused premium product for gifting and reward purchases.'), 'health', 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=1200&q=80', 550, undefined, 58, false, stock.outOfStock, [txt('Wellness pick', '웰니스 상품', 'Wellness pick')], [txt('5 portable pouches', '휴대용 5포', '5 portable pouches'), txt('Premium gifting fit', '프리미엄 선물 적합', 'Premium gifting fit'), txt('Reward eligible on checkout', '결제 리워드 대상', 'Reward eligible on checkout')]),
  product('instant-coffee-mix-100t', 'TC-104', txt('Instant Coffee Mix (100T)', '인스턴트 커피믹스 100T', 'Instant Coffee Mix (100T)'), txt('Classic mild Korean coffee sticks for office and home pantry stocking.', '사무실과 집에서 많이 찾는 기본 커피믹스입니다.', 'Classic mild Korean coffee sticks for office and home.'), txt('A reliable beverage anchor for repeat orders and practical grocery baskets.', '반복 주문과 생활형 장바구니에 적합한 커피 상품입니다.', 'Reliable beverage anchor for repeat orders.'), 'tea-coffee', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80', 2100, undefined, 150, true, stock.inStock, [txt('Office favorite', '사무실 인기', 'Office favorite')], [txt('100 sticks', '100 스틱', '100 sticks'), txt('Mild roast profile', '부드러운 로스트', 'Mild roast profile'), txt('Same-site rewards', '사이트 내 리워드', 'Same-site rewards')]),
  product('k-gim-kimchi-seasoned-seaweed-25g-x-5', 'SW-701', txt('K-Gim Kimchi Flavour Seasoned Seaweed (25g x 5)', '김치맛 조미김 25g x 5', 'K-Gim Kimchi Flavour Seasoned Seaweed (25g x 5)'), txt('Snackable roasted seaweed with a savory kimchi seasoning finish.', '김치 풍미가 더해진 간식형 조미김입니다.', 'Snackable roasted seaweed with kimchi-seasoning finish.'), txt('A grab-and-go pack that works as a light add-on and intro-to-Korean-snacks purchase.', '가볍게 담기 좋은 입문형 한국 스낵 상품입니다.', 'Light add-on seaweed pack for snack discovery.'), 'seaweed', 'https://images.unsplash.com/photo-1615485737651-7d3f7f0d2e9f?auto=format&fit=crop&w=1200&q=80', 720, undefined, 48, false, stock.outOfStock, [txt('Snackable', '간식형', 'Snackable')], [txt('5 seaweed packs', '김 5팩', '5 seaweed packs'), txt('Kimchi seasoning', '김치 시즈닝', 'Kimchi seasoning'), txt('Cart booster', '장바구니 상승', 'Cart booster')]),
  product('k-gim-mini-kimchi-seasoned-seaweed-pack', 'SW-702', txt('K-Gim Mini Kimchi Seasoned Seaweed Pack', '미니 김치맛 조미김 팩', 'K-Gim Mini Kimchi Seasoned Seaweed Pack'), txt('Mini-format seaweed pouches built for lunchbox and snack bundles.', '도시락과 간식 번들에 맞는 미니 조미김입니다.', 'Mini seaweed pouches for lunchbox and snack bundles.'), txt('Good for multipack campaigns and lower-ticket add-on recommendations.', '낮은 단가의 추가 구매 추천 상품입니다.', 'Great low-ticket add-on for multipack campaigns.'), 'seaweed', 'https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?auto=format&fit=crop&w=1200&q=80', 700, undefined, 44, false, stock.outOfStock, [txt('Lunchbox fit', '도시락 적합', 'Lunchbox fit')], [txt('Mini pouches', '미니 파우치', 'Mini pouches'), txt('Multipack campaign fit', '멀티팩 캠페인 적합', 'Multipack campaign fit'), txt('Reward eligible on checkout', '결제 리워드 대상', 'Reward eligible on checkout')]),
  product('k-gim-roasted-seaweed-20g', 'SW-703', txt('K-Gim Roasted Seaweed 20g', '구운 김 20g', 'K-Gim Roasted Seaweed 20g'), txt('Classic roasted seaweed sheets for rice bowls, kimbap and daily snacks.', '김밥과 밥반찬용으로 좋은 기본 구운 김입니다.', 'Classic roasted seaweed for rice bowls and kimbap.'), txt('A staple pantry seaweed line with strong repeat value and recipe relevance.', '기본 팬트리 카테고리를 잡아주는 반복 구매 상품입니다.', 'Staple pantry seaweed line with repeat value.'), 'seaweed', 'https://images.unsplash.com/photo-1615485737651-7d3f7f0d2e9f?auto=format&fit=crop&w=1200&q=80', 200, undefined, 18, false, stock.outOfStock, [txt('Staple pantry line', '기본 팬트리 상품', 'Staple pantry line')], [txt('Roasted sheets', '구운 김 시트', 'Roasted sheets'), txt('20g pack', '20g 포장', '20g pack'), txt('Recipe-friendly', '레시피 활용도 높음', 'Recipe-friendly')]),
  product('kimchi-ramen-pack-of-5-600g', 'ND-504', txt('Kimchi Ramen (Pack of 5) 600g', '김치라면 5입 600g', 'Kimchi Ramen (Pack of 5) 600g'), txt('Tangy-spicy ramen bundle for kimchi lovers and pantry stocking.', '김치 풍미를 좋아하는 고객용 멀티팩 라면입니다.', 'Tangy-spicy ramen bundle for kimchi lovers.'), txt('A familiar Korean pantry item that makes the noodle section feel complete.', '라면 카테고리를 더 풍성하게 만드는 익숙한 상품입니다.', 'Familiar Korean pantry item that rounds out noodles.'), 'noodles', 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1200&q=80', 380, undefined, 35, false, stock.outOfStock, [txt('Pantry noodle', '팬트리 라면', 'Pantry noodle')], [txt('5 pack bundle', '5입 번들', '5 pack bundle'), txt('Kimchi broth profile', '김치 국물 풍미', 'Kimchi broth profile'), txt('A-Z catalog staple', '카탈로그 기본 상품', 'A-Z catalog staple')]),
  product('korean-red-ginseng-10ml-10sticks', 'HL-602', txt('Korean Red Ginseng (10ml 10sticks)', '홍삼 10ml 10스틱', 'Korean Red Ginseng (10ml 10sticks)'), txt('Premium red ginseng stick set for wellness gifting and high-value orders.', '고가치 웰니스 주문을 위한 프리미엄 홍삼 스틱입니다.', 'Premium red ginseng stick set for high-value wellness orders.'), txt('A premium anchor product for corporate hampers, family gifting and rewards-led upsell.', '프리미엄 업셀과 기업형 선물 세트에 적합합니다.', 'Premium anchor for hampers and reward-led upsell.'), 'health', 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=1200&q=80', 4200, undefined, 280, false, stock.outOfStock, [txt('Premium wellness', '프리미엄 웰니스', 'Premium wellness')], [txt('10 ginseng sticks', '홍삼 스틱 10개', '10 ginseng sticks'), txt('Gift box format', '선물 박스 구성', 'Gift box format'), txt('High reward multiplier', '높은 리워드 배수', 'High reward multiplier')]),
  product('korean-red-ginseng-powder', 'HL-603', txt('Korean Red Ginseng Powder', '홍삼 분말', 'Korean Red Ginseng Powder'), txt('A premium powdered ginseng jar for wellness-first households.', '건강식 중심 고객을 위한 프리미엄 분말형 홍삼입니다.', 'Premium ginseng powder jar for wellness households.'), txt('Large-ticket premium item that helps the internal K-CUBE shop feel serious and complete.', '스토어 신뢰도를 높여주는 고가 건강식 상품입니다.', 'Large-ticket premium item for a more complete internal shop.'), 'health', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80', 5120, 6400, 320, true, stock.inStock, [txt('High value cart', '고가 장바구니', 'High value cart')], [txt('Powder jar format', '분말 자 타입', 'Powder jar format'), txt('Wellness pantry', '웰니스 팬트리', 'Wellness pantry'), txt('Rewards on completion', '완료 시 리워드', 'Rewards on completion')]),
  product('korean-red-ginseng-powder-capsule', 'HL-604', txt('Korean Red Ginseng Powder Capsule', '홍삼 캡슐', 'Korean Red Ginseng Powder Capsule'), txt('Easy daily ginseng capsules for practical wellness shoppers.', '매일 간편하게 섭취하는 캡슐형 홍삼입니다.', 'Easy daily ginseng capsules for practical wellness buyers.'), txt('Capsule format opens a simpler entry point into the premium wellness category.', '프리미엄 웰니스 카테고리의 입문형 포맷입니다.', 'Simpler entry point into premium wellness category.'), 'health', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80', 3500, 6900, 220, false, stock.outOfStock, [txt('Easy daily use', '매일 복용형', 'Easy daily use')], [txt('Capsule format', '캡슐 타입', 'Capsule format'), txt('Wellness basket add-on', '웰니스 바스켓 추가', 'Wellness basket add-on'), txt('Same-site rewards', '사이트 내 리워드', 'Same-site rewards')]),
  product('korean-red-ginseng-tablet', 'HL-605', txt('Korean Red Ginseng Tablet', '홍삼 정제', 'Korean Red Ginseng Tablet'), txt('Tablet-format red ginseng for customers who prefer simple routines.', '간단한 루틴을 선호하는 고객용 홍삼 정제입니다.', 'Tablet-format red ginseng for simple daily routines.'), txt('Balanced between premium value and easy repeat use, ideal for health-category depth.', '건강식 카테고리를 깊게 만들어 주는 반복형 상품입니다.', 'Balances premium value with easy repeat use.'), 'health', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80', 5120, 6700, 250, false, stock.outOfStock, [txt('Routine-friendly', '루틴형 상품', 'Routine-friendly')], [txt('Tablet bottle', '정제 병', 'Tablet bottle'), txt('Repeat-use format', '반복 복용 포맷', 'Repeat-use format'), txt('Checkout rewards enabled', '결제 리워드 적용', 'Checkout rewards enabled')]),
  product('korean-red-ginseng-with-pomegranate-10ml-10sticks', 'HL-606', txt('Korean Red Ginseng with Pomegranate (10ml 10sticks)', '석류 홍삼 10ml 10스틱', 'Korean Red Ginseng with Pomegranate (10ml 10sticks)'), txt('A sweeter wellness stick blend designed for gifting and lighter taste preference.', '석류를 더해 더 부드럽게 즐기는 홍삼 스틱입니다.', 'Sweeter wellness stick blend with pomegranate.'), txt('A softer wellness profile that broadens the supplement category beyond core ginseng buyers.', '웰니스 카테고리의 선택 폭을 넓혀주는 확장형 상품입니다.', 'Broader supplement option beyond core ginseng buyers.'), 'health', 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1200&q=80', 1340, 1490, 96, false, stock.outOfStock, [txt('Gift-ready wellness', '선물형 웰니스', 'Gift-ready wellness')], [txt('Pomegranate blend', '석류 블렌드', 'Pomegranate blend'), txt('10 stick box', '10스틱 박스', '10 stick box'), txt('Internal rewards', '내부 리워드 적용', 'Internal rewards')]),
  product('majjoeum-tteokpokki-hot-spicy-flavor-240g', 'SN-302', txt('Majjoeum Tteokpokki Hot Spicy Flavor (240g)', '마조음 떡볶이 매운맛 240g', 'Majjoeum Tteokpokki Hot Spicy Flavor (240g)'), txt('A hot-and-chewy topokki box for street-food focused snack lovers.', '매운맛을 선호하는 고객용 박스형 떡볶이입니다.', 'Hot-and-chewy topokki box for spicy snack lovers.'), txt('A smart companion product beside cup topokki for deeper snack assortment.', '컵 떡볶이와 함께 보여주기 좋은 확장형 스낵 상품입니다.', 'Great companion product beside cup topokki.'), 'snacks', 'https://images.unsplash.com/photo-1583224964978-2f4f7aaf4230?auto=format&fit=crop&w=1200&q=80', 200, 280, 24, false, stock.outOfStock, [txt('Snack assortment', '스낵 카테고리 확장', 'Snack assortment')], [txt('240g box', '240g 박스', '240g box'), txt('Spicy flavor', '매운맛', 'Spicy flavor'), txt('A-Z catalog staple', '카탈로그 기본 상품', 'A-Z catalog staple')]),
  product('majjoeum-tteokpokki-original-240g', 'SN-303', txt('Majjoeum Tteokpokki Original (240g)', '마조음 떡볶이 오리지널 240g', 'Majjoeum Tteokpokki Original (240g)'), txt('Original topokki flavor for broader snack appeal and lower spice preference.', '조금 더 대중적인 오리지널 떡볶이 맛입니다.', 'Original topokki flavor with broader appeal.'), txt('Balances the spicy variant and helps the internal catalog serve more taste profiles.', '매운맛 제품과 균형을 맞추는 대중형 떡볶이 상품입니다.', 'Balances spicy variant and broadens appeal.'), 'snacks', 'https://images.unsplash.com/photo-1583224964978-2f4f7aaf4230?auto=format&fit=crop&w=1200&q=80', 180, undefined, 20, true, stock.inStock, [txt('Broader taste appeal', '대중형 맛', 'Broader taste appeal')], [txt('Original flavor', '오리지널 맛', 'Original flavor'), txt('240g pack', '240g 포장', '240g pack'), txt('Quick cook', '빠른 조리', 'Quick cook')]),
  product('maxim-coffee-original-red-100t', 'TC-105', txt('Maxim Coffee (Original Red) 100T', '맥심 오리지널 레드 100T', 'Maxim Coffee (Original Red) 100T'), txt('Classic Maxim coffee sticks with familiar Korean pantry recall.', '한국 마트 감성을 살리는 기본 맥심 커피입니다.', 'Classic Maxim coffee sticks with familiar Korean pantry recall.'), txt('One of the most recognizable Korean grocery beverage lines for internal shop trust.', '스토어 신뢰감을 올려주는 인지도 높은 음료 상품입니다.', 'Recognizable Korean grocery beverage line for shop trust.'), 'tea-coffee', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80', 2800, undefined, 180, true, stock.inStock, [txt('Recognizable staple', '인지도 높은 상품', 'Recognizable staple')], [txt('100 coffee sticks', '커피 100스틱', '100 coffee sticks'), txt('Classic Maxim taste', '맥심 기본 맛', 'Classic Maxim taste'), txt('Same-site rewards', '사이트 내 리워드', 'Same-site rewards')]),
  product('ndk-dried-seaweed-k-miyeok', 'SW-704', txt('NDK Dried Seaweed (K-Miyeok)', '건미역', 'NDK Dried Seaweed (K-Miyeok)'), txt('Soup-ready dried seaweed for Korean home cooking baskets.', '국과 반찬에 쓰기 좋은 건미역입니다.', 'Soup-ready dried seaweed for Korean cooking.'), txt('A recipe-oriented pantry product that adds authenticity to the catalog.', '레시피 신뢰도를 높여주는 정통 팬트리 상품입니다.', 'Recipe-oriented pantry product adding authenticity.'), 'seaweed', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80', 325, 580, 28, false, stock.outOfStock, [txt('Recipe pantry', '레시피 팬트리', 'Recipe pantry')], [txt('Soup-ready seaweed', '국용 미역', 'Soup-ready seaweed'), txt('Authentic home-cooking pick', '가정식 추천', 'Authentic home-cooking pick'), txt('Internal rewards', '내부 리워드 적용', 'Internal rewards')]),
  product('nongshim-instant-cup-noodles', 'ND-505', txt('Nongshim Instant Cup Noodles', '농심 컵라면', 'Nongshim Instant Cup Noodles'), txt('Easy cup noodles for on-the-go snack and office pantry demand.', '간편식 수요에 맞는 기본 컵라면 상품입니다.', 'Easy cup noodles for office and on-the-go demand.'), txt('A practical low-friction item that supports fast cart starts and low-ticket orders.', '빠른 장바구니 시작에 좋은 저마찰 상품입니다.', 'Practical low-friction item for fast cart starts.'), 'noodles', 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1200&q=80', 129, undefined, 16, false, stock.outOfStock, [txt('Quick add-on', '빠른 추가 상품', 'Quick add-on')], [txt('Single cup format', '컵 타입', 'Single cup format'), txt('Office pantry fit', '오피스 팬트리 적합', 'Office pantry fit'), txt('Bundle friendly', '번들 구성 적합', 'Bundle friendly')]),
  product('nongshim-shin-red-super-spicy-instant-noodles-5pack', 'ND-506', txt('Nongshim Shin Red Super Spicy Instant Noodles 5 Pack', '농심 신 레드 5입', 'Nongshim Shin Red Super Spicy Instant Noodles 5 Pack'), txt('A hotter Shin profile for customers who want premium spice intensity.', '더 강한 매운맛을 원하는 고객용 프리미엄 라면입니다.', 'Hotter Shin profile for premium spice seekers.'), txt('Adds depth to the noodle aisle and creates a stronger spicy ladder inside the shop.', '라면 카테고리의 매운맛 스펙트럼을 넓혀줍니다.', 'Adds depth to the noodle category.'), 'noodles', 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80', 600, undefined, 52, false, stock.outOfStock, [txt('Spice ladder', '매운맛 단계 확장', 'Spice ladder')], [txt('5 pack format', '5입 구성', '5 pack format'), txt('Super spicy broth', '강매운 국물', 'Super spicy broth'), txt('Reward eligible on checkout', '결제 리워드 대상', 'Reward eligible on checkout')]),
  product('nongshim-soon-veggie-noodle-soup', 'ND-507', txt('Nongshim Soon Veggie Noodle Soup', '농심 순 비건 컵면', 'Nongshim Soon Veggie Noodle Soup'), txt('Lighter veggie-forward noodles for a softer pantry assortment.', '좀 더 가벼운 채소 중심 컵면 상품입니다.', 'Lighter veggie-forward noodle cup.'), txt('Helps the K-CUBE catalog feel more complete by serving milder and non-meaty preferences.', '더 다양한 식성에 대응하는 균형형 상품입니다.', 'Makes catalog feel more complete for milder preferences.'), 'noodles', 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80', 129, undefined, 14, false, stock.outOfStock, [txt('Milder option', '순한 옵션', 'Milder option')], [txt('Veggie profile', '채소 풍미', 'Veggie profile'), txt('Single cup', '컵 타입', 'Single cup'), txt('Quick checkout item', '빠른 결제 상품', 'Quick checkout item')]),
  product('nongshim-super-spicy-cup', 'ND-508', txt('Nongshim Super Spicy Cup', '농심 슈퍼 스파이시 컵', 'Nongshim Super Spicy Cup'), txt('Single cup spicy noodles for challenge shelves and impulse shopping.', '도전형 매운맛 컵라면 상품입니다.', 'Single cup spicy noodle for impulse and challenge shelves.'), txt('Great for hot-product groupings, campaign drops and front-of-catalog excitement.', '캠페인 전면 배치에 어울리는 자극적인 컵라면입니다.', 'Great for hot-product groupings and campaign drops.'), 'noodles', 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1200&q=80', 129, undefined, 18, false, stock.outOfStock, [txt('Impulse pick', '충동 구매형', 'Impulse pick')], [txt('Single spicy cup', '매운 컵 1개', 'Single spicy cup'), txt('Challenge shelf fit', '도전 상품 구성', 'Challenge shelf fit'), txt('Same-site rewards', '사이트 내 리워드', 'Same-site rewards')]),
  product('olive-seasoned-seaweed-large-25g', 'SW-705', txt('Olive Seasoned Seaweed (Large) 25g', '올리브 조미김 25g', 'Olive Seasoned Seaweed (Large) 25g'), txt('Savory olive-seasoned gim with a familiar retail-friendly profile.', '대중적인 풍미의 올리브 조미김입니다.', 'Savory olive-seasoned gim with mass appeal.'), txt('A clean snack pantry line that pairs well with rice, lunchboxes and sampler bundles.', '밥반찬과 런치박스, 샘플러 번들에 잘 맞습니다.', 'Pairs well with rice, lunchboxes and sampler bundles.'), 'seaweed', 'https://images.unsplash.com/photo-1615485737651-7d3f7f0d2e9f?auto=format&fit=crop&w=1200&q=80', 200, undefined, 20, false, stock.outOfStock, [txt('Mass appeal', '대중형 상품', 'Mass appeal')], [txt('25g large pack', '25g 대용량', '25g large pack'), txt('Olive seasoning', '올리브 시즈닝', 'Olive seasoning'), txt('Bundle ready', '번들 구성 가능', 'Bundle ready')]),
  product('olive-seasoned-seaweed-3pack', 'SW-706', txt('Olive Seasoned Seaweed 3 Pack', '올리브 조미김 3팩', 'Olive Seasoned Seaweed 3 Pack'), txt('A multipack seaweed choice for households and lunch prep.', '가정용과 도시락 준비에 좋은 3팩 구성입니다.', 'Multipack seaweed choice for households.'), txt('Supports basket building with a low-risk, family-friendly repeat product.', '가족형 반복 구매를 위한 안정적인 상품입니다.', 'Family-friendly repeat product with low buying friction.'), 'seaweed', 'https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?auto=format&fit=crop&w=1200&q=80', 210, undefined, 22, false, stock.outOfStock, [txt('Family multipack', '가정용 멀티팩', 'Family multipack')], [txt('3 seaweed packs', '김 3팩', '3 seaweed packs'), txt('Lunch-prep fit', '도시락 준비 적합', 'Lunch-prep fit'), txt('A-Z catalog staple', '카탈로그 기본 상품', 'A-Z catalog staple')]),
  product('ottogi-cheese-ramen-pack-of-5', 'ND-509', txt('Ottogi Cheese Ramen (Pack Of 5)', '오뚜기 치즈라면 5입', 'Ottogi Cheese Ramen (Pack Of 5)'), txt('Cheesy Korean noodles for softer spice and family-friendly comfort meals.', '치즈 풍미로 더 부드럽게 즐기는 라면입니다.', 'Cheesy Korean noodles for family-friendly comfort meals.'), txt('A great contrast to extra-spicy lines and a strong entry for broader taste preferences.', '매운 라인업과 대비되는 대중형 라면 상품입니다.', 'Strong contrast to extra-spicy lines for broader appeal.'), 'noodles', 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80', 600, undefined, 48, false, stock.outOfStock, [txt('Broader noodle appeal', '대중형 라면', 'Broader noodle appeal')], [txt('5 pack box', '5입 박스', '5 pack box'), txt('Cheese flavor', '치즈 풍미', 'Cheese flavor'), txt('Internal rewards', '내부 리워드 적용', 'Internal rewards')]),
  product('plain-roasted-sushi-seaweed-25-sheets', 'SW-707', txt('Plain Roasted Sushi Seaweed (25 Sheets)', '김밥용 구운김 25장', 'Plain Roasted Sushi Seaweed (25 Sheets)'), txt('A sushi and kimbap seaweed pack built for recipe shoppers.', '김밥과 롤 요리를 위한 구운 김 상품입니다.', 'Sushi and kimbap seaweed pack for recipe shoppers.'), txt('Recipe-led buyers often add this with noodles, kimchi and sauce for higher-value carts.', '레시피 동반 구매를 잘 만드는 시너지 상품입니다.', 'Often paired with noodles, kimchi and sauces.'), 'seaweed', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80', 405, undefined, 32, false, stock.outOfStock, [txt('Recipe cross-sell', '레시피 크로스셀', 'Recipe cross-sell')], [txt('25 sushi sheets', '김 25장', '25 sushi sheets'), txt('Kimbap ready', '김밥용', 'Kimbap ready'), txt('Basket builder', '장바구니 확장', 'Basket builder')]),
  product('samyang-3x-spicy-hot-chicken-noodles-pack-of-5', 'ND-510', txt('Samyang 3x Spicy Hot Chicken Noodles (Pack Of 5)', '삼양 3배 매운 불닭 5입', 'Samyang 3x Spicy Hot Chicken Noodles (Pack Of 5)'), txt('A challenge-level spicy multipack for heat-focused noodle buyers.', '극강 매운맛을 찾는 고객을 위한 도전형 라면입니다.', 'Challenge-level spicy multipack for heat-focused buyers.'), txt('A hero product for spicy campaigns, content-led promotions and high-attention merchandising.', '매운맛 캠페인과 콘텐츠형 프로모션에 강한 히어로 상품입니다.', 'Hero product for spicy campaigns and merchandising.'), 'noodles', 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1200&q=80', 650, undefined, 64, false, stock.outOfStock, [txt('Challenge hero', '도전형 히어로', 'Challenge hero')], [txt('3x spice profile', '3배 매운맛', '3x spice profile'), txt('5 pack format', '5입 구성', '5 pack format'), txt('Same-site rewards', '사이트 내 리워드', 'Same-site rewards')]),
  product('shin-ramyun-family-pack', 'ND-511', txt('Shin Ramyun Family Pack', '신라면 패밀리팩', 'Shin Ramyun Family Pack'), txt('The classic spicy Korean noodle multipack for fast pantry starts.', '가장 익숙한 매운 한국 라면 멀티팩입니다.', 'Classic spicy Korean noodle multipack.'), txt('A core traffic-driving product that makes the internal K-CUBE shop instantly recognizable.', '내부 K-CUBE 숍의 신뢰를 올려주는 핵심 유입 상품입니다.', 'Core traffic-driving product for the internal shop.'), 'noodles', 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80', 699, undefined, 70, true, stock.fastMoving, [txt('Top seller', '상위 판매', 'Top seller'), txt('Starter pack', '스타터 팩', 'Starter pack')], [txt('6 ramen packs', '라면 6개', '6 ramen packs'), txt('Classic spicy broth', '기본 매운 국물', 'Classic spicy broth'), txt('Reward eligible on checkout', '결제 리워드 대상', 'Reward eligible on checkout')]),
  product('wheat-noodle-jungmyeon-900g', 'ND-512', txt('Wheat Noodle (Jungmyeon) 900g', '중면 900g', 'Wheat Noodle (Jungmyeon) 900g'), txt('Traditional wheat noodles for Korean soups, cold bowls and family cooking.', '국수와 냉면 응용에 좋은 전통 면 상품입니다.', 'Traditional wheat noodles for soups and family cooking.'), txt('Adds breadth beyond ramen so the catalog feels like a real Korean grocery shop.', '라면 외 품목을 채워 실제 마트형 카탈로그 완성도를 높입니다.', 'Adds grocery depth beyond ramen.'), 'noodles', 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1200&q=80', 330, undefined, 26, true, stock.inStock, [txt('Pantry depth', '팬트리 확장', 'Pantry depth')], [txt('900g family pack', '900g 가정용', '900g family pack'), txt('Soup and cold-bowl fit', '국물/비빔 활용', 'Soup and cold-bowl fit'), txt('Internal rewards', '내부 리워드 적용', 'Internal rewards')]),
];

export const findShopProduct = (slug: string) => shopProducts.find((item) => item.slug === slug);

export const getRelatedShopProducts = (productId: string, categoryKey: string) =>
  shopProducts.filter((item) => item.id !== productId && item.categoryKey === categoryKey).slice(0, 4);

export const shopMenuLinks: MenuLink[] = shopCategories
  .filter((category) => category.key !== 'all')
  .map((category) => {
    const categoryProducts = shopProducts
      .filter((productItem) => productItem.categoryKey === category.key)
      .sort((left, right) => left.title.en.localeCompare(right.title.en))
      .slice(0, 6);

    return {
      label: category.label,
      href: '/shop',
      description: category.description,
      children: categoryProducts.map((productItem) => ({
        label: productItem.title,
        href: `/shop/${productItem.slug}`,
        description: productItem.subtitle,
        points: productItem.rewardPoints,
      })),
    };
  });
