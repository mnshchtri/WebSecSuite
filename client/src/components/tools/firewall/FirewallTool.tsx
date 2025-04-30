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
import { Shield, Plus, Trash2 } from "lucide-react";
import ToolResults from "../ToolResults";
import { useToolExecution } from "@/hooks/use-tool-execution";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Define the form schema
const formSchema = z.object({
  action: z.string().default("show"),
  chain: z.string().default("INPUT"),
  protocol: z.string().optional(),
  sourceIp: z.string().optional(),
  destinationIp: z.string().optional(),
  sourcePort: z.string().optional(),
  destinationPort: z.string().optional(),
  interface: z.string().optional(),
  target: z.string().default("ACCEPT"),
  newRuleType: z.string().default("basic"),
});

type FormValues = z.infer<typeof formSchema>;

export default function FirewallTool() {
  const { toast } = useToast();
  const [results, setResults] = useState<any>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [target, setTarget] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number | undefined>(undefined);
  
  const { execute, isExecuting } = useToolExecution({
    tool: 'firewall',
    onSuccess: (data) => {
      setResults(data.results);
      setRawOutput(data.rawOutput);
      setExecutionTime(data.executionTime);
      setTarget(form.getValues().chain);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Firewall operation failed",
        description: error.message || "An unexpected error occurred",
      });
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      action: "show",
      chain: "INPUT",
      protocol: "",
      sourceIp: "",
      destinationIp: "",
      sourcePort: "",
      destinationPort: "",
      interface: "",
      target: "ACCEPT",
      newRuleType: "basic",
    },
  });
  
  const action = form.watch("action");
  const newRuleType = form.watch("newRuleType");

  const onSubmit = (values: FormValues) => {
    execute(values);
  };

  const renderRules = () => {
    if (!results || !results.rules || !Array.isArray(results.rules) || results.rules.length === 0) {
      return (
        <div className="text-center text-neutral p-4 bg-primary rounded-lg">
          {results?.message ? (
            <p>{results.message}</p>
          ) : (
            <p>No firewall rules available</p>
          )}
        </div>
      );
    }

    const getTargetColor = (target: string) => {
      switch(target.toUpperCase()) {
        case "ACCEPT": return "bg-green-500 text-white";
        case "DROP": return "bg-red-500 text-white";
        case "REJECT": return "bg-red-500 text-white";
        case "LOG": return "bg-blue-500 text-white";
        default: return "bg-gray-500 text-white";
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-primary rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium">Firewall Rules Summary</h4>
            <Badge className="bg-accent-red">
              {results.chain || "Chain"} ({results.rules.length} rules)
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">Default Policy</p>
              <p className="text-xl font-semibold">{results.policy || "N/A"}</p>
            </div>
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">Active Rules</p>
              <p className="text-xl font-semibold">{results.rules.length}</p>
            </div>
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">Status</p>
              <p className="text-xl font-semibold text-green-500">{results.enabled ? "Enabled" : "Disabled"}</p>
            </div>
          </div>
        </div>

        <Card className="bg-primary rounded-lg shadow-lg overflow-hidden">
          <CardContent className="p-4">
            <h4 className="text-md font-medium mb-3">Firewall Rules</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-xs text-neutral-light uppercase tracking-wider text-left">
                    <th className="py-2 px-3">Num</th>
                    <th className="py-2 px-3">Target</th>
                    <th className="py-2 px-3">Protocol</th>
                    <th className="py-2 px-3">Source</th>
                    <th className="py-2 px-3">Destination</th>
                    <th className="py-2 px-3">Options</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary">
                  {results.rules.map((rule: any, index: number) => (
                    <tr key={index} className="hover:bg-primary">
                      <td className="py-3 px-3">{rule.num || index + 1}</td>
                      <td className="py-3 px-3">
                        <Badge className={getTargetColor(rule.target)}>
                          {rule.target}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">{rule.protocol || 'all'}</td>
                      <td className="py-3 px-3">
                        {rule.source}
                        {rule.sourcePort && `:${rule.sourcePort}`}
                      </td>
                      <td className="py-3 px-3">
                        {rule.destination}
                        {rule.destinationPort && `:${rule.destinationPort}`}
                      </td>
                      <td className="py-3 px-3 text-xs">{rule.options || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div>
      <Card className="bg-primary-light rounded-lg shadow-lg p-4 mb-6">
        <CardContent className="p-0">
          <h3 className="text-md font-semibold mb-3">Firewall Manager</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Tabs defaultValue="view" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="view" onClick={() => form.setValue("action", "show")}>
                    View Rules
                  </TabsTrigger>
                  <TabsTrigger value="add" onClick={() => form.setValue("action", "add")}>
                    Add Rule
                  </TabsTrigger>
                  <TabsTrigger value="delete" onClick={() => form.setValue("action", "delete")}>
                    Delete Rule
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="view" className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="chain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Chain</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                              <SelectValue placeholder="Select chain" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="INPUT">INPUT</SelectItem>
                            <SelectItem value="OUTPUT">OUTPUT</SelectItem>
                            <SelectItem value="FORWARD">FORWARD</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="add" className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="newRuleType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Rule Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="basic" id="rule-basic" />
                              <label htmlFor="rule-basic" className="text-sm font-medium">
                                Basic Rule
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="port" id="rule-port" />
                              <label htmlFor="rule-port" className="text-sm font-medium">
                                Port Rule
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="service" id="rule-service" />
                              <label htmlFor="rule-service" className="text-sm font-medium">
                                Service Rule
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="chain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chain</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                              <SelectValue placeholder="Select chain" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="INPUT">INPUT</SelectItem>
                            <SelectItem value="OUTPUT">OUTPUT</SelectItem>
                            <SelectItem value="FORWARD">FORWARD</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="protocol"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Protocol</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                                <SelectValue placeholder="Select protocol" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="tcp">TCP</SelectItem>
                              <SelectItem value="udp">UDP</SelectItem>
                              <SelectItem value="icmp">ICMP</SelectItem>
                              <SelectItem value="all">All</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="target"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                                <SelectValue placeholder="Select target" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ACCEPT">ACCEPT</SelectItem>
                              <SelectItem value="DROP">DROP</SelectItem>
                              <SelectItem value="REJECT">REJECT</SelectItem>
                              <SelectItem value="LOG">LOG</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {(newRuleType === "basic" || newRuleType === "port") && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sourceIp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Source IP/Network</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 192.168.1.0/24 or empty for any"
                                className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="destinationIp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination IP/Network</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 10.0.0.1 or empty for any"
                                className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  {newRuleType === "port" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sourcePort"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Source Port</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 1024:65535 or empty for any"
                                className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="destinationPort"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination Port</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 80,443 or empty for any"
                                className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  {newRuleType === "service" && (
                    <FormField
                      control={form.control}
                      name="destinationPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                                <SelectValue placeholder="Select service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="22">SSH (22)</SelectItem>
                              <SelectItem value="80">HTTP (80)</SelectItem>
                              <SelectItem value="443">HTTPS (443)</SelectItem>
                              <SelectItem value="21">FTP (21)</SelectItem>
                              <SelectItem value="25">SMTP (25)</SelectItem>
                              <SelectItem value="53">DNS (53)</SelectItem>
                              <SelectItem value="3306">MySQL (3306)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="interface"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interface (Optional)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                              <SelectValue placeholder="Select interface" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Any</SelectItem>
                            <SelectItem value="eth0">eth0</SelectItem>
                            <SelectItem value="wlan0">wlan0</SelectItem>
                            <SelectItem value="lo">lo</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="delete" className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="chain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chain</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                              <SelectValue placeholder="Select chain" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="INPUT">INPUT</SelectItem>
                            <SelectItem value="OUTPUT">OUTPUT</SelectItem>
                            <SelectItem value="FORWARD">FORWARD</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sourceIp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rule Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 1 (leave empty to delete all rules)"
                            className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-red-500 text-white" 
                  disabled={isExecuting}
                >
                  {action === "show" ? (
                    <>
                      <Shield className="h-4 w-4 mr-2" /> Show Rules
                    </>
                  ) : action === "add" ? (
                    <>
                      <Plus className="h-4 w-4 mr-2" /> Add Rule
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete Rule
                    </>
                  )}
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
        renderDetails={renderRules}
      />
    </div>
  );
}
