import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { scanProduct } from '../controllers/productController';

const router = express.Router();

router.get('/scan/:barcode', authenticateToken, scanProduct);

export { router as productRoutes };