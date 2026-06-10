import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BookOpen, Info, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const tabs = [
  { to: '/',        icon: Home,     key: 'nav.home'    },
  { to: '/about',   icon: Info,     key: 'nav.about'   },
  { to: '/catalog', icon: BookOpen, key: 'nav.books'   },
  { to: '/contact', icon: Phone,    key: 'nav.contact' },
];

export default function BottomNav() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
      {/* Blur backdrop */}
      <div
        className="absolute inset-0 border-t"
        style={{
          background: 'rgba(10,22,40,0.85)',
          backdropFilter: 'blur(24px)',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      />

      <div className="relative flex items-center justify-around px-2 py-2 pb-safe">
        {tabs.map(({ to, icon: Icon, key }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 relative"
            >
              <motion.div
                animate={isActive ? { y: -2 } : { y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="relative"
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={isActive ? 'text-[#F5B700]' : 'text-white/35'}
                />
                {/* Active glow dot */}
                {isActive && (
                  <motion.div
                    layoutId="navDot"
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: '#F5B700' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.div>
              <span
                className="text-[10px] font-medium transition-colors"
                style={{ color: isActive ? '#F5B700' : 'rgba(255,255,255,0.3)' }}
              >
                {t(key)}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
