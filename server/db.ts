// Referenced from javascript_database blueprint integration
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

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
