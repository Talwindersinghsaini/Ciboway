import * as tf from '@tensorflow/tfjs';
import { ProductData } from './foodApi';

// Define feature categories for one-hot encoding
const CERTIFICATION_CATEGORIES = [
  'organic', 'fair-trade', 'rainforest-alliance', 'sustainable-fishing',
  'free-range', 'biodegradable'
];

const PACKAGING_CATEGORIES = [
  'recyclable', 'biodegradable', 'plastic', 'glass', 'paper', 'metal'
];

let model: tf.LayersModel;

export async function initializeModel() {
  try {
    // Create a simple neural network for product scoring
    model = tf.sequential();
    
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [
        6 + // Nutrition features
        CERTIFICATION_CATEGORIES.length +
        PACKAGING_CATEGORIES.length
      ]
    }));
    
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));
    
    model.add(tf.layers.dense({
      units: 1,
      activation: 'sigmoid'
    }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
  } catch (error) {
    console.error('Error initializing model:', error);
  }
}

export async function predictScore(product: ProductData['product']): Promise<number> {
  if (!model) {
    await initializeModel();
  }

  const features = tf.tidy(() => {
    // Normalize nutritional values
    const nutritionFeatures = tf.tensor([
      normalize(product.nutriments['energy-kcal_100g'], 0, 1000),
      normalize(product.nutriments.proteins_100g, 0, 100),
      normalize(product.nutriments.carbohydrates_100g, 0, 100),
      normalize(product.nutriments.fat_100g, 0, 100),
      normalize(product.nutriments.fiber_100g, 0, 50),
      normalize(product.nutriments['sodium_100g'], 0, 5)
    ]);

    // One-hot encode certifications
    const certifications = oneHotEncode(
      product.labels_tags || [],
      CERTIFICATION_CATEGORIES
    );

    // One-hot encode packaging
    const packaging = oneHotEncode(
      product.packaging_tags || [],
      PACKAGING_CATEGORIES
    );

    // Combine all features
    return tf.concat([nutritionFeatures, certifications, packaging]);
  });

  // Make prediction
  const prediction = await model.predict(features.expandDims(0)) as tf.Tensor;
  const score = await prediction.data();
  
  // Cleanup
  features.dispose();
  prediction.dispose();

  // Convert to 0-100 scale
  return Math.round(score[0] * 100);
}

// Helper functions
function normalize(value: number, min: number, max: number): number {
  if (!value) return 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

function oneHotEncode(tags: string[], categories: string[]): tf.Tensor1D {
  return tf.tensor1d(
    categories.map(category => 
      tags.some(tag => tag.includes(category)) ? 1 : 0
    )
  );
}

// Training function for future use
export async function trainModel(trainingData: {
  product: ProductData['product'];
  score: number;
}[]) {
  if (!model) {
    await initializeModel();
  }

  const features = [];
  const labels = [];

  for (const { product, score } of trainingData) {
    const productFeatures = tf.tidy(() => {
      const nutritionFeatures = tf.tensor([
        normalize(product.nutriments['energy-kcal_100g'], 0, 1000),
        normalize(product.nutriments.proteins_100g, 0, 100),
        normalize(product.nutriments.carbohydrates_100g, 0, 100),
        normalize(product.nutriments.fat_100g, 0, 100),
        normalize(product.nutriments.fiber_100g, 0, 50),
        normalize(product.nutriments['sodium_100g'], 0, 5)
      ]);

      const certifications = oneHotEncode(
        product.labels_tags || [],
        CERTIFICATION_CATEGORIES
      );

      const packaging = oneHotEncode(
        product.packaging_tags || [],
        PACKAGING_CATEGORIES
      );

      return tf.concat([nutritionFeatures, certifications, packaging]);
    });

    features.push(productFeatures);
    labels.push(score / 100); // Normalize score to 0-1
  }

  const xs = tf.stack(features);
  const ys = tf.tensor2d(labels, [labels.length, 1]);

  await model.fit(xs, ys, {
    epochs: 50,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch}: loss = ${logs?.loss}`);
      }
    }
  });

  // Cleanup
  xs.dispose();
  ys.dispose();
  features.forEach(f => f.dispose());
}