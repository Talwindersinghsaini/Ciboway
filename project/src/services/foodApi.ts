import axios from 'axios';
import { predictScore } from './mlScoring';

export interface ProductData {
  product: {
    code: string;
    product_name: string;
    brands?: string;
    ecoscore_grade?: string;
    nutriscore_grade?: string;
    nutriments: {
      'energy-kcal_100g'?: number;
      proteins_100g?: number;
      carbohydrates_100g?: number;
      fat_100g?: number;
      fiber_100g?: number;
      'sodium_100g'?: number;
    };
    labels_tags?: string[];
    packaging_tags?: string[];
    origins_tags?: string[];
    ingredients_text?: string;
  };
  status: number;
}

export async function getProductByBarcode(barcode: string): Promise<ProductData | null> {
  try {
    const response = await axios.get<ProductData>(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
    );

    if (response.data.status === 1) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function calculateEthicalScore(product: ProductData['product']): Promise<number> {
  try {
    // Get ML-based prediction
    const mlScore = await predictScore(product);
    
    // Get rule-based score
    const ruleScore = calculateRuleBasedScore(product);
    
    // Combine scores (70% ML, 30% rules)
    return Math.round((mlScore * 0.7) + (ruleScore * 0.3));
  } catch (error) {
    console.error('Error calculating ML score:', error);
    // Fallback to rule-based scoring
    return calculateRuleBasedScore(product);
  }
}

function calculateRuleBasedScore(product: ProductData['product']): number {
  let score = 50; // Base score

  // Eco-score impact
  const ecoScoreMap = { a: 20, b: 15, c: 10, d: 5, e: 0 };
  if (product.ecoscore_grade) {
    score += ecoScoreMap[product.ecoscore_grade.toLowerCase() as keyof typeof ecoScoreMap] || 0;
  }

  // Certifications impact
  const labels = product.labels_tags || [];
  if (labels.includes('en:organic')) score += 15;
  if (labels.includes('en:fair-trade')) score += 15;
  if (labels.includes('en:rainforest-alliance')) score += 10;

  // Packaging impact
  const packaging = product.packaging_tags || [];
  if (packaging.includes('en:recyclable')) score += 5;
  if (packaging.includes('en:biodegradable')) score += 5;

  // Nutrition impact
  if (product.nutriscore_grade === 'a') score += 10;
  if (product.nutriscore_grade === 'b') score += 5;
  if (product.nutriscore_grade === 'e') score -= 10;

  // Origin impact
  if (product.origins_tags?.includes('en:local')) score += 10;

  return Math.min(Math.max(score, 0), 100);
}