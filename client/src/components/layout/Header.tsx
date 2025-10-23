import { Link, useLocation } from "wouter";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Header() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/ara?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navItems = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Bugün Ölenler", href: "/bugun" },
    { label: "Kategoriler", href: "/kategoriler" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" data-testid="link-home" className="flex items-center gap-2 text-xl font-bold text-primary hover-elevate rounded-md px-3 py-2">
            <span className="hidden sm:inline">nasiloldu.net</span>
            <span className="sm:hidden">NO</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover-elevate ${
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

          {/* Search Bar */}
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

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="lg:hidden pb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border"
              data-testid="input-search-mobile"
            />
          </div>
          <Button type="submit" size="icon" variant="default" data-testid="button-search-mobile">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
