import { db } from '../server/db';
import { persons } from '../shared/schema';
import { eq, like } from 'drizzle-orm';

async function resolveWikidataLabel(qid: string): Promise<string | null> {
  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&props=labels&languages=tr|en&format=json`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'nasiloldu.net/1.0 (https://nasiloldu.net; info@nasiloldu.net)'
      }
    });
    const data = await response.json();
    
    const entity = data.entities?.[qid];
    if (!entity) return null;
    
    // Try Turkish first, fallback to English
    return entity.labels?.tr?.value || entity.labels?.en?.value || null;
  } catch (error) {
    console.error(`Error resolving label for ${qid}:`, error);
    return null;
  }
}

async function fixDeathPlaces() {
  console.log('🚀 Fixing death places with Wikidata QIDs...\n');

  // Find all persons with deathPlace starting with "Q"
  const personsWithQIDs = await db.select()
    .from(persons)
    .where(like(persons.deathPlace, 'Q%'));

  console.log(`📊 Found ${personsWithQIDs.length} persons with QID death places\n`);

  let fixed = 0;
  let failed = 0;

  for (const person of personsWithQIDs) {
    const qid = person.deathPlace;
    if (!qid) continue;

    console.log(`🔍 Processing: ${person.name} (${qid})`);

    const label = await resolveWikidataLabel(qid);
    
    if (label) {
      await db.update(persons)
        .set({ deathPlace: label })
        .where(eq(persons.id, person.id));
      
      console.log(`✅ Updated: ${qid} → ${label}`);
      fixed++;
    } else {
      await db.update(persons)
        .set({ deathPlace: 'Bilinmiyor' })
        .where(eq(persons.id, person.id));
      
      console.log(`⚠️  Unknown: ${qid} → Bilinmiyor`);
      failed++;
    }

    // Sleep to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Fixed: ${fixed}`);
  console.log(`   ⚠️  Unknown: ${failed}`);
  console.log(`   📝 Total: ${personsWithQIDs.length}`);
}

fixDeathPlaces().catch(console.error);
