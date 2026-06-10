import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import BookCard from '../../components/ui/BookCard';
import PageTransition from '../../components/ui/PageTransition';
import { books } from '../../data/books';

const CHIP = ({ label, active, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.92 }}
    onClick={onClick}
    className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
      active
        ? 'bg-[#F5B700] text-[#0A1628] glow-gold-sm'
        : 'glass text-white/60 hover:text-white'
    }`}
  >
    {label}
  </motion.button>
);

export default function Catalog() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const [search, setSearch]       = useState('');
  const [language, setLanguage]   = useState(searchParams.get('language') || '');
  const [level, setLevel]         = useState('');
  const [sort, setSort]           = useState('new');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let r = [...books];
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.includes(q));
    }
    if (language) r = r.filter(b => b.language === language);
    if (level)    r = r.filter(b => b.level === level);
    switch (sort) {
      case 'price_asc':  r.sort((a, b) => a.price - b.price); break;
      case 'price_desc': r.sort((a, b) => b.price - a.price); break;
      case 'rating':     r.sort((a, b) => b.rating - a.rating); break;
      default:           r.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0)); break;
    }
    return r;
  }, [search, language, level, sort]);

  return (
    <PageTransition>
      <div className="pb-safe">
        {/* Search bar */}
        <div className="px-4 py-3 sticky top-0 z-30" style={{ background: 'rgba(10,22,40,0.9)', backdropFilter: 'blur(20px)' }}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('catalog.search')}
                className="w-full glass rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[rgba(245,183,0,0.4)] transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                  <X size={14} />
                </button>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`glass rounded-xl px-3 flex items-center gap-1.5 transition-all ${showFilters ? 'border-[rgba(245,183,0,0.4)] text-[#F5B700]' : 'text-white/50'}`}
            >
              <SlidersHorizontal size={16} />
            </motion.button>
          </div>

          {/* Language filter chips */}
          <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
            <CHIP label={t('catalog.all')} active={!language} onClick={() => setLanguage('')} />
            {['English','German','French','Spanish','Czech'].map(l => (
              <CHIP key={l} label={l} active={language === l} onClick={() => setLanguage(language === l ? '' : l)} />
            ))}
          </div>
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden px-4"
            >
              <div className="glass rounded-2xl p-4 mb-3 space-y-4">
                {/* Level */}
                <div>
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">{t('catalog.level')}</p>
                  <div className="flex flex-wrap gap-2">
                    <CHIP label={t('catalog.all')} active={!level} onClick={() => setLevel('')} />
                    {['A1','A2','B1','B2','C1','C2'].map(l => (
                      <CHIP key={l} label={l} active={level === l} onClick={() => setLevel(level === l ? '' : l)} />
                    ))}
                  </div>
                </div>
                {/* Sort */}
                <div>
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">{t('catalog.sort')}</p>
                  <div className="flex flex-wrap gap-2">
                    {[['new', t('catalog.sort_new')], ['price_asc', t('catalog.sort_price_asc')], ['price_desc', t('catalog.sort_price_desc')], ['rating', t('catalog.sort_rating')]].map(([val, label]) => (
                      <CHIP key={val} label={label} active={sort === val} onClick={() => setSort(val)} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <div className="px-4 py-2">
          <p className="text-white/40 text-xs">{t('catalog.sub', { count: filtered.length })}</p>
        </div>

        {/* Grid */}
        <div className="px-4 pb-4">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 text-white/30"
            >
              <div className="text-5xl mb-3">📚</div>
              <p className="text-sm">{t('catalog.no_results')}</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <AnimatePresence>
                {filtered.map((book, i) => <BookCard key={book.id} book={book} index={i} />)}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
