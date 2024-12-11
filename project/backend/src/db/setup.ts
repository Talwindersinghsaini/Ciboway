import { initDb, getDb } from './index';

async function setupDatabase() {
  await initDb();
  const db = getDb();

  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      // Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create user preferences table
      db.run(`
        CREATE TABLE IF NOT EXISTS user_preferences (
          user_id TEXT PRIMARY KEY,
          preferences TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Create scan history table
      db.run(`
        CREATE TABLE IF NOT EXISTS scan_history (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          barcode TEXT NOT NULL,
          scanned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database setup completed');
          resolve();
        }
      });
    });
  });
}

setupDatabase().catch(console.error);