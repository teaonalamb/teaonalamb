import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { BlogPostData } from '../types';
import { playRetroClick, playChime } from '../audio';

interface BlogPostViewProps {
  post: BlogPostData;
  onBack: () => void;
  onSelectNextPost?: (nextPost: BlogPostData) => void;
  nextPost?: BlogPostData;
  soundEnabled: boolean;
}

// Inline Markdown Parser for Blog Posts
function parseInlineMarkdown(text: string): React.ReactNode[] {
  // Regex for links [text](url), bold **text**, italic *text*, and inline code `code`
  const tokens: React.ReactNode[] = [];
  const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('[') && token.includes('](')) {
      const linkText = token.slice(1, token.indexOf(']('));
      const linkUrl = token.slice(token.indexOf('](') + 2, -1);
      tokens.push(
        <a
          key={match.index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#093290] font-bold underline decoration-[#4974C1] hover:text-[#4974C1] transition-colors"
        >
          {linkText}
        </a>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      tokens.push(
        <strong key={match.index} className="font-bold text-[#0D1D56]">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      tokens.push(
        <em key={match.index} className="italic text-[#093290]/90">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      tokens.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded bg-[#eaf1fb] font-mono text-xs text-[#093290]">
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return tokens.length > 0 ? tokens : [text];
}

function renderContent(content: string) {
  // Normalize bullet points so consecutive bullets stay together in one list block
  const normalized = content.replace(/\n\n+(\*|-)\s+/g, '\n$1 ');
  const rawBlocks = normalized.split(/\n\n+/);

  return rawBlocks.map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Horizontal Rule: only the dashed divider
    if (trimmed === '---' || trimmed === '***') {
      return (
        <hr
          key={idx}
          className="my-8 border-t-2 border-dashed border-[#8baedb]"
        />
      );
    }

    // Numbered Heading 2: ## 1. Title or Heading 2: ## Title (no solid border)
    if (trimmed.startsWith('## ')) {
      const headingBody = trimmed.replace(/^##\s+/, '');
      const numberedMatch = headingBody.match(/^(\d+)\.\s*(.*)$/);

      if (numberedMatch) {
        const num = numberedMatch[1];
        const title = numberedMatch[2];
        return (
          <div key={idx} className="mt-8 mb-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center min-w-8 h-8 px-2 rounded-lg bg-[#093290] text-white font-pixel text-sm font-bold shadow-[0_2px_0_#000425] shrink-0">
                #{num}
              </span>
              <h2 className="font-pixel text-xl sm:text-2xl text-[#093290] font-bold tracking-tight">
                {title}
              </h2>
            </div>
          </div>
        );
      }

      return (
        <h2
          key={idx}
          className="font-pixel text-xl sm:text-2xl text-[#093290] font-bold mt-8 mb-4 flex items-center gap-2"
        >
          <span className="text-[#4974C1]">★</span>
          <span>{headingBody}</span>
        </h2>
      );
    }

    // Heading 3: ### Title (no solid border)
    if (trimmed.startsWith('### ')) {
      const title = trimmed.replace(/^###\s+/, '');
      return (
        <h3
          key={idx}
          className="font-pixel text-lg sm:text-xl text-[#093290] font-bold mt-8 mb-3 flex items-center gap-2"
        >
          <span className="text-[#4974C1] text-xs">◆</span>
          <span>{title}</span>
        </h3>
      );
    }

    // Blockquote: > "Quote..."
    if (trimmed.startsWith('>')) {
      const quoteText = trimmed.replace(/^>\s*/, '').replace(/^"|"$/g, '');
      return (
        <blockquote
          key={idx}
          className="p-4 my-5 rounded-r-xl bg-[#eaf1fb] border-l-4 border-[#093290] text-sm sm:text-base italic text-[#24376c] shadow-sm"
        >
          &quot;{parseInlineMarkdown(quoteText)}&quot;
        </blockquote>
      );
    }

    // Dialogue / Interview question note block (lines wrapped in *")
    const rawLines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
    const isQuoteDialogue =
      rawLines.length > 0 &&
      rawLines.every(
        (line) =>
          line.startsWith('*') &&
          line.endsWith('*') &&
          (line.includes('"') || line.includes('“') || line.includes('”'))
      );

    if (isQuoteDialogue) {
      return (
        <div
          key={idx}
          className="my-5 p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#eaf1fb] to-[#f4f7fd] border-2 border-[#b5c9ea] shadow-[0_2px_0_rgba(9,50,144,0.08)] space-y-2.5"
        >
          <div className="font-pixel text-xs text-[#093290] font-bold uppercase tracking-wider flex items-center gap-2 mb-1">
            <span>🎙️</span>
            <span>Dialogue Note</span>
          </div>
          {rawLines.map((line, lIdx) => (
            <div
              key={lIdx}
              className="flex items-start gap-2.5 text-sm sm:text-base text-[#0D1D56] font-medium italic pl-1"
            >
              <span className="text-[#4974C1] shrink-0 mt-0.5 text-xs">☁️</span>
              <span>{parseInlineMarkdown(line)}</span>
            </div>
          ))}
        </div>
      );
    }

    // Render paragraphs and bullet lists with custom star and cloud bullets
    const elements: React.ReactNode[] = [];
    let currentBullets: string[] = [];

    const flushBullets = (keyPrefix: string) => {
      if (currentBullets.length > 0) {
        const bulletsToRender = [...currentBullets];
        currentBullets = [];
        elements.push(
          <ul key={`${keyPrefix}-list`} className="my-3 space-y-2.5 pl-1 list-none">
            {bulletsToRender.map((bullet, bIdx) => (
              <li
                key={bIdx}
                className="flex items-start gap-2.5 text-sm sm:text-base text-[#0D1D56] leading-relaxed"
              >
                <span className="text-[#4974C1] text-sm shrink-0 mt-0.5 font-bold select-none">
                  {bIdx % 2 === 0 ? '★' : '☁️'}
                </span>
                <span>{parseInlineMarkdown(bullet)}</span>
              </li>
            ))}
          </ul>
        );
      }
    };

    rawLines.forEach((line, lIdx) => {
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const bulletText = line.replace(/^[\*\-]\s+/, '');
        currentBullets.push(bulletText);
      } else {
        flushBullets(`${idx}-${lIdx}`);
        elements.push(
          <p key={`${idx}-${lIdx}`} className="text-[#0D1D56] text-base leading-relaxed">
            {parseInlineMarkdown(line)}
          </p>
        );
      }
    });

    flushBullets(`${idx}-end`);

    return (
      <div key={idx} className="space-y-2">
        {elements}
      </div>
    );
  });
}

export const BlogPostView: React.FC<BlogPostViewProps> = ({
  post,
  onBack,
  onSelectNextPost,
  nextPost,
  soundEnabled,
}) => {
  // Scroll to top on post change
  useEffect(() => {
    const el = document.getElementById('window-scroll-container');
    if (el) el.scrollTop = 0;
  }, [post.id]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="max-w-3xl mx-auto"
    >
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            playRetroClick(soundEnabled);
            onBack();
          }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-[#b5c9ea] text-[#093290] font-pixel text-xs font-bold shadow-[0_2px_0_rgba(9,50,144,0.12)] hover:bg-[#eaf1fb] hover:border-[#093290] transition-colors"
        >
          <span>←</span>
          <span>Back to all posts</span>
        </button>

        <span className="font-pixel text-xs text-[#5E778C]">
          teaonalamb.com/blog/{post.slug}
        </span>
      </div>

      {/* Main Post Card Container */}
      <div className="rounded-2xl border-2 border-[#b5c9ea] bg-white overflow-hidden shadow-[0_8px_0_rgba(9,50,144,0.12)]">
        {/* Post Title Banner */}
        <div className="bg-gradient-to-r from-[#093290] via-[#4974C1] to-[#5870B3] p-6 sm:p-8 text-white">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white font-pixel text-xs font-bold uppercase tracking-wider border border-white/30">
              {post.category}
            </span>
            <span className="text-xs text-[#cfe0ff]">
              {post.date} ★ {post.readTime}
            </span>
          </div>

          <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl text-white font-bold leading-tight drop-shadow-[0_2px_8px_rgba(0,4,37,0.5)]">
            {post.title}
          </h1>

          {/* Author Badge */}
          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/20">
            <div className="w-11 h-11 rounded-full bg-white/20 p-1 flex items-center justify-center border border-white/40 shadow-inner overflow-hidden">
              <img
                src="/sheep-tea.png"
                alt="Tea avatar"
                className="w-9 h-9 object-contain"
              />
            </div>
            <div>
              <div className="font-pixel text-sm font-bold text-white leading-none">
                Tea
              </div>
              <div className="text-xs text-[#cfe0ff] mt-0.5">
                Host of Tea Talks &amp; Twitch Streamer (@teaonalamb)
              </div>
            </div>
          </div>
        </div>

        {/* Featured Mascot Accent Bar */}
        <div className="bg-[#eaf1fb] border-b border-[#c3d3ee] p-4 flex items-center justify-center gap-4">
          <img
            src="/sheep-tea.png"
            alt="Teaonalamb mascot illustration"
            className="w-20 h-auto drop-shadow-md animate-bob"
          />
          <div className="text-xs text-[#33477f] font-pixel italic max-w-xs">
            &quot;Teaonalamb: a sheep, a warm cup of tea, and a lifetime of stories.&quot;
          </div>
        </div>

        {/* Full Post Copy (Normal paragraphs without artificial callout box) */}
        <div className="p-6 sm:p-10 space-y-4 text-[#0D1D56] text-base leading-relaxed font-sans-clean">
          {renderContent(post.content)}
        </div>

        {/* Article Footer */}
        <div className="p-6 sm:p-8 bg-[#f5f8fd] border-t border-[#c3d3ee] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-pixel px-2.5 py-1 rounded-md bg-white border border-[#b5c9ea] text-[#33477f]"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playChime(soundEnabled);
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              title="Copy post link"
              className="px-4 py-2 rounded-lg bg-white border border-[#b5c9ea] text-[#093290] font-pixel text-xs font-bold hover:bg-[#eaf1fb] transition-colors"
            >
              Share Post 🔗
            </button>

            <button
              onClick={() => {
                playRetroClick(soundEnabled);
                onBack();
              }}
              className="px-4 py-2 rounded-lg bg-[#093290] text-white font-pixel text-xs font-bold shadow-[0_2px_0_#000425] hover:bg-[#4974C1] transition-colors"
            >
              Back to Blog
            </button>
          </div>
        </div>
      </div>

      {/* Next Article Recommendation */}
      {nextPost && onSelectNextPost && (
        <div className="mt-8 p-6 rounded-xl border border-[#b5c9ea] bg-white shadow-[0_4px_0_rgba(9,50,144,0.1)] flex items-center justify-between gap-4">
          <div>
            <span className="font-pixel text-xs text-[#5E778C] uppercase tracking-wider block mb-1">
              Read Next Article
            </span>
            <h4 className="font-pixel text-base sm:text-lg text-[#0D1D56] font-bold">
              {nextPost.title}
            </h4>
            <p className="text-xs text-[#33477f] mt-1 line-clamp-1">
              {nextPost.excerpt}
            </p>
          </div>

          <button
            onClick={() => {
              playRetroClick(soundEnabled);
              onSelectNextPost(nextPost);
            }}
            className="shrink-0 px-4 py-2 rounded-lg bg-[#4974C1] text-white font-pixel text-xs font-bold hover:bg-[#093290] transition-colors"
          >
            Read Story →
          </button>
        </div>
      )}
    </motion.article>
  );
};
