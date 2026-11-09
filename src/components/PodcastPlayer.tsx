import React, { useState, useEffect } from 'react';
import { PODCAST_EPISODES, PodcastEpisode } from '../types';
import syncedEpisodes from '../podcast-episodes.json';
import { playRetroClick, toggleLofiLounge } from '../audio';

const ALL_EPISODES: PodcastEpisode[] =
  Array.isArray(syncedEpisodes) && syncedEpisodes.length > 0
    ? (syncedEpisodes as PodcastEpisode[])
    : PODCAST_EPISODES;

interface PodcastPlayerProps {
  soundEnabled: boolean;
  isPlayingMusic: boolean;
  onMusicStateChange: (playing: boolean) => void;
}

export const PodcastPlayer: React.FC<PodcastPlayerProps> = ({
  soundEnabled,
  isPlayingMusic,
  onMusicStateChange,
}) => {
  const [selectedEp, setSelectedEp] = useState<PodcastEpisode>(ALL_EPISODES[0]);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);

  useEffect(() => {
    let interval: number | null = null;
    if (isPlayingMusic) {
      interval = window.setInterval(() => {
        setPlaybackSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingMusic]);

  const togglePlay = () => {
    playRetroClick(soundEnabled);
    toggleLofiLounge((state) => {
      onMusicStateChange(state);
    });
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="card rounded-lg overflow-hidden border border-[#b5c9ea] bg-white shadow-[0_4px_0_rgba(9,50,144,0.12)]">
      {/* Title bar */}
      <div className="flex justify-between items-center px-3 py-1.5 bg-gradient-to-r from-[#093290] to-[#5870B3] text-white font-pixel text-xs">
        <span className="flex items-center gap-1.5">
          <span>🍵</span>
          <span>tea_lounge_radio.exe</span>
        </span>
        <span className="text-[11px] text-[#cfe0ff]">
          {isPlayingMusic ? 'AUDIO SYNTHESIZER: ACTIVE' : 'AUDIO SYNTHESIZER: READY'}
        </span>
      </div>

      {/* Retro visualizer banner */}
      <div className="relative p-6 bg-gradient-to-b from-[#000425] via-[#0D1D56] to-[#17327f] text-[#cfe0ff] text-center overflow-hidden">
        {/* Animated background stars */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <span className="absolute top-3 left-8 text-xs animate-twinkle">✦</span>
          <span className="absolute bottom-4 right-10 text-xs animate-twinkle" style={{ animationDelay: '1.2s' }}>★</span>
          <span className="absolute top-4 right-20 text-[10px] animate-twinkle" style={{ animationDelay: '0.6s' }}>✦</span>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#4974C1]/30 border border-[#4974C1]/60 text-xs font-pixel text-[#cfe0ff] mb-2">
            <span>Cozy Ambient companion</span>
          </div>

          <div className="font-pixel text-xl md:text-2xl text-white font-bold max-w-lg">
            Tea Lounge Lo-Fi Radio
          </div>
          <div className="text-xs text-[#cfe0ff]/90 mt-1 max-w-md">
            Relaxing ambient tea lounge beats synthesized live in your browser. Perfect for reading blog posts and chilling with the stream.
          </div>

          {/* Equalizer Waveform Bars */}
          <div className="flex items-end justify-center gap-1.5 h-10 my-4">
            {[1, 2, 3, 4, 3, 2, 1, 4, 2, 3, 1, 4, 2, 3, 2, 1].map((val, idx) => (
              <div
                key={idx}
                className={`w-1.5 bg-gradient-to-t from-[#4974C1] to-[#dfeaff] rounded-t-sm transition-all duration-300 ${
                  isPlayingMusic
                    ? idx % 4 === 0
                      ? 'animate-eq-1'
                      : idx % 4 === 1
                      ? 'animate-eq-2'
                      : idx % 4 === 2
                      ? 'animate-eq-3'
                      : 'animate-eq-4'
                    : 'h-2 opacity-40'
                }`}
                style={{
                  height: isPlayingMusic ? undefined : `${(val * 4) + 2}px`,
                  animationDelay: `${idx * 0.08}s`,
                }}
              />
            ))}
          </div>

          {/* Player Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
            <button
              onClick={togglePlay}
              className={`px-5 py-2 rounded-full font-pixel text-sm font-semibold flex items-center gap-2 shadow-md transition-all ${
                isPlayingMusic
                  ? 'bg-amber-400 text-[#000425] hover:bg-amber-300'
                  : 'bg-[#4974C1] text-white hover:bg-[#5870B3]'
              }`}
            >
              <span>{isPlayingMusic ? '⏸ Pause Lo-Fi Radio' : '▶ Play Ambient Lo-Fi Beats'}</span>
            </button>

            <span className="font-pixel text-xs text-[#cfe0ff] bg-black/30 px-3 py-1.5 rounded-full border border-white/20">
              {formatTime(playbackSeconds)} (Looping Chords)
            </span>
          </div>
        </div>
      </div>

      {/* Podcast Episode Catalog */}
      <div className="p-5 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-[#c3d3ee]">
          <div>
            <h3 className="font-pixel text-base font-bold text-[#0D1D56]">
              Tea Talks with Teaonalamb Episode Catalog
            </h3>
            <p className="text-xs text-[#5E778C]">
              Click any episode below to listen to the full official recording on RSS.com.
            </p>
          </div>

          <a
            href="https://rss.com/podcasts/tea-talks/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playRetroClick(soundEnabled)}
            className="inline-block px-3 py-1 rounded bg-[#093290] text-white font-pixel text-xs font-bold hover:bg-[#4974C1] transition-colors shrink-0"
          >
            All Episodes on RSS.com ↗
          </a>
        </div>

        <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
          {ALL_EPISODES.map((ep) => {
            const isSelected = selectedEp.id === ep.id;
            return (
              <div
                key={ep.id}
                onClick={() => {
                  playRetroClick(soundEnabled);
                  setSelectedEp(ep);
                }}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#093290] bg-[#eaf1fb]'
                    : 'border-[#c3d3ee]/60 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-14 h-11 rounded-md flex items-center justify-center font-pixel text-xs font-bold text-white shadow-sm shrink-0 ${
                      isSelected ? 'bg-[#093290]' : 'bg-[#4974C1]'
                    }`}
                  >
                    {ep.num}
                  </div>

                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-[#0D1D56] leading-tight truncate">
                      {ep.title}
                    </div>
                    <div className="text-xs text-[#5E778C] mt-1 flex flex-wrap items-center gap-2">
                      <span>{ep.date}</span>
                      <span className="text-[10px] text-[#4974C1]">☁️</span>
                      <span>{ep.duration}</span>
                      {ep.isExplicit && (
                        <span className="bg-slate-200 text-slate-700 px-1 py-0.2 rounded text-[10px] font-mono">
                          Explicit
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <a
                    href={ep.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      playRetroClick(soundEnabled);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#093290] text-white font-pixel text-xs font-bold shadow-[0_2px_0_#000425] hover:bg-[#4974C1] transition-colors"
                  >
                    <span>Listen on RSS.com</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
