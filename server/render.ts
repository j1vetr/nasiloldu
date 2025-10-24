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
      <div class="container mx-auto px-4 py-8">
        <article>
          <header class="mb-8">
            ${person.imageUrl ? `
              <img 
                src="${person.imageUrl}" 
                alt="${person.name}"
                class="w-full max-w-2xl mx-auto rounded-lg shadow-lg mb-6"
                loading="eager"
              />
            ` : ''}
            <h1 class="text-5xl font-bold mb-4 text-foreground">${person.name}</h1>
            <div class="flex flex-wrap gap-3 mb-4">
              <span class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                ${person.profession.name}
              </span>
              <span class="inline-flex items-center rounded-full bg-card border border-border px-3 py-1 text-sm">
                ${person.country.name}
              </span>
              ${person.category ? `
                <span class="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">
                  ${person.category.name}
                </span>
              ` : ''}
            </div>
          </header>
          
          <section class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="rounded-lg border border-border bg-card p-4">
              <h3 class="text-sm font-medium text-muted-foreground mb-1">Doğum Tarihi</h3>
              <p class="text-lg text-foreground">${person.birthDate ? formatTurkishDate(person.birthDate) : 'Bilinmiyor'}</p>
            </div>
            <div class="rounded-lg border border-border bg-card p-4">
              <h3 class="text-sm font-medium text-muted-foreground mb-1">Ölüm Tarihi</h3>
              <p class="text-lg text-foreground">${person.deathDate ? formatTurkishDate(person.deathDate) : 'Bilinmiyor'}</p>
            </div>
            ${person.deathCause ? `
              <div class="rounded-lg border border-border bg-card p-4 md:col-span-2">
                <h3 class="text-sm font-medium text-muted-foreground mb-1">Ölüm Nedeni</h3>
                <p class="text-lg text-foreground">${person.deathCause.name}</p>
              </div>
            ` : ''}
          </section>
          
          ${person.description ? `
            <section class="mb-8">
              <h2 class="text-3xl font-semibold mb-4 text-foreground">Hayat Hikayesi</h2>
              <div class="prose prose-invert max-w-none">
                <p class="text-muted-foreground leading-relaxed">${person.description}</p>
              </div>
            </section>
          ` : ''}
          
          ${relatedPersons.length > 0 ? `
            <section class="mb-8">
              <h2 class="text-3xl font-semibold mb-6 text-foreground">Benzer Kişiler</h2>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                ${relatedHTML}
              </div>
            </section>
          ` : ''}
        </article>
      </div>
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
  `;
  
  return { html, statusCode: 200 };
}
