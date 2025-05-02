import { schema } from './schema';
import { Client } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export async function initDatabase() {
  const client = new Client(process.env.NEON_DATABASE_URL || 'postgresql://localhost:5432/websec_suite');
  const db = drizzle(client, { schema });

  try {
    // Create tables using Drizzle ORM
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS stats (
        id SERIAL PRIMARY KEY,
        active_scans INTEGER NOT NULL DEFAULT 0,
        systems_secured INTEGER NOT NULL DEFAULT 0,
        vulnerabilities INTEGER NOT NULL DEFAULT 0,
        critical_issues INTEGER NOT NULL DEFAULT 0
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        is_admin BOOLEAN NOT NULL DEFAULT false
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS scan_results (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        tool_id VARCHAR(36) NOT NULL,
        target TEXT NOT NULL,
        results TEXT NOT NULL,
        raw_output TEXT NOT NULL,
        execution_time INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS activities (
        id VARCHAR(36) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create default admin user if not exists
    const existingAdmin = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, 'admin@example.com'))
      .limit(1)
      .then(result => result[0]);

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await db.insert(schema.users).values({
        id: randomUUID(),
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true
      });
    }

    // Initialize stats table with default values
    const existingStats = await db
      .select()
      .from(schema.stats)
      .where(eq(schema.stats.id, 1))
      .limit(1)
      .then(result => result[0]);

    if (!existingStats) {
      await db.insert(schema.stats).values({
        id: 1,
        activeScans: 0,
        systemsSecured: 0,
        vulnerabilities: 0,
        criticalIssues: 0
      });
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

initDatabase();
