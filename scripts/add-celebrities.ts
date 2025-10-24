import { db } from '../server/db';
import { persons, countries, professions, categories, deathCauses } from '../shared/schema';
import { eq, and } from 'drizzle-orm';

// List of celebrities to add
const CELEBRITIES = [
  // Turkish Actors
  "Cüneyt Arkın",
  "Tarık Akan",
  "Kartal Tibet",
  "Tuncel Kurtiz",
  "Ferhan Şensoy",
  "Levent Kırca",
  "Oya Aydoğan",
  "Fatma Girik",
  "Ekrem Bora",
  "Erol Günaydın",
  "Münir Özkul",
  "Adile Naşit",
  "Ayhan Işık",
  "Sadri Alışık",
  "Yıldırım Önal",
  "Savaş Dinçel",
  "Yalçın Menteş",
  "Zeki Alasya",
  "Erol Taş",
  "Ali Şen",
  "Süleyman Turan",
  "Ayşen Gruda",
  "Yıldız Kenter",
  "Müşfik Kenter",
  "Gülriz Sururi",
  // Turkish Musicians
  "Zeki Müren",
  "Barış Manço",
  "Cem Karaca",
  "Kayahan",
  "Tanju Okan",
  "Fikret Kızılok",
  "Ahmet Kaya",
  "Müslüm Gürses",
  "Neşet Ertaş",
  "Aşık Mahzuni Şerif",
  "Aşık Veysel",
  "Ali Ekber Çiçek",
  "Ruhi Su",
  "Hasan Mutlucan",
  "İbrahim Erkal",
  "Harun Kolçak",
  "Oğuz Yılmaz",
  "Dilber Ay",
  // Turkish Scientists/Writers
  "Aydın Boysan",
  "Oktay Sinanoğlu",
  "Türkan Saylan",
  "Ahmet Mete Işıkara",
  "Attilâ İlhan",
  "Cemal Süreya",
  "Can Yücel",
  "Turgut Uyar",
  "Edip Cansever",
  "Tomris Uyar",
  "Sezai Karakoç",
  "Cahit Zarifoğlu",
  "Ahmet Arif",
  "Behçet Necatigil",
  "Fazıl Hüsnü Dağlarca",
  "Hüseyin Nihal Atsız",
  // Turkish Politicians
  "Erdal İnönü",
  "İsmail Cem",
  // International Politicians
  "Aliya İzzetbegoviç",
  "Mihail Gorbaçov",
  "Helmut Kohl",
  "Margaret Thatcher",
  "John F. Kennedy",
  "Robert F. Kennedy",
  "Ronald Reagan",
  "Richard Nixon",
  "George H. W. Bush",
  "Nelson Mandela",
  "Fidel Castro",
  "Che Guevara",
  "Hugo Chavez",
  "Yasser Arafat",
  "Saddam Hüseyin",
  "Muammer Kaddafi",
  "Osama bin Laden",
  "Ariel Sharon",
  // International Athletes
  "Diego Maradona",
  "Pelé",
  "Ayrton Senna",
  "Kobe Bryant",
  // International Actors
  "Paul Walker",
  "Heath Ledger",
  "Robin Williams",
  // International Musicians
  "Chester Bennington",
  "Chris Cornell",
  "Avicii",
  "Amy Winehouse",
  "Michael Jackson",
  "Whitney Houston",
  "Prince",
  "George Michael",
  "David Bowie",
  "Freddie Mercury",
  "Elvis Presley",
  "John Lennon",
  "Bob Marley",
  "Tupac Shakur",
  "The Notorious B.I.G.",
  "Kurt Cobain"
];

interface WikidataItem {
  name: string;
  qid: string;
  birthDate: string | null;
  deathDate: string | null;
  deathPlace: string | null;
  causeOfDeath: string | null;
  occupation: string[];
  countryOfCitizenship: string[];
  image: string | null;
  description: string;
}

