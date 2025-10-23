import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Globe, Users, ChevronRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Country {
  id: number;
  slug: string;
  name: string;
  _count: {
    persons: number;
  };
}

export default function Countries() {
  const { data: countries, isLoading } = useQuery<Country[]>({
    queryKey: ["/api/countries"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-zinc-400 text-lg">Ülkeler yükleniyor...</p>
        </div>
      </div>
    );
  }

  const sortedCountries = countries?.sort((a, b) => b._count.persons - a._count.persons) || [];
  const totalPersons = countries?.reduce((sum, country) => sum + country._count.persons, 0) || 0;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-black py-20 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,214,10,0.05),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">Tüm Ülkeler</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent leading-tight">
              Ünlülerin Ülkelere Göre Dağılımı
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
              {countries?.length || 0} farklı ülkeden {totalPersons} ünlü kişinin ölüm bilgilerini keşfedin.
            </p>
          </div>
        </div>
      </div>

      {/* Countries Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCountries.map((country) => (
            <Link
              key={country.id}
              href={`/ulke/${country.slug}`}
              data-testid={`link-country-${country.slug}`}
            >
              <Card className="group p-6 hover-elevate active-elevate-2 transition-all duration-300 cursor-pointer border-zinc-800 bg-zinc-900/50 hover:border-primary/30">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Globe className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">
                        {country.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Users className="w-4 h-4" />
                        <span>{country._count.persons} kişi</span>
                      </div>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {sortedCountries.length === 0 && (
          <div className="text-center py-20">
            <Globe className="w-20 h-20 text-zinc-700 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-zinc-400 mb-2">Henüz ülke eklenmemiş</h3>
            <p className="text-zinc-600">Yakında farklı ülkelerden ünlüler eklenecek.</p>
          </div>
        )}
      </div>
    </div>
  );
}
