import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { PageLoading } from "@/components/LoadingSpinner";
import { PersonCard } from "@/components/PersonCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEOHead, generatePersonSchema } from "@/components/SEOHead";
import { User, ExternalLink, Calendar, MapPin, Briefcase, AlertCircle } from "lucide-react";
import type { PersonWithRelations } from "@shared/schema";

export default function PersonDetailPage() {
  const { slug } = useParams();

  const { data: person, isLoading } = useQuery<PersonWithRelations>({
    queryKey: ["/api/persons", slug],
    enabled: !!slug,
  });

  const { data: relatedPersons } = useQuery<PersonWithRelations[]>({
    queryKey: ["/api/persons", slug, "related"],
    enabled: !!slug,
  });

  if (isLoading) {
    return <PageLoading />;
  }

  if (!person) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Kişi Bulunamadı</h1>
        <p className="text-muted-foreground mb-6">
          Aradığınız kişi bulunamadı veya henüz eklenmemiş.
        </p>
        <Link href="/">
          <a>
            <Button variant="default">Ana Sayfaya Dön</Button>
          </a>
        </Link>
      </div>
    );
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Bilinmiyor";
    const [year, month, day] = dateStr.split("-");
    return `${day}.${month}.${year}`;
  };

  const getAge = () => {
    if (!person.birthDate || !person.deathDate) return null;
    const birth = new Date(person.birthDate);
    const death = new Date(person.deathDate);
    const age = death.getFullYear() - birth.getFullYear();
    return age;
  };

  const age = getAge();

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${person.name} Nasıl Öldü? - nasiloldu.net`}
        description={person.description || `${person.name} - ${person.profession.name}, ${person.country.name}. Doğum: ${formatDate(person.birthDate)}, Ölüm: ${formatDate(person.deathDate)}. ${person.deathCause ? `Ölüm Nedeni: ${person.deathCause.name}` : ''}`}
        canonical={`https://nasiloldu.net/nasil-oldu/${person.slug}`}
        ogType="profile"
        schema={generatePersonSchema(person)}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span>/</span>
          <Link href={`/kategori/${person.category.slug}`} className="hover:text-primary">
            {person.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{person.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4" data-testid="text-person-name">
                {person.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default">{person.category.name}</Badge>
                <Badge variant="secondary">{person.profession.name}</Badge>
                <Badge variant="secondary">{person.country.name}</Badge>
              </div>
            </div>

            {/* Description */}
            {person.description && (
              <Card className="p-6">
                <p className="text-base md:text-lg leading-relaxed text-foreground">
                  {person.description}
                </p>
              </Card>
            )}

            {/* Death Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Ölüm Bilgileri
              </h2>
              <div className="space-y-3 text-foreground">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ölüm Tarihi</p>
                    <p className="font-mono text-lg">{formatDate(person.deathDate)}</p>
                  </div>
                  {age && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Yaş</p>
                      <p className="font-mono text-lg">{age}</p>
                    </div>
                  )}
                </div>
                {person.deathPlace && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ölüm Yeri</p>
                    <p>{person.deathPlace}</p>
                  </div>
                )}
                {person.deathCause && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ölüm Nedeni</p>
                    <p className="text-lg font-medium">{person.deathCause.name}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Wikipedia Link */}
            {person.wikipediaUrl && (
              <a
                href={person.wikipediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" className="w-full sm:w-auto" data-testid="button-wikipedia">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Wikipedia'da Oku
                </Button>
              </a>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Portrait */}
            <Card className="overflow-hidden">
              <div className="aspect-square relative bg-muted">
                {person.imageUrl ? (
                  <img
                    src={person.imageUrl}
                    alt={`${person.name} portresi`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-32 h-32 text-primary/20" />
                  </div>
                )}
              </div>
            </Card>

            {/* Info Box */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg text-foreground mb-4">Bilgiler</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Doğum</p>
                    <p className="font-mono">{formatDate(person.birthDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Meslek</p>
                    <p>{person.profession.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ülke</p>
                    <p>{person.country.name}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Related Persons */}
        {relatedPersons && relatedPersons.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
              İlgili Kişiler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedPersons.slice(0, 8).map((relatedPerson) => (
                <PersonCard key={relatedPerson.id} person={relatedPerson} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
