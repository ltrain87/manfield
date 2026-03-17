export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Anthropic API key not configured' });

  const { message, goal, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  try {
    const systemPrompt = `You are Manfield AI — a sharp, focused knowledge guide built into the Manfield app. 
The user's current goal is: "${goal || 'self improvement'}".

Your job:
- Help the user learn and make progress toward their goal
- Recommend specific content, resources, and next steps
- Be direct, concise, and motivating — like a mentor who respects their time
- Keep responses under 150 words unless a detailed breakdown is genuinely needed
- Use short paragraphs, never bullet walls
- Occasionally reference that you can update their feed based on what they want to explore

You are NOT a general assistant. Stay focused on helping them achieve their goal.`;

    const messages = [
      ...history.slice(-6),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 300,
        system: systemPrompt,
        messages
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    res.status(200).json({ reply: data.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
