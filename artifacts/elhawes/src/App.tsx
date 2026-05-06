import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import TripsPage from "@/pages/TripsPage";
import TripDetailPage from "@/pages/TripDetailPage";
import BookingSuccessPage from "@/pages/BookingSuccessPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminTripsPage from "@/pages/AdminTripsPage";
import AdminBookingsPage from "@/pages/AdminBookingsPage";
import { useGetAdminMe } from "@workspace/api-client-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useGetAdminMe();
  if (isLoading) return null;
  if (!data?.authenticated) return <Redirect to="/admin/login" />;
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/trips" component={TripsPage} />
      <Route path="/trips/:slug">
        {(params) => <TripDetailPage slug={params.slug} />}
      </Route>
      <Route path="/booking-success" component={BookingSuccessPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin">
        <AdminGuard>
          <AdminDashboard />
        </AdminGuard>
      </Route>
      <Route path="/admin/trips">
        <AdminGuard>
          <AdminTripsPage />
        </AdminGuard>
      </Route>
      <Route path="/admin/bookings">
        <AdminGuard>
          <AdminBookingsPage />
        </AdminGuard>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
