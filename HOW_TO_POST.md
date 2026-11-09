# How to publish a blog post

No code, no AI. Just a text file.

1. Go to the repo on github.com, open `src/posts/`.
2. Click **Add file > Create new file**.
3. Name it like `my-post-title.md` (lowercase, dashes, ends in `.md`). The file name becomes the post link.
4. Copy everything from `src/posts/_template.md`, paste it in, and fill it out.
5. Click **Commit changes**. The site rebuilds in a minute or two and the post shows up.

## The top block (between the `---` lines)

| Line | What it does |
|---|---|
| `title:` | Post title. Required. |
| `date:` | When it goes live, in Pacific time. `2026-11-20` or `2026-11-20 19:00`. **A future date means scheduled.** The post stays hidden until then. |
| `category:` | The label in the card header. |
| `tags:` | Comma separated. Shows as #hashtags. |
| `excerpt:` | Optional blurb for the list. If missing, the site uses the first lines of the post. |
| `draft:` | Optional. `draft: true` hides it no matter the date. |
| `slug:` | Optional. Custom link name. Default is the file name. |

Read time is worked out for you.

**Keep `title:` and `excerpt:` inside double quotes**, like `title: "My post: part 2"`. This stops GitHub from showing a red "Error in user YAML" box when the text has a colon. The site works either way, but the quotes keep GitHub happy. Do not use double quote marks inside the text itself, use single quotes there.

## Writing

Blank line between paragraphs. `## Heading`, `### Smaller heading`, `**bold**`, `*italic*`, `[link text](url)`, `* bullet`, `> quote`, and `---` for a divider.

## Pictures

1. Upload the image into the `public/blog/` folder (Add file > Upload files).
2. In the post, add `![Caption](/blog/your-image.png)` on its own line.

## Scheduling notes

- Scheduling works when a visitor loads the site. No rebuild needed at publish time. Commit the file ahead of time with a future date.
- The post text is inside the site files, so a very technical person could find a scheduled post early. Fine for blog posts, not for secrets.
- A visitor who already has the site open sees the new post after refreshing.
