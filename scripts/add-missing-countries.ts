import { db } from '../server/db';
import { countries } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Missing countries to add - covering major world leaders
const MISSING_COUNTRIES = [
  // Asia
  { name: 'Japonya', slug: 'japonya' },
  { name: 'Hindistan', slug: 'hindistan' },
  { name: 'İran', slug: 'iran' },
  { name: 'Çin', slug: 'cin' },
  { name: 'Pakistan', slug: 'pakistan' },
  { name: 'Endonezya', slug: 'endonezya' },
  { name: 'Tayland', slug: 'tayland' },
  { name: 'Filipinler', slug: 'filipinler' },
  { name: 'Vietnam', slug: 'vietnam' },
  { name: 'Güney Kore', slug: 'guney-kore' },
  { name: 'Kuzey Kore', slug: 'kuzey-kore' },
  { name: 'İsrail', slug: 'israil' },
  { name: 'Suudi Arabistan', slug: 'suudi-arabistan' },
  { name: 'Irak', slug: 'irak' },
  { name: 'Suriye', slug: 'suriye' },
  
  // Europe
  { name: 'Polonya', slug: 'polonya' },
  { name: 'Hollanda', slug: 'hollanda' },
  { name: 'Belçika', slug: 'belcika' },
  { name: 'Portekiz', slug: 'portekiz' },
  { name: 'Yunanistan', slug: 'yunanistan' },
  { name: 'Norveç', slug: 'norvec' },
  { name: 'Danimarka', slug: 'danimarka' },
  { name: 'Finlandiya', slug: 'finlandiya' },
  { name: 'Romanya', slug: 'romanya' },
  { name: 'Macaristan', slug: 'macaristan' },
  { name: 'Bulgaristan', slug: 'bulgaristan' },
  { name: 'Sırbistan', slug: 'sirbistan' },
  { name: 'Yugoslavya', slug: 'yugoslavya' }, // Historical
  { name: 'Ukrayna', slug: 'ukrayna' },
  
  // Americas
  { name: 'Meksika', slug: 'meksika' },
  { name: 'Küba', slug: 'kuba' },
  { name: 'Şili', slug: 'chile' },
  { name: 'Kolombiya', slug: 'kolombiya' },
  { name: 'Venezuela', slug: 'venezuela' },
  { name: 'Peru', slug: 'peru' },
  { name: 'Ekvador', slug: 'ekvador' },
  { name: 'Uruguay', slug: 'uruguay' },
  { name: 'Paraguay', slug: 'paraguay' },
  { name: 'Bolivya', slug: 'bolivya' },
  
  // Africa
  { name: 'Güney Afrika', slug: 'guney-afrika' },
  { name: 'Gana', slug: 'gana' },
  { name: 'Etiyopya', slug: 'etiyopya' },
  { name: 'Zimbabve', slug: 'zimbabve' },
  { name: 'Nijerya', slug: 'nijerya' },
  { name: 'Mısır', slug: 'misir' },
  { name: 'Kongo Demokratik Cumhuriyeti', slug: 'kongo-demokratik-cumhuriyeti' },
  { name: 'Zaire', slug: 'zaire' }, // Historical (former name of DR Congo)
  { name: 'Angola', slug: 'angola' },
  { name: 'Mozambik', slug: 'mozambik' },
  { name: 'Tanzanya', slug: 'tanzanya' },
  { name: 'Uganda', slug: 'uganda' },
  { name: 'Cezayir', slug: 'cezayir' },
  { name: 'Fas', slug: 'fas' },
  { name: 'Tunus', slug: 'tunus' },
  { name: 'Libya', slug: 'libya' },
];

async function addMissingCountries() {
  console.log('🌍 Adding missing countries to database...\n');

  let added = 0;
  let skipped = 0;

  for (const country of MISSING_COUNTRIES) {
    try {
      // Check if already exists
      const existing = await db.select()
        .from(countries)
        .where(eq(countries.slug, country.slug))
        .limit(1);

      if (existing.length > 0) {
        console.log(`⏭️  Skipped (already exists): ${country.name}`);
        skipped++;
        continue;
      }

      // Insert
      await db.insert(countries).values({
        name: country.name,
        slug: country.slug,
      });

      console.log(`✅ Added: ${country.name} (${country.slug})`);
      added++;
    } catch (error) {
      console.error(`❌ Error adding ${country.name}:`, error);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Added: ${added}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   📝 Total: ${MISSING_COUNTRIES.length}`);
}

addMissingCountries().catch(console.error);
