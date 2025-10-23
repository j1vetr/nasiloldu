import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import logoUrl from "@assets/logo nsl_1761194999380.png";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Bugün Ölenler", href: "/bugun" },
    { label: "Kategoriler", href: "/kategoriler" },
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
          <nav className="hidden md:flex items-center gap-2 flex-1 justify-center">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover-elevate ${
                  location === item.href
                    ? "text-primary"
                    : "text-zinc-300 hover:text-white"
                }`}
                data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {location === item.href && (
                  <div className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20" />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* CTA Button - Desktop Only */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/kategoriler">
              <Button 
                variant="default" 
                className="bg-gradient-to-r from-primary to-yellow-400 text-black font-bold hover:shadow-lg hover:shadow-primary/50 transition-all"
              >
                Keşfet
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden hover:bg-white/10" 
                data-testid="button-mobile-menu"
              >
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
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
                <nav className="flex flex-col gap-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-6 py-4 rounded-xl text-base font-semibold transition-all hover-elevate ${
                        location === item.href
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-zinc-300 hover:text-white hover:bg-white/5"
                      }`}
                      data-testid={`link-mobile-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <Link href="/kategoriler" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    variant="default" 
                    className="w-full bg-gradient-to-r from-primary to-yellow-400 text-black font-bold text-lg py-6"
                  >
                    Keşfet
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
