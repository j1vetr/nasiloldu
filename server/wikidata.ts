// Wikidata SPARQL API entegrasyonu
interface WikidataPerson {
  qid: string;
  name: string;
  birthDate: string | null;
  deathDate: string | null;
  deathPlace: string | null;
  imageUrl: string | null;
  wikipediaUrl: string | null;
  description: string | null;
  professionQid: string | null;
  professionLabel: string | null;
  countryQid: string | null;
  countryLabel: string | null;
  deathCauseQid: string | null;
  deathCauseLabel: string | null;
}

const WIKIDATA_SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";

export async function fetchPersonsFromWikidata(
  professionQids: string[],
  limit: number = 500
): Promise<WikidataPerson[]> {
  const professionFilter = professionQids.map(qid => `wd:${qid}`).join(" ");
  
  const query = `
    SELECT DISTINCT ?person ?personLabel ?birthDate ?deathDate ?deathPlace ?deathPlaceLabel 
                    ?image ?article ?description ?profession ?professionLabel 
                    ?country ?countryLabel ?deathCause ?deathCauseLabel
    WHERE {
      VALUES ?professionType { ${professionFilter} }
      
      ?person wdt:P31 wd:Q5 ;
              wdt:P106 ?professionType ;
              wdt:P570 ?deathDate .
      
      OPTIONAL { ?person wdt:P569 ?birthDate . }
      OPTIONAL { ?person wdt:P20 ?deathPlace . }
      OPTIONAL { ?person wdt:P18 ?image . }
      OPTIONAL { ?person wdt:P106 ?profession . }
      OPTIONAL { ?person wdt:P27 ?country . }
      OPTIONAL { ?person wdt:P509 ?deathCause . }
      
      OPTIONAL {
        ?article schema:about ?person ;
                schema:isPartOf <https://tr.wikipedia.org/> .
      }
      
      SERVICE wikibase:label { 
        bd:serviceParam wikibase:language "tr,en" .
        ?person rdfs:label ?personLabel .
        ?deathPlace rdfs:label ?deathPlaceLabel .
        ?profession rdfs:label ?professionLabel .
        ?country rdfs:label ?countryLabel .
        ?deathCause rdfs:label ?deathCauseLabel .
        ?person schema:description ?description .
      }
      
      FILTER(BOUND(?deathDate))
    }
    LIMIT ${limit}
  `;

  try {
    const response = await fetch(WIKIDATA_SPARQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/sparql-query",
        "Accept": "application/sparql-results+json",
        "User-Agent": "nasiloldu.net/1.0",
      },
      body: query,
    });

    if (!response.ok) {
      throw new Error(`Wikidata API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.results.bindings.map((binding: any) => ({
      qid: binding.person.value.split("/").pop(),
      name: binding.personLabel?.value || "Bilinmiyor",
      birthDate: binding.birthDate?.value?.split("T")[0] || null,
      deathDate: binding.deathDate?.value?.split("T")[0] || null,
      deathPlace: binding.deathPlaceLabel?.value || null,
      imageUrl: binding.image?.value || null,
      wikipediaUrl: binding.article?.value || null,
      description: binding.description?.value || null,
      professionQid: binding.profession?.value?.split("/").pop() || null,
      professionLabel: binding.professionLabel?.value || "Bilinmiyor",
      countryQid: binding.country?.value?.split("/").pop() || null,
      countryLabel: binding.countryLabel?.value || "Bilinmiyor",
      deathCauseQid: binding.deathCause?.value?.split("/").pop() || null,
      deathCauseLabel: binding.deathCauseLabel?.value || null,
    }));
  } catch (error) {
    console.error("Wikidata fetch error:", error);
    return [];
  }
}

// Wikidata QID'leri - Meslekler
export const PROFESSION_QIDS = {
  ACTOR: "Q33999",        // oyuncu
  POLITICIAN: "Q82955",   // politikacı
  MUSICIAN: "Q639669",    // müzisyen
  ATHLETE: "Q2066131",    // sporcu
  WRITER: "Q36180",       // yazar
  DIRECTOR: "Q2526255",   // yönetmen
};

// Belirli QID'ler için kişi çekme
export async function fetchPersonsByQids(qids: string[]): Promise<WikidataPerson[]> {
  const qidValues = qids.map(qid => `wd:${qid}`).join(" ");
  
  const query = `
    SELECT ?person ?personLabel ?birthDate ?deathDate ?deathPlace ?deathPlaceLabel 
           ?image ?article ?description
           (SAMPLE(?profession) AS ?profession) (SAMPLE(?professionLabel) AS ?professionLabel)
           (SAMPLE(?country) AS ?country) (SAMPLE(?countryLabel) AS ?countryLabel)
           (SAMPLE(?deathCause) AS ?deathCause) (SAMPLE(?deathCauseLabel) AS ?deathCauseLabel)
    WHERE {
      VALUES ?person { ${qidValues} }
      
      ?person wdt:P31 wd:Q5 .
      
      OPTIONAL { ?person wdt:P569 ?birthDate . }
      OPTIONAL { ?person wdt:P570 ?deathDate . }
      OPTIONAL { ?person wdt:P20 ?deathPlace . }
      OPTIONAL { ?person wdt:P18 ?image . }
      OPTIONAL { ?person wdt:P106 ?profession . }
      OPTIONAL { ?person wdt:P27 ?country . }
      OPTIONAL { ?person wdt:P509 ?deathCause . }
      
      OPTIONAL {
        ?article schema:about ?person ;
                schema:isPartOf <https://tr.wikipedia.org/> .
      }
      
      SERVICE wikibase:label { 
        bd:serviceParam wikibase:language "tr,en" .
        ?person rdfs:label ?personLabel .
        ?deathPlace rdfs:label ?deathPlaceLabel .
        ?profession rdfs:label ?professionLabel .
        ?country rdfs:label ?countryLabel .
        ?deathCause rdfs:label ?deathCauseLabel .
        ?person schema:description ?description .
      }
    }
    GROUP BY ?person ?personLabel ?birthDate ?deathDate ?deathPlace ?deathPlaceLabel ?image ?article ?description
  `;

  try {
    const response = await fetch(WIKIDATA_SPARQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/sparql-query",
        "Accept": "application/sparql-results+json",
        "User-Agent": "nasiloldu.net/1.0",
      },
      body: query,
    });

    if (!response.ok) {
      throw new Error(`Wikidata API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.results.bindings.map((binding: any) => ({
      qid: binding.person.value.split("/").pop(),
      name: binding.personLabel?.value || "Bilinmiyor",
      birthDate: binding.birthDate?.value?.split("T")[0] || null,
      deathDate: binding.deathDate?.value?.split("T")[0] || null,
      deathPlace: binding.deathPlaceLabel?.value || null,
      imageUrl: binding.image?.value || null,
      wikipediaUrl: binding.article?.value || null,
      description: binding.description?.value || null,
      professionQid: binding.profession?.value?.split("/").pop() || null,
      professionLabel: binding.professionLabel?.value || "Bilinmiyor",
      countryQid: binding.country?.value?.split("/").pop() || null,
      countryLabel: binding.countryLabel?.value || "Bilinmiyor",
      deathCauseQid: binding.deathCause?.value?.split("/").pop() || null,
      deathCauseLabel: binding.deathCauseLabel?.value || null,
    }));
  } catch (error) {
    console.error("Wikidata fetch error:", error);
    return [];
  }
}

