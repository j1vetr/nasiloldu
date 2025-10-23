import { Card } from "@/components/ui/card";

export default function KVKKPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6" data-testid="text-page-title">
          KVKK Aydınlatma Metni
        </h1>

        <Card className="p-6 md:p-8">
          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Veri Sorumlusu</h2>
              <p className="text-base text-foreground leading-relaxed">
                6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz 
                veri sorumlusu sıfatıyla nasiloldu.net tarafından aşağıda açıklanan kapsamda işlenebilecektir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Kişisel Verilerin İşlenme Amacı</h2>
              <p className="text-base text-foreground leading-relaxed mb-3">
                Platformumuzda toplanan kişisel veriler aşağıdaki amaçlarla işlenmektedir:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-foreground ml-4">
                <li>Platform hizmetlerinin sunulması ve iyileştirilmesi</li>
                <li>Kullanıcı deneyiminin geliştirilmesi</li>
                <li>İstatistiksel analizler yapılması</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. İşlenen Kişisel Veriler</h2>
              <p className="text-base text-foreground leading-relaxed">
                nasiloldu.net olarak, kullanıcılarımızdan minimum düzeyde veri toplamaktayız. 
                Platform üzerinde gezinirken IP adresi, tarayıcı bilgisi ve çerez verileri gibi 
                teknik bilgiler otomatik olarak toplanabilir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Kişisel Verilerin Aktarılması</h2>
              <p className="text-base text-foreground leading-relaxed">
                Toplanan kişisel verileriniz, KVKK'nın 8. ve 9. maddelerinde belirtilen şartlara uygun 
                olarak yurt içinde veya yurt dışında bulunan üçüncü kişilere aktarılabilir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Veri Güvenliği</h2>
              <p className="text-base text-foreground leading-relaxed">
                Kişisel verilerinizin güvenliği bizim için önemlidir. Verilerinizi korumak için 
                gerekli teknik ve idari tedbirleri almaktayız.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Kişisel Veri Sahibinin Hakları</h2>
              <p className="text-base text-foreground leading-relaxed mb-3">
                KVKK'nın 11. maddesi uyarınca, kişisel veri sahipleri olarak aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-foreground ml-4">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Kişisel verilerin yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
                <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
                <li>KVKK'da öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. İletişim</h2>
              <p className="text-base text-foreground leading-relaxed">
                KVKK kapsamındaki taleplerinizi{" "}
                <a href="mailto:kvkk@nasiloldu.net" className="text-primary hover:underline">
                  kvkk@nasiloldu.net
                </a>
                {" "}adresine e-posta göndererek iletebilirsiniz.
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
