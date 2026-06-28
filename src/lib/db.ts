import { Database } from "bun:sqlite";
import path from "node:path";
import fs from "node:fs";

let db: Database | null = null;

export function getDb(): Database {
  if (db) return db;

  const dbDir = path.join(process.cwd(), "data");
  fs.mkdirSync(dbDir, { recursive: true });

  db = new Database(path.join(dbDir, "game.db"));
  db.exec("PRAGMA journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS game_state (
      id INTEGER PRIMARY KEY,
      akash_bucks INTEGER NOT NULL DEFAULT 0,
      achini_bucks INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      buck_type TEXT NOT NULL,
      amount INTEGER NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rewards (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      cost INTEGER NOT NULL,
      buck_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'available',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      redeemed_at TEXT
    );
  `);

  const row = db
    .query("SELECT COUNT(*) AS cnt FROM game_state")
    .get() as { cnt: number };

  if (row.cnt === 0) {
    db.query(
      "INSERT INTO game_state (id, akash_bucks, achini_bucks, updated_at) VALUES (1, 0, 0, ?)"
    ).run(new Date().toISOString());
  }

  return db;
}
