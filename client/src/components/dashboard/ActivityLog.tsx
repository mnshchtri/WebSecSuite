import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Activity = {
  id: string;
  type: "success" | "warning" | "error";
  message: string;
  timestamp: string;
};

export default function ActivityLog() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['/api/activities'],
    retry: false,
  });

  // Default empty array so we can map over it
  const activityItems = activities || [];

  // Time ago formatter
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  // Helper to determine indicator color
  const getIndicatorColor = (type: string) => {
    switch(type) {
      case "success": return "bg-accent-green";
      case "warning": return "bg-amber-500";
      case "error": return "bg-red-500";
      default: return "bg-accent-blue";
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <Card className="bg-primary-light rounded-lg shadow-lg overflow-hidden">
        {isLoading ? (
          <CardContent className="p-0">
            {Array(3).fill(null).map((_, i) => (
              <div key={i} className="px-4 py-3 border-b border-primary last:border-b-0">
                <div className="flex items-center">
                  <Skeleton className="h-2 w-2 rounded-full mr-3" />
                  <Skeleton className="h-4 w-full max-w-[250px]" />
                  <Skeleton className="h-3 w-16 ml-auto" />
                </div>
              </div>
            ))}
          </CardContent>
        ) : activityItems.length === 0 ? (
          <CardContent className="py-6 text-center text-neutral">
            <p>No recent activity</p>
          </CardContent>
        ) : (
          <ul className="divide-y divide-primary">
            {activityItems.map((activity: Activity) => (
              <li key={activity.id} className="px-4 py-3 hover:bg-primary transition-colors">
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full ${getIndicatorColor(activity.type)} mr-3`}></span>
                  <span className="text-sm">{activity.message}</span>
                  <span className="ml-auto text-xs text-neutral">{formatTimeAgo(activity.timestamp)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
