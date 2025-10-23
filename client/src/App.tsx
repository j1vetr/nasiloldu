import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import HomePage from "@/pages/HomePage";
import PersonDetailPage from "@/pages/PersonDetailPage";
import CategoryPage from "@/pages/CategoryPage";
import CountryPage from "@/pages/CountryPage";
import ProfessionPage from "@/pages/ProfessionPage";
import TodayPage from "@/pages/TodayPage";
import SearchPage from "@/pages/SearchPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import KVKKPage from "@/pages/KVKKPage";
import TermsPage from "@/pages/TermsPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path="/" component={HomePage} />
      <Route path="/nasil-oldu/:slug" component={PersonDetailPage} />
      <Route path="/kategori/:tip" component={CategoryPage} />
      <Route path="/ulke/:ulke-adi" component={CountryPage} />
      <Route path="/meslek/:meslek-adi" component={ProfessionPage} />
      <Route path="/bugun" component={TodayPage} />
      <Route path="/ara" component={SearchPage} />
      
      {/* Static Pages */}
      <Route path="/hakkinda" component={AboutPage} />
      <Route path="/iletisim" component={ContactPage} />
      <Route path="/kvkk" component={KVKKPage} />
      <Route path="/kullanim-sartlari" component={TermsPage} />
      
      {/* Admin Pages */}
      <Route path="/admin" component={AdminLoginPage} />
      <Route path="/admin/dashboard" component={AdminDashboardPage} />
      
      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
