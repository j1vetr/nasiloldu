/**
 * Basit Kişi Ekleme Script'i
 * 
 * Kullanım:
 * tsx server/scripts/add-person-simple.ts "Kişi Adı"
 * 
 * Örnek:
 * tsx server/scripts/add-person-simple.ts "Zeki Müren"
 * tsx server/scripts/add-person-simple.ts "Bülent Ersoy"
 */

import { db } from '../db';
import { persons, categories, professions, countries, deathCauses } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface WikidataResult {
  person: { value: string };
  personLabel: { value: string };
  birthDate?: { value: string };
  deathDate?: { value: string };
  deathCause?: { value: string };
  deathCauseLabel?: { value: string };
  occupation?: { value: string };
  occupationLabel?: { value: string };
  country?: { value: string };
  countryLabel?: { value: string };
  image?: { value: string };
  description?: { value: string };
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/i̇/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/û/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function categorizeDeathCause(cause: string | null): string {
  if (!cause) return 'hastalik';
  
  const lowerCause = cause.toLocaleLowerCase('tr-TR');
  
  const suikastKeywords = ['murder', 'assassination', 'shot', 'killed', 'shooting', 'gunshot', 'homicide', 'stabbing', 'execution', 'ateşli silah', 'cinayet', 'suikast', 'kurşun'];
  const kazaKeywords = ['accident', 'crash', 'drowning', 'fall', 'kaza', 'düşme', 'trafik'];
  const intiharKeywords = ['suicide', 'overdose', 'self-inflicted', 'intihar', 'aşırı doz'];
  
  if (suikastKeywords.some(k => lowerCause.includes(k))) return 'suikast';
  if (intiharKeywords.some(k => lowerCause.includes(k))) return 'intihar';
  if (kazaKeywords.some(k => lowerCause.includes(k))) return 'kaza';
  
  return 'hastalik';
}

async function fetchWikidataInfo(name: string): Promise<WikidataResult | null> {
  try {
    const query = `
      SELECT DISTINCT ?person ?personLabel ?birthDate ?deathDate 
             ?deathCause ?deathCauseLabel ?occupation ?occupationLabel 
             ?country ?countryLabel ?image ?description
      WHERE {
        ?person ?label "${name}"@tr .
        ?person wdt:P31 wd:Q5 .  # İnsan
        ?person wdt:P570 ?deathDate .  # Ölüm tarihi (zorunlu)
        
        OPTIONAL { ?person wdt:P569 ?birthDate . }
        OPTIONAL { ?person wdt:P509 ?deathCause . }
        OPTIONAL { ?person wdt:P106 ?occupation . }
        OPTIONAL { ?person wdt:P27 ?country . }
        OPTIONAL { ?person wdt:P18 ?image . }
        OPTIONAL { 
          ?person schema:description ?description .
          FILTER(LANG(?description) = "tr")
        }
        
        SERVICE wikibase:label { bd:serviceParam wikibase:language "tr,en". }
      }
      LIMIT 1
    `;

    const url = 'https://query.wikidata.org/sparql?query=' + encodeURIComponent(query);
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'nasiloldu.net/1.0'
      }
    });

    if (!response.ok) {
      console.error(`Wikidata API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (data.results.bindings.length === 0) {
      console.log(`❌ "${name}" için Wikidata'da sonuç bulunamadı`);
      return null;
    }

    return data.results.bindings[0];
  } catch (error) {
    console.error(`Wikidata fetch error for "${name}":`, error);
    return null;
  }
}

async function addPerson(name: string) {
  console.log(`\n🔍 "${name}" için Wikidata'da aranıyor...`);
  
  const wikidataInfo = await fetchWikidataInfo(name);
  
  if (!wikidataInfo) {
    console.log(`❌ "${name}" eklenemedi - Wikidata'da bulunamadı\n`);
    return;
  }

  const qid = wikidataInfo.person.value.split('/').pop()!;
  
  // QID kontrolü (duplicate prevention)
  const [existingPerson] = await db.select().from(persons).where(eq(persons.qid, qid));
  if (existingPerson) {
    console.log(`⚠️  "${name}" zaten mevcut (QID: ${qid})\n`);
    return;
  }

  const personName = wikidataInfo.personLabel.value;
  const slug = createSlug(personName);
  
  // Kategori belirleme
  const deathCauseLabel = wikidataInfo.deathCauseLabel?.value || null;
  const categorySlug = categorizeDeathCause(deathCauseLabel);
  const [category] = await db.select().from(categories).where(eq(categories.slug, categorySlug));
  
  // Meslek
  const occupationLabel = wikidataInfo.occupationLabel?.value || 'Diğer';
  let [profession] = await db.select().from(professions).where(eq(professions.name, occupationLabel));
  if (!profession) {
    // Yeni meslek ekle
    [profession] = await db.insert(professions).values({
      name: occupationLabel,
      slug: createSlug(occupationLabel)
    }).returning();
  }
  
  // Ülke
  const countryLabel = wikidataInfo.countryLabel?.value || 'Bilinmiyor';
  let [country] = await db.select().from(countries).where(eq(countries.name, countryLabel));
  if (!country) {
    // Yeni ülke ekle
    [country] = await db.insert(countries).values({
      name: countryLabel,
      slug: createSlug(countryLabel)
    }).returning();
  }
  
  // Ölüm nedeni
  let deathCauseId = null;
  if (deathCauseLabel) {
    let [deathCause] = await db.select().from(deathCauses).where(eq(deathCauses.name, deathCauseLabel));
    if (!deathCause) {
      [deathCause] = await db.insert(deathCauses).values({
        name: deathCauseLabel,
        categoryId: category.id
      }).returning();
    }
    deathCauseId = deathCause.id;
  }

  // Kişi ekle
  const [newPerson] = await db.insert(persons).values({
    qid,
    name: personName,
    slug,
    birthDate: wikidataInfo.birthDate?.value || null,
    deathDate: wikidataInfo.deathDate?.value || null,
    categoryId: category.id,
    professionId: profession.id,
    countryId: country.id,
    deathCauseId,
    imageUrl: wikidataInfo.image?.value || null,
    description: wikidataInfo.description?.value || null,
    wikipediaUrl: `https://tr.wikipedia.org/wiki/${encodeURIComponent(personName.replace(/ /g, '_'))}`
  }).returning();

  console.log(`✅ "${personName}" başarıyla eklendi!`);
  console.log(`   QID: ${qid}`);
  console.log(`   Kategori: ${category.name}`);
  console.log(`   Meslek: ${profession.name}`);
  console.log(`   Ülke: ${country.name}`);
  console.log(`   Slug: ${slug}\n`);
}

// CLI kullanımı
const personName = process.argv[2];

if (!personName) {
  console.log('❌ Kullanım: tsx server/scripts/add-person-simple.ts "Kişi Adı"');
  console.log('Örnek: tsx server/scripts/add-person-simple.ts "Zeki Müren"');
  process.exit(1);
}

addPerson(personName).then(() => {
  console.log('✅ İşlem tamamlandı!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Hata:', error);
  process.exit(1);
});
