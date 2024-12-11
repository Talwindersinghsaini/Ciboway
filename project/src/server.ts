import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDb } from './db';
import { errorHandler } from './middleware/errorHandler';
import { userRoutes } from './routes/userRoutes';
import { productRoutes } from './routes/productRoutes';
import { mealRoutes } from './routes/mealRoutes';
import { achievementRoutes } from './routes/achievementRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize database
initializeDb().then(() => {
  console.log('Database initialized');
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/achievements', achievementRoutes);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});