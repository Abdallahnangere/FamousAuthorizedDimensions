import express from 'express';
import { createServer as createViteServer } from 'vite';
import { prisma } from './src/lib/prisma.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Database Table
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS giveaway_entries (
        id SERIAL PRIMARY KEY,
        phone TEXT NOT NULL,
        network TEXT NOT NULL,
        submitted_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('Database table initialized');
  } catch (error) {
    console.error('Failed to initialize database table:', error);
  }

  // API Routes
  app.post('/api/giveaway', async (req, res) => {
    try {
      const { phone, network } = req.body;
      
      if (!phone || !network) {
        return res.status(400).json({ error: 'Phone and network are required' });
      }

      // Validate phone format (Nigerian 11 digits)
      if (!/^0\d{10}$/.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
      }

      // Check for duplicate submission (optional but good practice)
      const existing = await prisma.$queryRawUnsafe(
        'SELECT id FROM giveaway_entries WHERE phone = $1',
        phone
      );
      
      if (existing.length > 0) {
        return res.status(400).json({ error: 'This number has already been entered.' });
      }

      await prisma.$executeRawUnsafe(
        'INSERT INTO giveaway_entries (phone, network) VALUES ($1, $2)',
        phone,
        network
      );

      res.json({ success: true });
    } catch (error) {
      console.error('Error saving entry:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/giveaway/entries', async (req, res) => {
    try {
      const entries = await prisma.$queryRawUnsafe(
        'SELECT * FROM giveaway_entries ORDER BY submitted_at DESC'
      );
      res.json(entries);
    } catch (error) {
      console.error('Error fetching entries:', error);
      // Return empty array if table doesn't exist or other error
      res.json([]);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve static files
    // In this environment, we might not have a build step that produces dist/
    // But the prompt says "npm run build" produces static files in dist/
    // So we should serve from dist/
    app.use(express.static('dist'));
    // SPA fallback
    app.get('*', (req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
