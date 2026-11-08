import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playRetroClick } from '../audio';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

interface BlogAccordionProps {
  soundEnabled: boolean;
}

export const BlogAccordion: React.FC<BlogAccordionProps> = ({ soundEnabled }) => {
  const [openIds, setOpenIds] = useState<string[]>(['origin-story']);

  const togglePost = (id: string) => {
    playRetroClick(soundEnabled);
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const posts: BlogPost[] = [
    {
      id: 'origin-story',
      title: 'Why I named my channel after a sheep and a teacup',
      date: 'Nov 2, 2026',
      content: (
        <div className="space-y-3.5 text-[#0D1D56] text-sm md:text-base leading-relaxed pt-2">
          <p>
            Plot twist: I can not even take credit for my own name. Let us rewind to 2014 or 2015.
            I honestly can not remember which, it was that long ago.
          </p>
          <p>
            I was 14 or 15 and extremely into school spirit. Our school had a yearly event called Battle of the Classes, or BOTC, or just &quot;Battle.&quot;
            Every year a theme gets picked, then each class votes on a subtheme to use for its performance.
            It was a whole production: choreography, props, costumes, decorations, script writing, acting, all crammed into a few months.
            I did the dance portion my first three years. (I tried for the scripts and acting, but the popular kids always got those roles. High school cliques, ugh.)
          </p>
          <p>
            Every class also designed a custom t-shirt for its subtheme and got them mass printed for the class and parents.
            That year they were jerseys, so you got a name on the back. Mine could be anything, and I had nothing.
            I swear I used to be way more quirky and fun. I have dulled it down a lot. But between school, memorizing choreo, 48 hour all-nighters,
            and dating too many boys, my brain was cooked at 15. I was about to put &quot;Tiana L.&quot; and call it a day.
          </p>
          <p>
            Enter my best friend in the whole wide world, Vivian. It was her first year in the dance portion too, and she already had a good name for her shirt.
            I think it was something like vivianasausages, as in Vienna sausages. Iconic.
            She is so smart and creative, I love her. She took her beautiful brain cells and came up with <b>teaonalamb</b>.
          </p>
          <p>
            My name is Tiana, not Teaona like a lot of people think, and my last name sounds exactly like lamb.
            (I also love eating lamb.) So teaonalamb is basically my full legal name, minus the middle one.
            ABSOLUTE GENIUS. It was literally just my name and my mind was blown. It went on the back of my shirt, stayed on that shirt, and I forgot about it completely.
          </p>
          <p>
            Years go by. In 2020 I go through a horrible, messy breakup. By then I have been friends with a streamer for a few years, and I figure, what if I stream while we game together?
            No plan, no username, nothing. (Not the first time I streamed on my Twitch account either. The first time was when I was 13. Story for another day.)
          </p>
          <p>
            I told Vivian I wanted to try streaming and I was stuck on a name. Somehow my single brain cell dug up that high school shirt, and I had a That is So Raven moment.
            I remembered the name Vivian made and registered it as my Twitch username. That was July 19th, 2020.
          </p>
          <p>
            Because the name is so unique, I got it on EVERYTHING. Every social you can think of, even the non-socials.
            That kicked off my lifetime career as teaonalamb. It is also how &quot;Tea&quot; became my nickname, and why everyone thinks my name is Teaona instead of Tiana.
          </p>
          <p>
            Memory is so weird. I just turned 26, and my memory gets worse every year even though my frontal lobe literally just finished developing.
            Yet I remembered one tiny, irrelevant moment from six years earlier, and it turned into my whole brand and the rest of my life.
          </p>
          <p>
            So, do I like sheep? Sure. They look kinda scary up close, lambs are cute but very loud.
            I love seeing them on farms by the highway, and I really love eating lamb. I am not even a sheep in the Chinese zodiac.
            Tea is more legit. I am Chinese, so I grew up drinking tea when I was sick, with dim sum for breakfast, or whenever I wanted something warm that was not soup.
            In high school I was obsessed with milk tea and spent $5 every school day on a large Thai tea as an after-school reward. No idea how I had that money while jobless.
          </p>
          <p>
            So is there a real reason behind the name? No, and also yes. It is my name, legal or not, and it is extremely special to me because of how special the person who came up with it is to me.
            For the past 6 years, ever since I started putting my time, effort and life into streaming and content creation, I have been Tea. I guess I always will be.
          </p>
        </div>
      ),
    },
    {
      id: 'kickback-podcasting',
      title: 'Why Casual Kickback-Style Podcasting Beats Polished Interviews',
      date: 'Oct 18, 2026',
      content: (
        <div className="space-y-3 text-[#0D1D56] text-sm md:text-base leading-relaxed pt-2">
          <p>
            Let's be real for a second. We've all clicked on a podcast expecting an actual vibe, only to hear someone read off a rigid list of questions like they're conducting a corporate background check.
          </p>
          <p>
            Subjecting a random streamer or a friend to a formal interview creates zero interest. That is exactly why I am so obsessed with the casual, kickback-style format.
          </p>
        </div>
      ),
    },
    {
      id: 'podcast-lessons',
      title: 'What I learned from ten podcast episodes',
      date: 'Oct 1, 2026',
      content: (
        <div className="space-y-3 text-[#0D1D56] text-sm md:text-base leading-relaxed pt-2">
          <p>
            Key lessons about hosting guests, editing audio, keeping a reliable schedule, and having vulnerable real conversations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm">
            <div className="p-2.5 bg-[#eaf1fb] rounded border border-[#b5c9ea]">
              <b>1. Active Listening Wins</b>
              <p className="text-xs text-[#33477f] mt-0.5">The best conversations happen when you throw away the script and follow the guest&apos;s heart.</p>
            </div>
            <div className="p-2.5 bg-[#eaf1fb] rounded border border-[#b5c9ea]">
              <b>2. Sound Quality Matters</b>
              <p className="text-xs text-[#33477f] mt-0.5">Clear audio makes long commutes and cozy listening sessions relaxing.</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {posts.map((post) => {
        const isOpen = openIds.includes(post.id);
        return (
          <div
            key={post.id}
            className="rounded-lg border border-[#b5c9ea] bg-white overflow-hidden shadow-[0_3px_0_rgba(9,50,144,0.1)] transition-all"
          >
            <button
              onClick={() => togglePost(post.id)}
              className={`w-full text-left px-4 py-3.5 flex items-center justify-between gap-4 transition-colors ${
                isOpen ? 'bg-[#e3ecfa]' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <motion.span
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-pixel text-[#4974C1] text-xs shrink-0 select-none"
                >
                  ▶
                </motion.span>
                <span className="font-semibold text-base md:text-lg text-[#0D1D56] truncate">
                  {post.title}
                </span>
              </div>
              <span className="font-pixel text-xs text-[#5E778C] shrink-0">
                {post.date}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden border-t border-[#c3d3ee]/60"
                >
                  <div className="px-5 py-4 bg-white/95">{post.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
