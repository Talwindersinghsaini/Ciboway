import { Request, Response } from 'express';
import { getDb, saveDb } from '../db';
import { z } from 'zod';

const mealPlanSchema = z.object({
  recipeId: z.string(),
  date: z.string(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  servings: z.number().min(1),
});

export const addMealPlan = async (req: Request, res: Response) => {
  try {
    const mealPlan = mealPlanSchema.parse(req.body);
    const db = await getDb();

    // Verify recipe exists
    const recipeResult = db.exec(`
      SELECT * FROM recipes WHERE id = ?
    `, [mealPlan.recipeId]);

    if (recipeResult.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const id = `meal_${Date.now()}`;

    db.exec(`
      INSERT INTO meal_plans (
        id, user_id, recipe_id, date,
        meal_type, servings
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      id,
      req.user!.id,
      mealPlan.recipeId,
      mealPlan.date,
      mealPlan.mealType,
      mealPlan.servings
    ]);

    await saveDb();
    res.status(201).json({ id, ...mealPlan });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMealPlans = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const db = await getDb();

    const result = db.exec(`
      SELECT 
        mp.*,
        r.name as recipe_name,
        r.ingredients,
        r.instructions,
        r.calories,
        r.protein,
        r.carbs,
        r.fat,
        r.ethical_score,
        r.image
      FROM meal_plans mp
      JOIN recipes r ON mp.recipe_id = r.id
      WHERE mp.user_id = ?
      AND mp.date BETWEEN ? AND ?
      ORDER BY mp.date, mp.meal_type
    `, [
      req.user!.id,
      startDate,
      endDate
    ]);

    const mealPlans = result[0]?.values.map(row => ({
      id: row[0],
      userId: row[1],
      recipeId: row[2],
      date: row[3],
      mealType: row[4],
      servings: row[5],
      recipe: {
        name: row[9],
        ingredients: JSON.parse(row[10] as string),
        instructions: JSON.parse(row[11] as string),
        calories: row[12],
        protein: row[13],
        carbs: row[14],
        fat: row[15],
        ethicalScore: row[16],
        image: row[17],
      }
    })) || [];

    res.json(mealPlans);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};