/**
 * Türkçe karakter desteği ile slug oluşturur
 * Tek harfli kelimeleri birleştirerek net link yapısı sağlar
 * 
 * Örnekler:
 * - "Mustafa Kemal Atatürk" → "mustafa-kemal-ataturk"
 * - "E. H. Calvert" → "eh-calvert"
 * - "Diana, Princess of Wales" → "diana-princess-of-wales"
 * - "The Notorious B.I.G." → "the-notorious-big"
 */
export function createSlug(name: string): string {
  let slug = name
    .toLowerCase()
    // Türkçe karakterleri dönüştür
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
    // Nokta ve virgülleri kaldır
    .replace(/\./g, '')
    .replace(/,/g, '')
    // Alfanumerik olmayan karakterleri tire ile değiştir
    .replace(/[^a-z0-9]+/g, '-')
    // Ardışık tireleri tek tireye düşür
    .replace(/-+/g, '-')
    // Baş ve sondaki tireleri kaldır
    .replace(/^-+|-+$/g, '');

  // Tek harfli kelimeleri birleştir (e-h → eh)
  // Regex: tek harf + tire + tek harf patternini bulur
  slug = slug.replace(/\b([a-z])-([a-z])\b/g, '$1$2');
  
  return slug;
}

/**
 * Türkçe karakterlerle büyük harf dönüşümü yapar
 * - i → İ (Türkçe I büyük harf)
 * - ı → I (Türkçe küçük i)
 */
export function toTurkishUpperCase(str: string): string {
  return str
    .replace(/i/g, 'İ')
    .replace(/ı/g, 'I')
    .toLocaleUpperCase('tr-TR');
}

/**
 * Türkçe karakterlerle küçük harf dönüşümü yapar
 */
export function toTurkishLowerCase(str: string): string {
  return str.toLocaleLowerCase('tr-TR');
}

/**
 * ISO 8601 tarihini DD.MM.YYYY formatına çevirir
 * UTC accessor'ları kullanarak timezone bağımsız çalışır
 * 
 * @param dateStr - ISO 8601 formatında tarih (örn: "1945-04-30T00:00:00Z")
 * @returns DD.MM.YYYY formatında tarih veya "Bilinmiyor"
 * 
 * Örnekler:
 * - "1945-04-30T00:00:00Z" → "30.04.1945"
 * - null → "Bilinmiyor"
 * - invalid → "Bilinmiyor"
 */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Bilinmiyor";
  
  const date = new Date(dateStr);
  
  // Invalid date kontrolü
  if (Number.isNaN(date.getTime())) {
    return "Bilinmiyor";
  }
  
  // UTC accessor'ları kullan (timezone bağımsız)
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  
  return `${day}.${month}.${year}`;
}

/**
 * ISO 8601 tarihini Türkçe ay isimleriyle formatlar
 * UTC accessor'ları kullanarak timezone bağımsız çalışır
 * 
 * @param dateStr - ISO 8601 formatında tarih
 * @returns "30 Nisan 1945" formatında tarih veya "Bilinmiyor"
 */
export function formatTurkishDate(dateStr: string | null): string {
  if (!dateStr) return "Bilinmiyor";
  
  const date = new Date(dateStr);
  
  // Invalid date kontrolü
  if (Number.isNaN(date.getTime())) {
    return "Bilinmiyor";
  }
  
  const months = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];
  
  // UTC accessor'ları kullan
  const day = date.getUTCDate();
  const monthName = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  
  return `${day} ${monthName} ${year}`;
}

/**
 * İngilizce meslek adlarını Türkçe'ye çevirir
 */
export function translateProfession(profession: string): string {
  const translations: Record<string, string> = {
    // Sanat
    'actor': 'Oyuncu',
    'actress': 'Oyuncu',
    'singer': 'Şarkıcı',
    'musician': 'Müzisyen',
    'composer': 'Besteci',
    'painter': 'Ressam',
    'sculptor': 'Heykeltıraş',
    'dancer': 'Dansçı',
    'director': 'Yönetmen',
    'film director': 'Film Yönetmeni',
    'photographer': 'Fotoğrafçı',
    'animator': 'Animatör',
    
    // Spor
    'Formula One driver': 'Formula 1 Pilotu',
    'association football player': 'Futbolcu',
    'football player': 'Futbolcu',
    'basketball player': 'Basketbolcu',
    'tennis player': 'Tenisçi',
    'athlete': 'Sporcu',
    'boxer': 'Boksör',
    'racing driver': 'Yarış Pilotu',
    'aircraft pilot': 'Pilot',
    'astronaut': 'Astronot',
    
    // Bilim
    'scientist': 'Bilim İnsanı',
    'physicist': 'Fizikçi',
    'chemist': 'Kimyacı',
    'biologist': 'Biyolog',
    'mathematician': 'Matematikçi',
    'engineer': 'Mühendis',
    'inventor': 'Mucit',
    
    // Edebiyat
    'writer': 'Yazar',
    'author': 'Yazar',
    'poet': 'Şair',
    'journalist': 'Gazeteci',
    'novelist': 'Romancı',
    'playwright': 'Oyun Yazarı',
    'autobiographer': 'Otobiyografi Yazarı',
    
    // Politika
    'politician': 'Politikacı',
    'president': 'Cumhurbaşkanı',
    'prime minister': 'Başbakan',
    'minister': 'Bakan',
    'diplomat': 'Diplomat',
    'military personnel': 'Asker',
    'general': 'General',
    
    // Diğer
    'philosopher': 'Filozof',
    'historian': 'Tarihçi',
    'archaeologist': 'Arkeolog',
    'architect': 'Mimar',
    'archivist': 'Arşivci',
    'fashion designer': 'Moda Tasarımcısı',
    'model': 'Model',
    'entrepreneur': 'Girişimci',
    'businessperson': 'İş İnsanı',
    'activist': 'Aktivist',
    'HIV/AIDS activist': 'HIV/AIDS Aktivisti',
    'Public Figure': 'Kamu Figürü',
    'Holocaust perpetrator': 'Holocaust Suçlusu',
    'Mujrim': 'Suçlu',
  };
  
  return translations[profession] || profession;
}
