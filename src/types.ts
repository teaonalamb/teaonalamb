export type PageTab = 'home' | 'socials' | 'blog' | 'twitch' | 'podcast' | 'guestbook';

export interface GuestbookNote {
  id: string;
  author: string;
  message: string;
  date: string;
  color: 'yellow' | 'pink' | 'mint' | 'blue' | 'lavender';
  sticker: 'tea' | 'sheep' | 'star' | 'cloud' | 'heart' | 'boba';
  likes: number;
  rotation?: number;
}

export interface SocialItem {
  platform: string;
  count: string;
  numericCount: number;
  label: string;
  url: string;
  handle: string;
  filename: string;
  color: string;
}

export interface PodcastEpisode {
  id: string;
  num: string;
  title: string;
  date: string;
  duration: string;
  isExplicit: boolean;
  url: string;
  description: string;
}

export interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  tags: string[];
  featuredImage?: string;
  content: string;
}

export const SOCIALS_DATA: SocialItem[] = [
  {
    platform: 'Twitch',
    count: '720',
    numericCount: 720,
    label: 'followers',
    url: 'https://twitch.tv/teaonalamb',
    handle: '@teaonalamb',
    filename: 'twitch.exe',
    color: '#6441a5',
  },
  {
    platform: 'TikTok',
    count: '1.3k',
    numericCount: 1300,
    label: 'followers',
    url: 'https://tiktok.com/@teaonalamb',
    handle: '@teaonalamb',
    filename: 'tiktok.exe',
    color: '#ee1d52',
  },
  {
    platform: 'Instagram',
    count: '668',
    numericCount: 668,
    label: 'followers',
    url: 'https://instagram.com/teaonalamb',
    handle: '@teaonalamb',
    filename: 'instagram.exe',
    color: '#c13584',
  },
  {
    platform: 'X',
    count: '317',
    numericCount: 317,
    label: 'followers',
    url: 'https://x.com/teaonalamb',
    handle: '@teaonalamb',
    filename: 'x.exe',
    color: '#0f1419',
  },
  {
    platform: 'YouTube',
    count: '143',
    numericCount: 143,
    label: 'subscribers',
    url: 'https://youtube.com/@teaonalamb',
    handle: '@teaonalamb',
    filename: 'youtube.exe',
    color: '#ff0000',
  },
  {
    platform: 'Discord',
    count: '89',
    numericCount: 89,
    label: 'members',
    url: 'https://discord.com/invite/VEJYDJP7xM',
    handle: '',
    filename: 'discord.exe',
    color: '#5865f2',
  },
];

export const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    id: 's2e1',
    num: 'S2E1',
    title: 'Mental Health and Self Discovery, ft. GodofPixelz',
    date: 'Oct 8, 2026',
    duration: '1h 20m',
    isExplicit: true,
    url: 'https://rss.com/podcasts/tea-talks/3217354/',
    description: 'Season 2 kickoff episode diving into navigating personal growth and mental well-being while streaming.',
  },
  {
    id: 's1e25',
    num: 'S1E25',
    title: 'What Is Loss? ft. pwnedman',
    date: 'Jun 6, 2024',
    duration: '1h 12m',
    isExplicit: true,
    url: 'https://rss.com/podcasts/tea-talks/1496937/',
    description: 'An open discussion on dealing with grief, gaming memories, and keeping perspective.',
  },
  {
    id: 's1e24',
    num: 'S1E24',
    title: 'Michelin Man? No, Michelin Cook, ft. Martin',
    date: 'May 30, 2024',
    duration: '1h 9m',
    isExplicit: true,
    url: 'https://rss.com/podcasts/tea-talks/1496926/',
    description: 'Stories from culinary high-stakes kitchens and the foods that bring comfort after long streams.',
  },
  {
    id: 'e23',
    num: 'E23',
    title: 'The Fling Strikes Back',
    date: 'Jan 11, 2024',
    duration: '1h 17m',
    isExplicit: true,
    url: 'https://rss.com/podcasts/tea-talks/1251986/',
    description: 'Hilarious dating stories, awkward meetups, and lessons learned the hard way.',
  },
  {
    id: 'e22',
    num: 'E22',
    title: 'New Place, New Stress, ft. Hari',
    date: 'Jan 4, 2024',
    duration: '1h 26m',
    isExplicit: true,
    url: 'https://rss.com/podcasts/tea-talks/1251981/',
    description: 'Moving apartments, room setup chaos, and adjusting to new creative environments.',
  },
];

export const DEFAULT_GUESTBOOK_NOTES: GuestbookNote[] = [
  {
    id: 'note-1',
    author: 'Vivian',
    message: 'teaonalamb forever! Still wearing our high school jerseys haha. Love you bestie! 💖',
    date: 'Nov 2, 2026',
    color: 'pink',
    sticker: 'heart',
    likes: 42,
    rotation: -2,
  },
  {
    id: 'note-2',
    author: 'GodofPixelz',
    message: 'Season 2 kickoff episode was legendary! Keep yapping, never do polished Q&A. 🎙️',
    date: 'Oct 28, 2026',
    color: 'mint',
    sticker: 'star',
    likes: 29,
    rotation: 1.5,
  },
  {
    id: 'note-3',
    author: 'pwnedman',
    message: 'Fly on the wall at the kickback with a beer in hand. Best cozy stream on Twitch! 🐑',
    date: 'Oct 15, 2026',
    color: 'yellow',
    sticker: 'sheep',
    likes: 35,
    rotation: -1,
  },
  {
    id: 'note-4',
    author: 'Hari',
    message: 'Remember to use your Google Calendar!! 📅 Great apartment vibes.',
    date: 'Oct 9, 2026',
    color: 'blue',
    sticker: 'cloud',
    likes: 18,
    rotation: 2,
  },
  {
    id: 'note-5',
    author: 'Martin',
    message: 'Next time I cook Michelin comfort food for the stream crew! Keep the kettle boiling 🫖',
    date: 'Sep 24, 2026',
    color: 'lavender',
    sticker: 'tea',
    likes: 22,
    rotation: -2.5,
  },
  {
    id: 'note-6',
    author: 'CozyLurker',
    message: 'The lo-fi background beats and the starry sky are peak vibes. Love dropping by chat! ✨',
    date: 'Sep 12, 2026',
    color: 'yellow',
    sticker: 'boba',
    likes: 14,
    rotation: 1,
  },
];
