/**
 * Server-Side Rendering Functions
 * Bu dosya sayfa içeriklerini HTML olarak render eder
 */

import { storage } from "./storage";
import { formatTurkishDate } from "@shared/utils";

interface RenderResult {
  html: string;
  statusCode: number;
}

/**
 * Footer HTML (SSR için statik)
 */
function renderFooter(): string {
  const currentYear = new Date().getFullYear();
  
  return `
    <footer class="relative border-t border-border/50 bg-gradient-to-b from-card to-background mt-auto">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
      
      <div class="container mx-auto px-4 py-12 relative">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <!-- Brand Section -->
          <div class="space-y-4">
            <a href="/" class="inline-flex items-center gap-3 group text-2xl font-bold text-primary">
              nasiloldu.net
            </a>
            
            <p class="text-sm text-muted-foreground leading-relaxed">
              Türkiye'nin en kapsamlı ünlü biyografi ve ölüm bilgileri platformu. 
              236+ ünlü kişinin hayat hikayesini ve vefat detaylarını keşfedin.
            </p>
            
            <div class="flex items-center gap-2 text-xs text-muted-foreground/70">
              <div class="w-2 h-2 rounded-full bg-primary/50 animate-pulse"></div>
              <span>Her gün güncellenen içerik</span>
            </div>
          </div>

          <!-- Kategoriler -->
          <div>
            <h4 class="font-semibold text-foreground mb-4 flex items-center gap-2">
              Kategoriler
              <div class="h-px flex-1 bg-gradient-to-r from-border to-transparent"></div>
            </h4>
            <ul class="space-y-2.5">
              <li><a href="/kategori/hastalik" class="text-sm text-muted-foreground hover:text-primary transition-colors">Hastalık</a></li>
              <li><a href="/kategori/kaza" class="text-sm text-muted-foreground hover:text-primary transition-colors">Kaza</a></li>
              <li><a href="/kategori/intihar" class="text-sm text-muted-foreground hover:text-primary transition-colors">İntihar</a></li>
              <li><a href="/kategori/suikast" class="text-sm text-muted-foreground hover:text-primary transition-colors">Suikast</a></li>
            </ul>
          </div>

          <!-- Keşfet -->
          <div>
            <h4 class="font-semibold text-foreground mb-4 flex items-center gap-2">
              Keşfet
              <div class="h-px flex-1 bg-gradient-to-r from-border to-transparent"></div>
            </h4>
            <ul class="space-y-2.5">
              <li><a href="/bugun" class="text-sm text-muted-foreground hover:text-primary transition-colors">Bugün Ölenler</a></li>
              <li><a href="/ulkeler" class="text-sm text-muted-foreground hover:text-primary transition-colors">Ülkeler</a></li>
              <li><a href="/meslek/oyuncu" class="text-sm text-muted-foreground hover:text-primary transition-colors">Oyuncular</a></li>
              <li><a href="/meslek/politikaci" class="text-sm text-muted-foreground hover:text-primary transition-colors">Politikacılar</a></li>
            </ul>
          </div>

          <!-- Bilgi -->
          <div>
            <h4 class="font-semibold text-foreground mb-4 flex items-center gap-2">
              Bilgi
              <div class="h-px flex-1 bg-gradient-to-r from-border to-transparent"></div>
            </h4>
            <ul class="space-y-2.5">
              <li><a href="/hakkinda" class="text-sm text-muted-foreground hover:text-primary transition-colors">Hakkında</a></li>
              <li><a href="/iletisim" class="text-sm text-muted-foreground hover:text-primary transition-colors">İletişim</a></li>
              <li><a href="/kvkk" class="text-sm text-muted-foreground hover:text-primary transition-colors">KVKK</a></li>
              <li><a href="/kullanim-sartlari" class="text-sm text-muted-foreground hover:text-primary transition-colors">Kullanım Şartları</a></li>
            </ul>
          </div>
        </div>

        <!-- Bottom Section -->
        <div class="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-sm text-muted-foreground text-center md:text-left">
            &copy; ${currentYear} nasiloldu.net. Tüm hakları saklıdır.
          </p>
          
          <a 
            href="https://toov.com.tr" 
            target="_blank" 
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <span>Made with</span>
            <span class="text-red-500">❤</span>
            <span>by</span>
            <span class="font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              TOOV
            </span>
          </a>
        </div>
      </div>
    </footer>
  `;
}

