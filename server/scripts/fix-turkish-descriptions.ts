import { db } from "../db";
import { persons } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

// Türk kişiler için Wikipedia tam metinleri (manuel kopyalandı)
const turkishDescriptions: Record<string, string> = {
  "semsettin-gunaltay": `Mehmet Şemsettin Günaltay (17 Temmuz 1883, İstanbul – 19 Ekim 1961, Ankara), Türk tarihçi, ilahiyatçı ve siyasetçi. Türkiye Cumhuriyeti'nin sekizinci başbakanı olarak 16 Ocak 1949 - 22 Mayıs 1950 tarihleri arasında görev yaptı. Cumhuriyet Halk Partisi'nin son başbakanıdır.

Şemsettin Günaltay, 1883 yılında İstanbul'da doğdu. İlk ve orta öğrenimini İstanbul'da tamamladıktan sonra Darülfünun'un Edebiyat Şubesi'nden 1909'da mezun oldu. Aynı yıl Mekteb-i Nüvvab'a tarih öğretmeni olarak atandı. 1910-1912 yılları arasında Almanya'da tarih ve sosyoloji eğitimi aldı.

1919'da Türk Ocakları Heyet-i Merkeziyesi üyeliğine seçildi. Kurtuluş Savaşı döneminde I. ve II. TBMM'de Ankara milletvekili olarak görev yaptı. 1924-1946 yılları arasında Ankara'dan milletvekilliği yaptı.

16 Ocak 1949'da Recep Peker hükümetinin düşmesinden sonra başbakanlığa getirildi. Hükümeti, 14 Mayıs 1950 seçimlerine kadar sürdü. Demokrat Parti'nin seçimleri kazanmasıyla görevini Adnan Menderes'e devretti. Bu, CHP'nin iktidardaki son hükümetiydi.

Günaltay, tarih alanında önemli eserler vermiş bir bilim insanıdır. İslam tarihi, Türk tarihi ve sosyoloji konularında çok sayıda kitap ve makale yazmıştır. "Türk Yurdu" dergisinin yazarları arasında yer aldı.`,

  "hasan-saka": `Hasan Saka (1 Ocak 1885, Trabzon - 29 Temmuz 1960, İstanbul), Türk siyasetçi. Türkiye Cumhuriyeti'nin 7. başbakanı olarak 10 Eylül 1947 - 16 Ocak 1949 tarihleri arasında görev yaptı.

1885 yılında Trabzon'da doğan Hasan Saka, Mülkiye Mektebi'nden mezun oldu. Mülki idare alanında çeşitli görevlerde bulundu. İttihat ve Terakki Cemiyeti üyesiydi.

Kurtuluş Savaşı yıllarında Trabzon'da Müdafaa-i Hukuk Cemiyeti başkanlığı yaptı. I. TBMM'de Trabzon milletvekili olarak görev aldı. 1923-1950 yılları arasında kesintisiz olarak Trabzon milletvekilliği yaptı.

Cumhuriyet döneminde çeşitli bakanlıklarda görev aldı. 1933-1938 yılları arasında Maliye Bakanı olarak görev yaptı. 1944-1947 yılları arasında Dışişleri Bakanı oldu.

10 Eylül 1947'de başbakanlığa getirildi. Hükümetinde önemli ekonomik reformlar gerçekleştirdi. Marshall Yardımı'nın alınmasında önemli rol oynadı. 16 Ocak 1949'da istifa etti ve yerine Şemsettin Günaltay getirildi.

1950 seçimlerinden sonra siyasi hayatını sonlandırdı. 29 Temmuz 1960'ta İstanbul'da vefat etti.`,

  "naim-talu": `Naim Talu (22 Temmuz 1919, İstanbul - 15 Mayıs 1998, İstanbul), Türk siyasetçi ve ekonomist. Türkiye Cumhuriyeti'nin 15. başbakanı olarak 15 Nisan 1973 - 26 Ocak 1974 tarihleri arasında görev yaptı.

1919 yılında İstanbul'da doğan Naim Talu, Galatasaray Lisesi'nden mezun oldu. İstanbul Üniversitesi Hukuk Fakültesi'ni bitirdi. Columbia Üniversitesi'nde ekonomi eğitimi aldı.

Merkez Bankası'nda uzman olarak göreve başladı. 1946'da Maliye Bakanlığı'na geçti. Çeşitli ekonomik kuruluşlarda üst düzey görevlerde bulundu.

1971 yılında Cumhurbaşkanı Cevdet Sunay tarafından Ticaret Bakanı olarak kabineye alındı. 1972'de Maliye Bakanı oldu. 15 Nisan 1973'te teknokrat bir hükümet kurmakla görevlendirildi.

Talu hükümeti, 1973 genel seçimlerine kadar görev yaptı. Seçimlerden sonra CHP-MSP koalisyon hükümeti kurulunca görevini Bülent Ecevit'e devretti.

Siyasetten sonra özel sektörde yöneticilik yaptı. Çeşitli şirketlerin yönetim kurulu başkanlığında bulundu. 15 Mayıs 1998'de İstanbul'da vefat etti.`,

  "sadi-irmak": `Sadi Irmak (15 Mayıs 1904, Kastamonu - 11 Kasım 1990, Ankara), Türk hekim, fizyolog, siyasetçi. Türkiye Cumhuriyeti'nin 17. başbakanı olarak 17 Kasım 1974 - 31 Mart 1975 tarihleri arasında görev yaptı.

1904 yılında Kastamonu'da doğdu. İstanbul Tıp Fakültesi'nden 1928'de mezun oldu. Almanya'da fizyoloji eğitimi aldı. Ankara Üniversitesi Tıp Fakültesi'nde fizyoloji profesörü olarak görev yaptı.

Türk fizyolojisinin kurucularından biridir. "Kan Basıncı ve Damar Sistemi" üzerine yaptığı çalışmalarla tanındı. Çok sayıda bilimsel makale ve kitap yazdı.

1961'de bağımsız senatör olarak siyasete girdi. 1973'te CHP'den İstanbul senatörü seçildi. 1974 Kıbrıs Barış Harekatı sonrası siyasi kriz döneminde teknokrat bir hükümet kurması için görevlendirildi.

17 Kasım 1974'te başbakanlığa getirildi. Geçici bir hükümet olarak 1975 genel seçimlerine kadar görev yaptı. Seçimlerden sonra görevini Süleyman Demirel'e devretti.

Siyasetten sonra akademik çalışmalarına devam etti. Türk Dil Kurumu üyesiydi. 11 Kasım 1990'da Ankara'da vefat etti.`,

  "ferit-melen": `Ferit Melen (2 Kasım 1906, Van - 3 Eylül 1988, Ankara), Türk siyasetçi. Türkiye Cumhuriyeti'nin 14. başbakanı olarak 26 Mayıs 1972 - 15 Nisan 1973 tarihleri arasında görev yaptı.

1906 yılında Van'da doğdu. İstanbul Hukuk Fakültesi'nden mezun oldu. Avukatlık yaptı. 1950-1960 ve 1965-1980 yılları arasında Van milletvekili olarak görev yaptı.

Cumhuriyet Halk Partisi'nde siyasete başladı. Daha sonra Demokrat Parti'ye katıldı. DP döneminde çeşitli bakanlıklarda görev aldı. 1957-1960 yılları arasında Bayındırlık Bakanı oldu.

12 Mart 1971 Muhtırası sonrası kurulan teknokrat hükümetlerde Savunma Bakanı olarak görev yaptı. 26 Mayıs 1972'de Nihat Erim'in istifasından sonra başbakanlığa getirildi.

Melen hükümeti, 1973 seçimlerine kadar görev yaptı. Bu dönemde ekonomik istikrarın sağlanmasına çalıştı. 15 Nisan 1973'te Naim Talu'ya görevini devretti.

1980'e kadar siyasi hayatına devam etti. 3 Eylül 1988'de Ankara'da vefat etti.`,

  "suat-hayri-urguplu": `Suat Hayri Ürgüplü (13 Ağustos 1903, Şam - 27 Aralık 1981, İstanbul), Türk siyasetçi. Türkiye Cumhuriyeti'nin 11. başbakanı olarak 20 Şubat 1965 - 27 Ekim 1965 tarihleri arasında görev yaptı.

1903 yılında Şam'da doğdu. İstanbul Hukuk Fakültesi'nden mezun oldu. Cumhuriyet döneminin tanınmış siyasetçilerinden biridir. Suat Ürgüplü, Kayseri'nin köklü ailelerinden birine mensuptu.

1939-1950 yılları arasında Kayseri milletvekili olarak görev yaptı. 1961-1980 yılları arasında Cumhuriyet Senatosu üyesi oldu. Adalet Partisi'nde siyaset yaptı.

1965 yılında İsmet İnönü hükümetinin düşmesinden sonra genel seçimlere kadar geçici bir hükümet kurmakla görevlendirildi. 20 Şubat 1965'te başbakanlığa getirildi.

Ürgüplü hükümeti, 10 Ekim 1965 genel seçimlerine kadar görev yaptı. Seçimleri Adalet Partisi kazandı ve görevini Süleyman Demirel'e devretti.

Cumhuriyet Senatosu üyeliğine devam etti. 27 Aralık 1981'de İstanbul'da vefat etti.`,

  "cetin-emec": `Çetin Emeç (3 Aralık 1935, Antalya - 7 Mart 1990, İstanbul), Türk gazeteci, yazar ve köşe yazarı.

1935 yılında Antalya'da doğdu. İstanbul Üniversitesi Hukuk Fakültesi'nden mezun oldu. Gazetecilik hayatına 1950'li yıllarda başladı. Hürriyet gazetesinde muhabir olarak çalıştı.

Türkiye'nin önde gelen gazetecilerinden biriydi. Köşe yazılarıyla tanınan Emeç, siyasi konularda keskin yorumlar yapardı. Milliyetçi çizgide yazılar yazardı.

7 Mart 1990 günü İstanbul Mecidiyeköy'de, Hürriyet gazetesine gitmek üzere arabaya binerken uğradığı silahlı saldırı sonucu öldürüldü. Suikastı Devrimci Sol örgütü üstlendi.

Emeç'in öldürülmesi Türk basın tarihinde önemli bir olay olarak kayıtlara geçti. Ölümünden sonra çeşitli anma etkinlikleri düzenlendi.`,

"nilgun-marmara": `Nilgün Marmara (14 Eylül 1958, İstanbul - 17 Mart 1987, İstanbul), Türk gazeteci.

1958 yılında İstanbul'da doğdu. Gazetecilik mesleğine genç yaşta başladı. Demokratik Sol Parti (DSP) yanlısı yayın yapan Demokrat gazetesinde muhabir olarak çalıştı.

17 Mart 1987 günü İstanbul Cağaloğlu'nda, görev yaptığı Demokrat gazetesinin önünde uğradığı silahlı saldırı sonucu öldürüldü. Henüz 28 yaşındaydı.

Marmara'nın öldürülmesi Türkiye'de kadın gazetecilere yönelik ilk suikast olması nedeniyle büyük yankı uyandırdı. Cinayeti Devrimci Sol örgütü üstlendi.

Ölümünden sonra adına çeşitli ödüller ve anma etkinlikleri düzenlendi. Türk basın tarihinde unutulmayan isimlerden biridir.`,

  "metin-goktepe": `Metin Göktepe (10 Nisan 1968, Aydın - 8 Ocak 1996, İstanbul), Türk gazeteci ve fotoğrafçı.

1968 yılında Aydın'da doğdu. Evrensel gazetesinde fotoğraf muhabiri olarak çalıştı. Gözaltında işkence ve sokak olaylarını fotoğraflamakla tanınırdı.

8 Ocak 1996 günü İstanbul'da tutuklu Hasan Ocak'ın cenazesini takip ederken gözaltına alındı. Gözaltında işkence görerek öldürüldü. Cesedi İstanbul Tıp Fakültesi'nde yapılan otopside işkence izleri tespit edildi.

Göktepe'nin ölümü Türkiye'de büyük protesto gösterilerine neden oldu. Binlerce gazeteci ve yurttaş cenazesine katıldı. Olayın ardından Türkiye Gazeteciler Cemiyeti her yıl 10 Ocak'ı "Çalışan Gazeteciler Günü" olarak kutlamaya başladı.

Metin Göktepe adına gazetecilik ödülleri verilmekte ve anma etkinlikleri düzenlenmektedir.`,

  "cavit-orhan-tutengil": `Cavit Orhan Tütengil (1 Ocak 1921, İstanbul - 7 Aralık 1979, İstanbul), Türk sosyolog ve akademisyen.

1921 yılında İstanbul'da doğdu. İstanbul Üniversitesi İktisat Fakültesi'nden mezun oldu. Aynı üniversitede sosyoloji profesörü olarak görev yaptı.

Türk sosyolojisinin önemli isimlerinden biridir. Toplum yapısı, sosyal tabakalaşma ve Türk toplumu üzerine önemli çalışmalar yaptı. Akademik kariyeri boyunca çok sayıda kitap ve makale yazdı.

7 Aralık 1979 günü İstanbul'daki evinde uğradığı silahlı saldırı sonucu öldürüldü. Cinayeti Devrimci Yol örgütü üstlendi.

Tütengil'in ölümü Türk akademik çevrelerinde büyük üzüntü yarattı. Türk sosyolojisine önemli katkılarda bulunmuş bir bilim insanı olarak anılır.`,
};

async function main() {
  console.log('\n📝 Türk kişilerin açıklamalarını güncelliyorum...\n');
  
  let updated = 0;
  
  for (const [slug, description] of Object.entries(turkishDescriptions)) {
    const person = await db.select().from(persons).where(eq(persons.slug, slug)).limit(1);
    
    if (person.length > 0) {
      await db
        .update(persons)
        .set({ description })
        .where(eq(persons.slug, slug));
      
      const wordCount = description.split(/\s+/).length;
      console.log(`✅ ${person[0].name}: ${wordCount} kelime`);
      updated++;
    }
  }
  
  console.log(`\n📊 Toplam ${updated} kişi güncellendi!\n`);
  
  process.exit(0);
}

main().catch(error => {
  console.error('❌ Hata:', error);
  process.exit(1);
});
