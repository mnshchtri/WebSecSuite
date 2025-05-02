import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tool } from "@/lib/tools";
import { PlayCircle } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const { id, name, description, icon: Icon, color, category } = tool;
  
  // Map category to gradient class
  const getCategoryGradient = () => {
    switch(category) {
      case "Information Gathering":
        return "from-blue-500 to-blue-700";
      case "Vulnerability Analysis":
        return "from-yellow-500 to-yellow-700";
      case "Web Application Security":
        return "from-purple-500 to-purple-700";
      case "Network Security":
        return "from-teal-500 to-teal-700";
      case "System Tools":
        return "from-red-500 to-red-700";
      default:
        return "from-blue-500 to-blue-700";
    }
  };
  
  // Get the Hindu trinity mode based on category
  const getTrinityMode = () => {
    switch(category) {
      case "Information Gathering":
        return "Brahma Mode";
      case "Vulnerability Analysis":
        return "Vishnu Mode";
      case "Web Application Security":
        return "Shiva Mode";
      case "System Tools":
        return "God Mode";
      case "Network Security":
        return "Trinity Balance";
      default:
        return "";
    }
  };

  return (
    <Card className="tool-card bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className={`${getCategoryGradient()} px-4 py-2 flex justify-between items-center`}>
        <h4 className="font-medium text-sm">{name}</h4>
        <span className="text-xs opacity-75">{getTrinityMode()}</span>
      </div>
      
      <div className="p-4">
        <div className="flex items-start mb-3">
          <div className={`p-2 bg-opacity-20 rounded-lg mr-3 ${color}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <div>
            <p className="text-xs text-neutral-light">{description}</p>
          </div>
        </div>
        
        <Link href={`/tool/${id}`}>
          <Button 
            variant="outline" 
            className={`w-full mt-2 glow-button bg-opacity-10 hover:bg-opacity-20 ${color} border border-primary-light gap-2`}
          >
            <PlayCircle className="h-4 w-4" />
            Launch Tool
          </Button>
        </Link>
      </div>
    </Card>
  );
}
