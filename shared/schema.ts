import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Stats table for dashboard statistics
export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  activeScans: integer("active_scans").default(0),
  systemsSecured: integer("systems_secured").default(0),
  vulnerabilities: integer("vulnerabilities").default(0),
  criticalIssues: integer("critical_issues").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Activities table for recent activities
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // success, warning, error
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));

export const insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  type: true,
  message: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Scan results table to store tool execution results
export const scanResults = pgTable("scan_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  toolId: text("tool_id").notNull(), // nmap, dns, whois, etc.
  target: text("target").notNull(),
  results: jsonb("results"),
  rawOutput: text("raw_output"),
  executionTime: integer("execution_time"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const scanResultsRelations = relations(scanResults, ({ one }) => ({
  user: one(users, {
    fields: [scanResults.userId],
    references: [users.id],
  }),
}));

export const insertScanResultSchema = createInsertSchema(scanResults).pick({
  userId: true,
  toolId: true,
  target: true,
  results: true,
  rawOutput: true,
  executionTime: true,
});

export type InsertScanResult = z.infer<typeof insertScanResultSchema>;
export type ScanResult = typeof scanResults.$inferSelect;

// Define users relations after all tables are declared to avoid circular dependencies
export const usersRelations = relations(users, ({ many }) => ({
  scanResults: many(scanResults),
  activities: many(activities),
}));
