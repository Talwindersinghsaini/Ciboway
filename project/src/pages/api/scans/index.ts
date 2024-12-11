import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();

  if (req.method === 'POST') {
    try {
      const { userId, productId } = req.body;
      
      const result = await db.run(
        `INSERT INTO scans (id, user_id, product_id)
         VALUES (?, ?, ?)`,
        [
          Math.random().toString(36).substr(2, 9),
          userId,
          productId
        ]
      );
      
      res.status(201).json({ success: true, id: result.lastID });
    } catch (error) {
      res.status(500).json({ error: 'Failed to record scan' });
    }
  } else if (req.method === 'GET') {
    try {
      const { userId } = req.query;
      
      const scans = await db.all(
        `SELECT s.*, p.* 
         FROM scans s
         JOIN products p ON s.product_id = p.id
         WHERE s.user_id = ?
         ORDER BY s.scanned_at DESC`,
        [userId]
      );
      
      res.status(200).json(scans);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch scans' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}