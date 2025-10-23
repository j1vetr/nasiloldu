// Wikipedia API - Türkçe açıklamalar için

interface WikipediaExtract {
  title: string;
  extract: string;
  description: string;
}

/**
 * Wikipedia'dan kişi hakkında detaylı açıklama çeker (Türkçe)
 * @param personName - Kişinin adı
 * @returns 300+ kelime açıklama veya null
 */
export async function fetchWikipediaExtract(personName: string): Promise<string | null> {
  try {
    // Türkçe Wikipedia API
    const apiUrl = new URL("https://tr.wikipedia.org/w/api.php");
    apiUrl.searchParams.set("action", "query");
    apiUrl.searchParams.set("format", "json");
    apiUrl.searchParams.set("titles", personName);
    apiUrl.searchParams.set("prop", "extracts");
    apiUrl.searchParams.set("exintro", "0"); // Tüm makale
    apiUrl.searchParams.set("explaintext", "1"); // Plain text
    apiUrl.searchParams.set("exchars", "2000"); // İlk 2000 karakter (yaklaşık 300 kelime)
    apiUrl.searchParams.set("redirects", "1");

    const response = await fetch(apiUrl.toString(), {
      headers: {
        "User-Agent": "nasiloldu.net/1.0 (https://nasiloldu.net; contact@nasiloldu.net)",
      },
    });

    if (!response.ok) {
      console.error(`Wikipedia API error: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    const pages = data.query?.pages;
    
    if (!pages) {
      return null;
    }

    // İlk (ve tek olması gereken) sayfayı al
    const page = Object.values(pages)[0] as any;
    
    if (page.missing || !page.extract) {
      return null;
    }

    // Açıklamayı temizle ve döndür
    let extract = page.extract.trim();
    
    // Çok uzunsa kısalt (max 2500 karakter)
    if (extract.length > 2500) {
      // Son cümleyi bul ve orada kes
      const lastPeriod = extract.lastIndexOf(".", 2500);
      if (lastPeriod > 1500) {
        extract = extract.substring(0, lastPeriod + 1);
      } else {
        extract = extract.substring(0, 2500) + "...";
      }
    }

    return extract;
  } catch (error) {
    console.error("Wikipedia fetch error:", error);
    return null;
  }
}

/**
 * Wikipedia açıklamasını paragraf formatında döndür
 */
export function formatWikipediaExtract(extract: string): string[] {
  // Çift satır sonlarında böl (paragraflar)
  const paragraphs = extract
    .split("\n\n")
    .map(p => p.trim())
    .filter(p => p.length > 0);
  
  return paragraphs;
}
