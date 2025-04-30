import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  RadarIcon, 
  ShieldCheckIcon, 
  AlertTriangleIcon, 
  AlertOctagonIcon 
} from "lucide-react";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats'],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array(4).fill(null).map((_, i) => (
          <Card key={i} className="bg-primary-light p-4 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-accent-blue bg-opacity-10">
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
              <div className="ml-3">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-8" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Default stats if the API doesn't return data
  const defaultStats = {
    activeScans: 0,
    systemsSecured: 0,
    vulnerabilities: 0,
    criticalIssues: 0
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Brahma Card - Information/Reconnaissance (Blue theme) */}
      <Card className="bg-primary-light overflow-hidden rounded-lg shadow-lg">
        <div className="h-1 brahma-gradient"></div>
        <div className="p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full brahma-gradient text-white">
              <RadarIcon className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral">Active Scans</p>
              <p className="text-xl font-semibold">{displayStats.activeScans}</p>
              <p className="text-xs text-neutral-light mt-1">Brahma Mode</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Vishnu Card - Preservation/Maintenance (Green theme) */}
      <Card className="bg-primary-light overflow-hidden rounded-lg shadow-lg">
        <div className="h-1 vishnu-gradient"></div>
        <div className="p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full vishnu-gradient text-white">
              <ShieldCheckIcon className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral">Systems Secured</p>
              <p className="text-xl font-semibold">{displayStats.systemsSecured}</p>
              <p className="text-xs text-neutral-light mt-1">Vishnu Mode</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Trinity Balance Card - Network Management (Mixed theme) */}
      <Card className="bg-primary-light overflow-hidden rounded-lg shadow-lg">
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"></div>
        <div className="p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-white">
              <AlertTriangleIcon className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral">Vulnerabilities</p>
              <p className="text-xl font-semibold">{displayStats.vulnerabilities}</p>
              <p className="text-xs text-neutral-light mt-1">Trinity Balance</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Shiva Card - Destruction/Exploitation (Red theme) */}
      <Card className="bg-primary-light overflow-hidden rounded-lg shadow-lg">
        <div className="h-1 shiva-gradient"></div>
        <div className="p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full shiva-gradient text-white">
              <AlertOctagonIcon className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral">Critical Issues</p>
              <p className="text-xl font-semibold">{displayStats.criticalIssues}</p>
              <p className="text-xs text-neutral-light mt-1">Shiva Mode</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
