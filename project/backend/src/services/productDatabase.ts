import axios from 'axios';

const OFF_API = 'https://world.openfoodfacts.org/api/v2';

export async function searchProduct(barcode: string) {
  try {
    const response = await axios.get(`${OFF_API}/product/${barcode}`);
    
    if (response.data.status === 1) {
      const product = response.data.product;
      return {
        barcode,
        name: product.product_name,
        brand: product.brands,
        nutritionFacts: {
          calories: product.nutriments['energy-kcal_100g'],
          protein: product.nutriments.proteins_100g,
          carbohydrates: product.nutriments.carbohydrates_100g,
          fat: product.nutriments.fat_100g,
        },
        ingredients: product.ingredients_text,
        certifications: product.labels_tags || [],
        ethicalScore: calculateEthicalScore(product),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching from Open Food Facts:', error);
    return null;
  }
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

  return Math.min(Math.max(score, 0), 100);
}