export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { goal = 'software engineer' } = req.query;
  const g = goal.toLowerCase();

  const topicSets = {
    'software engineer': {
      tiktok: [
        { topic: 'Career', title: 'Day in the Life: SWE', desc: 'Real engineers showing what the job actually looks like', query: 'software engineer day in life' },
        { topic: 'Learning', title: 'Learn to Code Fast', desc: 'The fastest paths from zero to writing real code', query: 'learn to code beginner tips 2025' },
        { topic: 'Money', title: 'SWE Salaries & Levels', desc: 'Real comp breakdowns, negotiation tips, leveling up', query: 'software engineer salary career growth' },
        { topic: 'Interview', title: 'Cracking Tech Interviews', desc: 'Walkthroughs of real FAANG interview questions', query: 'coding interview prep tips faang' },
      ],
      instagram: [
        { topic: 'Community', title: '#SoftwareEngineer', desc: 'Engineers worldwide sharing their work and journey', tag: 'softwareengineer' },
        { topic: 'Challenge', title: '#100DaysOfCode', desc: 'Join thousands documenting their daily coding journey', tag: '100daysofcode' },
        { topic: 'Lifestyle', title: '#CodingLife', desc: 'The culture and aesthetic of building software', tag: 'codinglife' },
        { topic: 'Jobs', title: '#TechJobs', desc: 'Opportunities and behind-the-scenes at top tech companies', tag: 'techjobs' },
      ]
    },
    'entrepreneur': {
      tiktok: [
        { topic: 'Mindset', title: 'Founder Stories', desc: 'Real founders sharing the raw truth of building a company', query: 'entrepreneur founder startup story' },
        { topic: 'Money', title: 'Making Your First $10K', desc: 'Practical steps from zero to first real revenue', query: 'make money online business first 10k' },
        { topic: 'Growth', title: 'Scaling a Business', desc: 'What changes when you go from idea to real customers', query: 'scaling small business growth tips' },
        { topic: 'Ideas', title: 'Business Ideas 2025', desc: 'Low-cost business models that are actually working right now', query: 'business ideas 2025 low cost startup' },
      ],
      instagram: [
        { topic: 'Hustle', title: '#Entrepreneur', desc: 'The entrepreneur community sharing wins and lessons', tag: 'entrepreneur' },
        { topic: 'Startup', title: '#StartupLife', desc: 'Behind the scenes of building companies from scratch', tag: 'startuplife' },
        { topic: 'Money', title: '#PassiveIncome', desc: 'Real strategies for building income outside a 9-5', tag: 'passiveincome' },
        { topic: 'Brand', title: '#PersonalBrand', desc: 'How to build an audience around your expertise', tag: 'personalbrand' },
      ]
    },
    'designer': {
      tiktok: [
        { topic: 'Portfolio', title: 'Designer Portfolio Tips', desc: 'What actually gets you hired as a designer in 2025', query: 'designer portfolio tips get hired 2025' },
        { topic: 'Tools', title: 'Figma Tips & Tricks', desc: 'Pro shortcuts and workflows that save hours every week', query: 'figma tips tricks designer workflow' },
        { topic: 'Career', title: 'UX Design Career', desc: 'Breaking into UX from any background', query: 'ux design career switch beginner' },
        { topic: 'Inspo', title: 'Design Inspiration', desc: 'Beautiful work that will change how you see design', query: 'graphic design inspiration trends 2025' },
      ],
      instagram: [
        { topic: 'Work', title: '#UIDesign', desc: 'The best UI work being shared right now', tag: 'uidesign' },
        { topic: 'Process', title: '#DesignProcess', desc: 'Designers showing their work from sketch to final', tag: 'designprocess' },
        { topic: 'Type', title: '#Typography', desc: 'The art and craft of type from the best designers', tag: 'typography' },
        { topic: 'Brand', title: '#BrandIdentity', desc: 'Stunning branding projects from around the world', tag: 'brandidentity' },
      ]
    },
    'default': {
      tiktok: [
        { topic: 'Growth', title: `${goal} Journey`, desc: `Real people documenting their path to becoming a ${goal}`, query: `${goal} journey beginner tips` },
        { topic: 'Tips', title: `${goal} Tips`, desc: `The most practical advice from people already doing it`, query: `${goal} tips advice 2025` },
        { topic: 'Career', title: `${goal} Career`, desc: `What the career path actually looks like day to day`, query: `${goal} career day in life` },
        { topic: 'Learn', title: `Learn ${goal} Skills`, desc: `The fastest ways to build the skills you need`, query: `how to become ${goal} fast` },
      ],
      instagram: [
        { topic: 'Community', title: `#${goal.replace(/ /g,'')}`, desc: `The ${goal} community sharing work and ideas`, tag: goal.replace(/ /g,'').toLowerCase() },
        { topic: 'Inspo', title: `#${goal.replace(/ /g,'')}Life`, desc: `What life looks like when you're doing what you love`, tag: `${goal.replace(/ /g,'').toLowerCase()}life` },
        { topic: 'Tips', title: `#${goal.replace(/ /g,'')}Tips`, desc: `Practical advice from people already in the field`, tag: `${goal.replace(/ /g,'').toLowerCase()}tips` },
        { topic: 'Goals', title: `#${goal.replace(/ /g,'')}Goals`, desc: `The community sharing milestones and wins`, tag: `${goal.replace(/ /g,'').toLowerCase()}goals` },
      ]
    }
  };

  let set = topicSets['default'];
  for (const key of Object.keys(topicSets)) {
    if (g.includes(key)) { set = topicSets[key]; break; }
  }

  const tiktokCards = set.tiktok.map(t => ({
    ...t,
    url: `https://www.tiktok.com/search?q=${encodeURIComponent(t.query)}`,
    platform: 'tiktok'
  }));

  const igCards = set.instagram.map(t => ({
    ...t,
    url: `https://www.instagram.com/explore/tags/${t.tag}/`,
    platform: 'instagram'
  }));

  res.status(200).json({ tiktok: tiktokCards, instagram: igCards });
}
