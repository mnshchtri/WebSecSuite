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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

export default function Sidebar() {
  const [location] = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const isActive = (path: string) => location === path;

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div
        className={cn(
          "flex flex-col border-r border-primary-light dark:glass-panel transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center h-16 px-2 bg-gradient-to-r from-black to-gray-900 border-b border-emerald-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(16,185,129,0.15)_0%,rgba(0,0,0,0)_70%)]"></div>
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
          {isCollapsed ? (
            <div className="flex items-center justify-center w-full">
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <circle cx="12" cy="11" r="1" />
                <path d="M12 11v3" />
              </svg>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <h1 className="text-xl font-semibold text-white flex items-center">
                <svg
                  className="h-6 w-6 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <circle cx="12" cy="11" r="1" />
                  <path d="M12 11v3" />
                </svg>
                TrimurtiSec
              </h1>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <div className="relative">
          <button
            onClick={toggleSidebar}
            className={`absolute -right-4 top-20 bg-black/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 rounded-full p-2 shadow-lg shadow-emerald-900/20 transition-all duration-300 hover:shadow-emerald-500/20 hover:border-emerald-500/50 z-10 ${
              isCollapsed ? "hover:translate-x-1" : "hover:-translate-x-1"
            }`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
              <span
                className={`absolute transform transition-all duration-300 ease-in-out ${
                  isCollapsed ? "translate-x-5" : "translate-x-0"
                }`}
              >
                <ChevronLeft size={18} className="text-emerald-400" />
              </span>
              <span
                className={`absolute transform transition-all duration-300 ease-in-out ${
                  isCollapsed ? "translate-x-0" : "-translate-x-5"
                }`}
              >
                <ChevronRight size={18} className="text-emerald-400" />
              </span>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <div
          className={cn(
            "flex flex-col flex-grow py-5 overflow-y-auto",
            isCollapsed ? "px-2" : "px-4"
          )}
        >
          <div className="space-y-1">
            {renderNavLink(
              isCollapsed,
              "/",
              DashboardIcon,
              "Dashboard",
              isActive("/")
            )}

            {renderNavSection(
              isCollapsed,
              "Information Gathering",
              "/tool/nmap",
              ReconnaissanceIcon,
              "Reconnaissance",
              isActive("/tool/nmap") ||
                isActive("/tool/dnslookup") ||
                isActive("/tool/whois")
            )}

            {renderNavSection(
              isCollapsed,
              "Vulnerability Analysis",
              "/tool/sslscan",
              ScanningIcon,
              "Scanning",
              isActive("/tool/sslscan") ||
                isActive("/tool/nikto") ||
                isActive("/tool/dirb")
            )}

            {renderNavSection(
              isCollapsed,
              "Web Application Security",
              "/tool/sqlmap",
              WebToolsIcon,
              "Web Tools",
              isActive("/tool/sqlmap") || isActive("/tool/xss")
            )}

            {renderNavSection(
              isCollapsed,
              "Network Security",
              "/tool/packetanalyzer",
              NetworkToolsIcon,
              "Network Tools",
              isActive("/tool/packetanalyzer") || isActive("/tool/macchanger")
            )}

            {renderNavSection(
              isCollapsed,
              "System Tools",
              "/tool/hashcracker",
              SystemUtilsIcon,
              "System Utilities",
              isActive("/tool/hashcracker") || isActive("/tool/firewallmanager")
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔧 Helper to render nav items cleanly
function renderNavLink(
  collapsed: boolean,
  href: string,
  Icon: any,
  label: string,
  active: boolean
) {
  return collapsed ? (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "flex items-center justify-center p-2 text-sm font-medium rounded-md",
              active
                ? "text-white bg-primary"
                : "text-neutral-light hover:text-white hover:bg-primary/80"
            )}
          >
            <Icon className="text-lg" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="ml-2">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md",
        active
          ? "text-white bg-primary"
          : "text-neutral-light hover:text-white hover:bg-primary/80"
      )}
    >
      <Icon className="mr-3 text-lg" />
      {label}
    </Link>
  );
}

function renderNavSection(
  collapsed: boolean,
  heading: string,
  href: string,
  Icon: any,
  label: string,
  active: boolean
) {
  return (
    <div className="mt-6">
      {!collapsed && (
        <h3 className="px-3 text-xs font-semibold text-neutral uppercase tracking-wider">
          {heading}
        </h3>
      )}
      <div className="mt-2 space-y-1">
        {renderNavLink(collapsed, href, Icon, label, active)}
      </div>
    </div>
  );
}
