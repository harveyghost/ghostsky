// Ghostsky's Worker entry point. Handles one job: generate real Open Graph
// meta tags for post/profile links so Discord/Slack/iMessage/etc. show a
// rich preview instead of a bare URL. Every other request just falls
// through to the static site (env.ASSETS) untouched.
//
// Why this exists: this is a pure static SPA — every URL normally serves
// the same generic index.html, so a crawler bot reading raw HTML never
// sees per-post data. Real Bluesky solves this with their own Go server;
// this is the Worker-native equivalent for a Cloudflare Workers deployment.

const BOT_UA_PATTERNS = [
  'discordbot',
  'slackbot',
  'twitterbot',
  'facebookexternalhit',
  'linkedinbot',
  'telegrambot',
  'whatsapp',
  'skypeuripreview',
  'redditbot',
  'pinterest',
  'embedly',
  'quora link preview',
  'outbrain',
  'vkshare',
  'facebot',
  'bot',
]

function isBot(ua) {
  if (!ua) return false
  const lower = ua.toLowerCase()
  return BOT_UA_PATTERNS.some(p => lower.includes(p))
}

function esc(str) {
  return String(str || '').replace(
    /[&<>"']/g,
    c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c],
  )
}

function ogPage({title, description, image, url, type, publishedTime}) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${esc(title)}</title>
<link rel="canonical" href="${esc(url)}">
<link rel="icon" href="https://ghostsky.app/favicon.png">
<meta name="theme-color" content="#8B7FD6">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
${image ? `<meta property="og:image" content="${esc(image)}">` : ''}
<meta property="og:type" content="${type}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:site_name" content="Ghostsky">
${publishedTime ? `<meta property="article:published_time" content="${esc(publishedTime)}">` : ''}
<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
${image ? `<meta name="twitter:image" content="${esc(image)}">` : ''}
</head>
<body>
<p><a href="${esc(url)}">${esc(title)}</a>: ${esc(description)}</p>
</body>
</html>`
}

function ogResponse(html) {
  // GHOST: Vary: User-Agent is the important part here — without it,
  // Cloudflare's edge cache stores one response per URL regardless of who's
  // asking. The first bot to hit a profile/post link would get its OG-only
  // HTML cached, and a real human clicking that same link afterward could
  // then be served that same cached bot response instead of the real app.
  // This tells Cloudflare to cache bot and non-bot responses separately.
  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
      'cache-control': 'public, max-age=300',
      vary: 'User-Agent',
    },
  })
}

async function handlePost(handle, rkey, requestUrl) {
  const profileRes = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`,
  )
  if (!profileRes.ok) return null
  const profile = await profileRes.json()

  const postUri = `at://${profile.did}/app.bsky.feed.post/${rkey}`
  const postRes = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(postUri)}&depth=0`,
  )
  if (!postRes.ok) return null
  const threadData = await postRes.json()
  const post = threadData.thread && threadData.thread.post
  if (!post) return null

  const text = (post.record && post.record.text) || ''
  const authorName = profile.displayName || profile.handle
  const image =
    (post.embed && post.embed.images && post.embed.images[0] && post.embed.images[0].fullsize) ||
    (post.embed && post.embed.media && post.embed.media.images && post.embed.media.images[0] && post.embed.media.images[0].fullsize) ||
    profile.avatar ||
    ''

  return ogPage({
    title: `${authorName} (@${profile.handle})`,
    description: text.slice(0, 200),
    image,
    url: requestUrl,
    type: 'article',
    publishedTime: (post.record && post.record.createdAt) || '',
  })
}

async function handleProfile(handle, requestUrl) {
  const profileRes = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`,
  )
  if (!profileRes.ok) return null
  const profile = await profileRes.json()

  return ogPage({
    title: `${profile.displayName || profile.handle} (@${profile.handle})`,
    description: profile.description || '',
    image: profile.avatar || '',
    url: requestUrl,
    type: 'profile',
  })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const ua = request.headers.get('user-agent') || ''

    if (isBot(ua)) {
      // /profile/{handle}/post/{rkey}
      const postMatch = url.pathname.match(/^\/profile\/([^/]+)\/post\/([^/]+)\/?$/)
      // /profile/{handle}
      const profileMatch = url.pathname.match(/^\/profile\/([^/]+)\/?$/)

      try {
        if (postMatch) {
          const html = await handlePost(postMatch[1], postMatch[2], request.url)
          if (html) {
            return ogResponse(html)
          }
        } else if (profileMatch) {
          const html = await handleProfile(profileMatch[1], request.url)
          if (html) {
            return ogResponse(html)
          }
        }
      } catch (e) {
        // fall through to static assets on any error — never break the real site
      }
    }

    // Everyone else (real browsers, or bot requests that didn't match/failed
    // above) gets the normal static site. Also mark this response as varying
    // by User-Agent, for the same cache-correctness reason as ogResponse()
    // above — otherwise a bot's cached OG response could get served to a
    // real browser hitting the same URL, or vice versa.
    const assetResponse = await env.ASSETS.fetch(request)
    const response = new Response(assetResponse.body, assetResponse)
    response.headers.set('vary', 'User-Agent')
    return response
  },
}
