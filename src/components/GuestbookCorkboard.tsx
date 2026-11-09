import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GuestbookNote, DEFAULT_GUESTBOOK_NOTES } from '../types';
import { playRetroClick, playChime } from '../audio';

interface GuestbookCorkboardProps {
  soundEnabled: boolean;
}

const STORAGE_KEY = 'teaonalamb_guestbook_notes';

const STICKER_ICONS: Record<GuestbookNote['sticker'], string> = {
  tea: '🍵',
  sheep: '🐑',
  star: '⭐',
  cloud: '☁️',
  heart: '💖',
  boba: '🧋',
};

const COLOR_STYLES: Record<
  GuestbookNote['color'],
  { bg: string; border: string; shadow: string; pin: string; text: string }
> = {
  yellow: {
    bg: 'bg-[#fffde7]',
    border: 'border-[#fef08a]',
    shadow: 'shadow-[0_6px_0_rgba(161,98,7,0.18)]',
    pin: 'bg-rose-500',
    text: 'text-[#543b0c]',
  },
  pink: {
    bg: 'bg-[#fff0f6]',
    border: 'border-[#fbcfe8]',
    shadow: 'shadow-[0_6px_0_rgba(190,24,93,0.18)]',
    pin: 'bg-amber-500',
    text: 'text-[#651a3d]',
  },
  mint: {
    bg: 'bg-[#f0fdf4]',
    border: 'border-[#bbf7d0]',
    shadow: 'shadow-[0_6px_0_rgba(21,128,61,0.18)]',
    pin: 'bg-sky-500',
    text: 'text-[#14532d]',
  },
  blue: {
    bg: 'bg-[#f0f9ff]',
    border: 'border-[#bae6fd]',
    shadow: 'shadow-[0_6px_0_rgba(3,105,161,0.18)]',
    pin: 'bg-emerald-500',
    text: 'text-[#0c4a6e]',
  },
  lavender: {
    bg: 'bg-[#fbf7ff]',
    border: 'border-[#ddd6fe]',
    shadow: 'shadow-[0_6px_0_rgba(109,40,217,0.18)]',
    pin: 'bg-pink-500',
    text: 'text-[#4c1d95]',
  },
};

