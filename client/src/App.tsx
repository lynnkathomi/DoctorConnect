import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import FindDoctor from "@/pages/find-doctor";
import MyAppointments from "@/pages/my-appointments";
import AuthPage from "@/pages/auth-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

import Header from "@/components/layout/header";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <AppLayout>
          <Home />
        </AppLayout>
      </Route>
      <Route path="/find-doctor">
        <AppLayout>
          <FindDoctor />
        </AppLayout>
      </Route>
      <ProtectedRoute path="/my-appointments" component={() => (
        <AppLayout>
          <MyAppointments />
        </AppLayout>
      )} />
      <Route path="/auth" component={AuthPage} />
      <Route>
        <AppLayout>
          <NotFound />
        </AppLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
