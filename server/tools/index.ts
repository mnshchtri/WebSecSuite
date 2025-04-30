import { executeNmap } from './nmap';
import { executeDns } from './dns';
import { executeWhois } from './whois';
import { executeSslScan } from './ssl';
import { executeNikto } from './nikto';
import { executeDirb } from './dirb';
import { executeSqlMap } from './sqlmap';
import { executeXssScan } from './xss';
import { executeHashCrack } from './hash';
import { executePacketAnalyzer } from './packet';
import { executeMacChanger } from './mac';
import { executeFirewall } from './firewall';

// Generic tool execution interface
interface ToolResult {
  results: any;
  rawOutput: string;
  executionTime: number;
}

export const toolExecutor = async (toolId: string, params: any): Promise<ToolResult> => {
  const startTime = Date.now();
  
  let result;
  
  try {
    switch (toolId) {
      case 'nmap':
        result = await executeNmap(params);
        break;
      case 'dns':
        result = await executeDns(params);
        break;
      case 'whois':
        result = await executeWhois(params);
        break;
      case 'sslscan':
        result = await executeSslScan(params);
        break;
      case 'nikto':
        result = await executeNikto(params);
        break;
      case 'dirb':
        result = await executeDirb(params);
        break;
      case 'sqlmap':
        result = await executeSqlMap(params);
        break;
      case 'xss':
        result = await executeXssScan(params);
        break;
      case 'hash':
        result = await executeHashCrack(params);
        break;
      case 'packet':
        result = await executePacketAnalyzer(params);
        break;
      case 'mac':
        result = await executeMacChanger(params);
        break;
      case 'firewall':
        result = await executeFirewall(params);
        break;
      default:
        throw new Error(`Unknown tool: ${toolId}`);
    }
    
    const endTime = Date.now();
    const executionTime = (endTime - startTime) / 1000;
    
    return {
      results: result.results,
      rawOutput: result.rawOutput,
      executionTime
    };
  } catch (error) {
    console.error(`Error executing ${toolId}:`, error);
    throw error;
  }
};

export default toolExecutor;
