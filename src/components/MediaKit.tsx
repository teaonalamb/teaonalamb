import React from 'react';
import { playRetroClick } from '../audio';

interface MediaKitProps {
  soundEnabled: boolean;
}

export const MediaKit: React.FC<MediaKitProps> = ({ soundEnabled }) => (
  <div className="max-w-5xl mx-auto px-4 py-8 pb-16">
    <div className="card rounded-xl overflow-hidden border border-[#4974C1] bg-white shadow-[0_5px_0_rgba(9,50,144,0.14)]">
      <div className="p-6 sm:p-8 bg-gradient-to-br from-[#000425] via-[#0D1D56] to-[#1c3a8c] text-white">
        <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-pixel text-[#cfe0ff] mb-3">creator_media_kit.pdf</span>
        <h2 className="font-pixel text-2xl sm:text-4xl font-bold">Let&apos;s make something cozy.</h2>
        <p className="max-w-2xl mt-3 text-sm sm:text-base text-[#dfeaff] leading-relaxed">
          Teaonalamb is a multi-platform creator, Twitch streamer, podcast host, and blogger creating welcoming conversations around games, life, and creative community.
        </p>
      </div>
      <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-5 text-[#33477f]">
        <section className="rounded-lg border border-[#c3d3ee] p-5">
          <div className="font-pixel text-xs text-[#4974C1] mb-2">about_me.txt</div>
          <h3 className="font-semibold text-lg text-[#0D1D56] mb-2">What I create</h3>
          <p className="text-sm leading-relaxed">Cozy variety streams, thoughtful Tea Talks conversations, short-form social content, and personal writing that invites people into the flock.</p>
        </section>
        <section className="rounded-lg border border-[#c3d3ee] p-5">
          <div className="font-pixel text-xs text-[#4974C1] mb-2">collab_formats.exe</div>
          <h3 className="font-semibold text-lg text-[#0D1D56] mb-2">Ways to work together</h3>
          <ul className="text-sm leading-relaxed space-y-1 list-disc pl-4">
            <li>Sponsored streams and creator campaigns</li>
            <li>Podcast guests and co-hosted conversations</li>
            <li>Product, game, and community features</li>
            <li>Writing, social, and cross-platform collaborations</li>
          </ul>
        </section>
        <section className="rounded-lg border border-[#c3d3ee] p-5">
          <div className="font-pixel text-xs text-[#4974C1] mb-2">brand_values.ini</div>
          <h3 className="font-semibold text-lg text-[#0D1D56] mb-2">The vibe</h3>
          <p className="text-sm leading-relaxed">Warm, candid, playful, and community-first. Every collaboration should feel useful to the audience and true to the Teaonalamb world.</p>
        </section>
        <section className="rounded-lg border border-[#c3d3ee] p-5 flex flex-col justify-between">
          <div>
            <div className="font-pixel text-xs text-[#4974C1] mb-2">work_with_me.exe</div>
            <h3 className="font-semibold text-lg text-[#0D1D56] mb-2">Have an idea?</h3>
            <p className="text-sm leading-relaxed">For partnerships, press, guest pitches, or creative collaborations, share your idea and timeline.</p>
          </div>
          <a href="mailto:teaonalamb@gmail.com?subject=Collaboration%20with%20Teaonalamb" onClick={() => playRetroClick(soundEnabled)} className="mt-4 inline-flex justify-center px-4 py-2 rounded-md bg-[#093290] text-white font-pixel text-xs font-bold shadow-[0_2px_0_#000425] hover:bg-[#4974C1] transition-colors">Start a conversation ↗</a>
        </section>
      </div>
      <p className="px-5 sm:px-7 pb-6 text-xs text-[#5E778C]">Audience and platform details are available through the Socials tab; a downloadable one-sheet can be added here when you&apos;re ready.</p>
    </div>
  </div>
);
