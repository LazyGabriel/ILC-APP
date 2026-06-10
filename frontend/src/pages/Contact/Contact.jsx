import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  MapPin, Phone, Mail, Clock, ChevronDown,
  Send, CheckCircle, MessageSquare, BookOpen, Building2,
  Package, Search, FileText,
} from 'lucide-react';
import GoldButton from '../../components/ui/GoldButton';
import PageTransition from '../../components/ui/PageTransition';

// ── Helpers ───────────────────────────────────────────────────

function Orb({ color = '#1B3FAB', size = 200, style = {}, duration = 8, delay = 0 }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.18, 1], opacity: [0.07, 0.14, 0.07] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, background: `radial-gradient(circle, ${color}, transparent 70%)`, ...style }}
    />
  );
}

function Reveal({ children, delay = 0, dir = 'up', className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const from = dir === 'up' ? { y: 28, opacity: 0 } : dir === 'left' ? { x: -28, opacity: 0 } : { x: 28, opacity: 0 };
  return (
    <motion.div ref={ref} initial={from} animate={inView ? { y: 0, x: 0, opacity: 1 } : from}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

// ── FAQ item ──────────────────────────────────────────────────
function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="text-white font-semibold text-xs pr-4 leading-snug">{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={16} className="text-white/30" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-4 pb-4 text-white/45 text-[11px] leading-relaxed border-t border-white/5 pt-3">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function Contact() {
  const { t }  = useTranslation();
  const [form, setForm]     = useState({ name: '', school: '', email: '', message: '' });
  const [sent, setSent]     = useState(false);
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1400));
    setSending(false);
    setSent(true);
  };

  const FAQS  = t('contact.faqs', { returnObjects: true }) || [];
  const QUICK = [
    { icon: MessageSquare, labelKey: 'contact.order_inquiry',   color: '#F5B700' },
    { icon: BookOpen,      labelKey: 'contact.catalog_request', color: '#60A5FA' },
    { icon: Building2,     labelKey: 'contact.school_account',  color: '#34D399' },
  ];

  const STEPS = [
    { icon: Search,   num: '01', titleKey: 'contact.step1_title', descKey: 'contact.step1_desc', color: '#F5B700' },
    { icon: FileText, num: '02', titleKey: 'contact.step2_title', descKey: 'contact.step2_desc', color: '#60A5FA' },
    { icon: Package,  num: '03', titleKey: 'contact.step3_title', descKey: 'contact.step3_desc', color: '#34D399' },
  ];

  return (
    <PageTransition>
      <div className="pb-safe">

        {/* ── HERO ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-5 pt-8 pb-10">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0A1628 0%, #0a1f3a 50%, #0A1628 100%)' }} />
          <Orb color="#34D399" size={220} style={{ top: -40, right: -30 }} duration={8} />
          <Orb color="#1B3FAB" size={160} style={{ bottom: 10, left: -40 }} duration={10} delay={2} />
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
              <motion.span
                animate={{ scale: [1, 1.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-[#34D399]"
              />
              <span className="text-[#34D399] text-[10px] font-bold uppercase tracking-wider">{t('contact.hero_eyebrow')}</span>
            </motion.div>

            <div className="overflow-hidden mb-3">
              <motion.h1
                initial={{ y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-[1.9rem] font-black leading-[1.1] text-white"
              >
                {t('contact.hero_title')}
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-white/45 text-[13px] leading-relaxed max-w-[260px]"
            >
              {t('contact.hero_sub')}
            </motion.p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none" style={{ background: 'linear-gradient(to top, #0A1628, transparent)' }} />
        </section>

        {/* ── STAT PILLS ────────────────────────────────────── */}
        <section className="px-5 pb-6">
          <div className="flex gap-2">
            {[
              { val: t('contact.stat1_val'), unit: t('contact.stat1_unit'), label: t('contact.stat1_label'), color: '#34D399' },
              { val: t('contact.stat2_val'), unit: '',                      label: t('contact.stat2_label'), color: '#60A5FA' },
              { val: t('contact.stat3_val'), unit: t('contact.stat3_unit'), label: t('contact.stat3_label'), color: '#F5B700' },
            ].map(({ val, unit, label, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.09, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 glass rounded-2xl p-3 text-center"
              >
                <div className="font-black text-base leading-none mb-0.5" style={{ color }}>
                  {val}{unit && <span className="text-xs font-semibold"> {unit}</span>}
                </div>
                <div className="text-white/30 text-[8px] leading-tight">{label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────── */}
        <section className="px-5 pb-8 relative overflow-hidden">
          <Orb color="#A78BFA" size={160} style={{ right: -40, top: 0 }} duration={9} delay={1} />
          <Reveal className="mb-4 relative z-10">
            <h2 className="text-white font-bold text-base">{t('contact.steps_title')}</h2>
          </Reveal>
          <div className="space-y-3 relative z-10">
            {STEPS.map(({ icon: Icon, num, titleKey, descKey, color }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 4 }}
                className="glass rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden"
              >
                {/* Step number background */}
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-[40px] leading-none pointer-events-none select-none"
                  style={{ color: `${color}08` }}
                >
                  {num}
                </div>
                <motion.div
                  whileInView={{ scale: [0.5, 1.15, 1] }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}1a` }}
                >
                  <Icon size={20} style={{ color }} />
                </motion.div>
                <div className="flex-1 min-w-0 relative z-10">
                  <div className="text-white font-bold text-sm">{t(titleKey)}</div>
                  <div className="text-white/40 text-[11px] mt-0.5">{t(descKey)}</div>
                </div>
                {/* Connector arrow between steps */}
                {i < STEPS.length - 1 && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-white/10 text-lg z-20 select-none">↓</div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── QUICK TOPICS ──────────────────────────────────── */}
        <section className="px-5 pb-6">
          <p className="text-white/30 text-[10px] uppercase tracking-wider font-semibold mb-3">{t('contact.quick_label')}</p>
          <div className="flex gap-2">
            {QUICK.map(({ icon: Icon, labelKey, color }) => (
              <motion.button
                key={labelKey}
                whileTap={{ scale: 0.91 }}
                whileHover={{ y: -3, scale: 1.03 }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 glass rounded-xl py-3 px-2 flex flex-col items-center gap-1.5 relative overflow-hidden"
                onClick={() => setForm(f => ({ ...f, message: t(labelKey) + ' — ' }))}
              >
                <motion.div
                  animate={{ opacity: [0.05, 0.1, 0.05] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{ background: `radial-gradient(circle at center, ${color}33, transparent 70%)` }}
                />
                <motion.div whileHover={{ rotate: 15 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <Icon size={17} style={{ color }} />
                </motion.div>
                <span className="text-white/55 text-[9px] font-semibold text-center leading-tight relative z-10">{t(labelKey)}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* ── CONTACT INFO ──────────────────────────────────── */}
        <section className="px-5 pb-6">
          <div className="space-y-3">
            <motion.a
              href="https://maps.google.com/?q=Řípská+1304/15a,+Brno"
              target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.97 }} whileHover={{ x: 4 }}
              className="glass rounded-2xl p-4 flex items-center gap-3 block"
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(245,183,0,0.12)' }}
              >
                <MapPin size={18} className="text-[#F5B700]" />
              </motion.div>
              <div>
                <div className="text-white/35 text-[10px] font-semibold uppercase tracking-wider mb-0.5">{t('contact.address_title')}</div>
                <div className="text-white font-semibold text-sm">{t('contact.address')}</div>
                <div className="text-white/40 text-[11px]">{t('contact.country')}</div>
              </div>
            </motion.a>

            <div className="grid grid-cols-2 gap-3">
              <motion.a href="tel:+420545215669"
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.05, duration: 0.4 }}
                whileTap={{ scale: 0.95 }} whileHover={{ y: -3 }}
                className="glass rounded-2xl p-4 flex flex-col gap-2"
              >
                <motion.div
                  whileHover={{ rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 0.4 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(96,165,250,0.12)' }}
                >
                  <Phone size={16} className="text-[#60A5FA]" />
                </motion.div>
                <div>
                  <div className="text-white/35 text-[9px] font-semibold uppercase tracking-wider">{t('contact.phone_title')}</div>
                  <div className="text-white font-semibold text-xs mt-0.5">+420 545 215 669</div>
                </div>
              </motion.a>

              <motion.a href="mailto:shop@ilc.cz"
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.4 }}
                whileTap={{ scale: 0.95 }} whileHover={{ y: -3 }}
                className="glass rounded-2xl p-4 flex flex-col gap-2"
              >
                <motion.div
                  whileHover={{ rotate: -10 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(52,211,153,0.12)' }}
                >
                  <Mail size={16} className="text-[#34D399]" />
                </motion.div>
                <div>
                  <div className="text-white/35 text-[9px] font-semibold uppercase tracking-wider">{t('contact.email_title')}</div>
                  <div className="text-white font-semibold text-[11px] mt-0.5 break-all">shop@ilc.cz</div>
                </div>
              </motion.a>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4 }}
              className="glass rounded-2xl p-4 flex items-center gap-3"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(167,139,250,0.12)' }}
              >
                <Clock size={18} className="text-[#A78BFA]" />
              </motion.div>
              <div>
                <div className="text-white/35 text-[10px] font-semibold uppercase tracking-wider mb-0.5">{t('contact.hours_title')}</div>
                <div className="text-white font-semibold text-sm">{t('contact.hours')}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <motion.span
                    animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-[#34D399]"
                  />
                  <span className="text-[#34D399] text-[10px] font-semibold">{t('contact.hours_status')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── MAP VISUAL ────────────────────────────────────── */}
        <section className="px-5 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55 }}
            className="relative overflow-hidden rounded-2xl"
            style={{ height: 160, background: 'linear-gradient(135deg, #0d2460, #1a3a8e)' }}
          >
            {/* Dot grid */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '14px 14px',
            }} />
            {/* Radial pulse from Brno HQ */}
            <motion.div
              animate={{ scale: [1, 2.2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
              className="absolute rounded-full bg-[#F5B700] pointer-events-none"
              style={{ width: 12, height: 12, left: 'calc(38% - 6px)', top: 'calc(35% - 6px)' }}
            />
            {/* Pins */}
            {[
              { x: '38%', y: '35%', label: t('contact.brno_label'), color: '#F5B700', size: 4, delay: 0   },
              { x: '58%', y: '42%', label: 'Bratislava',            color: '#60A5FA', size: 3, delay: 0.8 },
              { x: '26%', y: '25%', label: '',                      color: '#34D399', size: 2.5, delay: 1.5 },
              { x: '47%', y: '58%', label: '',                      color: '#A78BFA', size: 2, delay: 0.4 },
              { x: '70%', y: '30%', label: '',                      color: '#F5B700', size: 1.5, delay: 1.2 },
            ].map((pin, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: pin.delay + 0.2, type: 'spring', stiffness: 300 }}
                animate={{ y: [0, -4, 0] }}
                className="absolute"
                style={{ left: pin.x, top: pin.y }}
              >
                <div className="relative">
                  <div className="rounded-full flex items-center justify-center"
                    style={{ width: pin.size * 4, height: pin.size * 4, background: pin.color, boxShadow: `0 0 8px ${pin.color}88` }}
                  >
                    <div className="w-1 h-1 rounded-full bg-[#0A1628]" />
                  </div>
                  {pin.label && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-bold" style={{ color: pin.color }}>
                      {pin.label}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            <div className="absolute bottom-3 left-4 text-white/25 text-[10px] font-semibold">{t('contact.map_label')}</div>
            <div className="absolute bottom-3 right-4 text-white/15 text-[9px]">{t('contact.map_sub')}</div>
          </motion.div>
        </section>

        {/* ── CONTACT FORM ──────────────────────────────────── */}
        <section className="px-5 pb-8">
          <Reveal>
            <div className="glass rounded-3xl p-5">
              <h2 className="text-white font-bold text-base mb-5">{t('contact.form_title')}</h2>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="text-center py-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: 'rgba(52,211,153,0.15)', border: '2px solid rgba(52,211,153,0.4)' }}
                    >
                      <CheckCircle size={30} className="text-[#34D399]" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-white font-bold text-sm mb-1">{t('contact.form_success')}</p>
                      <p className="text-white/35 text-xs">{t('contact.form_success_sub')}</p>
                      <button
                        onClick={() => { setSent(false); setForm({ name: '', school: '', email: '', message: '' }); }}
                        className="mt-4 text-[#F5B700] text-xs font-semibold underline underline-offset-2"
                      >
                        {t('contact.form_send_another')}
                      </button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSend} className="space-y-3">
                    {[
                      { key: 'name',   label: t('contact.form_name'),   type: 'text',  required: true  },
                      { key: 'school', label: t('contact.form_school'), type: 'text',  required: false },
                      { key: 'email',  label: t('contact.form_email'),  type: 'email', required: true  },
                    ].map(({ key, label, type, required }) => (
                      <motion.div
                        key={key}
                        animate={focused === key ? { scale: 1.01 } : { scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <label className="text-white/35 text-[10px] font-semibold uppercase tracking-wider block mb-1">
                          {label} {required && <span className="text-[#F5B700]">*</span>}
                        </label>
                        <input
                          type={type}
                          value={form[key]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          required={required}
                          className="w-full rounded-xl px-3.5 py-2.5 text-white text-sm outline-none transition-all"
                          style={{
                            background: focused === key ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.06)',
                            border: focused === key ? '1px solid rgba(245,183,0,0.5)' : '1px solid rgba(255,255,255,0.1)',
                          }}
                          onFocus={() => setFocused(key)}
                          onBlur={() => setFocused(null)}
                        />
                      </motion.div>
                    ))}
                    <motion.div
                      animate={focused === 'message' ? { scale: 1.01 } : { scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <label className="text-white/35 text-[10px] font-semibold uppercase tracking-wider block mb-1">
                        {t('contact.form_message')} <span className="text-[#F5B700]">*</span>
                      </label>
                      <textarea
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        required rows={4}
                        className="w-full rounded-xl px-3.5 py-2.5 text-white text-sm outline-none resize-none transition-all"
                        style={{
                          background: focused === 'message' ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.06)',
                          border: focused === 'message' ? '1px solid rgba(245,183,0,0.5)' : '1px solid rgba(255,255,255,0.1)',
                        }}
                        onFocus={() => setFocused('message')}
                        onBlur={() => setFocused(null)}
                      />
                    </motion.div>
                    <GoldButton size="full" disabled={sending}>
                      <span className="flex items-center justify-center gap-2">
                        {sending ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-[#0A1628]/40 border-t-[#0A1628] rounded-full"
                            />
                            {t('contact.form_sending')}
                          </>
                        ) : (
                          <><Send size={14} /> {t('contact.form_send')}</>
                        )}
                      </span>
                    </GoldButton>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </section>

        {/* ── FAQ ───────────────────────────────────────────── */}
        <section className="px-5 pb-10">
          <Reveal className="mb-4">
            <h2 className="text-white font-bold text-base">{t('contact.faq_title')}</h2>
          </Reveal>
          <div className="space-y-2">
            {Array.isArray(FAQS) && FAQS.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} index={i} />
            ))}
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