async function searchWikidataQID(name: string): Promise<string | null> {
  try {
    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&format=json&limit=1`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'nasiloldu.net/1.0 (https://nasiloldu.net; info@nasiloldu.net)'
      }
    });
    const data = await response.json();
    
    if (data.search && data.search.length > 0) {
      return data.search[0].id;
    }
    return null;
  } catch (error) {
    console.error(`Error searching for ${name}:`, error);
    return null;
  }
}

async function resolveWikidataLabel(qid: string | null): Promise<string | null> {
  if (!qid) return null;
  
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

async function fetchWikidataInfo(qid: string): Promise<WikidataItem | null> {
  try {
    const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'nasiloldu.net/1.0 (https://nasiloldu.net; info@nasiloldu.net)'
      }
    });
    const data = await response.json();
    
    const entity = data.entities[qid];
    if (!entity) return null;

    const claims = entity.claims;
    
    // Helper to extract value
    const getValue = (prop: string, index = 0) => {
      if (!claims[prop] || !claims[prop][index]) return null;
      const claim = claims[prop][index];
      const snak = claim.mainsnak;
      
      if (snak.datatype === 'time') {
        return snak.datavalue?.value?.time?.replace(/^\+/, '').split('T')[0];
      }
      if (snak.datatype === 'wikibase-item') {
        return snak.datavalue?.value?.id;
      }
      if (snak.datatype === 'string') {
        return snak.datavalue?.value;
      }
      return null;
    };

    // Get all values for multi-value properties
    const getMultiValue = (prop: string) => {
      if (!claims[prop]) return [];
      return claims[prop]
        .map((claim: any) => {
          const snak = claim.mainsnak;
          if (snak.datatype === 'wikibase-item') {
            return snak.datavalue?.value?.id;
          }
          return null;
        })
        .filter((v: any) => v !== null);
    };

    // Get label
    const getName = (qid: string, lang = 'en') => {
      return entity.labels?.[lang]?.value || qid;
    };

    const birthDate = getValue('P569');
    const deathDate = getValue('P570');
    const deathPlaceQID = getValue('P20');
    const causeOfDeathQID = getValue('P509');
    const occupationQIDs = getMultiValue('P106');
    const countryQIDs = getMultiValue('P27');
    const image = getValue('P18');

    // Resolve death place QID to readable name
    const deathPlaceName = deathPlaceQID ? await resolveWikidataLabel(deathPlaceQID) : null;

    return {
      name: entity.labels?.en?.value || entity.labels?.tr?.value || qid,
      qid,
      birthDate,
      deathDate,
      deathPlace: deathPlaceName || 'Bilinmiyor',
      causeOfDeath: causeOfDeathQID,
      occupation: occupationQIDs,
      countryOfCitizenship: countryQIDs,
      image: image ? `https://commons.wikimedia.org/wiki/Special:FilePath/${image}?width=800` : null,
      description: entity.descriptions?.en?.value || entity.descriptions?.tr?.value || ''
    };
  } catch (error) {
    console.error(`Error fetching Wikidata info for ${qid}:`, error);
    return null;
  }
}

async function mapProfessionQIDToDBId(qids: string[]): Promise<number | null> {
  // Common profession mappings
  const professionMap: Record<string, string> = {
    'Q33999': 'oyuncu', // actor
    'Q2259451': 'oyuncu', // stage actor
    'Q10800557': 'oyuncu', // film actor
    'Q639669': 'müzisyen', // musician
    'Q177220': 'şarkıcı', // singer
    'Q36834': 'yazar', // composer
    'Q36180': 'yazar', // writer
    'Q482980': 'yazar', // author
    'Q11774202': 'yazar', // essayist
    'Q49757': 'şair', // poet
    'Q82955': 'politikacı', // politician
    'Q6499736': 'politikacı', // statesman
    'Q15253558': 'aktivist', // activist
    'Q901': 'bilim-insanı', // scientist
    'Q170790': 'matematikçi', // mathematician
    'Q169470': 'fizikçi', // physicist
    'Q937857': 'futbolcu', // footballer
    'Q5137571': 'basketbolcu', // basketball player
    'Q10843402': 'sporcu', // racing driver
    'Q3387717': 'oyuncu', // entertainer
    'Q1930187': 'gazeteci', // journalist
    'Q15980158': 'oyuncu', // film director
    'Q2526255': 'yönetmen', // film director
    'Q3282637': 'yönetmen', // producer
    'Q947873': 'oyuncu', // television actor
  };

  // Try to find a matching profession
  for (const qid of qids) {
    const slug = professionMap[qid];
    if (slug) {
      const profession = await db.select()
        .from(professions)
        .where(eq(professions.slug, slug))
        .limit(1);
      
      if (profession.length > 0) {
        return profession[0].id;
      }
    }
  }

  // Default to "oyuncu" if nothing found
  const defaultProf = await db.select()
    .from(professions)
    .where(eq(professions.slug, 'oyuncu'))
    .limit(1);
  
  return defaultProf.length > 0 ? defaultProf[0].id : null;
}

