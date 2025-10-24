import { Link } from "wouter";
import { Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Kategoriler",
      links: [
        { label: "Hastalık", href: "/kategori/hastalik" },
        { label: "Kaza", href: "/kategori/kaza" },
        { label: "İntihar", href: "/kategori/intihar" },
        { label: "Suikast", href: "/kategori/suikast" },
      ],
    },
    {
      title: "Keşfet",
      links: [
        { label: "Bugün Ölenler", href: "/bugun" },
        { label: "Ülkeler", href: "/ulkeler" },
        { label: "Oyuncular", href: "/meslek/oyuncu" },
        { label: "Politikacılar", href: "/meslek/politikaci" },
      ],
    },
    {
      title: "Bilgi",
      links: [
        { label: "Hakkında", href: "/hakkinda" },
        { label: "İletişim", href: "/iletisim" },
        { label: "KVKK", href: "/kvkk" },
        { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-border/50 bg-gradient-to-b from-card to-background mt-auto">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group text-2xl font-bold text-primary" data-testid="link-footer-home">
              nasiloldu.net
            </Link>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              Türkiye'nin en kapsamlı ünlü biyografi ve ölüm bilgileri platformu. 
              236+ ünlü kişinin hayat hikayesini ve vefat detaylarını keşfedin.
            </p>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
              <div className="w-2 h-2 rounded-full bg-primary/50 animate-pulse" />
              <span>Her gün güncellenen içerik</span>
            </div>
          </div>

          {/* Footer Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                {section.title}
                <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block group" 
                      data-testid={`link-footer-${link.label.toLowerCase()}`}
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-200 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {currentYear} nasiloldu.net. Tüm hakları saklıdır.
          </p>
          
          {/* Made with Love by TOOV */}
          <a 
            href="https://toov.com.tr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
            data-testid="link-toov"
          >
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 group-hover:scale-110 transition-transform" />
            <span>by</span>
            <span className="font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              TOOV
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
