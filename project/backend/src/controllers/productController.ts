import { Request, Response } from 'express';
import { getDb } from '../db';
import { searchProduct } from '../services/productDatabase';
import { calculateProductScore } from '../services/productScoring';

export const scanProduct = async (req: Request, res: Response) => {
  try {
    const { barcode } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }

    const db = getDb();
    
    // First check our local database
    const stmt = db.prepare('SELECT * FROM products WHERE barcode = ?');
    const localProduct = stmt.get(barcode);

    let product;
    if (localProduct) {
      product = localProduct;
    } else {
      // Search external databases
      product = await searchProduct(barcode);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Store in our database for future
      const insertStmt = db.prepare(`
        INSERT INTO products (
          id, barcode, name, brand, nutrition_facts,
          ingredients, certifications, ethical_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertStmt.run(
        Math.random().toString(36).substr(2, 9),
        product.barcode,
        product.name,
        product.brand,
        JSON.stringify(product.nutritionFacts),
        JSON.stringify(product.ingredients),
        JSON.stringify(product.certifications),
        product.ethicalScore
      );
    }

    // Record scan
    const scanStmt = db.prepare(`
      INSERT INTO scans (id, user_id, product_id)
      VALUES (?, ?, ?)
    `);

    scanStmt.run(
      Math.random().toString(36).substr(2, 9),
      userId,
      product.id
    );

    // Calculate score based on user preferences
    const score = await calculateProductScore(product, userId);

    res.json({
      product,
      score,
      scannedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error scanning product:', error);
    res.status(500).json({ error: 'Failed to scan product' });
  }
};