import { Card } from "@/components/ui/card";
import { Info, Database, Shield, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6" data-testid="text-page-title">
          Hakkımızda
        </h1>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Nedir nasiloldu.net?</h2>
                <p className="text-base text-foreground leading-relaxed mb-4">
                  nasiloldu.net, dünya çapında tanınan ünlülerin ölüm bilgilerini kapsamlı bir şekilde 
                  sunan, Türkçe dilindeki en güncel ve güvenilir bilgi platformudur.
                </p>
                <p className="text-base text-foreground leading-relaxed">
                  Platformumuz, merak edilen ünlülerin hayatlarının son anlarına dair doğru ve detaylı 
                  bilgiler sunarak, kullanıcılarımızın tarih ve popüler kültür konusundaki meraklarını 
                  gidermeyi amaçlar.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Veri Kaynağımız</h2>
                <p className="text-base text-foreground leading-relaxed mb-4">
                  Tüm verilerimiz, dünyanın en büyük açık veri tabanı olan <strong>Wikidata</strong>'dan 
                  otomatik olarak çekilmektedir. Wikidata, Wikimedia Foundation tarafından desteklenen, 
                  topluluk tarafından düzenlenen ve sürekli güncellenen bir bilgi kaynağıdır.
                </p>
                <p className="text-base text-foreground leading-relaxed">
                  Bu sayede platformumuzda sunulan bilgilerin doğruluğu ve güncelliği en üst seviyede 
                  tutulmaktadır. Veriler düzenli olarak senkronize edilerek en son bilgilere erişiminiz 
                  sağlanır.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Güvenilirlik ve Tarafsızlık</h2>
                <p className="text-base text-foreground leading-relaxed mb-4">
                  nasiloldu.net olarak, ansiklopedik bir yaklaşım benimsiyoruz. Tüm içeriklerimiz 
                  tarafsız, objektif ve saygılı bir dille sunulmaktadır.
                </p>
                <p className="text-base text-foreground leading-relaxed">
                  Amacımız, popüler kültür ve tarih meraklılarına doğru bilgiye hızlı ve kolay bir 
                  şekilde ulaşmalarını sağlamaktır. Herhangi bir yanlış veya eksik bilgi fark ederseniz, 
                  lütfen bizimle iletişime geçin.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Sürekli Gelişim</h2>
                <p className="text-base text-foreground leading-relaxed">
                  Platformumuz sürekli olarak geliştirilmekte ve yeni özellikler eklenmektedir. 
                  Kullanıcı deneyimini iyileştirmek ve daha kapsamlı bilgiler sunmak için çalışmalarımız 
                  devam etmektedir.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
