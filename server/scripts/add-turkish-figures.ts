import { db } from "../db";
import { persons, categories, countries, professions, deathCauses } from "@shared/schema";
import { eq } from "drizzle-orm";

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

async function getFullWikipediaData(title: string): Promise<{ description: string; imageUrl: string | null }> {
  // Use TextExtracts API WITHOUT exintro to get FULL article content
  const url = `https://tr.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&titles=${encodeURIComponent(title)}&explaintext=true&pithumbsize=500&origin=*`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Wikipedia API error for ${title}: ${response.status}`);
      return { description: "", imageUrl: null };
    }
    
    const data: WikipediaFullResponse = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];
    
    const description = page.extract || "";
    const imageUrl = page.thumbnail?.source || null;
    
    // Check if we got enough content (minimum 500 words)
    const wordCount = description.split(/\s+/).length;
    console.log(`✓ ${title}: ${wordCount} words, ${description.length} characters`);
    
    if (wordCount < 500) {
      console.error(`❌ ${title} has only ${wordCount} words (minimum 500 required)`);
      return { description: "", imageUrl: null };
    }
    
    return {
      description,
      imageUrl
    };
  } catch (error) {
    console.error(`Error fetching Wikipedia data for ${title}:`, error);
    return { description: "", imageUrl: null };
  }
}

interface WikidataSearchResult {
  search: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
}

async function getWikidataQID(personName: string): Promise<string | null> {
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(personName)}&language=tr&format=json&origin=*`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Wikidata search error for ${personName}: ${response.status}`);
      return null;
    }
    
    const data: WikidataSearchResult = await response.json();
    
    if (data.search && data.search.length > 0) {
      return data.search[0].id;
    }
    
    return null;
  } catch (error) {
    console.error(`Error searching Wikidata for ${personName}:`, error);
    return null;
  }
}

interface WikidataEntity {
  entities: {
    [key: string]: {
      claims?: {
        P570?: Array<{ // death date
          mainsnak: {
            datavalue?: {
              value: {
                time: string;
              };
            };
          };
        }>;
        P1196?: Array<{ // manner of death
          mainsnak: {
            datavalue?: {
              value: {
                id: string;
              };
            };
          };
        }>;
        P509?: Array<{ // cause of death
          mainsnak: {
            datavalue?: {
              value: {
                id: string;
              };
            };
          };
        }>;
        P106?: Array<{ // occupation
          mainsnak: {
            datavalue?: {
              value: {
                id: string;
              };
            };
          };
        }>;
        P27?: Array<{ // country of citizenship
          mainsnak: {
            datavalue?: {
              value: {
                id: string;
              };
            };
          };
        }>;
      };
    };
  };
}

async function getWikidataDetails(qid: string): Promise<{
  deathDate: string | null;
  deathCause: string | null;
  occupation: string | null;
  country: string | null;
}> {
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&languages=tr&format=json&origin=*`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Wikidata entity error for ${qid}: ${response.status}`);
      return { deathDate: null, deathCause: null, occupation: null, country: null };
    }
    
    const data: WikidataEntity = await response.json();
    const entity = data.entities[qid];
    
    if (!entity || !entity.claims) {
      return { deathDate: null, deathCause: null, occupation: null, country: null };
    }
    
    // Extract death date (P570)
    let deathDate: string | null = null;
    if (entity.claims.P570 && entity.claims.P570[0].mainsnak.datavalue) {
      const timeValue = entity.claims.P570[0].mainsnak.datavalue.value.time;
      // Convert from +1938-11-10T00:00:00Z to 1938-11-10
      deathDate = timeValue.substring(1, 11);
    }
    
    // Extract cause/manner of death
    let deathCause: string | null = null;
    if (entity.claims.P1196 && entity.claims.P1196[0].mainsnak.datavalue) {
      const mannerQID = entity.claims.P1196[0].mainsnak.datavalue.value.id;
      deathCause = await getWikidataLabel(mannerQID);
    } else if (entity.claims.P509 && entity.claims.P509[0].mainsnak.datavalue) {
      const causeQID = entity.claims.P509[0].mainsnak.datavalue.value.id;
      deathCause = await getWikidataLabel(causeQID);
    }
    
    // Extract occupation (P106)
    let occupation: string | null = null;
    if (entity.claims.P106 && entity.claims.P106[0].mainsnak.datavalue) {
      const occupationQID = entity.claims.P106[0].mainsnak.datavalue.value.id;
      occupation = await getWikidataLabel(occupationQID);
    }
    
    // Extract country (P27)
    let country: string | null = null;
    if (entity.claims.P27 && entity.claims.P27[0].mainsnak.datavalue) {
      const countryQID = entity.claims.P27[0].mainsnak.datavalue.value.id;
      country = await getWikidataLabel(countryQID);
    }
    
    return { deathDate, deathCause, occupation, country };
  } catch (error) {
    console.error(`Error fetching Wikidata details for ${qid}:`, error);
    return { deathDate: null, deathCause: null, occupation: null, country: null };
  }
}

async function getWikidataLabel(qid: string): Promise<string | null> {
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&languages=tr&props=labels&format=json&origin=*`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    const label = data.entities[qid]?.labels?.tr?.value;
    return label || null;
  } catch (error) {
    return null;
  }
}

