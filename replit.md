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
- Wikidata QID ile veri tekilleştirme (duplicate prevention)
- Her kişiye zorunlu ülke ve meslek ataması
- Eksik bilgiler "Bilinmiyor" olarak gösterilir
- Türkçe capitalization (i→İ) için shared utils fonksiyonu

## Mevcut Veri Durumu
**Toplam: 63 kişi**
- **Hastalık**: 42 kişi
- **Suikast**: 19 kişi
- **Kaza**: 2 kişi

**Kategorilere Göre Dağılım:**
- **Türk Siyasetçiler (25)**: 9 Cumhurbaşkanı + 16 Başbakan
- **Gazeteciler/Yazarlar (9)**: Uğur Mumcu, Hrant Dink, Abdi İpekçi, Çetin Emeç, Metin Göktepe, Nilgün Marmara, Savaş Ay, Sebahattin Ali, Hasan Fehmi Bey
- **Akademisyenler (6)**: Ahmet Taner Kışlalı, Bahriye Üçok, Muammer Aksoy, Necip Hablemitoğlu, Cavit Orhan Tütengil, Bedri Karafakioğlu
- **Sanatçılar (8)**: Kemal Sunal, Ayhan Işık, Barış Akarsu, Kazım Koyuncu, Cenk Koray, Kerim Tekin, Onur Şener
- **Sendikacı/Aktivist (4)**: Kemal Türkler, Ali İsmail Korkmaz, Ethem Sarısülük, Gaffar Okkan
- **Diğer (11)**: Hikmet Kıvılcımlı, Turan Dursun, vb.

## Son Güncellemeler (23 Ekim 2025)
- ✅ Temel schema tanımlandı (PostgreSQL + Drizzle ORM)
- ✅ Sarı-siyah renk paleti uygulandı
- ✅ Tüm 14 frontend sayfası oluşturuldu (HomePage, PersonDetail, Categories, Category, Country, Profession, Today, Search, About, Contact, KVKK, Terms, Admin Login, Admin Dashboard)
- ✅ Layout componentler (Header, Footer) hazır
- ✅ Routing yapılandırıldı (wouter)
- ✅ Backend API endpoints tamamlandı
- ✅ Wikidata entegrasyonu tamamlandı (QID bazlı deduplication ile)
- ✅ SEO optimizasyonu tamamlandı (sitemap.xml, robots.txt, Schema.org JSON-LD)
- ✅ Link kullanımı düzeltildi (nested anchor problemi çözüldü)
- ✅ Capitalization bug düzeltildi (Türkçe locale desteği ile shared utils)
- ✅ 9 Türk cumhurbaşkanı başarıyla eklendi (Wikipedia açıklamaları ile)
- ✅ 16 Türk başbakanı başarıyla eklendi (Wikidata QID bazlı import)
- ✅ Wikidata QID doğrulaması yapıldı (yanlış QID'ler düzeltildi)
- ✅ Mobil responsive tasarım tamamlandı (Header Sheet menu, HomePage responsive breakpoints)
- ✅ Emoji'ler lucide-react icon'larla değiştirildi (universal_design_guidelines uyumu)
- ✅ 27 yeni kişi eklendi (19 suikast/cinayet kurbanı, 6 sanatçı, 2 diğer)
- ✅ categorizeDeathCause fonksiyonu Türkçe locale desteği ile güncellendi (toLocaleLowerCase('tr-TR'))
- ✅ Türkçe ölüm nedeni etiketleri eklendi (ateşli silah, bomba, kurşun, trafik kaza, vb.)
- ✅ Kategori dağılımı düzeltildi: Hastalık 42, Suikast 19, Kaza 2

### Devrimsel Hero ve AJAX Arama Güncellemesi (23 Ekim 2025 - Gece)
- ✅ **Hero Başlık Fix**: Ö harfi kesik problemi düzeltildi (lineHeight: 1.25)
- ✅ **Yeni Hero Tasarımı**: 
  - Animated glow orbs (pulse animasyonlar)
  - Radial grid pattern background
  - İki parçalı gradient başlık (beyaz "Ünlüler" + sarı "Nasıl Öldü?")
  - Sparkles badge ile Wikidata vurgusu
  - Modern stats pills (inline flex, glassmorphic)
  - Scroll indicator animasyonu
  - min-h-[75vh] yükseklik
- ✅ **AJAX Arama Sistemi**:
  - 3+ karakter yazınca otomatik dropdown
  - Gerçek zamanlı `/api/search?q={query}` sorgusu
  - Maksimum 8 sonuç gösterimi
  - Her sonuç: resim (14x14), isim, meslek+ülke, ölüm tarihi
  - Click-outside ile kapanma
  - Loading spinner ve empty state
  - Sonuca tıkla → /nasil-oldu/{slug} navigasyonu
- ✅ **Yeni Navbar Tasarımı**:
  - Logo entegrasyonu (@assets/logo nsl_1761194999380.png)
  - h-20 yükseklik
  - Siyah arka plan + backdrop-blur-xl
  - Ortalanmış navigasyon (desktop)
  - "Keşfet" CTA butonu (gradient sarı)
  - Mobile menüde logo görünümü
  - Active state: primary/10 bg + border
