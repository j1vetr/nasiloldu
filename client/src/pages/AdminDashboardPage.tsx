import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Layers, MapPin, Briefcase, TrendingUp, Calendar } from "lucide-react";

interface DashboardStats {
  totalPersons: number;
  totalCategories: number;
  totalCountries: number;
  totalProfessions: number;
  recentPersons: number;
  todayDeaths: number;
}

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
  });

  const statCards = [
    {
      title: "Toplam Kişi",
      value: stats?.totalPersons || 0,
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Kategoriler",
      value: stats?.totalCategories || 0,
      icon: Layers,
      color: "text-blue-500",
    },
    {
      title: "Ülkeler",
      value: stats?.totalCountries || 0,
      icon: MapPin,
      color: "text-green-500",
    },
    {
      title: "Meslekler",
      value: stats?.totalProfessions || 0,
      icon: Briefcase,
      color: "text-purple-500",
    },
    {
      title: "Son Eklenenler",
      value: stats?.recentPersons || 0,
      icon: TrendingUp,
      color: "text-orange-500",
    },
    {
      title: "Bugün Ölenler",
      value: stats?.todayDeaths || 0,
      icon: Calendar,
      color: "text-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <Button variant="outline" onClick={() => setLocation("/")}>Siteye Dön</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Hızlı İşlemler</h2>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                data-testid="button-manage-persons"
                onClick={() => setLocation("/admin/persons")}
              >
                <Users className="w-4 h-4 mr-2" />
                Kişi Yönetimi
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setLocation("/admin/categories")}
              >
                <Layers className="w-4 h-4 mr-2" />
                Kategori Yönetimi
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setLocation("/admin/import")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Veri İçe Aktarma
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Sistem Bilgileri</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Veri Kaynağı:</span>
                <span className="text-foreground font-medium">Wikidata</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform:</span>
                <span className="text-foreground font-medium">nasiloldu.net</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Durum:</span>
                <span className="text-green-500 font-medium">Aktif</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
