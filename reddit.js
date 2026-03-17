export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { goal = 'software engineer' } = req.query;

  // Map goals to relevant subreddits
  const subredditMap = {
    'software engineer': ['cscareerquestions', 'learnprogramming', 'webdev', 'programming'],
    'entrepreneur': ['entrepreneur', 'startups', 'smallbusiness', 'SideProject'],
    'designer': ['design', 'graphic_design', 'UI_Design', 'web_design'],
    'investor': ['investing', 'personalfinance', 'stocks', 'financialindependence'],
    'fitness coach': ['fitness', 'bodybuilding', 'xxfitness', 'gym'],
    'content creator': ['NewTubers', 'TikTokCreators', 'content_marketing', 'socialmedia'],
  };

  const goalLower = goal.toLowerCase();
  let subs = ['learnprogramming', 'cscareerquestions'];
  for (const [key, val] of Object.entries(subredditMap)) {
    if (goalLower.includes(key)) { subs = val; break; }
  }

  try {
    const results = await Promise.allSettled(
      subs.slice(0, 3).map(sub =>
        fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=3`, {
          headers: { 'User-Agent': 'Manfield/1.0' }
        }).then(r => r.json())
      )
    );

    const posts = [];
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value?.data?.children) {
        for (const child of result.value.data.children.slice(0, 2)) {
          const p = child.data;
          if (p.stickied || p.score < 100) continue;
          posts.push({
            id: p.id,
            title: p.title,
            subreddit: p.subreddit,
            score: p.score,
            comments: p.num_comments,
            url: `https://reddit.com${p.permalink}`,
            thumbnail: p.thumbnail && p.thumbnail.startsWith('http') ? p.thumbnail : null,
          });
        }
      }
    }

    res.status(200).json({ posts: posts.slice(0, 6) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
