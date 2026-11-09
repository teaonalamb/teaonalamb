import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playRetroClick, playChime } from '../audio';

export interface HotspotItem {
  id: string;
  name: string;
  category: 'Monitors' | 'Computer' | 'Peripherals' | 'Audio & Video' | 'Stream Gear';
  icon: string;
  pinX: number; // percentage in SVG (0 to 1000 mapped)
  pinY: number; // percentage in SVG (0 to 640 mapped)
  specs: string[];
  note: string;
}

export const DESK_HOTSPOTS: HotspotItem[] = [
  {
    id: 'main-monitor',
    name: 'ViewSonic VS2412-h (Primary)',
    category: 'Monitors',
    icon: '🖥️',
    pinX: 500,
    pinY: 200,
    specs: [
      'Model: ViewSonic VS2412-h 24-inch Display',
      'Panel: Full HD IPS panel with crisp color accuracy',
      'Resolution: 1920 x 1080 @ 100Hz',
      'Usage: Main gaming display for Apex Legends, Valorant, and active streaming',
    ],
    note: 'My main display right in front of me. Fast refresh rate and vivid colors make tracking targets and reading chat overlays effortless.',
  },
  {
    id: 'second-monitor',
    name: 'AXM 2428 (Secondary)',
    category: 'Monitors',
    icon: '📊',
    pinX: 235,
    pinY: 220,
    specs: [
      'Model: AXM 2428 24-inch Display',
      'Resolution: 1920 x 1080 Full HD',
      'Mount: Heavy-duty gas-spring monitor arm',
      'Current Orientation: Horizontal layout next to main monitor',
      'Usage: OBS Studio, Twitch Chat, Discord, and soundboard monitoring',
    ],
    note: 'Mounted horizontally to the left of my main screen. Dedicated to managing OBS Studio scene switches, soundboard levels, and live chat.',
  },
  {
    id: 'webcam',
    name: 'Canon EOS Rebel T5i (Webcam)',
    category: 'Audio & Video',
    icon: '📷',
    pinX: 500,
    pinY: 72,
    specs: [
      'Camera: Canon EOS Rebel T5i DSLR',
      'Mount: Solid metal desk clamp camera mount',
      'Capture: Clean HDMI capture card for pristine 1080p stream video',
      'Sensor: 18.0 Megapixel CMOS with natural cinematic background blur',
    ],
    note: 'Mounted on top of my main monitor. Upgraded to the Canon DSLR for rich skin tones, crisp clean HDMI output, and authentic natural background blur.',
  },
  {
    id: 'pc-rig',
    name: 'Corsair Crystal 280x Custom Rig',
    category: 'Computer',
    icon: '⚡',
    pinX: 835,
    pinY: 340,
    specs: [
      'Case: Corsair Crystal 280x White RGB Micro-ATX Dual-Chamber',
      'Processor: Intel Core i9-9900k (8 Cores, 16 Threads, up to 5.0 GHz)',
      'Graphics Card: NVIDIA GeForce RTX 3070 Ti',
      'CPU Cooler: Corsair H100i RGB Platinum 240mm AIO Liquid Cooler',
      'Motherboard: MSI MPG Z390M Gaming Edge AC',
      'Memory: 32GB DDR4 Trident Z RGB',
      'Storage: 1TB Samsung 970 Evo M.2 SSD + 1TB Western Digital M.2 NVMe (2TB total)',
      'Power Supply: Corsair RMx 750W 80+ Gold Fully Modular PSU',
    ],
    note: 'Dual-chamber white cube chassis with tempered glass. Handles 1080p60 encoding, sweaty Apex matches, and multi-track podcast audio simultaneously.',
  },
  {
    id: 'microphone',
    name: 'Elgato Wave:3 Broadcast Mic',
    category: 'Audio & Video',
    icon: '🎙️',
    pinX: 590,
    pinY: 485,
    specs: [
      'Model: Elgato Wave:3 Premium USB Condenser Microphone',
      'Capsule: 17mm electret capsule with cardioid polar pattern',
      'Technology: Clipguard anti-distortion technology prevents clipping when laughing or shouting',
      'Accessories: Low-profile white boom arm with integrated pop filter and mascot plushie charm',
    ],
    note: 'Clean voice pickup without muffled lows. The built-in Clipguard prevents distortion when things get chaotic and chat starts laughing.',
  },
  {
    id: 'keyboard',
    name: 'Royal Kludge RK71 Keyboard',
    category: 'Peripherals',
    icon: '⌨️',
    pinX: 385,
    pinY: 495,
    specs: [
      'Model: Royal Kludge RK71 Compact Mechanical Keyboard',
      'Switches: Crescent White Switches (smooth, creamy linear keystrokes)',
      'Keycaps: Custom white retro profile keycaps',
      'Cable: Custom white coiled aviation cable with metallic connector',
      'Wrist Rest: Ergonomic cloud foam cushion',
    ],
    note: 'The 71-key layout leaves lots of mouse space while keeping dedicated arrow keys. The Crescent White switches sound super smooth and creamy without clacking.',
  },
  {
    id: 'mouse',
    name: 'Dareu A950 Cinnamoroll Mouse',
    category: 'Peripherals',
    icon: '🖱️',
    pinX: 505,
    pinY: 460,
    specs: [
      'Model: Dareu A950 Cinnamoroll Edition Wireless Gaming Mouse',
      'Sensor: High-precision optical gaming sensor',
      'Connectivity: 2.4GHz low-latency wireless with magnetic charging dock',
      'Weight: Lightweight ergonomic design with pastel accents',
    ],
    note: 'Super light, incredibly responsive, and has the cutest pastel look. Sits directly on the custom ocean cloud desk mat.',
  },
  {
    id: 'headset',
    name: 'SteelSeries Arctis 7 Wireless',
    category: 'Peripherals',
    icon: '🎧',
    pinX: 695,
    pinY: 530,
    specs: [
      'Model: SteelSeries Arctis 7 Lossless Wireless Gaming Headset',
      'Audio: S1 speaker drivers with DTS Headphone:X v2.0 surround sound',
      'Comfort: Ski goggle suspension headband and breathable AirWeave ear cushions',
      'Battery: Over 24 hours of continuous stream and podcast monitoring',
    ],
    note: 'Zero cable drag and no lag. The suspension headband is so comfortable I forget I have them on during long five-hour streams.',
  },
  {
    id: 'stream-gear',
    name: 'Stream Deck & Switch Dock',
    category: 'Stream Gear',
    icon: '🎛️',
    pinX: 620,
    pinY: 380,
    specs: [
      'Switcher: Elgato Stream Deck with custom LCD shortcut keys',
      'Console: Nintendo Switch Animal Crossing Special Edition Dock',
      'Smart Hub: Google Nest Hub display for time, notifications, and photos',
      'Desk Mat: Wide ocean and cloud gaming desk pad',
    ],
    note: 'One button scene switches, soundboard triggers, and muting. The Animal Crossing dock right underneath keeps cozy gaming within arm reach.',
  },
];

