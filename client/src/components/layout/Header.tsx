import { Link, useLocation } from "wouter";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Header() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/ara?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Bugün Ölenler", href: "/bugun" },
    { label: "Kategoriler", href: "/kategoriler" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link 
            href="/" 
            data-testid="link-home" 
            className="flex items-center gap-2 text-lg sm:text-xl font-bold text-primary hover-elevate rounded-md px-2 sm:px-3 py-2 flex-shrink-0"
          >
            <span className="hidden md:inline">nasiloldu.net</span>
            <span className="md:hidden">nasiloldu</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors hover-elevate whitespace-nowrap ${
                  location === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground"
                }`}
                data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Bir ünlünün adını arayın..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card border-border"
                data-testid="input-search"
              />
            </div>
            <Button type="submit" size="icon" variant="default" data-testid="button-search">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Mobile Search Button (opens search in sheet) */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden flex-shrink-0" 
            onClick={() => setMobileMenuOpen(true)}
            data-testid="button-mobile-search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Mobile Menu Sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden flex-shrink-0" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-8">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="flex flex-col gap-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Arama</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Bir ünlünün adını arayın..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-card border-border"
                      data-testid="input-search-mobile"
                    />
                  </div>
                  <Button type="submit" variant="default" className="w-full" data-testid="button-search-mobile">
                    <Search className="h-4 w-4 mr-2" />
                    Ara
                  </Button>
                </form>

                {/* Mobile Navigation */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Menü</h3>
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-4 py-3 rounded-md text-sm font-medium transition-colors hover-elevate ${
                          location === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-foreground"
                        }`}
                        data-testid={`link-mobile-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
