import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Define schema for tool parameters
const toolParamsSchema = z.object({
  target: z.string().optional(),
  host: z.string().optional(),
  domain: z.string().optional()
});

export async function registerRoutes(app: Express): Promise<Express> {
  // Tool execution endpoints are now handled by the tools router
  // Scan results
  app.get("/api/scans", async (req: Request, res: Response) => {
    try {
      const scans = await storage.getScanResults();
      res.json(scans);
    } catch (error) {
      console.error("Error fetching scan results:", error);
      res.status(500).json({ message: "Failed to fetch scan results" });
    }
  });

  // Activities
  app.get("/api/activities", async (req: Request, res: Response) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Stats
  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getStats();
      res.json(stats || {
        activeScans: 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  return app;
}
