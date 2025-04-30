import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play } from "lucide-react";
import ToolResults from "../ToolResults";
import { useToolExecution } from "@/hooks/use-tool-execution";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  url: z.string().min(1, { message: "URL is required" }),
  wordlist: z.string().default("common"),
  extensions: z.string().optional(),
  recursive: z.boolean().default(false),
  caseSensitive: z.boolean().default(false),
  speed: z.string().default("normal"),
});

type FormValues = z.infer<typeof formSchema>;

export default function DirbTool() {
  const { toast } = useToast();
  const [results, setResults] = useState<any>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [target, setTarget] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number | undefined>(undefined);
  
  const { execute, isExecuting } = useToolExecution({
    tool: 'dirb',
    onSuccess: (data) => {
      setResults(data.results);
      setRawOutput(data.rawOutput);
      setExecutionTime(data.executionTime);
      setTarget(form.getValues().url);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Directory scan failed",
        description: error.message || "An unexpected error occurred",
      });
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      wordlist: "common",
      extensions: "",
      recursive: false,
      caseSensitive: false,
      speed: "normal",
    },
  });

  const onSubmit = (values: FormValues) => {
    execute(values);
  };

  // Get status code color
  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return "bg-green-500 text-white";
    } else if (statusCode >= 300 && statusCode < 400) {
      return "bg-blue-500 text-white";
    } else if (statusCode >= 400 && statusCode < 500) {
      return "bg-yellow-500 text-white";
    } else if (statusCode >= 500) {
      return "bg-red-500 text-white";
    }
    return "bg-gray-500 text-white";
  };

  const renderResults = () => {
    if (!results || !results.findings || results.findings.length === 0) {
      return <div className="text-center text-neutral p-4">No directories or files found</div>;
    }

    // Group by status code
    const groupedFindings: Record<string, any[]> = {};
    results.findings.forEach((finding: any) => {
      const statusGroup = finding.statusCode ? String(Math.floor(finding.statusCode / 100) * 100) : "Other";
      if (!groupedFindings[statusGroup]) {
        groupedFindings[statusGroup] = [];
      }
      groupedFindings[statusGroup].push(finding);
    });

    // Get status group labels
    const getGroupLabel = (group: string) => {
      switch(group) {
        case "200": return "Success (2xx)";
        case "300": return "Redirection (3xx)";
        case "400": return "Client Errors (4xx)";
        case "500": return "Server Errors (5xx)";
        default: return "Other";
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-primary rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium">Scan Summary</h4>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">Total Entries</p>
              <p className="text-xl font-semibold">{results.findings.length}</p>
            </div>
            {results.scannedCount && (
              <div className="bg-primary-light p-3 rounded-lg">
                <p className="text-xs text-neutral">Items Scanned</p>
                <p className="text-xl font-semibold">{results.scannedCount}</p>
              </div>
            )}
            {results.successfulHits && (
              <div className="bg-primary-light p-3 rounded-lg">
                <p className="text-xs text-neutral">Successful Hits</p>
                <p className="text-xl font-semibold text-green-500">{results.successfulHits}</p>
              </div>
            )}
          </div>
        </div>

        {Object.entries(groupedFindings).map(([statusGroup, findings]) => (
          <Card key={statusGroup} className="bg-primary rounded-lg shadow-lg overflow-hidden">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-3">{getGroupLabel(statusGroup)}</h4>
              <div className="space-y-1">
                {findings.map((finding, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-primary-light rounded-lg hover:bg-primary-light/80">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {finding.type === "directory" ? (
                        <span className="flex-shrink-0 text-blue-400">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                        </span>
                      ) : (
                        <span className="flex-shrink-0 text-neutral">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </span>
                      )}
                      <span className="text-xs truncate">{finding.path}</span>
                    </div>
                    <Badge className={`${getStatusColor(finding.statusCode)}`}>
                      {finding.statusCode}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Card className="bg-primary-light rounded-lg shadow-lg p-4 mb-6">
        <CardContent className="p-0">
          <h3 className="text-md font-semibold mb-3">Directory Scanner Configuration</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., https://example.com/"
                        className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="wordlist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wordlist</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                            <SelectValue placeholder="Select a wordlist" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="common">Common</SelectItem>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="vulns">Vulnerabilities</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="extensions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Extensions (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., php,html,txt (comma separated)"
                          className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="recursive"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <label
                        htmlFor="recursive"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Recursive Scan
                      </label>
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="caseSensitive"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <label
                        htmlFor="caseSensitive"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Case Sensitive
                      </label>
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="speed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scan Speed</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                            <SelectValue placeholder="Select scan speed" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="slow">Slow</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="fast">Fast</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-accent-green text-white" 
                  disabled={isExecuting}
                >
                  <Play className="h-4 w-4 mr-2" /> Run Scan
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <ToolResults 
        isLoading={isExecuting}
        results={results}
        rawOutput={rawOutput}
        target={target}
        executionTime={executionTime}
        renderDetails={renderResults}
      />
    </div>
  );
}
