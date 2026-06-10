import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, LogOut, Package, ChevronRight, ShoppingBag, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import GoldButton from '../../components/ui/GoldButton';
import PageTransition from '../../components/ui/PageTransition';

// Demo order history
const DEMO_ORDERS = [
  { id: 'ILC-2025-001234', date: '2025-03-15', total: 4450, status: 'delivered', items: 5 },
  { id: 'ILC-2025-000891', date: '2025-02-20', total: 2340, status: 'shipped',   items: 3 },
  { id: 'ILC-2024-009923', date: '2024-11-08', total: 6780, status: 'delivered', items: 8 },
];

const STATUS_STYLES = {
  delivered:  { bg: 'bg-green-500/15',  text: 'text-green-400' },
  shipped:    { bg: 'bg-blue-500/15',   text: 'text-blue-400' },
  processing: { bg: 'bg-yellow-500/15', text: 'text-yellow-400' },
  pending:    { bg: 'bg-white/10',      text: 'text-white/50' },
};

export default function Account() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) return (
    <PageTransition>
      <div className="flex-1 flex flex-col items-center justify-center pb-safe px-8 text-center h-full gap-6">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-20 h-20 glass rounded-3xl flex items-center justify-center"
        >
          <User size={32} className="text-white/30" />
        </motion.div>
        <div>
          <h2 className="text-white font-bold text-xl mb-2">{t('auth.login')}</h2>
          <p className="text-white/40 text-sm">Sign in to see your order history and account details.</p>
        </div>
        <GoldButton size="full" onClick={() => navigate('/auth')}>
          {t('auth.sign_in')}
        </GoldButton>
        <button onClick={() => navigate('/auth')} className="text-white/30 text-sm">
          {t('auth.no_account')} <span className="text-[#F5B700]">{t('auth.sign_up')}</span>
        </button>
      </div>
    </PageTransition>
  );

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <PageTransition>
      <div className="pb-safe">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mx-5 mt-4 mb-5 glass-gold rounded-3xl p-5"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F5B700] to-[#FF9500] flex items-center justify-center flex-shrink-0"
            >
              <span className="text-[#0A1628] font-black text-xl">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </motion.div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold text-base truncate">{user?.name || 'School User'}</h2>
              <p className="text-white/40 text-xs truncate">{user?.email}</p>
              {user?.school && <p className="text-[#F5B700]/70 text-xs mt-0.5 truncate">{user.school}</p>}
            </div>
          </div>
        </motion.div>

        {/* Order history */}
        <div className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-base">{t('account.orders')}</h3>
            <ShoppingBag size={16} className="text-white/30" />
          </div>

          {DEMO_ORDERS.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <Package size={32} className="text-white/20 mx-auto mb-2" />
              <p className="text-white/40 text-sm">{t('account.no_orders')}</p>
              <p className="text-white/25 text-xs mt-1">{t('account.no_orders_sub')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {DEMO_ORDERS.map((order, i) => {
                const styles = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link to={`/track?id=${order.id}`} className="block">
                      <div className="glass rounded-2xl p-4 hover:border-[rgba(245,183,0,0.2)] transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-white font-bold text-sm">{order.id}</p>
                            <div className="flex items-center gap-1.5 mt-0.5 text-white/30 text-xs">
                              <Clock size={10} />
                              {new Date(order.date).toLocaleDateString()}
                            </div>
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles.bg} ${styles.text} capitalize`}>
                            {t(`tracking.status_${order.status}`)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/40 text-xs">{order.items} items</span>
                          <div className="flex items-center gap-1 text-white font-bold text-sm">
                            {order.total.toLocaleString()} CZK
                            <ChevronRight size={14} className="text-white/30" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sign out */}
        <div className="px-5 pb-4">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleLogout}
            className="w-full glass rounded-2xl py-4 flex items-center justify-center gap-2 text-red-400/70 hover:text-red-400 font-semibold text-sm transition-colors"
          >
            <LogOut size={16} /> {t('account.logout')}
          </motion.button>
        </div>
      </div>
    </PageTransition>
  );
}
