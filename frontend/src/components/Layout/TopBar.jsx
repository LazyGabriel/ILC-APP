import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Globe, ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import ILCLogo from '../ui/ILCLogo';

export default function TopBar() {
  const { i18n, t } = useTranslation();
  const isCS  = i18n.language === 'cs';
  const count = useCartStore(s => s.items.reduce((n, i) => n + i.qty, 0));

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-2.5"
      style={{
        background: 'rgba(10,22,40,0.92)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* ILC text logo */}
      <Link to="/">
        <motion.div
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 400 }}
          className="flex items-center gap-2"
        >
          <ILCLogo size="sm" dark={false} />
          <div className="h-5 w-px bg-white/10" />
          <span className="text-white/35 text-[10px] font-semibold uppercase tracking-[0.22em]">
            {t('common.books_label')}
          </span>
        </motion.div>
      </Link>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {/* Language toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => i18n.changeLanguage(isCS ? 'en' : 'cs')}
          className="flex items-center gap-1 glass rounded-xl px-2.5 py-1.5"
        >
          <Globe size={12} className="text-[#F5B700]" />
          <span className="text-white/60 text-[11px] font-bold uppercase tracking-wide">
            {isCS ? 'EN' : 'CS'}
          </span>
        </motion.button>

        {/* Cart */}
        <Link to="/cart">
          <motion.div
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.06 }}
            className="relative glass rounded-xl p-2"
          >
            <ShoppingCart size={17} className="text-white/55" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="absolute -top-1.5 -right-1.5 bg-[#F5B700] text-[#0A1628] text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center"
                >
                  {count > 9 ? '9+' : count}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>

        {/* Account */}
        <Link to="/account">
          <motion.div
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.06 }}
            className="glass rounded-xl p-2"
          >
            <User size={17} className="text-white/55" />
          </motion.div>
        </Link>
      </div>
    </motion.header>
  );
}
