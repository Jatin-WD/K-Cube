"use client";

import { Pause, Play } from 'lucide-react';
import { useRef, useState } from 'react';

export default function FestivalVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  return (
    <div className="group relative aspect-video overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/assets/itaewon.jpg"
        className="h-full w-full object-contain"
        aria-label="2025 Itaewon World Music Festival video archive"
      >
        <source src="/assets/25%EB%85%84%20%EC%9D%B4%ED%83%9C%EC%9B%90%EC%9D%8C%EC%95%85%EC%A0%9C.mp4" type="video/mp4" />
        Your browser does not support the festival video.
      </video>
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={isPaused ? 'Play festival video' : 'Pause festival video'}
        className="absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-[#07101b]/75 text-white opacity-0 shadow-lg backdrop-blur-sm transition group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
      >
        {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
      </button>
      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-[#07101b]/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
        Hover for controls
      </span>
    </div>
  );
}
