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
import { Play } from "lucide-react";
import ToolResults from "../ToolResults";
import { useToolExecution } from "@/hooks/use-tool-execution";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  host: z.string().min(1, { message: "Host is required" }),
  port: z.string().default("80"),
  ssl: z.boolean().default(false),
  noInteractiveAttempts: z.boolean().default(false),
  tuning: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NiktoTool() {
  const { toast } = useToast();
  const [results, setResults] = useState<any>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [target, setTarget] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number | undefined>(undefined);
  
  const { execute, isExecuting } = useToolExecution({
    tool: 'nikto',
    onSuccess: (data) => {
      setResults(data.results);
      setRawOutput(data.rawOutput);
      setExecutionTime(data.executionTime);
      setTarget(`${form.getValues().host}:${form.getValues().port}`);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Nikto scan failed",
        description: error.message || "An unexpected error occurred",
      });
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      host: "",
      port: "80",
      ssl: false,
      noInteractiveAttempts: false,
      tuning: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    execute(values);
  };

  // Get severity color for findings
  const getSeverityColor = (severity: string) => {
    switch(severity.toLowerCase()) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-orange-500 text-white";
      case "low":
        return "bg-yellow-500 text-white";
      case "info":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const renderNiktoResults = () => {
    if (!results || !results.findings || results.findings.length === 0) {
      return <div className="text-center text-neutral p-4">No vulnerabilities found</div>;
    }

    // Group findings by category
    const groupedFindings: Record<string, any[]> = {};
    results.findings.forEach((finding: any) => {
      if (!groupedFindings[finding.category]) {
        groupedFindings[finding.category] = [];
      }
      groupedFindings[finding.category].push(finding);
    });

    return (
      <div className="space-y-6">
        <div className="bg-primary rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium">Scan Summary</h4>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">Total Vulnerabilities</p>
              <p className="text-xl font-semibold">{results.findings.length}</p>
            </div>
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">High Severity</p>
              <p className="text-xl font-semibold text-red-500">
                {results.findings.filter((f: any) => f.severity.toLowerCase() === 'high').length}
              </p>
            </div>
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">Medium Severity</p>
              <p className="text-xl font-semibold text-orange-500">
                {results.findings.filter((f: any) => f.severity.toLowerCase() === 'medium').length}
              </p>
            </div>
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">Low Severity</p>
              <p className="text-xl font-semibold text-yellow-500">
                {results.findings.filter((f: any) => f.severity.toLowerCase() === 'low').length}
              </p>
            </div>
          </div>
        </div>

        {Object.entries(groupedFindings).map(([category, findings]) => (
          <Card key={category} className="bg-primary rounded-lg shadow-lg overflow-hidden">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-3">{category}</h4>
              <div className="space-y-3">
                {findings.map((finding, index) => (
                  <div key={index} className="bg-primary-light p-3 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="text-sm font-medium">{finding.title}</h5>
                      <Badge className={`${getSeverityColor(finding.severity)}`}>
                        {finding.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-light mb-2">{finding.description}</p>
                    {finding.url && (
                      <div className="text-xs">
                        <span className="text-neutral">URL:</span> {finding.url}
                      </div>
                    )}
                    {finding.osvdb && (
                      <div className="text-xs">
                        <span className="text-neutral">OSVDB:</span> {finding.osvdb}
                      </div>
                    )}
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
          <h3 className="text-md font-semibold mb-3">Nikto Scanner Configuration</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Host/IP</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., example.com or 192.168.1.1"
                          className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Port</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 80"
                          className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ssl"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <label
                        htmlFor="ssl"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Use SSL/HTTPS
                      </label>
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="noInteractiveAttempts"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <label
                        htmlFor="noInteractiveAttempts"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        No Interactive Attempts
                      </label>
                    </div>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="tuning"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tuning Options (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 1,2,3 (comma separated test ids)"
                        className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
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
        renderDetails={renderNiktoResults}
      />
    </div>
  );
}
