import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { capitalize } from "@/lib/utils";
import { formatDate } from "@shared/utils";
import { User, Calendar, MapPin, Briefcase, ArrowUpRight } from "lucide-react";
import type { PersonWithRelations } from "@shared/schema";

interface PersonCardProps {
  person: PersonWithRelations;
}

export function PersonCard({ person }: PersonCardProps) {
  const getAge = () => {
    if (!person.birthDate || !person.deathDate) return null;
    const birth = new Date(person.birthDate);
    const death = new Date(person.deathDate);
    
    let age = death.getFullYear() - birth.getFullYear();
    const monthDiff = death.getMonth() - birth.getMonth();
    
    // Ay ve gün kontrolü ile yaş düzeltmesi
    if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const age = getAge();

  return (
    <Link href={`/nasil-oldu/${person.slug}`} data-testid={`card-person-${person.id}`}>
      <div className="group relative h-full hover-elevate active-elevate-2">
        {/* Main Card Container */}
        <div className="relative h-full flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/90 to-black/90 border border-white/10 backdrop-blur-xl transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-2xl group-hover:shadow-primary/20">
          
          {/* Image Section with Overlay */}
          <div className="relative aspect-[4/5] overflow-hidden">
            {person.imageUrl ? (
              <>
                <img
                  src={person.imageUrl}
                  alt={`${person.name} portresi`}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Dark Gradient Overlay - Always visible for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Enhanced Hover Overlay */}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                <div className="p-12 bg-primary/5 rounded-full">
                  <User className="w-24 h-24 text-primary/30" />
                </div>
              </div>
            )}
            
            {/* Category Badge - Top Right */}
            <div className="absolute top-4 right-4">
              <Badge 
                variant="default" 
                className="bg-primary/95 hover:bg-primary text-black font-bold px-4 py-2 text-sm backdrop-blur-xl border-0 shadow-lg shadow-primary/30"
              >
                {person.category.name}
              </Badge>
            </div>

            {/* Age Badge - Top Left */}
            {age && (
              <div className="absolute top-4 left-4">
                <Badge 
                  variant="secondary"
                  className="bg-black/70 hover:bg-black/80 backdrop-blur-xl border border-white/20 text-white font-bold"
                >
                  {age} yaşında
                </Badge>
              </div>
            )}

            {/* Arrow Icon - Bottom Right */}
            <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              <ArrowUpRight className="w-5 h-5 text-primary" />
            </div>

            {/* Name Overlay - Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-4">
              <h3 
                className="font-bold text-2xl text-white drop-shadow-2xl line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors duration-300" 
                data-testid={`text-person-name-${person.id}`}
              >
                {person.name}
              </h3>
              
              <div className="flex items-center gap-2 text-white/90 drop-shadow-lg">
                <Briefcase className="w-4 h-4 flex-shrink-0 text-primary/90" />
                <span className="font-semibold text-sm line-clamp-1">{capitalize(person.profession.name)}</span>
              </div>
            </div>
          </div>
          
          {/* Info Footer Section */}
          <div className="relative p-5 pt-4 bg-gradient-to-b from-black/50 to-black/80 backdrop-blur-sm border-t border-white/5 space-y-3 flex-1">
            
            {/* Location */}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary/80 flex-shrink-0" />
              <span className="text-zinc-300 font-medium">{person.country.name}</span>
            </div>
            
            {/* Dates */}
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
              <div className="flex items-center gap-2 font-mono text-zinc-400">
                <span>{formatDate(person.birthDate)}</span>
                <span className="text-primary">→</span>
                <span>{formatDate(person.deathDate)}</span>
              </div>
            </div>

            {/* Death Cause - if available */}
            {person.deathCause && (
              <div className="pt-3 border-t border-white/5">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {capitalize(person.deathCause.name)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Skeleton component for loading state
export function PersonCardSkeleton() {
  return (
    <div className="relative h-full flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/50 to-black/50 border border-white/5 backdrop-blur-xl animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/5] bg-zinc-800/50">
        <div className="absolute top-4 right-4 h-9 w-24 bg-zinc-700/50 rounded-full" />
        <div className="absolute top-4 left-4 h-9 w-28 bg-zinc-700/50 rounded-xl" />
        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <div className="h-8 bg-zinc-700/50 rounded-lg w-3/4" />
          <div className="h-5 bg-zinc-700/50 rounded-lg w-1/2" />
        </div>
      </div>
      
      {/* Info Footer Skeleton */}
      <div className="p-5 pt-4 bg-gradient-to-b from-black/50 to-black/80 space-y-3 flex-1">
        <div className="h-4 bg-zinc-700/50 rounded w-2/3" />
        <div className="h-3 bg-zinc-700/50 rounded w-1/2" />
        <div className="pt-3 border-t border-white/5">
          <div className="h-3 bg-zinc-700/50 rounded w-full" />
        </div>
      </div>
    </div>
  );
}
