"use client"

import axios from 'axios';
import { ProductFeatures, AIAnalysis, UserPreferences } from '../types/scoring';

const HF_API_KEY = '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';
const HF_API_URL = 'https://api-inference.huggingface.co/models';

// We'll use different models for different aspects of analysis
const MODELS = {
  textClassification: 'facebook/bart-large-mnli',
  nutritionAnalysis: 'microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract',
  sustainabilityScoring: 'nlptown/bert-base-multilingual-uncased-sentiment'
};

export async function analyzeWithHuggingFace(
  product: ProductFeatures,
  userPreferences: UserPreferences
): Promise<AIAnalysis> {
  try {
    const [
      nutritionAnalysis,
      sustainabilityScore,
      ethicalScore
    ] = await Promise.all([
      analyzeNutrition(product),
      analyzeSustainability(product),
      analyzeEthicalFactors(product)
    ]);

    // Generate recommendations based on all analyses
    const recommendations = await generateRecommendations(
      product,
      userPreferences,
      { nutritionAnalysis, sustainabilityScore, ethicalScore }
    );

    return {
      score: calculateOverallScore(nutritionAnalysis, sustainabilityScore, ethicalScore),
      nutritionalAnalysis: nutritionAnalysis.summary,
      environmentalImpact: sustainabilityScore.summary,
      ethicalConsiderations: ethicalScore.summary,
      recommendations: recommendations.suggestions,
      warnings: recommendations.warnings,
      alternatives: recommendations.alternatives
    };
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return generateFallbackAnalysis(product, userPreferences);
  }
}

async function query(model: string, inputs: any) {
  const response = await axios.post(
    `${HF_API_URL}/${model}`,
    { inputs },
    {
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
}

async function analyzeNutrition(product: ProductFeatures) {
  const input = `Analyze the nutritional value of this product:
    Calories: ${product.nutritionalValues.calories}
    Protein: ${product.nutritionalValues.protein}g
    Carbs: ${product.nutritionalValues.carbs}g
    Fat: ${product.nutritionalValues.fat}g`;

  const result = await query(MODELS.nutritionAnalysis, input);
  
  return {
    score: interpretNutritionScore(result),
    summary: generateNutritionSummary(result, product)
  };
}

async function analyzeSustainability(product: ProductFeatures) {
  const input = `Analyze the sustainability of this product:
    Packaging: ${product.packaging.type}
    Recyclable: ${product.packaging.recyclable}
    Biodegradable: ${product.packaging.biodegradable}
    Certifications: ${product.certifications.join(', ')}`;

  const result = await query(MODELS.sustainabilityScoring, input);

  return {
    score: interpretSustainabilityScore(result),
    summary: generateSustainabilitySummary(result, product)
  };
}

async function analyzeEthicalFactors(product: ProductFeatures) {
  const input = `Analyze the ethical factors of this product:
    Certifications: ${product.certifications.join(', ')}
    Origin: ${product.origin || 'Unknown'}`;

  const result = await query(MODELS.textClassification, input);

  return {
    score: interpretEthicalScore(result),
    summary: generateEthicalSummary(result, product)
  };
}

async function generateRecommendations(
  product: ProductFeatures,
  preferences: UserPreferences,
  analyses: any
) {
  const input = `Generate recommendations based on:
    Product: ${JSON.stringify(product)}
    User Preferences: ${JSON.stringify(preferences)}
    Analyses: ${JSON.stringify(analyses)}`;

  const result = await query(MODELS.textClassification, input);

  return {
    suggestions: extractRecommendations(result),
    warnings: extractWarnings(result, product, preferences),
    alternatives: generateAlternatives(product, preferences)
  };
}

function calculateOverallScore(
  nutritionAnalysis: any,
  sustainabilityScore: any,
  ethicalScore: any
): number {
  return Math.round(
    (nutritionAnalysis.score + sustainabilityScore.score + ethicalScore.score) / 3
  );
}

function generateFallbackAnalysis(
  product: ProductFeatures,
  preferences: UserPreferences
): AIAnalysis {
  return {
    score: 50,
    nutritionalAnalysis: 'Analysis unavailable',
    environmentalImpact: 'Impact assessment unavailable',
    ethicalConsiderations: 'Ethical assessment unavailable',
    recommendations: ['Consider checking product certifications'],
    warnings: [],
    alternatives: []
  };
}

// Helper functions for score interpretation and summary generation
function interpretNutritionScore(result: any): number {
  // Implementation details
  return 50;
}

function generateNutritionSummary(result: any, product: ProductFeatures): string {
  // Implementation details
  return 'Nutrition analysis summary';
}

function interpretSustainabilityScore(result: any): number {
  // Implementation details
  return 50;
}

function generateSustainabilitySummary(result: any, product: ProductFeatures): string {
  // Implementation details
  return 'Sustainability analysis summary';
}

function interpretEthicalScore(result: any): number {
  // Implementation details
  return 50;
}

function generateEthicalSummary(result: any, product: ProductFeatures): string {
  // Implementation details
  return 'Ethical analysis summary';
}

function extractRecommendations(result: any): string[] {
  // Implementation details
  return ['Sample recommendation'];
}

function extractWarnings(
  result: any,
  product: ProductFeatures,
  preferences: UserPreferences
): string[] {
  // Implementation details
  return [];
}

function generateAlternatives(
  product: ProductFeatures,
  preferences: UserPreferences
): string[] {
  // Implementation details
  return [];
}