import express from 'express';
import { addMealPlan, getMealPlans } from '../controllers/mealController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, addMealPlan);
router.get('/', authenticateToken, getMealPlans);

export { router as mealRoutes };