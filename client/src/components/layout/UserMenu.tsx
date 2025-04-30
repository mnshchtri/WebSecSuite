import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";

export default function UserMenu() {
  return (
    <div className="flex-shrink-0 p-4 border-t border-primary-light">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Avatar className="h-9 w-9 bg-accent-blue">
            <AvatarFallback className="text-white bg-primary-light">U</AvatarFallback>
          </Avatar>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-white">User</p>
          <p className="text-xs text-neutral">Security Analyst</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-auto text-neutral hover:text-white">
              <Settings className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
