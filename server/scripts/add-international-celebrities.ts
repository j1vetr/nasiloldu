import { db } from '../db';
import { persons, categories, professions, countries, deathCauses } from '@shared/schema';
import { eq, sql } from 'drizzle-orm';

interface WikidataResult {
  person: { value: string };
  personLabel: { value: string };
  birthDate?: { value: string };
  deathDate?: { value: string };
  deathCause?: { value: string };
  deathCauseLabel?: { value: string };
  deathPlace?: { value: string };
  deathPlaceLabel?: { value: string };
  birthPlace?: { value: string };
  birthPlaceLabel?: { value: string };
  occupation?: { value: string };
  occupationLabel?: { value: string };
  country?: { value: string };
  countryLabel?: { value: string };
  image?: { value: string };
}

const celebrities = [
  "Marilyn Monroe", "Michael Jackson", "Elvis Presley", "Freddie Mercury",
  "Whitney Houston", "Amy Winehouse", "Kurt Cobain", "Heath Ledger",
  "Robin Williams", "Paul Walker", "Princess Diana", "Queen Elizabeth II",
  "Steve Jobs", "Chester Bennington", "Avicii", "Kobe Bryant",
  "Gianni Versace", "Alexander McQueen", "John Lennon", "George Michael",
  "David Bowie", "Alan Rickman", "Chadwick Boseman", "Bruce Lee",
  "Brandon Lee", "River Phoenix", "Bob Marley", "Jimi Hendrix",
  "Jim Morrison", "Janis Joplin", "Mac Miller", "Juice WRLD",
  "XXXTentacion", "Tupac Shakur", "The Notorious B.I.G.", "Aaliyah",
  "Anna Nicole Smith", "Philip Seymour Hoffman", "Brittany Murphy", "Cory Monteith",
  "Anton Yelchin", "Naya Rivera", "Cameron Boyce", "Paul Allen",
  "Robin Gibb", "Donna Summer", "Dolores O'Riordan", "Bob Saget",
  "Matthew Perry", "Tina Turner", "Taylor Hawkins", "Aaron Carter",
  "Stephen Boss", "Angus Cloud", "Lil Peep", "Coolio",
  "Takeoff", "Pop Smoke", "DMX", "MF DOOM",
  "DJ AM", "Shane Warne", "Diego Maradona", "Pelé",
  "Ayrton Senna", "Jules Bianchi", "Niki Lauda", "Dale Earnhardt",
  "Gianna Bryant", "Audrey Hepburn", "Elizabeth Taylor", "Judy Garland",
  "Jane Mansfield", "Sharon Tate", "Natalie Wood", "Luke Perry",
  "Steve Irwin", "Prince Philip", "Prince", "Chris Cornell",
  "Karl Lagerfeld", "Virgil Abloh", "Albert Einstein", "Nikola Tesla",
  "Stephen Hawking", "Marie Curie", "Isaac Newton", "Charles Darwin",
  "Carl Sagan", "Neil Armstrong", "Yuri Gagarin", "Alan Shepard",
  "Hedy Lamarr", "Rosalind Franklin", "Ada Lovelace", "Alan Turing",
  "Queen Victoria", "Winston Churchill", "Margaret Thatcher", "John F. Kennedy",
  "Robert F. Kennedy", "Abraham Lincoln", "Franklin D. Roosevelt", "Ronald Reagan",
  "Mikhail Gorbachev", "Vladimir Lenin", "Joseph Stalin", "Adolf Hitler",
  "Benito Mussolini", "Saddam Hussein", "Muammar Gaddafi", "Osama bin Laden",
  "Yasser Arafat", "Nelson Mandela", "Desmond Tutu", "Mahatma Gandhi",
  "Indira Gandhi", "Rajiv Gandhi", "Jawaharlal Nehru", "Queen Elizabeth I",
  "Napoleon Bonaparte", "Marie Antoinette", "King Louis XVI", "Cleopatra",
  "Julius Caesar", "Alexander the Great", "Aristotle", "Plato",
  "Socrates", "Leonardo da Vinci", "Michelangelo", "Vincent van Gogh",
  "Pablo Picasso", "Salvador Dalí", "Frida Kahlo"
];

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

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWikidataInfo(name: string): Promise<WikidataResult | null> {
  try {
    const query = `
      SELECT DISTINCT ?person ?personLabel ?birthDate ?deathDate 
             ?deathCause ?deathCauseLabel ?deathPlace ?deathPlaceLabel
             ?birthPlace ?birthPlaceLabel ?occupation ?occupationLabel 
             ?country ?countryLabel ?image
      WHERE {
        ?person ?label "${name}"@en .
        ?person wdt:P31 wd:Q5 .
        OPTIONAL { ?person wdt:P569 ?birthDate . }
        OPTIONAL { ?person wdt:P570 ?deathDate . }
        OPTIONAL { ?person wdt:P509 ?deathCause . }
        OPTIONAL { ?person wdt:P20 ?deathPlace . }
        OPTIONAL { ?person wdt:P19 ?birthPlace . }
        OPTIONAL { ?person wdt:P106 ?occupation . }
        OPTIONAL { ?person wdt:P27 ?country . }
        OPTIONAL { ?person wdt:P18 ?image . }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en,tr" . }
      }
      LIMIT 1
    `;

    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'nasiloldu.net/1.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`Wikidata error for ${name}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (!data.results?.bindings?.[0]) {
      console.warn(`No Wikidata result for: ${name}`);
      return null;
    }

    return data.results.bindings[0];
  } catch (error) {
    console.error(`Error fetching Wikidata for ${name}:`, error);
    return null;
  }
}

