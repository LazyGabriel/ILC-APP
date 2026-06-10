import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, CheckCircle, Star } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

const CONFETTI_COLORS = ['#F5B700', '#60A5FA', '#34D399', '#F87171', '#A78BFA', '#FFFFFF'];

function ConfettiBurst({ active }) {
  const particles = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    const dist  = 28 + (i % 3) * 10;
    return { id: i, x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, color: CONFETTI_COLORS[i % CONFETTI_COLORS.length] };
  });

  return (
    <AnimatePresence>
      {active && particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 5, height: 5,
            left: '50%', top: '50%',
            marginLeft: -2.5, marginTop: -2.5,
            background: p.color,
            zIndex: 60,
          }}
          initial={{ x: 0, y: 0, scale: 1.2, opacity: 1 }}
          animate={{ x: p.x, y: p.y, scale: 0, opacity: 0 }}
          exit={{}}
          transition={{ duration: 0.6, ease: 'easeOut', delay: p.id * 0.015 }}
        />
      ))}
    </AnimatePresence>
  );
}

export default function BookCard({ book, index = 0 }) {
  const { t }    = useTranslation();
  const addItem  = useCartStore(s => s.addItem);
  const [added, setAdded]     = useState(false);
  const [burst, setBurst]     = useState(false);
  const cardRef = useRef(null);

  // 3D tilt
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 200, damping: 18 });
  const sRotY = useSpring(rotY, { stiffness: 200, damping: 18 });
  const shine = useTransform(sRotY, [-10, 10], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.06)']);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    rotX.set(-y * 10);
    rotY.set(x * 10);
  };

  const handleMouseLeave = () => { rotX.set(0); rotY.set(0); };

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(book, 1);
    setAdded(true);
    setBurst(true);
    setTimeout(() => { setAdded(false); setBurst(false); }, 2000);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: sRotX, rotateY: sRotY, transformPerspective: 600 }}
    >
      <Link to={`/book/${book.id}`} className="block">
        <motion.div
          className="glass rounded-3xl overflow-hidden group transition-all duration-300"
          whileHover={{ y: -5 }}
          style={{ willChange: 'transform' }}
        >
          {/* Shine overlay */}
          <motion.div className="absolute inset-0 rounded-3xl pointer-events-none z-10" style={{ background: shine }} />

          {/* Cover */}
          <div
            className="relative h-44 flex items-center justify-center overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${book.color}dd, ${book.color}88)` }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-3 opacity-30" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <div className="text-center px-4">
              <div className="text-white font-bold text-base leading-tight line-clamp-2 drop-shadow-lg">{book.title}</div>
              <div className="text-white/60 text-xs mt-1">{book.author.split('&')[0].trim()}</div>
            </div>

            {book.badge && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.06 + 0.2, type: 'spring', stiffness: 300 }}
                className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: book.badgeColor || '#F5B700', color: '#0A1628' }}
              >
                {book.badge}
              </motion.div>
            )}

            {!book.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">{t('catalog.out_of_stock')}</span>
              </div>
            )}

            <div className="absolute bottom-3 left-3 glass text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {book.level}
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="text-white font-semibold text-sm leading-tight line-clamp-1 mb-1">{book.title}</h3>
            <p className="text-white/40 text-xs mb-2 line-clamp-1">{book.language} · {book.publisher.split(' ')[0]}</p>

            <div className="flex items-center gap-1 mb-3">
              <Star size={10} fill="#F5B700" className="text-[#F5B700]" />
              <span className="text-[#F5B700] text-xs font-semibold">{book.rating}</span>
              <span className="text-white/30 text-xs">({book.reviews})</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-white font-bold text-base">{book.price.toLocaleString()}</span>
                <span className="text-white/40 text-xs ml-1">{t('common.czk')}</span>
                {book.oldPrice && (
                  <div className="text-white/30 text-xs line-through">{book.oldPrice.toLocaleString()}</div>
                )}
              </div>

              <div className="relative">
                <ConfettiBurst active={burst} />
                <motion.button
                  whileTap={{ scale: 0.82 }}
                  animate={added ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  onClick={handleAdd}
                  disabled={!book.inStock}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    added
                      ? 'bg-green-500 text-white'
                      : book.inStock
                      ? 'bg-[#F5B700] text-[#0A1628]'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {added ? (
                      <motion.div key="check" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
                        <CheckCircle size={16} />
                      </motion.div>
                    ) : (
                      <motion.div key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <ShoppingCart size={16} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
