// PostgreSQL database connection using standard pg driver
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

// Enable PostgreSQL extensions on startup
async function initializeDatabase() {
  try {
    // Enable unaccent extension for Turkish character-insensitive search
    await pool.query('CREATE EXTENSION IF NOT EXISTS unaccent;');
    console.log("✓ PostgreSQL unaccent extension enabled");
  } catch (error) {
    console.error("Failed to initialize database extensions:", error);
    throw error;
  }
}

// Initialize database on module load
initializeDatabase().catch(console.error);
