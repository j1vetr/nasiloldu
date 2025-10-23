/**
 * Meslekleri İngilizce'den Türkçe'ye çevir
 * 
 * actor → Oyuncu
 * Formula One driver → Formula 1 Pilotu
 * vb.
 */

import { db } from '../db';
import { professions } from '@shared/schema';
import { translateProfession } from '@shared/utils';
import { eq } from 'drizzle-orm';

async function translateProfessions() {
  console.log('🌍 Meslekleri Türkçe\'ye çevirme başlatılıyor...\n');

  const allProfessions = await db.select().from(professions);
  
  let translatedCount = 0;
  let unchangedCount = 0;

  for (const profession of allProfessions) {
    const translated = translateProfession(profession.name);
    
    if (translated !== profession.name) {
      console.log(`✏️  "${profession.name}" → "${translated}"`);
      
      await db
        .update(professions)
        .set({ name: translated })
        .where(eq(professions.id, profession.id));
      
      translatedCount++;
    } else {
      unchangedCount++;
    }
  }

  console.log('\n✅ Çeviri tamamlandı!');
  console.log(`📊 Çevrilen: ${translatedCount}`);
  console.log(`📊 Zaten Türkçe: ${unchangedCount}`);
  console.log(`📊 Toplam: ${allProfessions.length}`);
}

translateProfessions().catch(console.error);
