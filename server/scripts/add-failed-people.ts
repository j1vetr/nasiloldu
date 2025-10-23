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

// Failed people with corrected Wikipedia titles and manual Wikidata info
const failedPeople = [
  {
    name: "Kâzım Karabekir",
    wikipediaTitle: "Kâzım Karabekir",
    qid: "Q269182",
    deathDate: "1948-01-26",
    deathCause: "doğal sebepler",
    profession: "Asker",
    country: "Türkiye"
  },
  {
    name: "Kâzım Özalp",
    wikipediaTitle: "Kâzım Özalp",
    qid: "Q925035",
    deathDate: "1968-06-06",
    deathCause: "doğal sebepler",
    profession: "Asker",
    country: "Türkiye"
  },
  {
    name: "Halide Edib Adıvar",
    wikipediaTitle: "Halide Edib Adıvar",
    qid: "Q234289",
    deathDate: "1964-01-09",
    deathCause: "doğal sebepler",
    profession: "Yazar",
    country: "Türkiye"
  },
  {
    name: "Yakup Kadri Karaosmanoğlu",
    wikipediaTitle: "Yakup Kadri Karaosmanoğlu",
    qid: "Q442578",
    deathDate: "1974-12-13",
    deathCause: "doğal sebepler",
    profession: "Yazar",
    country: "Türkiye"
  },
  {
    name: "Şevket Süreyya Aydemir",
    wikipediaTitle: "Şevket Süreyya Aydemir",
    qid: "Q2276606",
    deathDate: "1976-10-25",
    deathCause: "doğal sebepler",
    profession: "Yazar",
    country: "Türkiye"
  },
  {
    name: "Cemal Madanoğlu",
    wikipediaTitle: "Cemal Madanoğlu",
    qid: "Q2943760",
    deathDate: "2001-04-03",
    deathCause: "doğal sebepler",
    profession: "Asker",
    country: "Türkiye"
  },
  {
    name: "Turhan Feyzioğlu",
    wikipediaTitle: "Turhan Feyzioğlu",
    qid: "Q2458942",
    deathDate: "1988-03-24",
    deathCause: "kalp yetmezliği",
    profession: "siyasetçi",
    country: "Türkiye"
  }
];

async function main() {
  console.log(`\n🚀 Starting to add ${failedPeople.length} failed people with corrected Wikipedia titles...\n`);
  
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;
  
  for (const person of failedPeople) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing: ${person.name}`);
    console.log('='.repeat(60));
    
    try {
      // Check if person already exists
      const existingPerson = await db.select()
        .from(persons)
        .where(eq(persons.qid, person.qid))
        .limit(1);
      
      if (existingPerson.length > 0) {
        console.log(`⏭ Skipping ${person.name} - already exists in database`);
        skipCount++;
        continue;
      }
      
      // Get full Wikipedia description
      console.log(`📚 Fetching full Wikipedia article from: ${person.wikipediaTitle}...`);
      const wikipediaData = await getFullWikipediaData(person.wikipediaTitle);
      
      if (!wikipediaData.description || wikipediaData.description.length < 100) {
        console.error(`❌ Could not fetch sufficient Wikipedia description for ${person.name}`);
        failCount++;
        continue;
      }
      
      // Determine category
      const categorySlug = categorizeDeathCause(person.deathCause);
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
      
      // Get or create country
      let countryId: number;
      const existingCountry = await db.select()
        .from(countries)
        .where(eq(countries.name, person.country))
        .limit(1);
      
      if (existingCountry.length > 0) {
        countryId = existingCountry[0].id;
      } else {
        const [newCountry] = await db.insert(countries).values({
          name: person.country,
          slug: createSlug(person.country)
        }).returning();
        countryId = newCountry.id;
        console.log(`✓ Created new country: ${person.country}`);
      }
      
      // Get or create profession
      let professionId: number;
      const existingProfession = await db.select()
        .from(professions)
        .where(eq(professions.name, person.profession))
        .limit(1);
      
      if (existingProfession.length > 0) {
        professionId = existingProfession[0].id;
      } else {
        const [newProfession] = await db.insert(professions).values({
          name: person.profession,
          slug: createSlug(person.profession)
        }).returning();
        professionId = newProfession.id;
        console.log(`✓ Created new profession: ${person.profession}`);
      }
      
      // Create death cause
      const [deathCauseResult] = await db.insert(deathCauses).values({
        name: person.deathCause,
        categoryId
      }).returning();
      
      // Insert person
      const [newPerson] = await db.insert(persons).values({
        qid: person.qid,
        name: person.name,
        slug: createSlug(person.name),
        description: wikipediaData.description,
        imageUrl: wikipediaData.imageUrl,
        deathDate: person.deathDate,
        categoryId,
        countryId,
        professionId,
        deathCauseId: deathCauseResult.id
      }).returning();
      
      console.log(`✅ Successfully added ${person.name} (ID: ${newPerson.id})`);
      successCount++;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Error processing ${person.name}:`, error);
      failCount++;
    }
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Final Results:`);
  console.log(`   ✅ Successfully added: ${successCount}`);
  console.log(`   ⏭  Skipped (already exists): ${skipCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📝 Total processed: ${failedPeople.length}`);
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
