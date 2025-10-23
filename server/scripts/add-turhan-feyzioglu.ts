import { db } from "../db";
import { persons, categories, countries, professions, deathCauses } from "@shared/schema";
import { eq } from "drizzle-orm";

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

async function main() {
  console.log('\n🚀 Adding Turhan Feyzioğlu manually...\n');
  
  const name = "Turhan Feyzioğlu";
  const qid = "Q2458942";
  const deathDate = "1988-03-24";
  const deathCause = "kalp yetmezliği";
  const profession = "siyasetçi";
  const country = "Türkiye";
  
  // Full biography from biyografya.com (Turkish source, 500+ words)
  const description = `Hukuk Profesörü, Akademisyen, Siyaset ve Devlet adamı, XI. Dönem Sivas Milletvekili, 1973 ve 1977 seçimlerinde Kayseri Milletvekili, 27 Mayıs darbesinden sonra Kurucu Meclis Üniversite Temsilcisi, 25. Hükümet Millî Eğitim Bakanı Cumhuriyetçi Güven Partisi (CGP) kurucusu (D. 1922, Kayseri - 24 Mart 1988, Ankara). Kayseri'nin eski bir ailesi olan Feyzioğullarından; yargıçlık, öğretmenlik, avukatlık ve iki dönem de milletvekilliği yapmış olan Sait Azmi'nin oğludur. Annesi Neyyire hanımdır.

İlköğrenimine Kayseri'de başladı, daha sonra çeşitli okullarda okudu ve 1940-41 ders yılında Galatasaray Lisesi'ni, 1945'te İstanbul Üniversitesi Hukuk Fakültesi'ni bitirdi. Fransa'da Ecole Nationale d'Administration'da ve İngiltere'de Oxford Üniversitesi'nde uzmanlık ve araştırma çalışmaları yaparak yurda döndü. Ankara Üniversitesi Siyasal Bilgiler Fakültesi'nde asistan olarak çalışmaya başladı (1946). Burada, "Kanunların Anayasaya Uygunluğunun Kazaî Murakabesi" konulu teziyle doktorasını yaptı (1949).

Siyasal Bilgiler Fakültesi'nde doçentlik unvanını aldıktan sonra İngiltere'ye gönderildi (1952), Türkiye'ye döndükten sonra da 1955 yılında profesörlüğe yükseldi. Ardından, Siyasal Bilgiler Fakültesi dekanlığına seçildi (1956). Türkiye'nin en genç dekanı diye tanındı, öğrencilerine "Nabza göre şerbet vermeyin" öğüdüyle ünlendi. Bu arada Forum dergisinin kurucuları ile yazarları arasında yer aldı.

Demokrat Parti (DP) iktidarı ile görüş ayrılığına düştüğünden üniversitedeki görevinden ayrıldı. Cumhuriyet Halk Partisi (CHP)'ne girerek politikaya atıldı, XI. Dönem Sivas Milletvekili seçilerek 27.10.1957 – 27.05.1960 arasında TBMM'de görev yaptı.

27 Mayıs 1960 askeri darbesinin ardından Orta Doğu Teknik Üniversitesi'nin rektörlüğüne getirilen Feyzioğlu, Kurucu Meclis Üniversite Temsilcisi (06.01.1961– 15.10.1961) seçildi. Kurucu Meclis'te Anayasa Komisyonu Başkanlığına getirildi. 1961'de kurulan İkinci Cemal Gürsel Hükümet'inde (25. Hükümet) Milli Eğitim Bakanı (Ocak-Ekim 1961) ve ilk koalisyon hükümetinde devlet bakanlığı ile başbakan yardımcılığı yaptı.

Ancak, 27 Mayıs askeri yönetimi döneminde, görevlerinden uzaklaştırılan 147 öğretim üyesinin üniversiteye dönmelerini sağlayamayınca bakanlıktan ayrıldı. 1961'de yapılan genel seçimlerde CHP listesinden Kayseri milletvekilliğine seçildi (1961-65) ve parti yönetiminde görev aldı. İkinci İnönü ortaklık hükümetinde başbakan yardımcılığı yaptı (1962-63). CHP içinde Bülent Ecevit'in başlattığı "Ortanın Solu" hareketine karşı çıktı, bir grup arkadaşıyla birlikte partisinden ayrılarak Güven Partisi'ni (GP) kurdu ve bu partinin genel başkanlığına seçildi (Ekim 1967). GP'nin, bu arada CHP'den ayrılıp Cumhuriyetçi Parti'yi kuran Kemal Satır ve arkadaşlarıyla birleşerek Cumhuriyetçi Güven Partisi (CGP) adını almasından sonra da bu partinin genel başkanlığına getirildi (1973-80). Süleyman Demirel'in (1975-77), ardından da Bülent Ecevit'in kurduğu ortaklık hükümetlerde (1978-79) Başbakan Yardımcılığı yaptı. 1973 ve 1977 seçimlerinde CGP'den yeniden Kayseri Milletvekili seçildi. 12 Eylül 1980 askeri darbesinden sonra başbakanlığı söz konusu olduysa da bu gerçekleşmedi. 12 Eylül askeri yönetimi döneminde parlamentonun ardından siyasi partilerin de kapatılmasıyla Feyzioğlu siyasi hayattan çekildi. Askeri yönetim tarafından Kıbrıs danışmanlığına atandı (1981). Atatürk Kültür Dil ve Tarih Yüksek Kurulu üyeliğine getirildi (1982).

Prof. Feyzioğlu, 1980 yılında siyasî yaşamına son verene kadar yirmi beş yıla yakın parlamento ve Kurucu Meclis üyeliği yaptı. İki İnönü Hükümetinde Devlet Bakanı, Başbakan Yardımcısı olarak görev aldı. Cumhuriyetçi Güven Partisi Genel Başkanlığı sırasında da devlet görevlerinde bulunmuştur. Avrupa Konseyi'nde Türkiye'yi temsil ettiği sırada Avrupa Konseyi Parlamenter Asamblesi Başkan Vekilliğini yaptı.

Prof. Dr. Turhan Feyzioğlu, yaşamı boyunca Atatürkçülüğü kendine rehber edinmişti. Bu görüşü doğrultusunda eserler de verdi. Ayrıca iktisat, hukuk, siyasî bilimler konularında da Türkçe, İngilizce ve Fransızca olarak yayınlanmış eserleri ve makaleleri vardır.

Bilim ve siyaset adamı Turhan Feyzioğlu, 24 Mart 1988'de bir kalp yetmezliği sonucunda Ankara'da hayatını kaybetti. Evli, 1 çocuk babasıydı. Fransızca, İngilizce, Almanca biliyordu.`;
  
  try {
    // Check if already exists
    const existing = await db.select()
      .from(persons)
      .where(eq(persons.qid, qid))
      .limit(1);
    
    if (existing.length > 0) {
      console.log(`⏭ ${name} already exists in database`);
      return;
    }
    
    // Get category (hastalik - natural death)
    const categoryResult = await db.select()
      .from(categories)
      .where(eq(categories.slug, 'hastalik'))
      .limit(1);
    
    if (categoryResult.length === 0) {
      throw new Error('Category "hastalik" not found');
    }
    
    const categoryId = categoryResult[0].id;
    
    // Get country
    const countryResult = await db.select()
      .from(countries)
      .where(eq(countries.name, country))
      .limit(1);
    
    if (countryResult.length === 0) {
      throw new Error(`Country "${country}" not found`);
    }
    
    const countryId = countryResult[0].id;
    
    // Get profession
    const professionResult = await db.select()
      .from(professions)
      .where(eq(professions.name, profession))
      .limit(1);
    
    if (professionResult.length === 0) {
      throw new Error(`Profession "${profession}" not found`);
    }
    
    const professionId = professionResult[0].id;
    
    // Create death cause
    const [deathCauseResult] = await db.insert(deathCauses).values({
      name: deathCause,
      categoryId
    }).returning();
    
    // Insert person
    const [newPerson] = await db.insert(persons).values({
      qid,
      name,
      slug: createSlug(name),
      description,
      imageUrl: null,
      deathDate,
      categoryId,
      countryId,
      professionId,
      deathCauseId: deathCauseResult.id
    }).returning();
    
    console.log(`✅ Successfully added ${name} (ID: ${newPerson.id})`);
    console.log(`📝 Description length: ${description.split(/\s+/).length} words`);
    
  } catch (error) {
    console.error(`❌ Error adding ${name}:`, error);
    throw error;
  }
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
