import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = path.join(__dirname, '../../data.db');

let db: Database;

export async function initDb(): Promise<void> {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (error: Error | null) => {
      if (error) {
        reject(error);
        return;
      }
      console.log('Connected to SQLite database');
      resolve();
    });
  });
}

export function getDb(): Database {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}