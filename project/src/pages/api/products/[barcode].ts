import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();
  const { barcode } = req.query;

  if (req.method === 'GET') {
    try {
      const product = await db.get('SELECT * FROM products WHERE barcode = ?', [barcode]);
      
      if (!product) {
        // If product not found in local DB, fetch from external API
        const externalProduct = await fetchExternalProduct(barcode as string);
        if (externalProduct) {
          // Save to local DB and return
          await saveProduct(db, externalProduct);
          res.status(200).json(externalProduct);
        } else {
          res.status(404).json({ error: 'Product not found' });
        }
      } else {
        res.status(200).json(product);
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function fetchExternalProduct(barcode: string) {
  try {
    // Fetch from Open Food Facts API
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await response.json();
    
    if (data.status === 1) {
      return {
        barcode,
        name: data.product.product_name,
        brand: data.product.brands,
        nutritionFacts: {
          calories: data.product.nutriments['energy-kcal_100g'],
          protein: data.product.nutriments.proteins_100g,
          carbohydrates: data.product.nutriments.carbohydrates_100g,
          fat: data.product.nutriments.fat_100g,
        },
        ingredients: data.product.ingredients_text,
        certifications: data.product.labels_tags,
        ethicalScore: calculateEthicalScore(data.product),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching from external API:', error);
    return null;
  }
}

async function saveProduct(db: any, product: any) {
  await db.run(
    `INSERT INTO products (id, barcode, name, brand, nutrition_facts, ingredients, certifications, ethical_score)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      Math.random().toString(36).substr(2, 9),
      product.barcode,
      product.name,
      product.brand,
      JSON.stringify(product.nutritionFacts),
      product.ingredients,
      JSON.stringify(product.certifications),
      product.ethicalScore,
    ]
  );
}

function calculateEthicalScore(product: any): number {
  let score = 50; // Base score

  // Certifications boost
  const certifications = product.labels_tags || [];
  if (certifications.includes('en:organic')) score += 15;
  if (certifications.includes('en:fair-trade')) score += 15;
  if (certifications.includes('en:rainforest-alliance')) score += 10;

  // Packaging impact
  const packaging = product.packaging_tags || [];
  if (packaging.includes('en:recyclable')) score += 5;
  if (packaging.includes('en:biodegradable')) score += 5;

  // Nutrition impact
  const nutriscore = product.nutriscore_grade;
  if (nutriscore === 'a') score += 10;
  if (nutriscore === 'b') score += 5;
  if (nutriscore === 'e') score -= 10;

  // Origin impact
  if (product.origins_tags?.includes('en:local')) score += 10;

  return Math.min(Math.max(score, 0), 100); // Ensure score is between 0 and 100
}