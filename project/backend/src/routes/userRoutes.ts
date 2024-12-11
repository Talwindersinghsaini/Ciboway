import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth.js';
import { getDb } from '../db/index.js';

const router = express.Router();

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

const PreferencesSchema = z.object({
  dietary: z.object({
    vegetarian: z.boolean().optional(),
    vegan: z.boolean().optional(),
    glutenFree: z.boolean().optional(),
    dairyFree: z.boolean().optional(),
  }).optional(),
  ethical: z.object({
    organic: z.boolean().optional(),
    fairTrade: z.boolean().optional(),
    locallySourced: z.boolean().optional(),
    sustainable: z.boolean().optional(),
  }).optional(),
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = UserSchema.parse(req.body);
    const db = getDb();

    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = db.prepare(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)'
    ).run(email, hashedPassword, name);

    const token = jwt.sign(
      { id: result.lastInsertRowid, email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = UserSchema.parse(req.body);
    const db = getDb();

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

router.get('/preferences', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const preferences = db.prepare(
      'SELECT preferences FROM user_preferences WHERE user_id = ?'
    ).get(req.user?.id);

    res.json(preferences ? JSON.parse(preferences.preferences) : {});
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

router.put('/preferences', authenticateToken, (req, res) => {
  try {
    const preferences = PreferencesSchema.parse(req.body);
    const db = getDb();

    db.prepare(`
      INSERT OR REPLACE INTO user_preferences (user_id, preferences)
      VALUES (?, ?)
    `).run(req.user?.id, JSON.stringify(preferences));

    res.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

export const userRoutes = router;