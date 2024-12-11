import { Request, Response } from 'express';
import { searchProduct } from '../services/productDatabase';
import { analyzeProduct } from '../services/aiScoring';
import { scoreProduct } from '../services/mlScoring';
import { getDb, saveDb } from '../db';
import { getUserPreferences } from '../services/userService';
import { extractProductFeatures } from '../utils/productUtils';

export const scanProduct = async (req: Request, res: Response) => {
  try {
    const { barcode } = req.params;
    
    // First check our local database
    const db = await getDb();
    const localResult = db.exec(`
      SELECT * FROM products WHERE barcode = ?
    `, [barcode]);

    let product;
    if (localResult.length > 0) {
      product = mapDbProductToResponse(localResult[0].values[0]);
    } else {
      // Search external databases
      product = await searchProduct(barcode);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Store in our database for future
      await saveProductToDb(db, product);
    }

    // Get user preferences
    const userPreferences = await getUserPreferences(req.user!.id);

    // Extract features for ML scoring
    const features = extractProductFeatures(product);
    
    // Get ML-based scoring
    const mlScores = await scoreProduct(features);

    // Get AI analysis
    const aiAnalysis = await analyzeProduct(product, userPreferences);

    // Combine scores and analysis
    const finalScore = calculateFinalScore(mlScores, aiAnalysis);
    
    // Record scan
    await recordProductScan(db, req.user!.id, product.id);

    res.json({
      product,
      analysis: {
        ...aiAnalysis,
        ...mlScores,
        finalScore,
        recommendations: aiAnalysis.recommendations,
        warnings: getProductWarnings(product, userPreferences)
      }
    });
  } catch (error) {
    console.error('Error scanning product:', error);
    res.status(500).json({ error: 'Server error' });
  }
};