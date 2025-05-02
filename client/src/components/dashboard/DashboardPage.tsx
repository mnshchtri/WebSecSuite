import { useState } from "react";
import Sidebar from "../layout/Sidebar";
import SidebarMobile from "../layout/SidebarMobile";
import ActivityLog from "./ActivityLog";
import ToolCard from "./ToolCard";
import { tools, ToolCategory } from "@/lib/tools";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tool = {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
};

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTools = filteredTools.reduce<Record<ToolCategory, typeof tools>>((acc, tool) => {
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

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Cover Image Section */}
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
            <div className="max-w-2xl mx-auto text-white text-center">
              <h1 className="text-3xl font-bold mb-3">Welcome to TrimurtiSec</h1>
              <p className="text-lg mb-4">Your comprehensive web security testing suite</p>
              <div className="flex gap-4">
                <button 
                  className="px-6 py-3 bg-gradient-to-r from-black to-gray-900 border border-emerald-500/50 text-emerald-400 font-medium rounded-lg hover:shadow-lg hover:shadow-emerald-900/20 transition-all duration-300 flex items-center gap-2 group"
                  onClick={() => window.location.href = '/login'}
                >
                  <span>Get Started</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M14 5l7 7m0 0l-7 7m7-7H3" 
                    />
                  </svg>
                </button>
                <button 
                  className="px-6 py-2 bg-black/50 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-black/70 hover:border-emerald-500/50 transition-colors flex items-center gap-2 group"
                  onClick={() => window.location.href = '/overview'}
                >
                  <span>Learn More</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <SidebarMobile />
            <div className="ml-4 flex flex-1 items-center gap-4">
              <div className="relative flex flex-1">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="🔍 Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCategorySelect("All")}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm transition-colors",
                    selectedCategory === "All" 
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted hover:text-muted-foreground"
                  )}
                >
                  All
                </button>
                {Object.keys(groupedTools).map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm transition-colors",
                      selectedCategory === category 
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted hover:text-muted-foreground"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Recent Activities</h2>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                View All
              </button>
            </div>
            <ActivityLog />
          </div>
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Tools</h2>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                View All
              </button>
            </div>
            {selectedCategory === "All" ? (
              Object.entries(groupedTools).map(([category, tools]) => (
                <div key={category} className="mt-6">
                  <h3 className="text-lg font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    {category}
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-6">
                <h3 className="text-lg font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  {selectedCategory}
                </h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {groupedTools[selectedCategory].map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            )}

            {groupedTools["Web Application Security"].length > 0 && (
              <>
                <div className="shiva-gradient rounded-lg px-4 py-2 mb-4 flex items-center gap-3">
                  <h4 className="text-md font-semibold text-white">Shiva Mode</h4>
                  <div className="w-px h-5 bg-white bg-opacity-30"></div>
                  <span className="text-sm text-white text-opacity-80">Web Security & Exploitation</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {groupedTools["Web Application Security"].map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </>
            )}

            {groupedTools["Network Security"].length > 0 && (
              <>
                <div className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-teal-500 rounded-lg px-4 py-2 mb-4 flex items-center gap-3 shadow-md">
                  <h4 className="text-md font-semibold text-white">Trinity Balance</h4>
                  <div className="w-px h-5 bg-white bg-opacity-30"></div>
                  <span className="text-sm text-white text-opacity-80">Network Security & Management</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {groupedTools["Network Security"].map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </>
            )}

            {groupedTools["System Tools"].length > 0 && (
              <>
                <div className="god-gradient rounded-lg px-4 py-2 mb-4 flex items-center gap-3">
                  <h4 className="text-md font-semibold text-stone-800">God Mode</h4>
                  <div className="w-px h-5 bg-stone-800 bg-opacity-30"></div>
                  <span className="text-sm text-stone-800 text-opacity-80">Complete System Control</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedTools["System Tools"].map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </>
            )}

            {Object.values(groupedTools).every(tools => tools.length === 0) && (
              <div className="text-center py-10">
                <p className="text-neutral">No tools match your search criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
