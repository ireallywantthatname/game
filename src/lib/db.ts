import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;
let initPromise: Promise<Client> | null = null;

async function initDb(): Promise<Client> {
  const url = process.env.LIBSQL_URL;
  if (!url) {
    throw new Error("LIBSQL_URL is not set");
  }

  const db = createClient({
    url,
    authToken: process.env.LIBSQL_AUTH_TOKEN,
  });

  await db.executeMultiple(`
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

  const countResult = await db.execute(
    "SELECT COUNT(*) AS cnt FROM game_state"
  );
  const cnt = Number(countResult.rows[0]?.cnt ?? 0);

  if (cnt === 0) {
    await db.execute({
      sql: "INSERT INTO game_state (id, akash_bucks, achini_bucks, updated_at) VALUES (1, 0, 0, ?)",
      args: [new Date().toISOString()],
    });
  }

  return db;
}

export async function getDb(): Promise<Client> {
  if (client) return client;
  if (!initPromise) {
    initPromise = initDb()
      .then((db) => {
        client = db;
        return db;
      })
      .catch((err) => {
        initPromise = null;
        throw err;
      });
  }
  return initPromise;
}
