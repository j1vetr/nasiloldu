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
