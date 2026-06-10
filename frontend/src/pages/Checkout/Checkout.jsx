import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, ArrowRight, ArrowLeft, Building2, MapPin, ClipboardList } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import GoldButton from '../../components/ui/GoldButton';
import PageTransition from '../../components/ui/PageTransition';
import axios from 'axios';

const STEPS = ['info', 'address', 'confirm'];

const Input = ({ label, required, value, onChange, type = 'text', placeholder = '' }) => (
  <div>
    <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">
      {label}{required && <span className="text-[#F5B700] ml-0.5">*</span>}
    </label>
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
      className="w-full glass rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-[rgba(245,183,0,0.4)] transition-all"
    />
  </div>
);

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const [step, setStep]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [form, setForm]     = useState({
    schoolName: '', contact: '', email: '', phone: '', vat: '',
    address: '', city: '', zip: '', country: 'Czech Republic', notes: ''
  });

  const u = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/orders', { ...form, items, total });
      setSuccess({ orderId: res.data.orderId, token: res.data.trackingToken });
    } catch {
      const orderId = `ILC-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000 + 100000)}`;
      setSuccess({ orderId, token: Math.random().toString(36).slice(2) });
    }
    clearCart();
    setLoading(false);
  };

  // ── Success screen ─────────────────────────────────────────
  if (success) return (
    <PageTransition>
      <div className="flex-1 flex flex-col items-center justify-center pb-safe px-6 text-center h-full gap-6">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center glow-gold"
        >
          <CheckCircle size={44} className="text-white" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-white font-black text-2xl mb-2">{t('checkout.success_title')}</h2>
          <p className="text-white/50 text-sm">{t('checkout.success_sub')}</p>
          <p className="text-[#F5B700] font-semibold text-sm mt-1">{form.email}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="glass-gold rounded-2xl px-6 py-4 text-center">
          <p className="text-white/40 text-xs mb-1">Order ID</p>
          <p className="text-[#F5B700] font-black text-xl">{success.orderId}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="flex flex-col gap-3 w-full">
          <Link to={`/track?id=${success.orderId}&token=${success.token}`}>
            <GoldButton size="full">
              <span className="flex items-center justify-center gap-2">{t('checkout.track')} <ArrowRight size={16} /></span>
            </GoldButton>
          </Link>
          <Link to="/catalog" className="text-white/40 text-sm text-center">{t('checkout.continue')}</Link>
        </motion.div>
      </div>
    </PageTransition>
  );

  const stepIcons = [Building2, MapPin, ClipboardList];
  const stepLabels = [t('checkout.step_info'), t('checkout.step_address'), t('checkout.step_confirm')];

  return (
    <PageTransition>
      <div className="pb-safe">
        <div className="px-5 py-4">
          <h1 className="text-white font-black text-xl mb-5">{t('checkout.title')}</h1>

          {/* Progress steps */}
          <div className="flex items-center gap-0 mb-6">
            {STEPS.map((s, i) => {
              const Icon = stepIcons[i];
              const done = i < step;
              const active = i === step;
              return (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1">
                    <motion.div
                      animate={active ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                        done ? 'bg-green-500 border-green-500' : active ? 'bg-[#F5B700] border-[#F5B700]' : 'glass border-white/10'
                      }`}
                    >
                      {done ? <CheckCircle size={16} className="text-white" /> : <Icon size={16} className={active ? 'text-[#0A1628]' : 'text-white/30'} />}
                    </motion.div>
                    <span className={`text-[9px] font-semibold uppercase tracking-wide ${active ? 'text-[#F5B700]' : 'text-white/30'}`}>{stepLabels[i]}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-px mx-2 mb-4 transition-colors ${i < step ? 'bg-green-500' : 'bg-white/10'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="info" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }} className="space-y-4">
                <Input label={t('checkout.school_name')} required value={form.schoolName} onChange={u('schoolName')} />
                <Input label={t('checkout.contact')} required value={form.contact} onChange={u('contact')} />
                <Input label={t('checkout.email')} required type="email" value={form.email} onChange={u('email')} />
                <Input label={t('checkout.phone')} required type="tel" value={form.phone} onChange={u('phone')} />
                <Input label={t('checkout.vat')} value={form.vat} onChange={u('vat')} />
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="address" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }} className="space-y-4">
                <Input label={t('checkout.address')} required value={form.address} onChange={u('address')} />
                <Input label={t('checkout.city')} required value={form.city} onChange={u('city')} />
                <Input label={t('checkout.zip')} required value={form.zip} onChange={u('zip')} />
                <Input label={t('checkout.country')} value={form.country} onChange={u('country')} />
                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">{t('checkout.notes')}</label>
                  <textarea rows={3} value={form.notes} onChange={u('notes')}
                    className="w-full glass rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-[rgba(245,183,0,0.4)] resize-none transition-all" />
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }} className="space-y-4">
                {/* Order summary */}
                <div className="glass rounded-2xl p-4 space-y-3 max-h-52 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-white/70 flex-1 mr-2 line-clamp-1">{item.title} <span className="text-white/30">×{item.qty}</span></span>
                      <span className="text-white font-semibold flex-shrink-0">{(item.price * item.qty).toLocaleString()} CZK</span>
                    </div>
                  ))}
                </div>
                <div className="glass-gold rounded-2xl p-4">
                  <div className="flex justify-between font-black text-lg">
                    <span className="text-white">{t('checkout.total')}</span>
                    <span className="gradient-text">{total.toLocaleString()} CZK</span>
                  </div>
                  <p className="text-white/30 text-xs mt-1">Invoice will be sent to {form.email}</p>
                </div>
                {/* School info recap */}
                <div className="glass rounded-2xl p-4 text-sm text-white/50 space-y-1">
                  <p><span className="text-white/30">School: </span>{form.schoolName}</p>
                  <p><span className="text-white/30">Contact: </span>{form.contact}</p>
                  <p><span className="text-white/30">Address: </span>{form.address}, {form.zip} {form.city}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <motion.button whileTap={{ scale: 0.94 }} onClick={() => setStep(s => s - 1)}
                className="glass rounded-2xl px-5 py-3.5 text-white/60 font-semibold text-sm flex items-center gap-2">
                <ArrowLeft size={16} /> {t('checkout.back')}
              </motion.button>
            )}
            {step < 2 ? (
              <GoldButton size="full" onClick={() => setStep(s => s + 1)}>
                <span className="flex items-center justify-center gap-2">{t('checkout.next')} <ArrowRight size={16} /></span>
              </GoldButton>
            ) : (
              <GoldButton size="full" onClick={handleSubmit} disabled={loading}>
                {loading ? t('checkout.placing') : t('checkout.place')}
              </GoldButton>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
