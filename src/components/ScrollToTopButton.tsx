'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`
        fixed bottom-6 right-6 z-50
        bg-white/70 backdrop-blur border border-gray-300
        hover:bg-white/90 hover:border-gray-400
        text-gray-700
        p-3 rounded-full shadow-lg
        transition-all duration-300
        ${visible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'}
      `}
      aria-label="Scroll to top"
      style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)' }}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
} 