function categorizeDeathCause(deathCauseText: string): string {
  const cause = deathCauseText.toLocaleLowerCase('tr-TR');
  
  if (cause.includes('kurşun') || cause.includes('ateşli silah') || 
      cause.includes('suikast') || cause.includes('öldürüldü') ||
      cause.includes('cinayet') || cause.includes('bomba') ||
      cause.includes('işkence') || cause.includes('linç') ||
      cause.includes('katledil') || cause.includes('vuruldu') ||
      cause.includes('öldürül') || cause.includes('idam') ||
      cause.includes('asıldı') || cause.includes('kurşuna dizil')) {
    return 'suikast';
  }
  
  if (cause.includes('kaza') || cause.includes('trafik') || 
      cause.includes('uçak') || cause.includes('helikopter') ||
      cause.includes('yangın')) {
    return 'kaza';
  }
  
  if (cause.includes('intihar')) {
    return 'intihar';
  }
  
  return 'hastalik';
}

function createSlug(name: string): string {
  return name
    .toLocaleLowerCase('tr-TR')
    .replace(/İ/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/û/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// List of Turkish historical figures to add
const newPeople = [
  "Fevzi Çakmak",
  "Kazım Karabekir",
  "Ali Fuat Cebesoy",
  "Rauf Orbay",
  "Fatin Rüştü Zorlu",
  "Hasan Polatkan",
  "Nuri Conker",
  "Kazım Özalp",
  "Kâzım Dirik",
  "Mahmut Esat Bozkurt",
  "Tevfik Rüştü Aras",
  "Ahmet Fikri Tüzer",
  "Fahrettin Altay",
  "İhsan Sabri Çağlayangil",
  "Turan Güneş",
  "Halide Edip Adıvar",
  "Yakup Kadri Karaosmanoğlu",
  "Falih Rıfkı Atay",
  "Şevket Süreyya Aydemir",
  "Yunus Nadi Abalıoğlu",
  "Hasan Âli Yücel",
  "Ziya Gökalp",
  "Hamdullah Suphi Tanrıöver",
  "Sabiha Gökçen",
  "Cemal Madanoğlu",
  "İsmet Sezgin",
  "Turhan Feyzioğlu",
  "Rauf Denktaş",
  "Fazıl Küçük",
  "Enver Ziya Karal",
  "Ekrem Akurgal",
  "Halil İnalcık"
];

async function main() {
  console.log(`\n🚀 Starting to add ${newPeople.length} Turkish historical figures...\n`);
  
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;
  
  for (const personName of newPeople) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing: ${personName}`);
    console.log('='.repeat(60));
    
    try {
      // Check if person already exists
      const existingPerson = await db.select()
        .from(persons)
        .where(eq(persons.name, personName))
        .limit(1);
      
      if (existingPerson.length > 0) {
        console.log(`⏭ Skipping ${personName} - already exists in database`);
        skipCount++;
        continue;
      }
      
      // Step 1: Get Wikidata QID
      console.log(`📍 Searching Wikidata for QID...`);
      const qid = await getWikidataQID(personName);
      
      if (!qid) {
        console.error(`❌ Could not find Wikidata QID for ${personName}`);
        failCount++;
        continue;
      }
      
      console.log(`✓ Found QID: ${qid}`);
      
      // Check if QID already exists
      const existingQID = await db.select()
        .from(persons)
        .where(eq(persons.qid, qid))
        .limit(1);
      
      if (existingQID.length > 0) {
        console.log(`⏭ Skipping ${personName} - QID ${qid} already exists (${existingQID[0].name})`);
        skipCount++;
        continue;
      }
      
      // Step 2: Get Wikidata details
      console.log(`📊 Fetching Wikidata details...`);
      const wikidataDetails = await getWikidataDetails(qid);
      console.log(`✓ Death date: ${wikidataDetails.deathDate || 'Unknown'}`);
      console.log(`✓ Death cause: ${wikidataDetails.deathCause || 'Unknown'}`);
      console.log(`✓ Occupation: ${wikidataDetails.occupation || 'Unknown'}`);
      console.log(`✓ Country: ${wikidataDetails.country || 'Unknown'}`);
      
      // Step 3: Get full Wikipedia description
      console.log(`📚 Fetching full Wikipedia article...`);
      const wikipediaData = await getFullWikipediaData(personName);
      
      if (!wikipediaData.description) {
        console.error(`❌ Could not fetch Wikipedia description for ${personName}`);
        failCount++;
        continue;
      }
      
      // Step 4: Determine category
      const deathCauseText = wikidataDetails.deathCause || "bilinmiyor";
      const categorySlug = categorizeDeathCause(deathCauseText);
      console.log(`✓ Category: ${categorySlug}`);
      
      // Get category ID
      const categoryResult = await db.select()
        .from(categories)
        .where(eq(categories.slug, categorySlug))
        .limit(1);
      
      if (categoryResult.length === 0) {
        console.error(`❌ Category ${categorySlug} not found`);
        failCount++;
        continue;
      }
      
      const categoryId = categoryResult[0].id;
      
      // Step 5: Get or create country
      const countryName = wikidataDetails.country || "Bilinmiyor";
      let countryId: number;
      
      const existingCountry = await db.select()
        .from(countries)
        .where(eq(countries.name, countryName))
        .limit(1);
      
      if (existingCountry.length > 0) {
        countryId = existingCountry[0].id;
      } else {
        const [newCountry] = await db.insert(countries).values({
          name: countryName,
          slug: createSlug(countryName)
        }).returning();
        countryId = newCountry.id;
        console.log(`✓ Created new country: ${countryName}`);
      }
      
      // Step 6: Get or create profession
      const professionName = wikidataDetails.occupation || "Bilinmiyor";
      let professionId: number;
      
      const existingProfession = await db.select()
        .from(professions)
        .where(eq(professions.name, professionName))
        .limit(1);
      
      if (existingProfession.length > 0) {
        professionId = existingProfession[0].id;
      } else {
        const [newProfession] = await db.insert(professions).values({
          name: professionName,
          slug: createSlug(professionName)
        }).returning();
        professionId = newProfession.id;
        console.log(`✓ Created new profession: ${professionName}`);
      }
      
      // Step 7: Create death cause
      const [deathCauseResult] = await db.insert(deathCauses).values({
        name: deathCauseText,
        categoryId
      }).returning();
      
      // Step 8: Insert person
      const [newPerson] = await db.insert(persons).values({
        qid,
        name: personName,
        slug: createSlug(personName),
        description: wikipediaData.description,
        imageUrl: wikipediaData.imageUrl,
        deathDate: wikidataDetails.deathDate,
        categoryId,
        countryId,
        professionId,
        deathCauseId: deathCauseResult.id
      }).returning();
      
      console.log(`✅ Successfully added ${personName} (ID: ${newPerson.id})`);
      successCount++;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Error processing ${personName}:`, error);
      failCount++;
    }
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Final Results:`);
  console.log(`   ✅ Successfully added: ${successCount}`);
  console.log(`   ⏭  Skipped (already exists): ${skipCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📝 Total processed: ${newPeople.length}`);
  console.log('='.repeat(60));
}

main()
  .then(() => {
    console.log('\n✨ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
