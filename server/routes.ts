import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { toolExecutor } from "./tools";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats || {
        activeScans: 2,
        systemsSecured: 18,
        vulnerabilities: 7,
        criticalIssues: 1
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities || [
        {
          id: "1",
          type: "success",
          message: "Port scan completed on 192.168.1.0/24",
          timestamp: new Date(Date.now() - 10 * 60000).toISOString()
        },
        {
          id: "2",
          type: "warning",
          message: "Directory enumeration detected weak permissions",
          timestamp: new Date(Date.now() - 34 * 60000).toISOString()
        },
        {
          id: "3",
          type: "error",
          message: "SQL injection vulnerability found in web application",
          timestamp: new Date(Date.now() - 120 * 60000).toISOString()
        }
      ]);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Tool execution endpoints
  app.post("/api/tools/:toolId/execute", async (req, res) => {
    const { toolId } = req.params;
    const params = req.body;

    try {
      // Log activity
      await storage.createActivity({
        type: "success",
        message: `Started ${toolId} scan on ${params.target || params.host || params.domain || "target"}`
      });

      // Execute the tool
      const result = await toolExecutor(toolId, params);
      
      // Store results
      await storage.createScanResult({
        toolId,
        target: params.target || params.host || params.domain || "unknown",
        results: result.results,
        rawOutput: result.rawOutput,
        executionTime: result.executionTime
      });

      res.json(result);
    } catch (error) {
      console.error(`Error executing ${toolId}:`, error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Log error activity
      await storage.createActivity({
        type: "error",
        message: `Error with ${toolId}: ${(error as Error).message}`
      });
      
      res.status(500).json({ message: `Failed to execute ${toolId}: ${(error as Error).message}` });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
