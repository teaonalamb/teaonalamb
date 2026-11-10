export type PageTab =
  | 'home'
  | 'socials'
  | 'blog'
  | 'twitch'
  | 'podcast'
  | 'guestbook'
  | 'merch';

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
  audioUrl?: string;
  imageUrl?: string;
  transcriptUrl?: string;
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

import rawSocialsData from './socials-data.json';

export const SOCIALS_DATA: SocialItem[] = (rawSocialsData as SocialItem[]) || [];

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
    id: 'note-cozy-lurker',
    author: 'CozyLurker',
    message: 'The lo-fi background beats and the starry sky are peak vibes. Love dropping by chat! ✨',
    date: 'Sep 12, 2026',
    color: 'yellow',
    sticker: 'boba',
    likes: 14,
    rotation: 1,
  },
];
