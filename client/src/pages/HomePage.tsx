import { useQuery } from "@tanstack/react-query";
import { PersonCard, PersonCardSkeleton } from "@/components/PersonCard";
import { CategoryCard } from "@/components/CategoryCard";
import { PageLoading } from "@/components/LoadingSpinner";
import { Calendar, TrendingUp, Layers, Search, Users, FolderOpen, CalendarDays, ArrowRight, Sparkles } from "lucide-react";
import type { PersonWithRelations, Category } from "@shared/schema";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { capitalize } from "@/lib/utils";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [, setLocation] = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: stats } = useQuery<{ totalPersons: number; totalCategories: number; totalCountries: number; totalProfessions: number }>({
    queryKey: ["/api/stats"],
  });

  const { data: searchResults, isLoading: searchLoading } = useQuery<PersonWithRelations[]>({
    queryKey: ["/api/search", searchQuery],
    queryFn: async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: searchQuery.length >= 3,
  });

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

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show suggestions when user types 3+ chars
  useEffect(() => {
    if (searchQuery.length >= 3) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/ara?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Bilinmiyor";
    const [year, month, day] = dateStr.split("-");
    return `${day}.${month}.${year}`;
  };

  const handleSuggestionClick = (slug: string) => {
    setLocation(`/nasil-oldu/${slug}`);
    setShowSuggestions(false);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Revolutionary Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black">
          {/* Animated Glow Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-yellow-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px]" />
        </div>

        {/* Radial Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(255, 214, 10, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-xl rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Wikidata & Wikipedia Bazlı Platform</span>
            </div>

            {/* Main Heading */}
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-[1.2] tracking-tight"
              data-testid="text-hero-title"
              style={{ lineHeight: '1.25' }}
            >
              <span className="block bg-gradient-to-r from-white via-zinc-200 to-white bg-clip-text text-transparent mb-3">
                Ünlüler
              </span>
              <span className="block bg-gradient-to-r from-primary via-yellow-300 to-primary bg-clip-text text-transparent animate-pulse">
                Nasıl Öldü?
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-light">
              Kapsamlı, güncel ve ansiklopedik ölüm bilgileri. {stats?.totalPersons || 63} ünlü kişi, 4 kategori.
            </p>

            {/* AJAX Search Bar */}
            <div className="max-w-3xl mx-auto pt-6" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative">
                {/* Main Search Input */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-yellow-500/20 to-primary/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 group-focus-within:border-primary/50 transition-all duration-300 overflow-hidden">
                    <div className="flex items-center p-3 sm:p-4">
                      <Search className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400 flex-shrink-0 ml-2" />
                      <input
                        type="text"
                        placeholder="Bir ünlünün adını yazın (en az 3 harf)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-4 py-2 bg-transparent text-white placeholder:text-zinc-500 focus:outline-none text-base sm:text-lg"
                        data-testid="input-search"
                      />
                      <button
                        type="submit"
                        className="flex-shrink-0 px-6 py-2.5 bg-gradient-to-r from-primary to-yellow-400 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 flex items-center gap-2"
                        data-testid="button-search"
                      >
                        <span className="hidden sm:inline">Ara</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* AJAX Search Results Dropdown */}
                {showSuggestions && searchQuery.length >= 3 && (
                  <div className="absolute w-full mt-3 bg-black/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl shadow-primary/10 overflow-hidden z-[9999]">
                    {searchLoading ? (
                      <div className="p-8 text-center">
                        <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-zinc-400 mt-3">Aranıyor...</p>
                      </div>
                    ) : searchResults && searchResults.length > 0 ? (
                      <div className="max-h-[400px] overflow-y-auto">
                        <div className="p-3 border-b border-white/5">
                          <p className="text-xs text-zinc-500 font-medium">
                            {searchResults.length} sonuç bulundu
                          </p>
                        </div>
                        {searchResults.slice(0, 8).map((person) => (
                          <button
                            key={person.id}
                            onClick={() => handleSuggestionClick(person.slug)}
                            className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left group"
                            data-testid={`suggestion-${person.id}`}
                          >
                            {/* Image */}
                            <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-zinc-800 border border-white/10">
                              {person.imageUrl ? (
                                <img
                                  src={person.imageUrl}
                                  alt={person.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Users className="w-6 h-6 text-zinc-600" />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-white group-hover:text-primary transition-colors truncate">
                                {person.name}
                              </h4>
                              <p className="text-sm text-zinc-400 truncate">
                                {capitalize(person.profession.name)} • {person.country.name}
                              </p>
                              <p className="text-xs text-zinc-500 font-mono">
                                {formatDate(person.deathDate)}
                              </p>
                            </div>

                            {/* Arrow */}
                            <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <Search className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                        <p className="text-zinc-400">Sonuç bulunamadı</p>
                        <p className="text-sm text-zinc-600 mt-1">Farklı bir isim deneyin</p>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Stats Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
              {[
                { label: "Kişi", value: stats?.totalPersons || 0, Icon: Users },
                { label: "Kategori", value: stats?.totalCategories || 0, Icon: Layers },
                { label: "Ülke", value: stats?.totalCountries || 0, Icon: FolderOpen },
              ].map((stat, i) => (
                <div 
                  key={i}
                  className="inline-flex items-center gap-3 px-5 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 hover:border-primary/30 transition-all"
                >
                  <div className="p-2 bg-primary/10 rounded-full">
                    <stat.Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-zinc-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
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
