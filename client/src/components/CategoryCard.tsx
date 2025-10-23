import { Link } from "wouter";
import { HeartPulse, Car, HeartCrack, Target, ArrowRight } from "lucide-react";
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
  hastalik: "from-red-500/20 via-red-500/10 to-transparent",
  kaza: "from-orange-500/20 via-orange-500/10 to-transparent",
  intihar: "from-purple-500/20 via-purple-500/10 to-transparent",
  suikast: "from-blue-500/20 via-blue-500/10 to-transparent",
};

const categoryBorderColors = {
  hastalik: "border-red-500/20 group-hover:border-red-500/50",
  kaza: "border-orange-500/20 group-hover:border-orange-500/50",
  intihar: "border-purple-500/20 group-hover:border-purple-500/50",
  suikast: "border-blue-500/20 group-hover:border-blue-500/50",
};

const categoryIconBg = {
  hastalik: "bg-red-500/10 group-hover:bg-red-500/20",
  kaza: "bg-orange-500/10 group-hover:bg-orange-500/20",
  intihar: "bg-purple-500/10 group-hover:bg-purple-500/20",
  suikast: "bg-blue-500/10 group-hover:bg-blue-500/20",
};

const categoryIconColor = {
  hastalik: "text-red-400 group-hover:text-red-300",
  kaza: "text-orange-400 group-hover:text-orange-300",
  intihar: "text-purple-400 group-hover:text-purple-300",
  suikast: "text-blue-400 group-hover:text-blue-300",
};

export function CategoryCard({ category, count }: CategoryCardProps) {
  const Icon = categoryIcons[category.slug as keyof typeof categoryIcons] || HeartPulse;
  const gradientColor = categoryColors[category.slug as keyof typeof categoryColors] || categoryColors.hastalik;
  const borderColor = categoryBorderColors[category.slug as keyof typeof categoryBorderColors] || categoryBorderColors.hastalik;
  const iconBgColor = categoryIconBg[category.slug as keyof typeof categoryIconBg] || categoryIconBg.hastalik;
  const iconColor = categoryIconColor[category.slug as keyof typeof categoryIconColor] || categoryIconColor.hastalik;

  return (
    <Link href={`/kategori/${category.slug}`} data-testid={`card-category-${category.slug}`}>
      <div className="group relative h-full min-h-[200px] hover-elevate active-elevate-2">
        {/* Main Card Container */}
        <div className={`relative h-full flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${gradientColor} backdrop-blur-xl border ${borderColor} transition-all duration-500 group-hover:shadow-2xl`}>
          
          <div className="relative p-8 h-full flex flex-col items-center text-center space-y-6">
            
            {/* Icon with Glow Effect */}
            <div className="relative">
              {/* Animated Glow on Hover */}
              <div className="absolute inset-0 bg-primary/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 scale-150" />
              
              <div className={`relative w-24 h-24 rounded-3xl ${iconBgColor} flex items-center justify-center backdrop-blur-sm border border-white/5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                <Icon className={`w-12 h-12 ${iconColor} transition-all duration-500`} />
              </div>
            </div>
            
            {/* Title and Count */}
            <div className="flex-1 flex flex-col justify-center space-y-2">
              <h3 className="font-bold text-2xl md:text-3xl text-white group-hover:text-primary transition-colors duration-300">
                {category.name}
              </h3>
              
              {count !== undefined && (
                <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-sm rounded-full border border-white/10">
                  <span className="text-2xl font-bold text-primary">{count}</span>
                  <span className="text-sm text-zinc-400 font-medium">kişi</span>
                </div>
              )}
            </div>
            
            {/* Description */}
            {category.description && (
              <p className="text-sm text-zinc-300 line-clamp-2 leading-relaxed max-w-xs">
                {category.description}
              </p>
            )}

            {/* Explore Button - Bottom */}
            <div className="mt-auto pt-4">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0 translate-y-2">
                <span>Keşfet</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