export const GuestbookCorkboard: React.FC<GuestbookCorkboardProps> = ({
  soundEnabled,
}) => {
  const [notes, setNotes] = useState<GuestbookNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: GuestbookNote[] = JSON.parse(saved);
        const cleaned = parsed.filter(
          (n) => !['note-1', 'note-2', 'note-3', 'note-4', 'note-5'].includes(n.id)
        );
        return cleaned.length > 0 ? cleaned : DEFAULT_GUESTBOOK_NOTES;
      }
    } catch (e) {
      console.error('Failed to read notes from storage', e);
    }
    return DEFAULT_GUESTBOOK_NOTES;
  });

  const [filterSticker, setFilterSticker] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [selectedColor, setSelectedColor] =
    useState<GuestbookNote['color']>('yellow');
  const [selectedSticker, setSelectedSticker] =
    useState<GuestbookNote['sticker']>('tea');

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes to storage', e);
    }
  }, [notes]);

  const handleLike = (id: string) => {
    playChime(soundEnabled);
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, likes: note.likes + 1 } : note
      )
    );
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    playRetroClick(soundEnabled);
    const newNote: GuestbookNote = {
      id: `user-${Date.now()}`,
      author: author.trim() || 'Cozy Visitor',
      message: message.trim(),
      date: 'Just now',
      color: selectedColor,
      sticker: selectedSticker,
      likes: 1,
      rotation: Math.floor(Math.random() * 6) - 3,
    };

    setNotes((prev) => [newNote, ...prev]);
    setMessage('');
    setAuthor('');
    setIsFormOpen(false);
  };

  const filteredNotes =
    filterSticker === 'all'
      ? notes
      : notes.filter((n) => n.sticker === filterSticker);

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#eaf1fb] via-white to-[#f5f8fd] border-2 border-[#b5c9ea] shadow-[0_4px_0_rgba(9,50,144,0.08)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📌</span>
            <h2 className="font-pixel text-xl sm:text-2xl text-[#093290] font-bold">
              Tea&apos;s Community Corkboard
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#33477f] font-sans-clean mt-1">
            Leave a cozy note, shoutout, or sticker for Tea and fellow stream lurkers!
          </p>
        </div>

        <button
          onClick={() => {
            playRetroClick(soundEnabled);
            setIsFormOpen(!isFormOpen);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#093290] text-white font-pixel text-xs sm:text-sm font-bold shadow-[0_3px_0_#000425] hover:bg-[#4974C1] active:translate-y-0.5 transition-all shrink-0 cursor-pointer"
        >
          <span>{isFormOpen ? '✕ Close Form' : '✏️ Pin a Sticky Note'}</span>
        </button>
      </div>

      {/* Pin a Note Modal Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleAddNote}
              className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-[#093290] shadow-[0_6px_0_rgba(9,50,144,0.15)] space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#eaf1fb] pb-3">
                <span className="font-pixel text-sm font-bold text-[#093290] flex items-center gap-2">
                  <span>📝</span> Write Your Sticky Note
                </span>
                <span className="text-xs text-[#5E778C] font-pixel">
                  TeaOS Corkboard v1.0
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-pixel font-bold text-[#0D1D56] mb-1">
                    Your Name or Handle:
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. CozyViewer / @yourname"
                    maxLength={30}
                    className="w-full px-3 py-2 rounded-lg border border-[#b5c9ea] bg-[#f9fbff] text-sm text-[#0D1D56] focus:outline-none focus:border-[#093290] font-sans-clean"
                  />
                </div>

                <div>
                  <label className="block text-xs font-pixel font-bold text-[#0D1D56] mb-1">
                    Choose Sticker:
                  </label>
                  <div className="flex items-center gap-2">
                    {(['tea', 'sheep', 'star', 'cloud', 'heart', 'boba'] as const).map(
                      (stk) => (
                        <button
                          key={stk}
                          type="button"
                          onClick={() => {
                            playRetroClick(soundEnabled);
                            setSelectedSticker(stk);
                          }}
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center text-lg transition-all cursor-pointer ${
                            selectedSticker === stk
                              ? 'border-[#093290] bg-[#eaf1fb] scale-110 shadow-sm'
                              : 'border-[#b5c9ea]/60 bg-white hover:bg-slate-50'
                          }`}
                        >
                          {STICKER_ICONS[stk]}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-pixel font-bold text-[#0D1D56] mb-1">
                  Sticky Note Message:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Say hello, share your favorite tea flavor, or cheer on the next podcast recording..."
                  rows={3}
                  maxLength={180}
                  required
                  className="w-full p-3 rounded-lg border border-[#b5c9ea] bg-[#f9fbff] text-sm text-[#0D1D56] focus:outline-none focus:border-[#093290] font-sans-clean resize-none"
                />
                <div className="flex justify-between items-center text-[11px] text-[#5E778C] mt-1 font-pixel">
                  <span>Keep it cozy and friendly ★</span>
                  <span>{message.length} / 180</span>
                </div>
              </div>

              {/* Note Color Picker */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-pixel font-bold text-[#0D1D56]">
                    Note Color:
                  </span>
                  {(['yellow', 'pink', 'mint', 'blue', 'lavender'] as const).map(
                    (col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => {
                          playRetroClick(soundEnabled);
                          setSelectedColor(col);
                        }}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                          COLOR_STYLES[col].bg
                        } ${
                          selectedColor === col
                            ? 'border-[#093290] scale-125 shadow-md'
                            : 'border-black/20 hover:scale-110'
                        }`}
                        title={col}
                      />
                    )
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#093290] disabled:bg-slate-300 text-white font-pixel text-xs font-bold shadow-[0_3px_0_#000425] hover:bg-[#4974C1] transition-all cursor-pointer"
                >
                  Pin to Board 📌
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-pixel">
        <span className="text-[#5E778C] mr-1 hidden sm:inline">Filter:</span>
        <button
          onClick={() => {
            playRetroClick(soundEnabled);
            setFilterSticker('all');
          }}
          className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
            filterSticker === 'all'
              ? 'bg-[#093290] text-white border-[#093290] font-bold shadow-sm'
              : 'bg-white text-[#33477f] border-[#b5c9ea] hover:bg-[#eaf1fb]'
          }`}
        >
          All Notes ({notes.length})
        </button>
        {(['tea', 'sheep', 'star', 'cloud', 'heart', 'boba'] as const).map(
          (stk) => {
            const count = notes.filter((n) => n.sticker === stk).length;
            return (
              <button
                key={stk}
                onClick={() => {
                  playRetroClick(soundEnabled);
                  setFilterSticker(stk);
                }}
                className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors cursor-pointer ${
                  filterSticker === stk
                    ? 'bg-[#093290] text-white border-[#093290] font-bold shadow-sm'
                    : 'bg-white text-[#33477f] border-[#b5c9ea] hover:bg-[#eaf1fb]'
                }`}
              >
                <span>{STICKER_ICONS[stk]}</span>
                <span>{count}</span>
              </button>
            );
          }
        )}
      </div>

      {/* Corkboard Container */}
      <div className="p-4 sm:p-7 rounded-2xl bg-[#eedbc1] border-4 border-[#b89569] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12),0_8px_0_rgba(9,50,144,0.1)] relative overflow-hidden min-h-[420px]">
        {/* Subtle Cork Texture Grain Overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(#8d6232 1px, transparent 1px), radial-gradient(#6d471d 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 8px 8px',
          }}
        />

        {/* Sticky Notes Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <AnimatePresence>
            {filteredNotes.map((note) => {
              const style = COLOR_STYLES[note.color] || COLOR_STYLES.yellow;
              const rot = note.rotation || 0;

              return (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  style={{ transform: `rotate(${rot}deg)` }}
                  className={`relative p-5 rounded-xl border-2 ${style.border} ${style.bg} ${style.shadow} flex flex-col justify-between transition-transform hover:scale-[1.03] hover:z-20 hover:rotate-0`}
                >
                  {/* Pushpin Graphic */}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <div
                      className={`w-4 h-4 rounded-full ${style.pin} shadow-[0_2px_4px_rgba(0,0,0,0.3)] border-2 border-white ring-1 ring-black/20`}
                    />
                  </div>

                  {/* Top Bar: Sticker + Author */}
                  <div className="flex items-start justify-between gap-2 pt-1 mb-2">
                    <div className="font-pixel text-xs font-bold text-[#0D1D56] truncate">
                      {note.author}
                    </div>
                    <span
                      className="text-xl shrink-0 select-none animate-bounce"
                      style={{ animationDuration: '3s' }}
                    >
                      {STICKER_ICONS[note.sticker]}
                    </span>
                  </div>

                  {/* Note Body */}
                  <p
                    className={`text-sm font-sans-clean leading-relaxed my-2 ${style.text} whitespace-pre-wrap`}
                  >
                    {note.message}
                  </p>

                  {/* Bottom Meta & Heart Button */}
                  <div className="flex items-center justify-between text-xs pt-3 mt-1 border-t border-black/5 font-pixel">
                    <span className="text-[11px] text-[#5E778C]/90">
                      {note.date}
                    </span>

                    <button
                      onClick={() => handleLike(note.id)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/70 hover:bg-white text-rose-600 border border-black/10 text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <span>❤️</span>
                      <span className="font-bold">{note.likes}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-16 relative z-10 text-[#543b0c]">
            <span className="text-4xl block mb-2">📌</span>
            <p className="font-pixel text-base font-bold">No notes with this sticker yet!</p>
            <p className="text-xs font-sans-clean mt-1">Be the first to pin one on the corkboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};
