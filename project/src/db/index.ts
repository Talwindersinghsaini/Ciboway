import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

let db: initSqlJs.Database;

export async function initializeDb() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '../../data.db');

  try {
    if (fs.existsSync(dbPath)) {
      const filebuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(filebuffer);
    } else {
      db = new SQL.Database();
      // Save empty database to file
      const data = db.export();
      fs.writeFileSync(dbPath, Buffer.from(data));
    }
  } catch (err) {
    console.error('Failed to initialize database:', err);
    throw err;
  }

  return db;
}

export async function getDb() {
  if (!db) {
    await initializeDb();
  }
  return db;
}

export async function saveDb() {
  if (!db) return;
  
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(path.join(__dirname, '../../data.db'), buffer);
}