async function mapCountryQIDToDBId(qids: string[]): Promise<number | null> {
  // Common country mappings
  const countryMap: Record<string, string> = {
    'Q43': 'turkiye', // Turkey
    'Q30': 'amerika-birlesik-devletleri', // USA
    'Q145': 'ingiltere', // UK
    'Q183': 'almanya', // Germany
    'Q142': 'fransa', // France
    'Q38': 'italya', // Italy
    'Q29': 'ispanya', // Spain
    'Q159': 'rusya', // Russia
    'Q148': 'cin', // China
    'Q17': 'japonya', // Japan
    'Q155': 'brezilya', // Brazil
    'Q96': 'meksika', // Mexico
    'Q228': 'andora', // Andorra
    'Q794': 'iran', // Iran
    'Q668': 'hindistan', // India
    'Q717': 'venezuella', // Venezuela
    'Q414': 'arjantin', // Argentina
    'Q219': 'bulgaristan', // Bulgaria
    'Q258': 'guney-afrika', // South Africa
    'Q298': 'sili', // Chile
    'Q408': 'avustralya', // Australia
    'Q40': 'avusturya', // Austria
    'Q736': 'ekvador', // Ecuador
    'Q225': 'bosna-hersek', // Bosnia and Herzegovina
    'Q403': 'sırbistan', // Serbia
    'Q212': 'ukrayna', // Ukraine
    'Q414': 'arjantin', // Argentina
    'Q252': 'endonezya', // Indonesia
    'Q800': 'kosta-rika', // Costa Rica
    'Q219': 'bulgaristan', // Bulgaria
    'Q967': 'burundi', // Burundi
    'Q837': 'nepal', // Nepal
    'Q881': 'vietnam', // Vietnam
    'Q79': 'misir', // Egypt
    'Q794': 'iran', // Iran
    'Q801': 'israil', // Israel
    'Q810': 'urdun', // Jordan
    'Q1033': 'nijerya', // Nigeria
  };

  // Try to find a matching country
  for (const qid of qids) {
    const slug = countryMap[qid];
    if (slug) {
      const country = await db.select()
        .from(countries)
        .where(eq(countries.slug, slug))
        .limit(1);
      
      if (country.length > 0) {
        return country[0].id;
      }
    }
  }

  // If country not found, try to get "Bilinmiyor" or first country
  const unknownCountry = await db.select()
    .from(countries)
    .where(eq(countries.name, 'Bilinmiyor'))
    .limit(1);
  
  if (unknownCountry.length > 0) {
    return unknownCountry[0].id;
  }

  // Last resort: first country in DB
  const firstCountry = await db.select().from(countries).limit(1);
  return firstCountry.length > 0 ? firstCountry[0].id : null;
}

