/**
 * Slug düzeltme scripti
 * Tek harfli kelimeleri birleştirerek net link yapısı sağlar
 * 
 * Örnekler:
 * - "e-h-calvert" → "eh-calvert"
 * - "diana-princess-of-wales" → "diana-princess-of-wales" (değişmez)
 */

import { db } from '../db';
import { persons } from '@shared/schema';
import { createSlug } from '@shared/utils';
import { eq } from 'drizzle-orm';

async function fixSlugs() {
  console.log('🔧 Slug düzeltme başlatılıyor...\n');

  const allPersons = await db.select().from(persons);
  
  let fixedCount = 0;
  let unchangedCount = 0;

  for (const person of allPersons) {
    const newSlug = createSlug(person.name);
    
    if (newSlug !== person.slug) {
      console.log(`✏️  "${person.name}"`);
      console.log(`   Eski: ${person.slug}`);
      console.log(`   Yeni: ${newSlug}\n`);
      
      await db
        .update(persons)
        .set({ slug: newSlug })
        .where(eq(persons.id, person.id));
      
      fixedCount++;
    } else {
      unchangedCount++;
    }
  }

  console.log('\n✅ Slug düzeltme tamamlandı!');
  console.log(`📊 Düzeltilen: ${fixedCount}`);
  console.log(`📊 Değişmeyen: ${unchangedCount}`);
  console.log(`📊 Toplam: ${allPersons.length}`);
}

fixSlugs().catch(console.error);
