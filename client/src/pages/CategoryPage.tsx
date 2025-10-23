import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { PersonCard, PersonCardSkeleton } from "@/components/PersonCard";
import { PageLoading } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { HeartPulse, Car, HeartCrack, Target } from "lucide-react";
import type { PersonWithRelations, Category } from "@shared/schema";
import { SEOHead } from "@/components/SEOHead";

const categoryIcons = {
  hastalik: HeartPulse,
  kaza: Car,
  intihar: HeartCrack,
  suikast: Target,
};

export default function CategoryPage() {
  const { tip } = useParams();
  const [, setLocation] = useLocation();

  const { data: category, isLoading: loadingCategory } = useQuery<Category>({
    queryKey: ["/api/categories", tip],
    enabled: !!tip,
  });

  const { data: persons, isLoading: loadingPersons } = useQuery<PersonWithRelations[]>({
    queryKey: ["/api/categories", tip, "persons"],
    enabled: !!tip,
  });

  if (loadingCategory) {
    return <PageLoading />;
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Kategori Bulunamadı</h1>
        <Button variant="default" onClick={() => setLocation("/")}>Ana Sayfaya Dön</Button>
      </div>
    );
  }

  const Icon = categoryIcons[category.slug as keyof typeof categoryIcons] || HeartPulse;

  const personCount = persons?.length || 0;
  const seoTitle = `${category.name} Nedeniyle Ölen Ünlüler | nasiloldu.net`;
  const seoDescription = `${category.name} nedeniyle vefat eden ${personCount} ünlünün detaylı hayat hikayesi ve ölüm bilgileri. ${category.name} kategorisindeki tüm ünlüleri keşfedin.`;

  return (
    <div className="min-h-screen">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonical={`https://nasiloldu.net/kategori/${category.slug}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": `${category.name} Kategorisi`,
          "description": seoDescription,
          "numberOfItems": personCount
        }}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground flex items-center gap-2">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span>/</span>
          <span className="text-foreground">Kategoriler</span>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Icon className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4" data-testid="text-category-name">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
          {persons && (
            <p className="text-sm text-muted-foreground mt-4">
              {persons.length} kişi
            </p>
          )}
        </div>

        {/* Persons Grid */}
        {loadingPersons ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <PersonCardSkeleton key={i} />
            ))}
          </div>
        ) : persons && persons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {persons.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p>Bu kategoride henüz kişi bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </div>
  );
}
