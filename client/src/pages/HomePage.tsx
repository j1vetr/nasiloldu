import { useQuery } from "@tanstack/react-query";
import { PersonCard } from "@/components/PersonCard";
import { CategoryCard } from "@/components/CategoryCard";
import { PageLoading, PersonCardSkeleton } from "@/components/LoadingSpinner";
import { Calendar, TrendingUp, Layers } from "lucide-react";
import type { PersonWithRelations, Category } from "@shared/schema";

export default function HomePage() {
  const { data: todayDeaths, isLoading: loadingToday } = useQuery<PersonWithRelations[]>({
    queryKey: ["/api/persons/today"],
  });

  const { data: recentPersons, isLoading: loadingRecent } = useQuery<PersonWithRelations[]>({
    queryKey: ["/api/persons/recent"],
  });

  const { data: popularPersons, isLoading: loadingPopular } = useQuery<PersonWithRelations[]>({
    queryKey: ["/api/persons/popular"],
  });

  const { data: categories, isLoading: loadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-card to-background border-b border-border">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4" data-testid="text-hero-title">
            Ünlüler Nasıl Öldü?
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Wikidata verilerine dayalı, kapsamlı ve güncel ünlü ölüm bilgileri platformu
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Bugün Ölenler */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Bugün Ölenler
            </h2>
          </div>
          {loadingToday ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <PersonCardSkeleton key={i} />
              ))}
            </div>
          ) : todayDeaths && todayDeaths.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {todayDeaths.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Bugün ölen ünlü kaydı bulunamadı.</p>
            </div>
          )}
        </section>

        {/* Kategoriler */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Layers className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Kategoriler
            </h2>
          </div>
          {loadingCategories ? (
            <PageLoading />
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : null}
        </section>

        {/* En Çok Arananlar */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              En Çok Arananlar
            </h2>
          </div>
          {loadingPopular ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <PersonCardSkeleton key={i} />
              ))}
            </div>
          ) : popularPersons && popularPersons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {popularPersons.slice(0, 8).map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Henüz popüler içerik bulunmamaktadır.</p>
            </div>
          )}
        </section>

        {/* Son Eklenenler */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Son Eklenenler
            </h2>
          </div>
          {loadingRecent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <PersonCardSkeleton key={i} />
              ))}
            </div>
          ) : recentPersons && recentPersons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentPersons.slice(0, 8).map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
