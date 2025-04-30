import { z } from "zod";

// Define schema for firewall parameters
const firewallParamsSchema = z.object({
  action: z.string().default("show"),
  chain: z.string().default("INPUT"),
  protocol: z.string().optional(),
  sourceIp: z.string().optional(),
  destinationIp: z.string().optional(),
  sourcePort: z.string().optional(),
  destinationPort: z.string().optional(),
  interface: z.string().optional(),
  target: z.string().default("ACCEPT"),
  newRuleType: z.string().default("basic"),
});

type FirewallParams = z.infer<typeof firewallParamsSchema>;

export const executeFirewall = async (params: FirewallParams) => {
  // Validate parameters
  const validParams = firewallParamsSchema.parse(params);
  
  // This would normally execute firewall commands, but we'll simulate it
  console.log(`Executing firewall ${validParams.action} command on chain ${validParams.chain}`);
  
  // Simulate operation delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Sample rules for each chain
  const sampleRules: Record<string, any[]> = {
    "INPUT": [
      { num: 1, target: "ACCEPT", protocol: "all", source: "0.0.0.0/0", destination: "0.0.0.0/0", options: "state RELATED,ESTABLISHED" },
      { num: 2, target: "ACCEPT", protocol: "icmp", source: "0.0.0.0/0", destination: "0.0.0.0/0", options: "" },
      { num: 3, target: "ACCEPT", protocol: "tcp", source: "0.0.0.0/0", destination: "0.0.0.0/0", destinationPort: "22", options: "" },
      { num: 4, target: "ACCEPT", protocol: "tcp", source: "0.0.0.0/0", destination: "0.0.0.0/0", destinationPort: "80", options: "" },
      { num: 5, target: "ACCEPT", protocol: "tcp", source: "0.0.0.0/0", destination: "0.0.0.0/0", destinationPort: "443", options: "" },
      { num: 6, target: "DROP", protocol: "all", source: "0.0.0.0/0", destination: "0.0.0.0/0", options: "" }
    ],
    "OUTPUT": [
      { num: 1, target: "ACCEPT", protocol: "all", source: "0.0.0.0/0", destination: "0.0.0.0/0", options: "" }
    ],
    "FORWARD": [
      { num: 1, target: "DROP", protocol: "all", source: "0.0.0.0/0", destination: "0.0.0.0/0", options: "" }
    ]
  };
  
  // Chain policies
  const policies: Record<string, string> = {
    "INPUT": "DROP",
    "OUTPUT": "ACCEPT",
    "FORWARD": "DROP"
  };
  
  // Execute based on action
  let rawOutput = "";
  let rules: any[] = [];
  let message = "";
  let success = true;
  
  switch (validParams.action) {
    case "show":
      rules = sampleRules[validParams.chain] || [];
      rawOutput = `
Chain ${validParams.chain} (policy ${policies[validParams.chain]})
num  target     prot   source               destination         options
${rules.map(rule => 
  `${rule.num.toString().padEnd(4)} ${rule.target.padEnd(10)} ${rule.protocol.padEnd(6)} ${rule.source.padEnd(20)} ${rule.destination.padEnd(20)} ${rule.destinationPort ? `dpt:${rule.destinationPort} ` : ""}${rule.options}`
).join('\n')}

`;
      break;
      
    case "add":
      const existingRules = sampleRules[validParams.chain] || [];
      const newRuleNum = existingRules.length > 0 ? 
        Math.max(...existingRules.map(r => r.num)) + 1 : 1;
      
      const newRule = {
        num: newRuleNum,
        target: validParams.target,
        protocol: validParams.protocol || "all",
        source: validParams.sourceIp || "0.0.0.0/0",
        destination: validParams.destinationIp || "0.0.0.0/0",
        sourcePort: validParams.sourcePort,
        destinationPort: validParams.destinationPort,
        options: validParams.interface ? `in ${validParams.interface}` : ""
      };
      
      // Add to existing rules
      existingRules.push(newRule);
      sampleRules[validParams.chain] = existingRules;
      rules = existingRules;
      
      message = `Rule added to chain ${validParams.chain}`;
      
      rawOutput = `
Adding rule to ${validParams.chain} chain:
-A ${validParams.chain} ${validParams.protocol ? `-p ${validParams.protocol} ` : ""}\
${validParams.sourceIp ? `-s ${validParams.sourceIp} ` : ""}\
${validParams.destinationIp ? `-d ${validParams.destinationIp} ` : ""}\
${validParams.sourcePort ? `--sport ${validParams.sourcePort} ` : ""}\
${validParams.destinationPort ? `--dport ${validParams.destinationPort} ` : ""}\
${validParams.interface ? `-i ${validParams.interface} ` : ""}\
-j ${validParams.target}

Rule successfully added as rule #${newRuleNum}
`;
      break;
      
    case "delete":
      const ruleNumber = validParams.sourceIp ? parseInt(validParams.sourceIp, 10) : 0;
      const existingRulesBefore = sampleRules[validParams.chain] || [];
      
      if (ruleNumber > 0) {
        // Delete specific rule
        const ruleExists = existingRulesBefore.some(r => r.num === ruleNumber);
        
        if (ruleExists) {
          sampleRules[validParams.chain] = existingRulesBefore.filter(r => r.num !== ruleNumber);
          rules = sampleRules[validParams.chain];
          message = `Rule #${ruleNumber} deleted from chain ${validParams.chain}`;
        } else {
          success = false;
          message = `Rule #${ruleNumber} not found in chain ${validParams.chain}`;
        }
        
        rawOutput = `
${success ? `Rule #${ruleNumber} deleted from chain ${validParams.chain}` : `Error: ${message}`}
`;
      } else {
        // Delete all rules
        sampleRules[validParams.chain] = [];
        rules = [];
        message = `All rules deleted from chain ${validParams.chain}`;
        
        rawOutput = `
Flushing chain ${validParams.chain}
All rules deleted from chain ${validParams.chain}
`;
      }
      break;
      
    default:
      success = false;
      message = `Unknown action: ${validParams.action}`;
      rawOutput = `Error: ${message}`;
  }
  
  // Build result object
  const results = {
    chain: validParams.chain,
    policy: policies[validParams.chain],
    action: validParams.action,
    success,
    message,
    enabled: true,
    rules
  };
  
  return {
    results,
    rawOutput
  };
};
