import React from 'react';
import { tools, ToolCategory } from "@/lib/tools";
import Sidebar from "../layout/Sidebar";
import SidebarMobile from "../layout/SidebarMobile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChevronRightIcon, InfoIcon, ShieldIcon, AlertTriangleIcon, ActivityIcon, WrenchIcon } from "lucide-react";

interface ToolDoc {
  id: string;
  name: string;
  description: string;
  usage: string;
  examples: string[];
  category: ToolCategory;
}

export default function OverviewPage() {
  // Group tools by category
  const categorizedTools = tools.reduce<Record<ToolCategory, typeof tools>>((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {
    "Information Gathering": [],
    "Vulnerability Analysis": [],
    "Web Application Security": [],
    "Network Security": [],
    "System Tools": []
  });

  // Helper function to get appropriate icon for each category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Information Gathering":
        return <InfoIcon className="h-5 w-5 text-primary" />;
      case "Vulnerability Analysis":
        return <AlertTriangleIcon className="h-5 w-5 text-accent" />;
      case "Web Application Security":
        return <ShieldIcon className="h-5 w-5 text-blue-500" />;
      case "Network Security":
        return <ActivityIcon className="h-5 w-5 text-teal-500" />;
      case "System Tools":
        return <WrenchIcon className="h-5 w-5 text-emerald-500" />;
      default:
        return <InfoIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Cover Image */}
        <div className="relative h-40">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
            backgroundImage: 'url("/coverimage.png")',
            backgroundPosition: '50% 50%',
            backgroundSize: 'cover'
          }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 to-black/90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(16,185,129,0.1)_0%,rgba(0,0,0,0)_70%)]">
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0)_40%)]">
              <div className="h-full w-full bg-[url('/noise.png')] opacity-5"></div>
            </div>
          </div>
          <div className="relative h-full flex items-center px-6">
            <div className="max-w-4xl mx-auto text-white">
              <h1 className="text-4xl font-bold mb-2">TrimurtiSec Documentation</h1>
              <p className="text-xl mb-4">Comprehensive overview of our security testing tools</p>
              <div className="flex items-center text-sm">
                <a href="/" className="text-emerald-400/80 hover:text-emerald-400 transition-colors">
                  Dashboard
                </a>
                <ChevronRightIcon className="h-4 w-4 mx-2 text-primary-foreground/60" />
                <span>Overview</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <SidebarMobile />
            <div className="ml-4">
              <h2 className="text-2xl font-semibold">Tool Documentation</h2>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="Information Gathering" className="w-full">
            <TabsList className="mb-6 flex w-full justify-start overflow-x-auto pb-2">
              {Object.keys(categorizedTools).map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="flex items-center gap-2 py-2 px-4"
                >
                  {getCategoryIcon(category)}
                  <span>{category}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(categorizedTools).map(([category, categoryTools]) => (
              <TabsContent key={category} value={category} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {categoryTools.map((tool) => (
                    <Card key={tool.id} className="overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="bg-muted/20 pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getCategoryIcon(category)}
                          {tool.name}
                        </CardTitle>
                        <CardDescription className="text-sm">{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Usage:</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {tool.usage || "Execute this tool through the TrimurtiSec dashboard."}
                          </p>

                          <h4 className="font-medium text-sm pt-2">Features:</h4>
                          <ul className="list-disc text-sm pl-5 text-muted-foreground space-y-1">
                            {(tool.features || ["Detailed analysis", "Comprehensive reporting", "User-friendly interface"]).map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">About {category}</h3>
                  <p className="text-muted-foreground mb-4">
                    {category === "Information Gathering" && 
                      "Information gathering tools help collect critical data about target systems, networks, and applications. These reconnaissance tools identify entry points and potential vulnerabilities."}
                    {category === "Vulnerability Analysis" && 
                      "Vulnerability analysis tools scan for weaknesses in systems, networks, and applications, allowing you to identify and prioritize security issues before they can be exploited."}
                    {category === "Web Application Security" && 
                      "Web application security tools focus on identifying and mitigating vulnerabilities specific to web applications, including OWASP Top 10 risks like injections, XSS, and broken authentication."}
                    {category === "Network Security" && 
                      "Network security tools help secure your network infrastructure by identifying misconfigurations, open ports, unpatched systems, and other network-level vulnerabilities."}
                    {category === "System Tools" && 
                      "System tools provide essential functionality for managing and securing operating systems, including configuration analysis, integrity monitoring, and system hardening."}
                  </p>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-primary/5 border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-lg">Best Practices</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                          {category === "Information Gathering" && [
                            "Always obtain proper authorization before scanning or collecting information",
                            "Maintain detailed records of all reconnaissance activities",
                            "Use passive techniques first before moving to active scanning",
                            "Distribute scanning from multiple sources to avoid detection"
                          ].map((item, i) => <li key={i}>{item}</li>)}
                          {category === "Vulnerability Analysis" && [
                            "Regularly schedule vulnerability scans of critical systems",
                            "Validate findings manually to eliminate false positives",
                            "Categorize vulnerabilities by risk level and impact",
                            "Maintain a vulnerability management program with clear remediation timelines"
                          ].map((item, i) => <li key={i}>{item}</li>)}
                          {category === "Web Application Security" && [
                            "Implement secure coding practices from the start of development",
                            "Use Content Security Policy (CSP) to prevent XSS attacks",
                            "Apply the principle of least privilege for all application functions",
                            "Perform regular security testing, including SAST and DAST"
                          ].map((item, i) => <li key={i}>{item}</li>)}
                          {category === "Network Security" && [
                            "Implement defense-in-depth strategies with multiple security layers",
                            "Segment networks to limit the impact of breaches",
                            "Use encrypted protocols for sensitive data transmission",
                            "Monitor network traffic for suspicious activities"
                          ].map((item, i) => <li key={i}>{item}</li>)}
                          {category === "System Tools" && [
                            "Keep systems updated with the latest security patches",
                            "Implement the principle of least privilege for system access",
                            "Use secure configurations based on industry standards",
                            "Regularly audit system configurations and user activities"
                          ].map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-accent/5 border-accent/20">
                      <CardHeader>
                        <CardTitle className="text-lg">Related Resources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {["Documentation", "Video Tutorials", "Community Forums", "Tool Updates"].map((resource, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <ChevronRightIcon className="h-4 w-4 text-accent" />
                              <span>{resource}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
