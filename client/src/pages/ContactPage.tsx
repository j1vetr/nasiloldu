import { Card } from "@/components/ui/card";
import { Mail, MessageSquare, Globe } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6" data-testid="text-page-title">
          İletişim
        </h1>

        <div className="space-y-6">
          <Card className="p-6">
            <p className="text-base text-foreground leading-relaxed mb-6">
              nasiloldu.net platformu hakkında sorularınız, önerileriniz veya geri bildirimleriniz 
              için bizimle iletişime geçebilirsiniz.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">E-posta</h2>
                  <p className="text-base text-foreground">
                    <a href="mailto:iletisim@nasiloldu.net" className="text-primary hover:underline">
                      iletisim@nasiloldu.net
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">Geri Bildirim</h2>
                  <p className="text-base text-foreground leading-relaxed">
                    Platformumuzda gördüğünüz herhangi bir hata, eksik bilgi veya iyileştirme 
                    öneriniz varsa lütfen bize bildirin. Tüm geri bildirimler değerlendirilmektedir.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">Veri Kaynağı</h2>
                  <p className="text-base text-foreground leading-relaxed">
                    Platformumuzda kullanılan tüm veriler{" "}
                    <a 
                      href="https://www.wikidata.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Wikidata
                    </a>
                    {" "}kaynaklıdır. Veri doğruluğu ile ilgili sorunlar için öncelikle Wikidata 
                    üzerinden düzeltme yapabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <h2 className="text-lg font-semibold text-foreground mb-3">Çalışma Saatleri</h2>
            <p className="text-base text-foreground">
              E-posta yoluyla gönderilen mesajlarınıza en kısa sürede dönüş yapmaya çalışıyoruz. 
              Genellikle 24-48 saat içinde yanıt verilmektedir.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