/**
 * Ana Sayfa SSR
 */
export async function renderHomePage(): Promise<RenderResult> {
  try {
    const stats = await storage.getStats();
    const recentPersons = await storage.getRecentPersons(6);
    
    const personsHTML = recentPersons.map(person => `
      <article class="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:shadow-lg">
        <a href="/nasil-oldu/${person.slug}" class="block">
          ${person.imageUrl ? `
            <img 
              src="${person.imageUrl}" 
              alt="${person.name}"
              class="mb-4 h-48 w-full object-cover rounded-md"
              loading="lazy"
            />
          ` : ''}
          <h3 class="text-xl font-semibold mb-2 text-foreground">${person.name}</h3>
          <p class="text-sm text-muted-foreground mb-2">${person.profession.name} • ${person.country.name}</p>
          <p class="text-sm text-muted-foreground">
            ${person.deathDate ? formatTurkishDate(person.deathDate) : 'Bilinmiyor'}
          </p>
        </a>
      </article>
    `).join('');
    
    const html = `
      <div class="container mx-auto px-4 py-8">
        <header class="mb-12 text-center">
          <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
            Ünlü Kişiler Nasıl Öldü?
          </h1>
          <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
            ${stats.totalPersons}+ ünlü kişinin ölüm nedenlerini, tarihlerini ve detaylı hayat hikayelerini keşfedin
          </p>
          <div class="flex flex-wrap justify-center gap-4 mt-6">
            <div class="rounded-full bg-card px-6 py-2 border border-border">
              <span class="text-2xl font-bold text-primary">${stats.totalPersons}+</span>
              <span class="text-sm text-muted-foreground ml-2">Ünlü</span>
            </div>
            <div class="rounded-full bg-card px-6 py-2 border border-border">
              <span class="text-2xl font-bold text-primary">${stats.totalCategories}</span>
              <span class="text-sm text-muted-foreground ml-2">Kategori</span>
            </div>
            <div class="rounded-full bg-card px-6 py-2 border border-border">
              <span class="text-2xl font-bold text-primary">${stats.totalCountries}+</span>
              <span class="text-sm text-muted-foreground ml-2">Ülke</span>
            </div>
          </div>
        </header>
        
        <section class="mb-12">
          <h2 class="text-3xl font-semibold mb-6 text-foreground">Son Eklenenler</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${personsHTML}
          </div>
        </section>
      </div>
      ${renderFooter()}
    `;
    
    return { html, statusCode: 200 };
  } catch (error) {
    console.error("Home SSR error:", error);
    return {
      html: '<div class="container mx-auto px-4 py-8"><p class="text-center text-muted-foreground">Bir hata oluştu</p></div>',
      statusCode: 500,
    };
  }
}

/**
 * Kişi Detay Sayfası SSR
 */
