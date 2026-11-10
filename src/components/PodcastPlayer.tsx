import React, { useEffect, useRef, useState } from 'react';
import { PODCAST_EPISODES, PodcastEpisode } from '../types';
import syncedEpisodes from '../podcast-episodes.json';
import { playRetroClick } from '../audio';

const ALL_EPISODES: PodcastEpisode[] = Array.isArray(syncedEpisodes) && syncedEpisodes.length > 0
  ? (syncedEpisodes as PodcastEpisode[])
  : PODCAST_EPISODES;

interface PodcastPlayerProps {
  soundEnabled: boolean;
  isPlayingMusic: boolean;
  onMusicStateChange: (playing: boolean) => void;
}

export const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ soundEnabled }) => {
  const [selectedEp, setSelectedEp] = useState<PodcastEpisode>(ALL_EPISODES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.load();
    setIsPlaying(false);
    setError('');
  }, [selectedEp]);

  const playEpisode = async () => {
    playRetroClick(soundEnabled);
    const audio = audioRef.current;
    if (!audio || !selectedEp.audioUrl) return;
    try {
      if (audio.paused) await audio.play();
      else audio.pause();
    } catch {
      setError('This episode could not play here. You can still listen on RSS.com.');
    }
  };

  return (
    <div className="card rounded-lg overflow-hidden border border-[#b5c9ea] bg-white shadow-[0_4px_0_rgba(9,50,144,0.12)]">
      <audio ref={audioRef} src={selectedEp.audioUrl} preload="metadata" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => setIsPlaying(false)} onError={() => setError('This episode could not play here. You can still listen on RSS.com.')} />
      <div className="relative p-6 bg-gradient-to-b from-[#000425] via-[#0D1D56] to-[#17327f] text-[#cfe0ff] text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40"><span className="absolute top-3 left-8 text-xs animate-twinkle">✦</span><span className="absolute bottom-4 right-10 text-xs animate-twinkle">★</span></div>
        <div className="relative z-10 flex flex-col items-center">
          <span className="inline-block px-3 py-1 rounded-full bg-[#4974C1]/30 border border-[#4974C1]/60 text-xs font-pixel mb-2">Now steeping</span>
          <h3 className="font-pixel text-xl md:text-2xl text-white font-bold max-w-2xl">{selectedEp.title}</h3>
          <p className="text-xs text-[#cfe0ff]/90 mt-2 max-w-xl">{selectedEp.description}</p>
          <div className="flex items-end justify-center gap-1.5 h-8 my-4">{[1,2,3,4,3,2,1,4,2,3,1,4].map((_, i) => <span key={i} className={isPlaying ? 'w-1.5 rounded-t-sm bg-[#dfeaff] animate-eq-1' : 'w-1.5 h-2 rounded-t-sm bg-[#4974C1]'} style={{ animationDelay: `${i * 0.08}s` }} />)}</div>
          {selectedEp.audioUrl ? <button onClick={playEpisode} className="px-5 py-2 rounded-full font-pixel text-sm font-semibold bg-[#4974C1] text-white hover:bg-[#5870B3] shadow-md">{isPlaying ? '⏸ Pause episode' : '▶ Play episode'}</button> : <a href={selectedEp.url} target="_blank" rel="noopener noreferrer" className="px-5 py-2 rounded-full font-pixel text-sm font-semibold bg-[#4974C1] text-white hover:bg-[#5870B3] shadow-md">Listen on RSS.com ↗</a>}
          {error && <p className="mt-3 text-xs text-amber-200">{error}</p>}
        </div>
      </div>
      <div className="p-5 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-[#c3d3ee]">
          <div><h3 className="font-pixel text-base font-bold text-[#0D1D56]">Tea Talks with Teaonalamb Episode Catalog</h3><p className="text-xs text-[#5E778C]">Episodes are synced from RSS.com. Select one to play it here.</p></div>
          <a href="https://rss.com/podcasts/tea-talks/" target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1 rounded bg-[#093290] text-white font-pixel text-xs font-bold hover:bg-[#4974C1] shrink-0">All episodes on RSS.com ↗</a>
        </div>
        <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">{ALL_EPISODES.map((ep) => {
          const selected = selectedEp.id === ep.id;
          return <button key={ep.id} onClick={() => { playRetroClick(soundEnabled); setSelectedEp(ep); }} className={`w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border transition-all ${selected ? 'border-[#093290] bg-[#eaf1fb]' : 'border-[#c3d3ee]/60 bg-white hover:bg-slate-50'}`}>
            <div className="flex items-center gap-3 min-w-0"><div className={`w-14 h-11 rounded-md flex items-center justify-center font-pixel text-xs font-bold text-white shadow-sm shrink-0 ${selected ? 'bg-[#093290]' : 'bg-[#4974C1]'}`}>{ep.num}</div><div className="min-w-0"><div className="font-semibold text-sm text-[#0D1D56] leading-tight">{ep.title}</div><div className="text-xs text-[#5E778C] mt-1 flex flex-wrap gap-2"><span>{ep.date}</span><span>☁️</span><span>{ep.duration}</span>{ep.isExplicit && <span className="bg-slate-200 text-slate-700 px-1 rounded text-[10px] font-mono">Explicit</span>}</div></div></div>
            <span className="text-xs font-pixel text-[#093290]">{selected ? (ep.audioUrl ? 'Ready to play' : 'Open on RSS.com') : 'Select'}</span>
          </button>;
        })}</div>
      </div>
    </div>
  );
};