// Kategori eşleştirme yardımcısı
export function categorizeDeathCause(deathCauseLabel: string | null): string {
  if (!deathCauseLabel) return "hastalik";
  
  const lowerLabel = deathCauseLabel.toLowerCase();
  
  // İntihar
  if (lowerLabel.includes("intihar") || lowerLabel.includes("suicide")) {
    return "intihar";
  }
  
  // Suikast / İdam / Cinayet / Asılma / Ateşli Silah
  if (lowerLabel.includes("suikast") || lowerLabel.includes("cinayet") || 
      lowerLabel.includes("assassination") || lowerLabel.includes("murder") ||
      lowerLabel.includes("murdered") || lowerLabel.includes("killed") ||
      lowerLabel.includes("idam") || lowerLabel.includes("execution") ||
      lowerLabel.includes("capital punishment") || lowerLabel.includes("hanging") ||
      lowerLabel.includes("hanged") || lowerLabel.includes("shot") ||
      lowerLabel.includes("ateşli silah") || lowerLabel.includes("kurşun") ||
      lowerLabel.includes("bomba") || lowerLabel.includes("bomb") ||
      lowerLabel.includes("öldürme") || lowerLabel.includes("katil") ||
      lowerLabel.includes("gunshot") || lowerLabel.includes("shooting") ||
      lowerLabel.includes("asılma") || lowerLabel.includes("asıldı")) {
    return "suikast";
  }
  
  // Kaza
  if (lowerLabel.includes("kaza") || lowerLabel.includes("accident") ||
      lowerLabel.includes("crash") || lowerLabel.includes("drowning") ||
      lowerLabel.includes("trafik")) {
    return "kaza";
  }
  
  // Varsayılan: Hastalık
  return "hastalik";
}
