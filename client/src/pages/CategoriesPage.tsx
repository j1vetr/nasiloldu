import { useQuery } from "@tanstack/react-query";
import { CategoryCard } from "@/components/CategoryCard";
import { PageLoading } from "@/components/LoadingSpinner";
import type { Category } from "@shared/schema";
import { SEOHead } from "@/components/SEOHead";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Kategoriler - nasiloldu.net"
        description="Ölüm nedenlerine göre kategoriler. Hastalık, Kaza, İntihar ve Suikast kategorilerini keşfedin."
        canonical="https://nasiloldu.net/kategoriler"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4" data-testid="text-page-title">
            Ölüm Kategorileri
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ölüm nedenlerini kategorilere göre keşfedin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {categories?.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}
