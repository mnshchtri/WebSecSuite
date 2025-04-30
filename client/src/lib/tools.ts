import {
  NmapIcon,
  DnsIcon,
  WhoisIcon,
  SslScanIcon,
  NiktoIcon,
  DirbIcon,
  SqlmapIcon,
  XssIcon,
  HashCrackerIcon,
  PacketAnalyzerIcon,
  MacChangerIcon,
  FirewallIcon,
} from "./icons";

export type ToolCategory = 
  | "Information Gathering"
  | "Vulnerability Analysis"
  | "Web Application Security"
  | "Network Security"
  | "System Tools";

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: React.FC<React.HTMLAttributes<SVGSVGElement>>;
  color: string;
  helpText?: string;
}

export const tools: Tool[] = [
  // Information Gathering Tools
  {
    id: "nmap",
    name: "Nmap Scanner",
    description: "Network exploration & security auditing",
    category: "Information Gathering",
    icon: NmapIcon,
    color: "text-accent-blue",
    helpText: "Nmap (Network Mapper) is a utility for network discovery and security auditing. It uses raw IP packets to determine what hosts are available on the network, what services they're offering, what operating systems they're running, and more."
  },
  {
    id: "dnslookup",
    name: "DNS Lookup",
    description: "Retrieve DNS records for domains",
    category: "Information Gathering",
    icon: DnsIcon,
    color: "text-accent-blue",
    helpText: "DNS Lookup tool retrieves DNS records such as A, AAAA, MX, TXT, and more for a specified domain. It helps in understanding the DNS configuration of a domain."
  },
  {
    id: "whois",
    name: "Whois Lookup",
    description: "Domain registration information",
    category: "Information Gathering",
    icon: WhoisIcon,
    color: "text-accent-blue",
    helpText: "Whois lookup provides information about domain registration including who owns a domain, when it was registered, expiration date, and the domain registrar."
  },
  
  // Vulnerability Analysis Tools
  {
    id: "sslscan",
    name: "SSL Scanner",
    description: "SSL/TLS configuration analysis",
    category: "Vulnerability Analysis",
    icon: SslScanIcon,
    color: "text-accent-green",
    helpText: "SSL Scanner tests SSL/TLS services for known vulnerabilities, certificate issues, and configuration problems. It helps identify weaknesses in secure communications."
  },
  {
    id: "nikto",
    name: "Nikto Scanner",
    description: "Web server vulnerability scanner",
    category: "Vulnerability Analysis",
    icon: NiktoIcon,
    color: "text-accent-green",
    helpText: "Nikto is a web server scanner that tests for potentially dangerous files/CGIs, outdated server software and other issues that could pose security problems."
  },
  {
    id: "dirb",
    name: "Directory Scanner",
    description: "Web content enumeration",
    category: "Vulnerability Analysis",
    icon: DirbIcon,
    color: "text-accent-green",
    helpText: "Directory Scanner uses dictionary-based approaches to find hidden directories and files on web servers. This helps identify potential security issues and information leakage."
  },
  
  // Web Application Security Tools
  {
    id: "sqlmap",
    name: "SQL Injection Scanner",
    description: "Automatic SQL injection detection",
    category: "Web Application Security",
    icon: SqlmapIcon,
    color: "text-amber-500",
    helpText: "SQLMap is an open source penetration testing tool that automates the process of detecting and exploiting SQL injection flaws in web applications."
  },
  {
    id: "xssscanner",
    name: "XSS Scanner",
    description: "Cross-site scripting detection",
    category: "Web Application Security",
    icon: XssIcon,
    color: "text-amber-500",
    helpText: "The XSS Scanner detects cross-site scripting vulnerabilities in web applications by testing various injection points and analyzing responses."
  },
  
  // System Tools
  {
    id: "hashcracker",
    name: "Hash Cracker",
    description: "Password hash analysis tool",
    category: "System Tools",
    icon: HashCrackerIcon,
    color: "text-amber-500",
    helpText: "Hash Cracker attempts to recover passwords from their hash values using various methods including dictionary attacks, brute force, and rainbow tables."
  },
  
  // Network Security Tools
  {
    id: "packetanalyzer",
    name: "Packet Analyzer",
    description: "Network traffic analysis",
    category: "Network Security",
    icon: PacketAnalyzerIcon,
    color: "text-red-500",
    helpText: "Packet Analyzer captures and inspects network traffic in real-time, allowing you to diagnose network issues and identify security concerns."
  },
  {
    id: "macchanger",
    name: "MAC Address Changer",
    description: "Network interface configuration",
    category: "Network Security",
    icon: MacChangerIcon,
    color: "text-red-500",
    helpText: "MAC Address Changer allows you to modify the MAC address of your network interfaces for privacy, testing, or bypassing network restrictions."
  },
  {
    id: "firewallmanager",
    name: "Firewall Manager",
    description: "Network security configuration",
    category: "Network Security",
    icon: FirewallIcon,
    color: "text-red-500",
    helpText: "Firewall Manager provides an interface to configure and monitor firewall rules to control network traffic and enhance security."
  }
];
