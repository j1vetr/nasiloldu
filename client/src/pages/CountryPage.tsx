import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { PersonCard, PersonCardSkeleton } from "@/components/PersonCard";
import { PageLoading } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import type { PersonWithRelations, Country } from "@shared/schema";
import { SEOHead } from "@/components/SEOHead";

export default function CountryPage() {
  const { "ulke-adi": countrySlug } = useParams();
  const [, setLocation] = useLocation();

  const { data: country, isLoading: loadingCountry } = useQuery<Country>({
    queryKey: ["/api/countries", countrySlug],
    enabled: !!countrySlug,
  });

  const { data: persons, isLoading: loadingPersons } = useQuery<PersonWithRelations[]>({
    queryKey: ["/api/countries", countrySlug, "persons"],
    enabled: !!countrySlug,
  });

  if (loadingCountry) {
    return <PageLoading />;
  }

  if (!country) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Ülke Bulunamadı</h1>
        <Button variant="default" onClick={() => setLocation("/")}>Ana Sayfaya Dön</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${country.name} - Ülke Sayfası | nasiloldu.net`}
        description={`${country.name} ülkesinden vefat eden ünlülerin listesi ve detaylı ölüm bilgileri.`}
        canonical={`https://nasiloldu.net/ulke/${country.slug}`}
      />
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6 text-sm text-muted-foreground flex items-center gap-2">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span>/</span>
          <span className="text-foreground">Ülkeler</span>
          <span>/</span>
          <span className="text-foreground">{country.name}</span>
        </nav>

        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <MapPin className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4" data-testid="text-country-name">
            {country.name}
          </h1>
          {persons && (
            <p className="text-sm text-muted-foreground mt-4">
              {persons.length} kişi
            </p>
          )}
        </div>

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
            <p>Bu ülkede henüz kişi bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </div>
  );
}
