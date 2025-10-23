import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { PersonCard, PersonCardSkeleton } from "@/components/PersonCard";
import { Search } from "lucide-react";
import type { PersonWithRelations } from "@shared/schema";

export default function SearchPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1]);
  const query = searchParams.get("q") || "";

  const { data: results, isLoading } = useQuery<PersonWithRelations[]>({
    queryKey: ["/api/search", query],
    enabled: query.length > 0,
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6 text-primary" />
            <h1 className="text-2xl md:text-4xl font-bold text-foreground">
              Arama Sonuçları
            </h1>
          </div>
          {query && (
            <p className="text-lg text-muted-foreground">
              <span className="text-primary font-semibold">"{query}"</span> için sonuçlar
              {results && <span className="ml-2">({results.length} sonuç)</span>}
            </p>
          )}
        </div>

        {!query ? (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="w-16 h-16 mx-auto mb-4 text-primary/20" />
            <p>Lütfen bir arama terimi girin.</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <PersonCardSkeleton key={i} />
            ))}
          </div>
        ) : results && results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="w-16 h-16 mx-auto mb-4 text-primary/20" />
            <p className="text-lg mb-2">Sonuç bulunamadı</p>
            <p className="text-sm">
              "{query}" için hiçbir kişi bulunamadı. Lütfen farklı bir arama deneyin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
