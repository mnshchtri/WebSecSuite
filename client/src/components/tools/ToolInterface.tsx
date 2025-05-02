import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { HelpCircle, ArrowLeft } from "lucide-react";
import { Tool } from "@/lib/tools";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ToolInterfaceProps {
  tool: Tool;
  children: React.ReactNode;
}

export default function ToolInterface({ tool, children }: ToolInterfaceProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-3 text-emerald-400/70 hover:text-emerald-400 hover:bg-black/40">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h2 className="text-2xl font-semibold">{tool.name}</h2>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="text-emerald-400/70 border-emerald-500/30 hover:bg-black/40 hover:text-emerald-400 hover:border-emerald-500/50">
                <HelpCircle className="h-4 w-4 mr-1" />
                Help
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                {tool.helpText || `Use this tool to ${tool.description.toLowerCase()}`}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {children}
    </div>
  );
}
