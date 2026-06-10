import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, animate, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight, Award, Users, Globe, BookOpen, Star, Zap,
} from 'lucide-react';
import BookCard from '../../components/ui/BookCard';
import GoldButton from '../../components/ui/GoldButton';
import ILCLogo from '../../components/ui/ILCLogo';
import PageTransition from '../../components/ui/PageTransition';
import { getFeatured, getNew } from '../../data/books';

// ── Helpers ───────────────────────────────────────────────────

function Orb({ color, size, style, duration = 8, delay = 0 }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.18, 0.08] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, background: `radial-gradient(circle, ${color}, transparent 70%)`, ...style }}
    />
  );
}

function Reveal({ children, delay = 0, dir = 'up' }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const dirs   = { up: [0, 26], left: [-26, 0], right: [26, 0] };
  const [dx, dy] = dirs[dir] || [0, 26];
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, x: dx, y: dy }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Counter({ to, suffix = '', duration = 1.8 }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: v => setVal(Math.round(v)) });
    return c.stop;
  }, [inView, to, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ── Language Spin Wheel ───────────────────────────────────────
const LANGS = [
  { lang: 'English', flag: '🇬🇧', color: '#1a3a8e', hint: 'The world language of business' },
  { lang: 'Deutsch', flag: '🇩🇪', color: '#1a5c3a', hint: 'Key for Central European careers' },
  { lang: 'Français', flag: '🇫🇷', color: '#5a1a8e', hint: 'Spoken by 270M people worldwide' },
  { lang: 'Español', flag: '🇪🇸', color: '#8e3a1a', hint: 'Most taught foreign language globally' },
  { lang: 'Čeština', flag: '🇨🇿', color: '#1a5a8e', hint: 'Perfect your native language' },
];

function LanguageSpin() {
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const rotation = useMotionValue(0);
  const springRot = useSpring(rotation, { stiffness: 28, damping: 12 });

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const target = rotation.get() + 1440 + Math.random() * 720;
    rotation.set(target);
    setTimeout(() => {
      setResult(LANGS[Math.floor(Math.random() * LANGS.length)]);
      setSpinning(false);
    }, 1800);
  };

  return (
    <div className="glass rounded-3xl p-5 relative overflow-hidden">
      <Orb color="#A78BFA" size={120} style={{ right: -20, top: -20 }} duration={6} />

      <div className="flex items-center gap-2 mb-4">
        <Zap size={14} className="text-[#F5B700]" />
        <span className="text-[#F5B700] text-[10px] font-black uppercase tracking-widest">Výzva dne</span>
      </div>

      <p className="text-white/50 text-xs mb-4 leading-relaxed">Jaký jazyk se dnes naučit? Točit!</p>

      <div className="flex items-center gap-4">
        {/* Spin button */}
        <motion.button
          onClick={spin}
          whileTap={{ scale: 0.9 }}
          className="relative flex-shrink-0"
        >
          <motion.div
            style={{ rotate: springRot, background: 'linear-gradient(135deg, #1B3FAB, #4A6FA5)', boxShadow: spinning ? '0 0 24px rgba(74,111,165,0.6)' : '0 4px 16px rgba(0,0,0,0.3)' }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          >
            <motion.span
              animate={spinning ? { rotate: [0, 360] } : {}}
              transition={{ duration: 0.4, repeat: spinning ? Infinity : 0, ease: 'linear' }}
            >
              🎲
            </motion.span>
          </motion.div>
          {spinning && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              style={{ background: 'rgba(74,111,165,0.3)' }}
            />
          )}
        </motion.button>

        {/* Result */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key={result.lang}
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, delay: 0.1 }}
                    className="text-2xl"
                  >
                    {result.flag}
                  </motion.span>
                  <span className="text-white font-black text-lg">{result.lang}</span>
                </div>
                <p className="text-white/40 text-[10px] leading-tight">{result.hint}</p>
                <Link to="/catalog">
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="mt-2 text-[#F5B700] text-[10px] font-bold flex items-center gap-1"
                  >
                    Zobrazit knihy <ArrowRight size={10} />
                  </motion.div>
                </Link>
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {spinning ? (
                  <div className="flex gap-1">
                    {LANGS.map((l, i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        className="text-lg"
                      >
                        {l.flag}
                      </motion.span>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-1.5 mb-1">
                      {LANGS.map(l => <span key={l.lang} className="text-lg opacity-60">{l.flag}</span>)}
                    </div>
                    <p className="text-white/30 text-[10px]">Stiskni kostku a zjisti svůj dnešní jazyk</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────
const LANG_CATEGORIES = [
  { langKey: 'English', flag: '🇬🇧', color: ['#1a3a8e', '#0d2460'], count: 5, level: 'A1–C2' },
  { langKey: 'German',  flag: '🇩🇪', color: ['#1a5c3a', '#0d3b25'], count: 2, level: 'A1–B2' },
  { langKey: 'French',  flag: '🇫🇷', color: ['#5a1a8e', '#3b0d60'], count: 2, level: 'A1–B2' },
  { langKey: 'Spanish', flag: '🇪🇸', color: ['#8e3a1a', '#602808'], count: 2, level: 'B1–C1' },
  { langKey: 'Czech',   flag: '🇨🇿', color: ['#1a5a8e', '#0d3b60'], count: 2, level: 'A1–A2' },
];

const TESTIMONIALS = [
  { name: 'Mgr. Petra Horáková',  role: 'Ředitelka',    school: 'ZŠ Masarykova, Brno',    text: 'ILC je naším důvěryhodným partnerem již přes 12 let. Spolehliví, odborní a vždy ochotní.', stars: 5, initials: 'PH', color: '#1B3FAB' },
  { name: 'Ing. T. Kratochvíl',   role: 'Ředitel gym.', school: 'Gymnázium M. Lercha',    text: 'Systém hromadných objednávek a fakturace B2B nám šetří enormní množství administrativní práce.', stars: 5, initials: 'TK', color: '#1a5c3a' },
  { name: 'PhDr. M. Blahová',    role: 'Koordinátor',  school: 'SPŠ Brno-Židenice',      text: 'Jejich katalog nemá konkurenci. Vždy najdeme vše od A1 pro začátečníky až po pokročilé C2.', stars: 5, initials: 'MB', color: '#5a1a8e' },
];

const STATS = [
  { icon: Award,    value: 35,   suffix: '+', key: 'stats_years'      },
  { icon: Users,    value: 2000, suffix: '+', key: 'stats_schools'    },
  { icon: BookOpen, value: 1200, suffix: '+', key: 'stats_books'      },
  { icon: Globe,    value: 50,   suffix: '+', key: 'stats_publishers' },
];

// ── Page ──────────────────────────────────────────────────────
export default function Home() {
  const { t } = useTranslation();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY     = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const heroOpac  = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const featured = getFeatured();
  const newBooks = getNew();

  return (
    <PageTransition>
      <div className="pb-safe">

        {/* ── HERO ────────────────────────────────────────── */}
        <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: 380 }}>
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #070f1e 0%, #0d1f4a 45%, #070f1e 100%)' }} />
            <Orb color="#1B3FAB" size={280} style={{ top: -60, right: -40 }} duration={9} />
            <Orb color="#F5B700" size={200} style={{ bottom: -40, left: -60 }} duration={7} delay={2} />
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }} />
          </motion.div>

          {/* Floating ILC card */}
          <motion.div style={{ y: heroY, opacity: heroOpac }} className="absolute top-5 right-4 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -8 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ rotate: 0, scale: 1.06 }}
              className="glass rounded-2xl px-4 py-3"
              style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.4), 0 0 32px rgba(27,63,171,0.3)' }}
            >
              <ILCLogo size="sm" dark={false} />
            </motion.div>
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-2 -right-1 text-xl"
            >🇨🇿</motion.div>
          </motion.div>

          <motion.div style={{ y: heroY, opacity: heroOpac }} className="relative z-10 px-5 pt-8 pb-10">
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-1.5 glass rounded-full px-3 py-1.5 mb-5"
            >
              <motion.span
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-[#34D399]"
              />
              <span className="text-[#34D399] text-[11px] font-bold uppercase tracking-wider">{t('home.hero_eyebrow')}</span>
            </motion.div>

            <div className="overflow-hidden mb-3">
              <motion.h1
                initial={{ y: 90 }} animate={{ y: 0 }}
                transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-[2rem] font-black leading-[1.08] text-white max-w-[230px]"
              >
                {t('home.hero_title')}
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="flex items-center gap-3 mt-5"
            >
              <Link to="/about">
                <GoldButton size="md">
                  <span className="flex items-center gap-1.5">{t('home.about_us')} <ArrowRight size={14} /></span>
                </GoldButton>
              </Link>
              <Link to="/catalog" className="text-white/40 text-xs font-medium hover:text-white/70 transition-colors underline underline-offset-2">
                {t('home.browse')} →
              </Link>
            </motion.div>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" style={{ background: 'linear-gradient(to top, #0A1628, transparent)' }} />
        </section>

        {/* ── STATS ───────────────────────────────────────── */}
        <section className="px-4 py-3">
          <Reveal>
            <div className="glass-gold rounded-2xl grid grid-cols-4 divide-x divide-[rgba(245,183,0,0.12)]">
              {STATS.map(({ icon: Icon, value, suffix, key }, i) => (
                <div key={key} className="flex flex-col items-center py-4 px-1 text-center">
                  <motion.div
                    whileInView={{ rotate: [0, -18, 18, 0], scale: [1, 1.2, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 + 0.4, duration: 0.7 }}
                  >
                    <Icon size={13} className="text-[#F5B700] mb-1 opacity-80" />
                  </motion.div>
                  <div className="text-white font-black text-[15px] leading-none">
                    <Counter to={value} suffix={suffix} duration={1.5 + i * 0.12} />
                  </div>
                  <div className="text-white/30 text-[8px] mt-1 leading-tight whitespace-pre-line font-medium">
                    {t(`home.${key}`)}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── LANGUAGE SPIN ───────────────────────────────── */}
        <section className="px-5 pt-4 pb-5">
          <Reveal delay={0.05}>
            <LanguageSpin />
          </Reveal>
        </section>

        {/* ── LANGUAGE CATEGORIES ─────────────────────────── */}
        <section className="pt-3 pb-6">
          <div className="flex items-center justify-between px-5 mb-4">
            <Reveal dir="left"><h2 className="text-white font-bold text-base">{t('home.categories')}</h2></Reveal>
            <Reveal dir="right">
              <Link to="/catalog" className="text-[#F5B700] text-xs font-semibold flex items-center gap-0.5">
                {t('home.all_books')} <ArrowRight size={12} />
              </Link>
            </Reveal>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pl-5 pr-5">
            {LANG_CATEGORIES.map((cat, i) => (
              <motion.div key={cat.langKey}
                initial={{ opacity: 0, scale: 0.78, y: 24 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.92 }}
                whileHover={{ y: -6 }}
                className="flex-shrink-0"
              >
                <Link to={`/catalog?language=${cat.langKey}`}>
                  <div className="relative w-28 h-36 rounded-2xl overflow-hidden flex flex-col justify-between p-3"
                    style={{ background: `linear-gradient(145deg, ${cat.color[0]}, ${cat.color[1]})`, border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}
                  >
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                    <motion.div
                      animate={{ x: ['-120%', '220%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 + i * 1.2, ease: 'easeInOut' }}
                      className="absolute inset-y-0 w-1/2 pointer-events-none"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}
                    />
                    <motion.span
                      animate={{ rotate: [0, -6, 6, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.6 }}
                      className="text-3xl block relative"
                    >{cat.flag}</motion.span>
                    <div className="relative">
                      <div className="text-white font-black text-sm">{cat.langKey}</div>
                      <div className="text-white/40 text-[9px] mt-0.5">{cat.level}</div>
                      <div className="mt-2 inline-flex items-center gap-1 bg-white/10 rounded-full px-2 py-0.5">
                        <BookOpen size={8} className="text-white/60" />
                        <span className="text-white/60 text-[8px] font-semibold">{cat.count} {t('home.lang_titles')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FEATURED BOOKS ──────────────────────────────── */}
        <section className="px-5 pt-2 pb-6">
          <div className="flex items-center justify-between mb-4">
            <Reveal dir="left">
              <div>
                <h2 className="text-white font-bold text-base">{t('home.featured')}</h2>
                <p className="text-white/30 text-[10px] mt-0.5">{t('home.featured_sub')}</p>
              </div>
            </Reveal>
            <Reveal dir="right">
              <Link to="/catalog" className="text-[#F5B700] text-xs font-semibold flex items-center gap-0.5">
                {t('home.all_books')} <ArrowRight size={12} />
              </Link>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featured.map((book, i) => <BookCard key={book.id} book={book} index={i} />)}
          </div>
        </section>

        {/* ── TESTIMONIALS ────────────────────────────────── */}
        <section className="pt-2 pb-5">
          <div className="flex items-center justify-between px-5 mb-4">
            <Reveal dir="left">
              <div>
                <h2 className="text-white font-bold text-base">{t('home.testimonials_title')}</h2>
                <p className="text-white/30 text-[10px] mt-0.5">{t('home.testimonials_sub')}</p>
              </div>
            </Reveal>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pl-5 pr-5">
            {TESTIMONIALS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 32, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="flex-shrink-0 w-64 glass rounded-2xl p-4"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: item.stars }).map((_, s) => (
                    <motion.div key={s}
                      initial={{ scale: 0, rotate: -30 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + s * 0.07, type: 'spring', stiffness: 400 }}
                    >
                      <Star size={11} className="text-[#F5B700] fill-[#F5B700]" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-white/65 text-[11px] leading-relaxed mb-3 line-clamp-3">„{item.text}"</p>
                <div className="flex items-center gap-2.5">
                  <motion.div
                    whileInView={{ rotate: [0, 360] }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 + 0.4, duration: 0.6 }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-[10px] flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}88)` }}
                  >
                    {item.initials}
                  </motion.div>
                  <div className="min-w-0">
                    <div className="text-white font-bold text-[11px] truncate">{item.name}</div>
                    <div className="text-white/35 text-[9px] truncate">{item.school}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── NEW ARRIVALS ────────────────────────────────── */}
        {newBooks.length > 0 && (
          <section className="pb-6">
            <div className="flex items-center justify-between px-5 mb-4">
              <Reveal dir="left">
                <div>
                  <h2 className="text-white font-bold text-base">{t('home.new_arrivals')}</h2>
                  <p className="text-[#10B981] text-[10px] font-semibold mt-0.5 flex items-center gap-1">
                    <motion.span animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block" />
                    {t('home.new_badge')}
                  </p>
                </div>
              </Reveal>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pl-5 pr-5">
              {newBooks.map((book, i) => (
                <div key={book.id} className="min-w-44 flex-shrink-0">
                  <BookCard book={book} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── PROMO CTA ───────────────────────────────────── */}
        <section className="px-5 pb-12">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl p-6 text-center"
              style={{ background: 'linear-gradient(135deg, #0b1d50 0%, #172d7a 50%, #0b1d50 100%)' }}
            >
              <Orb color="#F5B700" size={180} style={{ top: -50, left: '50%', transform: 'translateX(-50%)' }} duration={5} />
              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 5, 0], scale: [1, 1.12, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                  className="text-4xl mb-4"
                >📚</motion.div>
                <h3 className="text-white font-black text-xl mb-2 leading-tight">{t('home.promo_title')}</h3>
                <p className="text-white/50 text-xs mb-5">{t('home.promo_sub')}</p>
                <Link to="/catalog">
                  <GoldButton size="full">
                    <span className="flex items-center justify-center gap-2">
                      <BookOpen size={15} /> {t('home.promo_cta')}
                    </span>
                  </GoldButton>
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

      </div>
    </PageTransition>
  );
}
