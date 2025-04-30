import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function UserMenu() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex-shrink-0 p-4 border-t border-primary-light">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Avatar className="h-9 w-9 bg-accent-purple">
            <AvatarFallback className="text-white bg-primary-light">U</AvatarFallback>
          </Avatar>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-white">User</p>
          <p className="text-xs text-neutral">Security Analyst</p>
        </div>
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="ml-auto flex items-center justify-center h-8 w-8 rounded-full bg-primary-light text-neutral hover:text-white hover:bg-primary-light/80"
        >
          {theme === "light" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-2 flex items-center justify-center h-8 w-8 rounded-full bg-primary-light text-neutral hover:text-white hover:bg-primary-light/80">
              <Settings className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
