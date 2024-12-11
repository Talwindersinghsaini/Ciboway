import { ProductFeatures, ScoringResult, UserPreferences } from '../types/scoring';
import { analyzeWithOpenAI } from './aiScoring';
import { getNutritionalData } from './nutritionService';
import { getEnvironmentalData } from './environmentService';

export async function calculateProductScore(
  product: ProductFeatures,
  userPreferences: UserPreferences
): Promise<ScoringResult> {
  // Base scores
  const scores = {
    nutrition: await calculateNutritionScore(product, userPreferences),
    environmental: await calculateEnvironmentalScore(product),
    ethical: await calculateEthicalScore(product),
    social: await calculateSocialScore(product),
  };

  // AI-enhanced analysis
  const aiAnalysis = await analyzeWithOpenAI(product, userPreferences);

  // Weight factors based on user preferences
  const weights = calculateUserWeights(userPreferences);

  // Calculate final score
  const finalScore = (
    scores.nutrition * weights.nutrition +
    scores.environmental * weights.environmental +
    scores.ethical * weights.ethical +
    scores.social * weights.social +
    aiAnalysis.score * 0.2 // AI score weight
  ) / (
    weights.nutrition +
    weights.environmental +
    weights.ethical +
    weights.social +
    0.2
  );

  return {
    overallScore: Math.round(finalScore),
    nutritionScore: scores.nutrition,
    environmentalScore: scores.environmental,
    ethicalScore: scores.ethical,
    socialScore: scores.social,
    aiRecommendations: aiAnalysis.recommendations,
    warnings: aiAnalysis.warnings,
    certifications: product.certifications,
    sustainabilityMetrics: {
      carbonFootprint: product.environmentalData?.carbonFootprint,
      waterUsage: product.environmentalData?.waterUsage,
      packagingWaste: product.environmentalData?.packagingWaste,
    },
    matchScore: calculatePreferenceMatch(product, userPreferences),
  };
}

async function calculateNutritionScore(
  product: ProductFeatures,
  preferences: UserPreferences
): Promise<number> {
  const nutritionData = await getNutritionalData(product);
  let score = 70; // Base score

  // Diet type alignment
  if (preferences.dietary?.dietType) {
    score += calculateDietTypeAlignment(nutritionData, preferences.dietary.dietType);
  }

  // Nutritional values
  score += evaluateNutritionalValues(nutritionData, preferences);

  // Allergen check
  if (hasAllergenConflict(nutritionData, preferences)) {
    score = 0; // Critical failure if allergens present
  }

  return Math.min(100, Math.max(0, score));
}

async function calculateEnvironmentalScore(product: ProductFeatures): Promise<number> {
  const envData = await getEnvironmentalData(product);
  let score = 50; // Base score

  // Carbon footprint impact
  score += calculateCarbonImpact(envData.carbonFootprint);

  // Packaging sustainability
  score += evaluatePackaging(product.packaging);

  // Transportation impact
  score += calculateTransportationScore(envData.transportationData);

  // Water usage
  score += evaluateWaterUsage(envData.waterUsage);

  return Math.min(100, Math.max(0, score));
}

async function calculateEthicalScore(product: ProductFeatures): Promise<number> {
  let score = 50; // Base score

  // Certification bonuses
  const certifications = product.certifications || [];
  if (certifications.includes('fair-trade')) score += 15;
  if (certifications.includes('organic')) score += 10;
  if (certifications.includes('rainforest-alliance')) score += 10;
  if (certifications.includes('b-corp')) score += 10;

  // Labor practices
  if (product.laborPractices?.fairLabor) score += 10;
  if (product.laborPractices?.livingWage) score += 10;

  // Animal welfare
  if (product.animalWelfare?.certified) score += 10;
  if (product.animalWelfare?.freeRange) score += 5;

  // Supply chain transparency
  if (product.supplyChain?.transparent) score += 10;
  if (product.supplyChain?.traceable) score += 5;

  return Math.min(100, Math.max(0, score));
}

async function calculateSocialScore(product: ProductFeatures): Promise<number> {
  let score = 50; // Base score

  // Community impact
  if (product.communityImpact?.localProduction) score += 15;
  if (product.communityImpact?.smallBusiness) score += 10;

  // Worker welfare
  if (product.workerWelfare?.benefits) score += 10;
  if (product.workerWelfare?.safeConditions) score += 10;

  // Cultural preservation
  if (product.culturalImpact?.preservesTraditions) score += 5;
  if (product.culturalImpact?.supportsIndigenous) score += 10;

  return Math.min(100, Math.max(0, score));
}

function calculateUserWeights(preferences: UserPreferences) {
  return {
    nutrition: preferences.weightings?.nutrition || 1,
    environmental: preferences.weightings?.environmental || 1,
    ethical: preferences.weightings?.ethical || 1,
    social: preferences.weightings?.social || 1,
  };
}

function calculatePreferenceMatch(
  product: ProductFeatures,
  preferences: UserPreferences
): number {
  let matchScore = 100;
  let matchPoints = 0;
  let totalPoints = 0;

  // Diet type matching
  if (preferences.dietary?.dietType) {
    totalPoints += 3;
    if (matchesDietType(product, preferences.dietary.dietType)) {
      matchPoints += 3;
    }
  }

  // Ethical preferences matching
  if (preferences.ethical) {
    Object.entries(preferences.ethical).forEach(([pref, importance]) => {
      totalPoints += importance as number;
      if (matchesEthicalPreference(product, pref)) {
        matchPoints += importance as number;
      }
    });
  }

  // Environmental preferences matching
  if (preferences.environmental) {
    Object.entries(preferences.environmental).forEach(([pref, importance]) => {
      totalPoints += importance as number;
      if (matchesEnvironmentalPreference(product, pref)) {
        matchPoints += importance as number;
      }
    });
  }

  return totalPoints > 0 ? (matchPoints / totalPoints) * 100 : 100;
}

// Helper functions for preference matching
function matchesDietType(product: ProductFeatures, dietType: string): boolean {
  // Implementation details
  return true;
}

function matchesEthicalPreference(product: ProductFeatures, preference: string): boolean {
  // Implementation details
  return true;
}

function matchesEnvironmentalPreference(product: ProductFeatures, preference: string): boolean {
  // Implementation details
  return true;
}