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
import { Wand2, RotateCcw } from "lucide-react";
import ToolResults from "../ToolResults";
import { useToolExecution } from "@/hooks/use-tool-execution";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

// Define the form schema
const formSchema = z.object({
  interface: z.string().min(1, { message: "Interface is required" }),
  macChangeType: z.enum(["specific", "random", "vendor", "reset"]).default("random"),
  macAddress: z.string().optional(),
  vendor: z.string().optional(),
  permanent: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function MacChangerTool() {
  const { toast } = useToast();
  const [results, setResults] = useState<any>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [target, setTarget] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number | undefined>(undefined);
  
  const { execute, isExecuting } = useToolExecution({
    tool: 'mac',
    onSuccess: (data) => {
      setResults(data.results);
      setRawOutput(data.rawOutput);
      setExecutionTime(data.executionTime);
      setTarget(form.getValues().interface);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "MAC change failed",
        description: error.message || "An unexpected error occurred",
      });
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interface: "eth0",
      macChangeType: "random",
      macAddress: "",
      vendor: "",
      permanent: false,
    },
  });
  
  const macChangeType = form.watch("macChangeType");

  const onSubmit = (values: FormValues) => {
    execute(values);
  };

  const generateRandomMac = () => {
    // Generate a random MAC address
    const hexDigits = "0123456789ABCDEF";
    let macAddress = "";
    
    for (let i = 0; i < 6; i++) {
      let byte = "";
      for (let j = 0; j < 2; j++) {
        byte += hexDigits.charAt(Math.floor(Math.random() * 16));
      }
      macAddress += byte;
      if (i < 5) macAddress += ":";
    }
    
    // Make sure it's a unicast address (clear bit 0 of first byte)
    const firstByte = parseInt(macAddress.substring(0, 2), 16) & 0xFE;
    const firstByteHex = firstByte.toString(16).padStart(2, '0').toUpperCase();
    macAddress = firstByteHex + macAddress.substring(2);
    
    // Make sure it's locally administered (set bit 1 of first byte)
    const adminByte = parseInt(macAddress.substring(0, 2), 16) | 0x02;
    const adminByteHex = adminByte.toString(16).padStart(2, '0').toUpperCase();
    macAddress = adminByteHex + macAddress.substring(2);
    
    form.setValue("macAddress", macAddress);
  };

  const renderMacResults = () => {
    if (!results) {
      return <div className="text-center text-neutral p-4">No results available</div>;
    }

    return (
      <div className="space-y-6">
        <div className="bg-primary rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium">MAC Address Change Results</h4>
            <Badge className={results.success ? "bg-green-500" : "bg-red-500"}>
              {results.success ? "Success" : "Failed"}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">Interface</p>
              <p className="text-sm font-medium">{results.interface}</p>
            </div>
            
            {results.oldMac && (
              <div className="bg-primary-light p-3 rounded-lg">
                <p className="text-xs text-neutral">Previous MAC</p>
                <p className="text-sm font-mono">{results.oldMac}</p>
              </div>
            )}
            
            {results.newMac && (
              <div className="bg-primary-light p-3 rounded-lg">
                <p className="text-xs text-neutral">New MAC</p>
                <p className="text-sm font-mono">{results.newMac}</p>
              </div>
            )}
            
            {results.vendor && (
              <div className="bg-primary-light p-3 rounded-lg">
                <p className="text-xs text-neutral">Vendor</p>
                <p className="text-sm">{results.vendor}</p>
              </div>
            )}
          </div>
          
          {results.message && (
            <div className="mt-4 p-3 bg-primary-light rounded-lg">
              <p className="text-sm">{results.message}</p>
            </div>
          )}
        </div>

        {results.additionalInfo && (
          <Card className="bg-primary rounded-lg shadow-lg overflow-hidden">
            <CardContent className="p-4">
              <h4 className="text-md font-medium mb-3">Additional Information</h4>
              <div className="space-y-2">
                {Object.entries(results.additionalInfo).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-2">
                    <span className="text-xs text-neutral">{key}:</span>
                    <span className="text-xs col-span-2">{value as string}</span>
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
          <h3 className="text-md font-semibold mb-3">MAC Address Changer</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="interface"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Network Interface</FormLabel>
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
                        <SelectItem value="eth0">eth0</SelectItem>
                        <SelectItem value="wlan0">wlan0</SelectItem>
                        <SelectItem value="ens0">ens0</SelectItem>
                        <SelectItem value="enp0s3">enp0s3</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="macChangeType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>MAC Address Change Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="random" id="mac-random" />
                          <label htmlFor="mac-random" className="text-sm font-medium">
                            Random MAC
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="specific" id="mac-specific" />
                          <label htmlFor="mac-specific" className="text-sm font-medium">
                            Specific MAC
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="vendor" id="mac-vendor" />
                          <label htmlFor="mac-vendor" className="text-sm font-medium">
                            Vendor Specific
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="reset" id="mac-reset" />
                          <label htmlFor="mac-reset" className="text-sm font-medium">
                            Reset to Original
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {macChangeType === "specific" && (
                <FormField
                  control={form.control}
                  name="macAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New MAC Address</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input
                            placeholder="e.g., 00:11:22:33:44:55"
                            className="flex-1 bg-primary border border-primary-light rounded-lg px-3 py-2 text-white font-mono"
                            {...field}
                          />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="text-neutral-light border-neutral hover:text-white"
                          onClick={generateRandomMac}
                        >
                          <Wand2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
              )}
              
              {macChangeType === "vendor" && (
                <FormField
                  control={form.control}
                  name="vendor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                            <SelectValue placeholder="Select vendor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="cisco">Cisco</SelectItem>
                          <SelectItem value="dell">Dell</SelectItem>
                          <SelectItem value="intel">Intel</SelectItem>
                          <SelectItem value="microsoft">Microsoft</SelectItem>
                          <SelectItem value="samsung">Samsung</SelectItem>
                          <SelectItem value="sony">Sony</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="permanent"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <label
                      htmlFor="permanent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Permanent Change (Persists After Reboot)
                    </label>
                  </div>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-red-500 text-white" 
                  disabled={isExecuting}
                >
                  {macChangeType === "reset" ? (
                    <>
                      <RotateCcw className="h-4 w-4 mr-2" /> Reset MAC
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" /> Change MAC
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
        renderDetails={renderMacResults}
      />
    </div>
  );
}
