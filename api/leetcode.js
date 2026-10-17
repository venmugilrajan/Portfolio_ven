export default async function handler(req, res) {
  // Set CORS headers so frontend can call this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = `
    query getUserProfile($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        username
        profile {
          ranking
          reputation
          starRating
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
          totalSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://leetcode.com'
      },
      body: JSON.stringify({
        query,
        variables: { username: 'Venmugilrajans' }
      })
    });

    if (!response.ok) {
      throw new Error(`LeetCode responded with HTTP ${response.status}`);
    }

    const data = await response.json();
    // Cache for 15 minutes on Vercel Edge / CDN
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
