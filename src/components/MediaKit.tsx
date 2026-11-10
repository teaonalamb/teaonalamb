import React from 'react';
import { motion } from 'motion/react';
import { playRetroClick } from '../audio';

interface MediaKitProps {
  soundEnabled: boolean;
}

const kitCards = [
  {
    file: 'about_me.txt',
    title: 'What I create',
    body: 'Cozy variety streams, thoughtful Tea Talks conversations, short-form social content, and personal writing that invites people into the flock.',
  },
  {
    file: 'collab_formats.exe',
    title: 'Ways to work together',
    list: [
      'Sponsored streams and creator campaigns',
      'Podcast guests and co-hosted conversations',
      'Product, game, and community features',
      'Writing, social, and cross-platform collaborations',
    ],
  },
  {
    file: 'brand_values.ini',
    title: 'The vibe',
    body: 'Warm, candid, playful, and community-first. Every collaboration should feel useful to the audience and true to the Teaonalamb world.',
  },
];

export const MediaKit: React.FC<MediaKitProps> = ({ soundEnabled }) => (
  <div className="max-w-5xl mx-auto px-4 py-8 pb-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="card rounded-xl overflow-hidden border border-[#4974C1] bg-white shadow-[0_5px_0_rgba(9,50,144,0.14)]"
    >
      <div className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-[#000425] via-[#0D1D56] to-[#1c3a8c] text-white">
        <motion.span
          animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.12, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-7 top-5 text-amber-200 text-3xl"
        >
          ✦
        </motion.span>
        <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-pixel text-[#cfe0ff] mb-3">creator_media_kit.pdf</span>
        <h2 className="font-pixel text-2xl sm:text-4xl font-bold">Let&apos;s make something cozy.</h2>
        <p className="max-w-2xl mt-3 text-sm sm:text-base text-[#dfeaff] leading-relaxed">
          Teaonalamb is a multi-platform creator, Twitch streamer, podcast host, and blogger creating welcoming conversations around games, life, and creative community.
        </p>
        <a
          href="/teaonalamb-media-kit-one-sheet.pdf"
          download
          onClick={() => playRetroClick(soundEnabled)}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-amber-300 text-[#0D1D56] font-pixel text-xs font-bold shadow-[0_3px_0_rgba(0,4,37,0.6)] hover:bg-amber-200 transition-colors"
        >
          Download one-sheet PDF ↓
        </a>
      </div>

      <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-5 text-[#33477f]">
        {kitCards.map((card, index) => (
          <motion.section
            key={card.file}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + index * 0.1, duration: 0.35 }}
            whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(9,50,144,0.10)' }}
            className="rounded-lg border border-[#c3d3ee] bg-white p-5"
          >
            <div className="font-pixel text-xs text-[#4974C1] mb-2">{card.file}</div>
            <h3 className="font-semibold text-lg text-[#0D1D56] mb-2">{card.title}</h3>
            {card.body ? (
              <p className="text-sm leading-relaxed">{card.body}</p>
            ) : (
              <ul className="text-sm leading-relaxed space-y-1 list-disc pl-4">
                {card.list?.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </motion.section>
        ))}

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.35 }}
          whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(9,50,144,0.10)' }}
          className="rounded-lg border border-[#c3d3ee] bg-[#eaf1fb] p-5 flex flex-col justify-between"
        >
          <div>
            <div className="font-pixel text-xs text-[#4974C1] mb-2">work_with_me.exe</div>
            <h3 className="font-semibold text-lg text-[#0D1D56] mb-2">Have an idea?</h3>
            <p className="text-sm leading-relaxed">For partnerships, press, guest pitches, or creative collaborations, share your idea and timeline.</p>
          </div>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="mailto:teaonalamb@gmail.com?subject=Collaboration%20with%20Teaonalamb"
            onClick={() => playRetroClick(soundEnabled)}
            className="mt-4 inline-flex justify-center px-4 py-2 rounded-md bg-[#093290] text-white font-pixel text-xs font-bold shadow-[0_2px_0_#000425] hover:bg-[#4974C1] transition-colors"
          >
            Start a conversation ↗
          </motion.a>
        </motion.section>
      </div>
      <p className="px-5 sm:px-7 pb-6 text-xs text-[#5E778C]">This one-sheet is a starter draft. Add audience numbers, campaign results, and press quotes as they become available.</p>
    </motion.div>
  </div>
);
