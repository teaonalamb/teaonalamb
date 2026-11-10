import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageTab, SOCIALS_DATA, BlogPostData } from './types';
import { BLOG_POSTS } from './blog';
import { MascotSheep } from './components/MascotSheep';
import { MascotCup } from './components/MascotCup';
import { StartMenu } from './components/StartMenu';
import { PodcastPlayer } from './components/PodcastPlayer';
import { TwitchStreamCard } from './components/TwitchStreamCard';
import { BlogList } from './components/BlogList';
import { BlogPostView } from './components/BlogPostView';
import { CounterNumber } from './components/CounterNumber';
import { GuestbookCorkboard } from './components/GuestbookCorkboard';
import { DeskHotspotTour } from './components/DeskHotspotTour';
import { MerchShelf } from './components/MerchShelf';
import { MediaKit } from './components/MediaKit';
import { playRetroClick, playChime, toggleLofiLounge } from './audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<PageTab>('home');
  const [selectedPost, setSelectedPost] = useState<BlogPostData | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync URL hash with active tab and blog post routing
  useEffect(() => {
    const handleHash = () => {
      const rawHash = window.location.hash.replace('#', '');
      const parts = rawHash.split('/');
      const tab = parts[0] as PageTab;
      const validTabs: PageTab[] = [
        'home',
        'socials',
        'blog',
        'twitch',
        'podcast',
        'guestbook',
        'merch',
        'media-kit',
      ];

      if (validTabs.includes(tab)) {
        setActiveTab(tab);
        if (tab === 'blog' && parts[1]) {
          const found = BLOG_POSTS.find(
            (p) => p.slug === parts[1] || p.id === parts[1]
          );
          if (found) {
            setSelectedPost(found);
            document.title = `Teaonalamb | ${found.title}`;
            return;
          }
        }
        if (tab === 'blog' && !parts[1]) {
          setSelectedPost(null);
        }
        document.title = `Teaonalamb | ${tab.charAt(0).toUpperCase() + tab.slice(1)}`;
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Update URL hash when tab changes
  const switchTab = (tab: PageTab) => {
    playRetroClick(soundEnabled);
    setActiveTab(tab);
    if (tab !== 'blog') {
      setSelectedPost(null);
      window.location.hash = tab === 'home' ? '' : tab;
    } else {
      window.location.hash = selectedPost ? `blog/${selectedPost.slug}` : 'blog';
    }
    document.title = `Teaonalamb | ${tab.charAt(0).toUpperCase() + tab.slice(1)}`;
    const pageEl = document.getElementById('window-scroll-container');
    if (pageEl) pageEl.scrollTop = 0;
  };

  // Dedicated Blog Post Navigation
  const handleSelectPost = (post: BlogPostData) => {
    setSelectedPost(post);
    window.location.hash = `blog/${post.slug}`;
    document.title = `Teaonalamb | ${post.title}`;
    const pageEl = document.getElementById('window-scroll-container');
    if (pageEl) pageEl.scrollTop = 0;
  };

  const handleBackToBlogList = () => {
    setSelectedPost(null);
    window.location.hash = 'blog';
    document.title = 'Teaonalamb | Blog';
    const pageEl = document.getElementById('window-scroll-container');
    if (pageEl) pageEl.scrollTop = 0;
  };

  // Browser Address Bar Back button action
  const handleBrowserBack = () => {
    playRetroClick(soundEnabled);
    if (activeTab === 'blog' && selectedPost) {
      handleBackToBlogList();
    } else if (activeTab !== 'home') {
      switchTab('home');
    }
  };

  // Clock in taskbar
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMinimize = () => {
    playRetroClick(soundEnabled);
    setIsMinimized(true);
    setToastMessage('Window minimized to taskbar. Click teaonalamb.com below to restore!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMaximize = () => {
    playRetroClick(soundEnabled);
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    playRetroClick(soundEnabled);
    setIsMinimized(true);
    setToastMessage('Tea never closes! Window minimized to taskbar.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRestore = () => {
    playChime(soundEnabled);
    setIsMinimized(false);
  };

  const toggleMusicState = () => {
    toggleLofiLounge((state) => {
      setIsPlayingMusic(state);
    });
  };

  // Compute address bar text
  const currentAddressText = () => {
    if (activeTab === 'home') return 'teaonalamb.com/';
    if (activeTab === 'blog') {
      return selectedPost
        ? `teaonalamb.com/blog/${selectedPost.slug}`
        : 'teaonalamb.com/blog';
    }
    return `teaonalamb.com/${activeTab}`;
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none flex flex-col font-sans-clean">
      {/* Sky Background */}
      <div className="sky-bg">
        {/* Shooting Star */}
        <div className="absolute -top-10 left-10 w-28 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent animate-shooting-star pointer-events-none" />

        {/* Drifting Clouds */}
        <div className="cloud-shape w-[65vw] h-[240px] -bottom-10 -left-[14vw] animate-drift-a" />
        <div className="cloud-shape w-[55vw] h-[220px] bottom-6 -right-[12vw] animate-drift-b" />
        <div className="cloud-shape w-[50vw] h-[200px] -bottom-20 left-[26vw] animate-drift-c" />
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#0D1D56]/95 backdrop-blur-md text-[#dfeaff] border border-white/30 rounded-full font-pixel text-xs shadow-xl flex items-center gap-2"
          >
            <span>☁</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OS Desk Workspace */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col p-2 sm:p-3 md:p-4 pb-0">
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                transition: { type: 'spring', damping: 25, stiffness: 300 },
              }}
              exit={{
                scale: 0.6,
                opacity: 0,
                y: 400,
                transition: { duration: 0.25 },
              }}
              className={`flex-1 min-h-0 w-full mx-auto flex flex-col rounded-t-xl bg-[#EAF1FB]/95 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.6),0_20px_60px_rgba(0,4,37,0.7)] overflow-hidden transition-all duration-300 ${
                isMaximized ? 'max-w-none' : 'max-w-6xl'
              }`}
            >
              {/* Retro OS Window Title Bar with Controls (Always visible in upper right) */}
              <div className="flex items-center justify-between px-2.5 py-1 bg-gradient-to-r from-[#093290] via-[#4974C1] to-[#5870B3] text-white text-[11px] font-pixel select-none border-b border-[#000425]/30">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-amber-300">☁</span>
                  <span className="font-bold truncate text-[11px] sm:text-xs">teaonalamb.com ☁️ TeaOS</span>
                </div>

                {/* Upper Right Window Controls: Minimize, Maximize, Exit + Audio */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Music indicator quick button */}
                  <button
                    onClick={() => {
                      playRetroClick(soundEnabled);
                      toggleMusicState();
                    }}
                    title={isPlayingMusic ? 'Pause Lo-Fi Radio' : 'Play Lo-Fi Radio'}
                    className={`w-6 h-5 flex items-center justify-center rounded text-[11px] transition-colors ${
                      isPlayingMusic
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'hover:bg-white/20 text-white'
                    }`}
                  >
                    <span>🍵</span>
                  </button>

                  {/* Sound FX quick button */}
                  <button
                    onClick={() => {
                      playRetroClick(true);
                      setSoundEnabled(!soundEnabled);
                    }}
                    title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
                    className="w-6 h-5 flex items-center justify-center rounded hover:bg-white/20 text-white text-[11px] transition-colors"
                  >
                    <span>{soundEnabled ? '🔊' : '🔇'}</span>
                  </button>

                  <div className="w-[1px] h-3.5 bg-white/40 mx-0.5" />

                  {/* Minimize button */}
                  <button
                    onClick={handleMinimize}
                    title="Minimize window"
                    className="w-6 h-5 flex items-center justify-center rounded bg-white/10 hover:bg-white/25 text-white text-[10px] transition-colors font-mono font-bold leading-none"
                  >
                    _
                  </button>

                  {/* Maximize button */}
                  <button
                    onClick={handleMaximize}
                    title={isMaximized ? 'Restore window size' : 'Maximize window'}
                    className="w-6 h-5 flex items-center justify-center rounded bg-white/10 hover:bg-white/25 text-white text-[10px] transition-colors leading-none"
                  >
                    {isMaximized ? '❐' : '□'}
                  </button>

                  {/* Close button */}
                  <button
                    onClick={handleClose}
                    title="Close"
                    className="w-6 h-5 flex items-center justify-center rounded bg-[#c42b1c] hover:bg-red-700 text-white text-[10px] transition-colors font-mono font-bold leading-none"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Window Strip: Full-Width 7 Tabs */}
              <div className="flex items-end px-1 sm:px-2 pt-1 sm:pt-1.5 bg-gradient-to-b from-[#c9d9f3] to-[#b3c8ec] border-b border-[#a6bfdf]">
                <div
                  className="grid grid-cols-8 items-end gap-0.5 sm:gap-1 w-full"
                  role="tablist"
                  aria-label="Site pages"
                >
                  {[
                    { id: 'home', label: 'Home', shortLabel: 'Home', icon: '☁' },
                    { id: 'socials', label: 'Socials', shortLabel: 'Links', icon: '★' },
                    { id: 'blog', label: 'Blog', shortLabel: 'Blog', icon: '✎' },
                    { id: 'twitch', label: 'Twitch', shortLabel: 'Twitch', icon: '▶' },
                    { id: 'podcast', label: 'Podcast', shortLabel: 'Pod', icon: '♪' },
                    { id: 'guestbook', label: 'Guestbook', shortLabel: 'Notes', icon: '✉' },
                    { id: 'merch', label: 'Shop', shortLabel: 'Shop', icon: '♡' },
                    { id: 'media-kit', label: 'Media Kit', shortLabel: 'Kit', icon: '✦' },
                  ].map((tab) => {
                    const isSelected = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => switchTab(tab.id as PageTab)}
                        className={`relative z-10 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 px-0.5 sm:px-2 py-1.5 sm:py-2 rounded-t-lg transition-colors text-center ${
                          isSelected
                            ? 'text-[#0D1D56] font-bold'
                            : 'text-[#33477f] hover:bg-white/40'
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="activeTabIndicator"
                            transition={{ type: 'spring', damping: 30, stiffness: 450 }}
                            className="absolute inset-0 bg-[#EAF1FB] rounded-t-lg -z-10 shadow-sm"
                          />
                        )}
                        <span className="text-[#4974C1] text-xs sm:text-sm">{tab.icon}</span>
                        <span className="text-[9px] sm:text-xs md:text-sm truncate w-full sm:w-auto leading-tight">
                          <span className="sm:hidden">{tab.shortLabel}</span>
                          <span className="hidden sm:inline">{tab.label}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Browser Address Bar */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#EAF1FB] border-b border-[#c3d3ee]">
                <button
                  onClick={handleBrowserBack}
                  title="Back"
                  className="text-[#5E778C] hover:text-[#093290] transition-colors text-sm px-1 font-bold"
                >
                  ←
                </button>
                <button
                  onClick={() => switchTab('podcast')}
                  title="Forward to Podcast"
                  className="text-[#5E778C] hover:text-[#093290] transition-colors text-sm px-1 font-bold"
                >
                  →
                </button>
                <button
                  onClick={() => playChime(soundEnabled)}
                  title="Refresh desk"
                  className="text-[#5E778C] hover:text-[#093290] hover:rotate-180 transition-all duration-300 text-sm px-1"
                >
                  ↻
                </button>

                {/* Animated URL Bar */}
                <div className="flex-1 min-w-0 flex items-center px-3 py-1 rounded-full bg-white border border-[#c3d3ee] shadow-inner text-xs sm:text-sm text-[#33477f] font-mono">
                  <span className="text-[#4974C1] mr-1.5 font-sans-clean font-bold">🔒</span>
                  <span className="truncate">{currentAddressText()}</span>
                </div>

                <button
                  onClick={() => playChime(soundEnabled)}
                  title="Bookmark Teaonalamb"
                  className="text-amber-400 hover:scale-125 transition-transform text-sm px-1"
                >
                  ★
                </button>
              </div>

              {/* Page Body Scrollable View */}
              <main
                id="window-scroll-container"
                className="flex-1 min-h-0 overflow-y-auto page-cloud-bg"
              >
                <AnimatePresence mode="wait">
                  {/* HOME TAB */}
                  {activeTab === 'home' && (
                    <motion.div
                      key="home"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Hero Section */}
                      <div className="relative bg-gradient-to-b from-[#000425] via-[#0D1D56] to-[#1c3a8c] text-white overflow-hidden text-center pt-8 pb-14 px-4">
                        {/* Twinkling star decorations */}
                        <span className="absolute left-[10%] top-[18%] text-amber-300 text-xl animate-twinkle">
                          ★
                        </span>
                        <span
                          className="absolute right-[12%] top-[14%] text-amber-300 text-2xl animate-twinkle"
                          style={{ animationDelay: '1s' }}
                        >
                          ★
                        </span>
                        <span
                          className="absolute left-[24%] top-[62%] text-amber-200 text-sm animate-twinkle"
                          style={{ animationDelay: '2s' }}
                        >
                          ✦
                        </span>
                        <span
                          className="absolute right-[22%] top-[58%] text-amber-200 text-base animate-twinkle"
                          style={{ animationDelay: '0.5s' }}
                        >
                          ✦
                        </span>

                        {/* Bottom cloud curve on hero */}
                        <div className="absolute -bottom-16 -left-[10%] -right-[10%] h-32 rounded-[50%] bg-[radial-gradient(closest-side,rgba(200,220,255,0.8),rgba(160,190,240,0.3)_70%,transparent)] blur-[10px] pointer-events-none" />

                        {/* Hero Mascot and Logo Row */}
                        <div className="relative z-10 flex flex-wrap md:flex-nowrap items-end justify-center gap-2 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
                          {/* Left: Mascot Sheep */}
                          <div className="order-2 md:order-1 flex justify-center shrink-0">
                            <MascotSheep soundEnabled={soundEnabled} outfit="teacup-hat" />
                          </div>

                          {/* Center: Bouncing Logo and Tagline - Dominant size on mobile */}
                          <div className="order-1 md:order-2 w-full basis-full md:basis-auto md:flex-1 flex flex-col items-center px-2">
                            <motion.img
                              src="/logo.png"
                              alt="Teaonalamb logo"
                              className="w-[88vw] max-w-[360px] sm:max-w-[460px] md:max-w-[560px] h-auto drop-shadow-[0_0_26px_rgba(120,160,255,0.55)] cursor-pointer"
                              animate={{ y: [0, -8, 0] }}
                              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => playChime(soundEnabled)}
                            />

                            <p className="mt-2.5 text-[#cfe0ff] text-xs sm:text-base md:text-lg font-light max-w-md mx-auto leading-relaxed">
                              Streamer and host of Tea Talks. Pull up a cloud, the tea is hot.
                            </p>
                          </div>

                          {/* Right: Mascot Teacup */}
                          <div className="order-3 flex justify-center shrink-0">
                            <MascotCup soundEnabled={soundEnabled} />
                          </div>
                        </div>
                      </div>

                      {/* Scalloped Porcelain Border */}
                      <div className="porcelain-bar" />

                      {/* Home Body Content */}
                      <div className="max-w-4xl mx-auto px-4 py-8 pb-16">
                        <motion.section
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, ease: 'easeOut' }}
                          className="mb-8"
                        >
                          <div className="card rounded-xl overflow-hidden border border-[#b5c9ea] bg-white shadow-[0_4px_0_rgba(9,50,144,0.12)]">
                            <div className="px-4 py-2 bg-gradient-to-r from-[#093290] to-[#5870B3] text-white font-pixel text-xs">welcome_to_teaos.txt</div>
                            <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-[auto_1.4fr_0.8fr] gap-5 items-center">
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ delay: 0.12, type: 'spring', stiffness: 180, damping: 16 }}
                                whileHover={{ y: -4, rotate: 1 }}
                                className="mx-auto md:mx-0"
                              >
                                <img
                                  src="/assets/teaonalamb-intro-portrait.png"
                                  alt="Teaonalamb"
                                  className="h-52 w-40 rounded-2xl object-contain bg-[#EAF1FB] border-4 border-white shadow-[0_5px_0_rgba(9,50,144,0.16)]"
                                />
                              </motion.div>
                              <div>
                                <p className="font-pixel text-xs text-[#4974C1] mb-2">START HERE</p>
                                <h2 className="font-pixel text-2xl text-[#0D1D56] font-bold">Hi, I&apos;m Teaonalamb.</h2>
                                <p className="mt-3 text-sm leading-relaxed text-[#33477f]">I&apos;m a multi-platform content creator, Twitch streamer, podcaster, and blogger making a cozy corner for games, honest conversations, and everyday creative life. Whether you&apos;re here to hang out, listen in, or read along, there&apos;s always a warm cup waiting.</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                  <button onClick={() => switchTab('twitch')} className="px-3 py-2 rounded bg-[#6441a5] text-white font-pixel text-xs font-bold hover:brightness-110">Watch live</button>
                                  <button onClick={() => switchTab('podcast')} className="px-3 py-2 rounded bg-[#093290] text-white font-pixel text-xs font-bold hover:bg-[#4974C1]">Listen to Tea Talks</button>
                                  <button onClick={() => switchTab('blog')} className="px-3 py-2 rounded bg-[#eaf1fb] text-[#093290] font-pixel text-xs font-bold hover:bg-[#dbe6f8]">Read the journal</button>
                                </div>
                              </div>
                              <button onClick={() => switchTab('media-kit')} className="rounded-lg border border-[#c3d3ee] bg-[#eaf1fb] p-5 text-left hover:bg-[#dbe6f8] transition-colors">
                                <p className="font-pixel text-xs text-[#4974C1]">FOR PARTNERS &amp; COLLABS</p>
                                <p className="mt-2 font-semibold text-[#0D1D56]">Open the creator media kit →</p>
                                <p className="mt-1 text-xs leading-relaxed text-[#5E778C]">Brand work, podcast guests, press, and creative partnerships.</p>
                              </button>
                            </div>
                          </div>
                        </motion.section>

                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-pixel text-xl sm:text-2xl text-[#093290] font-bold">
                            Find me everywhere
                          </span>
                        </div>
                        <p className="text-[#33477f] text-sm mb-6">
                          Follower counts across my channels. Pick a tab above to dig in.
                        </p>

                        {/* Top 3 Social Follower Stat Cards with Counter Animation */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                          {SOCIALS_DATA.slice(0, 3).map((item, idx) => (
                            <motion.div
                              key={item.platform}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1, duration: 0.3 }}
                              whileHover={{ y: -4 }}
                              className="card rounded-lg overflow-hidden border border-[#b5c9ea] bg-white shadow-[0_4px_0_rgba(9,50,144,0.12)] card-cloud-corner"
                            >
                              <div className="flex justify-between items-center px-3 py-1.5 bg-gradient-to-r from-[#093290] to-[#5870B3] text-white font-pixel text-xs">
                                <span>{item.filename}</span>
                                <span>●</span>
                              </div>
                              <div className="p-4">
                                <div className="font-pixel text-3xl sm:text-4xl text-[#093290] font-bold leading-none">
                                  <CounterNumber
                                    value={item.count}
                                    numericTarget={item.numericCount}
                                  />
                                </div>
                                <div className="text-xs text-[#5E778C] mt-1">
                                  {item.label} on {item.platform}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Quick Action Navigation Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <motion.div
                            whileHover={{ y: -4 }}
                            className="card rounded-lg overflow-hidden border border-[#b5c9ea] bg-white shadow-[0_4px_0_rgba(9,50,144,0.12)]"
                          >
                            <div className="px-3 py-1.5 bg-gradient-to-r from-[#093290] to-[#5870B3] text-white font-pixel text-xs">
                              latest_post.txt
                            </div>
                            <div className="p-4 flex flex-col justify-between h-[calc(100%-28px)]">
                              <div>
                                <h3 className="font-semibold text-base text-[#0D1D56] mb-1">
                                  Newest on the blog
                                </h3>
                                <p className="text-xs text-[#5E778C] leading-relaxed">
                                  {BLOG_POSTS[0] ? BLOG_POSTS[0].title : 'New posts coming soon.'}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedPost(BLOG_POSTS[0]);
                                  switchTab('blog');
                                }}
                                className="mt-4 inline-block text-center px-4 py-1.5 rounded-md bg-[#093290] text-white font-semibold text-xs shadow-[0_3px_0_#000425] hover:bg-[#4974C1] transition-colors"
                              >
                                Read the blog
                              </button>
                            </div>
                          </motion.div>

                          <motion.div
                            whileHover={{ y: -4 }}
                            className="card rounded-lg overflow-hidden border border-[#b5c9ea] bg-white shadow-[0_4px_0_rgba(9,50,144,0.12)]"
                          >
                            <div className="px-3 py-1.5 bg-gradient-to-r from-[#093290] to-[#5870B3] text-white font-pixel text-xs">
                              stream.exe
                            </div>
                            <div className="p-4 flex flex-col justify-between h-[calc(100%-28px)]">
                              <div>
                                <h3 className="font-semibold text-base text-[#0D1D56] mb-1">
                                  Next stream
                                </h3>
                                <p className="text-xs text-[#5E778C] leading-relaxed">
                                  Live Monday to Friday, 2:00 to 5:00 PM PST on Twitch.
                                </p>
                              </div>
                              <button
                                onClick={() => switchTab('twitch')}
                                className="mt-4 inline-block text-center px-4 py-1.5 rounded-md bg-[#6441a5] text-white font-semibold text-xs shadow-[0_3px_0_#000425] hover:bg-[#7d5bbe] transition-colors"
                              >
                                Open Twitch page
                              </button>
                            </div>
                          </motion.div>

                          <motion.div
                            whileHover={{ y: -4 }}
                            className="card rounded-lg overflow-hidden border border-[#b5c9ea] bg-white shadow-[0_4px_0_rgba(9,50,144,0.12)]"
                          >
                            <div className="px-3 py-1.5 bg-gradient-to-r from-[#093290] to-[#5870B3] text-white font-pixel text-xs">
                              podcast.mp3
                            </div>
                            <div className="p-4 flex flex-col justify-between h-[calc(100%-28px)]">
                              <div>
                                <h3 className="font-semibold text-base text-[#0D1D56] mb-1">
                                  Tea Talks, S2 E1
                                </h3>
                                <p className="text-xs text-[#5E778C] leading-relaxed">
                                  Mental Health and Self Discovery, ft. GodofPixelz.
                                </p>
                              </div>
                              <button
                                onClick={() => switchTab('podcast')}
                                className="mt-4 inline-block text-center px-4 py-1.5 rounded-md bg-[#093290] text-white font-semibold text-xs shadow-[0_3px_0_#000425] hover:bg-[#4974C1] transition-colors"
                              >
                                Listen now
                              </button>
                            </div>
                          </motion.div>

                          <motion.div
                            whileHover={{ y: -4 }}
                            className="card rounded-lg overflow-hidden border border-[#b5c9ea] bg-white shadow-[0_4px_0_rgba(9,50,144,0.12)]"
                          >
                            <div className="px-3 py-1.5 bg-gradient-to-r from-[#093290] to-[#5870B3] text-white font-pixel text-xs flex items-center justify-between">
                              <span>desk_tour.exe</span>
                              <span>🎧</span>
                            </div>
                            <div className="p-4 flex flex-col justify-between h-[calc(100%-28px)]">
                              <div>
                                <h3 className="font-semibold text-base text-[#0D1D56] mb-1">
                                  Cozy Desk Tour
                                </h3>
                                <p className="text-xs text-[#5E778C] leading-relaxed">
                                  Inspect mic, tea kettle, lighting, and streaming equipment.
                                </p>
                              </div>
                              <button
                                onClick={() => switchTab('twitch')}
                                className="mt-4 inline-block text-center px-4 py-1.5 rounded-md bg-[#093290] text-white font-semibold text-xs shadow-[0_3px_0_#000425] hover:bg-[#4974C1] transition-colors"
                              >
                                View desk setup 🎧
                              </button>
                            </div>
                          </motion.div>

                          <motion.div
                            whileHover={{ y: -4 }}
                            className="card rounded-lg overflow-hidden border border-[#b5c9ea] bg-white shadow-[0_4px_0_rgba(9,50,144,0.12)]"
                          >
                            <div className="px-3 py-1.5 bg-gradient-to-r from-[#093290] to-[#5870B3] text-white font-pixel text-xs flex items-center justify-between">
                              <span>corkboard.app</span>
                              <span>✉</span>
                            </div>
                            <div className="p-4 flex flex-col justify-between h-[calc(100%-28px)]">
                              <div>
                                <h3 className="font-semibold text-base text-[#0D1D56] mb-1">
                                  Community Corkboard
                                </h3>
                                <p className="text-xs text-[#5E778C] leading-relaxed">
                                  Pin sticky notes, shoutouts, and cute stickers for Tea!
                                </p>
                              </div>
                              <button
                                onClick={() => switchTab('guestbook')}
                                className="mt-4 inline-block text-center px-4 py-1.5 rounded-md bg-[#093290] text-white font-semibold text-xs shadow-[0_3px_0_#000425] hover:bg-[#4974C1] transition-colors"
                              >
                                View corkboard ✉
                              </button>
                            </div>
                          </motion.div>

                          <motion.div
                            whileHover={{ y: -4 }}
                            className="card rounded-lg overflow-hidden border border-[#b5c9ea] bg-white shadow-[0_4px_0_rgba(9,50,144,0.12)]"
                          >
                            <div className="px-3 py-1.5 bg-gradient-to-r from-[#093290] to-[#5870B3] text-white font-pixel text-xs flex items-center justify-between">
                              <span>merch_shelf.exe</span>
                              <span>♡</span>
                            </div>
                            <div className="p-4 flex flex-col justify-between h-[calc(100%-28px)]">
                              <div>
                                <h3 className="font-semibold text-base text-[#0D1D56] mb-1">
                                  Fourthwall Merch Room
                                </h3>
                                <p className="text-xs text-[#5E778C] leading-relaxed">
                                  Official t-shirts, hoodies, music player desk mats, and stickers!
                                </p>
                              </div>
                              <button
                                onClick={() => switchTab('merch')}
                                className="mt-4 inline-block text-center px-4 py-1.5 rounded-md bg-[#093290] text-white font-semibold text-xs shadow-[0_3px_0_#000425] hover:bg-[#4974C1] transition-colors"
                              >
                                Browse Merch ♡
                              </button>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                    </motion.div>
                  )}

                  {/* SOCIALS TAB */}
                  {activeTab === 'socials' && (
                    <motion.div
                      key="socials"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="porcelain-bar" />
                      <div className="max-w-4xl mx-auto px-4 py-8 pb-16">
                        <div className="flex items-center gap-3 mb-1">
                          <MascotSheep size={42} soundEnabled={soundEnabled} outfit="classic" />
                          <h2 className="font-pixel text-2xl sm:text-3xl text-[#093290] font-bold m-0">
                            Socials
                          </h2>
                        </div>
                        <p className="text-[#33477f] text-sm mb-6">
                          Where the flock hangs out. I am @teaonalamb on every platform. Come hang out wherever you like.
                        </p>

                        {/* All Social Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {SOCIALS_DATA.map((item, idx) => (
                            <motion.div
                              key={item.platform}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.08, duration: 0.3 }}
                              whileHover={{ y: -4 }}
                              className="card rounded-lg overflow-hidden border border-[#b5c9ea] bg-white shadow-[0_4px_0_rgba(9,50,144,0.12)] card-cloud-corner"
                            >
                              <div className="flex justify-between items-center px-3 py-1.5 bg-gradient-to-r from-[#093290] to-[#5870B3] text-white font-pixel text-xs">
                                <span>{item.platform}</span>
                                <span>●</span>
                              </div>
                              <div className="p-4 flex flex-col justify-between h-[calc(100%-28px)]">
                                <div>
                                  <div className="font-pixel text-3xl sm:text-4xl text-[#093290] font-bold leading-none">
                                    <CounterNumber
                                      value={item.count}
                                      numericTarget={item.numericCount}
                                    />
                                  </div>
                                  <div className="text-xs text-[#5E778C] mt-1">
                                    {item.label}
                                  </div>
                                  {item.handle && (
                                    <div className="text-xs font-semibold text-[#0D1D56] mt-2">
                                      {item.handle}
                                    </div>
                                  )}
                                </div>
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => playRetroClick(soundEnabled)}
                                  className="mt-4 inline-block text-center px-4 py-1.5 rounded-md bg-[#093290] text-white font-semibold text-xs shadow-[0_3px_0_#000425] hover:bg-[#4974C1] transition-colors"
                                >
                                  {item.platform === 'Discord' ? 'Join Discord' : `Visit ${item.platform}`}
                                </a>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* BLOG TAB (Multipage Listing or Dedicated Post View) */}
                  {activeTab === 'blog' && (
                    <motion.div
                      key="blog"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="porcelain-bar" />
                      <div className="max-w-4xl mx-auto px-4 py-8 pb-16">
                        {selectedPost ? (
                          /* Dedicated Blog Post Page */
                          <BlogPostView
                            post={selectedPost}
                            onBack={handleBackToBlogList}
                            nextPost={
                              BLOG_POSTS[(BLOG_POSTS.findIndex((p) => p.id === selectedPost.id) + 1) % BLOG_POSTS.length]
                            }
                            onSelectNextPost={handleSelectPost}
                            soundEnabled={soundEnabled}
                          />
                        ) : (
                          /* Blog Listing Page */
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <MascotCup size={40} soundEnabled={soundEnabled} />
                              <h2 className="font-pixel text-2xl sm:text-3xl text-[#093290] font-bold m-0">
                                Blog
                              </h2>
                            </div>
                            <p className="text-[#33477f] text-sm mb-6">
                              Guides and tutorials, personal stories, podcast behind the scenes, and anything in between.
                            </p>

                            <BlogList
                              posts={BLOG_POSTS}
                              onSelectPost={handleSelectPost}
                              soundEnabled={soundEnabled}
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* TWITCH TAB */}
                  {activeTab === 'twitch' && (
                    <motion.div
                      key="twitch"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="porcelain-bar" />
                      <div className="max-w-4xl mx-auto px-4 py-8 pb-16">
                        <div className="flex items-center gap-3 mb-1">
                          <MascotSheep size={42} soundEnabled={soundEnabled} outfit="classic" />
                          <h2 className="font-pixel text-2xl sm:text-3xl text-[#093290] font-bold m-0">
                            Twitch
                          </h2>
                        </div>
                        <p className="text-[#33477f] text-sm mb-6">
                          Cozy games, chatting, and tea. Come say hi in chat.
                        </p>

                        {/* Stream Player & Schedule Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TwitchStreamCard soundEnabled={soundEnabled} />

                          <div className="card rounded-lg overflow-hidden border border-[#b5c9ea] bg-white shadow-[0_4px_0_rgba(9,50,144,0.12)] flex flex-col">
                            <div className="px-3 py-1.5 bg-gradient-to-r from-[#093290] to-[#5870B3] text-white font-pixel text-xs">
                              schedule.xls
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="font-semibold text-lg text-[#0D1D56] mb-3">
                                  Weekly schedule
                                </h3>
                                <table className="w-full border-collapse text-sm mb-4">
                                  <tbody>
                                    <tr className="border-b border-dashed border-[#b5c9ea]">
                                      <td className="py-2.5 font-bold text-[#093290] w-28">
                                        Mon to Fri
                                      </td>
                                      <td className="py-2.5 text-[#0D1D56]">
                                        2:00 to 5:00 PM PST
                                      </td>
                                    </tr>
                                    <tr className="border-b border-dashed border-[#b5c9ea]">
                                      <td className="py-2.5 font-bold text-[#093290]">
                                        Wednesday
                                      </td>
                                      <td className="py-2.5 text-[#0D1D56]">
                                        Tea Talks Podcast at 7:00 PM PST
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2.5 font-bold text-[#5E778C]">
                                        Weekends
                                      </td>
                                      <td className="py-2.5 text-[#5E778C]">
                                        Off / Discord Community Hangouts
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <p className="text-xs text-[#5E778C] leading-relaxed">
                                  Live on Twitch every weekday afternoon. Join the Discord for stream news and schedule updates.
                                </p>
                              </div>

                              <a
                                className="mt-4 inline-block text-center px-4 py-2 rounded-md bg-[#6441a5] text-white font-semibold text-xs shadow-[0_3px_0_#000425] hover:bg-[#7d5bbe] transition-colors"
                                href="https://twitch.tv/teaonalamb"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => playRetroClick(soundEnabled)}
                              >
                                Follow on Twitch
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="h-6" />

                        {/* Interactive Desk Hotspot Tour (Idea 4) */}
                        <DeskHotspotTour soundEnabled={soundEnabled} />

                        <div className="h-6" />

                        {/* About the Stream */}
                        <div className="card rounded-lg overflow-hidden border border-[#b5c9ea] bg-white shadow-[0_4px_0_rgba(9,50,144,0.12)]">
                          <div className="px-3 py-1.5 bg-gradient-to-r from-[#093290] to-[#5870B3] text-white font-pixel text-xs">
                            about_me.txt
                          </div>
                          <div className="p-5 text-[#0D1D56] text-sm leading-relaxed space-y-2">
                            <h3 className="font-semibold text-base text-[#093290]">
                              About the stream
                            </h3>
                            <p>
                              Welcome to the flock! Here you will find cozy variety gaming, deep life chats, and warm cups of tea.
                              Whether we are navigating indie adventures, chilling with community games, or catching up on the latest tea,
                              this corner of the internet is built to feel like home.
                            </p>
                            <p className="text-xs text-[#5E778C]">
                              Chat rules: Be kind, respect fellow lambs, keep the vibes cozy, and never forget to hydrate.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* PODCAST TAB */}
                  {activeTab === 'podcast' && (
                    <motion.div
                      key="podcast"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="porcelain-bar" />
                      <div className="max-w-4xl mx-auto px-4 py-8 pb-16">
                        <div className="flex items-center gap-3 mb-1">
                          <MascotCup size={40} soundEnabled={soundEnabled} />
                          <h2 className="font-pixel text-2xl sm:text-3xl text-[#093290] font-bold m-0">
                            Tea Talks with Teaonalamb
                          </h2>
                        </div>
                        <p className="text-[#33477f] text-sm mb-6">
                          Real talk over tea, with guests. New episodes every Wednesday at 7 PM PST.
                        </p>

                        {/* Audio Player and Episodes Catalog */}
                        <PodcastPlayer
                          soundEnabled={soundEnabled}
                          isPlayingMusic={isPlayingMusic}
                          onMusicStateChange={(playing) => setIsPlayingMusic(playing)}
                        />

                        <div className="h-4" />

                        {/* Podcast Links and Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="card rounded-lg overflow-hidden border border-[#b5c9ea] bg-white shadow-[0_4px_0_rgba(9,50,144,0.12)] p-4 flex flex-col justify-between">
                            <div>
                              <div className="font-pixel text-xs text-[#5E778C] mb-1">schedule.xls</div>
                              <h3 className="font-semibold text-base text-[#0D1D56] mb-1">New episodes</h3>
                              <p className="text-xs text-[#5E778C] mb-3">Every Wednesday at 7 PM PST.</p>
                            </div>
                            {/* BUTTON ORDER: YouTube FIRST, Spotify second, Apple Podcasts third! */}
                            <div className="flex flex-wrap gap-1.5">
                              <a
                                className="px-3 py-1.5 rounded bg-[#ff0000] text-white font-semibold text-xs shadow-[0_2px_0_#000425] hover:bg-[#cc0000] transition-colors"
                                href="https://www.youtube.com/@teatalkspodcast"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => playRetroClick(soundEnabled)}
                              >
                                YouTube
                              </a>
                              <a
                                className="px-3 py-1.5 rounded bg-[#1db954] text-white font-semibold text-xs shadow-[0_2px_0_#000425] hover:bg-[#1ed760] transition-colors"
                                href="https://open.spotify.com/search/Tea%20Talks%20with%20teaonalamb"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => playRetroClick(soundEnabled)}
                              >
                                Spotify
                              </a>
                              <a
                                className="px-3 py-1.5 rounded bg-[#093290] text-white font-semibold text-xs shadow-[0_2px_0_#000425] hover:bg-[#4974C1] transition-colors"
                                href="https://podcasts.apple.com/podcast/id1681250633"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => playRetroClick(soundEnabled)}
                              >
                                Apple Podcasts
                              </a>
                            </div>
                          </div>

                          <div className="card rounded-lg overflow-hidden border border-[#b5c9ea] bg-white shadow-[0_4px_0_rgba(9,50,144,0.12)] p-4 flex flex-col justify-between">
                            <div>
                              <div className="font-pixel text-xs text-[#5E778C] mb-1">be_a_guest.txt</div>
                              <h3 className="font-semibold text-base text-[#0D1D56] mb-1">Want to be a guest?</h3>
                              <p className="text-xs text-[#5E778C] leading-relaxed">
                                Email <span className="font-semibold text-[#093290]">teaonalamb@gmail.com</span> with your topic, why you want to be on, your name (or handle), and your age.
                              </p>
                            </div>
                          </div>

                          <div className="card rounded-lg overflow-hidden border border-[#b5c9ea] bg-white shadow-[0_4px_0_rgba(9,50,144,0.12)] p-4 flex flex-col justify-between">
                            <div>
                              <div className="font-pixel text-xs text-[#5E778C] mb-1">support.exe</div>
                              <h3 className="font-semibold text-base text-[#0D1D56] mb-1">Support the show</h3>
                              <p className="text-xs text-[#5E778C] mb-3 leading-relaxed">
                                Tips keep the tea flowing. Vote on episode polls and chat in Discord.
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <a
                                className="px-3 py-1 rounded bg-[#093290] text-white font-semibold text-xs shadow-[0_2px_0_#000425] hover:bg-[#4974C1] transition-colors"
                                href="https://streamelements.com/teaonalamb/tip"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => playRetroClick(soundEnabled)}
                              >
                                Send a tip
                              </a>
                              <a
                                className="px-3 py-1 rounded bg-[#5865f2] text-white font-semibold text-xs shadow-[0_2px_0_#000425] hover:bg-[#4752c4] transition-colors"
                                href="https://discord.com/invite/VEJYDJP7xM"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => playRetroClick(soundEnabled)}
                              >
                                Join Discord
                              </a>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-[#5E778C] mt-5">
                          A podcast by Twitch streamer teaonalamb. Season 2 is here.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* CREATOR MEDIA KIT TAB */}
                  {activeTab === 'media-kit' && (
                    <motion.div key="media-kit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                      <div className="porcelain-bar" />
                      <MediaKit soundEnabled={soundEnabled} />
                    </motion.div>
                  )}

                  {/* GUESTBOOK CORKBOARD TAB */}
                  {activeTab === 'guestbook' && (
                    <motion.div
                      key="guestbook"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="porcelain-bar" />
                      <div className="max-w-5xl mx-auto px-4 py-8 pb-16">
                        <GuestbookCorkboard soundEnabled={soundEnabled} />
                      </div>
                    </motion.div>
                  )}

                  {/* MERCH SHELF TAB (Idea 5) */}
                  {activeTab === 'merch' && (
                    <motion.div
                      key="merch"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="porcelain-bar" />
                      <div className="max-w-5xl mx-auto px-4 py-8 pb-16">
                        <MerchShelf soundEnabled={soundEnabled} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer with Scalloped Top and Both Mascots */}
                <footer className="relative mt-8 pt-10 pb-8 text-center text-[#cfe0ff] bg-gradient-to-b from-[#0D1D56] to-[#000425] scalloped-top">
                  <div className="flex items-center justify-center gap-3">
                    <img
                      src="/sheep-tea.png"
                      alt="Tea mascot with teacup"
                      className="w-10 h-auto drop-shadow-sm animate-bob"
                    />
                    <p className="m-0 text-xs sm:text-sm font-medium">
                      Teaonalamb, 2026. Find me at @teaonalamb on every platform.
                    </p>
                    <MascotCup size={36} soundEnabled={soundEnabled} />
                  </div>
                </footer>
              </main>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Taskbar: Start button, Active Window button, Status, Clock */}
      <footer className="relative z-30 flex-none h-11 flex items-center gap-2 px-3 bg-[#0D1D56]/85 backdrop-blur-md border-t border-white/20 text-[#dfeaff] text-xs">
        {/* Start Button */}
        <button
          onClick={() => {
            playRetroClick(soundEnabled);
            setIsStartOpen(!isStartOpen);
          }}
          className={`flex items-center gap-2 px-2.5 py-1 rounded border transition-all ${
            isStartOpen
              ? 'bg-[#4974C1] border-white text-white shadow-inner'
              : 'bg-white/10 hover:bg-white/20 border-white/30 text-white'
          }`}
        >
          <div className="w-4 h-4 grid grid-cols-2 gap-0.5 p-0.5">
            <span className="bg-[#4974C1] rounded-[1px]" />
            <span className="bg-amber-300 rounded-[1px]" />
            <span className="bg-emerald-400 rounded-[1px]" />
            <span className="bg-red-400 rounded-[1px]" />
          </div>
          <span className="font-pixel text-xs font-bold tracking-wide">Start</span>
        </button>

        {/* Start Menu Component */}
        <StartMenu
          isOpen={isStartOpen}
          onClose={() => setIsStartOpen(false)}
          onSelectTab={switchTab}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          isPlayingMusic={isPlayingMusic}
          onToggleMusic={toggleMusicState}
        />

        {/* Active Window Button on Taskbar */}
        <button
          onClick={() => {
            if (isMinimized) {
              handleRestore();
            } else {
              handleMinimize();
            }
          }}
          className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded border-b-2 text-xs transition-colors ${
            !isMinimized
              ? 'bg-white/20 border-[#4974C1] text-white shadow-inner'
              : 'bg-white/10 border-transparent text-[#cfe0ff]/80 hover:bg-white/15'
          }`}
        >
          <span className="text-xs">☁</span>
          <span className="font-medium">teaonalamb.com</span>
          <span className="text-[10px] text-[#cfe0ff]/70 font-mono">
            [{activeTab}{activeTab === 'blog' && selectedPost ? `/${selectedPost.slug}` : ''}]
          </span>
        </button>

        {/* Lo-Fi Music status badge */}
        {isPlayingMusic && (
          <button
            onClick={() => {
              playRetroClick(soundEnabled);
              toggleMusicState();
            }}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-pixel"
            title="Click to pause Lo-Fi music"
          >
            <span className="animate-pulse">🍵</span>
            <span>Lo-Fi Radio Active</span>
          </button>
        )}

        {/* Taskbar Clock */}
        <div className="ml-auto text-right leading-tight font-mono text-[11px] text-[#cfe0ff]">
          <div>{currentTime || '12:00 PM'}</div>
          <div className="text-[10px] text-[#5E778C]">{currentDate || '2026-11-08'}</div>
        </div>
      </footer>
    </div>
  );
}
