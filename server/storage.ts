import { randomUUID } from 'crypto';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Client } from '@neondatabase/serverless';
import { schema } from './db/schema';
import { eq } from 'drizzle-orm';
import { initDatabase } from './db/init';

// Initialize database
export const client = new Client(process.env.NEON_DATABASE_URL || 'postgresql://localhost:5432/websec_suite');
export const db = drizzle(client, { schema });

export class Storage {
  constructor() {
    // No initialization needed here - handled by init.ts
  }

  // Scan results management
  async createScanResult(result: {
    toolId: string;
    target: string;
    results: any;
    rawOutput: string;
    executionTime: number;
  }) {
    await db.insert(schema.scanResults).values({
      id: randomUUID(),
      toolId: result.toolId,
      target: result.target,
      results: result.results,
      rawOutput: result.rawOutput,
      executionTime: result.executionTime,
      createdAt: new Date()
    });
  }

  async getScanResults() {
    const results = await db
      .select()
      .from(schema.scanResults)
      .orderBy(schema.scanResults.createdAt, 'desc')
      .limit(100);
    return results;
  }

  // Activity logging
  async createActivity(activity: {
    type: string;
    message: string;
  }) {
    await db.insert(schema.activities).values({
      id: randomUUID(),
      type: activity.type,
      message: activity.message,
      timestamp: new Date()
    });
  }

  async getActivities() {
    const activities = await db
      .select()
      .from(schema.activities)
      .orderBy(schema.activities.timestamp, 'desc')
      .limit(100);
    return activities;
  }

  // Stats management
  async getStats() {
    const [stats] = await db
      .select()
      .from(schema.stats)
      .where(eq(schema.stats.id, 1));

    if (!stats) {
      await db.insert(schema.stats).values({
        id: 1,
        activeScans: 0
      });
      return {
        activeScans: 0
      };
    }

    return {
      activeScans: stats.activeScans
    };
  }

  async updateStats(stats: {
    activeScans?: number;
  }) {
    await db.update(schema.stats)
      .set(stats)
      .where(eq(schema.stats.id, 1));
  }
}

export const storage = new Storage();
