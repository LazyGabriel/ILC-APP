import { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Award, Users, Globe, Heart, Shield, Star,
  ArrowRight, CheckCircle, MapPin, ExternalLink, Sparkles,
} from 'lucide-react';
import PageTransition from '../../components/ui/PageTransition';
import GoldButton from '../../components/ui/GoldButton';
import ILCLogo from '../../components/ui/ILCLogo';

// ── Timeline colors (by index) ────────────────────────────────
const TL_COLORS = ['#F5B700','#60A5FA','#34D399','#A78BFA','#F5B700','#60A5FA','#34D399','#F5B700','#A78BFA','#F5B700'];

// ── Helpers ───────────────────────────────────────────────────

/** Floating radial gradient orb */
function Orb({ color = '#1B3FAB', size = 200, style = {}, duration = 8, delay = 0 }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.18, 1], opacity: [0.07, 0.14, 0.07] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
        ...style,
      }}
    />
  );
}

/** Scroll-triggered reveal */
function Reveal({ children, delay = 0, dir = 'up', once = true, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-40px' });
  const from = dir === 'up' ? { y: 32, opacity: 0 } : dir === 'down' ? { y: -32, opacity: 0 } : dir === 'left' ? { x: -32, opacity: 0 } : { x: 32, opacity: 0 };
  return (
    <motion.div ref={ref} initial={from} animate={inView ? { y: 0, x: 0, opacity: 1 } : from}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

/** Animated counter */
function Counter({ to, suffix = '', prefix = '', decimals = 0 }) {
  const ref     = useRef(null);
  const inView  = useInView(ref, { once: true, margin: '-20px' });
  const val     = useMotionValue(0);
  const spring  = useSpring(val, { stiffness: 50, damping: 14 });

  useEffect(() => {
    if (inView) animate(val, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1] });
  }, [inView, to, val]);

  return (
    <motion.span ref={ref} style={{ display: 'inline' }}>
      {prefix}
      <motion.span>{spring.get().toFixed(decimals)}</motion.span>
      {suffix}
    </motion.span>
  );
}

/** Animated number that updates on each frame */
function LiveCounter({ to, suffix = '', prefix = '' }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const val    = useMotionValue(0);
  const spring = useSpring(val, { stiffness: 50, damping: 14 });
  const displayRef = useRef(null);

  useEffect(() => {
    if (!inView) return;
    animate(val, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1] });
    const unsub = spring.on('change', v => {
      if (displayRef.current) displayRef.current.textContent = prefix + Math.round(v) + suffix;
    });
    return unsub;
  }, [inView, to, val, spring, prefix, suffix]);

  return <span ref={ref}><span ref={displayRef}>{prefix}0{suffix}</span></span>;
}

// ── Values data ───────────────────────────────────────────────
const VALUES = [
  { icon: Heart,  key: 'v1', color: '#F87171' },
  { icon: Shield, key: 'v2', color: '#60A5FA' },
  { icon: Star,   key: 'v3', color: '#F5B700' },
  { icon: Users,  key: 'v4', color: '#34D399' },
];

const TEAM = [
  { name: 'Martin Kovář',    role: 'CEO & Founder',        initials: 'MK', color: '#1B3FAB', years: '35' },
  { name: 'Jana Nováková',   role: 'Head of Curation',     initials: 'JN', color: '#1a5c3a', years: '18' },
  { name: 'Tomáš Blaha',    role: 'B2B Sales Director',   initials: 'TB', color: '#5a1a8e', years: '12' },
  { name: 'Eva Procházková', role: 'Publisher Relations',  initials: 'EP', color: '#8e3a1a', years: '9'  },
];

const AWARDS = [
  { icon: '🏅', title: 'Best Educational Supplier', org: 'Czech Ministry of Education', year: '2022' },
  { icon: '⭐', title: 'ISO 9001 Certified',         org: 'Quality Management System',  year: '2019' },
  { icon: '🌍', title: 'IH World Organisation',      org: 'International House Network', year: '1995' },
  { icon: '🎓', title: 'Certified Educator Partner', org: 'Oxford University Press',     year: '2015' },
];

const PUBLISHERS = [
  { short: 'OUP', name: 'Oxford University Press',   color: '#1a2a6e' },
  { short: 'CUP', name: 'Cambridge University Press', color: '#0d4a3a' },
  { short: 'HUE', name: 'Hueber Verlag',              color: '#1a5c3a' },
  { short: 'DDR', name: 'Éditions Didier',            color: '#5a1a6e' },
  { short: 'SAN', name: 'Santillana',                 color: '#6e3a1a' },
  { short: 'FRA', name: 'Fraus',                      color: '#1a4a6e' },
];

