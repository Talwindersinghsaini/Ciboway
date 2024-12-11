// Modify the existing handler to use async scoring
import { NextApiRequest, NextApiResponse } from 'next';
import { getProductByBarcode, calculateEthicalScore } from '@/services/foodApi';
import { getDb } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { barcode } = req.query;

  try {
    // First check local cache
    const db = await getDb();
    const cachedProduct = await db.get(
      'SELECT * FROM products WHERE barcode = ?',
      [barcode]
    );

    if (cachedProduct) {
      return res.status(200).json(cachedProduct);
    }

    // Fetch from Open Food Facts
    const productData = await getProductByBarcode(barcode as string);
    
    if (!productData) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Calculate ethical score using ML-enhanced scoring
    const ethicalScore = await calculateEthicalScore(productData.product);
    
    // Rest of the existing handler code...
    
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product data' });
  }
}