import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, MapPin } from "lucide-react";
import type { PersonWithRelations } from "@shared/schema";

interface PersonCardProps {
  person: PersonWithRelations;
}

export function PersonCard({ person }: PersonCardProps) {
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
    <Link href={`/nasil-oldu/${person.slug}`} data-testid={`card-person-${person.id}`}>
      <div className="group relative">
        {/* Glass Card Container */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/10 group-hover:border-primary/40 group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-300" />
        
        <div className="relative overflow-hidden rounded-2xl">
          {/* Image Section */}
          <div className="aspect-square relative bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
            {person.imageUrl ? (
              <>
                <img
                  src={person.imageUrl}
                  alt={`${person.name} portresi`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="p-8 bg-primary/10 rounded-full backdrop-blur-sm">
                  <User className="w-20 h-20 text-primary/40" />
                </div>
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-3 right-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/90 backdrop-blur-sm rounded-full" />
                <Badge 
                  variant="default" 
                  className="relative bg-transparent border-0 text-black font-semibold px-4 py-1.5"
                >
                  {person.category.name}
                </Badge>
              </div>
            </div>

            {/* Age Badge - Bottom Left */}
            {age && (
              <div className="absolute bottom-3 left-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-xl border border-white/10" />
                  <div className="relative px-3 py-1.5 text-xs font-mono text-zinc-300">
                    {age} yaşında
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Info Section */}
          <div className="relative p-5 space-y-3">
            <h3 
              className="font-bold text-xl text-white group-hover:text-primary line-clamp-1 transition-colors duration-300" 
              data-testid={`text-person-name-${person.id}`}
            >
              {person.name}
            </h3>
            
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span className="font-medium text-primary/90">{person.profession.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {person.country.name}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Calendar className="w-3 h-3" />
              <span className="font-mono">{formatDate(person.birthDate)}</span>
              <span>→</span>
              <span className="font-mono">{formatDate(person.deathDate)}</span>
            </div>

            {person.deathCause && (
              <div className="pt-2 border-t border-white/5">
                <p className="text-xs text-zinc-500 line-clamp-1">
                  <span className="text-zinc-600">Ölüm:</span>{" "}
                  <span className="text-zinc-300">{person.deathCause.name}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
