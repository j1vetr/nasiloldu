# nasiloldu.net - Ünlüler Nasıl Öldü?

## Proje Özeti
Wikidata verilerine dayalı, tamamen Türkçe, kapsamlı ve güncel ünlü ölüm bilgileri platformu. Sarı-siyah renk paletli, modern ve SEO-optimizasyonlu bir bilgi platformu.

## Teknik Stack
- **Frontend**: React + Wouter (routing) + TanStack Query + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + Node.js
- **Veritabanı**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Veri Kaynağı**: Wikidata SPARQL API

## Proje Yapısı

### Frontend Sayfalar
- **/** - Ana sayfa (bugün ölenler, kategoriler, en çok arananlar)
- **/nasil-oldu/:slug** - Kişi detay sayfası
- **/kategori/:tip** - Kategori filtreleme (hastalık, kaza, intihar, suikast)
- **/ulke/:ulke-adi** - Ülke bazlı filtreleme
- **/meslek/:meslek-adi** - Meslek bazlı filtreleme
- **/bugun** - Bugün ölen ünlüler
- **/ara?q=** - Arama sonuçları
- **/hakkinda** - Hakkında sayfası
- **/iletisim** - İletişim sayfası
- **/kvkk** - KVKK aydınlatma metni
- **/kullanim-sartlari** - Kullanım şartları
- **/admin** - Admin giriş sayfası
- **/admin/dashboard** - Admin dashboard

### Veritabanı Şeması
- **admins** - Admin kullanıcılar (kullanıcı: toov, şifre: Toov1453@@)
- **categories** - Ölüm kategorileri (Hastalık, Kaza, İntihar, Suikast)
- **countries** - Ülkeler
- **professions** - Meslekler
- **death_causes** - Ölüm nedenleri
- **persons** - Kişiler (qid ile Wikidata'ya bağlı)

### Ana Özellikler
1. **Wikidata Entegrasyonu**: 500 kişilik başlangıç verisi (oyuncu ve politikacı öncelikli)
2. **Kategori Sistemi**: Her kişi bir kategoriye atanır (zorunlu)
3. **Filtreleme**: Ülke ve meslek bazlı filtreleme
4. **Arama**: Kişi adına göre arama
5. **İlgili Kişiler**: Her kişi sayfasında en az 6 ilgili kişi
6. **Admin Paneli**: PostgreSQL tabanlı kimlik doğrulama
7. **SEO Optimizasyonu**: Meta tags, Schema.org JSON-LD, sitemap, robots.txt

## Renk Paleti
- **Primary (Sarı)**: #FFD60A (45 100% 52%)
- **Background (Siyah)**: #000000 (0 0% 0%)
- **Tema**: Dark mode varsayılan

## Gelecek Özellikler
- Günlük otomatik Wikidata senkronizasyonu (cron job)
- Sitemap.xml otomatik üretimi
- robots.txt
- Schema.org JSON-LD markup
- Open Graph ve Twitter Cards
- Canonical URLs
- İç bağlantı sistemi
- Admin paneli geliştirmeleri (veri içe aktarma, onay kuyruğu)

## Geliştirme Notları
- Tüm içerikler Türkçe
- Wikipedia tarzı ansiklopedik anlatım
- Wikidata QID ile veri tekilleştirme
- Her kişiye zorunlu ülke ve meslek ataması
- Eksik bilgiler "Bilinmiyor" olarak gösterilir

## Son Güncellemeler
- ✅ Temel schema tanımlandı
- ✅ Sarı-siyah renk paleti uygulandı
- ✅ Tüm frontend sayfaları oluşturuldu
- ✅ Layout componentler (Header, Footer) hazır
- ✅ Routing yapılandırıldı
- ⏳ Backend API endpoints (beklemede)
- ⏳ Wikidata entegrasyonu (beklemede)
- ⏳ SEO optimizasyonu (beklemede)
