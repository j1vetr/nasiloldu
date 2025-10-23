import { useEffect } from "react";
import type { PersonWithRelations } from "@shared/schema";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string | null;
  schema?: any;
}

export function SEOHead({ title, description, canonical, ogType = "website", ogImage, schema }: SEOHeadProps) {
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
    if (ogImage) {
      updateMetaTag("og:image", ogImage, true);
    }

    // Twitter Cards
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    if (ogImage) {
      updateMetaTag("twitter:image", ogImage);
    }

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

    // Schema.org JSON-LD (supports single object or array)
    // Clean up old schema scripts
    document.querySelectorAll('script[type="application/ld+json"][id^="seo-json-ld"]').forEach(el => el.remove());
    
    if (schema) {
      const schemas = Array.isArray(schema) ? schema : [schema];
      schemas.forEach((schemaObj, index) => {
        const scriptElement = document.createElement("script");
        scriptElement.id = `seo-json-ld-${index}`;
        scriptElement.type = "application/ld+json";
        scriptElement.textContent = JSON.stringify(schemaObj);
        document.head.appendChild(scriptElement);
      });
    }
  }, [title, description, canonical, ogType, ogImage, schema]);

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
