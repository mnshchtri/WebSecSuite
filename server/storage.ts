import { users, type User, type InsertUser, stats, activities, type Activity, type InsertActivity, scanResults, type ScanResult, type InsertScanResult } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Stats operations
  getStats(): Promise<any>;
  updateStats(newStats: any): Promise<any>;
  
  // Activity operations
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Scan results operations
  getScanResult(id: number): Promise<ScanResult | undefined>;
  getScanResultsByTool(toolId: string): Promise<ScanResult[]>;
  createScanResult(result: InsertScanResult): Promise<ScanResult>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private statsData: any;
  private activitiesData: Activity[];
  private scanResultsData: Map<number, ScanResult>;
  currentId: number;
  currentActivityId: number;
  currentScanResultId: number;

  constructor() {
    this.users = new Map();
    this.activitiesData = [];
    this.scanResultsData = new Map();
    this.currentId = 1;
    this.currentActivityId = 1;
    this.currentScanResultId = 1;
    
    // Initialize with mock stats
    this.statsData = {
      activeScans: 2,
      systemsSecured: 18,
      vulnerabilities: 7,
      criticalIssues: 1
    };
    
    // Initialize with mock activities
    this.activitiesData = [
      {
        id: this.currentActivityId++,
        type: "success",
        message: "Port scan completed on 192.168.1.0/24",
        timestamp: new Date(Date.now() - 10 * 60000)
      },
      {
        id: this.currentActivityId++,
        type: "warning",
        message: "Directory enumeration detected weak permissions",
        timestamp: new Date(Date.now() - 34 * 60000)
      },
      {
        id: this.currentActivityId++,
        type: "error",
        message: "SQL injection vulnerability found in web application",
        timestamp: new Date(Date.now() - 120 * 60000)
      }
    ];
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Stats methods
  async getStats(): Promise<any> {
    return this.statsData;
  }
  
  async updateStats(newStats: any): Promise<any> {
    this.statsData = { ...this.statsData, ...newStats };
    return this.statsData;
  }
  
  // Activity methods
  async getActivities(limit: number = 10): Promise<Activity[]> {
    return this.activitiesData
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
  
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const newActivity: Activity = {
      ...activity,
      id: this.currentActivityId++,
      timestamp: new Date()
    };
    this.activitiesData.push(newActivity);
    
    // Update stats based on activity type
    if (activity.type === 'error') {
      this.statsData.criticalIssues++;
    } else if (activity.message.includes('vulnerability')) {
      this.statsData.vulnerabilities++;
    }
    
    return newActivity;
  }
  
  // Scan results methods
  async getScanResult(id: number): Promise<ScanResult | undefined> {
    return this.scanResultsData.get(id);
  }
  
  async getScanResultsByTool(toolId: string): Promise<ScanResult[]> {
    return Array.from(this.scanResultsData.values())
      .filter(result => result.toolId === toolId);
  }
  
  async createScanResult(result: InsertScanResult): Promise<ScanResult> {
    const id = this.currentScanResultId++;
    const scanResult: ScanResult = {
      ...result,
      id,
      timestamp: new Date()
    };
    this.scanResultsData.set(id, scanResult);
    
    // Update active scans count
    this.statsData.activeScans = Math.max(1, this.statsData.activeScans);
    
    return scanResult;
  }
}

export const storage = new MemStorage();
