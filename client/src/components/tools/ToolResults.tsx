import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ToolResultsProps {
  isLoading: boolean;
  results: Record<string, any> | null;
  rawOutput: string | null;
  target?: string;
  executionTime?: number;
  onExport?: () => void;
  renderDetails?: () => React.ReactNode;
}

export default function ToolResults({
  isLoading,
  results,
  rawOutput,
  target,
  executionTime,
  onExport,
  renderDetails
}: ToolResultsProps) {
  const [activeTab, setActiveTab] = useState("details");

  // Default export function if none provided
  const handleExport = onExport || (() => {
    if (!results && !rawOutput) return;
    
    const exportData = JSON.stringify(results || { rawOutput }, null, 2);
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `scan-results-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  return (
    <Card className="bg-black/40 rounded-lg shadow-lg overflow-hidden border border-emerald-500/20">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3 border-b border-emerald-900/30 bg-black/30">
        <CardTitle className="text-md font-semibold">Scan Results</CardTitle>
        <div className="flex items-center">
          {isLoading && (
            <div className="mr-3">
              <span className="text-xs bg-accent-blue bg-opacity-20 text-accent-blue py-1 px-2 rounded-full flex items-center">
                <span className="w-2 h-2 bg-accent-blue rounded-full animate-pulse mr-1"></span>
                Running
              </span>
            </div>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="text-neutral-light hover:text-white text-sm"
            onClick={handleExport}
            disabled={!results && !rawOutput}
          >
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
        </div>
      </CardHeader>

      {!isLoading && !results && !rawOutput ? (
        <div className="p-6 text-center text-neutral">
          <svg
            className="h-12 w-12 mx-auto mb-3 text-neutral"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          <p>Run a scan to see results</p>
        </div>
      ) : (
        <CardContent className={cn(isLoading ? "opacity-60" : "opacity-100", "transition-opacity")}>
          {(target || executionTime !== undefined) && (
            <div className="flex justify-between items-center mb-3 mt-4">
              {target && (
                <div>
                  <span className="text-sm text-neutral-light">Target:</span>
                  <span className="text-sm ml-2">{target}</span>
                </div>
              )}
              {executionTime !== undefined && (
                <div>
                  <span className="text-sm text-neutral-light">Scan Time:</span>
                  <span className="text-sm ml-2">{executionTime.toFixed(1)}s</span>
                </div>
              )}
            </div>
          )}

          <Tabs defaultValue="details" className="mt-4" onValueChange={setActiveTab}>
            <TabsList className="border-b border-primary bg-transparent">
              <TabsTrigger 
                value="details" 
                className={activeTab === "details" ? "text-accent-blue border-b-2 border-accent-blue rounded-none" : "text-neutral hover:text-white rounded-none"}
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="raw" 
                className={activeTab === "raw" ? "text-accent-blue border-b-2 border-accent-blue rounded-none" : "text-neutral hover:text-white rounded-none"}
              >
                Raw Output
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-4">
              {renderDetails ? renderDetails() : (
                <div className="bg-primary rounded-lg p-3">
                  <p className="text-neutral-light">No detailed view available for this result.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="raw" className="mt-4">
              <div className="font-mono text-sm text-neutral-lighter bg-primary p-4 rounded-lg overflow-x-auto max-h-[400px] overflow-y-auto">
                <pre className="whitespace-pre-wrap">{rawOutput || "No raw output available"}</pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}
