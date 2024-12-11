import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();

  if (req.method === 'POST') {
    try {
      const { email, name, preferences } = req.body;
      
      const result = await db.run(
        `INSERT INTO users (id, email, name, preferences)
         VALUES (?, ?, ?, ?)`,
        [
          Math.random().toString(36).substr(2, 9),
          email,
          name,
          JSON.stringify(preferences)
        ]
      );
      
      res.status(201).json({ success: true, id: result.lastID });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}