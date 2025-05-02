import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  DashboardIcon, 
  ReconnaissanceIcon, 
  ScanningIcon, 
  WebToolsIcon, 
  NetworkToolsIcon, 
  SystemUtilsIcon 
} from "@/lib/icons";
import { cn } from "@/lib/utils";


export default function SidebarMobile() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const closeSidebar = () => setOpen(false);

  return (
    <div className="flex items-center justify-between h-16 px-4 border-b border-primary-light bg-primary md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="text-neutral hover:text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-primary border-r border-primary-light">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 px-4 bg-primary-light">
              <h1 className="text-xl font-semibold text-white flex items-center">
                <svg className="h-6 w-6 mr-2 text-accent-green" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <circle cx="12" cy="11" r="1" />
                  <path d="M12 11v3" />
                </svg>
                TrimurtiSec
              </h1>
            </div>

            {/* Navigation */}
            <div className="flex flex-col flex-grow px-4 py-5 overflow-y-auto">
              <div className="space-y-1">
                <Link 
                  href="/"
                  onClick={closeSidebar}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive("/") 
                      ? "text-white bg-primary-light" 
                      : "text-neutral-light hover:text-white hover:bg-primary-light"
                  )}
                >
                  <DashboardIcon className="mr-3 text-lg" />
                  Dashboard
                </Link>

                {/* Tool Categories */}
                <div className="mt-6">
                  <h3 className="px-3 text-xs font-semibold text-neutral uppercase tracking-wider">
                    Information Gathering
                  </h3>
                  <div className="mt-2 space-y-1">
                    <Link 
                      href="/tool/nmap"
                      onClick={closeSidebar}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                        isActive("/tool/nmap") || isActive("/tool/dnslookup") || isActive("/tool/whois") 
                          ? "text-white bg-primary-light" 
                          : "text-neutral-light hover:text-white hover:bg-primary-light"
                      )}
                    >
                      <ReconnaissanceIcon className="mr-3 text-lg" />
                      Reconnaissance
                    </Link>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="px-3 text-xs font-semibold text-neutral uppercase tracking-wider">
                    Vulnerability Analysis
                  </h3>
                  <div className="mt-2 space-y-1">
                    <Link 
                      href="/tool/sslscan"
                      onClick={closeSidebar}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                        isActive("/tool/sslscan") || isActive("/tool/nikto") || isActive("/tool/dirb") 
                          ? "text-white bg-primary-light" 
                          : "text-neutral-light hover:text-white hover:bg-primary-light"
                      )}
                    >
                      <ScanningIcon className="mr-3 text-lg" />
                      Scanning
                    </Link>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="px-3 text-xs font-semibold text-neutral uppercase tracking-wider">
                    Web Application Security
                  </h3>
                  <div className="mt-2 space-y-1">
                    <Link 
                      href="/tool/sqlmap"
                      onClick={closeSidebar}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                        isActive("/tool/sqlmap") || isActive("/tool/xss") 
                          ? "text-white bg-primary-light" 
                          : "text-neutral-light hover:text-white hover:bg-primary-light"
                      )}
                    >
                      <WebToolsIcon className="mr-3 text-lg" />
                      Web Tools
                    </Link>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="px-3 text-xs font-semibold text-neutral uppercase tracking-wider">
                    Network Security
                  </h3>
                  <div className="mt-2 space-y-1">
                    <Link 
                      href="/tool/packetanalyzer"
                      onClick={closeSidebar}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                        isActive("/tool/packetanalyzer") || isActive("/tool/macchanger") 
                          ? "text-white bg-primary-light" 
                          : "text-neutral-light hover:text-white hover:bg-primary-light"
                      )}
                    >
                      <NetworkToolsIcon className="mr-3 text-lg" />
                      Network Tools
                    </Link>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="px-3 text-xs font-semibold text-neutral uppercase tracking-wider">
                    System Tools
                  </h3>
                  <div className="mt-2 space-y-1">
                    <Link 
                      href="/tool/hashcracker"
                      onClick={closeSidebar}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                        isActive("/tool/hashcracker") || isActive("/tool/firewallmanager") 
                          ? "text-white bg-primary-light" 
                          : "text-neutral-light hover:text-white hover:bg-primary-light"
                      )}
                    >
                      <SystemUtilsIcon className="mr-3 text-lg" />
                      System Utilities
                    </Link>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </SheetContent>
      </Sheet>
      
      <Link 
        href="/"
        className="text-xl font-semibold text-white flex items-center"
      >
        <svg className="h-6 w-6 mr-2 text-accent-green" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <circle cx="12" cy="11" r="1" />
          <path d="M12 11v3" />
        </svg>
        TrimurtiSec
      </Link>
      
      <button className="text-neutral hover:text-white">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>
    </div>
  );
}
