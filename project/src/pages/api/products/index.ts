import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();

  if (req.method === 'GET') {
    try {
      const products = await db.all('SELECT * FROM products');
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else if (req.method === 'POST') {
    try {
      const { barcode, name, brand, nutritionFacts, ingredients, certifications, ethicalScore } = req.body;
      
      const result = await db.run(
        `INSERT INTO products (id, barcode, name, brand, nutrition_facts, ingredients, certifications, ethical_score)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          Math.random().toString(36).substr(2, 9),
          barcode,
          name,
          brand,
          JSON.stringify(nutritionFacts),
          JSON.stringify(ingredients),
          JSON.stringify(certifications),
          ethicalScore
        ]
      );
      
      res.status(201).json({ success: true, id: result.lastID });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}