import { Link } from "wouter";

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
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">nasiloldu.net</h3>
            <p className="text-sm text-muted-foreground">
              Wikidata verilerine dayalı, kapsamlı ve güncel ünlü ölüm bilgileri platformu.
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors" 
                      data-testid={`link-footer-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} nasiloldu.net. Tüm hakları saklıdır.</p>
          <p className="mt-2">Veri kaynağı: Wikidata</p>
        </div>
      </div>
    </footer>
  );
}
