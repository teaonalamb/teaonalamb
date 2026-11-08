import React, { useState } from 'react';
import { motion } from 'motion/react';
import { playRetroClick } from '../audio';

interface TwitchStreamCardProps {
  soundEnabled: boolean;
}

export const TwitchStreamCard: React.FC<TwitchStreamCardProps> = ({ soundEnabled }) => {
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  return (
    <div className="card rounded-lg overflow-hidden border border-[#b5c9ea] bg-white shadow-[0_4px_0_rgba(9,50,144,0.12)] flex flex-col">
      {/* Title bar */}
      <div className="flex justify-between items-center px-3 py-1.5 bg-gradient-to-r from-[#093290] to-[#5870B3] text-white font-pixel text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>stream_player.exe</span>
        </span>
        <span className="text-[11px] text-[#cfe0ff]">Twitch Feed 1080p60</span>
      </div>

      {/* Screen Monitor Area - Flexible height on mobile, aspect-video on larger screens */}
      <div className="relative min-h-[300px] sm:min-h-0 sm:aspect-video bg-gradient-to-b from-[#000425] via-[#0D1D56] to-[#1c3a8c] flex flex-col items-center justify-center text-center pt-13 pb-8 px-4 sm:p-6 sm:pt-11 text-[#cfe0ff] overflow-hidden select-none">
        {/* Animated Scanlines and Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#4974C1_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        {/* Live Radar Beacon Indicator */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1.5 sm:gap-2 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20 z-20">
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-red-500" />
          </span>
          <span className="font-pixel text-[10px] sm:text-[11px] text-white uppercase tracking-wider">
            Live Schedule
          </span>
        </div>

        {/* Toggle monitor mode */}
        <button
          onClick={() => {
            playRetroClick(soundEnabled);
            setIsPlayingTest(!isPlayingTest);
          }}
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 text-[10px] font-pixel bg-white/15 hover:bg-white/25 text-[#cfe0ff] px-2.5 py-1 rounded border border-white/25 transition-colors z-20"
        >
          {isPlayingTest ? 'View Schedule' : 'Cozy Preview'}
        </button>

        {isPlayingTest ? (
          /* Cozy Stream Test Pattern */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center z-10 space-y-1.5 my-auto"
          >
            <div className="relative">
              <img
                src="/sheep-tea.png"
                alt="Teaonalamb mascot"
                className="w-16 sm:w-20 h-auto animate-bob"
              />
              <span className="absolute -top-1 -right-2 text-yellow-300 text-base animate-twinkle">
                ✦
              </span>
            </div>
            <div className="font-pixel text-base sm:text-lg text-white font-bold">
              Starting Soon... Tea Is Brewing!
            </div>
            <div className="text-xs text-[#cfe0ff]/80">
              Chat: &quot;Baaaa! Ready for cozy games and chill vibes&quot;
            </div>
          </motion.div>
        ) : (
          /* Default Schedule Screen */
          <div className="relative z-10 flex flex-col items-center space-y-1.5 sm:space-y-2 max-w-sm my-auto">
            <div className="font-pixel text-xl sm:text-2xl md:text-3xl text-white font-bold tracking-wide drop-shadow-[0_2px_10px_rgba(73,116,193,0.8)] leading-tight">
              Live Monday to Friday
            </div>
            <div className="font-sans-clean text-sm sm:text-base text-[#cfe0ff] font-medium">
              2:00 to 5:00 PM PST
            </div>
            <div className="text-xs text-[#cfe0ff]/80 max-w-xs leading-normal">
              Cozy gaming, deep chats, tea sips, and community flock hangouts.
            </div>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-2.5 sm:mt-3 inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-md bg-[#6441a5] text-white font-semibold text-xs sm:text-sm shadow-[0_3px_0_#000425] hover:bg-[#7d5bbe] transition-colors"
              href="https://twitch.tv/teaonalamb"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playRetroClick(soundEnabled)}
            >
              <span>▶</span>
              <span>Watch on Twitch</span>
            </motion.a>
          </div>
        )}

        {/* Subtitle status bar */}
        <div className="absolute bottom-1.5 left-0 right-0 flex justify-center text-[10px] sm:text-[11px] text-[#cfe0ff]/70 font-pixel pointer-events-none">
          <span>twitch.tv/teaonalamb ★ Official Partner Channel</span>
        </div>
      </div>
    </div>
  );
};
