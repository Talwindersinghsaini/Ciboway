import { Request, Response } from 'express';
import { getDb, saveDb } from '../db';

export const getUserAchievements = async (req: Request, res: Response) => {
  try {
    const db = await getDb();

    const result = db.exec(`
      SELECT 
        ua.*,
        a.title,
        a.description,
        a.icon,
        a.required_progress,
        a.type
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = ?
    `, [req.user!.id]);

    const achievements = result[0]?.values.map(row => ({
      id: row[0],
      userId: row[1],
      achievementId: row[2],
      progress: row[3],
      completed: Boolean(row[4]),
      completedAt: row[5],
      title: row[8],
      description: row[9],
      icon: row[10],
      requiredProgress: row[11],
      type: row[12],
    })) || [];

    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateAchievementProgress = async (req: Request, res: Response) => {
  try {
    const { achievementId } = req.params;
    const { progress } = req.body;
    const db = await getDb();

    // Get achievement details
    const achievementResult = db.exec(`
      SELECT required_progress FROM achievements
      WHERE id = ?
    `, [achievementId]);

    if (achievementResult.length === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    const requiredProgress = achievementResult[0].values[0][0] as number;
    const completed = progress >= requiredProgress;

    // Update or create user achievement
    db.exec(`
      INSERT INTO user_achievements (
        id, user_id, achievement_id, progress,
        completed, completed_at
      )
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, achievement_id) DO UPDATE SET
        progress = ?,
        completed = ?,
        completed_at = ?,
        updated_at = CURRENT_TIMESTAMP
    `, [
      `ua_${Date.now()}`,
      req.user!.id,
      achievementId,
      progress,
      completed,
      completed ? new Date().toISOString() : null,
      progress,
      completed,
      completed ? new Date().toISOString() : null
    ]);

    await saveDb();
    res.json({ progress, completed });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};