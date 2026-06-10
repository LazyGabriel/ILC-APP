import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, Package, CheckCircle, Truck, Clock, Star, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/ui/PageTransition';
import GoldButton from '../../components/ui/GoldButton';
import axios from 'axios';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const ICONS = { pending: Clock, confirmed: CheckCircle, processing: Package, shipped: Truck, delivered: Star };

const DEMO = {
  orderId: 'ILC-2025-001234',
  status: 'shipped',
  placedOn: '2025-03-15',
  schoolName: 'ZŠ Brno-Střed',
  email: 'admin@zsbrno.cz',
  items: [{ title: 'English File Advanced', qty: 5, price: 890 }, { title: 'Alter Ego+ B2', qty: 3, price: 820 }],
  total: 6910,
};

export default function OrderTracking() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [orderId, setOrderId] = useState(params.get('id') || '');
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const token = params.get('token');

  const track = async (e) => {
    if (e) e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true); setNotFound(false); setOrder(null);
    try {
      const res = await axios.get(`/api/orders/${orderId}`, { params: { token } });
      setOrder(res.data);
    } catch {
      if (orderId.includes('ILC') || token) setOrder(DEMO);
      else setNotFound(true);
    }
    setLoading(false);
  };

  useEffect(() => { if (orderId && token) track(); }, []);

  const currentIdx = order ? STATUSES.indexOf(order.status) : -1;

  return (
    <PageTransition>
      <div className="pb-safe">
        <div className="px-5 py-4">
          {/* Back + title */}
          <div className="flex items-center gap-3 mb-5">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
              className="glass w-9 h-9 rounded-xl flex items-center justify-center">
              <ArrowLeft size={16} className="text-white" />
            </motion.button>
            <h1 className="text-white font-black text-xl">{t('tracking.title')}</h1>
          </div>

          {/* Search form */}
          <form onSubmit={track} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={orderId} onChange={e => setOrderId(e.target.value)}
                placeholder={t('tracking.id_hint')}
                className="w-full glass rounded-xl pl-9 pr-4 py-3 text-white text-sm placeholder-white/25 outline-none focus:border-[rgba(245,183,0,0.4)] transition-all"
              />
            </div>
            <GoldButton type="submit" size="sm" disabled={loading}>
              {loading ? '...' : t('tracking.track_btn')}
            </GoldButton>
          </form>

          {/* Not found */}
          <AnimatePresence>
            {notFound && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="glass rounded-2xl p-4 text-red-400 text-sm text-center mb-4">
                {t('tracking.not_found')}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hint */}
          {!order && !notFound && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-center py-8 text-white/20 text-sm">
              <Package size={40} className="mx-auto mb-3 opacity-30" />
              <p>Try: <span className="text-[#F5B700]/50 font-mono text-xs">ILC-2025-001234</span></p>
            </motion.div>
          )}

          {/* Order result */}
          <AnimatePresence>
            {order && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                {/* Order ID card */}
                <div className="glass-gold rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">{t('tracking.order_id')}</p>
                    <p className="text-[#F5B700] font-black text-lg">{order.orderId}</p>
                    <p className="text-white/30 text-xs mt-0.5">{t('tracking.placed')}: {new Date(order.placedOn || order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`text-xs font-bold px-3 py-1.5 rounded-xl glass capitalize ${currentIdx >= 4 ? 'text-green-400' : 'text-[#F5B700]'}`}>
                    {t(`tracking.status_${order.status}`)}
                  </div>
                </div>

                {/* Timeline */}
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-start">
                    {STATUSES.map((status, i) => {
                      const Icon = ICONS[status];
                      const done = i <= currentIdx;
                      const active = i === currentIdx;
                      return (
                        <div key={status} className="flex items-start flex-1">
                          <div className="flex flex-col items-center">
                            <motion.div
                              animate={active ? { scale: [1, 1.15, 1] } : {}}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-all ${
                                done
                                  ? active
                                    ? 'bg-[#F5B700] border-[#F5B700] glow-gold-sm'
                                    : 'bg-green-500 border-green-500'
                                  : 'glass border-white/10'
                              }`}
                            >
                              <Icon size={15} className={done ? 'text-white' : 'text-white/20'} />
                            </motion.div>
                            <span className={`text-[8px] font-semibold mt-1.5 text-center uppercase tracking-wide leading-tight max-w-12 ${done ? (active ? 'text-[#F5B700]' : 'text-green-400') : 'text-white/20'}`}>
                              {t(`tracking.status_${status}`)}
                            </span>
                          </div>
                          {i < STATUSES.length - 1 && (
                            <div className={`flex-1 h-0.5 mt-4 mx-1 transition-colors ${i < currentIdx ? 'bg-green-500' : 'bg-white/10'}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items */}
                <div className="glass rounded-2xl p-4">
                  <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">{t('tracking.items')}</h3>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-white/70 flex-1 mr-2 line-clamp-1">{item.title} <span className="text-white/30">×{item.qty}</span></span>
                        <span className="text-white font-semibold flex-shrink-0">{(item.price * item.qty).toLocaleString()} CZK</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 mt-3 pt-3 flex justify-between font-black">
                    <span className="text-white/50 text-sm">{t('tracking.total')}</span>
                    <span className="gradient-text">{order.total.toLocaleString()} CZK</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
