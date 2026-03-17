export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { goal = 'software engineer', type = 'video' } = req.query;
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'YouTube API key not configured' });

  try {
    const query = encodeURIComponent(`${goal} ${type === 'short' ? 'shorts tips' : 'tutorial guide'}`);
    const maxResults = type === 'short' ? 6 : 4;

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=${maxResults}&order=relevance&videoDuration=${type === 'short' ? 'short' : 'medium'}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items) return res.status(500).json({ error: 'No results', raw: data });

    const videos = data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      description: item.snippet.description,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      published: item.snippet.publishedAt,
    }));

    res.status(200).json({ videos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
