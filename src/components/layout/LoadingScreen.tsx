'use client';

import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1200);
    const hideTimer = setTimeout(() => setVisible(false), 1700);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] bg-bg flex flex-col items-center justify-center gap-[18px] transition-opacity duration-500"
      style={{ opacity: fading ? 0 : 1 }}
    >
      <div className="w-11 h-11 border-2 border-bdr-light border-t-accent-red rounded-full animate-spin" />
      <div className="font-display text-[11px] tracking-[6px] uppercase text-txt-dim animate-flicker">
        Initializing GEOSTRIKE
      </div>
    </div>
  );
}
