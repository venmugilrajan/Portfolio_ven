import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-leetcode-api',
      configureServer(server) {
        server.middlewares.use('/api/leetcode', async (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
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
            const data = await response.json();
            res.end(JSON.stringify(data));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      }
    }
  ],
  server: {
    historyApiFallback: true,
  },
})
