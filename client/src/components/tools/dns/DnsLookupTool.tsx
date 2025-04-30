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
import { Play } from "lucide-react";
import ToolResults from "../ToolResults";
import { useToolExecution } from "@/hooks/use-tool-execution";

const formSchema = z.object({
  domain: z.string().min(1, { message: "Domain is required" }),
  recordType: z.string().default("A"),
  server: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function DnsLookupTool() {
  const { toast } = useToast();
  const [results, setResults] = useState<any>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [target, setTarget] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number | undefined>(undefined);
  
  const { execute, isExecuting } = useToolExecution({
    tool: 'dns',
    onSuccess: (data) => {
      setResults(data.results);
      setRawOutput(data.rawOutput);
      setExecutionTime(data.executionTime);
      setTarget(form.getValues().domain);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "DNS lookup failed",
        description: error.message || "An unexpected error occurred",
      });
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
      recordType: "A",
      server: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    execute(values);
  };

  const renderRecordsTable = () => {
    if (!results || !results.records || results.records.length === 0) {
      return <div className="text-center text-neutral p-4">No DNS records found</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-xs text-neutral-light uppercase tracking-wider text-left">
              <th className="py-2 px-3">Record Type</th>
              <th className="py-2 px-3">Value</th>
              <th className="py-2 px-3">TTL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary">
            {results.records.map((record: any, index: number) => (
              <tr key={index} className="hover:bg-primary">
                <td className="py-3 px-3">{record.type}</td>
                <td className="py-3 px-3">{record.value}</td>
                <td className="py-3 px-3">{record.ttl || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <Card className="bg-primary-light rounded-lg shadow-lg p-4 mb-6">
        <CardContent className="p-0">
          <h3 className="text-md font-semibold mb-3">DNS Lookup Configuration</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain Name</FormLabel>
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
                  name="recordType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Record Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                            <SelectValue placeholder="Select record type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A">A (IPv4 Address)</SelectItem>
                          <SelectItem value="AAAA">AAAA (IPv6 Address)</SelectItem>
                          <SelectItem value="CNAME">CNAME (Canonical Name)</SelectItem>
                          <SelectItem value="MX">MX (Mail Exchange)</SelectItem>
                          <SelectItem value="NS">NS (Name Server)</SelectItem>
                          <SelectItem value="TXT">TXT (Text)</SelectItem>
                          <SelectItem value="SOA">SOA (Start of Authority)</SelectItem>
                          <SelectItem value="ALL">All Records</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="server"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNS Server (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 8.8.8.8 (Google DNS)"
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
                  <Play className="h-4 w-4 mr-2" /> Lookup
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
        renderDetails={renderRecordsTable}
      />
    </div>
  );
}
