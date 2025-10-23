import { db } from "../db";
import { persons } from "@shared/schema";
import { eq, or, sql } from "drizzle-orm";

interface WikipediaFullResponse {
  query: {
    pages: {
      [key: string]: {
        extract?: string;
        thumbnail?: {
          source: string;
        };
      };
    };
  };
}

interface WikidataResponse {
  results: {
    bindings: Array<{
      birthDate?: { value: string };
      deathDate?: { value: string };
      description?: { value: string };
    }>;
  };
}

async function fetchWikipediaFullText(title: string): Promise<{ text: string; length: number } | null> {
  try {
    const url = `https://tr.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${encodeURIComponent(title)}&explaintext=1&origin=*`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.query?.pages) {
      const pages = Object.values(data.query.pages);
      const page = pages[0] as any;
      
      if (page?.extract) {
        const text = page.extract;
        const wordCount = text.split(/\s+/).length;
        console.log(`  📝 Wikipedia: ${wordCount} kelime`);
        return { text, length: wordCount };
      }
    }
    
    return null;
  } catch (error) {
    console.error(`  ❌ Wikipedia hatası:`, error);
    return null;
  }
}

async function fetchWikidataInfo(qid: string): Promise<{ birthDate?: string; deathDate?: string } | null> {
  if (!qid) return null;
  
  try {
    const query = `
      SELECT ?birthDate ?deathDate WHERE {
        wd:${qid} wdt:P569 ?birthDate .
        OPTIONAL { wd:${qid} wdt:P570 ?deathDate . }
      }
    `;
    
    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'nasiloldu.net/1.0' }
    });
    
    const data: WikidataResponse = await response.json();
    
    if (data.results?.bindings?.[0]) {
      const binding = data.results.bindings[0];
      return {
        birthDate: binding.birthDate?.value.split('T')[0],
        deathDate: binding.deathDate?.value.split('T')[0],
      };
    }
    
    return null;
  } catch (error) {
    console.error(`  ❌ Wikidata hatası:`, error);
    return null;
  }
}

async function main() {
  console.log('\n🔍 Eksik verileri tespit ediyorum...\n');
  
  // Eksik verileri bul
  const personsWithMissingData = await db
    .select()
    .from(persons)
    .where(
      or(
        sql`${persons.birthDate} IS NULL`,
        sql`${persons.deathDate} IS NULL`,
        sql`LENGTH(${persons.description}) < 500`
      )
    );
  
  console.log(`📊 Toplam ${personsWithMissingData.length} kişide eksik veri var:\n`);
  
  let fixed = 0;
  let skipped = 0;
  
  for (const person of personsWithMissingData) {
    console.log(`\n🔧 ${person.name} (${person.slug})`);
    
    let needsUpdate = false;
    let updateData: any = {};
    
    // 1. Doğum/Ölüm tarihi eksikse Wikidata'dan çek
    if (!person.birthDate || !person.deathDate) {
      console.log(`  ⏳ Wikidata'dan tarih bilgileri alınıyor...`);
      const wikidataInfo = await fetchWikidataInfo(person.qid);
      
      if (wikidataInfo) {
        if (!person.birthDate && wikidataInfo.birthDate) {
          updateData.birthDate = wikidataInfo.birthDate;
          console.log(`  ✅ Doğum tarihi: ${wikidataInfo.birthDate}`);
          needsUpdate = true;
        }
        if (!person.deathDate && wikidataInfo.deathDate) {
          updateData.deathDate = wikidataInfo.deathDate;
          console.log(`  ✅ Ölüm tarihi: ${wikidataInfo.deathDate}`);
          needsUpdate = true;
        }
      }
    }
    
    // 2. Açıklama eksikse veya kısaysa Wikipedia'dan çek
    const descLength = person.description?.length || 0;
    if (descLength < 500) {
      console.log(`  ⏳ Wikipedia'dan açıklama alınıyor... (mevcut: ${descLength} karakter)`);
      const wikiText = await fetchWikipediaFullText(person.name);
      
      if (wikiText && wikiText.length >= 500) {
        updateData.description = wikiText.text;
        console.log(`  ✅ Açıklama güncellendi: ${wikiText.length} kelime`);
        needsUpdate = true;
      } else {
        console.log(`  ⚠️ Wikipedia'da yeterli açıklama bulunamadı`);
      }
    }
    
    // 3. Güncelle
    if (needsUpdate) {
      await db
        .update(persons)
        .set(updateData)
        .where(eq(persons.id, person.id));
      
      console.log(`  ✅ Güncellendi!`);
      fixed++;
    } else {
      console.log(`  ⏭️ Güncellenemedi (veri bulunamadı)`);
      skipped++;
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n\n📊 Özet:`);
  console.log(`✅ ${fixed} kişi güncellendi`);
  console.log(`⏭️ ${skipped} kişi güncellenemedi`);
  console.log(`\n🎉 İşlem tamamlandı!\n`);
  
  process.exit(0);
}

main().catch(error => {
  console.error('❌ Hata:', error);
  process.exit(1);
});
