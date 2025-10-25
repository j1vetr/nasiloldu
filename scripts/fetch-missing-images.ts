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
      console.log(`❌ ${qid}: HTTP ${response.status}`);
      return null;
    }

    const data = await response.json() as WikidataImageResponse;

    if (data.results.bindings.length > 0 && data.results.bindings[0].image) {
      const imageUrl = data.results.bindings[0].image.value;
      console.log(`✅ ${qid}: Görsel bulundu`);
      return imageUrl;
    } else {
      console.log(`⚠️ ${qid}: Görsel yok`);
      return null;
    }
  } catch (error) {
    console.error(`❌ ${qid}: Hata -`, error);
    return null;
  }
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

    const imageUrl = await fetchImageFromWikidata(person.qid);

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

    // API rate limit için delay (300ms)
    await new Promise(resolve => setTimeout(resolve, 300));
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
