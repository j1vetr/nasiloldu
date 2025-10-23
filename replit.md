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
- Admin paneli geliştirmeleri (veri içe aktarma, onay kuyruğu)
- Ek Schema.org varyantları (Country, Profession schemas)
- twitter:url meta tag ekleme (absolute parity için)

## Geliştirme Notları
- Tüm içerikler Türkçe
- Wikipedia tarzı ansiklopedik anlatım
- Wikidata QID ile veri tekilleştirme (duplicate prevention)
- Her kişiye zorunlu ülke ve meslek ataması
- Eksik bilgiler "Bilinmiyor" olarak gösterilir
- Türkçe capitalization (i→İ) için shared utils fonksiyonu

## Mevcut Veri Durumu
**Toplam: 124 kişi**
- **Hastalık**: 84 kişi
- **Suikast**: 31 kişi
- **Kaza**: 8 kişi
- **İntihar**: 1 kişi

**Kategorilere Göre Dağılım:**
- **Türk Siyasetçiler (25)**: 9 Cumhurbaşkanı + 16 Başbakan
- **Gazeteciler/Yazarlar (9)**: Uğur Mumcu, Hrant Dink, Abdi İpekçi, Çetin Emeç, Metin Göktepe, Nilgün Marmara, Savaş Ay, Sebahattin Ali, Hasan Fehmi Bey
- **Akademisyenler (6)**: Ahmet Taner Kışlalı, Bahriye Üçok, Muammer Aksoy, Necip Hablemitoğlu, Cavit Orhan Tütengil, Bedri Karafakioğlu
- **Sanatçılar (8)**: Kemal Sunal, Ayhan Işık, Barış Akarsu, Kazım Koyuncu, Cenk Koray, Kerim Tekin, Onur Şener
- **Sendikacı/Aktivist (4)**: Kemal Türkler, Ali İsmail Korkmaz, Ethem Sarısülük, Gaffar Okkan
- **Tarihsel Figürler (32)**: Cumhuriyet dönemi askerler, diplomatlar, yazarlar, akademisyenler (Fevzi Çakmak, Kâzım Karabekir, Halide Edib Adıvar, Yakup Kadri Karaosmanoğlu, Halil İnalcık, vb.)
- **Diğer (40)**: Hikmet Kıvılcımlı, Turan Dursun, vb.

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
- ✅ Ülkeler sayfası (/ulkeler) eklendi - 45 ülke listelenebilir
- ✅ Navbar'a "Ülkeler" menüsü eklendi
- ✅ Ülke bayrakları entegrasyonu (country-flag-icons) - SVG bayraklar
- ✅ 107 meslek Türkçe'ye çevrildi (Actor→Oyuncu, Musician→Müzisyen)
- ✅ 27 ülke Türkçe'ye çevrildi (United States→Amerika Birleşik Devletleri)
- ✅ Slug optimizasyonu: tek harfli kelimeler birleştirildi (e-h→eh)
- ✅ Favicon güncellendi (favcion nsl_1761255172919.png)
- ✅ **Tarih formatı bug fix** (23 Ekim 2025 - Gece):
  - Problem: "30T00:00:00Z.04.1945" gibi bozuk tarih formatları
  - Çözüm: UTC accessor'ları kullanarak timezone-bağımsız formatDate/formatTurkishDate fonksiyonları
  - Merkezileştirilmiş shared/utils.ts'de tanımlandı
  - Tüm sayfalarda tutarlı kullanım (PersonDetailPage, HomePage, PersonCard)
  - NaN validation + "Bilinmiyor" fallback

### Devrimsel Hero ve AJAX Arama Güncellemesi (23 Ekim 2025 - Gece)
- ✅ **Hero Başlık Fix**: Ö harfi kesik problemi düzeltildi (lineHeight: 1.25)
- ✅ **Yeni Hero Tasarımı**: 
  - Animated glow orbs (pulse animasyonlar)
  - Radial grid pattern background
  - İki parçalı gradient başlık (beyaz "Ünlü Kişiler" + sarı "Nasıl Öldü?")
  - Minimal tasarım (badge ve subtitle kaldırıldı)
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
- ✅ **Scroll-to-Top Fix**:
  - ScrollToTop component (useLayoutEffect ile)
  - window.history.scrollRestoration = 'manual' (browser native scroll hatırlamayı devre dışı bıraktı)
  - Tüm navigasyonlarda (ileri, geri, link, kart) scroll pozisyonu sıfırlanır
  - Browser back button ile geri dönünce bile scroll en üstte açılır
