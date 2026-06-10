/**
 * ILC® text logo — styled to match the original block-letter logo.
 * Accepts:
 *   size   — 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 *   dark   — true → navy (for light backgrounds)  false → white (for dark backgrounds)
 *   animate — true → individual letter stagger animation
 */
import { motion } from 'framer-motion';

const SIZES = {
  xs: { letter: 22, reg: 9,  gap: 0   },
  sm: { letter: 28, reg: 11, gap: 0   },
  md: { letter: 36, reg: 13, gap: 0   },
  lg: { letter: 60, reg: 20, gap: 0   },
  xl: { letter: 88, reg: 28, gap: -2  },
};

// Dark navy gradient matching real logo
const DARK_STYLE = {
  background: 'linear-gradient(180deg, #4A6FA5 0%, #2B4470 40%, #1A2F52 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

// White for dark backgrounds
const LIGHT_STYLE = {
  background: 'linear-gradient(180deg, #FFFFFF 0%, #D4E0F5 50%, #AABFDF 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export default function ILCLogo({ size = 'md', dark = false, animate = false }) {
  const { letter, reg } = SIZES[size] || SIZES.md;
  const textStyle = dark ? DARK_STYLE : LIGHT_STYLE;

  const letterVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.7 },
    visible: (i) => ({
      opacity: 1, y: 0, scale: 1,
      transition: { delay: i * 0.14, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const fontStyle = {
    fontFamily: "'Arial Black', 'Arial Bold', 'Helvetica Neue', sans-serif",
    fontWeight: 900,
    fontSize: letter,
    lineHeight: 1,
    letterSpacing: '-1.5px',
    display: 'block',
    ...textStyle,
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'flex-start' }}>
      {'ILC'.split('').map((ch, i) =>
        animate ? (
          <motion.span
            key={ch}
            custom={i}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            style={fontStyle}
          >
            {ch}
          </motion.span>
        ) : (
          <span key={ch} style={fontStyle}>{ch}</span>
        )
      )}
      <motion.span
        {...(animate ? { initial: { opacity: 0, scale: 0 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.55, duration: 0.4, type: 'spring', stiffness: 400 } } : {})}
        style={{
          fontFamily: "'Arial', sans-serif",
          fontWeight: 700,
          fontSize: reg,
          lineHeight: 1,
          marginTop: Math.round(letter * 0.04),
          marginLeft: 2,
          ...textStyle,
        }}
      >
        ®
      </motion.span>
    </div>
  );
}