async function fetchWikipediaDescription(name: string): Promise<string> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (!searchData.query?.search?.[0]) {
      return `${name} was a notable figure in their field.`;
    }

    const pageTitle = searchData.query.search[0].title;
    
    const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(pageTitle)}&format=json&origin=*`;
    const extractResponse = await fetch(extractUrl);
    const extractData = await extractResponse.json();
    
    const pages = extractData.query.pages;
    const pageId = Object.keys(pages)[0];
    const extract = pages[pageId]?.extract || '';

    if (extract.length < 100) {
      return `${name} was a notable figure in their field.`;
    }

    const sentences = extract.split(/[.!?]+/).filter((s: string) => s.trim().length > 20);
    const description = sentences.slice(0, 10).join('. ') + '.';
    
    return description.length > 200 ? description : `${name} ${extract}`;
  } catch (error) {
    console.error(`Error fetching Wikipedia for ${name}:`, error);
    return `${name} was a notable figure in their field.`;
  }
}

async function getOrCreateCategory(slug: string): Promise<number> {
  const [category] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  if (category) return category.id;
  
  const names: Record<string, string> = {
    'hastalik': 'Hastalık',
    'kaza': 'Kaza',
    'intihar': 'İntihar',
    'suikast': 'Suikast'
  };
  
  const [newCategory] = await db.insert(categories).values({
    slug,
    name: names[slug] || slug
  }).returning();
  
  return newCategory.id;
}

async function getOrCreateCountry(name: string): Promise<number> {
  const slug = createSlug(name);
  const [country] = await db.select().from(countries).where(eq(countries.slug, slug)).limit(1);
  if (country) return country.id;
  
  const [newCountry] = await db.insert(countries).values({
    slug,
    name
  }).returning();
  
  return newCountry.id;
}

async function getOrCreateProfession(name: string): Promise<number> {
  const slug = createSlug(name);
  const [profession] = await db.select().from(professions).where(eq(professions.slug, slug)).limit(1);
  if (profession) return profession.id;
  
  const [newProfession] = await db.insert(professions).values({
    slug,
    name
  }).returning();
  
  return newProfession.id;
}

async function addCelebrity(name: string, index: number, total: number) {
  console.log(`\n[${index + 1}/${total}] Processing: ${name}`);
  
  const wikidataInfo = await fetchWikidataInfo(name);
  await sleep(1000);
  
  if (!wikidataInfo) {
    console.log(`❌ Skipped: ${name} (no Wikidata)`);
    return;
  }

  const qid = wikidataInfo.person.value.split('/').pop() || '';
  
  const [existingPerson] = await db.select().from(persons).where(eq(persons.qid, qid)).limit(1);
  if (existingPerson) {
    console.log(`⏭️  Already exists: ${name} (${qid})`);
    return;
  }

  const description = await fetchWikipediaDescription(name);
  await sleep(1000);

  const deathCauseText = wikidataInfo.deathCauseLabel?.value || null;
  const categorySlug = categorizeDeathCause(deathCauseText);
  const categoryId = await getOrCreateCategory(categorySlug);

  const countryName = wikidataInfo.countryLabel?.value || 'Unknown';
  const countryId = await getOrCreateCountry(countryName);

  const professionName = wikidataInfo.occupationLabel?.value || 'Public Figure';
  const professionId = await getOrCreateProfession(professionName);

  const slug = createSlug(wikidataInfo.personLabel.value);

  try {
    const [newPerson] = await db.insert(persons).values({
      qid,
      slug,
      name: wikidataInfo.personLabel.value,
      birthDate: wikidataInfo.birthDate?.value || null,
      birthPlace: wikidataInfo.birthPlaceLabel?.value || null,
      deathDate: wikidataInfo.deathDate?.value || null,
      deathPlace: wikidataInfo.deathPlaceLabel?.value || null,
      deathCause: deathCauseText,
      nationality: countryName,
      description,
      imageUrl: wikidataInfo.image?.value || null,
      categoryId,
      countryId,
      professionId
    }).returning();

    console.log(`✅ Added: ${newPerson.name} (${qid}) - ${categorySlug}`);
  } catch (error) {
    console.error(`❌ Error adding ${name}:`, error);
  }
}

async function main() {
  console.log('🚀 Starting international celebrities import...\n');
  console.log(`📊 Total celebrities to process: ${celebrities.length}\n`);

  for (let i = 0; i < celebrities.length; i++) {
    await addCelebrity(celebrities[i], i, celebrities.length);
  }

  console.log('\n✅ Import completed!');
  process.exit(0);
}

main();
