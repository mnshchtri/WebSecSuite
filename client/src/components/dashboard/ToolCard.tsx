import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tool } from "@/lib/tools";
import { PlayCircle } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const { id, name, description, icon: Icon, color } = tool;

  return (
    <Card className="tool-card bg-primary-light rounded-lg shadow-lg p-4 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl">
      <div className="flex items-start mb-3">
        <div className={`p-2 bg-opacity-10 rounded-lg mr-3 ${color}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-xs text-neutral-light">{description}</p>
        </div>
      </div>
      <Link href={`/tool/${id}`}>
        <Button 
          variant="outline" 
          className={`w-full mt-2 bg-opacity-10 hover:bg-opacity-20 ${color} border-0 gap-2`}
        >
          <PlayCircle className="h-4 w-4" />
          Launch Tool
        </Button>
      </Link>
    </Card>
  );
}
