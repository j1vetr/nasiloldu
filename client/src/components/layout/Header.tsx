import { Link, useLocation } from "wouter";
import { Menu, Home, Heart, Car, Brain, Crosshair, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import logoUrl from "@assets/logo nsl_1761194999380.png";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Ana Sayfa", href: "/", icon: Home },
    { label: "Hastalık", href: "/kategori/hastalik", icon: Heart },
    { label: "Kaza", href: "/kategori/kaza", icon: Car },
    { label: "İntihar", href: "/kategori/intihar", icon: Brain },
    { label: "Suikast", href: "/kategori/suikast", icon: Crosshair },
    { label: "Bugün Ölenler", href: "/bugun", icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-6">
          
          {/* Logo */}
          <Link 
            href="/" 
            data-testid="link-home" 
            className="flex items-center gap-3 hover-elevate rounded-xl px-3 py-2 flex-shrink-0 group"
          >
            <img 
              src={logoUrl} 
              alt="nasiloldu.net logo" 
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || 
                (item.href.includes('/kategori/') && location.startsWith(item.href));
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`relative group px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                  data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Icon className={`w-4 h-4 transition-all ${isActive ? "text-primary" : "text-zinc-500 group-hover:text-primary"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden hover:bg-white/10" 
            data-testid="button-mobile-menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6 text-white" />
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="right" className="w-[300px] bg-black/95 backdrop-blur-2xl border-l border-white/10">
              <div className="flex flex-col gap-8 mt-12">
                
                {/* Logo in Mobile Menu */}
                <div className="flex justify-center">
                  <img 
                    src={logoUrl} 
                    alt="nasiloldu.net logo" 
                    className="h-12 w-auto"
                  />
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.href || 
                      (item.href.includes('/kategori/') && location.startsWith(item.href));
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-5 py-4 rounded-xl text-base font-semibold transition-all hover-elevate ${
                          isActive
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-zinc-300 hover:text-white hover:bg-white/5"
                        }`}
                        data-testid={`link-mobile-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-zinc-500"}`} />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
