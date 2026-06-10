import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, User, Building2, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import GoldButton from '../../components/ui/GoldButton';
import PageTransition from '../../components/ui/PageTransition';

const Field = ({ icon: Icon, label, type = 'text', value, onChange, placeholder = '' }) => {
  const [show, setShow] = useState(false);
  const isPass = type === 'password';
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
      <input
        type={isPass && show ? 'text' : type}
        value={value} onChange={onChange} placeholder={placeholder || label}
        className="w-full glass rounded-2xl pl-11 pr-11 py-4 text-white text-sm placeholder-white/25 outline-none focus:border-[rgba(245,183,0,0.4)] transition-all"
      />
      {isPass && (
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      )}
    </div>
  );
};

export default function Auth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, register, loading } = useAuthStore();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', school: '', email: '', password: '' });
  const [error, setError] = useState('');

  const u = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = mode === 'login'
      ? await login(form.email, form.password)
      : await register(form);
    if (result.success) navigate('/account');
    else setError('Invalid credentials. Try any email and password (6+ chars) for demo.');
  };

  return (
    <PageTransition>
      <div className="min-h-full flex flex-col justify-center pb-safe px-6 py-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#F5B700] to-[#FF9500] flex items-center justify-center mb-3 glow-gold">
            <BookOpen size={28} className="text-[#0A1628]" strokeWidth={2.5} />
          </div>
          <span className="font-black text-white text-2xl tracking-tight">ILC Books</span>
          <p className="text-white/30 text-sm mt-1">
            {mode === 'login' ? t('auth.login') : t('auth.register')}
          </p>
        </motion.div>

        {/* Mode toggle */}
        <div className="glass rounded-2xl p-1 flex mb-6">
          {[['login', t('auth.login')], ['register', t('auth.register')]].map(([m, label]) => (
            <motion.button
              key={m} onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${mode === m ? 'bg-[#F5B700] text-[#0A1628]' : 'text-white/40'}`}
            >
              {label}
            </motion.button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <AnimatePresence>
            {mode === 'register' && (
              <motion.div key="extra-fields"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                className="space-y-3 overflow-hidden"
              >
                <Field icon={User} label={t('auth.name')} value={form.name} onChange={u('name')} />
                <Field icon={Building2} label={t('auth.school')} value={form.school} onChange={u('school')} />
              </motion.div>
            )}
          </AnimatePresence>

          <Field icon={Mail} label={t('auth.email')} type="email" value={form.email} onChange={u('email')} />
          <Field icon={Lock} label={t('auth.password')} type="password" value={form.password} onChange={u('password')} />

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-red-400 text-xs text-center px-2">{error}</motion.p>
          )}

          <div className="pt-2">
            <GoldButton size="full" type="submit" disabled={loading}>
              {loading
                ? (mode === 'login' ? t('auth.signing_in') : t('auth.signing_up'))
                : (mode === 'login' ? t('auth.sign_in') : t('auth.sign_up'))
              }
            </GoldButton>
          </div>

          {mode === 'login' && (
            <p className="text-center text-white/30 text-xs mt-2">
              <button type="button" className="text-[#F5B700]/60 hover:text-[#F5B700] transition-colors">{t('auth.forgot')}</button>
            </p>
          )}
        </form>

        <p className="text-center text-white/30 text-xs mt-6">
          {mode === 'login' ? t('auth.no_account') : t('auth.have_account')}{' '}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-[#F5B700] font-semibold">
            {mode === 'login' ? t('auth.sign_up') : t('auth.sign_in')}
          </button>
        </p>

        <p className="text-center text-white/20 text-[10px] mt-8 px-4">
          💡 Demo: use any email + password (6+ chars) to sign in
        </p>
      </div>
    </PageTransition>
  );
}
