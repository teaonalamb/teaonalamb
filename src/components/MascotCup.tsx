import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playCupSip } from '../audio';

interface MascotCupProps {
  className?: string;
  size?: number;
  soundEnabled?: boolean;
}

export const MascotCup: React.FC<MascotCupProps> = ({
  className = '',
  size = 90,
  soundEnabled = true,
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  const phrases = [
    '*sip* The tea is hot! 🍵',
    'Thai milk tea craving! 🧋',
    'Dim sum jasmine tea 🥟',
    'Cozy vibes brewing ✨',
    'Season 2 is served! ☕',
  ];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playCupSip(soundEnabled);
    setClickCount((prev) => prev + 1);
    setShowBubble(true);

    const newSparkle = {
      id: Date.now(),
      x: (Math.random() - 0.5) * 36,
      y: -15 - Math.random() * 20,
    };
    setSparkles((prev) => [...prev.slice(-4), newSparkle]);

    setTimeout(() => {
      setShowBubble(false);
    }, 2400);
  };

  const currentPhrase = phrases[clickCount % phrases.length];

  return (
    <div
      className={`relative inline-block select-none cursor-pointer group ${className}`}
      onClick={handleClick}
      title="Click teacup for fresh hot tea!"
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -42, scale: 1 }}
            exit={{ opacity: 0, y: -55, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            className="absolute left-1/2 -translate-x-1/2 -top-2 z-30 pointer-events-none whitespace-nowrap px-3 py-1 bg-white text-[#093290] font-pixel text-xs rounded-lg shadow-md border border-[#4974C1]"
          >
            {currentPhrase}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-[#4974C1] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rising Steam Wisps */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none w-10 h-10 flex justify-center items-end">
        <span className="w-1.5 h-3 bg-white/70 rounded-full blur-[1px] -mr-1 steam-particle-1" />
        <span className="w-2 h-4 bg-white/60 rounded-full blur-[1px] steam-particle-2" />
        <span className="w-1.5 h-3 bg-white/70 rounded-full blur-[1px] -ml-1 steam-particle-3" />
      </div>

      {/* Sparkles on click */}
      <AnimatePresence>
        {sparkles.map((s) => (
          <motion.span
            key={s.id}
            initial={{ opacity: 1, y: 0, x: s.x, scale: 0.7 }}
            animate={{ opacity: 0, y: -45, x: s.x * 1.6, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none text-yellow-300 text-sm z-20"
          >
            ✦
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Animated Teacup Image */}
      <motion.div
        animate={{
          y: [0, 6, 0],
          rotate: [1, -1.5, 1],
        }}
        transition={{
          duration: 4.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{
          scale: 1.08,
          rotate: [0, 4, -4, 0],
          transition: { duration: 0.3 },
        }}
        whileTap={{
          scale: 0.92,
        }}
        className="transition-transform"
      >
        <img
          src="/cup.png"
          alt="Teaonalamb Teacup Mascot"
          style={size ? { width: size, height: 'auto' } : undefined}
          className="w-16 sm:w-20 md:w-26 h-auto drop-shadow-[0_6px_14px_rgba(73,116,193,0.4)] pointer-events-none block"
          loading="eager"
        />
      </motion.div>
    </div>
  );
};