interface DeskHotspotTourProps {
  soundEnabled: boolean;
}

export const DeskHotspotTour: React.FC<DeskHotspotTourProps> = ({ soundEnabled }) => {
  const [activeItem, setActiveItem] = useState<HotspotItem | null>(null);
  const [lightMode, setLightMode] = useState<'blue' | 'cyber' | 'cozy'>('blue');
  const [activeTab, setActiveTab] = useState<'render' | 'specs'>('render');

  const handleSelect = (item: HotspotItem) => {
    playRetroClick(soundEnabled);
    setActiveItem(item);
  };

  const getGlowColors = () => {
    if (lightMode === 'cyber') {
      return {
        ambient: '#ff007f',
        accent: '#00f0ff',
        deskGlow: 'rgba(255, 0, 127, 0.25)',
      };
    }
    if (lightMode === 'cozy') {
      return {
        ambient: '#e69500',
        accent: '#ffcc66',
        deskGlow: 'rgba(230, 149, 0, 0.2)',
      };
    }
    // Default blue stream mode matching photo
    return {
      ambient: '#093290',
      accent: '#00d2ff',
      deskGlow: 'rgba(0, 210, 255, 0.22)',
    };
  };

  const currentGlow = getGlowColors();

  return (
    <div className="card rounded-2xl overflow-hidden border-2 border-[#b5c9ea] bg-white shadow-[0_6px_0_rgba(9,50,144,0.12)]">
      {/* OS Window Title Bar */}
      <div className="px-4 py-2 bg-gradient-to-r from-[#093290] via-[#4974C1] to-[#5870B3] text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-xs font-bold">battlestation_render.svg</span>
          <span className="text-[11px] text-[#cfe0ff]">★ Digital Battlestation Render</span>
        </div>

        {/* View Switcher & Lighting Toggle */}
        <div className="flex items-center gap-2">
          {/* Lighting Mode Picker */}
          <div className="hidden sm:flex items-center gap-1 bg-black/25 px-2 py-0.5 rounded text-[10px] font-pixel">
            <span className="text-[#cfe0ff]">Vibe:</span>
            <button
              onClick={() => {
                playRetroClick(soundEnabled);
                setLightMode('blue');
              }}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${lightMode === 'blue' ? 'bg-[#00d2ff] text-[#09153a] font-bold' : 'hover:text-white'}`}
            >
              Stream Blue
            </button>
            <button
              onClick={() => {
                playRetroClick(soundEnabled);
                setLightMode('cyber');
              }}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${lightMode === 'cyber' ? 'bg-[#ff007f] text-white font-bold' : 'hover:text-white'}`}
            >
              Neon Pink
            </button>
            <button
              onClick={() => {
                playRetroClick(soundEnabled);
                setLightMode('cozy');
              }}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${lightMode === 'cozy' ? 'bg-[#ffcc66] text-[#09153a] font-bold' : 'hover:text-white'}`}
            >
              Warm Tea
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                playRetroClick(soundEnabled);
                setActiveTab('render');
              }}
              className={`px-2.5 py-0.5 rounded text-[11px] font-pixel transition-colors cursor-pointer ${
                activeTab === 'render'
                  ? 'bg-white text-[#093290] font-bold shadow-xs'
                  : 'text-white/80 hover:bg-white/20'
              }`}
            >
              Digital Render
            </button>
            <button
              onClick={() => {
                playRetroClick(soundEnabled);
                setActiveTab('specs');
              }}
              className={`px-2.5 py-0.5 rounded text-[11px] font-pixel transition-colors cursor-pointer ${
                activeTab === 'specs'
                  ? 'bg-white text-[#093290] font-bold shadow-xs'
                  : 'text-white/80 hover:bg-white/20'
              }`}
            >
              Spec Sheet
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 font-sans-clean">
        {/* Header & Quick Selector Chips */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-pixel text-lg sm:text-xl text-[#093290] font-bold m-0 flex items-center gap-2">
              <span>🎧</span>
              <span>Tea&apos;s Streaming Battlestation Render</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#33477f] mt-0.5">
              Vector digital illustration rendered from my battlestation photo. Click any component or pin to inspect specs.
            </p>
          </div>

          {/* Quick Selection Buttons */}
          <div className="flex flex-wrap gap-1">
            {DESK_HOTSPOTS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`px-2 py-1 rounded text-[11px] font-pixel border transition-all cursor-pointer ${
                  activeItem?.id === item.id
                    ? 'bg-[#093290] text-white border-[#093290] shadow-sm'
                    : 'bg-[#eaf1fb] text-[#093290] border-[#b5c9ea] hover:bg-white'
                }`}
              >
                {item.icon} {item.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'render' ? (
          /* SVG Digital Render of Battlestation */
          <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[#093290] bg-[#070c24] shadow-2xl select-none">
            {/* SVG Illustration Container */}
            <svg
              viewBox="0 0 1000 640"
              className="w-full h-auto block"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Back Wall Ambient Radial Glow */}
                <radialGradient id="wallGlow" cx="50%" cy="40%" r="65%">
                  <stop offset="0%" stopColor={currentGlow.accent} stopOpacity="0.45" />
                  <stop offset="45%" stopColor="#0f1b4c" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#050818" stopOpacity="1" />
                </radialGradient>

                {/* Desk Surface Gradient */}
                <linearGradient id="deskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e2c56" />
                  <stop offset="15%" stopColor="#141f3f" />
                  <stop offset="100%" stopColor="#0b1227" />
                </linearGradient>

                {/* Ocean Desk Mat Gradient */}
                <linearGradient id="matGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#08428c" />
                  <stop offset="50%" stopColor="#1b6ca8" />
                  <stop offset="100%" stopColor="#0a356e" />
                </linearGradient>

                {/* Main Monitor Screen Apex Gradient */}
                <linearGradient id="apexScreen" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#042858" />
                  <stop offset="30%" stopColor="#0c4a8a" />
                  <stop offset="70%" stopColor="#14609e" />
                  <stop offset="100%" stopColor="#062e5c" />
                </linearGradient>

                {/* Secondary OBS Screen Gradient */}
                <linearGradient id="obsScreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#121829" />
                  <stop offset="100%" stopColor="#0a0d18" />
                </linearGradient>

                {/* PC Glass Reflection */}
                <linearGradient id="glassReflect" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
                  <stop offset="35%" stopColor="#ffffff" stopOpacity="0.05" />
                  <stop offset="65%" stopColor={currentGlow.accent} stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
                </linearGradient>

                {/* RGB RAM Gradient */}
                <linearGradient id="ramRgb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff0055" />
                  <stop offset="30%" stopColor="#ffaa00" />
                  <stop offset="70%" stopColor="#00ffcc" />
                  <stop offset="100%" stopColor="#3366ff" />
                </linearGradient>

                {/* White Case Shadow */}
                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. ROOM BACKGROUND & AMBIENT BACKLIGHTING */}
              <rect width="1000" height="640" fill="url(#wallGlow)" />

              {/* Backlight LED Strip Glow behind monitors */}
              <ellipse cx="500" cy="240" rx="420" ry="180" fill={currentGlow.accent} opacity="0.28" />

              {/* 2. DESK SURFACE & WOODEN TRIM */}
              <rect x="0" y="360" width="1000" height="280" fill="url(#deskGrad)" />
              {/* Desk Front Bevel Line */}
              <line x1="0" y1="360" x2="1000" y2="360" stroke="#374f8c" strokeWidth="3" />
              <line x1="0" y1="363" x2="1000" y2="363" stroke="#101933" strokeWidth="2" />

              {/* 3. COZY OCEAN DESK MAT */}
              <g id="desk-mat-group">
                <rect x="110" y="380" width="760" height="235" rx="18" fill="url(#matGrad)" stroke="#4974c1" strokeWidth="2.5" />
                {/* Desk Mat Graphic Shapes (Pastel Coral, Clouds, Star Motifs) */}
                <circle cx="160" cy="430" r="24" fill="#ffffff" opacity="0.12" />
                <circle cx="210" cy="460" r="14" fill="#ffffff" opacity="0.1" />
                <path d="M 140 550 Q 180 520 220 550 T 260 550" stroke="#cfe0ff" strokeWidth="3" fill="none" opacity="0.2" />
                <path d="M 720 420 Q 750 395 780 420" stroke="#cfe0ff" strokeWidth="2.5" fill="none" opacity="0.25" />
                {/* Floating bubbles on desk mat */}
                <circle cx="680" cy="470" r="10" fill="#ffffff" opacity="0.15" />
                <circle cx="710" cy="490" r="6" fill="#ffffff" opacity="0.15" />
                <circle cx="340" cy="405" r="8" fill="#ffffff" opacity="0.15" />
              </g>

              {/* 4. SMART HUB DISPLAY (Left Side) */}
              <g id="nest-hub" className="cursor-pointer" onClick={() => handleSelect(DESK_HOTSPOTS[8])}>
                {/* Stand */}
                <path d="M 60 410 L 85 410 L 80 435 L 65 435 Z" fill="#cfd8dc" />
                {/* White Frame angled */}
                <rect x="35" y="355" width="80" height="58" rx="8" fill="#ffffff" stroke="#90a4ae" strokeWidth="2" />
                {/* Screen showing cozy wallpaper */}
                <rect x="40" y="360" width="70" height="48" rx="5" fill="#1b2b65" />
                <circle cx="60" cy="380" r="12" fill="#ffd166" opacity="0.8" />
                <rect x="42" y="394" width="66" height="12" rx="3" fill="#ffffff" opacity="0.25" />
                <text x="75" y="403" fill="#ffffff" fontSize="7" fontFamily="sans-serif" textAnchor="middle">8:37 PM</text>
              </g>

              {/* 5. SECONDARY MONITOR: AXM 2428 (Mounted Horizontally on Left) */}
              <g
                id="render-second-monitor"
                className="cursor-pointer group"
                onClick={() => handleSelect(DESK_HOTSPOTS[1])}
              >
                {/* Monitor Arm */}
                <path d="M 235 340 L 235 365" stroke="#1e2c56" strokeWidth="12" strokeLinecap="round" />
                {/* Monitor Bezel */}
                <rect x="110" y="140" width="250" height="175" rx="6" fill="#0d1424" stroke="#4974c1" strokeWidth="3" />
                {/* Inner Screen: OBS Studio + Twitch Chat */}
                <rect x="115" y="145" width="240" height="165" rx="3" fill="url(#obsScreen)" />

                {/* OBS Title Bar */}
                <rect x="115" y="145" width="240" height="16" fill="#1b253d" />
                <text x="122" y="156" fill="#9bb3e0" fontSize="8" fontFamily="monospace" fontWeight="bold">OBS Studio ★ Live [Rec]</text>
                <circle cx="345" cy="153" r="3" fill="#00ff66" />

                {/* Left: OBS Scenes & Audio Mixer */}
                <rect x="120" y="167" width="115" height="136" fill="#0d1424" rx="3" />
                <text x="125" y="178" fill="#7d95c4" fontSize="7" fontFamily="sans-serif">● Desktop Audio</text>
                {/* Audio visualizer green/yellow/red bars */}
                <rect x="125" y="182" width="75" height="4" fill="#00ff66" rx="2" />
                <rect x="202" y="182" width="20" height="4" fill="#ffd166" rx="2" />
                <rect x="224" y="182" width="6" height="4" fill="#ff4757" rx="2" />

                <text x="125" y="198" fill="#7d95c4" fontSize="7" fontFamily="sans-serif">● Mic/Aux (Elgato Wave:3)</text>
                <rect x="125" y="202" width="65" height="4" fill="#00ff66" rx="2" />
                <rect x="192" y="202" width="15" height="4" fill="#ffd166" rx="2" />

                {/* Scene list buttons */}
                <rect x="125" y="215" width="105" height="16" rx="2" fill="#24345c" />
                <text x="130" y="226" fill="#ffffff" fontSize="8" fontFamily="sans-serif">▶ Stream Starting Soon</text>
                <rect x="125" y="235" width="105" height="16" rx="2" fill="#093290" />
                <text x="130" y="246" fill="#ffffff" fontSize="8" fontFamily="sans-serif" fontWeight="bold">▶ Main Gaming (Active)</text>
                <rect x="125" y="255" width="105" height="16" rx="2" fill="#1b253d" />
                <text x="130" y="266" fill="#9bb3e0" fontSize="8" fontFamily="sans-serif">▶ Just Chatting &amp; Tea</text>

                {/* Right: Live Twitch Chat */}
                <rect x="242" y="167" width="108" height="136" fill="#090e1c" rx="3" />
                <text x="248" y="178" fill="#9bb3e0" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Stream Chat</text>
                {/* Chat message lines */}
                <text x="248" y="194" fill="#00d2ff" fontSize="7" fontFamily="sans-serif">CozyLurker: <tspan fill="#cfe0ff">gm Tea! ✨</tspan></text>
                <text x="248" y="208" fill="#ff70a6" fontSize="7" fontFamily="sans-serif">PixelTea: <tspan fill="#cfe0ff">that shot was insane</tspan></text>
                <text x="248" y="222" fill="#70d6ff" fontSize="7" fontFamily="sans-serif">Bobafan: <tspan fill="#cfe0ff">tea cup refill check!</tspan></text>
                <text x="248" y="236" fill="#ffd166" fontSize="7" fontFamily="sans-serif">Aura99: <tspan fill="#cfe0ff">W apex lobby</tspan></text>
                <text x="248" y="250" fill="#a0c4ff" fontSize="7" fontFamily="sans-serif">StreamerBot: <tspan fill="#a0c4ff">!merch | !specs</tspan></text>
              </g>

              {/* 6. PRIMARY MONITOR: ViewSonic VS2412-h (Center) */}
              <g
                id="render-main-monitor"
                className="cursor-pointer group"
                onClick={() => handleSelect(DESK_HOTSPOTS[0])}
              >
                {/* Monitor Stand Base & Riser */}
                <rect x="485" y="325" width="30" height="42" fill="#2a3962" />
                <rect x="450" y="360" width="100" height="8" rx="3" fill="#1f2c4f" stroke="#3b4f85" />

                {/* Monitor Frame & Sleek Bezel */}
                <rect x="375" y="105" width="250" height="175" rx="5" fill="#f0f4f9" stroke="#b5c9ea" strokeWidth="3" />
                {/* Monitor Screen: Apex Legends Lobby Render */}
                <rect x="381" y="111" width="238" height="163" rx="2" fill="url(#apexScreen)" />

                {/* Apex Legends Top Navigation Bar */}
                <rect x="381" y="111" width="238" height="16" fill="#061c3d" />
                <text x="390" y="122" fill="#ffd166" fontSize="8" fontFamily="monospace" fontWeight="bold">SEASON ARSENAL</text>
                <text x="475" y="122" fill="#ffffff" fontSize="7" fontFamily="sans-serif" fontWeight="bold">PLAY</text>
                <text x="500" y="122" fill="#88a5d3" fontSize="7" fontFamily="sans-serif">SEASONAL</text>
                <text x="540" y="122" fill="#88a5d3" fontSize="7" fontFamily="sans-serif">LEGENDS</text>
                <text x="580" y="122" fill="#88a5d3" fontSize="7" fontFamily="sans-serif">STORE</text>

                {/* Apex Lobby Character Center Render (Mirage silhouette & holographic banner) */}
                <polygon points="500,140 480,225 520,225" fill="#ffd166" opacity="0.2" />
                {/* Character Silhouette */}
                <circle cx="500" cy="155" r="9" fill="#1b3058" stroke="#ffd166" strokeWidth="1.5" />
                <rect x="492" y="165" width="16" height="35" rx="4" fill="#1f3868" stroke="#ffd166" strokeWidth="1" />
                <rect x="488" y="200" width="9" height="38" fill="#162747" />
                <rect x="503" y="200" width="9" height="38" fill="#162747" />
                {/* Hologram badges & rank icons */}
                <polygon points="500,135 506,145 494,145" fill="#ff4757" />
                <rect x="478" y="132" width="44" height="6" rx="2" fill="#ff4757" opacity="0.8" />
                <text x="500" y="137" fill="#ffffff" fontSize="5" fontFamily="monospace" textAnchor="middle">LEVEL 500 ★ APEX</text>

                {/* Left: Teammates Ready Box */}
                <rect x="388" y="195" width="55" height="42" rx="3" fill="#061733" opacity="0.85" />
                <text x="393" y="206" fill="#00d2ff" fontSize="6" fontFamily="sans-serif">TRIOS • PUBS</text>
                <rect x="393" y="215" width="45" height="14" rx="2" fill="#00ff66" />
                <text x="415" y="225" fill="#042858" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">READY</text>

                {/* Right: Daily Challenges Box */}
                <rect x="540" y="140" width="72" height="46" rx="3" fill="#061733" opacity="0.85" />
                <text x="545" y="150" fill="#ffd166" fontSize="6" fontFamily="sans-serif">DAILY CHALLENGES</text>
                <line x1="545" y1="156" x2="605" y2="156" stroke="#1f3868" strokeWidth="1" />
                <text x="545" y="164" fill="#cfe0ff" fontSize="5.5" fontFamily="sans-serif">Play 2 matches as Mirage</text>
                <text x="545" y="174" fill="#cfe0ff" fontSize="5.5" fontFamily="sans-serif">Deal 1500 damage in BR</text>
              </g>

              {/* 7. WEBCAM: CANON EOS REBEL T5i (Mounted on Top of Main Monitor) */}
              <g
                id="render-canon-webcam"
                className="cursor-pointer group"
                onClick={() => handleSelect(DESK_HOTSPOTS[2])}
              >
                {/* Mount Arm Clamp */}
                <rect x="496" y="94" width="8" height="12" fill="#1b253d" />
                {/* Camera Body (DSLR Shape) */}
                <rect x="475" y="65" width="50" height="30" rx="4" fill="#101524" stroke="#4974c1" strokeWidth="1.5" />
                {/* Viewfinder hump */}
                <polygon points="490,65 494,57 506,57 510,65" fill="#101524" stroke="#4974c1" strokeWidth="1.5" />
                {/* Mode Dial */}
                <rect x="480" y="61" width="8" height="5" rx="1" fill="#4974c1" />
                {/* Large Lens Barrel with iconic red ring */}
                <rect x="485" y="70" width="30" height="20" rx="3" fill="#070a14" stroke="#33477f" strokeWidth="1" />
                <line x1="486" y1="74" x2="514" y2="74" stroke="#ff2d55" strokeWidth="1.5" />
                {/* Glass Front Element Reflection */}
                <circle cx="500" cy="80" r="7" fill="#00d2ff" opacity="0.4" />
                <circle cx="498" cy="78" r="2.5" fill="#ffffff" opacity="0.8" />
                {/* Green Clean HDMI Broadcast Tally Dot */}
                <circle cx="518" cy="69" r="2" fill="#00ff66" />
              </g>

              {/* 8. UNDER MONITOR: NINTENDO SWITCH ANIMAL CROSSING DOCK */}
              <g
                id="render-switch-dock"
                className="cursor-pointer group"
                onClick={() => handleSelect(DESK_HOTSPOTS[8])}
              >
                {/* Dock Body (Pastel Cream & Mint) */}
                <rect x="430" y="325" width="105" height="36" rx="5" fill="#e9f5ed" stroke="#b2d8c6" strokeWidth="2" />
                {/* Left Seafoam Green Joy-Con Silhouette */}
                <path d="M 430 330 Q 430 325 435 325 L 442 325 L 442 361 L 435 361 Q 430 361 430 356 Z" fill="#9de0d0" />
                {/* Right Pastel Sky-Blue Joy-Con Silhouette */}
                <path d="M 535 330 Q 535 325 530 325 L 523 325 L 523 361 L 530 361 Q 535 361 535 356 Z" fill="#9bd1f9" />
                {/* Cute Island & Sea Waves Motif */}
                <circle cx="482" cy="342" r="7" fill="#88c5a2" />
                <path d="M 460 352 Q 482 344 505 352" stroke="#5fa682" strokeWidth="1.5" fill="none" />
                <circle cx="475" cy="340" r="2.5" fill="#ffffff" />
                <circle cx="490" cy="340" r="2.5" fill="#ffffff" />
              </g>

              {/* 9. COMPUTER RIG: CORSAIR CRYSTAL 280X WHITE RGB (Right Side) */}
              <g
                id="render-corsair-rig"
                className="cursor-pointer group"
                onClick={() => handleSelect(DESK_HOTSPOTS[3])}
              >
                {/* White Dual-Chamber Chassis Body */}
                <rect x="740" y="210" width="190" height="260" rx="8" fill="#f8fafc" stroke="#b5c9ea" strokeWidth="3" />
                {/* Top Glass/Mesh Ventilation Panel */}
                <rect x="746" y="215" width="178" height="22" rx="4" fill="#0d1424" />
                <line x1="755" y1="226" x2="915" y2="226" stroke="#4974c1" strokeWidth="2" strokeDasharray="4,4" />

                {/* Left Chamber Tempered Glass Window */}
                <rect x="746" y="242" width="140" height="220" rx="5" fill="#070c1c" stroke="#cad8ea" strokeWidth="2" />

                {/* Glass Reflection Angle */}
                <polygon points="746,242 810,242 755,380 746,380" fill="url(#glassReflect)" opacity="0.6" />

                {/* Internal Hardware: MSI Z390M Motherboard & RGB Components */}
                <rect x="752" y="250" width="128" height="205" fill="#0a1020" rx="3" />

                {/* Corsair H100i RGB Platinum 240mm AIO Cooler */}
                {/* Top 240mm Radiator */}
                <rect x="755" y="246" width="122" height="12" fill="#1c253d" />
                {/* Glowing Pump Head */}
                <circle cx="810" cy="310" r="14" fill="#09153a" stroke="#00d2ff" strokeWidth="3" filter="url(#softGlow)" />
                <text x="810" y="313" fill="#ffffff" fontSize="6" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">CORSAIR</text>
                {/* Braided Coolant Tubes */}
                <path d="M 802 300 C 790 275, 785 265, 780 258" stroke="#1f2c4f" strokeWidth="4" fill="none" />
                <path d="M 818 300 C 830 275, 835 265, 840 258" stroke="#1f2c4f" strokeWidth="4" fill="none" />

                {/* 32GB DDR4 Trident Z RGB RAM (Glowing Vertical Bars) */}
                <rect x="836" y="290" width="5" height="32" rx="1.5" fill="url(#ramRgb)" />
                <rect x="844" y="290" width="5" height="32" rx="1.5" fill="url(#ramRgb)" />

                {/* NVIDIA GeForce RTX 3070 Ti Graphics Card */}
                <rect x="755" y="350" width="122" height="28" rx="3" fill="#162035" stroke="#33477f" strokeWidth="1.5" />
                {/* Glowing GPU Logo */}
                <rect x="765" y="358" width="50" height="11" rx="2" fill="#000000" />
                <text x="790" y="366" fill="#76b900" fontSize="6.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">GEFORCE RTX</text>
                {/* GPU Twin Cooling Fans */}
                <circle cx="835" cy="364" r="9" fill="#0a0f1d" stroke="#4974c1" strokeWidth="1" />
                <circle cx="860" cy="364" r="9" fill="#0a0f1d" stroke="#4974c1" strokeWidth="1" />

                {/* Right Chamber Front Panel (Dual RGB Intake Fans Glowing) */}
                <rect x="892" y="246" width="32" height="215" rx="3" fill="#f1f5f9" />
                <circle cx="908" cy="300" r="13" fill={currentGlow.accent} opacity="0.65" filter="url(#softGlow)" />
                <circle cx="908" cy="300" r="13" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="908" cy="380" r="13" fill={currentGlow.accent} opacity="0.65" filter="url(#softGlow)" />
                <circle cx="908" cy="380" r="13" fill="none" stroke="#ffffff" strokeWidth="1.5" />
              </g>

              {/* 10. ELGATO STREAM DECK (Near Keyboard & Mouse) */}
              <g
                id="render-stream-deck"
                className="cursor-pointer group"
                onClick={() => handleSelect(DESK_HOTSPOTS[8])}
              >
                {/* Angled Stand & Chassis */}
                <polygon points="590,380 655,380 650,422 585,422" fill="#12182b" stroke="#33477f" strokeWidth="2" />
                {/* 3x5 Grid of Glowing LCD Keys */}
                <rect x="592" y="384" width="9" height="9" rx="1.5" fill="#ff4757" />
                <rect x="604" y="384" width="9" height="9" rx="1.5" fill="#00d2ff" />
                <rect x="616" y="384" width="9" height="9" rx="1.5" fill="#ffd166" />
                <rect x="628" y="384" width="9" height="9" rx="1.5" fill="#2ed573" />
                <rect x="640" y="384" width="9" height="9" rx="1.5" fill="#9b5de5" />

                <rect x="590" y="396" width="9" height="9" rx="1.5" fill="#00d2ff" />
                <rect x="602" y="396" width="9" height="9" rx="1.5" fill="#ffffff" />
                <rect x="614" y="396" width="9" height="9" rx="1.5" fill="#ff70a6" />
                <rect x="626" y="396" width="9" height="9" rx="1.5" fill="#ffd166" />
                <rect x="638" y="396" width="9" height="9" rx="1.5" fill="#00d2ff" />

                <rect x="588" y="408" width="9" height="9" rx="1.5" fill="#2ed573" />
                <rect x="600" y="408" width="9" height="9" rx="1.5" fill="#093290" />
                <rect x="612" y="408" width="9" height="9" rx="1.5" fill="#ff4757" />
                <rect x="624" y="408" width="9" height="9" rx="1.5" fill="#00d2ff" />
                <rect x="636" y="408" width="9" height="9" rx="1.5" fill="#ffaa00" />
              </g>

              {/* 11. ROYAL KLUDGE RK71 KEYBOARD + CLOUD WRIST REST */}
              <g
                id="render-keyboard"
                className="cursor-pointer group"
                onClick={() => handleSelect(DESK_HOTSPOTS[5])}
              >
                {/* White Coiled Aviation Cable */}
                <path d="M 330 450 C 310 435, 290 435, 275 440 C 260 445, 250 440, 240 430" stroke="#f1f5f9" strokeWidth="4.5" fill="none" strokeDasharray="3,3" />
                {/* Aviation Metal Connector Ring */}
                <circle cx="275" cy="440" r="5" fill="#b0bec5" stroke="#78909c" strokeWidth="1.5" />

                {/* Keyboard Case (White Retro 71-Key Compact) */}
                <rect x="290" y="460" width="190" height="70" rx="6" fill="#f8fafc" stroke="#b5c9ea" strokeWidth="2.5" />

                {/* Keycaps Grid Rows (Crescent White Switches inside) */}
                {/* Function / Number Row */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((k) => (
                  <rect key={`row1-${k}`} x={298 + k * 14} y={467} width={11} height={9} rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                ))}
                {/* QWERTY Row */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((k) => (
                  <rect key={`row2-${k}`} x={298 + k * 14} y={479} width={11} height={9} rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                ))}
                {/* ASDF Row */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((k) => (
                  <rect key={`row3-${k}`} x={298 + k * 14} y={491} width={11} height={9} rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                ))}
                {/* Bottom Row with Spacebar & Arrows */}
                <rect x="335" y="503" width="70" height="9" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                <rect x="440" y="503" width="11" height="9" rx="2" fill="#4974c1" />
                <rect x="454" y="503" width="11" height="9" rx="2" fill="#093290" />
                <rect x="468" y="503" width="11" height="9" rx="2" fill="#4974c1" />

                {/* Cloud-Shaped Foam Wrist Rest in front */}
                <g id="cloud-wrist-rest">
                  <path
                    d="M 290 545
                       C 285 536, 305 530, 318 535
                       C 328 526, 350 526, 358 535
                       C 368 526, 390 526, 398 535
                       C 408 526, 430 526, 438 535
                       C 448 526, 470 526, 478 535
                       C 490 535, 492 546, 485 554
                       C 480 562, 460 562, 452 556
                       C 442 562, 420 562, 412 556
                       C 402 562, 380 562, 372 556
                       C 362 562, 340 562, 332 556
                       C 322 562, 300 562, 292 554 Z"
                    fill="#ffffff"
                    stroke="#cfe0ff"
                    strokeWidth="2"
                    filter="url(#softGlow)"
                  />
                  {/* Cloud pillow indentations */}
                  <ellipse cx="318" cy="544" rx="10" ry="6" fill="#f0f6ff" />
                  <ellipse cx="358" cy="544" rx="10" ry="6" fill="#f0f6ff" />
                  <ellipse cx="398" cy="544" rx="10" ry="6" fill="#f0f6ff" />
                  <ellipse cx="438" cy="544" rx="10" ry="6" fill="#f0f6ff" />
                  <ellipse cx="474" cy="544" rx="10" ry="6" fill="#f0f6ff" />
                </g>
              </g>

              {/* 12. DAREU A950 CINNAMOROLL MOUSE (Right of Keyboard) */}
              <g
                id="render-mouse"
                className="cursor-pointer group"
                onClick={() => handleSelect(DESK_HOTSPOTS[6])}
              >
                {/* Mouse Body (Ergonomic White with Pastel Accents) */}
                <ellipse cx="515" cy="485" rx="18" ry="28" fill="#ffffff" stroke="#cfe0ff" strokeWidth="2" />
                {/* Mouse Button Split Line */}
                <line x1="515" y1="458" x2="515" y2="480" stroke="#cfe0ff" strokeWidth="1.5" />
                {/* Pastel Scroll Wheel */}
                <rect x="512" y="465" width="6" height="11" rx="2" fill="#70d6ff" />
                {/* Subtle Cinnamoroll Cloud / Ear Accent */}
                <path d="M 505 496 Q 515 492 525 496" stroke="#90caf9" strokeWidth="2" fill="none" />
                <circle cx="511" cy="501" r="1.5" fill="#ff70a6" />
                <circle cx="519" cy="501" r="1.5" fill="#ff70a6" />
              </g>

              {/* 13. STEELSERIES ARCTIS 7 WIRELESS HEADSET (Resting on Desk Mat) */}
              <g
                id="render-headset"
                className="cursor-pointer group"
                onClick={() => handleSelect(DESK_HOTSPOTS[7])}
              >
                {/* Headband Ski Goggle Suspension Strap */}
                <path d="M 665 520 C 675 495, 715 495, 725 520" stroke="#f1f5f9" strokeWidth="7" fill="none" strokeLinecap="round" />
                <path d="M 668 518 C 678 502, 712 502, 722 518" stroke="#093290" strokeWidth="2.5" fill="none" />

                {/* Left Earcup with AirWeave velvet cushion */}
                <ellipse cx="665" cy="535" rx="13" ry="18" fill="#ffffff" stroke="#33477f" strokeWidth="2" />
                <ellipse cx="665" cy="535" rx="7" ry="11" fill="#1b253d" />
                {/* Right Earcup */}
                <ellipse cx="725" cy="535" rx="13" ry="18" fill="#ffffff" stroke="#33477f" strokeWidth="2" />
                <ellipse cx="725" cy="535" rx="7" ry="11" fill="#1b253d" />
              </g>

              {/* 14. ELGATO WAVE:3 ON BOOM ARM WITH POP FILTER & PLUSHIE */}
              <g
                id="render-microphone"
                className="cursor-pointer group"
                onClick={() => handleSelect(DESK_HOTSPOTS[4])}
              >
                {/* White Boom Arm Coming in from Right Foreground */}
                <path d="M 850 560 L 680 500 L 600 480" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
                <circle cx="680" cy="500" r="7" fill="#b0bec5" stroke="#78909c" strokeWidth="2" />
                <circle cx="600" cy="480" r="6" fill="#b0bec5" stroke="#78909c" strokeWidth="2" />

                {/* Cute Lamb Mascot Plushie Charm hanging from arm joint! */}
                <line x1="680" y1="507" x2="680" y2="520" stroke="#ffd166" strokeWidth="2" strokeDasharray="2,2" />
                <circle cx="680" cy="528" r="9" fill="#ffffff" stroke="#cfe0ff" strokeWidth="1.5" />
                {/* Mascot Teacup Hat */}
                <rect x="674" y="519" width="12" height="5" rx="1.5" fill="#4974c1" />
                <circle cx="678" cy="527" r="1.5" fill="#093290" />
                <circle cx="682" cy="527" r="1.5" fill="#093290" />

                {/* Shockmount & U-Frame */}
                <path d="M 585 450 C 585 505, 625 505, 625 450" stroke="#ffffff" strokeWidth="4" fill="none" />

                {/* Microphone Body: Elgato Wave:3 (Black Capsule, Gain Dial, LEDs) */}
                <rect x="593" y="440" width="24" height="48" rx="6" fill="#141c2e" stroke="#4974c1" strokeWidth="2" />
                {/* Metal Mesh Grille Top */}
                <rect x="595" y="442" width="20" height="20" rx="3" fill="#0b101c" stroke="#374f8c" strokeWidth="1" />
                <line x1="595" y1="448" x2="615" y2="448" stroke="#4974c1" strokeWidth="0.8" />
                <line x1="595" y1="454" x2="615" y2="454" stroke="#4974c1" strokeWidth="0.8" />

                {/* Multifunctional Gain / Mute Dial with LED indicator dots */}
                <circle cx="605" cy="474" r="5" fill="#1f2d4d" stroke="#00d2ff" strokeWidth="1.5" />
                <circle cx="605" cy="467" r="1.5" fill="#00ff66" />
                <circle cx="602" cy="468" r="1" fill="#00d2ff" />
                <circle cx="608" cy="468" r="1" fill="#00d2ff" />

                {/* Integrated Black Pop Filter Shield */}
                <rect x="586" y="434" width="38" height="28" rx="4" fill="#000000" opacity="0.45" stroke="#ffffff" strokeWidth="1.5" />
              </g>

              {/* 15. INTERACTIVE HOTSPOT BEACON PINS */}
              {DESK_HOTSPOTS.map((item) => {
                const isSelected = activeItem?.id === item.id;
                return (
                  <g
                    key={item.id}
                    className="cursor-pointer group"
                    onClick={() => handleSelect(item)}
                    transform={`translate(${item.pinX}, ${item.pinY})`}
                  >
                    {/* Pulsing ring beacon */}
                    <circle r="16" fill="#00d2ff" opacity="0.3" className="animate-ping" />
                    {/* Pin Outer circle */}
                    <circle
                      r={isSelected ? 16 : 13}
                      fill={isSelected ? '#ffd166' : '#093290'}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="transition-all duration-200"
                    />
                    {/* Pin Emoji / Glyph */}
                    <text
                      y="4"
                      textAnchor="middle"
                      fontSize={isSelected ? '12' : '10'}
                      className="pointer-events-none select-none font-bold"
                    >
                      {item.icon}
                    </text>

                    {/* Hover Label Tooltip */}
                    <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <rect
                        x="-60"
                        y="-38"
                        width="120"
                        height="22"
                        rx="5"
                        fill="#09153acc"
                        stroke="#00d2ff"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="-24"
                        fill="#ffffff"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        {item.name.split(' ')[0]} {item.name.split(' ')[1] || ''}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          /* Full Hardware Spec Sheet Tab */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* PC Rig Specs Card */}
              <div className="p-4 rounded-xl border border-[#b5c9ea] bg-white shadow-sm space-y-2">
                <div className="flex items-center gap-2 pb-2 border-b border-[#eaf1fb]">
                  <span className="text-xl">⚡</span>
                  <h4 className="font-pixel text-sm font-bold text-[#093290]">
                    Computer &amp; Internals
                  </h4>
                </div>
                <ul className="text-xs space-y-1.5 font-mono text-[#0D1D56]">
                  <li><strong className="text-[#4974C1]">Case:</strong> Corsair Crystal 280x White RGB (Dual-Chamber)</li>
                  <li><strong className="text-[#4974C1]">CPU:</strong> Intel Core i9-9900k (8C/16T, up to 5.0 GHz)</li>
                  <li><strong className="text-[#4974C1]">Cooler:</strong> Corsair H100i RGB Platinum 240mm AIO</li>
                  <li><strong className="text-[#4974C1]">GPU:</strong> NVIDIA GeForce RTX 3070 Ti</li>
                  <li><strong className="text-[#4974C1]">Motherboard:</strong> MSI MPG Z390M Gaming Edge AC</li>
                  <li><strong className="text-[#4974C1]">RAM:</strong> 32GB DDR4 Trident Z RGB</li>
                  <li><strong className="text-[#4974C1]">Storage 1:</strong> 1TB Samsung 970 Evo M.2 SSD</li>
                  <li><strong className="text-[#4974C1]">Storage 2:</strong> 1TB Western Digital M.2 NVMe</li>
                  <li><strong className="text-[#4974C1]">Power Supply:</strong> Corsair RMx 750W 80+ Gold Fully Modular</li>
                </ul>
              </div>

              {/* Displays & Video Specs Card */}
              <div className="p-4 rounded-xl border border-[#b5c9ea] bg-white shadow-sm space-y-2">
                <div className="flex items-center gap-2 pb-2 border-b border-[#eaf1fb]">
                  <span className="text-xl">🖥️</span>
                  <h4 className="font-pixel text-sm font-bold text-[#093290]">
                    Monitors &amp; Video Broadcast
                  </h4>
                </div>
                <ul className="text-xs space-y-1.5 font-mono text-[#0D1D56]">
                  <li><strong className="text-[#4974C1]">Main Monitor:</strong> ViewSonic VS2412-h (1080p, 100Hz IPS)</li>
                  <li><strong className="text-[#4974C1]">Second Monitor:</strong> AXM 2428 (Horizontal Layout)</li>
                  <li><strong className="text-[#4974C1]">Webcam:</strong> Canon EOS Rebel T5i (Clean HDMI DSLR)</li>
                  <li><strong className="text-[#4974C1]">Camera Mount:</strong> Solid metal desk clamp mount</li>
                </ul>

                <div className="flex items-center gap-2 pt-3 pb-1 border-b border-[#eaf1fb]">
                  <span className="text-xl">🎙️</span>
                  <h4 className="font-pixel text-sm font-bold text-[#093290]">
                    Audio &amp; Peripherals
                  </h4>
                </div>
                <ul className="text-xs space-y-1.5 font-mono text-[#0D1D56]">
                  <li><strong className="text-[#4974C1]">Microphone:</strong> Elgato Wave:3 on white boom arm with pop filter</li>
                  <li><strong className="text-[#4974C1]">Keyboard:</strong> Royal Kludge RK71, Crescent White Switches</li>
                  <li><strong className="text-[#4974C1]">Wrist Rest:</strong> Ergonomic Cloud Foam Rest</li>
                  <li><strong className="text-[#4974C1]">Cable:</strong> Custom white coiled aviation cable</li>
                  <li><strong className="text-[#4974C1]">Mouse:</strong> Dareu A950 Cinnamoroll Wireless</li>
                  <li><strong className="text-[#4974C1]">Headset:</strong> SteelSeries Arctis 7 Wireless</li>
                  <li><strong className="text-[#4974C1]">Stream Controls:</strong> Elgato Stream Deck (15 LCD keys)</li>
                  <li><strong className="text-[#4974C1]">Console:</strong> Nintendo Switch Animal Crossing Special Edition</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Selected Component Inspector Card */}
        <AnimatePresence>
          {activeItem && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-5 rounded-2xl border-2 border-[#093290] bg-gradient-to-r from-[#eaf1fb] via-white to-[#f4f7fd] shadow-[0_4px_0_rgba(9,50,144,0.1)] relative"
            >
              <button
                onClick={() => {
                  playRetroClick(soundEnabled);
                  setActiveItem(null);
                }}
                className="absolute top-3 right-3 text-[#5E778C] hover:text-[#093290] font-pixel text-xs px-2.5 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕ Close
              </button>

              <div className="flex items-start gap-3.5">
                <span className="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-white border border-[#b5c9ea] shadow-xs">
                  {activeItem.icon}
                </span>

                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-pixel text-[11px] text-[#4974C1] font-bold uppercase tracking-wider">
                      {activeItem.category}
                    </span>
                    <span className="text-[10px] text-[#5E778C]">★ Hardware Inspector</span>
                  </div>

                  <h4 className="font-pixel text-lg sm:text-xl text-[#093290] font-bold leading-tight">
                    {activeItem.name}
                  </h4>

                  {/* Specs List */}
                  <div className="my-3 p-3.5 rounded-xl bg-white border border-[#b5c9ea] space-y-1 text-xs text-[#0D1D56] font-mono">
                    {activeItem.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-1.5">
                        <span className="text-[#4974C1] shrink-0 font-bold">★</span>
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>

                  {/* Personal Note */}
                  <p className="text-xs sm:text-sm text-[#33477f] font-sans-clean leading-relaxed italic bg-[#f9fbff] p-3 rounded-xl border-l-4 border-[#093290]">
                    &quot;{activeItem.note}&quot;
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
