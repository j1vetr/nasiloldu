import { useQuery } from "@tanstack/react-query";
import { PersonCard, PersonCardSkeleton } from "@/components/PersonCard";
import { Calendar } from "lucide-react";
import type { PersonWithRelations } from "@shared/schema";

export default function TodayPage() {
  const { data: persons, isLoading } = useQuery<PersonWithRelations[]>({
    queryKey: ["/api/persons/today"],
  });

  const today = new Date();
  const formattedDate = today.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-primary" />
            <h1 className="text-2xl md:text-4xl font-bold text-foreground">
              Bugün Ölenler
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {formattedDate} tarihinde vefat eden ünlüler
          </p>
          {persons && (
            <p className="text-sm text-muted-foreground mt-2">
              {persons.length} kişi bulundu
            </p>
          )}
        </div>

        {isLoading ? (
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
            <Calendar className="w-16 h-16 mx-auto mb-4 text-primary/20" />
            <p className="text-lg">Bugün ölen ünlü kaydı bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </div>
  );
}
