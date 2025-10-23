import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { PageLoading } from "@/components/LoadingSpinner";
import { PersonCard } from "@/components/PersonCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEOHead, generatePersonSchema } from "@/components/SEOHead";
import { capitalize } from "@/lib/utils";
import { formatDate, formatTurkishDate } from "@shared/utils";
import { 
  User, ExternalLink, Calendar, MapPin, Briefcase, 
  AlertCircle, Heart, Clock, Globe 
} from "lucide-react";
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
          <Button variant="default">Ana Sayfaya Dön</Button>
        </Link>
      </div>
    );
  }

  const getAge = () => {
    if (!person.birthDate || !person.deathDate) return null;
    const birth = new Date(person.birthDate);
    const death = new Date(person.deathDate);
    const age = death.getFullYear() - birth.getFullYear();
    return age;
  };

  const age = getAge();

  // Format description into paragraphs
  const descriptionParagraphs = person.description 
    ? person.description.split('\n\n').filter(p => p.trim().length > 0)
    : [];

  // Breadcrumb Schema for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Sayfa",
        "item": "https://nasiloldu.net/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": person.category.name,
        "item": `https://nasiloldu.net/kategori/${person.category.slug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": person.name,
        "item": `https://nasiloldu.net/nasil-oldu/${person.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${person.name} Nasıl Öldü? - ${formatTurkishDate(person.deathDate)}`}
        description={person.description || `${person.name} - ${person.profession.name}, ${person.country.name}. Doğum: ${formatDate(person.birthDate)}, Ölüm: ${formatDate(person.deathDate)}. ${person.deathCause ? `Ölüm Nedeni: ${person.deathCause.name}` : ''}`}
        canonical={`https://nasiloldu.net/nasil-oldu/${person.slug}`}
        ogType="profile"
        schema={[generatePersonSchema(person), breadcrumbSchema]}
      />

      {/* Cinematic Hero Section */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          {person.imageUrl ? (
            <>
              <img
                src={person.imageUrl}
                alt={`${person.name} portresi`}
                className="w-full h-full object-cover object-top"
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <User className="w-64 h-64 text-primary" />
              </div>
            </div>
          )}
          
          {/* Yellow Radial Glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full">
          <div className="container mx-auto px-4 pb-12">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-zinc-400 flex items-center gap-2 flex-wrap">
              <Link href="/" className="hover:text-primary transition-colors">
                Ana Sayfa
              </Link>
              <span>/</span>
              <Link href={`/kategori/${person.category.slug}`} className="hover:text-primary transition-colors">
                {person.category.name}
              </Link>
              <span>/</span>
              <span className="text-white">{person.name}</span>
            </nav>

            {/* Name and Info */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="flex-1">
                <h1 
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-yellow-300 to-primary bg-clip-text text-transparent" 
                  data-testid="text-person-name"
                >
                  {person.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/90 backdrop-blur-sm rounded-full" />
                    <Badge variant="default" className="relative bg-transparent border-0 text-black font-semibold px-4 py-1.5 text-sm">
                      {person.category.name}
                    </Badge>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full border border-white/20" />
                    <Badge variant="secondary" className="relative bg-transparent border-0 text-white font-medium px-4 py-1.5 text-sm">
                      {capitalize(person.profession.name)}
                    </Badge>
                  </div>
                  {person.slug === 'mustafa-kemal-ataturk' && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/90 backdrop-blur-sm rounded-full" />
                      <Badge variant="default" className="relative bg-transparent border-0 text-black font-semibold px-4 py-1.5 text-sm">
                        Kahraman
                      </Badge>
                    </div>
                  )}
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full border border-white/20" />
                    <Badge variant="secondary" className="relative bg-transparent border-0 text-white font-medium px-4 py-1.5 text-sm">
                      {person.country.name}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Quick Stats Glass Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20" />
                <div className="relative p-6 min-w-[280px]">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-zinc-400 mb-1">Doğum</p>
                      <p className="font-mono text-sm text-white">{formatDate(person.birthDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 mb-1">Ölüm</p>
                      <p className="font-mono text-sm text-white">{formatDate(person.deathDate)}</p>
                    </div>
                    {age && (
                      <div className="col-span-2">
                        <p className="text-xs text-zinc-400 mb-1">Yaşı</p>
                        <p className="text-2xl font-bold text-primary">{age}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biography Section */}
            {descriptionParagraphs.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl backdrop-blur-sm">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Hayat Hikayesi
                  </h2>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-md rounded-2xl border border-white/10" />
                  <div className="relative p-8 space-y-6">
                    {descriptionParagraphs.map((paragraph, index) => (
                      <p 
                        key={index} 
                        className="text-base md:text-lg leading-relaxed text-zinc-300 first-letter:text-4xl first-letter:font-bold first-letter:text-primary first-letter:mr-1"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Death Information */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-500/10 rounded-xl backdrop-blur-sm">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Ölüm Bilgileri
                </h2>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-white/5 backdrop-blur-md rounded-2xl border border-red-500/20" />
                <div className="relative p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-red-500/10 rounded-xl">
                        <Calendar className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-500 mb-1">Ölüm Tarihi</p>
                        <p className="font-mono text-xl text-white">{formatDate(person.deathDate)}</p>
                      </div>
                    </div>

                    {age && (
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-500/10 rounded-xl">
                          <Clock className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <p className="text-sm text-zinc-500 mb-1">Vefat Yaşı</p>
                          <p className="font-mono text-xl text-white">{age} yaşında</p>
                        </div>
                      </div>
                    )}

                    {person.deathPlace && (
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-500/10 rounded-xl">
                          <MapPin className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <p className="text-sm text-zinc-500 mb-1">Ölüm Yeri</p>
                          <p className="text-lg text-white">{person.deathPlace}</p>
                        </div>
                      </div>
                    )}

                    {person.deathCause && (
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-500/10 rounded-xl">
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <p className="text-sm text-zinc-500 mb-1">Ölüm Nedeni</p>
                          <p className="text-lg font-semibold text-white">{capitalize(person.deathCause.name)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Wikipedia Link */}
            {person.wikipediaUrl && (
              <a
                href={person.wikipediaUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto group relative overflow-hidden" 
                  data-testid="button-wikipedia"
                >
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 group-hover:border-primary/40 transition-all duration-300" />
                  <div className="relative flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>Wikipedia'da Devamını Oku</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </Button>
              </a>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Portrait Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/10" />
              <div className="relative overflow-hidden rounded-2xl">
                <div className="aspect-square relative bg-gradient-to-br from-zinc-800 to-zinc-900">
                  {person.imageUrl ? (
                    <img
                      src={person.imageUrl}
                      alt={`${person.name} portresi`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="p-12 bg-primary/10 rounded-full backdrop-blur-sm">
                        <User className="w-32 h-32 text-primary/40" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/10" />
              <div className="relative p-6">
                <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Detaylı Bilgiler
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-zinc-500 mb-1">Doğum Tarihi</p>
                      <p className="font-mono text-sm text-white">{formatDate(person.birthDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Briefcase className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-zinc-500 mb-1">Meslek</p>
                      <p className="text-sm text-white">{capitalize(person.profession.name)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-zinc-500 mb-1">Ülke</p>
                      <p className="text-sm text-white">{person.country.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Persons */}
        {relatedPersons && relatedPersons.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary/10 rounded-xl backdrop-blur-sm">
                <User className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                İlgili Kişiler
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPersons.slice(0, 6).map((relatedPerson) => (
                <PersonCard key={relatedPerson.id} person={relatedPerson} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
