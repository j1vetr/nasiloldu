import { db } from '../server/db';
import { persons, countries, professions, categories, deathCauses } from '../shared/schema';
import { eq, and } from 'drizzle-orm';

// List of political leaders and historical figures to add
const CELEBRITIES = [
  // Turkish Leaders
  "Mustafa Kemal Atatürk",
  "İsmet İnönü",
  "Celal Bayar",
  "Adnan Menderes",
  "Turgut Özal",
  "Süleyman Demirel",
  "Bülent Ecevit",
  "Necmettin Erbakan",
  "Kenan Evren",
  "Rauf Denktaş",
  "Fazıl Küçük",
  // US Presidents
  "Abraham Lincoln",
  "John F. Kennedy",
  "Franklin D. Roosevelt",
  "Theodore Roosevelt",
  "George Washington",
  "Thomas Jefferson",
  "James Madison",
  "James Monroe",
  "Andrew Jackson",
  "William McKinley",
  "James Garfield",
  "Ulysses S. Grant",
  "Dwight D. Eisenhower",
  "Harry S. Truman",
  "Herbert Hoover",
  "Calvin Coolidge",
  "Woodrow Wilson",
  "Ronald Reagan",
  "George H. W. Bush",
  "Richard Nixon",
  "Lyndon B. Johnson",
  // British Leaders
  "Winston Churchill",
  "Margaret Thatcher",
  // French Leaders
  "Charles de Gaulle",
  "François Mitterrand",
  "Jacques Chirac",
  "Georges Pompidou",
  "Napoleon Bonaparte",
  "Louis XVI",
  "Louis XVIII",
  "Marie Antoinette",
  "Philippe Pétain",
  // European Dictators
  "Benito Mussolini",
  "Adolf Hitler",
  "Francisco Franco",
  // Soviet/Russian Leaders
  "Joseph Stalin",
  "Vladimir Lenin",
  "Nikita Khrushchev",
  "Leonid Brezhnev",
  "Boris Yeltsin",
  "Mikhail Gorbachev",
  // Asian Leaders
  "Mao Zedong",
  "Deng Xiaoping",
  "Chiang Kai-shek",
  "Emperor Hirohito",
  "Kim Il-sung",
  "Kim Jong-il",
  "Ho Chi Minh",
  "Pol Pot",
  // Middle East Leaders
  "Saddam Hussein",
  "Muammar Gaddafi",
  "Anwar Sadat",
  "Gamal Abdel Nasser",
  "Yasser Arafat",
  "Menachem Begin",
  "Golda Meir",
  "Yitzhak Rabin",
  "Shimon Peres",
  "David Ben-Gurion",
  // African Leaders
  "Haile Selassie",
  "Kwame Nkrumah",
  "Patrice Lumumba",
  "Mobutu Sese Seko",
  "Robert Mugabe",
  "Nelson Mandela",
  "F. W. de Klerk",
  // Canadian Leaders
  "Pierre Trudeau",
  "Lester B. Pearson",
  "John Diefenbaker",
  // German Leaders
  "Helmut Kohl",
  "Konrad Adenauer",
  "Otto von Bismarck",
  "Kaiser Wilhelm II",
  // Eastern European Leaders
  "Franz Joseph I",
  "Josip Broz Tito",
  "Slobodan Milosevic",
  // Latin American Leaders
  "Fidel Castro",
  "Che Guevara",
  "Hugo Chávez",
  "Juan Perón",
  "Eva Perón",
  "Augusto Pinochet",
  "Jorge Rafael Videla",
  "Getúlio Vargas",
  "Juscelino Kubitschek",
  "Dom Pedro II",
  // Iranian/Indian Leaders
  "Ruhollah Khomeini",
  "Mohammad Reza Pahlavi",
  "Mahatma Gandhi",
  "Indira Gandhi"
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
  // Comprehensive country QID mapping - all countries now in DB!
  const countryMap: Record<string, string> = {
    // Core countries
    'Q43': 'turkiye', // Turkey
    'Q30': 'amerika-birlesik-devletleri', // USA
    'Q145': 'birlesik-krallik', // UK
    'Q183': 'almanya', // Germany
    'Q142': 'fransa', // France
    'Q38': 'italy', // Italy
    'Q29': 'i-spanya', // Spain
    'Q159': 'rusya', // Russia
    'Q148': 'cin', // China
    'Q16': 'canada', // Canada ⭐ CRITICAL
    'Q155': 'brazil', // Brazil
    'Q414': 'argentina', // Argentina
    'Q408': 'australia', // Australia
    'Q40': 'austria', // Austria
    'Q114': 'kenya', // Kenya
    'Q27': 'ireland', // Ireland
    'Q34': 'sweden', // Sweden
    'Q39': 'switzerland', // Switzerland
    'Q664': 'new-zealand', // New Zealand
    
    // Asia
    'Q17': 'japonya', // Japan
    'Q668': 'hindistan', // India
    'Q794': 'iran', // Iran
    'Q843': 'pakistan', // Pakistan
    'Q252': 'endonezya', // Indonesia
    'Q869': 'tayland', // Thailand
    'Q928': 'filipinler', // Philippines
    'Q881': 'vietnam', // Vietnam
    'Q884': 'guney-kore', // South Korea
    'Q423': 'kuzey-kore', // North Korea
    'Q801': 'israil', // Israel
    'Q851': 'suudi-arabistan', // Saudi Arabia
    'Q796': 'irak', // Iraq
    'Q858': 'suriye', // Syria
    
    // Europe
    'Q36': 'polonya', // Poland
    'Q55': 'hollanda', // Netherlands
    'Q31': 'belcika', // Belgium
    'Q45': 'portekiz', // Portugal
    'Q41': 'yunanistan', // Greece
    'Q20': 'norvec', // Norway
    'Q35': 'danimarka', // Denmark
    'Q33': 'finlandiya', // Finland
    'Q218': 'romanya', // Romania
    'Q28': 'macaristan', // Hungary
    'Q219': 'bulgaristan', // Bulgaria
    'Q403': 'sirbistan', // Serbia
    'Q212': 'ukrayna', // Ukraine
    
    // Americas
    'Q96': 'meksika', // Mexico
    'Q241': 'kuba', // Cuba
    'Q298': 'chile', // Chile
    'Q739': 'kolombiya', // Colombia
    'Q717': 'venezuela', // Venezuela
    'Q419': 'peru', // Peru
    'Q736': 'ekvador', // Ecuador
    'Q77': 'uruguay', // Uruguay
    'Q733': 'paraguay', // Paraguay
    'Q750': 'bolivya', // Bolivia
    
    // Africa
    'Q258': 'guney-afrika', // South Africa
    'Q117': 'gana', // Ghana
    'Q115': 'etiyopya', // Ethiopia
    'Q954': 'zimbabve', // Zimbabwe
    'Q1033': 'nijerya', // Nigeria
    'Q79': 'misir', // Egypt
    'Q974': 'kongo-demokratik-cumhuriyeti', // DR Congo
    'Q916': 'angola', // Angola
    'Q1029': 'mozambik', // Mozambique
    'Q924': 'tanzanya', // Tanzania
    'Q1036': 'uganda', // Uganda
    'Q262': 'cezayir', // Algeria
    'Q1028': 'fas', // Morocco
    'Q948': 'tunus', // Tunisia
    'Q1016': 'libya', // Libya
    
    // Historical entities
    'Q15180': 'soviet-union', // Soviet Union
    'Q83958': 'yugoslavya', // Yugoslavia
    'Q971': 'zaire', // Zaire
    'Q34266': 'russian-socialist-federative-soviet-republic', // RSFSR
    'Q131964': 'austrian-empire', // Austrian Empire
    'Q7318': 'nazi-almanyasi', // Nazi Germany
    'Q12560': 'osmanli-i-mparatorlugu', // Ottoman Empire
    'Q172579': 'i-talya-kralligi', // Kingdom of Italy
    'Q153966': 'italian-social-republic', // Italian Social Republic
    'Q1049476': 'libyan-arab-republic', // Libya Arab Republic
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
