import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { BlogPostData } from '../types';
import { playRetroClick } from '../audio';

interface BlogListProps {
  posts: BlogPostData[];
  onSelectPost: (post: BlogPostData) => void;
  soundEnabled: boolean;
}

export const BlogList: React.FC<BlogListProps> = ({ posts, onSelectPost, soundEnabled }) => {
  const [query, setQuery] = useState('');
  const filteredPosts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return posts;
    return posts.filter((post) =>
      [post.title, post.excerpt, post.category, post.tags.join(' '), post.content]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    );
  }, [posts, query]);
  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);
  const openPost = (post: BlogPostData) => { playRetroClick(soundEnabled); onSelectPost(post); };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#000425] via-[#0D1D56] to-[#1c3a8c] p-6 text-white border border-[#4974C1]/40 shadow-[0_4px_16px_rgba(9,50,144,0.15)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 max-w-lg text-center md:text-left">
          <span className="inline-block px-3 py-1 rounded-full bg-[#4974C1]/30 border border-[#4974C1]/60 text-xs font-pixel text-[#cfe0ff] mb-2">Tea&apos;s Cozy Journal</span>
          <h2 className="font-pixel text-2xl sm:text-3xl text-white font-bold leading-tight">Stories, Stream Life &amp; Cozy Musings</h2>
          <p className="text-sm text-[#cfe0ff]/90 mt-2 leading-relaxed">Personal reflections, behind-the-scenes notes, creative thoughts, and cozy life updates. Grab a warm cup of tea and pull up a cloud.</p>
        </div>
        <motion.img src="/sheep-tea.png" alt="Sheep mascot with teacup" className="w-32 h-auto drop-shadow-[0_8px_20px_rgba(73,116,193,0.5)]" animate={{ y: [0, -6, 0], rotate: [-1, 1, -1] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
      </div>

      <div className="rounded-lg border border-[#b5c9ea] bg-white p-4 shadow-[0_3px_0_rgba(9,50,144,0.08)]">
        <label htmlFor="blog-search" className="font-pixel text-xs text-[#093290]">search_journal.exe</label>
        <div className="mt-2 flex gap-2">
          <input id="blog-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search posts, topics, or tags…" className="min-w-0 flex-1 rounded-md border border-[#b5c9ea] px-3 py-2 text-sm text-[#0D1D56] outline-none focus:border-[#4974C1] focus:ring-2 focus:ring-[#4974C1]/20" />
          {query && <button onClick={() => setQuery('')} className="rounded-md bg-[#eaf1fb] px-3 text-xs font-semibold text-[#093290] hover:bg-[#dbe6f8]">Clear</button>}
        </div>
        <p className="mt-2 text-xs text-[#5E778C]">{filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found</p>
      </div>

      {featuredPost && (
        <motion.article whileHover={{ y: -4 }} className="rounded-xl border-2 border-[#4974C1] bg-white overflow-hidden shadow-[0_6px_0_rgba(9,50,144,0.14)]">
          <div className="flex justify-between items-center px-4 py-2 bg-gradient-to-r from-[#093290] via-[#4974C1] to-[#5870B3] text-white font-pixel text-xs"><span>★ {query ? 'BEST MATCH' : 'LATEST POST'}</span><span>{featuredPost.readTime}</span></div>
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-2 mb-2.5"><span className="px-2.5 py-0.5 rounded-full bg-[#eaf1fb] text-[#093290] text-xs font-pixel font-bold">{featuredPost.category}</span><span className="text-xs text-[#5E778C]">{featuredPost.date}</span></div>
            <h3 className="font-pixel text-xl sm:text-2xl text-[#0D1D56] font-bold mb-3 hover:text-[#4974C1] cursor-pointer" onClick={() => openPost(featuredPost)}>{featuredPost.title}</h3>
            <p className="text-sm sm:text-base text-[#33477f] leading-relaxed mb-4">{featuredPost.excerpt}</p>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#c3d3ee]/60"><div className="flex flex-wrap gap-1.5">{featuredPost.tags.map((tag) => <span key={tag} className="text-[11px] font-pixel px-2 py-0.5 rounded bg-slate-100 text-[#5E778C]">#{tag}</span>)}</div><button onClick={() => openPost(featuredPost)} className="px-5 py-2 rounded-lg bg-[#093290] text-white font-pixel text-xs font-bold shadow-[0_3px_0_#000425] hover:bg-[#4974C1]">Read More →</button></div>
          </div>
        </motion.article>
      )}

      {regularPosts.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{regularPosts.map((post) => (
        <motion.article key={post.id} whileHover={{ y: -4 }} className="rounded-xl border border-[#b5c9ea] bg-white overflow-hidden shadow-[0_4px_0_rgba(9,50,144,0.12)] flex flex-col justify-between">
          <div><div className="flex justify-between px-4 py-1.5 bg-[#dbe6f8] text-[#093290] font-pixel text-xs border-b border-[#c3d3ee]"><span>{post.category}</span><span>{post.readTime}</span></div><div className="p-5"><span className="text-xs text-[#5E778C] block mb-1">{post.date}</span><h3 className="font-pixel text-lg text-[#0D1D56] font-bold mb-2.5 hover:text-[#4974C1] cursor-pointer" onClick={() => openPost(post)}>{post.title}</h3><p className="text-xs sm:text-sm text-[#33477f] leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p></div></div>
          <div className="px-5 pb-5 flex items-center justify-between border-t border-[#eaf1fb] pt-3"><div className="flex flex-wrap gap-1">{post.tags.slice(0, 3).map((tag) => <span key={tag} className="text-[10px] font-pixel px-1.5 py-0.5 rounded bg-slate-100 text-[#5E778C]">#{tag}</span>)}</div><button onClick={() => openPost(post)} className="px-3.5 py-1.5 rounded-md bg-[#093290] text-white font-pixel text-xs font-bold hover:bg-[#4974C1]">Read More →</button></div>
        </motion.article>
      ))}</div>}
      {!featuredPost && <div className="rounded-lg border border-dashed border-[#b5c9ea] bg-white p-8 text-center text-sm text-[#5E778C]">No posts matched “{query}”. Try another search.</div>}
    </div>
  );
};
