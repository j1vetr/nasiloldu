import { db } from '../server/db';
import { persons } from '../shared/schema';
import { isNull, eq } from 'drizzle-orm';

interface WikidataImageResponse {
  results: {
    bindings: Array<{
      image?: { value: string };
    }>;
  };
}

interface WikipediaSummary {
  title?: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  originalimage?: {
    source: string;
    width: number;
    height: number;
  };
}

/**
 * Wikidata SPARQL ile fotoğraf çeker (P18 property)
 */
async function fetchImageFromWikidata(qid: string): Promise<string | null> {
  const query = `
    SELECT ?image WHERE {
      wd:${qid} wdt:P18 ?image.
    }
  `;

  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'nasiloldu.net/1.0',
        'Accept': 'application/sparql-results+json'
      }
    });

    if (!response.ok) {
      console.log(`❌ Wikidata ${qid}: HTTP ${response.status}`);
      return null;
    }

    const data = await response.json() as WikidataImageResponse;

    if (data.results.bindings.length > 0 && data.results.bindings[0].image) {
      const imageUrl = data.results.bindings[0].image.value;
      console.log(`✅ Wikidata ${qid}: Görsel bulundu`);
      return imageUrl;
    } else {
      console.log(`⚠️ Wikidata ${qid}: Görsel yok`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Wikidata ${qid}: Hata -`, error);
    return null;
  }
}

/**
 * Wikidata QID'den Wikipedia sayfa başlığını çeker
 */
async function getWikipediaTitle(qid: string, lang: 'tr' | 'en'): Promise<string | null> {
  try {
    const sitefilter = lang === 'tr' ? 'trwiki' : 'enwiki';
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&props=sitelinks&sitefilter=${sitefilter}&format=json&origin=*`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'nasiloldu.net/1.0'
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const entity = data.entities?.[qid];
    const title = entity?.sitelinks?.[sitefilter]?.title;
    
    return title || null;
  } catch (error) {
    console.error(`❌ Wikidata title fetch error (${qid}, ${lang}):`, error);
    return null;
  }
}

/**
 * Wikipedia REST API ile fotoğraf çeker
 */
async function fetchImageFromWikipedia(qid: string): Promise<string | null> {
  // TR Wikipedia'yı dene
  const trTitle = await getWikipediaTitle(qid, 'tr');
  
  if (trTitle) {
    const trUrl = `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(trTitle)}`;
    
    try {
      const response = await fetch(trUrl, {
        headers: {
          'User-Agent': 'nasiloldu.net/1.0'
        }
      });

      if (response.ok) {
        const data = await response.json() as WikipediaSummary;
        
        // Orijinal resmi tercih et, yoksa thumbnail kullan
        if (data.originalimage?.source) {
          console.log(`✅ Wikipedia TR ${qid}: Orijinal görsel bulundu`);
          return data.originalimage.source;
        } else if (data.thumbnail?.source) {
          console.log(`✅ Wikipedia TR ${qid}: Thumbnail bulundu`);
          return data.thumbnail.source;
        }
      }
    } catch (error) {
      console.error(`❌ Wikipedia TR fetch error (${qid}):`, error);
    }
  }

  // EN Wikipedia'yı dene (fallback)
  const enTitle = await getWikipediaTitle(qid, 'en');
  
  if (enTitle) {
    const enUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(enTitle)}`;
    
    try {
      const response = await fetch(enUrl, {
        headers: {
          'User-Agent': 'nasiloldu.net/1.0'
        }
      });

      if (response.ok) {
        const data = await response.json() as WikipediaSummary;
        
        if (data.originalimage?.source) {
          console.log(`✅ Wikipedia EN ${qid}: Orijinal görsel bulundu`);
          return data.originalimage.source;
        } else if (data.thumbnail?.source) {
          console.log(`✅ Wikipedia EN ${qid}: Thumbnail bulundu`);
          return data.thumbnail.source;
        }
      }
    } catch (error) {
      console.error(`❌ Wikipedia EN fetch error (${qid}):`, error);
    }
  }

  console.log(`⚠️ Wikipedia ${qid}: Hiçbir kaynakta görsel yok`);
  return null;
}

async function main() {
  console.log('📸 Eksik fotoğraflar Wikidata\'dan çekiliyor...\n');

  // Fotoğrafı olmayan ve QID'si olan kişileri getir
  const personsWithoutImage = await db
    .select()
    .from(persons)
    .where(isNull(persons.imageUrl));

  console.log(`🔍 ${personsWithoutImage.length} kişinin fotoğrafı eksik\n`);

  const updates: Array<{ id: number; name: string; imageUrl: string }> = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < personsWithoutImage.length; i++) {
    const person = personsWithoutImage[i];
    console.log(`\n[${i + 1}/${personsWithoutImage.length}] 📝 ${person.name} (${person.slug})`);

    if (!person.qid) {
      console.log(`⚠️ Wikidata QID yok, atlanıyor`);
      failCount++;
      continue;
    }

    let imageUrl: string | null = null;

    // 1. Önce Wikidata'dan dene
    imageUrl = await fetchImageFromWikidata(person.qid);

    // 2. Bulamazsa Wikipedia'dan dene (TR → EN fallback)
    if (!imageUrl) {
      console.log(`🔄 Wikipedia fallback deneniyor...`);
      imageUrl = await fetchImageFromWikipedia(person.qid);
    }

    if (imageUrl) {
      updates.push({
        id: person.id,
        name: person.name,
        imageUrl
      });
      successCount++;
    } else {
      failCount++;
    }

    // API rate limit için delay (400ms - 3 API call olabilir)
    await new Promise(resolve => setTimeout(resolve, 400));
  }

  console.log('\n\n================================================================================');
  console.log('📊 ÖZET');
  console.log('================================================================================');
  console.log(`✅ Başarılı: ${successCount}`);
  console.log(`❌ Başarısız: ${failCount}`);
  console.log(`📝 Güncellenecek: ${updates.length}`);

  if (updates.length === 0) {
    console.log('\n⚠️ Güncellenecek fotoğraf yok!');
    return;
  }

  console.log('\n\n================================================================================');
  console.log('💾 VERİTABANI GÜNCELLENİYOR...');
  console.log('================================================================================\n');

  for (const update of updates) {
    await db
      .update(persons)
      .set({ imageUrl: update.imageUrl })
      .where(eq(persons.id, update.id));

    console.log(`✅ ${update.name}: Güncellendi`);
  }

  console.log('\n\n================================================================================');
  console.log('✅ TÜM GÜNCELLEMELER TAMAMLANDI!');
  console.log('================================================================================');
  console.log(`📸 ${updates.length} kişinin fotoğrafı eklendi!`);

  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
});
