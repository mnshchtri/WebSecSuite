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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play } from "lucide-react";
import ToolResults from "../ToolResults";
import { useToolExecution } from "@/hooks/use-tool-execution";
import { Badge } from "@/components/ui/badge";

// Define the form schema
const formSchema = z.object({
  url: z.string().min(1, { message: "URL is required" }),
  method: z.string().default("GET"),
  data: z.string().optional(),
  cookie: z.string().optional(),
  headers: z.string().optional(),
  level: z.string().default("1"),
  risk: z.string().default("1"),
  testForms: z.boolean().default(false),
  testUserAgent: z.boolean().default(false),
  testReferer: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function SqlmapTool() {
  const { toast } = useToast();
  const [results, setResults] = useState<any>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [target, setTarget] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number | undefined>(undefined);
  
  const { execute, isExecuting } = useToolExecution({
    tool: 'sqlmap',
    onSuccess: (data) => {
      setResults(data.results);
      setRawOutput(data.rawOutput);
      setExecutionTime(data.executionTime);
      setTarget(form.getValues().url);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "SQL injection scan failed",
        description: error.message || "An unexpected error occurred",
      });
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      method: "GET",
      data: "",
      cookie: "",
      headers: "",
      level: "1",
      risk: "1",
      testForms: false,
      testUserAgent: false,
      testReferer: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    execute(values);
  };

  const renderSqlmapResults = () => {
    if (!results || !results.vulnerabilities || results.vulnerabilities.length === 0) {
      return (
        <div className="text-center text-neutral p-4 bg-primary rounded-lg">
          {results?.message ? (
            <p>{results.message}</p>
          ) : (
            <p>No SQL injection vulnerabilities detected</p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-primary rounded-lg p-4">
          <h4 className="text-md font-medium mb-3">Vulnerability Summary</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">Total Vulnerabilities</p>
              <p className="text-xl font-semibold text-red-500">{results.vulnerabilities.length}</p>
            </div>
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">Payload Count</p>
              <p className="text-xl font-semibold">{results.payloadCount || 0}</p>
            </div>
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">Database Type</p>
              <p className="text-xl font-semibold">{results.dbms || "Unknown"}</p>
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
                    <h5 className="text-sm font-medium">{vuln.type}</h5>
                    <Badge className="bg-red-500">
                      {vuln.severity || "High"}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-light mb-2">{vuln.details}</p>
                  {vuln.parameter && (
                    <div className="text-xs">
                      <span className="text-neutral">Parameter:</span> {vuln.parameter}
                    </div>
                  )}
                  {vuln.payload && (
                    <div className="text-xs mt-1">
                      <span className="text-neutral">Payload:</span>
                      <pre className="mt-1 p-1 bg-primary font-mono text-xs overflow-x-auto">{vuln.payload}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {results.dbInfo && (
          <Card className="bg-primary rounded-lg shadow-lg overflow-hidden">
            <CardContent className="p-4">
              <h4 className="text-md font-medium mb-3">Database Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(results.dbInfo).map(([key, value]) => (
                  <div key={key} className="bg-primary-light p-2 rounded-lg">
                    <p className="text-xs text-neutral">{key}</p>
                    <p className="text-sm truncate font-medium">{value as string}</p>
                  </div>
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
          <h3 className="text-md font-semibold mb-3">SQL Injection Scanner Configuration</h3>
          
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
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detection Level (1-5)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 (Fast)</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3 (Default)</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5 (Thorough)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="risk"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Level (1-3)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                            <SelectValue placeholder="Select risk level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 (Low risk)</SelectItem>
                          <SelectItem value="2">2 (Medium risk)</SelectItem>
                          <SelectItem value="3">3 (High risk)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
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
              
              <FormField
                control={form.control}
                name="headers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Headers (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., X-Forwarded-For: 127.0.0.1"
                        className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                
                <FormField
                  control={form.control}
                  name="testUserAgent"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <label
                        htmlFor="testUserAgent"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Test User-Agent
                      </label>
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="testReferer"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <label
                        htmlFor="testReferer"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Test Referer
                      </label>
                    </div>
                  )}
                />
              </div>
              
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
        renderDetails={renderSqlmapResults}
      />
    </div>
  );
}
