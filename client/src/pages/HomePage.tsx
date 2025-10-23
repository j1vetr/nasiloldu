import { useQuery } from "@tanstack/react-query";
import { PersonCard } from "@/components/PersonCard";
import { CategoryCard } from "@/components/CategoryCard";
import { PageLoading, PersonCardSkeleton } from "@/components/LoadingSpinner";
import { Calendar, TrendingUp, Layers, Search } from "lucide-react";
import type { PersonWithRelations, Category } from "@shared/schema";
import { useState } from "react";
import { useLocation } from "wouter";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/ara?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Premium Hero Section with Gradient */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden py-12">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-zinc-900">
          {/* Yellow Radial Glow */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-[100px]" />
        </div>

        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
                             linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-yellow-400 to-primary bg-clip-text text-transparent leading-tight"
            data-testid="text-hero-title"
          >
            Ünlüler Nasıl Öldü?
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
            Wikidata ve Wikipedia verilerine dayalı, kapsamlı ve güncel ünlü ölüm bilgileri platformu
          </p>

          {/* Glassmorphic Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4">
            <div className="relative group">
              {/* Glass Container */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 group-focus-within:border-primary/50 transition-all duration-300" />
              
              <div className="relative flex flex-col sm:flex-row items-center gap-2 sm:gap-0 p-2">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Bir ünlünün adını arayın..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 sm:pl-14 pr-4 py-3 sm:py-4 bg-transparent text-white placeholder:text-zinc-500 focus:outline-none text-base sm:text-lg rounded-xl sm:rounded-none"
                    data-testid="input-search"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary to-yellow-400 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/50 hover:scale-105 transition-all duration-300 whitespace-nowrap"
                  data-testid="button-search"
                >
                  Ara
                </button>
              </div>
            </div>
          </form>

          {/* Featured Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            {[
              { label: "Kişi", value: recentPersons?.length || 0, icon: "👤" },
              { label: "Kategori", value: categories?.length || 0, icon: "📂" },
              { label: "Güncel", value: "2025", icon: "📅" },
            ].map((stat, i) => (
              <div 
                key={i}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl border border-white/10 group-hover:border-primary/30 transition-all duration-300" />
                <div className="relative p-6 text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-zinc-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* Bugün Ölenler */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl backdrop-blur-sm">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Bugün Ölenler
            </h2>
          </div>
          {loadingToday ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <PersonCardSkeleton key={i} />
              ))}
            </div>
          ) : todayDeaths && todayDeaths.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {todayDeaths.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-md rounded-2xl border border-white/10" />
              <div className="relative text-center py-16 text-zinc-400">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Bugün ölen ünlü kaydı bulunamadı.</p>
              </div>
            </div>
          )}
        </section>

        {/* Kategoriler */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl backdrop-blur-sm">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Kategoriler
            </h2>
          </div>
          {loadingCategories ? (
            <PageLoading />
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : null}
        </section>

        {/* En Çok Arananlar */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl backdrop-blur-sm">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              En Çok Arananlar
            </h2>
          </div>
          {loadingPopular ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <PersonCardSkeleton key={i} />
              ))}
            </div>
          ) : popularPersons && popularPersons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularPersons.slice(0, 6).map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-md rounded-2xl border border-white/10" />
              <div className="relative text-center py-16 text-zinc-400">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Henüz popüler içerik bulunmamaktadır.</p>
              </div>
            </div>
          )}
        </section>

        {/* Son Eklenenler */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl backdrop-blur-sm">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Son Eklenenler
            </h2>
          </div>
          {loadingRecent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <PersonCardSkeleton key={i} />
              ))}
            </div>
          ) : recentPersons && recentPersons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPersons.slice(0, 6).map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