export async function renderPersonDetailPage(slug: string): Promise<RenderResult> {
  try {
    const person = await storage.getPersonBySlug(slug);
    
    if (!person) {
      return {
        html: '<div class="container mx-auto px-4 py-8"><h1 class="text-4xl font-bold mb-4">Kişi Bulunamadı</h1><p class="text-muted-foreground">Aradığınız kişi bulunamadı.</p></div>',
        statusCode: 404,
      };
    }
    
    // Calculate age
    let age: number | null = null;
    if (person.birthDate && person.deathDate) {
      const birth = new Date(person.birthDate);
      const death = new Date(person.deathDate);
      age = death.getFullYear() - birth.getFullYear();
    }
    
    const relatedPersons = await storage.getRelatedPersons(person.id, 6);
    const relatedHTML = relatedPersons.map(p => `
      <article class="rounded-lg border border-border bg-card p-4">
        <a href="/nasil-oldu/${p.slug}" class="block">
          ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" class="mb-3 h-32 w-full object-cover rounded-md" loading="lazy" />` : ''}
          <h3 class="font-semibold text-foreground mb-1">${p.name}</h3>
          <p class="text-sm text-muted-foreground">${p.profession.name}</p>
        </a>
      </article>
    `).join('');
    
    const html = `
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column - Main Content -->
          <div class="lg:col-span-2 space-y-8">
            ${person.description ? `
              <section>
                <h2 class="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <span class="text-primary">❤</span>
                  Hayat Hikayesi
                </h2>
                <div class="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8">
                  <p class="text-base md:text-lg leading-relaxed text-zinc-300">${person.description}</p>
                </div>
              </section>
            ` : ''}
            
            <!-- Ölüm Bilgileri Section (SSR) -->
            <section>
              <h2 class="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span class="text-red-400">⚠</span>
                Ölüm Bilgileri
              </h2>
              <div class="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-white/5 p-8">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div class="flex items-start gap-4">
                    <div class="p-3 bg-red-500/10 rounded-xl">
                      <span class="text-red-400">📅</span>
                    </div>
                    <div>
                      <p class="text-sm text-zinc-500 mb-1">Ölüm Tarihi</p>
                      <p class="font-mono text-xl text-white">${person.deathDate ? formatTurkishDate(person.deathDate) : 'Bilinmiyor'}</p>
                    </div>
                  </div>
                  
                  ${age ? `
                    <div class="flex items-start gap-4">
                      <div class="p-3 bg-red-500/10 rounded-xl">
                        <span class="text-red-400">⏰</span>
                      </div>
                      <div>
                        <p class="text-sm text-zinc-500 mb-1">Vefat Yaşı</p>
                        <p class="font-mono text-xl text-white">${age} yaşında</p>
                      </div>
                    </div>
                  ` : ''}
                  
                  ${person.deathPlace ? `
                    <div class="flex items-start gap-4">
                      <div class="p-3 bg-red-500/10 rounded-xl">
                        <span class="text-red-400">📍</span>
                      </div>
                      <div>
                        <p class="text-sm text-zinc-500 mb-1">Ölüm Yeri</p>
                        <p class="text-lg text-white">${person.deathPlace}</p>
                      </div>
                    </div>
                  ` : ''}
                  
                  ${person.deathCause ? `
                    <div class="flex items-start gap-4">
                      <div class="p-3 bg-red-500/10 rounded-xl">
                        <span class="text-red-400">⚠</span>
                      </div>
                      <div>
                        <p class="text-sm text-zinc-500 mb-1">Ölüm Nedeni</p>
                        <p class="text-lg font-semibold text-white">${person.deathCause.name}</p>
                      </div>
                    </div>
                  ` : ''}
                </div>
              </div>
            </section>
            
            ${person.wikipediaUrl ? `
              <a href="${person.wikipediaUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white">
                <span>🌐</span>
                <span>Wikipedia'da Devamını Oku</span>
                <span>↗</span>
              </a>
            ` : ''}
          </div>
          
          <!-- Right Column - Sidebar -->
          <div class="space-y-6">
            <!-- Portrait Card -->
            ${person.imageUrl ? `
              <div class="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 overflow-hidden">
                <div class="aspect-square relative bg-gradient-to-br from-zinc-800 to-zinc-900">
                  <img src="${person.imageUrl}" alt="${person.name} portresi" class="w-full h-full object-cover" loading="eager" />
                </div>
              </div>
            ` : ''}
            
            <!-- Detaylı Bilgiler Section (SSR) -->
            <div class="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6">
              <h3 class="font-bold text-lg text-white mb-6 flex items-center gap-2">
                <span class="text-primary">💼</span>
                Detaylı Bilgiler
              </h3>
              <div class="space-y-5">
                <div class="flex items-start gap-4">
                  <div class="p-2 bg-primary/10 rounded-lg">
                    <span class="text-primary">📅</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs text-zinc-500 mb-1">Doğum Tarihi</p>
                    <p class="font-mono text-sm text-white">${person.birthDate ? formatTurkishDate(person.birthDate) : 'Bilinmiyor'}</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-4">
                  <div class="p-2 bg-primary/10 rounded-lg">
                    <span class="text-primary">💼</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs text-zinc-500 mb-1">Meslek</p>
                    <p class="text-sm text-white">${person.profession.name}</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-4">
                  <div class="p-2 bg-primary/10 rounded-lg">
                    <span class="text-primary">📍</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs text-zinc-500 mb-1">Ülke</p>
                    <p class="text-sm text-white">${person.country.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        ${relatedPersons.length > 0 ? `
          <section class="mt-20">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-8 flex items-center gap-3">
              <span class="text-primary">👥</span>
              İlgili Kişiler
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${relatedHTML}
            </div>
          </section>
        ` : ''}
      </div>
      ${renderFooter()}
    `;
    
    return { html, statusCode: 200 };
  } catch (error) {
    console.error("Person detail SSR error:", error);
    return {
      html: '<div class="container mx-auto px-4 py-8"><p class="text-center text-muted-foreground">Bir hata oluştu</p></div>',
      statusCode: 500,
    };
  }
}

/**
 * Kategori Sayfası SSR
 */
export async function renderCategoryPage(slug: string): Promise<RenderResult> {
  try {
    const category = await storage.getCategoryBySlug(slug);
    
    if (!category) {
      return {
        html: '<div class="container mx-auto px-4 py-8"><h1 class="text-4xl font-bold mb-4">Kategori Bulunamadı</h1></div>',
        statusCode: 404,
      };
    }
    
    const persons = await storage.getPersonsByCategory(category.id);
    const personsHTML = persons.slice(0, 12).map(person => `
      <article class="rounded-lg border border-border bg-card p-4">
        <a href="/nasil-oldu/${person.slug}" class="block">
          ${person.imageUrl ? `<img src="${person.imageUrl}" alt="${person.name}" class="mb-3 h-40 w-full object-cover rounded-md" loading="lazy" />` : ''}
          <h3 class="font-semibold text-foreground mb-1">${person.name}</h3>
          <p class="text-sm text-muted-foreground">${person.profession.name} • ${person.country.name}</p>
        </a>
      </article>
    `).join('');
    
    const html = `
      <div class="container mx-auto px-4 py-8">
        <header class="mb-8">
          <h1 class="text-5xl font-bold mb-4 text-foreground">${category.name} Nedeniyle Ölen Ünlüler</h1>
          <p class="text-xl text-muted-foreground">${persons.length} kişi bulundu</p>
        </header>
        
        <section>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${personsHTML || '<p class="text-muted-foreground col-span-full text-center">Henüz kişi eklenmemiş</p>'}
          </div>
        </section>
      </div>
      ${renderFooter()}
    `;
    
    return { html, statusCode: 200 };
  } catch (error) {
    console.error("Category SSR error:", error);
    return {
      html: '<div class="container mx-auto px-4 py-8"><p class="text-center text-muted-foreground">Bir hata oluştu</p></div>',
      statusCode: 500,
    };
  }
}

/**
 * Ülke Sayfası SSR
 */
export async function renderCountryPage(slug: string): Promise<RenderResult> {
  try {
    const country = await storage.getCountryBySlug(slug);
    
    if (!country) {
      return {
        html: '<div class="container mx-auto px-4 py-8"><h1 class="text-4xl font-bold mb-4">Ülke Bulunamadı</h1></div>',
        statusCode: 404,
      };
    }
    
    const persons = await storage.getPersonsByCountry(country.id);
    const personsHTML = persons.slice(0, 12).map(person => `
      <article class="rounded-lg border border-border bg-card p-4">
        <a href="/nasil-oldu/${person.slug}" class="block">
          ${person.imageUrl ? `<img src="${person.imageUrl}" alt="${person.name}" class="mb-3 h-40 w-full object-cover rounded-md" loading="lazy" />` : ''}
          <h3 class="font-semibold text-foreground mb-1">${person.name}</h3>
          <p class="text-sm text-muted-foreground">${person.profession.name}</p>
        </a>
      </article>
    `).join('');
    
    const html = `
      <div class="container mx-auto px-4 py-8">
        <header class="mb-8">
          <h1 class="text-5xl font-bold mb-4 text-foreground">${country.name} Ünlüleri</h1>
          <p class="text-xl text-muted-foreground">${persons.length} kişi bulundu</p>
        </header>
        
        <section>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${personsHTML || '<p class="text-muted-foreground col-span-full text-center">Henüz kişi eklenmemiş</p>'}
          </div>
        </section>
      </div>
      ${renderFooter()}
    `;
    
    return { html, statusCode: 200 };
  } catch (error) {
    console.error("Country SSR error:", error);
    return {
      html: '<div class="container mx-auto px-4 py-8"><p class="text-center text-muted-foreground">Bir hata oluştu</p></div>',
      statusCode: 500,
    };
  }
}

/**
 * Meslek Sayfası SSR
 */
export async function renderProfessionPage(slug: string): Promise<RenderResult> {
  try {
    const profession = await storage.getProfessionBySlug(slug);
    
    if (!profession) {
      return {
        html: '<div class="container mx-auto px-4 py-8"><h1 class="text-4xl font-bold mb-4">Meslek Bulunamadı</h1></div>',
        statusCode: 404,
      };
    }
    
    const persons = await storage.getPersonsByProfession(profession.id);
    const personsHTML = persons.slice(0, 12).map(person => `
      <article class="rounded-lg border border-border bg-card p-4">
        <a href="/nasil-oldu/${person.slug}" class="block">
          ${person.imageUrl ? `<img src="${person.imageUrl}" alt="${person.name}" class="mb-3 h-40 w-full object-cover rounded-md" loading="lazy" />` : ''}
          <h3 class="font-semibold text-foreground mb-1">${person.name}</h3>
          <p class="text-sm text-muted-foreground">${person.country.name}</p>
        </a>
      </article>
    `).join('');
    
    const html = `
      <div class="container mx-auto px-4 py-8">
        <header class="mb-8">
          <h1 class="text-5xl font-bold mb-4 text-foreground">${profession.name} Ünlüleri</h1>
          <p class="text-xl text-muted-foreground">${persons.length} kişi bulundu</p>
        </header>
        
        <section>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${personsHTML || '<p class="text-muted-foreground col-span-full text-center">Henüz kişi eklenmemiş</p>'}
          </div>
        </section>
      </div>
      ${renderFooter()}
    `;
    
    return { html, statusCode: 200 };
  } catch (error) {
    console.error("Profession SSR error:", error);
    return {
      html: '<div class="container mx-auto px-4 py-8"><p class="text-center text-muted-foreground">Bir hata oluştu</p></div>',
      statusCode: 500,
    };
  }
}

/**
 * Bugün Ölenler Sayfası SSR
 */
export async function renderTodayPage(): Promise<RenderResult> {
  try {
    const todayPersons = await storage.getTodayDeaths();
    const personsHTML = todayPersons.map(person => `
      <article class="rounded-lg border border-border bg-card p-4">
        <a href="/nasil-oldu/${person.slug}" class="block">
          ${person.imageUrl ? `<img src="${person.imageUrl}" alt="${person.name}" class="mb-3 h-40 w-full object-cover rounded-md" loading="lazy" />` : ''}
          <h3 class="font-semibold text-foreground mb-1">${person.name}</h3>
          <p class="text-sm text-muted-foreground">${person.profession.name} • ${person.country.name}</p>
          <p class="text-sm text-muted-foreground mt-1">${person.deathDate ? formatTurkishDate(person.deathDate) : 'Bilinmiyor'}</p>
        </a>
      </article>
    `).join('');
    
    const html = `
      <div class="container mx-auto px-4 py-8">
        <header class="mb-8 text-center">
          <h1 class="text-5xl font-bold mb-4 text-foreground">Bugün Ölen Ünlüler</h1>
          <p class="text-xl text-muted-foreground">Tarihte bugün vefat eden ${todayPersons.length} ünlü kişi</p>
        </header>
        
        <section>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${personsHTML || '<p class="text-muted-foreground col-span-full text-center">Bugün ölen ünlü bulunmamaktadır</p>'}
          </div>
        </section>
      </div>
      ${renderFooter()}
    `;
    
    return { html, statusCode: 200 };
  } catch (error) {
    console.error("Today SSR error:", error);
    return {
      html: '<div class="container mx-auto px-4 py-8"><p class="text-center text-muted-foreground">Bir hata oluştu</p></div>',
      statusCode: 500,
    };
  }
}

/**
 * Kategoriler Listesi SSR
 */
export async function renderCategoriesPage(): Promise<RenderResult> {
  try {
    const categories = await storage.getAllCategories();
    const categoriesHTML = categories.map(category => `
      <article class="rounded-lg border border-border bg-card p-6 hover:shadow-lg transition-all">
        <a href="/kategori/${category.slug}" class="block">
          <h3 class="text-2xl font-semibold mb-2 text-foreground">${category.name}</h3>
          <p class="text-sm text-muted-foreground">Kategoriyi keşfet →</p>
        </a>
      </article>
    `).join('');
    
    const html = `
      <div class="container mx-auto px-4 py-8">
        <header class="mb-8 text-center">
          <h1 class="text-5xl font-bold mb-4 text-foreground">Tüm Kategoriler</h1>
          <p class="text-xl text-muted-foreground">Ölüm kategorilerine göre ünlü kişileri keşfedin</p>
        </header>
        
        <section>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${categoriesHTML}
          </div>
        </section>
      </div>
      ${renderFooter()}
    `;
    
    return { html, statusCode: 200 };
  } catch (error) {
    console.error("Categories SSR error:", error);
    return {
      html: '<div class="container mx-auto px-4 py-8"><p class="text-center text-muted-foreground">Bir hata oluştu</p></div>',
      statusCode: 500,
    };
  }
}

/**
 * Ülkeler Listesi SSR
 */
export async function renderCountriesPage(): Promise<RenderResult> {
  try {
    const countries = await storage.getAllCountries();
    const countriesHTML = countries.map(country => `
      <article class="rounded-lg border border-border bg-card p-6 hover:shadow-lg transition-all">
        <a href="/ulke/${country.slug}" class="block">
          <h3 class="text-2xl font-semibold mb-2 text-foreground">${country.name}</h3>
          <p class="text-sm text-muted-foreground">${country._count?.persons || 0} kişi</p>
        </a>
      </article>
    `).join('');
    
    const html = `
      <div class="container mx-auto px-4 py-8">
        <header class="mb-8 text-center">
          <h1 class="text-5xl font-bold mb-4 text-foreground">Tüm Ülkeler</h1>
          <p class="text-xl text-muted-foreground">Ülkelere göre ünlü kişileri keşfedin</p>
        </header>
        
        <section>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${countriesHTML}
          </div>
        </section>
      </div>
      ${renderFooter()}
    `;
    
    return { html, statusCode: 200 };
  } catch (error) {
    console.error("Countries SSR error:", error);
    return {
      html: '<div class="container mx-auto px-4 py-8"><p class="text-center text-muted-foreground">Bir hata oluştu</p></div>',
      statusCode: 500,
    };
  }
}

/**
 * Statik Sayfa SSR
 */
export async function renderStaticPage(pageName: 'hakkinda' | 'iletisim' | 'kvkk' | 'kullanim-sartlari'): Promise<RenderResult> {
  const pages = {
    'hakkinda': {
      title: 'Hakkında',
      content: `
        <p class="text-lg text-muted-foreground mb-4">
          nasiloldu.net, ünlü kişilerin ölüm bilgilerini Wikidata ve Wikipedia verilerine dayalı olarak sunan kapsamlı bir platformdur.
        </p>
        <p class="text-lg text-muted-foreground mb-4">
          236+ ünlü kişinin ölüm nedenlerini, tarihlerini ve detaylı hayat hikayelerini Türkçe olarak keşfedebilirsiniz.
        </p>
      `
    },
    'iletisim': {
      title: 'İletişim',
      content: `
        <p class="text-lg text-muted-foreground mb-4">
          Geri bildirimleriniz ve önerileriniz bizim için değerlidir.
        </p>
        <p class="text-lg text-muted-foreground mb-4">
          E-posta: info@nasiloldu.net
        </p>
      `
    },
    'kvkk': {
      title: 'KVKK',
      content: `
        <p class="text-lg text-muted-foreground mb-4">
          Kişisel verilerin korunması hakkında bilgi.
        </p>
      `
    },
    'kullanim-sartlari': {
      title: 'Kullanım Şartları',
      content: `
        <p class="text-lg text-muted-foreground mb-4">
          nasiloldu.net kullanım şartları.
        </p>
      `
    },
  };
  
  const page = pages[pageName];
  
  const html = `
    <div class="container mx-auto px-4 py-8">
      <article>
        <header class="mb-8">
          <h1 class="text-5xl font-bold mb-4 text-foreground">${page.title}</h1>
        </header>
        <section class="prose prose-invert max-w-none">
          ${page.content}
        </section>
      </article>
    </div>
    ${renderFooter()}
  `;
  
  return { html, statusCode: 200 };
}
