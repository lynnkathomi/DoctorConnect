import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import FindDoctor from "@/pages/find-doctor";
import MyAppointments from "@/pages/my-appointments";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/find-doctor" component={FindDoctor} />
      <Route path="/my-appointments" component={MyAppointments} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
