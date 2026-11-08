import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageTab } from '../types';
import { playRetroClick } from '../audio';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: PageTab) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  soundEnabled,
  onToggleSound,
  isPlayingMusic,
  onToggleMusic,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop click dismisser */}
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-12 left-3 z-50 w-72 bg-[#EAF1FB] rounded-t-lg rounded-br-lg shadow-[0_12px_40px_rgba(0,4,37,0.7)] border-2 border-white overflow-hidden flex flex-col font-sans-clean select-none"
          >
            {/* Start Menu Header / User Identity Stripe */}
            <div className="bg-gradient-to-r from-[#093290] via-[#4974C1] to-[#5870B3] p-3 text-white flex items-center gap-3 border-b border-[#c3d3ee]">
              <div className="w-10 h-10 rounded-full bg-white/20 p-0.5 flex items-center justify-center border border-white/40 shadow-inner overflow-hidden">
                <img
                  src="/sheep-tea.png"
                  alt="Tea mascot"
                  className="w-9 h-9 object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="font-pixel text-base leading-none text-white font-bold">
                  TeaOS 2026
                </div>
                <div className="text-xs text-[#cfe0ff] truncate mt-1">
                  Tea (@teaonalamb)
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2 space-y-1 bg-white/95">
              <button
                onClick={() => {
                  playRetroClick(soundEnabled);
                  onSelectTab('home');
                  onClose();
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-[#c9d9f3] text-[#093290] font-medium text-sm flex items-center gap-2.5 transition-colors"
              >
                <span className="text-[#4974C1] text-base">☁</span>
                <span>Desktop Home</span>
              </button>

              <button
                onClick={() => {
                  playRetroClick(soundEnabled);
                  onSelectTab('twitch');
                  onClose();
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-[#c9d9f3] text-[#093290] font-medium text-sm flex items-center gap-2.5 transition-colors"
              >
                <span className="text-[#6441a5] text-base">▶</span>
                <span>Twitch Stream (2-5 PM PST)</span>
              </button>

              <button
                onClick={() => {
                  playRetroClick(soundEnabled);
                  onSelectTab('podcast');
                  onClose();
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-[#c9d9f3] text-[#093290] font-medium text-sm flex items-center gap-2.5 transition-colors"
              >
                <span className="text-[#093290] text-base">♪</span>
                <span>Tea Talks Podcast</span>
              </button>

              <button
                onClick={() => {
                  playRetroClick(soundEnabled);
                  onSelectTab('blog');
                  onClose();
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-[#c9d9f3] text-[#093290] font-medium text-sm flex items-center gap-2.5 transition-colors"
              >
                <span className="text-[#4974C1] text-base">✎</span>
                <span>Blog &amp; Story Archive</span>
              </button>

              <button
                onClick={() => {
                  playRetroClick(soundEnabled);
                  onSelectTab('socials');
                  onClose();
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-[#c9d9f3] text-[#093290] font-medium text-sm flex items-center gap-2.5 transition-colors"
              >
                <span className="text-[#5870B3] text-base">★</span>
                <span>Socials Hub (@teaonalamb)</span>
              </button>

              <button
                onClick={() => {
                  playRetroClick(soundEnabled);
                  onSelectTab('guestbook');
                  onClose();
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-[#c9d9f3] text-[#093290] font-medium text-sm flex items-center gap-2.5 transition-colors"
              >
                <span className="text-amber-600 text-base">📌</span>
                <span>Community Corkboard</span>
              </button>

              <div className="my-1.5 border-t border-[#c3d3ee]" />

              {/* Music toggle */}
              <button
                onClick={() => {
                  playRetroClick(soundEnabled);
                  onToggleMusic();
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-[#c9d9f3] text-[#093290] font-medium text-sm flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-emerald-600 text-base">🍵</span>
                  <span>Tea Lounge Lo-Fi</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded font-pixel ${isPlayingMusic ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                  {isPlayingMusic ? 'PLAYING' : 'OFF'}
                </span>
              </button>

              {/* Sound effect toggle */}
              <button
                onClick={() => {
                  playRetroClick(true);
                  onToggleSound();
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-[#c9d9f3] text-[#093290] font-medium text-sm flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[#4974C1] text-base">🔊</span>
                  <span>Retro Sound Effects</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded font-pixel ${soundEnabled ? 'bg-blue-100 text-[#093290]' : 'bg-gray-100 text-gray-500'}`}>
                  {soundEnabled ? 'ON' : 'MUTED'}
                </span>
              </button>
            </div>

            {/* Bottom status footer */}
            <div className="p-2.5 bg-[#dbe6f8] border-t border-[#c3d3ee] flex items-center justify-between text-xs text-[#33477f]">
              <a
                href="https://streamelements.com/teaonalamb/tip"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline font-semibold flex items-center gap-1"
                onClick={() => playRetroClick(soundEnabled)}
              >
                <span>♥</span>
                <span>Send a tip</span>
              </a>
              <span className="font-pixel text-[11px] text-[#5E778C]">Build 2026.11</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
