import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  DashboardIcon, 
  ReconnaissanceIcon, 
  ScanningIcon, 
  WebToolsIcon, 
  NetworkToolsIcon, 
  SystemUtilsIcon 
} from "@/lib/icons";
import UserMenu from "./UserMenu";

export default function Sidebar() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-primary-light dark:glass-panel">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-purple-700 to-fuchsia-700">
          <h1 className="text-xl font-semibold text-white flex items-center">
            <svg className="h-6 w-6 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                isActive("/") 
                  ? "text-white bg-primary" 
                  : "text-neutral-light hover:text-white hover:bg-primary/80"
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
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive("/tool/nmap") || isActive("/tool/dnslookup") || isActive("/tool/whois") 
                      ? "text-white bg-primary" 
                      : "text-neutral-light hover:text-white hover:bg-primary/80"
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
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive("/tool/sslscan") || isActive("/tool/nikto") || isActive("/tool/dirb") 
                      ? "text-white bg-primary" 
                      : "text-neutral-light hover:text-white hover:bg-primary/80"
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
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive("/tool/sqlmap") || isActive("/tool/xss") 
                      ? "text-white bg-primary" 
                      : "text-neutral-light hover:text-white hover:bg-primary/80"
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
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive("/tool/packetanalyzer") || isActive("/tool/macchanger") 
                      ? "text-white bg-primary" 
                      : "text-neutral-light hover:text-white hover:bg-primary/80"
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
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive("/tool/hashcracker") || isActive("/tool/firewallmanager") 
                      ? "text-white bg-primary" 
                      : "text-neutral-light hover:text-white hover:bg-primary/80"
                  )}
                >
                  <SystemUtilsIcon className="mr-3 text-lg" />
                  System Utilities
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* User Menu */}
        <UserMenu />
      </div>
    </div>
  );
}