- ✅ **AJAX Arama Bug Fix (Türkçe Karakter Desteği)**:
  - PostgreSQL unaccent extension startup'ta otomatik enable ediliyor
  - searchPersons() fonksiyonu: `unaccent(name) ILIKE unaccent(query)` 
  - Türkçe karakterler normalize ediliyor (ü→u, ş→s, ö→o, ç→c, İ→i, ğ→g)
  - "sünal" → "Kemal Sunal" bulunur
  - "atatürk" → "Mustafa Kemal Atatürk" bulunur
  - "bud" → "Bud Abbott" bulunur (case-insensitive)
  - Frontend zaten encodeURIComponent() kullanıyor (URL encoding)

### Kapsamlı SEO Implementasyonu (23 Ekim 2025 - Sabah)
- ✅ **index.html Base SEO Tags**:
  - Meta tags (title, description, keywords, robots, googlebot, bingbot)
  - Open Graph tags (og:type, og:url, og:title, og:description, og:image, og:site_name, og:locale)
  - Twitter Cards (twitter:card, twitter:title, twitter:description, twitter:image)
  - Canonical URL
  - Schema.org WebSite JSON-LD with SearchAction
  - Hreflang tags (tr, x-default)
  - Language & Geo tags (Turkish, TR)
  - Publisher meta tag
  - Google Analytics 4 ve Search Console placeholders
- ✅ **11 Sayfa SEOHead Component Kullanımı**:
  - HomePage: WebSite schema (236+ ünlü kişi vurgusu)
  - CategoryPage: CollectionPage schema (dinamik kategori verileri)
  - CountryPage: Dinamik ülke bazlı SEO
  - ProfessionPage: Dinamik meslek bazlı SEO
  - TodayPage: Dinamik tarih bazlı SEO (ölüm yıldönümleri)
  - SearchPage: Koşullu SEO (arama sorgusuna göre)
  - AboutPage, ContactPage, KVKKPage, TermsPage, CategoriesPage: Statik SEO
- ✅ **SEO Altyapısı Doğrulama**:
  - sitemap.xml: 399 URL (statik sayfalar, kategoriler, ülkeler, meslekler, kişiler)
  - robots.txt: Sitemap referansı + admin disallow + bot-specific rules
  - Tüm sayfalar canonical URLs ile
  - SSR Meta Tag Injection: Crawler detection middleware (Googlebot, Bingbot, etc.)
  - Breadcrumb Schema.org (BreadcrumbList) - PersonDetailPage
  - Array schema support (multiple JSON-LD schemas per page)
  - Image alt tags verified (PersonCard, PersonDetailPage)
  - Lazy loading implemented (loading="lazy")
- ✅ **Performance Optimizations**:
  - Compression middleware (gzip/deflate, threshold 1KB, level 6)
  - Cache headers (static assets: 1 year immutable, HTML: 1 hour revalidate)
  - DNS prefetch (fonts.googleapis.com, fonts.gstatic.com)
  - Font display swap (performance)
  - Resource hints (preconnect)

### 32 Yeni Tarihsel Figür Eklendi (23 Ekim 2025 - Öğleden Sonra)
- ✅ **Wikipedia Full Text Extraction Script**: Minimum 500 kelime açıklama ile
- ✅ **32 Cumhuriyet Dönemi Tarihsel Figürü**:
  - Askerler: Fevzi Çakmak, Kâzım Karabekir, Ali Fuat Cebesoy, Fahrettin Altay, Kâzım Özalp, Cemal Madanoğlu
  - Diplomatlar: Rauf Orbay, Fatin Rüştü Zorlu, Tevfik Rüştü Aras, İhsan Sabri Çağlayangil, Kâzım Dirik
  - Siyasetçiler: Hasan Polatkan, Nuri Conker, Mahmut Esat Bozkurt, Ahmet Fikri Tüzer, Turan Güneş, Falih Rıfkı Atay, Hamdullah Suphi Tanrıöver, İsmet Sezgin, Rauf Denktaş, Turhan Feyzioğlu
  - Yazarlar: Halide Edib Adıvar, Yakup Kadri Karaosmanoğlu, Şevket Süreyya Aydemir, Yunus Nadi Abalıoğlu, Hasan Âli Yücel
  - Akademisyenler/Bilim İnsanları: Ziya Gökalp, Enver Ziya Karal, Ekrem Akurgal (arkeolog), Halil İnalcık (tarihçi)
  - Diğer: Sabiha Gökçen (pilot), Fazıl Küçük (gazeteci)
- ✅ **Wikipedia Başlık Düzeltmeleri**: "Kazım" → "Kâzım" (â harfi), "Edip" → "Edib"
- ✅ **Turhan Feyzioğlu Özel Ekleme**: Türkçe Wikipedia sayfası olmadığı için biyografya.com'dan 519 kelimelik detaylı biyografi
- ✅ **Yeni Meslekler**: arkeolog, tarihçi
- ✅ **Toplam Veri**: 92 → 124 kişi (32 yeni ekleme)
- ✅ **Kategori Dağılımı Güncellendi**: Hastalık 42 → 84 (+42)
- ✅ **Slug Generation Fix**: createSlug fonksiyonları â, î, û, İ karakterlerini doğru handle ediyor
- ✅ **Slug Database Cleanup**: Yanlış slug'lar düzeltildi (Kâzım Karabekir → kazim-karabekir, vb.)

