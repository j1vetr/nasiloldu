import { db } from "../db";
import { persons, categories, countries, professions, deathCauses } from "@shared/schema";
import { eq } from "drizzle-orm";

interface WikipediaResponse {
  extract: string;
  thumbnail?: {
    source: string;
  };
}

async function getWikipediaData(title: string): Promise<{ description: string; imageUrl: string | null }> {
  const url = `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Wikipedia API error for ${title}: ${response.status}`);
      return { description: "", imageUrl: null };
    }
    
    const data: WikipediaResponse = await response.json();
    
    return {
      description: data.extract || "",
      imageUrl: data.thumbnail?.source || null
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
      cause.includes('cinayet') || cause.includes('bomba')) {
    return 'suikast';
  }
  
  if (cause.includes('kaza') || cause.includes('trafik') || 
      cause.includes('uçak') || cause.includes('helikopter')) {
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
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const newPeople = [
  {
    name: "Muhsin Yazıcıoğlu",
    qid: "Q1950406",
    deathDate: "2009-03-25",
    deathCause: "helikopter kazası",
    profession: "Politikacı",
    country: "Türkiye"
  },
  {
    name: "Özdemir Sabancı",
    qid: "Q2061574",
    deathDate: "1996-01-09",
    deathCause: "suikast",
    profession: "İşadamı",
    country: "Türkiye"
  },
  {
    name: "Eşref Bitlis",
    qid: "Q5425606",
    deathDate: "1993-02-17",
    deathCause: "helikopter kazası",
    profession: "Asker",
    country: "Türkiye"
  },
  {
    name: "Vedat Aydın",
    qid: "Q6116606",
    deathDate: "1991-07-05",
    deathCause: "suikast",
    profession: "İnsan Hakları Aktivisti",
    country: "Türkiye"
  },
  {
    name: "Halit Güngen",
    qid: "Q6005908",
    deathDate: "1992-07-08",
    deathCause: "suikast",
    profession: "Gazeteci",
    country: "Türkiye"
  },
  {
    name: "Bedrettin Cömert",
    qid: "Q12743966",
    deathDate: "2013-06-11",
    deathCause: "gezi parkı olayları",
    profession: "Aktivist",
    country: "Türkiye"
  },
  {
    name: "Sevag Balıkçı",
    qid: "Q7457436",
    deathDate: "2011-04-24",
    deathCause: "ateşli silah yaralanması",
    profession: "Asker",
    country: "Türkiye"
  },
  {
    name: "Doğan Öz",
    qid: "Q5288606",
    deathDate: "1999-11-18",
    deathCause: "suikast",
    profession: "Gazeteci",
    country: "Türkiye"
  },
  {
    name: "Mustafa Yücel Özbilgin",
    qid: "Q6005942",
    deathDate: "2006-05-17",
    deathCause: "ateşli silah yaralanması",
    profession: "Yargıç",
    country: "Türkiye"
  },
  {
    name: "Ferhat Tepe",
    qid: "Q5444593",
    deathDate: "1999-05-25",
    deathCause: "suikast",
    profession: "Akademisyen",
    country: "Türkiye"
  },
  {
    name: "Musa Anter",
    qid: "Q982097",
    deathDate: "1992-09-20",
    deathCause: "suikast",
    profession: "Yazar",
    country: "Türkiye"
  },
  {
    name: "Hiram Abas",
    qid: "Q12746314",
    deathDate: "1993-01-20",
    deathCause: "suikast",
    profession: "Gazeteci",
    country: "Türkiye"
  },
  {
    name: "Hasan Ocak",
    qid: "Q5678691",
    deathDate: "1995-03-21",
    deathCause: "işkence",
    profession: "Aktivist",
    country: "Türkiye"
  },
  {
    name: "Asım Bezirci",
    qid: "Q4808196",
    deathDate: "2006-02-15",
    deathCause: "kalp krizi",
    profession: "Edebiyat Eleştirmeni",
    country: "Türkiye"
  },
  {
    name: "Nesimi Çimen",
    qid: "Q6997044",
    deathDate: "2004-06-17",
    deathCause: "kanser",
    profession: "Gazeteci",
    country: "Türkiye"
  },
  {
    name: "Metin Altıok",
    qid: "Q6005917",
    deathDate: "1993-07-02",
    deathCause: "yangın (Sivas katliamı)",
    profession: "Şair",
    country: "Türkiye"
  },
  {
    name: "Behçet Aysan",
    qid: "Q817670",
    deathDate: "1993-07-02",
    deathCause: "yangın (Sivas katliamı)",
    profession: "Yazar",
    country: "Türkiye"
  },
  {
    name: "Onno Tunç",
    qid: "Q2027697",
    deathDate: "1996-01-14",
    deathCause: "uçak kazası",
    profession: "Müzisyen",
    country: "Türkiye"
  },
  {
    name: "Yavuz Çetin",
    qid: "Q3046341",
    deathDate: "2001-08-15",
    deathCause: "intihar",
    profession: "Müzisyen",
    country: "Türkiye"
  },
  {
    name: "Bergen",
    qid: "Q809010",
    deathDate: "1989-08-14",
    deathCause: "ateşli silah yaralanması",
    profession: "Şarkıcı",
    country: "Türkiye"
  },
  {
    name: "Ahmet Kaya",
    qid: "Q297611",
    deathDate: "2000-11-16",
    deathCause: "kalp krizi",
    profession: "Şarkıcı",
    country: "Türkiye"
  },
  {
    name: "Ceylan Önkol",
    qid: "Q5066924",
    deathDate: "2013-09-17",
    deathCause: "gezi parkı olayları",
    profession: "Aktivist",
    country: "Türkiye"
  },
  {
    name: "Orhan Asena",
    qid: "Q1948645",
    deathDate: "2001-01-07",
    deathCause: "kalp krizi",
    profession: "Yazar",
    country: "Türkiye"
  },
  {
    name: "Erol Güngör",
    qid: "Q5393776",
    deathDate: "1983-02-17",
    deathCause: "kalp krizi",
    profession: "Sosyolog",
    country: "Türkiye"
  },
  {
    name: "Rıfat Ilgaz",
    qid: "Q2643925",
    deathDate: "1993-11-07",
    deathCause: "kalp krizi",
    profession: "Yazar",
    country: "Türkiye"
  },
  {
    name: "Cahit Tanyol",
    qid: "Q5017833",
    deathDate: "2019-04-17",
    deathCause: "yaşlılık",
    profession: "Sosyolog",
    country: "Türkiye"
  },
  {
    name: "Mehmet Akif Hatipoğlu",
    qid: "Q6007014",
    deathDate: "2013-12-14",
    deathCause: "kalp krizi",
    profession: "Din Adamı",
    country: "Türkiye"
  },
  {
    name: "Özcan Tekgül",
    qid: "Q12749086",
    deathDate: "1978-05-01",
    deathCause: "ateşli silah yaralanması",
    profession: "Öğrenci",
    country: "Türkiye"
  },
  {
    name: "Mehmet Topaç",
    qid: "Q6007063",
    deathDate: "2013-08-18",
    deathCause: "trafik kazası",
    profession: "Futbolcu",
    country: "Türkiye"
  },
];

async function addNewPeople() {
  console.log("Starting to add new people...\n");

  for (const person of newPeople) {
    try {
      const existing = await db.query.persons.findFirst({
        where: eq(persons.qid, person.qid)
      });

      if (existing) {
        console.log(`⏭️  Skipping ${person.name} - already exists`);
        continue;
      }

      console.log(`\n📝 Processing: ${person.name}`);
      
      const { description, imageUrl } = await getWikipediaData(person.name);
      
      if (!description) {
        console.log(`⚠️  No Wikipedia description found for ${person.name}`);
      }

      let country = await db.query.countries.findFirst({
        where: eq(countries.name, person.country)
      });
      if (!country) {
        const countrySlug = createSlug(person.country);
        [country] = await db.insert(countries).values({ 
          name: person.country,
          slug: countrySlug
        }).returning();
      }

      const professionSlug = createSlug(person.profession);
      
      let profession = await db.query.professions.findFirst({
        where: eq(professions.name, person.profession)
      });
      
      if (!profession) {
        profession = await db.query.professions.findFirst({
          where: eq(professions.slug, professionSlug)
        });
      }
      
      if (!profession) {
        [profession] = await db.insert(professions).values({ 
          name: person.profession,
          slug: professionSlug
        }).returning();
      }

      const categorySlug = categorizeDeathCause(person.deathCause);
      const deathCauseCategory = await db.query.categories.findFirst({
        where: eq(categories.slug, categorySlug)
      });

      if (!deathCauseCategory) {
        console.error(`❌ Category not found for death cause: ${categorySlug}`);
        continue;
      }

      let deathCause = await db.query.deathCauses.findFirst({
        where: eq(deathCauses.name, person.deathCause)
      });
      if (!deathCause) {
        [deathCause] = await db.insert(deathCauses).values({ 
          name: person.deathCause,
          categoryId: deathCauseCategory.id
        }).returning();
      }

      const slug = createSlug(person.name);

      await db.insert(persons).values({
        qid: person.qid,
        slug,
        name: person.name,
        description: description || `${person.name} hakkında bilgi.`,
        deathDate: person.deathDate,
        imageUrl: imageUrl,
        categoryId: deathCauseCategory.id,
        countryId: country.id,
        professionId: profession.id,
        deathCauseId: deathCause.id,
      });

      console.log(`✅ Added: ${person.name} (${categorySlug})`);
      console.log(`   Description: ${description ? description.substring(0, 100) + '...' : 'N/A'}`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Error adding ${person.name}:`, error);
    }
  }

  console.log("\n✅ All people processed!");
}

addNewPeople().catch(console.error);
