import { Switch, Route, Router } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import DashboardPage from '@/components/dashboard/DashboardPage';
import NotFound from '@/pages/not-found';
import { SidebarProvider } from "./components/layout/SidebarContext";
import { ThemeProvider } from "next-themes";
import OverviewPage from './components/overview/OverviewPage';
import ToolPage from './components/tools/ToolPage';

function AppRoutes() {
  return (
    <SidebarProvider>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/overview" component={OverviewPage} />
        <Route path="/tool/:id" component={ToolPage} />
        <Route component={NotFound} />
      </Switch>
    </SidebarProvider>
  );
}

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Router>
          <TooltipProvider>
            <AppRoutes />
            <Toaster />
          </TooltipProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
