import express from 'express';
import { scanProduct, addProduct } from '../controllers/productController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/scan/:barcode', authenticateToken, scanProduct);
router.post('/', authenticateToken, addProduct);

export { router as productRoutes };