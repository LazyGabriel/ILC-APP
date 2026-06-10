import { motion } from 'framer-motion';

export default function GoldButton({ children, onClick, className = '', type = 'button', disabled = false, size = 'md' }) {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    full: 'w-full py-4 text-base',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`
        relative overflow-hidden font-bold rounded-2xl tracking-wide
        bg-gradient-to-r from-[#F5B700] to-[#FFD454]
        text-[#0A1628] glow-gold-sm
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {/* Shimmer sweep on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
        whileHover={{ translateX: '200%' }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
