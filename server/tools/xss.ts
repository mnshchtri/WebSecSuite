import { z } from "zod";

// Define schema for XSS Scanner parameters
const xssParamsSchema = z.object({
  url: z.string().min(1, { message: "URL is required" }),
  parameter: z.string().optional(),
  method: z.string().default("GET"),
  data: z.string().optional(),
  cookie: z.string().optional(),
  userAgent: z.boolean().default(false),
  referer: z.boolean().default(false),
  testAllParams: z.boolean().default(true),
  testForms: z.boolean().default(false),
  depth: z.string().default("1"),
});

type XssParams = z.infer<typeof xssParamsSchema>;

export const executeXssScan = async (params: XssParams) => {
  // Validate parameters
  const validParams = xssParamsSchema.parse(params);
  
  // This would normally execute an XSS scan, but we'll simulate it
  console.log(`Executing XSS scan on ${validParams.url}`);
  
  // Simulate scan delay based on depth and options
  const depth = parseInt(validParams.depth, 10) || 1;
  const options = (validParams.testAllParams ? 1 : 0) + 
                  (validParams.testForms ? 1 : 0) + 
                  (validParams.userAgent ? 1 : 0) + 
                  (validParams.referer ? 1 : 0);
                  
  const scanTime = Math.min(4000, 1000 * depth * (1 + options * 0.5));
  await new Promise(resolve => setTimeout(resolve, scanTime));
  
  // Prepare URL for simulation
  let url = validParams.url;
  
  // Determine if target is likely vulnerable
  let hasVulnerability = false;
  let testedParams = [];
  
  // Check if URL contains parameters
  if (url.includes("?") && url.includes("=")) {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    testedParams = Array.from(urlParams.keys());
    
    // Higher chance of vulnerability if URL has parameters
    hasVulnerability = Math.random() > 0.4;
  } else if (validParams.method === "POST" && validParams.data && validParams.data.includes("=")) {
    const formData = new URLSearchParams(validParams.data);
    testedParams = Array.from(formData.keys());
    
    // Higher chance of vulnerability if POST data has parameters
    hasVulnerability = Math.random() > 0.5;
  } else {
    // Lower chance of vulnerability otherwise
    hasVulnerability = Math.random() > 0.8;
    testedParams = ["query", "search", "id"];
  }
  
  // If specific parameter is provided, focus on that
  if (validParams.parameter) {
    testedParams = [validParams.parameter];
  }
  
  // If testing all params enabled, add more common parameters
  if (validParams.testAllParams) {
    const commonParams = ["q", "search", "query", "id", "page", "name", "user", "text", "content"];
    commonParams.forEach(param => {
      if (!testedParams.includes(param)) {
        testedParams.push(param);
      }
    });
  }
  
  // Consider testing UA and referer if enabled
  if (validParams.userAgent) {
    testedParams.push("User-Agent");
  }
  
  if (validParams.referer) {
    testedParams.push("Referer");
  }
  
  // Generate raw output
  let rawOutput = "";
  let results = {};
  
  if (hasVulnerability) {
    // Vulnerable contexts
    const vulnerableContexts = [
      {
        type: "Reflected XSS",
        context: "HTML Context",
        description: "XSS vulnerability in HTML context allows injection of arbitrary JavaScript",
        severity: "Medium",
        payload: "<script>alert(1)</script>",
        context: "...value=\"[INJECT HERE]\">..."
      },
      {
        type: "Reflected XSS",
        context: "Attribute Context",
        description: "XSS vulnerability in attribute context allows breaking out of attributes",
        severity: "Medium",
        payload: "\" onmouseover=\"alert(1)\"",
        context: "<input value=\"[INJECT HERE]\">"
      },
      {
        type: "Reflected XSS",
        context: "JavaScript Context",
        description: "XSS vulnerability in JavaScript context allows injection of arbitrary code",
        severity: "High",
        payload: "\"-alert(1)//",
        context: "var value = \"[INJECT HERE]\";"
      },
      {
        type: "DOM-based XSS",
        context: "innerHTML",
        description: "DOM-based XSS through innerHTML property allows execution of scripts",
        severity: "High",
        payload: "<img src=x onerror=alert(1)>",
        context: "element.innerHTML = \"[INJECT HERE]\";"
      }
    ];
    
    // Select random vulnerable parameter and context
    const vulnerableParam = testedParams[Math.floor(Math.random() * testedParams.length)];
    const vulnerableContext = vulnerableContexts[Math.floor(Math.random() * vulnerableContexts.length)];
    
    // Create vulnerability
    const vulnerability = {
      ...vulnerableContext,
      url: validParams.url,
      parameter: vulnerableParam
    };
    
    // Generate raw output for vulnerable site
    rawOutput = `
XSS Scanner v1.2
=====================================
Target: ${validParams.url}
Method: ${validParams.method}
Parameters tested: ${testedParams.join(", ")}

[+] Testing parameter "${vulnerableParam}"...
[+] Injecting payloads...
[+] Vulnerable to XSS!
    Parameter: ${vulnerableParam}
    Context: ${vulnerableContext.context}
    Payload: ${vulnerableContext.payload}
    
[+] Scan completed at ${new Date().toISOString()}
[+] 1 vulnerability found
`;

    // Build detailed results for vulnerable site
    results = {
      url: validParams.url,
      vulnerabilities: [vulnerability],
      testedParams: testedParams,
      payloadCount: 1
    };
  } else {
    // Generate raw output for non-vulnerable site
    rawOutput = `
XSS Scanner v1.2
=====================================
Target: ${validParams.url}
Method: ${validParams.method}
Parameters tested: ${testedParams.join(", ")}

${testedParams.map(param => `[-] Testing parameter "${param}"...\n[-] No vulnerabilities found for "${param}"`).join('\n\n')}
    
[+] Scan completed at ${new Date().toISOString()}
[+] No vulnerabilities found
`;

    // Build results for non-vulnerable site
    results = {
      url: validParams.url,
      vulnerabilities: [],
      testedParams: testedParams,
      message: "No XSS vulnerabilities were found on the tested parameters"
    };
  }
  
  return {
    results,
    rawOutput
  };
};
