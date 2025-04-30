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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  host: z.string().min(1, { message: "Host is required" }),
  port: z.string().default("443"),
  showCertificate: z.boolean().default(false),
  checkVulnerabilities: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export default function SslScannerTool() {
  const { toast } = useToast();
  const [results, setResults] = useState<any>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [target, setTarget] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number | undefined>(undefined);
  
  const { execute, isExecuting } = useToolExecution({
    tool: 'sslscan',
    onSuccess: (data) => {
      setResults(data.results);
      setRawOutput(data.rawOutput);
      setExecutionTime(data.executionTime);
      setTarget(`${form.getValues().host}:${form.getValues().port}`);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "SSL scan failed",
        description: error.message || "An unexpected error occurred",
      });
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      host: "",
      port: "443",
      showCertificate: false,
      checkVulnerabilities: true,
    },
  });

  const onSubmit = (values: FormValues) => {
    execute(values);
  };

  // Helper for rating color
  const getRatingColor = (rating: string) => {
    switch(rating.toLowerCase()) {
      case "a+":
      case "a":
        return "bg-green-500 text-white";
      case "b+":
      case "b":
        return "bg-green-400 text-white";
      case "c+":
      case "c":
        return "bg-yellow-500 text-white";
      case "d+":
      case "d":
        return "bg-orange-500 text-white";
      case "e+":
      case "e":
      case "f+":
      case "f":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Helper for vulnerability status
  const getVulnerabilityStatus = (isVulnerable: boolean) => {
    return isVulnerable 
      ? <Badge variant="destructive">Vulnerable</Badge>
      : <Badge variant="outline" className="bg-green-500 bg-opacity-20 text-green-500 border-0">Secure</Badge>;
  };

  const renderSslResults = () => {
    if (!results) {
      return <div className="text-center text-neutral p-4">No SSL information available</div>;
    }

    return (
      <div className="space-y-6">
        <div className="bg-primary rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium">SSL Rating</h4>
            {results.grade && (
              <Badge className={`text-lg px-3 py-1 ${getRatingColor(results.grade)}`}>
                {results.grade}
              </Badge>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Protocol Strength</span>
                <span>{results.protocolScore || 0}/100</span>
              </div>
              <Progress value={results.protocolScore || 0} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Key Exchange</span>
                <span>{results.keyExchangeScore || 0}/100</span>
              </div>
              <Progress value={results.keyExchangeScore || 0} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Cipher Strength</span>
                <span>{results.cipherScore || 0}/100</span>
              </div>
              <Progress value={results.cipherScore || 0} className="h-2" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-primary rounded-lg shadow-lg overflow-hidden">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-3">Certificate Information</h4>
              <div className="space-y-2">
                {results.certificate && (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-xs text-neutral">Subject:</span>
                      <span className="text-xs col-span-2">{results.certificate.subject}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-xs text-neutral">Issuer:</span>
                      <span className="text-xs col-span-2">{results.certificate.issuer}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-xs text-neutral">Valid From:</span>
                      <span className="text-xs col-span-2">{results.certificate.validFrom}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-xs text-neutral">Valid To:</span>
                      <span className="text-xs col-span-2">{results.certificate.validTo}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary rounded-lg shadow-lg overflow-hidden">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-3">Supported Protocols</h4>
              <div className="space-y-1">
                {results.protocols && results.protocols.map((protocol: string, index: number) => (
                  <div key={index} className="flex items-center py-1">
                    <Badge className={protocol.includes("SSL") ? "bg-red-500" : "bg-green-500"}>
                      {protocol}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {results.vulnerabilities && (
          <Card className="bg-primary rounded-lg shadow-lg overflow-hidden">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-3">Vulnerability Analysis</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-2 bg-primary-light rounded">
                    <span className="text-xs">Heartbleed</span>
                    {getVulnerabilityStatus(results.vulnerabilities.heartbleed)}
                  </div>
                  <div className="flex justify-between items-center p-2 bg-primary-light rounded">
                    <span className="text-xs">POODLE</span>
                    {getVulnerabilityStatus(results.vulnerabilities.poodle)}
                  </div>
                  <div className="flex justify-between items-center p-2 bg-primary-light rounded">
                    <span className="text-xs">FREAK</span>
                    {getVulnerabilityStatus(results.vulnerabilities.freak)}
                  </div>
                  <div className="flex justify-between items-center p-2 bg-primary-light rounded">
                    <span className="text-xs">DROWN</span>
                    {getVulnerabilityStatus(results.vulnerabilities.drown)}
                  </div>
                  <div className="flex justify-between items-center p-2 bg-primary-light rounded">
                    <span className="text-xs">LOGJAM</span>
                    {getVulnerabilityStatus(results.vulnerabilities.logjam)}
                  </div>
                  <div className="flex justify-between items-center p-2 bg-primary-light rounded">
                    <span className="text-xs">BEAST</span>
                    {getVulnerabilityStatus(results.vulnerabilities.beast)}
                  </div>
                </div>
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
          <h3 className="text-md font-semibold mb-3">SSL Scanner Configuration</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hostname</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., example.com"
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
                          placeholder="e.g., 443"
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
                  name="showCertificate"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <label
                        htmlFor="showCertificate"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Show Full Certificate
                      </label>
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="checkVulnerabilities"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <label
                        htmlFor="checkVulnerabilities"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Check for Vulnerabilities
                      </label>
                    </div>
                  )}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-accent-green text-white" 
                  disabled={isExecuting}
                >
                  <Play className="h-4 w-4 mr-2" /> Scan SSL
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
        renderDetails={renderSslResults}
      />
    </div>
  );
}