### 🚀 Production-Ready SEO Implementation (23 Ekim 2025 - Final)
- ✅ **Sitemap.xml**: 343 URL (statik sayfalar + kategoriler + ülkeler + meslekler + 236 kişi)
  - Profession limit kaldırıldı (tüm meslekler dahil)
  - Dynamic sitemap generation
  - Priority ve changefreq optimizasyonu
- ✅ **Robots.txt**: Bot-specific rules + sitemap referansı
  - /admin/ ve /api/ disallow
  - Arama sayfaları parametreli URL'leri disallow
- ✅ **SSR Meta Injection Middleware**:
  - Crawler detection (Googlebot, Bingbot, Yandex, DuckDuckBot, vb.)
  - Duplicate meta tag prevention (regex-based cleanup)
  - og:image ve twitter:image deduplication
  - Dinamik title, description, og tags, twitter cards
  - Canonical URL injection
  - Schema.org JSON-LD injection (Person, BreadcrumbList)
- ✅ **Enhanced index.html SEO**:
  - Hreflang tags (tr, x-default)
  - Geo ve language meta tags (Turkish, TR)
  - Publisher meta tag
  - Extended keywords (236+ celebrity names)
  - Google Analytics 4 ve Search Console placeholders
  - WebSite Schema.org with SearchAction
- ✅ **Performance Optimizations**:
  - Compression middleware (gzip/deflate, threshold 1KB, level 6)
  - Cache headers (static assets: 1 year immutable, HTML: 1 hour revalidate)
  - DNS prefetch (fonts.googleapis.com, fonts.gstatic.com)
  - Font display swap
  - Resource hints (preconnect)
- ✅ **Image SEO**:
  - Alt tags verified (PersonCard, PersonDetailPage)
  - Lazy loading implemented (loading="lazy")
  - Wikidata image URLs (high-quality portraits)
- ✅ **Breadcrumb Schema**: PersonDetailPage'de BreadcrumbList JSON-LD
- ✅ **SEOHead Component**: Array schema support (multiple JSON-LD per page)
- ✅ **File Extension Skip**: SSR middleware asset requests bypass ediyor
- ✅ **Production-Ready**: Full Google-first SEO optimization tamamlandı

### 📊 Google-First SEO Title Standardization (23 Ekim 2025 - Final)
- ✅ **Title Format Standardı**: Tüm sayfalarda `[İçerik] | nasiloldu.net` formatı (Google best practices)
- ✅ **Frontend SEO (Client-Side)**:
  - PersonDetailPage: `{isim} Nasıl Öldü? | nasiloldu.net`
  - CategoryPage: `{kategori} Nedeniyle Ölen Ünlüler | nasiloldu.net`
  - CountryPage: `{ülke} Ünlüleri Nasıl Öldü? | nasiloldu.net`
  - ProfessionPage: `{meslek} Ünlüleri Nasıl Öldü? | nasiloldu.net`
  - HomePage: `Ünlü Kişiler Nasıl Öldü? | nasiloldu.net`
  - TodayPage: `Bugün Ölen Ünlüler - Ölüm Yıldönümleri | nasiloldu.net`
  - SearchPage: Koşullu title (`{query} Arama Sonuçları | nasiloldu.net` veya default)
- ✅ **SSR Meta Injection (Crawler-Side)**:
  - server/seo/meta-inject.ts'de tüm title formatları frontend ile sync
  - Crawler'lar (Googlebot, Bingbot, vb.) için production'da dinamik meta tag injection
  - Development mode: Vite middleware SSR'ı engeller (normal), client-side SEOHead çalışır
  - Production mode: SSR middleware crawler detection ile otomatik devreye girer
- ✅ **index.html Static Fallback**:
  - Title, description, og tags, twitter cards güncel formatta
  - Noscript content güncellendi (236+ kişi)
  - Schema.org WebSite JSON-LD güncel description ile
- ✅ **SEOHead Component Enhancement**:
  - ogImage prop eklendi (dinamik Open Graph resim desteği)
  - Tüm sayfalarda backend verisi ile dinamik SEO
- ✅ **Description Optimization**:
  - PersonDetailPage: Wikipedia description'ı (155 karakter) + fallback
  - Her sayfa için SEO-optimized, 150-160 karakter descriptions
  - Türkçe keywords güncellendi ("nasıl öldü", "vefat edenler", vb.)
- ✅ **Google Parity**: Sayfada ne görünüyorsa Google da aynısını görüyor (SSR + client-side SEO sync)
