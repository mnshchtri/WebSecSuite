import { useRoute } from "wouter";
import Sidebar from "../layout/Sidebar";
import SidebarMobile from "../layout/SidebarMobile";
import ToolInterface from "./ToolInterface";
import { tools } from "@/lib/tools";
import NotFound from "@/pages/not-found";

// Import all tool components
import NmapTool from "./nmap/NmapTool";
import DnsLookupTool from "./dns/DnsLookupTool";
import WhoisTool from "./whois/WhoisTool";
import SslScannerTool from "./ssl/SslScannerTool";
import NiktoTool from "./nikto/NiktoTool";
import DirbTool from "./dirb/DirbTool";
import SqlmapTool from "./sqlmap/SqlmapTool";
import XssScannerTool from "./xss/XssScannerTool";
import HashCrackerTool from "./hash/HashCrackerTool";
import PacketAnalyzerTool from "./packet/PacketAnalyzerTool";
import MacChangerTool from "./mac/MacChangerTool";
import FirewallTool from "./firewall/FirewallTool";

export default function ToolPage() {
  const [match, params] = useRoute("/tool/:id");
  
  if (!match) return <NotFound />;
  
  const toolId = params?.id;
  const tool = tools.find(t => t.id === toolId);
  
  if (!tool) return <NotFound />;

  // Map tool ID to the correct component
  const renderToolComponent = () => {
    switch (toolId) {
      case 'nmap':
        return <NmapTool />;
      case 'dnslookup':
        return <DnsLookupTool />;
      case 'whois':
        return <WhoisTool />;
      case 'sslscan':
        return <SslScannerTool />;
      case 'nikto':
        return <NiktoTool />;
      case 'dirb':
        return <DirbTool />;
      case 'sqlmap':
        return <SqlmapTool />;
      case 'xssscanner':
        return <XssScannerTool />;
      case 'hashcracker':
        return <HashCrackerTool />;
      case 'packetanalyzer':
        return <PacketAnalyzerTool />;
      case 'macchanger':
        return <MacChangerTool />;
      case 'firewallmanager':
        return <FirewallTool />;
      default:
        return <div>Tool component not found</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-primary text-white">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <SidebarMobile />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <ToolInterface tool={tool}>
            {renderToolComponent()}
          </ToolInterface>
        </div>
      </div>
    </div>
  );
}
