import express from 'express';
import { getUserAchievements, updateAchievementProgress } from '../controllers/achievementController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getUserAchievements);
router.put('/:achievementId/progress', authenticateToken, updateAchievementProgress);

export { router as achievementRoutes };