async function getCategoryByDeathCause(causeQID: string | null): Promise<number> {
  // Illness category is default
  const illnessCategory = await db.select()
    .from(categories)
    .where(eq(categories.slug, 'hastalik'))
    .limit(1);
  
  if (!causeQID) {
    return illnessCategory[0].id;
  }

  // Map cause of death to categories
  const assassinationCauses = ['Q3882219', 'Q18433431', 'Q3882219', 'Q149086']; // murder, assassination, homicide, execution
  const accidentCauses = ['Q104903', 'Q9687', 'Q171558', 'Q8454']; // traffic accident, accident, car accident, aviation accident
  const suicideCauses = ['Q10737']; // suicide

  if (assassinationCauses.includes(causeQID)) {
    const category = await db.select()
      .from(categories)
      .where(eq(categories.slug, 'suikast'))
      .limit(1);
    return category[0]?.id || illnessCategory[0].id;
  }

  if (accidentCauses.includes(causeQID)) {
    const category = await db.select()
      .from(categories)
      .where(eq(categories.slug, 'kaza'))
      .limit(1);
    return category[0]?.id || illnessCategory[0].id;
  }

  if (suicideCauses.includes(causeQID)) {
    const category = await db.select()
      .from(categories)
      .where(eq(categories.slug, 'intihar'))
      .limit(1);
    return category[0]?.id || illnessCategory[0].id;
  }

  return illnessCategory[0].id;
}

async function addPersonToDB(person: WikidataItem) {
  try {
    // Check if person already exists
    const existing = await db.select()
      .from(persons)
      .where(eq(persons.qid, person.qid))
      .limit(1);
    
    if (existing.length > 0) {
      console.log(`⏭️  ${person.name} already exists in database`);
      return;
    }

    // Map profession
    const professionId = await mapProfessionQIDToDBId(person.occupation);
    if (!professionId) {
      console.log(`❌ Could not map profession for ${person.name}`);
      return;
    }

    // Map country
    const countryId = await mapCountryQIDToDBId(person.countryOfCitizenship);
    if (!countryId) {
      console.log(`❌ Could not map country for ${person.name}`);
      return;
    }

    // Get category
    const categoryId = await getCategoryByDeathCause(person.causeOfDeath);

    // Get death cause ID if exists
    let deathCauseId = null;
    if (person.causeOfDeath) {
      const deathCause = await db.select()
        .from(deathCauses)
        .where(eq(deathCauses.qid, person.causeOfDeath))
        .limit(1);
      
      if (deathCause.length > 0) {
        deathCauseId = deathCause[0].id;
      }
    }

    // Create slug from name
    const slug = person.name
      .toLowerCase()
      .replace(/[ğ]/g, 'g')
      .replace(/[ü]/g, 'u')
      .replace(/[ş]/g, 's')
      .replace(/[ı]/g, 'i')
      .replace(/[ö]/g, 'o')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Insert person
    await db.insert(persons).values({
      name: person.name,
      slug,
      qid: person.qid,
      birthDate: person.birthDate || null,
      deathDate: person.deathDate || null,
      deathPlace: person.deathPlace || 'Bilinmiyor',
      description: person.description || 'Bilgi yok',
      imageUrl: person.image || null,
      categoryId,
      countryId,
      professionId,
      deathCauseId
    });

    console.log(`✅ Added ${person.name} (${person.qid})`);
  } catch (error) {
    console.error(`❌ Error adding ${person.name}:`, error);
  }
}

async function main() {
  console.log(`🚀 Starting to add ${CELEBRITIES.length} celebrities...\n`);

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const name of CELEBRITIES) {
    console.log(`\n🔍 Processing: ${name}`);
    
    // Search for QID
    const qid = await searchWikidataQID(name);
    if (!qid) {
      console.log(`❌ Could not find QID for ${name}`);
      failed++;
      continue;
    }

    console.log(`   Found QID: ${qid}`);

    // Fetch Wikidata info
    const info = await fetchWikidataInfo(qid);
    if (!info || !info.deathDate) {
      console.log(`❌ Could not fetch info or person is alive: ${name}`);
      failed++;
      continue;
    }

    // Add to database
    await addPersonToDB(info);
    added++;

    // Sleep to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n\n📊 Summary:`);
  console.log(`   ✅ Added: ${added}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📝 Total: ${CELEBRITIES.length}`);
}

main().catch(console.error);
