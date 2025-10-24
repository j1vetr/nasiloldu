import { db } from '../server/db';
import { persons, countries } from '../shared/schema';
import { eq, and } from 'drizzle-orm';

// Leaders and their expected country slugs
const LEADER_COUNTRY_FIXES: Record<string, string> = {
  'pierre-trudeau': 'canada',
  'lester-b-pearson': 'canada',
  'john-diefenbaker': 'canada',
  'konrad-adenauer': 'almanya',
  'otto-von-bismarck': 'almanya',
  'kaiser-wilhelm-ii': 'almanya',
  'franz-joseph-i': 'austria',
  'josip-broz-tito': 'yugoslavya',
  'slobodan-milo-evi': 'sırbistan',
  'juan-per-n': 'argentina',
  'eva-per-n': 'argentina',
  'augusto-pinochet': 'chile',
  'jorge-rafael-videla': 'argentina',
  'get-lio-vargas': 'brazil',
  'juscelino-kubitschek': 'brazil',
  'ruhollah-khomeini': 'iran',
  'mohammad-reza-i-of-iran': 'iran',
  'mahatma-gandhi': 'hindistan',
  'indira-gandhi': 'hindistan',
  'haile-selassie': 'etiyopya',
  'kwame-nkrumah': 'gana',
  'patrice-lumumba': 'kongo-demokratik-cumhuriyeti',
  'mobutu-sese-seko': 'zaire',
  'robert-mugabe': 'zimbabve',
  'f-w-de-klerk': 'guney-afrika',
};

async function fixLeaderCountries() {
  console.log('🚀 Fixing leader country assignments...\n');

  let fixed = 0;
  let notFound = 0;
  let alreadyCorrect = 0;

  for (const [slug, expectedCountrySlug] of Object.entries(LEADER_COUNTRY_FIXES)) {
    console.log(`🔍 Processing: ${slug} → ${expectedCountrySlug}`);

    // Find person
    const person = await db.select()
      .from(persons)
      .where(eq(persons.slug, slug))
      .limit(1);

    if (person.length === 0) {
      console.log(`⚠️  Person not found: ${slug}`);
      notFound++;
      continue;
    }

    // Find expected country
    const country = await db.select()
      .from(countries)
      .where(eq(countries.slug, expectedCountrySlug))
      .limit(1);

    if (country.length === 0) {
      console.log(`⚠️  Country not found: ${expectedCountrySlug}`);
      notFound++;
      continue;
    }

    // Check if already correct
    if (person[0].countryId === country[0].id) {
      console.log(`✓ Already correct: ${slug}`);
      alreadyCorrect++;
      continue;
    }

    // Update
    await db.update(persons)
      .set({ countryId: country[0].id })
      .where(eq(persons.id, person[0].id));

    console.log(`✅ Updated: ${slug} → ${expectedCountrySlug}`);
    fixed++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Fixed: ${fixed}`);
  console.log(`   ✓ Already Correct: ${alreadyCorrect}`);
  console.log(`   ⚠️  Not Found: ${notFound}`);
  console.log(`   📝 Total: ${Object.keys(LEADER_COUNTRY_FIXES).length}`);
}

fixLeaderCountries().catch(console.error);
