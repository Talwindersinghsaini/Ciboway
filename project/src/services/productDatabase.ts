import axios from 'axios';
import { OpenFoodFactsProduct } from '../types/product';

const OFF_API = 'https://world.openfoodfacts.org/api/v2';
const USDA_API = 'https://api.nal.usda.gov/fdc/v1';
const USDA_KEY = process.env.USDA_API_KEY;

export async function searchProduct(barcode: string): Promise<OpenFoodFactsProduct | null> {
  try {
    // Try Open Food Facts first
    const offResponse = await axios.get(`${OFF_API}/product/${barcode}`);
    if (offResponse.data.status === 1) {
      return offResponse.data.product;
    }

    // Try USDA database as fallback
    const usdaResponse = await axios.get(`${USDA_API}/foods/search`, {
      params: {
        api_key: USDA_KEY,
        query: barcode,
      },
    });

    if (usdaResponse.data.foods?.length > 0) {
      return mapUSDAToProduct(usdaResponse.data.foods[0]);
    }

    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}