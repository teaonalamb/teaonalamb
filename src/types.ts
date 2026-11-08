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

export const BLOG_POSTS: BlogPostData[] = [
  {
    id: 'origin-story',
    slug: 'why-i-named-my-channel-after-a-sheep-and-a-teacup',
    title: 'Why I named my channel after a sheep and a teacup',
    date: 'Nov 2, 2026',
    readTime: '4 min read',
    category: 'Origin Story',
    tags: ['Origin Story', 'High School', 'Twitch', 'Streaming'],
    featuredImage: '/sheep-tea.png',
    excerpt: "Plot twist: I can't even take credit for my own name. Let's rewind to 2014 or 2015. I honestly can't remember which, it was that long ago...",
    content: `Plot twist: I can't even take credit for my own name. Let's rewind to 2014 or 2015. I honestly can't remember which, it was that long ago.

I'm 14 or 15 and extremely into school spirit. Our school had a yearly event called Battle of the Classes, or BOTC, or just "Battle." Every year a theme gets picked, then each class votes on a subtheme to use for its performance. It was a whole production: choreography, props, costumes, decorations, script writing, acting, all crammed into a few months. I did the dance portion my first three years. (I tried for the scripts and acting, but the popular kids always got those roles. High school cliques, ugh.)

Every class also designed a custom t-shirt for its subtheme and got them mass printed for the class and parents. That year they were jerseys, so you got a name on the back. Mine could be anything, and I had nothing. I swear I used to be way more quirky and fun. I've dulled it down a lot. But between school, memorizing choreo, 48 hour all-nighters, and dating too many boys, my brain was cooked at 15. I was about to put "Tiana L." and call it a day.

Enter my best friend in the whole wide world, Vivian. It was her first year in the dance portion too, and she already had a good name for her shirt. I think it was something like vivianasausages, as in Vienna sausages. Iconic. She's so smart and creative, I love her. She took her beautiful brain cells and came up with **teaonalamb**.

My name is Tiana, not Teaona like a lot of people think, and my last name sounds exactly like lamb. (I also love eating lamb.) So teaonalamb is basically my full legal name, minus the middle one. ABSOLUTE GENIUS. It was literally just my name and my mind was blown. It went on the back of my shirt, stayed on that shirt, and I forgot about it completely.

Years go by. In 2020 I go through a horrible, messy breakup. By then I've been friends with a streamer for a few years, and I figure, fuck it, what if I stream while we game together? No plan, no username, nothing. (Not the first time I streamed on my Twitch account either. The first time was when I was 13. Story for another day.)

I told Vivian I wanted to try streaming and I was stuck on a name. Somehow my single brain cell dug up that high school shirt, and I had a That's So Raven moment. I remembered the name Vivian made and registered it as my Twitch username. That was July 19th, 2020.

Because the name is so unique, I got it on EVERYTHING. Every social you can think of, even the non-socials. That kicked off my lifetime career as teaonalamb. It's also how "Tea" became my nickname, and why everyone thinks my name is Teaona instead of Tiana.

Memory is so weird. I just turned 26, and my memory gets worse every year even though my frontal lobe literally just finished developing. Yet I remembered one tiny, irrelevant moment from six years earlier, and it turned into my whole brand and the rest of my life.

So, do I like sheep? Sure. They look kinda scary up close, lambs are cute but very loud. I love seeing them on farms by the highway, and I really love eating lamb. I'm not even a sheep in the Chinese zodiac. Tea is more legit. I'm Chinese, so I grew up drinking tea when I was sick, with dim sum for breakfast, or whenever I wanted something warm that wasn't soup. In high school I was obsessed with milk tea and spent $5 every school day on a large Thai tea as an after-school reward. No idea how I had that money while jobless.

So is there a real reason behind the name? No, and also yes. It's my name, legal or not, and it's extremely special to me because of how special the person who came up with it is to me. For the past 6 years, ever since I started putting my time, effort and life into streaming and content creation, I've been Tea. I guess I always will be.`,
  },
  {
    id: 'first-ten-podcast-lessons',
    slug: 'what-i-learned-from-my-first-10-podcast-episodes',
    title: 'What I learned from my first 10 podcast episodes',
    date: 'Oct 1, 2026',
    readTime: '5 min read',
    category: 'Tea Talks',
    tags: ['Tea Talks', 'Podcasting', 'Behind The Scenes', 'Season 2'],
    featuredImage: '/sheep-tea.png',
    excerpt: 'Doing a podcast is easy... but it is also hella hard. The easy part? Literally just hitting record and yapping. The hard part? Editing, time limits, ADHD tangents, and Google Calendar nightmares.',
    content: `Doing a podcast is easy… but it’s also hella hard.

The easy part? Literally just hitting record and yapping. Yapping comes real easy to me. I mean, the T in Tiana basically stands for talkative, so I can *always* find something to talk about, and I could drone on for HOURS on end if you let me.

And honestly, that leads right into the hard part.

### The Struggle of Keeping It Together

First of all, finding topics that are actually interesting, and not just me spiraling through 20 different random topics in a single episode, is a struggle. Deciding on just *one* topic is so hard, especially for someone who probably has ADHD and yaps way too much. I’ll go on tangent after tangent after tangent until I completely forget what I was even talking about in the first place.

Then… oh god, the editing. Editing takes *so* long, which is genuinely the reason I haven’t uploaded a YouTube video in years. Everyone nowadays is like, *"Oh, just use AI!"* but listen, I like saving the earth and caring about living on this dastardly planet a bit longer, okay?

Luckily, editing audio and video for the podcast isn't too bad since I keep it pretty raw and close to what we actually recorded. I don't slice things out unless I absolutely have to, and for audio, I basically just make sure nobody’s blowing out your eardrums or whispering into the void.

### Guests, Time Limits, and Going Bareback

Finding guests is another beast entirely. Yeah, I have a lot of friends, but finding guests I can talk to for an hour straight on a specific topic is tough. I could do interview-style podcasts, but most friends or casual guests aren't super comfortable with that format because they want rapport. So usually, I just skip the interview vibes and find a topic we can both yap about.

Which brings me to another major issue: **sticking to one hour**.

Out of my first 10 episodes, like 2 of them were literally almost TWO HOURS. Two. Hours. I’m no H3H3 loser, why am I making two-hour-long podcasts? (Disclaimer: At least I’ll never have Klein/11 drama on my show. Also, I know literally nothing about H3H3 other than that drama and the Frenemies era with Trisha).

When I record with friends, we yap so much that I completely lose track of time. But I also don't wanna be that buzzkill cutting them off like, *"Okayyy, let's simmer down now, we gotta wrap it up."*

Chatting with my friends is the absolute best part of having a podcast. I always describe my show as a space where you, the listener, can feel completely immersed. If it’s a solo episode, it feels like a 1-on-1 talk. If there are guests, it feels like you're chilling on the couch with us, beer in hand, listening to your friends kick back and chat. I love how casual it is. You're the fly on the wall, or the quiet introvert at the party who gets to sit back and hear all the tea.

That casual vibe also means I sometimes go into episodes completely raw. No condom. Bareback.

No flashcards, no sticky notes with questions on the side, no pre-show meeting with guests about what we can or can't talk about. I just go where the wind takes me and ask whatever pops into my brain. Is it a little unprofessional? Maybe. But it adds to the realness. I don't have many "ums" from thinking of questions, but I *do* get stuck trying to word things because half the time my brain just wants to speak like a caveman:

> *"Had bad day at work. Here is story. White boy think he better than me. Mansplain topic me good at. Stupid white boy. Me older, you younger, you need to respect me because me elder. How dare you. Hope you fired, loser boy. This why you single."*

### Solo Episodes vs. The Google Calendar Nightmare

Ironically, solo episodes are always the easiest and shortest for me. It’s usually 2 AM, I’m completely alone, and I randomly get the sudden urge to record myself yapping about a random topic. I’m constantly checking the time, monitoring my audio levels in OBS, and pacing myself however I want without worrying about rushing or slowing down someone else.

Scheduling guests, on the other hand? An actual nightmare.

Trying to find a day and time where someone can set aside 1 to 1.5 hours is more work than the actual recording. Plans change, timezone differences get in the way, people flake, and worst of all... people forget because **they don't use their calendars!**

USE YOUR CALENDARS, PEOPLE! You have one on your phone for a reason! I live and breathe Google Calendar, I swear.

### The Takeaway & Season 2!

If my first 10 episodes taught me anything, it’s this:

* Podcasting is fun
* Scheduling is hard
* Committing is hard
* Editing is annoying
* ...And I still want to keep doing this, even if I only get a few listens per episode.

I actually took a pretty long 2-year break after my last upload, but I just dropped a brand new episode to kick off **Season 2!** It worked out perfectly because my last episode of Season 1 was Episode 25, so moving forward, we’re doing 25-episode seasons.

Shoutout to my good friend Pixelz for remotivating me to start up the podcast again. I really missed having in-depth chats with my friends. I have so many more wild podcast stories to share soon, including how I found some of my guests and the literal dangerous lengths I’ve gone to just to get a recording.

You can listen to or watch the latest episode right now on [YouTube](https://youtu.be/tBDuqtXSgeQ?si=XFkals7jWgow8yeM), [Spotify](https://open.spotify.com/episode/3Z2nSDyl3argPZuRaJOSgx?si=-xNOLwwXTZWfYkcXA6Iltw), Apple Music, or wherever else you get your podcasts!`,
  },
  {
    id: 'kickback-podcasting',
    slug: 'why-casual-kickback-style-podcasting-beats-polished-interviews',
    title: 'Why Casual Kickback-Style Podcasting Beats Polished Interviews',
    date: 'Oct 18, 2026',
    readTime: '4 min read',
    category: 'Tea Talks',
    tags: ['Tea Talks', 'Podcasting', 'Casual Vibes', 'Kickback'],
    featuredImage: '/sheep-tea.png',
    excerpt: "Let's be real for a second. We've all clicked on a podcast expecting an actual vibe, only to hear someone read off a rigid list of questions like they're conducting a corporate background check...",
    content: `Let’s be real for a second. We’ve all clicked on a podcast expecting an actual vibe, only to hear someone read off a rigid list of questions like they're conducting a corporate background check.

*"So, walk us through your early career."*
*"What are your three habits for peak productivity?"*
*"How does your personal brand align with your five-year growth target?"*

Honestly, total snooze fest. (If I wanted to listen to a formal Q&A, I’d literally just apply for an office job LMAO.)

Think about the only times a standard interview format actually works. When someone sits down with a massive celebrity like Zendaya, Obama, Hasan Piker, or Trisha Paytas, you tune in because you *already* give a shit about the person being questioned. You want to hear about their new movie, their political takes, or their latest unhinged internet drama. The host’s question list is just a vehicle to extract lore from someone who already has millions of eyes on them.

My podcast is not out here interviewing Zendaya.

I don't have massive household names on my show. My guests are random friends, small streamers, or literal strangers I found on dating apps. The average listener doesn't know who they are, and frankly, why the hell would they care about their backstory right out of the gate? Subjecting a random streamer or a friend to a formal interview creates zero interest. Nobody wants to hear an unknown guest give PR-trained responses to generic questions. (It is hella dry to listen to, I swear.)

That is exactly why I am so obsessed with the casual, kickback-style format. I don't want to audit my guests; I want to hang out with them. I want my show to feel like you just walked into the living room, grabbed a drink, and sat down on the couch while your friends yap about absolute nonsense. You get to be the quiet introvert at the kickback who just gets to chill and sip on all the tea.

Here is why that low-key, unscripted energy builds deeper rapport than a polished interview ever could.

---

## 1. Zero Script Means Actual Connection

You know what kills a good conversation fast as hell? Over-preparing.

When a host relies heavily on an interview outline, they aren't actually listening to what the other person is saying. They're just staring at their screen, waiting for a gap so they can jump to Question #4. (Like bro, did you even hear what they just said? LMAO.)

I prefer going into recordings completely unscripted. No sticky notes on the monitor, no pre-show briefings, and no rehearsed topics.

I just let the conversation flow and react to whatever pops into my head. Is it a little chaotic? Definitely. But it makes everything so much more real. If I stumble over my words or my brain completely stalls mid-sentence, I just let it rock. Real human interaction is messy and spontaneous, and that unpolished friction is literally what makes a show fun to listen to.

---

## 2. Unplanned Tangents Are Where the Magic Lives

In a traditional interview, the second a guest strays off-topic, the host pulls them right back onto the main track.

*"That’s great, but steering back to your main project..."*

Why the hell would you stop them right when things were getting good?

In a chill kickback setting, the random detours are literally the best part. I love letting a conversation drift wherever it wants to go. One minute you think you're discussing a simple idea, and twenty minutes later you're arguing about whether hot dogs are sandwiches or sharing a weird story from five years ago. (Classic ADHD brain behavior right there LMAO.)

When guests realize there are no strict rules, their defenses drop completely. They stop acting like a keynote speaker on a stage and start talking like a normal person.

---

## 3. Treating People Like Friends, Not Resume Highlights

Polished interviews treat guests like a walking Wikipedia page. Kickback podcasts treat them like people you actually enjoy hanging out with.

When you aren't bringing on a guest for their famous name, the goal has to be chemistry, not clout. When the focus shifts from auditing someone to just hanging out, the whole energy changes:

* **Nobody feels under pressure:** Guests don't have to worry about giving the perfect, media-trained answer. They can just relax, talk shit, and be themselves.
* **The vibe feels authentic:** People laugh naturally, talk over each other in that familiar way, and completely forget about the clock.
* **The audience gets brought into the circle:** Instead of listening to two strangers network over Zoom, you feel like you're part of the inner friend group.

Even when I record solo, I try to keep that exact same late-night, 1-on-1 vibe, like we're just catching up over food at 3 AM. (Just me, my mic, and whatever random thought is keeping me awake LMAO.)

---

## 4. Keeping It Raw Protects the Vibe

Trying to make content look and sound like a sleek network television production usually ends up stripping away all its fucking soul.

When you over-edit and try to make everything perfectly smooth, you end up cutting out the actual personality of the show. The awkward giggles, the spontaneous reactions, and the random pauses are what make a recording feel alive.

Keeping things raw and low-maintenance lets the natural chemistry do all the heavy lifting. The imperfections aren't mistakes, they're the whole point of the aesthetic.

---

## The Takeaway

At the end of the day, people don't tune into casual podcasts for a formal press tour. They tune in because they want connection, entertainment, and a good vibe.

Unless you're sitting down with an A-list celebrity, a structured Q&A is just going to feel stiff and dry. You don't need a massive PR booking team, a formal interview guide, or fake corporate polish to make content that hits. You just need a mic, good company, and the willingness to yap and see where the conversation lands.

If you want to catch that unscripted kickback energy in action, come hang out! You can listen to or watch my latest podcast episode right now over on [YouTube](https://youtu.be/tBDuqtXSgeQ?si=XFkals7jWgow8yeM), [Spotify](https://www.google.com/search?q=https://open.spotify.com/episode/3Z2nSDyl3argPZuRaJOSgx%3Fsi%3D-xNOLwwXTZWfYkcXA6Iltw), Apple Music, or wherever you listen to podcasts!`,
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
