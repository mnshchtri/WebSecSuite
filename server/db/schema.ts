import { pgTable, varchar, text, timestamp, boolean, integer, primaryKey, foreignKey } from 'drizzle-orm/pg-core';

export const schema = {
  scanResults: pgTable('scan_results', {
    id: varchar('id', { length: 36 }).primaryKey(),
    toolId: varchar('tool_id', { length: 36 }).notNull(),
    target: text('target').notNull(),
    results: text('results').notNull(),
    rawOutput: text('raw_output').notNull(),
    executionTime: integer('execution_time').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  }),

  activities: pgTable('activities', {
    id: varchar('id', { length: 36 }).primaryKey(),
    type: varchar('type', { length: 50 }).notNull(),
    message: text('message').notNull(),
    timestamp: timestamp('timestamp').notNull().defaultNow(),
  }),

  stats: pgTable('stats', {
    id: integer('id').primaryKey(),
    activeScans: integer('active_scans').notNull().default(0),
    systemsSecured: integer('systems_secured').notNull().default(0),
    vulnerabilities: integer('vulnerabilities').notNull().default(0),
    criticalIssues: integer('critical_issues').notNull().default(0),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  })
};
