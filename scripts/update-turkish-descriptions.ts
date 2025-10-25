/**
 * Wikipedia Türkçe Description Güncelleme Script
 * 
 * Bu script:
 * 1. İngilizce description'ları tespit eder
 * 2. Wikipedia Türkçe API'den description çekmeye çalışır
 * 3. Bulamazsa generic Türkçe metin oluşturur
 * 4. Database'i günceller
 */

import { db } from '../server/db';
import { persons } from '../shared/schema';
import { eq } from 'drizzle-orm';

interface WikipediaExtract {
  title: string;
  extract: string;
  pageid?: number;
}

interface PersonUpdate {
  id: number;
  name: string;
  slug: string;
  qid: string | null;
  currentDescription: string;
  newDescription: string;
  source: 'wikipedia-tr' | 'generic';
}

/**
 * Wikidata QID ile Wikipedia Türkçe extract çeker
 */
async function fetchTurkishWikipediaExtract(wikidataId: string): Promise<string | null> {
  try {
    // 1. Wikidata'dan Türkçe Wikipedia sayfa başlığını al
    const wikidataUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikidataId}&props=sitelinks&sitefilter=trwiki&format=json&origin=*`;
    
    const wikidataResponse = await fetch(wikidataUrl, {
      headers: {
        'User-Agent': 'nasiloldu.net/1.0 (https://nasiloldu.net; info@nasiloldu.net)'
      }
    });
    const wikidataData = await wikidataResponse.json();
    
    const entity = wikidataData.entities?.[wikidataId];
    const trWikiTitle = entity?.sitelinks?.trwiki?.title;
    
    if (!trWikiTitle) {
      console.log(`❌ ${wikidataId}: Türkçe Wikipedia sayfası bulunamadı`);
      return null;
    }
    
    console.log(`✓ ${wikidataId}: Türkçe Wikipedia başlığı bulundu: ${trWikiTitle}`);
    
    // 2. Wikipedia Türkçe API'den extract (özet) çek
    const wikipediaUrl = `https://tr.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(trWikiTitle)}&prop=extracts&exintro=1&explaintext=1&format=json&origin=*`;
    
    const wikipediaResponse = await fetch(wikipediaUrl, {
      headers: {
        'User-Agent': 'nasiloldu.net/1.0 (https://nasiloldu.net; info@nasiloldu.net)'
      }
    });
    const wikipediaData = await wikipediaResponse.json();
    
    const pages = wikipediaData.query?.pages;
    if (!pages) {
      return null;
    }
    
    const pageId = Object.keys(pages)[0];
    const extract = pages[pageId]?.extract;
    
    if (extract && extract.length > 100) {
      console.log(`✅ ${wikidataId}: Türkçe açıklama çekildi (${extract.length} karakter)`);
      return extract.trim();
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Wikipedia API hatası (${wikidataId}):`, error);
    return null;
  }
}

/**
 * Generic Türkçe description oluşturur
 */
function generateGenericTurkishDescription(person: any): string {
  const { name, profession, country, birthDate, deathDate, deathCause } = person;
  
  const birthYear = birthDate ? new Date(birthDate).getFullYear() : null;
  const deathYear = deathDate ? new Date(deathDate).getFullYear() : null;
  
  let description = `${name}`;
  
  // Doğum-ölüm yılları
  if (birthYear && deathYear) {
    description += ` (${birthYear}-${deathYear})`;
  } else if (birthYear) {
    description += ` (d. ${birthYear})`;
  }
  
  // Meslek
  if (profession?.name) {
    description += `, ${profession.name}`;
  }
  
  // Ülke
  if (country?.name) {
    description += ` (${country.name})`;
  }
  
  description += '.';
  
  // Ölüm bilgisi
  if (deathDate && deathCause?.name) {
    const deathDateStr = new Date(deathDate).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    description += ` ${deathDateStr} tarihinde ${deathCause.name} nedeniyle vefat etti.`;
  } else if (deathDate) {
    const deathDateStr = new Date(deathDate).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    description += ` ${deathDateStr} tarihinde vefat etti.`;
  }
  
  return description;
}

/**
 * İngilizce veya yetersiz description'ları tespit eder
 */
function needsTurkishUpdate(description: string | null): boolean {
  if (!description) return true;
  
  // 1. Çok kısa generic metinler (100 karakterden az)
  if (description.length < 150) {
    return true;
  }
  
  // 2. İngilizce pattern'ler
  const englishPatterns = [
    / was /i,
    / were /i,
    / is /i,
    / are /i,
    / had /i,
    / has /i,
    / the /i,
    / and /i,
    / for /i,
    / from /i,
    /notable figure/i,
    /American /i,
    /British /i,
    /English /i,
    /Turkish /i,
    /musician/i,
    /actor/i,
    /actress/i,
    /singer/i,
    /politician/i,
    /writer/i,
    /journalist/i,
    /activist/i,
    /researcher/i,
    /geophysicist/i,
    /physicist/i,
    /director/i,
    /composer/i,
    /\(d\. \d{4}\)/i, // (d. 1957) format
    /Chinese /i,
    /Indian /i,
    /Japanese /i,
    /French /i,
    /German /i,
    /Italian /i,
    /Russian /i,
    /Brazilian /i,
  ];
  
  const hasEnglish = englishPatterns.some(pattern => pattern.test(description));
  
  // 3. Detaylı Türkçe kontrol - bunlar varsa muhtemelen zaten Türkçe Wikipedia'dan gelmiş
  const hasTurkishWikipedia = description.includes('görev yaptı') || 
                              description.includes('olarak bilinir') ||
                              description.includes('doğdu') ||
                              description.length > 500;
  
  return hasEnglish || !hasTurkishWikipedia;
}

/**
 * Ana güncelleme fonksiyonu
 */
async function updateTurkishDescriptions() {
  console.log('🚀 Wikipedia Türkçe Description Güncelleme Başlatılıyor...\n');
  
  // 1. Tüm kişileri çek
  const allPersons = await db.query.persons.findMany({
    with: {
      profession: true,
      country: true,
      deathCause: true,
    },
  });
  
  console.log(`📊 Toplam Kişi: ${allPersons.length}\n`);
  
  // 2. Türkçe güncelleme gereken kişileri filtrele
  const personsNeedingUpdate = allPersons.filter(p => needsTurkishUpdate(p.description));
  
  console.log(`🔄 Güncelleme Gerekiyor: ${personsNeedingUpdate.length} kişi\n`);
  console.log('─'.repeat(80));
  
  // 3. Her kişi için güncelleme yap
  const updates: PersonUpdate[] = [];
  let wikipediaSuccess = 0;
  let genericFallback = 0;
  
  for (let i = 0; i < personsNeedingUpdate.length; i++) {
    const person = personsNeedingUpdate[i];
    console.log(`\n[${i + 1}/${personsNeedingUpdate.length}] 📝 İşleniyor: ${person.name} (${person.slug})`);
    
    let newDescription: string | null = null;
    let source: 'wikipedia-tr' | 'generic' = 'generic';
    
    // Wikipedia Türkçe'den çekmeyi dene
    if (person.qid) {
      newDescription = await fetchTurkishWikipediaExtract(person.qid);
      if (newDescription) {
        source = 'wikipedia-tr';
        wikipediaSuccess++;
      }
      
      // API rate limit için delay (500ms)
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      console.log(`⚠️ Wikidata QID yok, generic metin oluşturulacak`);
    }
    
    // Bulamazsa generic metin oluştur
    if (!newDescription) {
      newDescription = generateGenericTurkishDescription(person);
      source = 'generic';
      genericFallback++;
      console.log(`📝 Generic Türkçe metin oluşturuldu`);
    }
    
    updates.push({
      id: person.id,
      name: person.name,
      slug: person.slug,
      qid: person.qid,
      currentDescription: person.description || '',
      newDescription,
      source,
    });
    
    // Rate limiting - Wikipedia API'ye fazla yüklenmeyelim
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '─'.repeat(80));
  console.log('\n📊 ÖZET İSTATİSTİKLER:');
  console.log(`   Total: ${updates.length} kişi güncellendi`);
  console.log(`   ✅ Wikipedia Türkçe: ${wikipediaSuccess} kişi`);
  console.log(`   📝 Generic Metin: ${genericFallback} kişi`);
  
  // 4. Onay iste
  console.log('\n' + '='.repeat(80));
  console.log('🔍 ÖRNEKLENDİRME (İlk 5 Güncelleme):');
  console.log('='.repeat(80));
  
  updates.slice(0, 5).forEach((update, index) => {
    console.log(`\n${index + 1}. ${update.name} (${update.source})`);
    console.log(`   ESKİ: ${update.currentDescription.substring(0, 100)}...`);
    console.log(`   YENİ: ${update.newDescription.substring(0, 100)}...`);
  });
  
  // 5. Database güncelle
  console.log('\n' + '='.repeat(80));
  console.log('💾 Database güncellemesi başlatılıyor...\n');
  
  for (const update of updates) {
    try {
      await db.update(persons)
        .set({ description: update.newDescription })
        .where(eq(persons.id, update.id));
      
      console.log(`✅ ${update.name}: Güncellendi`);
    } catch (error) {
      console.error(`❌ ${update.name}: Hata -`, error);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ TÜM GÜNCELLEMELER TAMAMLANDI!');
  console.log('='.repeat(80));
}

// Script çalıştırma
updateTurkishDescriptions()
  .then(() => {
    console.log('\n🎉 Script başarıyla tamamlandı!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script hatası:', error);
    process.exit(1);
  });
