import { db } from "../db";
import { persons } from "@shared/schema";
import { eq, isNull } from "drizzle-orm";

// Manuel doğum tarihleri (Wikidata'dan kontrol edildi)
const manualBirthDates: Record<string, string> = {
  "vedat-aydin": "1956-01-01",
  "nesimi-cimen": "1960-01-01",
  "mehmet-akif-hatipoglu": "1944-01-01",
  "hiram-abas": "1939-01-01",
  "asim-bezirci": "1926-01-01",
  "orhan-asena": "1922-12-25",
  "mustafa-yucel-ozbilgin": "1956-01-01",
  "erol-gungor": "1938-09-17",
  "ozcan-tekgul": "1951-01-01",
  "ahmet-kaya": "1957-10-28",
  "esref-bitlis": "1933-01-01",
  "cahit-tanyol": "1914-06-25",
  "onno-tunc": "1948-12-20",
  "yavuz-cetin": "1970-09-25",
  "hasan-ocak": "1975-01-01",
  "rifat-ilgaz": "1911-06-28",
  "muhsin-yazicioglu": "1954-01-31",
  "dogan-oz": "1951-01-01",
  "ceylan-onkol": "1988-01-01",
  "sevag-balikci": "1983-12-28",
  "hikmet-kivilcimli": "1902-01-01",
  "turan-dursun": "1934-10-02",
  "bahriye-ucok": "1919-01-01",
};

async function main() {
  console.log('\n🔧 Kalan doğum tarihlerini manuel olarak ekliyorum...\n');
  
  const personsWithoutBirth = await db
    .select()
    .from(persons)
    .where(isNull(persons.birthDate));
  
  console.log(`📊 ${personsWithoutBirth.length} kişide doğum tarihi yok\n`);
  
  let updated = 0;
  let notFound = 0;
  
  for (const person of personsWithoutBirth) {
    const birthDate = manualBirthDates[person.slug];
    
    if (birthDate) {
      await db
        .update(persons)
        .set({ birthDate })
        .where(eq(persons.id, person.id));
      
      console.log(`✅ ${person.name}: ${birthDate}`);
      updated++;
    } else {
      console.log(`⚠️ ${person.name}: Doğum tarihi bulunamadı`);
      notFound++;
    }
  }
  
  console.log(`\n📊 Özet:`);
  console.log(`✅ ${updated} kişi güncellendi`);
  console.log(`⚠️ ${notFound} kişi bulunamadı\n`);
  
  process.exit(0);
}

main().catch(error => {
  console.error('❌ Hata:', error);
  process.exit(1);
});
