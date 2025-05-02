import express from "express";
import { exec } from "child_process";
import { promisify } from "util";

const router = express.Router();
const execAsync = promisify(exec);

// Map of tool names to their execution commands and validation
const toolCommands: Record<string, { 
  command: string;
  validateArgs: (args: any) => boolean;
  help: string;
}> = {
  nmap: {
    command: "nmap",
    validateArgs: (args: any) => typeof args.target === "string" && args.target.length > 0,
    help: "Performs network scanning and port scanning"
  },
  whois: {
    command: "whois",
    validateArgs: (args: any) => typeof args.domain === "string" && args.domain.length > 0,
    help: "Retrieves domain registration information"
  },
  dnslookup: {
    command: "nslookup",
    validateArgs: (args: any) => typeof args.domain === "string" && args.domain.length > 0,
    help: "Performs DNS lookups"
  },
  sslscan: {
    command: "sslscan",
    validateArgs: (args: any) => typeof args.host === "string" && args.host.length > 0,
    help: "Scans SSL/TLS services for vulnerabilities"
  },
  nikto: {
    command: "nikto",
    validateArgs: (args: any) => typeof args.url === "string" && args.url.length > 0,
    help: "Scans web servers for vulnerabilities"
  }
};

// Middleware to validate tool requests
const validateToolRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { tool } = req.params;
  const { args } = req.body;

  if (!tool) {
    return res.status(400).json({ error: "Tool not specified" });
  }

  if (!toolCommands[tool]) {
    return res.status(400).json({ error: "Unknown tool" });
  }

  if (!toolCommands[tool].validateArgs(args)) {
    return res.status(400).json({ error: "Invalid arguments" });
  }

  next();
};

router.post("/tools/:tool/execute", validateToolRequest, async (req, res) => {
  const { tool } = req.params;
  const { args } = req.body;

  try {
    // Construct the command with arguments
    let command = toolCommands[tool].command;
    
    // Add specific arguments based on tool
    switch (tool) {
      case "nmap":
        command += ` ${args.target}`;
        if (args.ports) command += ` -p ${args.ports}`;
        if (args.verbose) command += ` -v`;
        break;
      case "whois":
        command += ` ${args.domain}`;
        break;
      case "dnslookup":
        command += ` ${args.domain}`;
        break;
      case "sslscan":
        command += ` ${args.host}`;
        break;
      case "nikto":
        command += ` -h ${args.url}`;
        break;
    }

    // Execute the command
    const { stdout, stderr } = await execAsync(command);

    // Return the output
    res.json({
      output: stdout,
      error: stderr,
      tool: tool,
      args: args,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error executing ${tool}:`, error);
    res.status(500).json({ 
      error: error.message || "Execution failed",
      tool: tool,
      args: args,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
