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
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-lg p-6 mb-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">TrimurtiSec Dashboard</h2>
                    <p className="text-white text-opacity-90">
                      Hindu trinity concept for cybersecurity: Brahma (Reconnaissance), 
                      Vishnu (Preservation), Shiva (Destruction)
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex space-x-3">
                    <div className="brahma-gradient p-2 rounded-full h-10 w-10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="vishnu-gradient p-2 rounded-full h-10 w-10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="shiva-gradient p-2 rounded-full h-10 w-10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-neutral-light px-1">Access all security tools from one unified interface. Select a category to begin.</p>
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
