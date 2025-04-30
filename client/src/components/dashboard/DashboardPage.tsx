import { useState } from "react";
import Sidebar from "../layout/Sidebar";
import SidebarMobile from "../layout/SidebarMobile";
import StatsCards from "./StatsCards";
import ActivityLog from "./ActivityLog";
import ToolCard from "./ToolCard";
import { tools, ToolCategory } from "@/lib/tools";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="flex h-screen overflow-hidden bg-primary text-white">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <SidebarMobile />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
              <p className="text-neutral-light">Welcome to TrimurtiSec Web Platform. Access all security tools from one interface.</p>
            </div>
            
            <StatsCards />
            
            <ActivityLog />
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Security Tools</h3>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search tools..."
                    className="bg-primary-light text-neutral-light pl-10 focus:border-accent-blue"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-neutral" />
                </div>
              </div>
              
              {/* Information Gathering Tools - Brahma Mode */}
              {groupedTools["Information Gathering"].length > 0 && (
                <>
                  <div className="brahma-gradient rounded-lg px-4 py-2 mb-4 flex items-center gap-3">
                    <h4 className="text-md font-semibold text-white">Brahma Mode</h4>
                    <div className="w-px h-5 bg-white bg-opacity-30"></div>
                    <span className="text-sm text-white text-opacity-80">Information Gathering & Reconnaissance</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {groupedTools["Information Gathering"].map(tool => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </>
              )}
              
              {/* Vulnerability Analysis Tools - Vishnu Mode */}
              {groupedTools["Vulnerability Analysis"].length > 0 && (
                <>
                  <div className="vishnu-gradient rounded-lg px-4 py-2 mb-4 flex items-center gap-3">
                    <h4 className="text-md font-semibold text-white">Vishnu Mode</h4>
                    <div className="w-px h-5 bg-white bg-opacity-30"></div>
                    <span className="text-sm text-white text-opacity-80">Vulnerability Analysis & Preservation</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {groupedTools["Vulnerability Analysis"].map(tool => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </>
              )}
              
              {/* Web Application Security Tools - Shiva Mode */}
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
              
              {/* Network Security Tools - Trinity Balance */}
              {groupedTools["Network Security"].length > 0 && (
                <>
                  <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-lg px-4 py-2 mb-4 flex items-center gap-3">
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
              
              {/* System Tools - God Mode */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
