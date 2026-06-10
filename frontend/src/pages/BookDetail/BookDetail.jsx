import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Star, ShoppingCart, CheckCircle, Package, BookOpen, Hash, FileText } from 'lucide-react';
import { getById, getRelated } from '../../data/books';
import { useCartStore } from '../../store/cartStore';
import GoldButton from '../../components/ui/GoldButton';
import BookCard from '../../components/ui/BookCard';
import PageTransition from '../../components/ui/PageTransition';

export default function BookDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const addItem = useCartStore(s => s.addItem);

  const [qty, setQty]     = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab]     = useState('desc');

  const book    = getById(id);
  const related = book ? getRelated(book) : [];

  if (!book) return (
    <div className="flex-1 flex items-center justify-center flex-col gap-4 pb-safe">
      <div className="text-5xl">📭</div>
      <p className="text-white/50">Book not found</p>
      <Link to="/catalog" className="text-[#F5B700] text-sm font-semibold">← Back to Catalog</Link>
    </div>
  );

  const handleAdd = () => {
    addItem(book, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <PageTransition>
      <div className="pb-safe">
        {/* Hero cover */}
        <div className="relative h-72 flex items-end overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${book.color}ff, ${book.color}88, #0A1628)` }}
        >
          {/* Decorative orb */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
            style={{ background: `radial-gradient(circle, rgba(245,183,0,0.15), transparent)` }}
          />

          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 glass w-9 h-9 rounded-xl flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-white" />
          </motion.button>

          {/* Badge */}
          {book.badge && (
            <motion.div
              initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: book.badgeColor || '#F5B700', color: '#0A1628' }}
            >
              {book.badge}
            </motion.div>
          )}

          {/* 3D Book visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div
              animate={{ y: [0, -6, 0], rotateY: [0, 3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-28 h-36 rounded-2xl shadow-2xl flex items-center justify-center text-center px-3 relative"
              style={{
                background: `linear-gradient(160deg, ${book.color}ff, ${book.color}88)`,
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${book.color}44`,
              }}
            >
              <div className="absolute left-0 top-2 bottom-2 w-2 rounded-l-sm" style={{ background: 'rgba(0,0,0,0.3)' }} />
              <span className="text-white font-bold text-sm leading-tight line-clamp-3 drop-shadow">{book.title}</span>
            </motion.div>
          </motion.div>

          {/* Gradient fade to bg */}
          <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: 'linear-gradient(to top, #0A1628, transparent)' }} />

          {/* Title overlay at bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="relative z-10 px-5 pb-5 w-full"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold glass px-2 py-0.5 rounded-full text-white/80">{book.level}</span>
              <span className="text-[10px] text-white/40">{book.language}</span>
            </div>
            <h1 className="text-white font-black text-xl leading-tight">{book.title}</h1>
            <p className="text-white/50 text-xs mt-0.5">{t('book.by')} {book.author}</p>
          </motion.div>
        </div>

        {/* Content */}
        <div className="px-5 pt-5 space-y-5">
          {/* Rating + Price row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill={i < Math.round(book.rating) ? '#F5B700' : 'transparent'} className={i < Math.round(book.rating) ? 'text-[#F5B700]' : 'text-white/20'} />
                ))}
              </div>
              <span className="text-white/60 text-xs">{book.rating} ({book.reviews} {t('book.reviews')})</span>
            </div>
            <div>
              {book.oldPrice && <div className="text-white/30 text-xs line-through text-right">{book.oldPrice.toLocaleString()} CZK</div>}
              <div className="gradient-text font-black text-2xl text-glow">{book.price.toLocaleString()} <span className="text-base font-semibold">CZK</span></div>
            </div>
          </motion.div>

          {/* Stock + publisher */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex items-center gap-3"
          >
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl ${book.inStock ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
              <Package size={12} />
              {book.inStock ? t('book.in_stock') : t('book.out_of_stock')}
            </div>
            <div className="flex items-center gap-1.5 glass text-white/50 text-xs px-3 py-1.5 rounded-xl">
              <BookOpen size={12} />
              {book.publisher.split(' ').slice(0,2).join(' ')}
            </div>
          </motion.div>

          {/* Qty + Add to cart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex gap-3 items-center"
          >
            {/* Qty stepper */}
            <div className="glass rounded-2xl flex items-center overflow-hidden">
              <motion.button whileTap={{ scale: 0.85 }} onClick={() => setQty(q => Math.max(1, q - 1))}
                className="px-4 py-3 text-white/60 hover:text-white font-bold text-lg transition-colors">−</motion.button>
              <span className="text-white font-bold text-base min-w-8 text-center">{qty}</span>
              <motion.button whileTap={{ scale: 0.85 }} onClick={() => setQty(q => q + 1)}
                className="px-4 py-3 text-white/60 hover:text-white font-bold text-lg transition-colors">+</motion.button>
            </div>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.div key="added" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                    className="w-full bg-green-500 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 glow-gold-sm">
                    <CheckCircle size={18} /> {t('book.added')}
                  </motion.div>
                ) : (
                  <motion.div key="add" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                    <GoldButton size="full" onClick={handleAdd} disabled={!book.inStock}>
                      <span className="flex items-center justify-center gap-2">
                        <ShoppingCart size={18} /> {t('book.add_cart')}
                      </span>
                    </GoldButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
            <div className="flex glass rounded-2xl p-1 mb-4">
              {[['desc', t('book.description')], ['details', t('book.details')]].map(([key, label]) => (
                <button key={key} onClick={() => setTab(key)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${tab === key ? 'bg-[#F5B700] text-[#0A1628]' : 'text-white/40'}`}>
                  {label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {tab === 'desc' ? (
                <motion.p key="desc" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-white/60 text-sm leading-relaxed">
                  {book.description}
                </motion.p>
              ) : (
                <motion.div key="details" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="space-y-3">
                  {[
                    [Hash,      'ISBN',            book.isbn],
                    [FileText,  t('book.pages'),   `${book.pages} pages`],
                    [BookOpen,  t('book.language'), book.language],
                    [BookOpen,  t('book.level'),    book.level],
                    [BookOpen,  t('book.publisher'),book.publisher],
                  ].map(([Icon, label, value]) => (
                    <div key={label} className="flex items-center justify-between glass rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 text-white/40 text-xs">
                        <Icon size={13} /> {label}
                      </div>
                      <span className="text-white text-xs font-semibold">{value}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Related */}
          {related.length > 0 && (
            <div className="pb-4">
              <h3 className="text-white font-bold text-sm mb-3">{t('book.related')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {related.map((b, i) => <BookCard key={b.id} book={b} index={i} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
