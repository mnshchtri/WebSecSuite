import { z } from "zod";

// Define schema for hash cracker parameters
const hashCrackerParamsSchema = z.object({
  hashType: z.string().default("md5"),
  mode: z.enum(["single", "multiple"]).default("single"),
  hashValue: z.string().optional(),
  hashList: z.string().optional(),
  attackType: z.string().default("dictionary"),
  wordlist: z.string().default("rockyou"),
  customWordlist: z.string().optional(),
  maskPattern: z.string().optional(),
});

type HashCrackerParams = z.infer<typeof hashCrackerParamsSchema>;

export const executeHashCrack = async (params: HashCrackerParams) => {
  // Validate parameters
  const validParams = hashCrackerParamsSchema.parse(params);
  
  // This would normally execute a hash cracking tool, but we'll simulate it
  console.log(`Executing hash cracker for ${validParams.hashType} hashes, mode: ${validParams.mode}`);
  
  // Simulate cracking delay based on complexity
  const hashComplexity = {
    md5: 1,
    sha1: 1.2,
    sha256: 1.5,
    sha512: 2,
    ntlm: 0.8,
    bcrypt: 5
  };
  
  const attackComplexity = {
    dictionary: 1,
    bruteforce: 3,
    mask: 2
  };
  
  const complexity = 
    (hashComplexity[validParams.hashType as keyof typeof hashComplexity] || 1) * 
    (attackComplexity[validParams.attackType as keyof typeof attackComplexity] || 1);
  
  const baseTime = validParams.mode === "multiple" ? 3000 : 2000;
  const crackTime = Math.min(5000, baseTime * complexity);
  
  await new Promise(resolve => setTimeout(resolve, crackTime));
  
  // Common password dictionary for simulation
  const commonPasswords = [
    "password", "123456", "qwerty", "admin", "welcome", 
    "password123", "abc123", "letmein", "monkey", "1234567890"
  ];
  
  // For bcrypt, we'll always simulate failure as it's very slow to crack
  const isBcrypt = validParams.hashType === "bcrypt";
  
  // Function to determine if a hash should be cracked
  const shouldCrack = () => {
    if (isBcrypt) return false;
    
    // Different success rates based on attack type
    switch (validParams.attackType) {
      case "dictionary":
        return Math.random() > 0.4; // 60% success
      case "mask":
        return Math.random() > 0.6; // 40% success
      case "bruteforce":
        return Math.random() > 0.8; // 20% success
      default:
        return Math.random() > 0.5;
    }
  };
  
  let rawOutput = "";
  let results: any = {};
  
  // Handle single hash mode
  if (validParams.mode === "single" && validParams.hashValue) {
    const hash = validParams.hashValue.trim();
    const cracked = shouldCrack();
    
    if (cracked) {
      const password = commonPasswords[Math.floor(Math.random() * commonPasswords.length)];
      
      rawOutput = `
Hash Cracker v1.0
=====================================
Target hash: ${hash}
Hash type: ${validParams.hashType}
Attack mode: ${validParams.attackType}

[+] Initializing...
[+] Loading wordlist...
[+] Starting attack...
[+] Hash cracked!
[+] ${hash}:${password}
[+] Time elapsed: ${(crackTime / 1000).toFixed(2)} seconds
`;

      results = {
        hash: hash,
        cracked: true,
        password: password,
        algorithm: validParams.hashType,
        timeElapsed: (crackTime / 1000).toFixed(2)
      };
    } else {
      rawOutput = `
Hash Cracker v1.0
=====================================
Target hash: ${hash}
Hash type: ${validParams.hashType}
Attack mode: ${validParams.attackType}

[+] Initializing...
[+] Loading wordlist...
[+] Starting attack...
[-] Hash could not be cracked with current settings
[+] Time elapsed: ${(crackTime / 1000).toFixed(2)} seconds
`;

      results = {
        hash: hash,
        cracked: false,
        algorithm: validParams.hashType,
        timeElapsed: (crackTime / 1000).toFixed(2)
      };
    }
  } 
  // Handle multiple hash mode
  else if (validParams.mode === "multiple" && validParams.hashList) {
    const hashList = validParams.hashList.trim().split(/\r?\n/).filter(h => h.trim().length > 0);
    const resultList = [];
    
    for (const hash of hashList) {
      resultList.push({
        hash: hash,
        cracked: shouldCrack(),
        password: shouldCrack() ? commonPasswords[Math.floor(Math.random() * commonPasswords.length)] : null
      });
    }
    
    const crackedCount = resultList.filter(r => r.cracked).length;
    
    rawOutput = `
Hash Cracker v1.0
=====================================
Hash type: ${validParams.hashType}
Attack mode: ${validParams.attackType}
Hash count: ${hashList.length}

[+] Initializing...
[+] Loading wordlist...
[+] Starting attack...
${resultList.filter(r => r.cracked).map(r => `[+] ${r.hash}:${r.password}`).join('\n')}
${resultList.filter(r => !r.cracked).map(r => `[-] ${r.hash}: Not cracked`).join('\n')}

[+] Cracked ${crackedCount}/${hashList.length} hashes
[+] Time elapsed: ${(crackTime / 1000).toFixed(2)} seconds
`;

    results = {
      hashType: validParams.hashType,
      attackType: validParams.attackType,
      totalHashes: hashList.length,
      crackedCount: crackedCount,
      results: resultList,
      timeElapsed: (crackTime / 1000).toFixed(2)
    };
  } else {
    // Invalid input
    rawOutput = "Error: Invalid input parameters. Please provide either a single hash or a list of hashes.";
    results = {
      error: "Invalid input parameters",
      message: "Please provide either a single hash or a list of hashes."
    };
  }
  
  return {
    results,
    rawOutput
  };
};
