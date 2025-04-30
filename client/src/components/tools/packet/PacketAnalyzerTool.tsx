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
import { Play, StopCircle } from "lucide-react";
import ToolResults from "../ToolResults";
import { useToolExecution } from "@/hooks/use-tool-execution";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

// Define the form schema
const formSchema = z.object({
  interface: z.string().min(1, { message: "Network interface is required" }),
  filter: z.string().optional(),
  duration: z.string().default("30"),
  packetCount: z.string().default("1000"),
  promiscuous: z.boolean().default(false),
  captureType: z.string().default("all"),
  saveCapture: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function PacketAnalyzerTool() {
  const { toast } = useToast();
  const [results, setResults] = useState<any>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [target, setTarget] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number | undefined>(undefined);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  
  const { execute, isExecuting } = useToolExecution({
    tool: 'packet',
    onSuccess: (data) => {
      setResults(data.results);
      setRawOutput(data.rawOutput);
      setExecutionTime(data.executionTime);
      setTarget(form.getValues().interface);
      setIsCapturing(false);
      setCaptureProgress(100);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Packet analysis failed",
        description: error.message || "An unexpected error occurred",
      });
      setIsCapturing(false);
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interface: "eth0",
      filter: "",
      duration: "30",
      packetCount: "1000",
      promiscuous: false,
      captureType: "all",
      saveCapture: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsCapturing(true);
    setCaptureProgress(0);
    
    // Simulate capture progress
    const duration = parseInt(values.duration, 10) || 30;
    const interval = setInterval(() => {
      setCaptureProgress((prev) => {
        const newProgress = prev + (100 / (duration * 2));
        if (newProgress >= 95) {
          clearInterval(interval);
          return 95;
        }
        return newProgress;
      });
    }, 500);
    
    execute(values);
  };
  
  const stopCapture = () => {
    // In a real implementation, we would need to send a signal to the backend
    // to stop the packet capture. For now, we'll just simulate it.
    toast({
      title: "Capture stopped",
      description: "The packet capture has been stopped",
    });
    setIsCapturing(false);
    setCaptureProgress(100);
  };

  const PROTOCOL_COLORS = [
    "#3B82F6", // blue-500
    "#10B981", // green-500
    "#F59E0B", // amber-500
    "#EF4444", // red-500
    "#8B5CF6", // violet-500
    "#EC4899", // pink-500
    "#6366F1", // indigo-500
  ];

  const renderProtocolChart = () => {
    if (!results || !results.protocolDistribution) {
      return <div className="h-64 flex items-center justify-center text-neutral">No protocol data available</div>;
    }
    
    const data = Object.entries(results.protocolDistribution).map(([name, value]) => ({
      name,
      value: typeof value === 'number' ? value : 0,
    }));
    
    return (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PROTOCOL_COLORS[index % PROTOCOL_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };
  
  const renderTrafficChart = () => {
    if (!results || !results.trafficOverTime || !Array.isArray(results.trafficOverTime)) {
      return <div className="h-64 flex items-center justify-center text-neutral">No traffic data available</div>;
    }
    
    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={results.trafficOverTime}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="packets" fill="#3B82F6" name="Packets" />
          <Bar dataKey="bytes" fill="#10B981" name="Bytes (KB)" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderPacketDetails = () => {
    if (!results) {
      return <div className="text-center text-neutral p-4">No packet data available</div>;
    }
    
    return (
      <div className="space-y-6">
        <div className="bg-primary rounded-lg p-4">
          <h4 className="text-md font-medium mb-3">Capture Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">Total Packets</p>
              <p className="text-xl font-semibold">{results.totalPackets || 0}</p>
            </div>
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">Total Bytes</p>
              <p className="text-xl font-semibold">{results.totalBytes ? `${(results.totalBytes / 1024).toFixed(2)} KB` : "0 KB"}</p>
            </div>
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">Duration</p>
              <p className="text-xl font-semibold">{results.captureDuration ? `${results.captureDuration.toFixed(2)}s` : "0s"}</p>
            </div>
            <div className="bg-primary-light p-3 rounded-lg">
              <p className="text-xs text-neutral">Avg Packet Size</p>
              <p className="text-xl font-semibold">
                {results.totalPackets && results.totalBytes 
                  ? `${(results.totalBytes / results.totalPackets).toFixed(2)} bytes` 
                  : "0 bytes"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-primary rounded-lg shadow-lg overflow-hidden">
            <CardContent className="p-4">
              <h4 className="text-md font-medium mb-3">Protocol Distribution</h4>
              {renderProtocolChart()}
            </CardContent>
          </Card>
          
          <Card className="bg-primary rounded-lg shadow-lg overflow-hidden">
            <CardContent className="p-4">
              <h4 className="text-md font-medium mb-3">Traffic Over Time</h4>
              {renderTrafficChart()}
            </CardContent>
          </Card>
        </div>

        {results.packets && results.packets.length > 0 && (
          <Card className="bg-primary rounded-lg shadow-lg overflow-hidden">
            <CardContent className="p-4">
              <h4 className="text-md font-medium mb-3">Captured Packets</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-xs text-neutral-light uppercase tracking-wider text-left">
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Time</th>
                      <th className="py-2 px-3">Source</th>
                      <th className="py-2 px-3">Destination</th>
                      <th className="py-2 px-3">Protocol</th>
                      <th className="py-2 px-3">Length</th>
                      <th className="py-2 px-3">Info</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary">
                    {results.packets.map((packet: any, index: number) => (
                      <tr key={index} className="hover:bg-primary">
                        <td className="py-2 px-3 text-xs">{index + 1}</td>
                        <td className="py-2 px-3 text-xs">{packet.timestamp}</td>
                        <td className="py-2 px-3 text-xs">{packet.src}</td>
                        <td className="py-2 px-3 text-xs">{packet.dst}</td>
                        <td className="py-2 px-3 text-xs">
                          <Badge
                            className="text-xs"
                            style={{ backgroundColor: PROTOCOL_COLORS[packet.protocol.charCodeAt(0) % PROTOCOL_COLORS.length] }}
                          >
                            {packet.protocol}
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-xs">{packet.length}</td>
                        <td className="py-2 px-3 text-xs truncate max-w-[200px]" title={packet.info}>
                          {packet.info}
                        </td>
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
  };

  return (
    <div>
      <Card className="bg-primary-light rounded-lg shadow-lg p-4 mb-6">
        <CardContent className="p-0">
          <h3 className="text-md font-semibold mb-3">Packet Analyzer Configuration</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                            <SelectValue placeholder="Select network interface" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="eth0">eth0</SelectItem>
                          <SelectItem value="wlan0">wlan0</SelectItem>
                          <SelectItem value="lo">lo (Loopback)</SelectItem>
                          <SelectItem value="any">any (All Interfaces)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="captureType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capture Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white">
                            <SelectValue placeholder="Select capture type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Traffic</SelectItem>
                          <SelectItem value="tcp">TCP Only</SelectItem>
                          <SelectItem value="udp">UDP Only</SelectItem>
                          <SelectItem value="icmp">ICMP Only</SelectItem>
                          <SelectItem value="http">HTTP/HTTPS</SelectItem>
                          <SelectItem value="dns">DNS</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="filter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Filter (BPF Syntax)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., port 80 or host 192.168.1.1"
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
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capture Duration (seconds)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          className="w-full bg-primary border border-primary-light rounded-lg px-3 py-2 text-white"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="packetCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Packet Count Limit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
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
                  name="promiscuous"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <label
                        htmlFor="promiscuous"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Promiscuous Mode
                      </label>
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="saveCapture"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <label
                        htmlFor="saveCapture"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Save Capture to File
                      </label>
                    </div>
                  )}
                />
              </div>
              
              {isCapturing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Capturing packets...</span>
                    <span>{captureProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={captureProgress} className="h-2" />
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                {isCapturing ? (
                  <Button 
                    type="button" 
                    variant="destructive"
                    onClick={stopCapture}
                  >
                    <StopCircle className="h-4 w-4 mr-2" /> Stop Capture
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    className="bg-red-500 text-white" 
                    disabled={isExecuting}
                  >
                    <Play className="h-4 w-4 mr-2" /> Start Capture
                  </Button>
                )}
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
        renderDetails={renderPacketDetails}
      />
    </div>
  );
}
