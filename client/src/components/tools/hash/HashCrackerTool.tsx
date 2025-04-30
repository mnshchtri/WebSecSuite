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
import { Textarea } from "@/components/ui/textarea";
import { Play } from "lucide-react";
import ToolResults from "../ToolResults";
import { useToolExecution } from "@/hooks/use-tool-execution";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

// Define the form schema
const formSchema = z.object({
  hashType: z.string().default("md5"),
  mode: z.enum(["single", "multiple"]).default("single"),
  hashValue: z.string().optional(),
  hashList: z.string().optional(),
  attackType: z.string().default("dictionary"),
  wordlist: z.string().default("rockyou"),
  customWordlist: z.string().optional(),
  maskPattern: z.string().optional(),
}).refine((data) => {
  // If mode is single, hashValue must be provided
  if (data.mode === "single") {
    return !!data.hashValue;
  }
  // If mode is multiple, hashList must be provided
  if (data.mode === "multiple") {
    return !!data.hashList;
  }
  return true;
}, {
  message: "Please provide the required hash input based on the selected mode",
  path: ["hashValue"] // Set the error path to hashValue by default
});

type FormValues = z.infer<typeof formSchema>;

export default function HashCrackerTool() {
  const { toast } = useToast();
  const [results, setResults] = useState<any>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [target, setTarget] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number | undefined>(undefined);
  
  const { execute, isExecuting } = useToolExecution({
    tool: 'hash',
    onSuccess: (data) => {
      setResults(data.results);
      setRawOutput(data.rawOutput);
      setExecutionTime(data.executionTime);
      
      const mode = form.getValues().mode;
      const hashValue = form.getValues().hashValue;
      const hashList = form.getValues().hashList;
      
      if (mode === "single" && hashValue) {
        setTarget(hashValue);
      } else if (mode === "multiple" && hashList) {
        setTarget(`${hashList.split('\n').length} hashes`);
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Hash cracking failed",
        description: error.message || "An unexpected error occurred",
      });
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hashType: "md5",
      mode: "single",
      hashValue: "",
      hashList: "",
      attackType: "dictionary",
      wordlist: "rockyou",
      customWordlist: "",
      maskPattern: "",
    },
  });
  
  const mode = form.watch("mode");
  const attackType = form.watch("attackType");
  const wordlist = form.watch("wordlist");

  const onSubmit = (values: FormValues) => {
    execute(values);
  };

  const renderHashResults = () => {
    if (!results) {
      return <div className="text-center text-neutral p-4">No results available</div>;
    }

    // Handle single hash result
    if (mode === "single" && results.cracked !== undefined) {
      return (
        <div className="space-y-6">
          <div className="bg-primary rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium">Hash Cracking Result</h4>
              <Badge className={results.cracked ? "bg-green-500" : "bg-red-500"}>
                {results.cracked ? "Cracked" : "Not Cracked"}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-primary-light p-3 rounded-lg">
                <p className="text-xs text-neutral">Hash</p>
                <p className="text-sm font-mono break-all">{results.hash}</p>
              </div>
              <div className="bg-primary-light p-3 rounded-lg">
                <p className="text-xs text-neutral">Password</p>
                <p className="text-sm font-mono">{results.password || "Not found"}</p>
              </div>
            </div>
            
            {results.cracked && (
              <div className="mt-4">
                <div className="bg-primary-light p-3 rounded-lg">
                  <p className="text-xs text-neutral">Hash Type</p>
                  <p className="text-sm">{results.algorithm || form.getValues().hashType}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Handle multiple hash results
    if (mode === "multiple" && results.results && Array.isArray(results.results)) {
      const crackedCount = results.results.filter((r: any) => r.cracked).length;
      const totalCount = results.results.length;
      
      return (
        <div className="space-y-6">
          <div className="bg-primary rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium">Hash Cracking Summary</h4>
              <Badge className={crackedCount > 0 ? "bg-green-500" : "bg-red-500"}>
                {crackedCount}/{totalCount} Cracked
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-primary-light p-3 rounded-lg">
                <p className="text-xs text-neutral">Total Hashes</p>
                <p className="text-xl font-semibold">{totalCount}</p>
              </div>
              <div className="bg-primary-light p-3 rounded-lg">
                <p className="text-xs text-neutral">Cracked</p>
                <p className="text-xl font-semibold text-green-500">{crackedCount}</p>
              </div>
              <div className="bg-primary-light p-3 rounded-lg">
                <p className="text-xs text-neutral">Success Rate</p>
                <p className="text-xl font-semibold">
                  {totalCount > 0 ? Math.round((crackedCount / totalCount) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
          
          <Card className="bg-primary rounded-lg shadow-lg overflow-hidden">
            <CardContent className="p-4">
              <h4 className="text-md font-medium mb-3">Cracked Hashes</h4>
              
              {crackedCount === 0 ? (
                <div className="text-neutral text-center p-4">No hashes were successfully cracked</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-xs text-neutral-light uppercase tracking-wider text-left">
                        <th className="py-2 px-3">Hash</th>
                        <th className="py-2 px-3">Password</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary">
                      {results.results.filter((r: any) => r.cracked).map((result: any, index: number) => (
                        <tr key={index} className="hover:bg-primary">
                          <td className="py-3 px-3 font-mono text-xs break-all">{result.hash}</td>
                          <td className="py-3 px-3 font-mono text-xs">{result.password}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
          
          {results.results.some((r: any) => !r.cracked) && (
            <Card className="bg-primary rounded-lg shadow-lg overflow-hidden">
              <CardContent className="p-4">
                <h4 className="text-md font-medium mb-3">Uncracked Hashes</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-xs text-neutral-light uppercase tracking-wider text-left">
                        <th className="py-2 px-3">Hash</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary">
                      {results.results.filter((r: any) => !r.cracked).map((result: any, index: number) => (
                        <tr key={index} className="hover:bg-primary">
                          <td className="py-3 px-3 font-mono text-xs break-all">{result.hash}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }
    
    return (
      <div className="text-center text-neutral p-4 bg-primary rounded-lg">
        {results.message ? (
          <p>{results.message}</p>
        ) : (
          <p>No results available</p>
        )}
      </div>
    );
  };

  return (
    <div>
      <Card className="bg-primary-light rounded-lg shadow-lg p-4 mb-6">
        <CardContent className="p-0">
          <h3 className="text-md font-semibold mb-3">Hash Cracker Configuration</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="hashType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hash Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                          <SelectValue placeholder="Select hash type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="md5">MD5</SelectItem>
                        <SelectItem value="sha1">SHA1</SelectItem>
                        <SelectItem value="sha256">SHA256</SelectItem>
                        <SelectItem value="sha512">SHA512</SelectItem>
                        <SelectItem value="ntlm">NTLM</SelectItem>
                        <SelectItem value="bcrypt">bcrypt</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Mode</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="single" id="mode-single" />
                          <label htmlFor="mode-single" className="text-sm font-medium">
                            Single Hash
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="multiple" id="mode-multiple" />
                          <label htmlFor="mode-multiple" className="text-sm font-medium">
                            Multiple Hashes
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {mode === "single" ? (
                <FormField
                  control={form.control}
                  name="hashValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hash Value</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 5f4dcc3b5aa765d61d8327deb882cf99"
                          className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white font-mono"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="hashList"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hash List (one per line)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 5f4dcc3b5aa765d61d8327deb882cf99&#10;7c6a180b36896a0a8c02787eeafb0e4c"
                          className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white font-mono min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="attackType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attack Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                          <SelectValue placeholder="Select attack type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="dictionary">Dictionary Attack</SelectItem>
                        <SelectItem value="bruteforce">Brute Force</SelectItem>
                        <SelectItem value="mask">Mask Attack</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              {attackType === "dictionary" && (
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
                            <SelectValue placeholder="Select wordlist" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="rockyou">RockYou</SelectItem>
                          <SelectItem value="common">Common Passwords</SelectItem>
                          <SelectItem value="leaked">Leaked Passwords</SelectItem>
                          <SelectItem value="custom">Custom Wordlist</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
              
              {attackType === "dictionary" && wordlist === "custom" && (
                <FormField
                  control={form.control}
                  name="customWordlist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Wordlist (one word per line)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., password&#10;123456&#10;qwerty"
                          className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              
              {attackType === "mask" && (
                <FormField
                  control={form.control}
                  name="maskPattern"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mask Pattern</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., ?d?d?d?d (4 digits)"
                          className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-neutral mt-1">
                        Use ?l for lowercase, ?u for uppercase, ?d for digits, ?s for special chars, ?a for all
                      </p>
                    </FormItem>
                  )}
                />
              )}
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-amber-500 text-white" 
                  disabled={isExecuting}
                >
                  <Play className="h-4 w-4 mr-2" /> Crack Hash
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
        renderDetails={renderHashResults}
      />
    </div>
  );
}
