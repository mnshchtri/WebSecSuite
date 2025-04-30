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

// Define the form schema
const formSchema = z.object({
  url: z.string().min(1, { message: "URL is required" }),
  parameter: z.string().optional(),
  method: z.string().default("GET"),
  data: z.string().optional(),
  cookie: z.string().optional(),
  userAgent: z.boolean().default(false),
  referer: z.boolean().default(false),
  testAllParams: z.boolean().default(true),
  testForms: z.boolean().default(false),
  depth: z.string().default("1"),
});

type FormValues = z.infer<typeof formSchema>;

export default function XssScannerTool() {
  const { toast } = useToast();
  const [results, setResults] = useState<any>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [target, setTarget] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number | undefined>(undefined);
  
  const { execute, isExecuting } = useToolExecution({
    tool: 'xss',
    onSuccess: (data) => {
      setResults(data.results);
      setRawOutput(data.rawOutput);
      setExecutionTime(data.executionTime);
      setTarget(form.getValues().url);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "XSS scan failed",
        description: error.message || "An unexpected error occurred",
      });
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      parameter: "",
      method: "GET",
      data: "",
      cookie: "",
      userAgent: false,
      referer: false,
      testAllParams: true,
      testForms: false,
      depth: "1",
    },
  });

  const onSubmit = (values: FormValues) => {
    execute(values);
  };

  const getSeverityColor = (severity: string) => {
    switch(severity.toLowerCase()) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-orange-500 text-white";
      case "low":
        return "bg-yellow-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const renderXssResults = () => {
    if (!results || !results.vulnerabilities || results.vulnerabilities.length === 0) {
      return (
        <div className="text-center text-neutral p-4 bg-primary rounded-lg">
          {results?.message ? (
            <p>{results.message}</p>
          ) : (
            <p>No XSS vulnerabilities detected</p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-primary rounded-lg p-4">
          <h4 className="text-md font-medium mb-3">Vulnerability Summary</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">Total Vulnerabilities</p>
              <p className="text-xl font-semibold text-red-500">{results.vulnerabilities.length}</p>
            </div>
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">Payload Count</p>
              <p className="text-xl font-semibold">{results.payloadCount || 0}</p>
            </div>
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">Parameters Tested</p>
              <p className="text-xl font-semibold">{results.testedParams?.length || 0}</p>
            </div>
          </div>
        </div>

        <Card className="bg-primary rounded-lg shadow-lg overflow-hidden">
          <CardContent className="p-4">
            <h4 className="text-md font-medium mb-3">Detected Vulnerabilities</h4>
            <div className="space-y-3">
              {results.vulnerabilities.map((vuln: any, index: number) => (
                <div key={index} className="bg-primary-light p-3 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-sm font-medium">{vuln.type || "XSS Vulnerability"}</h5>
                    <Badge className={getSeverityColor(vuln.severity || "medium")}>
                      {vuln.severity || "Medium"}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                    <div>
                      <p className="text-xs text-neutral">Vulnerable URL</p>
                      <p className="text-xs text-neutral-light break-all">{vuln.url || target}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral">Parameter</p>
                      <p className="text-xs text-neutral-light">{vuln.parameter || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <p className="text-xs text-neutral">Description</p>
                    <p className="text-xs text-neutral-light">{vuln.description || "Cross-Site Scripting vulnerability allows attackers to inject client-side scripts into web pages viewed by other users."}</p>
                  </div>
                  
                  {vuln.payload && (
                    <div>
                      <p className="text-xs text-neutral">Payload</p>
                      <pre className="mt-1 p-2 bg-primary font-mono text-xs overflow-x-auto text-neutral-light">{vuln.payload}</pre>
                    </div>
                  )}
                  
                  {vuln.context && (
                    <div className="mt-2">
                      <p className="text-xs text-neutral">Context</p>
                      <pre className="mt-1 p-2 bg-primary font-mono text-xs overflow-x-auto text-neutral-light">{vuln.context}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {results.testedParams && results.testedParams.length > 0 && (
          <Card className="bg-primary rounded-lg shadow-lg overflow-hidden">
            <CardContent className="p-4">
              <h4 className="text-md font-medium mb-3">Tested Parameters</h4>
              <div className="flex flex-wrap gap-2">
                {results.testedParams.map((param: string, index: number) => (
                  <Badge key={index} variant="outline" className="bg-primary-light">
                    {param}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div>
      <Card className="bg-primary-light rounded-lg shadow-lg p-4 mb-6">
        <CardContent className="p-0">
          <h3 className="text-md font-semibold mb-3">XSS Scanner Configuration</h3>
          
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
                        placeholder="e.g., http://example.com/page.php?id=1"
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
                  name="parameter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parameter (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., id (leave empty to test all)"
                          className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HTTP Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                            <SelectValue placeholder="Select HTTP method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>POST Data (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., id=1&user=admin"
                        className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cookie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cookies (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., PHPSESSID=123abc; user=admin"
                        className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="userAgent"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label
                          htmlFor="userAgent"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Test User-Agent Header
                        </label>
                      </div>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="referer"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label
                          htmlFor="referer"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Test Referer Header
                        </label>
                      </div>
                    )}
                  />
                </div>
                
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="testAllParams"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label
                          htmlFor="testAllParams"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Test All Parameters
                        </label>
                      </div>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="testForms"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label
                          htmlFor="testForms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Test Forms
                        </label>
                      </div>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="depth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crawl Depth</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                          <SelectValue placeholder="Select crawl depth" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">0 (No crawling)</SelectItem>
                        <SelectItem value="1">1 (Current page only)</SelectItem>
                        <SelectItem value="2">2 (Follow links 1 level deep)</SelectItem>
                        <SelectItem value="3">3 (Follow links 2 levels deep)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-amber-500 text-white" 
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
        renderDetails={renderXssResults}
      />
    </div>
  );
}
