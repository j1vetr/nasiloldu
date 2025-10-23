import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
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
      <Card className="overflow-hidden hover-elevate transition-all duration-200 h-full">
        <div className="aspect-square relative bg-muted">
          {person.imageUrl ? (
            <img
              src={person.imageUrl}
              alt={`${person.name} portresi`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-20 h-20 text-primary/20" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="default" className="bg-primary/90 text-primary-foreground">
              {person.category.name}
            </Badge>
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg text-primary line-clamp-1" data-testid={`text-person-name-${person.id}`}>
            {person.name}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-1">
            {person.profession.name} • {person.country.name}
          </p>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              <span className="font-mono">{formatDate(person.birthDate)}</span>
              {" - "}
              <span className="font-mono">{formatDate(person.deathDate)}</span>
              {age && <span className="ml-1">({age} yaşında)</span>}
            </p>
            {person.deathCause && (
              <p className="line-clamp-1">
                Ölüm Nedeni: <span className="text-foreground">{person.deathCause.name}</span>
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
