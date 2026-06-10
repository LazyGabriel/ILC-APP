import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, y: 14, scale: 0.985 },
  animate: { opacity: 1, y: 0,  scale: 1      },
  exit:    { opacity: 0, y: -8, scale: 0.985  },
};

export default function PageTransition({ children }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  const handleScroll = useCallback((e) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = e.target;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? el.scrollTop / max : 0);
    });
  }, []);

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      onScroll={handleScroll}
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Scroll progress bar */}
      <div className="sticky top-0 z-50 h-[2px] pointer-events-none" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div
          className="h-full transition-[width] duration-75"
          style={{
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, #1B3FAB, #4A6FA5 50%, #F5B700)',
          }}
        />
      </div>

      {children}
    </motion.div>
  );
}
