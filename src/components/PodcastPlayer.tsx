import React, { useEffect, useRef, useState } from 'react';
import { PODCAST_EPISODES, PodcastEpisode } from '../types';
import syncedEpisodes from '../podcast-episodes.json';
import { playRetroClick } from '../audio';

const ALL_EPISODES: PodcastEpisode[] =
  Array.isArray(syncedEpisodes) && syncedEpisodes.length > 0
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
      <audio
        ref={audioRef}
        src={selectedEp.audioUrl}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setError('This episode could not play here. You can still listen on RSS.com.')}
      />

      <div className="relative overflow-hidden bg-gradient-to-b from-[#000425] via-[#0D1D56] to-[#17327f] p-5 sm:p-6 text-[#cfe0ff]">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <span className="absolute top-3 left-8 text-xs animate-twinkle">✦</span>
          <span className="absolute bottom-4 right-10 text-xs animate-twinkle">★</span>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-5 items-center">
          {selectedEp.imageUrl ? (
            <img
              src={selectedEp.imageUrl}
              alt={'Artwork for ' + selectedEp.title}
              className="w-36 h-36 mx-auto sm:mx-0 rounded-xl object-cover border-2 border-white/30 shadow-lg"
            />
          ) : (
            <div className="w-36 h-36 mx-auto sm:mx-0 rounded-xl bg-[#4974C1]/50 border-2 border-white/30 flex items-center justify-center text-5xl">☁</div>
          )}

          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#4974C1]/30 border border-[#4974C1]/60 text-xs font-pixel mb-2">Latest episode</span>
            <h3 className="font-pixel text-xl md:text-2xl text-white font-bold">{selectedEp.title}</h3>
            <p className="text-sm text-[#dfeaff] mt-2 leading-relaxed max-w-3xl">{selectedEp.description}</p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4 text-xs text-[#cfe0ff]">
              <span>{selectedEp.date}</span>
              <span>{selectedEp.duration}</span>
              {selectedEp.isExplicit && <span className="bg-white/15 px-2 py-0.5 rounded font-mono">Explicit</span>}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {selectedEp.audioUrl ? (
                <>
                  <button onClick={playEpisode} className="px-5 py-2 rounded-full font-pixel text-sm font-semibold bg-[#4974C1] text-white hover:bg-[#5870B3] shadow-md">
                    {isPlaying ? 'Pause episode' : 'Play episode'}
                  </button>
                  <audio controls src={selectedEp.audioUrl} className="h-9 max-w-full" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => setIsPlaying(false)} />
                </>
              ) : (
                <a href={selectedEp.url} target="_blank" rel="noopener noreferrer" className="px-5 py-2 rounded-full font-pixel text-sm font-semibold bg-[#4974C1] text-white hover:bg-[#5870B3] shadow-md">Listen on RSS.com ↗</a>
              )}
            </div>

            <div className="mt-4 text-xs">
              {selectedEp.transcriptUrl ? (
                <a href={selectedEp.transcriptUrl} target="_blank" rel="noopener noreferrer" className="text-amber-200 underline underline-offset-2 hover:text-white">Read the transcript on RSS.com ↗</a>
              ) : (
                <span className="text-[#cfe0ff]/75">A transcript is not available in this episode&apos;s RSS entry.</span>
              )}
            </div>
            {error && <p className="mt-3 text-xs text-amber-200">{error}</p>}
          </div>
        </div>
      </div>

      <div className="p-5 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-[#c3d3ee]">
          <div>
            <h3 className="font-pixel text-base font-bold text-[#0D1D56]">Tea Talks with Teaonalamb Episode Catalog</h3>
            <p className="text-xs text-[#5E778C]">New episodes are synced from RSS.com. Select one to update the player.</p>
          </div>
          <a href="https://rss.com/podcasts/tea-talks/" target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1 rounded bg-[#093290] text-white font-pixel text-xs font-bold hover:bg-[#4974C1] shrink-0">All episodes on RSS.com ↗</a>
        </div>

        <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
          {ALL_EPISODES.map((ep) => {
            const selected = selectedEp.id === ep.id;
            return (
              <button
                key={ep.id}
                onClick={() => { playRetroClick(soundEnabled); setSelectedEp(ep); }}
                className={`w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border transition-all ${selected ? 'border-[#093290] bg-[#eaf1fb]' : 'border-[#c3d3ee]/60 bg-white hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {ep.imageUrl ? (
                    <img src={ep.imageUrl} alt="" className="w-12 h-12 rounded-md object-cover border border-[#c3d3ee] shrink-0" />
                  ) : (
                    <div className={`w-12 h-12 rounded-md flex items-center justify-center font-pixel text-xs font-bold text-white shadow-sm shrink-0 ${selected ? 'bg-[#093290]' : 'bg-[#4974C1]'}`}>{ep.num}</div>
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-[#0D1D56] leading-tight">{ep.title}</div>
                    <div className="text-xs text-[#5E778C] mt-1 flex flex-wrap gap-2"><span>{ep.date}</span><span>{ep.duration}</span>{ep.transcriptUrl && <span>Transcript</span>}</div>
                  </div>
                </div>
                <span className="text-xs font-pixel text-[#093290]">{selected ? (ep.audioUrl ? 'Ready to play' : 'Open on RSS.com') : 'Select'}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

