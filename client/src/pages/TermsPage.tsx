import { Card } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Kullanım Şartları - nasiloldu.net"
        description="nasiloldu.net kullanım şartları. Platform kullanım kuralları ve koşulları."
        canonical="https://nasiloldu.net/kullanim-sartlari"
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6" data-testid="text-page-title">
          Kullanım Şartları
        </h1>

        <Card className="p-6 md:p-8">
          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Genel Hükümler</h2>
              <p className="text-base text-foreground leading-relaxed">
                nasiloldu.net platformunu kullanarak aşağıdaki kullanım şartlarını kabul etmiş sayılırsınız. 
                Bu şartları kabul etmiyorsanız, lütfen platformu kullanmayınız.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Hizmetin Kapsamı</h2>
              <p className="text-base text-foreground leading-relaxed">
                nasiloldu.net, Wikidata verilerine dayalı olarak ünlülerin ölüm bilgilerini sunan 
                bir bilgi platformudur. Platform üzerindeki tüm bilgiler bilgilendirme amaçlıdır 
                ve herhangi bir garanti içermez.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Fikri Mülkiyet Hakları</h2>
              <p className="text-base text-foreground leading-relaxed mb-3">
                Platform üzerindeki içerikler aşağıdaki şekilde lisanslanmıştır:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-foreground ml-4">
                <li>Kişi bilgileri ve görseller: Wikidata ve Wikimedia Commons (CC BY-SA 4.0)</li>
                <li>Platform tasarımı ve kodu: nasiloldu.net</li>
                <li>Kullanıcı arayüzü: Tüm hakları saklıdır</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Kullanıcı Sorumlulukları</h2>
              <p className="text-base text-foreground leading-relaxed mb-3">
                Platform kullanıcıları olarak aşağıdaki kurallara uymayı kabul edersiniz:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-foreground ml-4">
                <li>Platformu yasa dışı amaçlarla kullanmamak</li>
                <li>Platformun güvenliğini tehlikeye atacak eylemlerden kaçınmak</li>
                <li>Diğer kullanıcıların haklarına saygı göstermek</li>
                <li>Platform üzerindeki bilgileri izinsiz kopyalamamak veya dağıtmamak</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Sorumluluk Reddi</h2>
              <p className="text-base text-foreground leading-relaxed">
                nasiloldu.net, platform üzerinde sunulan bilgilerin doğruluğu, güncelliği veya 
                eksiksizliği konusunda herhangi bir garanti vermemektedir. Tüm bilgiler Wikidata 
                kaynaklıdır ve "olduğu gibi" sunulmaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Gizlilik</h2>
              <p className="text-base text-foreground leading-relaxed">
                Kişisel verilerinizin işlenmesi hakkında detaylı bilgi için{" "}
                <a href="/kvkk" className="text-primary hover:underline">KVKK Aydınlatma Metni</a>
                {" "}sayfamızı inceleyebilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Değişiklikler</h2>
              <p className="text-base text-foreground leading-relaxed">
                nasiloldu.net, bu kullanım şartlarını önceden haber vermeksizin değiştirme hakkını 
                saklı tutar. Güncel kullanım şartları her zaman bu sayfada yayınlanacaktır.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Uygulanacak Hukuk</h2>
              <p className="text-base text-foreground leading-relaxed">
                Bu kullanım şartları Türkiye Cumhuriyeti kanunlarına tabidir. Herhangi bir uyuşmazlık 
                durumunda Türkiye mahkemeleri ve icra daireleri yetkilidir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. İletişim</h2>
              <p className="text-base text-foreground leading-relaxed">
                Kullanım şartları hakkında sorularınız için{" "}
                <a href="/iletisim" className="text-primary hover:underline">iletişim sayfamızı</a>
                {" "}ziyaret edebilirsiniz.
              </p>
            </section>

            <section className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Son güncelleme: {new Date().toLocaleDateString("tr-TR")}
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
