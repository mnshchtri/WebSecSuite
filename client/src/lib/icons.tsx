import * as React from "react";
import { 
  LayoutDashboard, 
  Eye, 
  Scan, 
  Globe, 
  Router, 
  Terminal, 
  Radar, 
  Lock, 
  Bug, 
  FolderSearch, 
  Database, 
  Code, 
  Key, 
  Wifi, 
  Fingerprint, 
  ShieldAlert 
} from "lucide-react";

// Dashboard Icon
export const DashboardIcon = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return <LayoutDashboard ref={ref} {...props} />;
});
DashboardIcon.displayName = "DashboardIcon";

// Reconnaissance Icons
export const ReconnaissanceIcon = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return <Eye ref={ref} {...props} />;
});
ReconnaissanceIcon.displayName = "ReconnaissanceIcon";

// Scanning Icons
export const ScanningIcon = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return <Scan ref={ref} {...props} />;
});
ScanningIcon.displayName = "ScanningIcon";

// Web Tools Icons
export const WebToolsIcon = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return <Globe ref={ref} {...props} />;
});
WebToolsIcon.displayName = "WebToolsIcon";

// Network Tools Icons
export const NetworkToolsIcon = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return <Router ref={ref} {...props} />;
});
NetworkToolsIcon.displayName = "NetworkToolsIcon";

// System Utils Icons
export const SystemUtilsIcon = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return <Terminal ref={ref} {...props} />;
});
SystemUtilsIcon.displayName = "SystemUtilsIcon";

// Individual Tool Icons
export const NmapIcon = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return <Radar ref={ref} {...props} />;
});
NmapIcon.displayName = "NmapIcon";

export const DnsIcon = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return <Globe ref={ref} {...props} />;
});
DnsIcon.displayName = "DnsIcon";

export const WhoisIcon = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return (
    <svg
      ref={ref}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
});
WhoisIcon.displayName = "WhoisIcon";

export const SslScanIcon = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return <Lock ref={ref} {...props} />;
});
SslScanIcon.displayName = "SslScanIcon";

export const NiktoIcon = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return <Bug ref={ref} {...props} />;
});
NiktoIcon.displayName = "NiktoIcon";

export const DirbIcon = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return <FolderSearch ref={ref} {...props} />;
});
DirbIcon.displayName = "DirbIcon";

export const SqlmapIcon = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return <Database ref={ref} {...props} />;
});
SqlmapIcon.displayName = "SqlmapIcon";

export const XssIcon = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return <Code ref={ref} {...props} />;
});
XssIcon.displayName = "XssIcon";

export const HashCrackerIcon = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return <Key ref={ref} {...props} />;
});
HashCrackerIcon.displayName = "HashCrackerIcon";

export const PacketAnalyzerIcon = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return <Wifi ref={ref} {...props} />;
});
PacketAnalyzerIcon.displayName = "PacketAnalyzerIcon";

export const MacChangerIcon = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return <Fingerprint ref={ref} {...props} />;
});
MacChangerIcon.displayName = "MacChangerIcon";

export const FirewallIcon = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return <ShieldAlert ref={ref} {...props} />;
});
FirewallIcon.displayName = "FirewallIcon";