// ── Timeline item ─────────────────────────────────────────────
function TimelineItem({ item, index, isLast, color }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="flex items-start gap-0 relative">
      {/* Left side */}
      <div className={`flex-1 flex ${isLeft ? 'justify-end pr-4' : 'justify-start pl-4 invisible'}`}>
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -28, scale: 0.92 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.03, y: -2 }}
            className="glass rounded-2xl p-3 max-w-[140px] cursor-default"
            style={{ borderLeft: `2px solid ${color}44` }}
          >
            <div className="text-lg mb-1">{item.flag}</div>
            <div className="text-white font-bold text-xs leading-tight">{item.title}</div>
            <div className="text-white/40 text-[9px] mt-1 leading-relaxed">{item.desc}</div>
          </motion.div>
        )}
      </div>

      {/* Center dot + line */}
      <div className="flex flex-col items-center w-14 flex-shrink-0">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={inView ? { scale: 1, rotate: 0 } : {}}
          transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.05 }}
          className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-[#0A1628] text-xs z-10 relative"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)`, boxShadow: `0 0 20px ${color}55` }}
        >
          {item.year.slice(2)}
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.25, ease: 'easeOut' }}
            className="w-px mt-1 origin-top"
            style={{ background: `linear-gradient(to bottom, ${color}55, transparent)`, minHeight: 32 }}
          />
        )}
      </div>

      {/* Right side */}
      <div className={`flex-1 flex ${!isLeft ? 'justify-start pl-4' : 'justify-end pr-4 invisible'}`}>
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 28, scale: 0.92 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.03, y: -2 }}
            className="glass rounded-2xl p-3 max-w-[140px] cursor-default"
            style={{ borderRight: `2px solid ${color}44` }}
          >
            <div className="text-lg mb-1">{item.flag}</div>
            <div className="text-white font-bold text-xs leading-tight">{item.title}</div>
            <div className="text-white/40 text-[9px] mt-1 leading-relaxed">{item.desc}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function About() {
  const { t } = useTranslation();
  const TIMELINE = t('about.timeline_items', { returnObjects: true }) || [];

  return (
    <PageTransition>
      <div className="pb-safe">

        {/* ── HERO ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-5 pt-8 pb-10">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0A1628 0%, #0d1f4a 50%, #0A1628 100%)' }} />
          <Orb color="#1B3FAB" size={260} style={{ top: -40, right: -40 }} duration={9} />
          <Orb color="#F5B700" size={180} style={{ bottom: 0, left: -50 }} duration={7} delay={3} />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.5 }}
              className="inline-flex items-center gap-1.5 glass rounded-full px-3 py-1 mb-4"
            >
              <Award size={11} className="text-[#F5B700]" />
              <span className="text-[#F5B700] text-[10px] font-bold uppercase tracking-wider">{t('about.hero_eyebrow')}</span>
            </motion.div>

            <div className="overflow-hidden mb-3">
              <motion.h1
                initial={{ y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-[1.9rem] font-black leading-[1.1] text-white"
              >
                {t('about.hero_title')}
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-white/45 text-[13px] leading-relaxed max-w-[260px] mb-6"
            >
              {t('about.hero_sub')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <Link to="/contact">
                <GoldButton size="md">{t('about.contact_us')} <ArrowRight size={14} /></GoldButton>
              </Link>
              <Link to="/catalog" className="text-white/40 text-xs font-medium hover:text-white/70 transition-colors underline underline-offset-2">
                {t('about.browse_books')} →
              </Link>
            </motion.div>

            {/* Floating ILC logo card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20, rotate: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 3 }}
              transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-4 top-6 glass rounded-2xl px-4 py-3 flex flex-col items-center gap-1"
              style={{ boxShadow: '0 8px 32px rgba(27,63,171,0.3)' }}
            >
              <ILCLogo size="sm" dark={false} />
              <span className="text-white/25 text-[8px] uppercase tracking-widest">Est. 1990</span>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none" style={{ background: 'linear-gradient(to top, #0A1628, transparent)' }} />
        </section>

        {/* ── ANIMATED STATS ────────────────────────────────── */}
        <section className="px-5 pb-8">
          <div className="grid grid-cols-4 gap-2">
            {[
              { num: 35,   suffix: '',    label: t('about.stats_years_label'),   color: '#F5B700' },
              { num: 2000, suffix: '+',   label: t('about.stats_schools_label'), color: '#60A5FA' },
              { num: 5000, suffix: '+',   label: t('about.stats_titles_label'),  color: '#34D399' },
              { num: 50,   suffix: '+',   label: t('about.stats_pub_label'),     color: '#A78BFA' },
            ].map(({ num, suffix, label, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.06, y: -2 }}
                className="glass rounded-2xl p-3 flex flex-col items-center text-center"
              >
                <div className="font-black text-lg leading-none mb-1" style={{ color }}>
                  <LiveCounter to={num} suffix={suffix} />
                </div>
                <div className="text-white/35 text-[8px] leading-tight">{label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── MISSION & VISION ──────────────────────────────── */}
        <section className="px-5 pb-8 relative overflow-hidden">
          <Orb color="#34D399" size={180} style={{ right: -60, top: -20 }} duration={10} delay={1} />
          <div className="space-y-3 relative z-10">
            {[
              { key: 'mission', icon: '🎯', color: '#F5B700', dir: 'left' },
              { key: 'vision',  icon: '🔭', color: '#60A5FA', dir: 'right' },
            ].map(({ key, icon, color, dir }, i) => (
              <Reveal key={key} delay={i * 0.12} dir={dir}>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="glass rounded-2xl p-5 relative overflow-hidden"
                >
                  {/* Shimmer sweep */}
                  <motion.div
                    initial={{ x: '-100%' }}
                    whileInView={{ x: '200%' }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.4, duration: 0.9, ease: 'easeInOut' }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)', zIndex: 0 }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{icon}</span>
                      <h3 className="text-white font-bold text-sm" style={{ color }}>{t(`about.${key}_title`)}</h3>
                    </div>
                    <p className="text-white/50 text-[12px] leading-relaxed">{t(`about.${key}_text`)}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── VALUES ────────────────────────────────────────── */}
        <section className="px-5 pb-8">
          <Reveal>
            <h2 className="text-white font-bold text-base mb-4">{t('about.values_title')}</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-3">
            {VALUES.map(({ icon: Icon, key, color }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass rounded-2xl p-4 relative overflow-hidden"
              >
                <motion.div
                  animate={{ opacity: [0.06, 0.12, 0.06] }}
                  transition={{ duration: 3 + i, repeat: Infinity }}
                  className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${color}, transparent)` }}
                />
                <motion.div
                  initial={{ rotate: -15, scale: 0 }}
                  whileInView={{ rotate: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.09 + 0.25, type: 'spring', stiffness: 300, damping: 14 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 relative z-10"
                  style={{ background: `${color}22` }}
                >
                  <Icon size={17} style={{ color }} />
                </motion.div>
                <div className="text-white font-bold text-xs mb-1 relative z-10">{t(`about.${key}_t`)}</div>
                <div className="text-white/35 text-[10px] leading-relaxed relative z-10">{t(`about.${key}_d`)}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── IH NETWORK BADGE ──────────────────────────────── */}
        <section className="px-5 pb-8">
          <Reveal dir="up">
            <motion.div
              className="relative overflow-hidden rounded-3xl p-5"
              style={{ background: 'linear-gradient(135deg, #1a2a6e, #0d1a4a)' }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div
                animate={{ opacity: [0.1, 0.22, 0.1], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, #60A5FA, transparent)', transform: 'translate(30%, -30%)' }}
              />
              <div className="relative z-10 flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  <Globe size={26} className="text-[#60A5FA]" />
                </motion.div>
                <div>
                  <div className="text-[#60A5FA] text-[10px] font-bold uppercase tracking-wider mb-1">
                    {t('about.network_title')}
                  </div>
                  <div className="text-white font-bold text-sm">International House</div>
                  <div className="text-white/40 text-[11px] mt-0.5">{t('about.network_sub')}</div>
                </div>
              </div>

              {/* Progress bar "since 1995" */}
              <div className="relative z-10 mt-4">
                <div className="flex justify-between text-[9px] text-white/25 mb-1">
                  <span>1995</span><span>2025</span>
                </div>
                <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #60A5FA, #34D399)' }}
                  />
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-1.5 mt-3 text-white/30 text-[10px]">
                <CheckCircle size={11} className="text-[#34D399]" />
                <span>{t('about.network_since')}</span>
                <span className="ml-auto flex items-center gap-1 text-[#60A5FA] font-semibold cursor-pointer hover:opacity-80 transition-opacity">
                  {t('about.network_link')} <ExternalLink size={10} />
                </span>
              </div>
            </motion.div>
          </Reveal>
        </section>

        {/* ── TEAM ──────────────────────────────────────────── */}
        <section className="px-5 pb-8">
          <Reveal>
            <div className="mb-4">
              <h2 className="text-white font-bold text-base">{t('about.team_title')}</h2>
              <p className="text-white/30 text-[10px] mt-0.5">{t('about.team_sub')}</p>
            </div>
          </Reveal>

          <div className="space-y-3">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 3 }}
                className="glass rounded-2xl p-4 flex items-center gap-3"
              >
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  whileInView={{ rotate: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, type: 'spring', stiffness: 250, damping: 15 }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-white text-sm"
                  style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}88)` }}
                >
                  {member.initials}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-sm leading-none">{member.name}</div>
                  <div className="text-white/40 text-[11px] mt-0.5">{member.role}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[#F5B700] text-[11px] font-black">{member.years}</div>
                  <div className="text-white/20 text-[9px]">{t('about.years_at')}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── AWARDS ────────────────────────────────────────── */}
        <section className="px-5 pb-8">
          <Reveal>
            <h2 className="text-white font-bold text-base mb-4">{t('about.awards_title')}</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-3">
            {AWARDS.map((award, i) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, scale: 0.82, rotate: i % 2 === 0 ? -4 : 4 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.04 }}
                className="glass rounded-2xl p-4 relative overflow-hidden"
              >
                {/* Year badge */}
                <div className="absolute top-2 right-2 glass-gold rounded-full px-2 py-0.5 text-[8px] text-[#F5B700] font-black">{award.year}</div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                  className="text-2xl mb-2"
                >
                  {award.icon}
                </motion.div>
                <div className="text-white font-bold text-[11px] leading-tight mb-1">{award.title}</div>
                <div className="text-white/35 text-[9px]">{award.org}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── PUBLISHERS ────────────────────────────────────── */}
        <section className="pb-6">
          <div className="px-5 mb-4">
            <Reveal>
              <h2 className="text-white font-bold text-base">{t('about.publishers_title')}</h2>
              <p className="text-white/30 text-[10px] mt-0.5">{t('about.publishers_sub')}</p>
            </Reveal>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pl-5 pr-5">
            {PUBLISHERS.map((pub, i) => (
              <motion.div
                key={pub.short}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.92 }}
                whileHover={{ y: -6, rotate: -2 }}
                className="flex-shrink-0 w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-default"
                style={{
                  background: `linear-gradient(145deg, ${pub.color}cc, ${pub.color}55)`,
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <span className="text-white font-black text-xl leading-none">{pub.short}</span>
                <div className="h-px w-8 bg-white/15" />
                <span className="text-white/30 text-[8px] text-center leading-tight px-2">{pub.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── HISTORY TIMELINE ──────────────────────────────── */}
        <section className="px-5 pb-8 relative overflow-hidden">
          <Orb color="#A78BFA" size={200} style={{ left: -60, top: '30%' }} duration={11} delay={2} />

          <div className="mb-6 relative z-10">
            <Reveal>
              <div className="inline-flex items-center gap-1.5 glass-gold rounded-full px-3 py-1 mb-3">
                <Sparkles size={11} className="text-[#F5B700]" />
                <span className="text-[#F5B700] text-[10px] font-bold uppercase tracking-wider">{t('about.years_label')}</span>
              </div>
              <h2 className="text-white font-bold text-lg">{t('about.timeline_title')}</h2>
              <p className="text-white/35 text-xs mt-1 leading-relaxed">{t('about.timeline_sub')}</p>
            </Reveal>
          </div>

          <div className="flex justify-center mb-4 relative z-10">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="glass-gold text-[#F5B700] text-xs font-black px-3 py-1 rounded-full tracking-widest"
            >
              {t('about.timeline_label')}
            </motion.span>
          </div>

          <div className="space-y-1 relative z-10">
            {Array.isArray(TIMELINE) && TIMELINE.map((item, i) => (
              <TimelineItem key={item.year} item={item} index={i} isLast={i === TIMELINE.length - 1} color={TL_COLORS[i] || '#F5B700'} />
            ))}
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────── */}
        <section className="px-5 pb-10">
          <Reveal>
            <motion.div
              className="relative overflow-hidden rounded-3xl p-6 text-center"
              style={{ background: 'linear-gradient(135deg, #0d2460 0%, #1a3a8e 50%, #0d2460 100%)' }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <motion.div
                animate={{ scale: [1, 1.35, 1], opacity: [0.12, 0.25, 0.12] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, #F5B700, transparent)' }}
              />
              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-4xl mb-3"
                >
                  🤝
                </motion.div>
                <h3 className="text-white font-black text-lg mb-2">{t('about.cta_title')}</h3>
                <p className="text-white/45 text-xs mb-5 leading-relaxed">{t('about.cta_sub')}</p>
                <Link to="/contact">
                  <GoldButton size="full">
                    <span className="flex items-center justify-center gap-2">
                      <MapPin size={15} /> {t('about.cta_btn')}
                    </span>
                  </GoldButton>
                </Link>
              </div>
            </motion.div>
          </Reveal>
        </section>

      </div>
    </PageTransition>
  );
}
