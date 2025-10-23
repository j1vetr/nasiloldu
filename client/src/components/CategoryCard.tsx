import { Link } from "wouter";
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

const categoryColors = {
  hastalik: "from-red-500/20 to-red-500/5",
  kaza: "from-orange-500/20 to-orange-500/5",
  intihar: "from-purple-500/20 to-purple-500/5",
  suikast: "from-blue-500/20 to-blue-500/5",
};

const categoryIconBg = {
  hastalik: "bg-red-500/10",
  kaza: "bg-orange-500/10",
  intihar: "bg-purple-500/10",
  suikast: "bg-blue-500/10",
};

const categoryIconColor = {
  hastalik: "text-red-400",
  kaza: "text-orange-400",
  intihar: "text-purple-400",
  suikast: "text-blue-400",
};

export function CategoryCard({ category, count }: CategoryCardProps) {
  const Icon = categoryIcons[category.slug as keyof typeof categoryIcons] || HeartPulse;
  const gradientColor = categoryColors[category.slug as keyof typeof categoryColors] || categoryColors.hastalik;
  const iconBgColor = categoryIconBg[category.slug as keyof typeof categoryIconBg] || categoryIconBg.hastalik;
  const iconColor = categoryIconColor[category.slug as keyof typeof categoryIconColor] || categoryIconColor.hastalik;

  return (
    <Link href={`/kategori/${category.slug}`} data-testid={`card-category-${category.slug}`}>
      <div className="group relative h-full">
        {/* Glass Card with Category Color */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} backdrop-blur-md rounded-2xl border border-white/10 group-hover:border-primary/40 group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-300`} />
        
        <div className="relative p-8 h-full flex flex-col items-center text-center space-y-5">
          {/* Icon */}
          <div className="relative">
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className={`relative w-20 h-20 rounded-2xl ${iconBgColor} flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`w-10 h-10 ${iconColor}`} />
            </div>
          </div>
          
          {/* Title and Count */}
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="font-bold text-2xl text-white mb-2 group-hover:text-primary transition-colors duration-300">
              {category.name}
            </h3>
            {count !== undefined && (
              <p className="text-sm font-mono text-zinc-400">
                {count} kişi
              </p>
            )}
          </div>
          
          {/* Description */}
          {category.description && (
            <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
              {category.description}
            </p>
          )}

          {/* Arrow Indicator */}
          <div className="mt-auto pt-2">
            <div className="text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
              <span>Keşfet</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
