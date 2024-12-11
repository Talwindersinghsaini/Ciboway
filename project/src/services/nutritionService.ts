import axios from 'axios';
import { ProductFeatures, NutritionData } from '../types/scoring';

const USDA_API_KEY = process.env.USDA_API_KEY;
const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_API_KEY;

export async function getNutritionalData(
  product: ProductFeatures
): Promise<NutritionData> {
  try {
    // Try USDA database first
    const usdaData = await fetchUSDAData(product);
    if (usdaData) return usdaData;

    // Fallback to Nutritionix
    const nutritionixData = await fetchNutritionixData(product);
    if (nutritionixData) return nutritionixData;

    // Use product's own data as last resort
    return mapProductNutrition(product);
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    return mapProductNutrition(product);
  }
}

async function fetchUSDAData(product: ProductFeatures): Promise<NutritionData | null> {
  try {
    const response = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/foods/search`,
      {
        params: {
          api_key: USDA_API_KEY,
          query: product.name,
          dataType: ['Survey (FNDDS)'],
          pageSize: 1,
        },
      }
    );

    if (response.data.foods?.length > 0) {
      const food = response.data.foods[0];
      return mapUSDANutrition(food);
    }

    return null;
  } catch (error) {
    console.error('USDA API error:', error);
    return null;
  }
}

async function fetchNutritionixData(product: ProductFeatures): Promise<NutritionData | null> {
  try {
    const response = await axios.get(
      'https://trackapi.nutritionix.com/v2/natural/nutrients',
      {
        headers: {
          'x-app-id': process.env.NUTRITIONIX_APP_ID,
          'x-app-key': NUTRITIONIX_API_KEY,
        },
        params: {
          query: product.name,
        },
      }
    );

    if (response.data.foods?.length > 0) {
      const food = response.data.foods[0];
      return mapNutritionixData(food);
    }

    return null;
  } catch (error) {
    console.error('Nutritionix API error:', error);
    return null;
  }
}

function mapUSDANutrition(food: any): NutritionData {
  return {
    calories: food.foodNutrients.find((n: any) => n.nutrientId === 1008)?.value || 0,
    protein: food.foodNutrients.find((n: any) => n.nutrientId === 1003)?.value || 0,
    carbohydrates: food.foodNutrients.find((n: any) => n.nutrientId === 1005)?.value || 0,
    fat: food.foodNutrients.find((n: any) => n.nutrientId === 1004)?.value || 0,
    fiber: food.foodNutrients.find((n: any) => n.nutrientId === 1079)?.value || 0,
    sugar: food.foodNutrients.find((n: any) => n.nutrientId === 2000)?.value || 0,
    sodium: food.foodNutrients.find((n: any) => n.nutrientId === 1093)?.value || 0,
    vitamins: extractVitamins(food.foodNutrients),
    minerals: extractMinerals(food.foodNutrients),
    servingSize: food.servingSize || 100,
    servingUnit: food.servingSizeUnit || 'g',
  };
}

function mapNutritionixData(food: any): NutritionData {
  return {
    calories: food.nf_calories || 0,
    protein: food.nf_protein || 0,
    carbohydrates: food.nf_total_carbohydrate || 0,
    fat: food.nf_total_fat || 0,
    fiber: food.nf_dietary_fiber || 0,
    sugar: food.nf_sugars || 0,
    sodium: food.nf_sodium || 0,
    vitamins: {},
    minerals: {},
    servingSize: food.serving_weight_grams || 100,
    servingUnit: 'g',
  };
}

function mapProductNutrition(product: ProductFeatures): NutritionData {
  return {
    calories: product.nutritionalValues?.calories || 0,
    protein: product.nutritionalValues?.protein || 0,
    carbohydrates: product.nutritionalValues?.carbs || 0,
    fat: product.nutritionalValues?.fat || 0,
    fiber: product.nutritionalValues?.fiber || 0,
    sugar: product.nutritionalValues?.sugar || 0,
    sodium: product.nutritionalValues?.sodium || 0,
    vitamins: {},
    minerals: {},
    servingSize: 100,
    servingUnit: 'g',
  };
}

function extractVitamins(nutrients: any[]): Record<string, number> {
  const vitaminMap: Record<string, number> = {};
  const vitaminIds = [1106, 1162, 1166, 1175, 1177, 1180]; // Vitamin IDs

  nutrients.forEach((nutrient) => {
    if (vitaminIds.includes(nutrient.nutrientId)) {
      vitaminMap[nutrient.nutrientName] = nutrient.value;
    }
  });

  return vitaminMap;
}

function extractMinerals(nutrients: any[]): Record<string, number> {
  const mineralMap: Record<string, number> = {};
  const mineralIds = [1089, 1090, 1091, 1092, 1093, 1094, 1095]; // Mineral IDs

  nutrients.forEach((nutrient) => {
    if (mineralIds.includes(nutrient.nutrientId)) {
      mineralMap[nutrient.nutrientName] = nutrient.value;
    }
  });

  return mineralMap;
}