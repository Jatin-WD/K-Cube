'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';

export default function ProductDiscoveryImage({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return <div className="culture-product-image-fallback" role="img" aria-label={`${title}: image unavailable`}>
      <ShoppingBag size={30} strokeWidth={1.3} aria-hidden="true" />
      <span>Image unavailable</span>
    </div>;
  }

  return <Image src={src} alt={src.includes('images.unsplash.com') ? `Illustrative lifestyle image for ${title}` : title} unoptimized={!src.startsWith('https://images.unsplash.com/')} fill sizes="(max-width: 600px) 46vw, (max-width: 900px) 23vw, 280px" onError={() => setFailed(true)} />;
}
