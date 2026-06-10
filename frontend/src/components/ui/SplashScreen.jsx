import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ILCLogo from './ILCLogo';

export default function SplashScreen({ visible }) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: '#050d18' }}
        >
          {/* Ambient glow rings */}
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 0.18, scale: 1.4 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="absolute w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, #2B4470, transparent 70%)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.12, 0.06], scale: [0.6, 1.1, 0.95] }}
            transition={{ duration: 2, ease: 'easeOut', delay: 0.4 }}
            className="absolute w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, #F5B700, transparent 70%)' }}
          />

          {/* Main ILC logo — animated letters */}
          <div className="relative flex flex-col items-center">
            {/* Glow halos behind each letter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ filter: 'blur(24px)', transform: 'scale(1.3)' }}
            >
              <ILCLogo size="xl" dark={false} />
            </motion.div>

            {/* Main text */}
            <ILCLogo size="xl" dark={false} animate />

            {/* Books line */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.4, y: 8 }}
              animate={{ opacity: 1, scaleX: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 mt-4"
            >
              <div className="h-px w-10" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2))' }} />
              <span className="text-white/45 text-[12px] font-semibold uppercase tracking-[0.4em]">
                {t('common.books_label')}
              </span>
              <div className="h-px w-10" style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.2))' }} />
            </motion.div>

            {/* Flag + tagline */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.45 }}
              className="flex items-center gap-2 mt-3"
            >
              <span className="text-base">🇨🇿</span>
              <span className="text-white/22 text-[10px] uppercase tracking-[0.25em]">
                {t('common.since')}
              </span>
            </motion.div>
          </div>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-14 left-1/2 -translate-x-1/2 rounded-full overflow-hidden"
            style={{ width: 80, height: 2, background: 'rgba(255,255,255,0.07)' }}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ delay: 0.1, duration: 2.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: '100%',
                borderRadius: 9999,
                background: 'linear-gradient(90deg, #1B3FAB, #4A6FA5, #F5B700)',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
