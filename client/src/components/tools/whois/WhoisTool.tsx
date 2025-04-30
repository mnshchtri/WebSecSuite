import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import ToolResults from "../ToolResults";
import { useToolExecution } from "@/hooks/use-tool-execution";

const formSchema = z.object({
  domain: z.string().min(1, { message: "Domain or IP is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function WhoisTool() {
  const { toast } = useToast();
  const [results, setResults] = useState<any>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [target, setTarget] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number | undefined>(undefined);
  
  const { execute, isExecuting } = useToolExecution({
    tool: 'whois',
    onSuccess: (data) => {
      setResults(data.results);
      setRawOutput(data.rawOutput);
      setExecutionTime(data.executionTime);
      setTarget(form.getValues().domain);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Whois lookup failed",
        description: error.message || "An unexpected error occurred",
      });
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    execute(values);
  };

  const renderWhoisInfo = () => {
    if (!results) {
      return <div className="text-center text-neutral p-4">No WHOIS information available</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary rounded-lg shadow-lg overflow-hidden">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium mb-3">Domain Information</h4>
            <div className="space-y-2">
              {results.domainName && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-xs text-neutral">Domain Name:</span>
                  <span className="text-xs col-span-2">{results.domainName}</span>
                </div>
              )}
              {results.registrar && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-xs text-neutral">Registrar:</span>
                  <span className="text-xs col-span-2">{results.registrar}</span>
                </div>
              )}
              {results.creationDate && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-xs text-neutral">Created:</span>
                  <span className="text-xs col-span-2">{results.creationDate}</span>
                </div>
              )}
              {results.expiryDate && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-xs text-neutral">Expires:</span>
                  <span className="text-xs col-span-2">{results.expiryDate}</span>
                </div>
              )}
              {results.updatedDate && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-xs text-neutral">Updated:</span>
                  <span className="text-xs col-span-2">{results.updatedDate}</span>
                </div>
              )}
              {results.status && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-xs text-neutral">Status:</span>
                  <span className="text-xs col-span-2">{Array.isArray(results.status) ? results.status.join(", ") : results.status}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary rounded-lg shadow-lg overflow-hidden">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium mb-3">Contact Information</h4>
            <div className="space-y-2">
              {results.registrantName && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-xs text-neutral">Registrant:</span>
                  <span className="text-xs col-span-2">{results.registrantName}</span>
                </div>
              )}
              {results.registrantOrganization && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-xs text-neutral">Organization:</span>
                  <span className="text-xs col-span-2">{results.registrantOrganization}</span>
                </div>
              )}
              {results.nameServers && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-xs text-neutral">Name Servers:</span>
                  <span className="text-xs col-span-2">{Array.isArray(results.nameServers) ? results.nameServers.join(", ") : results.nameServers}</span>
                </div>
              )}
              {results.dnssec && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-xs text-neutral">DNSSEC:</span>
                  <span className="text-xs col-span-2">{results.dnssec}</span>
                </div>
              )}
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
          <h3 className="text-md font-semibold mb-3">WHOIS Lookup Configuration</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain Name or IP Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., example.com or 8.8.8.8"
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
        renderDetails={renderWhoisInfo}
      />
    </div>
  );
}
