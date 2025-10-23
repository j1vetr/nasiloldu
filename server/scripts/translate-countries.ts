/**
 * Ülke isimlerini İngilizce'den Türkçe'ye çevir
 */

import { db } from '../db';
import { countries } from '@shared/schema';
import { eq } from 'drizzle-orm';

const countryTranslations: Record<string, string> = {
  'United States': 'Amerika Birleşik Devletleri',
  'United Kingdom': 'Birleşik Krallık',
  'United Kingdom of Great Britain and Ireland': 'Büyük Britanya ve İrlanda Birleşik Krallığı',
  'Australia': 'Avustralya',
  'Austria': 'Avusturya',
  'Austrian Empire': 'Avusturya İmparatorluğu',
  'Argentina': 'Arjantin',
  'Brazil': 'Brezilya',
  'Canada': 'Kanada',
  'France': 'Fransa',
  'Italy': 'İtalya',
  'Germany': 'Almanya',
  'Spain': 'İspanya',
  'Sweden': 'İsveç',
  'Switzerland': 'İsviçre',
  'Ireland': 'İrlanda',
  'Jamaica': 'Jamaika',
  'New Zealand': 'Yeni Zelanda',
  'Czech Republic': 'Çek Cumhuriyeti',
  'Kenya': 'Kenya',
  'Cape Verde': 'Yeşil Burun Adaları',
  'Soviet Union': 'Sovyetler Birliği',
  'Russian Socialist Federative Soviet Republic': 'Rusya Sovyet Federatif Sosyalist Cumhuriyeti',
  'Nazi Germany': 'Nazi Almanyası',
  'Italian Social Republic': 'İtalyan Sosyal Cumhuriyeti',
  'Libyan Arab Republic': 'Libya Arap Cumhuriyeti',
  'Ba\'athist Iraq': 'Baas Partisi Irak\'ı',
  'State of Palestine': 'Filistin Devleti',
  'Sultanate of Zanzibar': 'Zanzibar Sultanlığı',
  'Unknown': 'Bilinmiyor',
  'statelessness': 'Vatansız',
};

async function translateCountries() {
  console.log('🌍 Ülke isimlerini Türkçe\'ye çevirme başlatılıyor...\n');

  const allCountries = await db.select().from(countries);
  
  let translatedCount = 0;
  let unchangedCount = 0;

  for (const country of allCountries) {
    const translated = countryTranslations[country.name];
    
    if (translated && translated !== country.name) {
      console.log(`✏️  "${country.name}" → "${translated}"`);
      
      await db
        .update(countries)
        .set({ name: translated })
        .where(eq(countries.id, country.id));
      
      translatedCount++;
    } else {
      unchangedCount++;
    }
  }

  console.log('\n✅ Çeviri tamamlandı!');
  console.log(`📊 Çevrilen: ${translatedCount}`);
  console.log(`📊 Zaten Türkçe: ${unchangedCount}`);
  console.log(`📊 Toplam: ${allCountries.length}`);
}

translateCountries().catch(console.error);
