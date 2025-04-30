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
      <Card className="bg-primary-light rounded-lg p-4 shadow-lg">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-accent-blue bg-opacity-10 text-accent-blue">
            <RadarIcon className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-neutral">Active Scans</p>
            <p className="text-xl font-semibold">{displayStats.activeScans}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-primary-light rounded-lg p-4 shadow-lg">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-accent-green bg-opacity-10 text-accent-green">
            <ShieldCheckIcon className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-neutral">Systems Secured</p>
            <p className="text-xl font-semibold">{displayStats.systemsSecured}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-primary-light rounded-lg p-4 shadow-lg">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-amber-500 bg-opacity-10 text-amber-500">
            <AlertTriangleIcon className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-neutral">Vulnerabilities</p>
            <p className="text-xl font-semibold">{displayStats.vulnerabilities}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-primary-light rounded-lg p-4 shadow-lg">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-500 bg-opacity-10 text-red-500">
            <AlertOctagonIcon className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-neutral">Critical Issues</p>
            <p className="text-xl font-semibold">{displayStats.criticalIssues}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
