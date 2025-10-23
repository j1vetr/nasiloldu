import { useEffect } from "react";
import type { PersonWithRelations } from "@shared/schema";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  schema?: any;
}

export function SEOHead({ title, description, canonical, ogType = "website", schema }: SEOHeadProps) {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, useProperty: boolean = false) => {
      const attr = useProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Description
    updateMetaTag("description", description);

    // Open Graph
    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:type", ogType, true);
    if (canonical) {
      updateMetaTag("og:url", canonical, true);
    }

    // Twitter Cards
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);

    // Canonical link
    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!linkElement) {
        linkElement = document.createElement("link");
        linkElement.rel = "canonical";
        document.head.appendChild(linkElement);
      }
      linkElement.href = canonical;
    }

    // Schema.org JSON-LD
    const scriptId = "seo-json-ld";
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (schema) {
      if (!scriptElement) {
        scriptElement = document.createElement("script");
        scriptElement.id = scriptId;
        scriptElement.type = "application/ld+json";
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(schema);
    } else {
      // Remove JSON-LD script if schema is undefined
      if (scriptElement) {
        scriptElement.remove();
      }
    }
  }, [title, description, canonical, ogType, schema]);

  return null;
}

export function generatePersonSchema(person: PersonWithRelations) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": person.name,
    "birthDate": person.birthDate || undefined,
    "deathDate": person.deathDate || undefined,
    "deathPlace": person.deathPlace ? {
      "@type": "Place",
      "name": person.deathPlace,
    } : undefined,
    "jobTitle": person.profession.name,
    "nationality": {
      "@type": "Country",
      "name": person.country.name,
    },
    "description": person.description || `${person.name} - ${person.profession.name}`,
    "image": person.imageUrl || undefined,
    "url": person.wikipediaUrl || undefined,
  };
}
