import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Play } from "lucide-react";
import ToolResults from "../ToolResults";
import { useToolExecution } from "@/hooks/use-tool-execution";

// Define the form schema
const formSchema = z.object({
  target: z.string().min(1, { message: "Target IP/Domain is required" }),
  scanType: z.string().default("basic"),
  osDetection: z.boolean().default(false),
  versionDetection: z.boolean().default(false),
  scriptScan: z.boolean().default(false),
  additionalParams: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NmapTool() {
  const { toast } = useToast();
  const [results, setResults] = useState<any>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [target, setTarget] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number | undefined>(undefined);
  
  const { execute, isExecuting } = useToolExecution({
    tool: 'nmap',
    onSuccess: (data) => {
      setResults(data.results);
      setRawOutput(data.rawOutput);
      setExecutionTime(data.executionTime);
      setTarget(form.getValues().target);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Scan failed",
        description: error.message || "An unexpected error occurred",
      });
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      target: "",
      scanType: "basic",
      osDetection: false,
      versionDetection: false,
      scriptScan: false,
      additionalParams: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    execute(values);
  };

  const renderPortsTable = () => {
    if (!results || !results.ports) {
      return <div className="text-center text-emerald-400/60">No port details available</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-xs text-emerald-400/80 uppercase tracking-wider text-left">
              <th className="py-2 px-3">Port</th>
              <th className="py-2 px-3">State</th>
              <th className="py-2 px-3">Service</th>
              <th className="py-2 px-3">Version</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-900/30">
            {results.ports.map((port: any, index: number) => (
              <tr key={index} className="hover:bg-emerald-900/20 transition-colors duration-150">
                <td className="py-3 px-3">{port.port}/{port.protocol}</td>
                <td className="py-3 px-3">
                  <span className={`text-xs py-1 px-2 rounded-full ${
                    port.state === 'open' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30' : 
                    port.state === 'filtered' ? 'bg-amber-900/30 text-amber-300 border border-amber-500/30' : 
                    'bg-red-900/30 text-red-400 border border-red-500/30'
                  }`}>
                    {port.state}
                  </span>
                </td>
                <td className="py-3 px-3">{port.service || '-'}</td>
                <td className="py-3 px-3">{port.version || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderSummary = () => {
    if (!results || !results.summary) {
      return null;
    }

    const { open, closed, filtered } = results.summary;

    return (
      <div className="bg-primary rounded-lg p-3 mb-4">
        <h4 className="text-sm font-medium mb-2">Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-neutral">Open Ports</span>
            <p className="text-accent-green font-medium">{open}</p>
          </div>
          <div>
            <span className="text-neutral">Closed Ports</span>
            <p className="text-amber-500 font-medium">{closed}</p>
          </div>
          <div>
            <span className="text-neutral">Filtered Ports</span>
            <p className="text-neutral-light font-medium">{filtered}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Card className="bg-primary-light rounded-lg shadow-lg p-4 mb-6">
        <CardContent className="p-0">
          <h3 className="text-md font-semibold mb-3">Tool Configuration</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target IP/Domain</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 192.168.1.1 or example.com"
                          className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="scanType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scan Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                            <SelectValue placeholder="Select a scan type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="basic">Basic Scan (-sV)</SelectItem>
                          <SelectItem value="quick">Quick Scan (-T4 -F)</SelectItem>
                          <SelectItem value="intense">Intense Scan (-T4 -A -v)</SelectItem>
                          <SelectItem value="stealth">Stealth Scan (-sS -T2)</SelectItem>
                          <SelectItem value="comprehensive">Comprehensive (-sS -sU -T4 -A -v)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormItem className="mb-4">
                <FormLabel>Additional Options</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="osDetection"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label
                          htmlFor="osDetection"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          OS Detection
                        </label>
                      </div>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="versionDetection"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label
                          htmlFor="versionDetection"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Version Detection
                        </label>
                      </div>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="scriptScan"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label
                          htmlFor="scriptScan"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Script Scanning
                        </label>
                      </div>
                    )}
                  />
                </div>
              </FormItem>
              
              <FormField
                control={form.control}
                name="additionalParams"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advanced Command (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Additional nmap parameters"
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
                  className="bg-accent-blue text-white" 
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
        renderDetails={() => (
          <>
            {renderSummary()}
            {renderPortsTable()}
          </>
        )}
      />
    </div>
  );
}
