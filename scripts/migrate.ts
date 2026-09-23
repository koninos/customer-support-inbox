import fs from "node:fs/promises";
import path from "node:path";

import pool from "../src/lib/db";

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const migrationsDirectory = path.join(process.cwd(), "migrations");

  const files = (await fs.readdir(migrationsDirectory))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const result = await pool.query(
      "SELECT 1 FROM schema_migrations WHERE name = $1",
      [file],
    );

    if (result.rowCount !== null && result.rowCount > 0) {
      console.log(`Skipping migration: ${file}`);
      continue;
    }

    const filePath = path.join(migrationsDirectory, file);
    const sql = await fs.readFile(filePath, "utf8");

    console.log(`Running migration: ${file}`);

    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      await client.query(sql);

      await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [
        file,
      ]);

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  await pool.end();
}

migrate().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
