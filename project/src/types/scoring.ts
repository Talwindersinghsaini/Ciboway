export interface ProductFeatures {
  nutritionalValues: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  certifications: string[];
  ingredients: string[];
  packaging: {
    type: string;
    recyclable: boolean;
    biodegradable: boolean;
  };
}

export interface ScoringResult {
  overallScore: number;
  nutritionScore: number;
  sustainabilityScore: number;
  ethicalScore: number;
}

export interface ProductAnalysis extends ScoringResult {
  recommendations: string[];
  warnings: string[];
  dietaryCompatibility: {
    compatible: boolean;
    reasons: string[];
  };
  environmentalImpact: {
    score: number;
    factors: string[];
  };
}