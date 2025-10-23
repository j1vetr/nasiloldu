import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { HeartPulse, Car, HeartCrack, Target } from "lucide-react";
import type { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
  count?: number;
}

const categoryIcons = {
  hastalik: HeartPulse,
  kaza: Car,
  intihar: HeartCrack,
  suikast: Target,
};

export function CategoryCard({ category, count }: CategoryCardProps) {
  const Icon = categoryIcons[category.slug as keyof typeof categoryIcons] || HeartPulse;

  return (
    <Link href={`/kategori/${category.slug}`} data-testid={`card-category-${category.slug}`}>
      <Card className="p-6 hover-elevate transition-all duration-200 h-full">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          
          <div>
            <h3 className="font-semibold text-xl text-foreground mb-1">
              {category.name}
            </h3>
            {count !== undefined && (
              <p className="text-sm text-muted-foreground">
                {count} kişi
              </p>
            )}
          </div>
          
          {category.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {category.description}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
