import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSheepBaa } from '../audio';

interface MascotSheepProps {
  className?: string;
  size?: number;
  soundEnabled?: boolean;
  outfit?: 'classic' | 'teacup-hat';
}

const CLASSIC_PHRASES = [
  'Baaaa! 🐑',
  'Where is Vivian? 💖',
  'Flock power! ✨',
  'Welcome to the stream! ☁',
  'Cozy vibes only! 🐑',
  'Gaming with the flock! 🎮',
];

const TEACUP_HAT_PHRASES = [
  'Baaaa! Look at my tea hat! 🍵',
  'Careful, do not spill the tea! ☕',
  'Jasmine green tea vibes ✨',
  'Tea talks and lamb naps ☁',
  'Pull up a cloud! 🐑',
  'Balanced and cozy! 🧋',
];

export const MascotSheep: React.FC<MascotSheepProps> = ({
  className = '',
  size = 110,
  soundEnabled = true,
  outfit = 'teacup-hat',
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const phrases = outfit === 'teacup-hat' ? TEACUP_HAT_PHRASES : CLASSIC_PHRASES;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSheepBaa(soundEnabled);
    setClickCount((prev) => prev + 1);
    setShowBubble(true);

    const newHeart = {
      id: Date.now(),
      x: (Math.random() - 0.5) * 44,
      y: -20 - Math.random() * 20,
    };
    setHearts((prev) => [...prev.slice(-4), newHeart]);

    setTimeout(() => {
      setShowBubble(false);
    }, 2400);
  };

  const currentPhrase = phrases[clickCount % phrases.length];
  const mascotImg = outfit === 'teacup-hat' ? '/sheep-tea.png' : '/sheep.png';

  return (
    <div
      className={`relative inline-block select-none cursor-pointer group ${className}`}
      onClick={handleClick}
      title={
        outfit === 'teacup-hat'
          ? 'Click teacup-hat sheep mascot for cozy baaa!'
          : 'Click sheep mascot for cozy baaa!'
      }
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -45, scale: 1 }}
            exit={{ opacity: 0, y: -55, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            className="absolute left-1/2 -translate-x-1/2 -top-2 z-30 pointer-events-none whitespace-nowrap px-3 py-1 bg-white text-[#093290] font-pixel text-xs rounded-lg shadow-md border border-[#4974C1]"
          >
            {currentPhrase}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-[#4974C1] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Heart Particles */}
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.span
            key={h.id}
            initial={{ opacity: 1, y: 0, x: h.x, scale: 0.8 }}
            animate={{ opacity: 0, y: -50, x: h.x * 1.5, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none text-pink-400 text-sm z-20"
          >
            ♥
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Animated Mascot Image (fixed outfit per component, no weird cycling) */}
      <motion.div
        animate={{
          y: [0, -7, 0],
          rotate: [-1, 1.5, -1],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{
          scale: 1.08,
          rotate: [0, -3, 3, 0],
          transition: { duration: 0.3 },
        }}
        whileTap={{
          scale: 0.92,
        }}
        className="transition-transform"
      >
        <img
          src={mascotImg}
          alt={outfit === 'teacup-hat' ? 'Teaonalamb Sheep with Teacup Hat' : 'Teaonalamb Sheep Mascot'}
          style={size ? { width: size, height: 'auto' } : undefined}
          className="w-16 sm:w-20 md:w-28 h-auto drop-shadow-[0_8px_18px_rgba(73,116,193,0.45)] pointer-events-none block object-contain"
          loading="eager"
        />
      </motion.div>
    </div>
  );
};
