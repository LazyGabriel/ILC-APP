import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import GoldButton from '../../components/ui/GoldButton';
import PageTransition from '../../components/ui/PageTransition';

export default function Cart() {
  const { t } = useTranslation();
  const items = useCartStore(s => s.items);
  const removeItem = useCartStore(s => s.removeItem);
  const updateQty  = useCartStore(s => s.updateQty);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const freeShipping = total >= 2000;

  if (items.length === 0) return (
    <PageTransition>
      <div className="flex-1 flex flex-col items-center justify-center gap-5 pb-safe px-8 text-center h-full">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 glass rounded-3xl flex items-center justify-center"
        >
          <ShoppingCart size={32} className="text-white/30" />
        </motion.div>
        <div>
          <h2 className="text-white font-bold text-xl mb-2">{t('cart.empty')}</h2>
          <p className="text-white/40 text-sm">{t('cart.empty_sub')}</p>
        </div>
        <Link to="/catalog">
          <GoldButton>{t('cart.browse')}</GoldButton>
        </Link>
      </div>
    </PageTransition>
  );

  return (
    <PageTransition>
      <div className="pb-safe">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-white font-black text-xl">{t('cart.title')}</h1>
            <span className="text-white/40 text-sm">{t('cart.items', { count })}</span>
          </div>

          {/* Free shipping banner */}
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2 text-xs font-semibold ${freeShipping ? 'bg-green-500/15 text-green-400' : 'glass-gold text-[#F5B700]'}`}
          >
            <Package size={13} />
            {freeShipping ? t('cart.free_shipping') : t('cart.shipping_note')}
          </motion.div>

          {/* Items */}
          <div className="space-y-3 mb-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="glass rounded-2xl p-4 flex gap-3"
                >
                  {/* Book color swatch */}
                  <div className="w-14 h-18 rounded-xl flex-shrink-0 flex items-center justify-center text-center px-1 py-2"
                    style={{ background: `linear-gradient(135deg, ${item.color}dd, ${item.color}66)`, minHeight: '4.5rem' }}
                  >
                    <span className="text-white text-[8px] font-bold leading-tight line-clamp-3">{item.title}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm line-clamp-1">{item.title}</p>
                    <p className="text-white/40 text-xs mb-2">{item.language} · {item.level}</p>

                    <div className="flex items-center justify-between">
                      {/* Qty stepper */}
                      <div className="glass rounded-xl flex items-center overflow-hidden">
                        <motion.button whileTap={{ scale: 0.85 }} onClick={() => updateQty(item.id, item.qty - 1)}
                          className="px-3 py-1.5 text-white/50 hover:text-white font-bold text-sm">−</motion.button>
                        <span className="text-white font-bold text-sm min-w-6 text-center">{item.qty}</span>
                        <motion.button whileTap={{ scale: 0.85 }} onClick={() => updateQty(item.id, item.qty + 1)}
                          className="px-3 py-1.5 text-white/50 hover:text-white font-bold text-sm">+</motion.button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold text-sm">{(item.price * item.qty).toLocaleString()} CZK</span>
                        <motion.button whileTap={{ scale: 0.85 }} onClick={() => removeItem(item.id)}
                          className="text-red-400/60 hover:text-red-400 transition-colors">
                          <Trash2 size={15} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <motion.div layout className="glass-gold rounded-2xl p-5 mb-4">
            <div className="flex justify-between text-white/50 text-sm mb-2">
              <span>{t('cart.subtotal')}</span>
              <span>{total.toLocaleString()} CZK</span>
            </div>
            <div className="flex justify-between text-white/50 text-sm mb-4">
              <span>Shipping</span>
              <span className={freeShipping ? 'text-green-400 font-semibold' : ''}>
                {freeShipping ? 'Free' : '150 CZK'}
              </span>
            </div>
            <div className="flex justify-between font-black text-white text-lg border-t border-white/10 pt-3">
              <span>{t('cart.total')}</span>
              <span className="gradient-text">{(total + (freeShipping ? 0 : 150)).toLocaleString()} CZK</span>
            </div>
          </motion.div>

          <Link to="/checkout">
            <GoldButton size="full">
              <span className="flex items-center justify-center gap-2">
                {t('cart.checkout')} <ArrowRight size={18} />
              </span>
            </GoldButton>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
