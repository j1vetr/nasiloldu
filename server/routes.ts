import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fetchPersonsFromWikidata, PROFESSION_QIDS, categorizeDeathCause } from "./wikidata";
import { generateSitemap, generateRobotsTxt } from "./seo";
import { fetchWikipediaExtract } from "./wikipedia";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // ========== SEO Routes ==========
  
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const sitemap = await generateSitemap();
      res.header("Content-Type", "application/xml");
      res.send(sitemap);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  app.get("/robots.txt", (req, res) => {
    const robotsTxt = generateRobotsTxt();
    res.header("Content-Type", "text/plain");
    res.send(robotsTxt);
  });

  // ========== Public API Routes ==========

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/categories/:slug/persons", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      const persons = await storage.getPersonsByCategory(category.id);
      res.json(persons);
    } catch (error) {
      console.error("Error fetching persons by category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Countries
  app.get("/api/countries", async (req, res) => {
    try {
      const countries = await storage.getAllCountries();
      res.json(countries);
    } catch (error) {
      console.error("Error fetching countries:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/countries/:slug", async (req, res) => {
    try {
      const country = await storage.getCountryBySlug(req.params.slug);
      if (!country) {
        return res.status(404).json({ error: "Country not found" });
      }
      res.json(country);
    } catch (error) {
      console.error("Error fetching country:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/countries/:slug/persons", async (req, res) => {
    try {
      const country = await storage.getCountryBySlug(req.params.slug);
      if (!country) {
        return res.status(404).json({ error: "Country not found" });
      }
      const persons = await storage.getPersonsByCountry(country.id);
      res.json(persons);
    } catch (error) {
      console.error("Error fetching persons by country:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Professions
  app.get("/api/professions", async (req, res) => {
    try {
      const professions = await storage.getAllProfessions();
      res.json(professions);
    } catch (error) {
      console.error("Error fetching professions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/professions/:slug", async (req, res) => {
    try {
      const profession = await storage.getProfessionBySlug(req.params.slug);
      if (!profession) {
        return res.status(404).json({ error: "Profession not found" });
      }
      res.json(profession);
    } catch (error) {
      console.error("Error fetching profession:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/professions/:slug/persons", async (req, res) => {
    try {
      const profession = await storage.getProfessionBySlug(req.params.slug);
      if (!profession) {
        return res.status(404).json({ error: "Profession not found" });
      }
      const persons = await storage.getPersonsByProfession(profession.id);
      res.json(persons);
    } catch (error) {
      console.error("Error fetching persons by profession:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Persons
  app.get("/api/persons", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const persons = await storage.getAllPersons(limit);
      res.json(persons);
    } catch (error) {
      console.error("Error fetching persons:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/persons/today", async (req, res) => {
    try {
      const persons = await storage.getTodayDeaths();
      res.json(persons);
    } catch (error) {
      console.error("Error fetching today deaths:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/persons/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const persons = await storage.getRecentPersons(limit);
      res.json(persons);
    } catch (error) {
      console.error("Error fetching recent persons:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/persons/popular", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const persons = await storage.getPopularPersons(limit);
      res.json(persons);
    } catch (error) {
      console.error("Error fetching popular persons:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/persons/:slug", async (req, res) => {
    try {
      const person = await storage.getPersonBySlug(req.params.slug);
      if (!person) {
        return res.status(404).json({ error: "Person not found" });
      }
      
      // Increment view count
      await storage.incrementViewCount(person.id);
      
      res.json(person);
    } catch (error) {
      console.error("Error fetching person:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/persons/:slug/related", async (req, res) => {
    try {
      const person = await storage.getPersonBySlug(req.params.slug);
      if (!person) {
        return res.status(404).json({ error: "Person not found" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
      const relatedPersons = await storage.getRelatedPersons(person.id, limit);
      res.json(relatedPersons);
    } catch (error) {
      console.error("Error fetching related persons:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Search
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim().length === 0) {
        return res.json([]);
      }
      
      const results = await storage.searchPersons(query.trim());
      res.json(results);
    } catch (error) {
      console.error("Error searching persons:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ========== Wikipedia Update Route ==========
  app.post("/api/admin/update-wikipedia", async (req, res) => {
    try {
      // Get all persons
      const allPersons = await storage.getAllPersons();
      
      let updated = 0;
      let skipped = 0;
      
      for (const person of allPersons) {
        // Skip if already has long description (Wikipedia likely)
        if (person.description && person.description.length > 500) {
          skipped++;
          continue;
        }
        
        // Fetch Wikipedia extract
        if (person.name) {
          console.log(`Updating ${person.name}...`);
          const wikiExtract = await fetchWikipediaExtract(person.name);
          
          if (wikiExtract && wikiExtract.length > 200) {
            await storage.updatePerson(person.id, {
              description: wikiExtract,
            });
            updated++;
            console.log(`✓ Updated ${person.name} (${wikiExtract.length} chars)`);
          } else {
            skipped++;
            console.log(`✗ No Wikipedia extract for ${person.name}`);
          }
          
          // Rate limiting - wait 500ms between requests
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      res.json({ 
        success: true, 
        updated, 
        skipped, 
        total: allPersons.length 
      });
    } catch (error) {
      console.error("Wikipedia update error:", error);
      res.status(500).json({ error: "Wikipedia update failed" });
    }
  });

  // ========== Admin API Routes ==========

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json({ success: true, admin: { id: admin.id, username: admin.username } });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/import-from-wikidata", async (req, res) => {
    try {
      console.log("Starting Wikidata import (batched mode)...");
      
      const BATCH_SIZE = 10;
      const TOTAL_BATCHES = 5; // 5 batches x 10 = 50 kişi (test için - istersen artırılabilir)
      const BATCH_DELAY_MS = 2000; // 2 saniye bekleme
      
      let totalImported = 0;
      let totalSkipped = 0;
      let totalFetched = 0;

      for (let batchNum = 1; batchNum <= TOTAL_BATCHES; batchNum++) {
        console.log(`\n=== Batch ${batchNum}/${TOTAL_BATCHES} - Fetching ${BATCH_SIZE} persons from Wikidata...`);
        
        // Fetch from Wikidata (actors and politicians)
        const wikidataPersons = await fetchPersonsFromWikidata(
          [PROFESSION_QIDS.ACTOR, PROFESSION_QIDS.POLITICIAN],
          BATCH_SIZE
        );
        
        totalFetched += wikidataPersons.length;
        console.log(`Batch ${batchNum}: Fetched ${wikidataPersons.length} persons`);
        
        if (wikidataPersons.length === 0) {
          console.log(`Batch ${batchNum}: No more data, stopping early`);
          break;
        }

        let batchImported = 0;
        let batchSkipped = 0;

        for (const wp of wikidataPersons) {
          // Check if already exists
          const existing = await storage.getPersonByQid(wp.qid);
          if (existing) {
            batchSkipped++;
            continue;
          }

          // Get or create profession
          const profession = await storage.getOrCreateProfession(
            wp.professionLabel || "Bilinmiyor",
            wp.professionQid || undefined
          );

          // Get or create country
          const country = await storage.getOrCreateCountry(
            wp.countryLabel || "Bilinmiyor",
            wp.countryQid || undefined
          );

          // Determine category
          const categorySlug = categorizeDeathCause(wp.deathCauseLabel);
          const category = await storage.getCategoryBySlug(categorySlug);
          if (!category) {
            console.error(`Category not found: ${categorySlug}`);
            continue;
          }

          // Get or create death cause
          let deathCause = null;
          if (wp.deathCauseLabel) {
            deathCause = await storage.getOrCreateDeathCause(
              wp.deathCauseLabel,
              category.id,
              wp.deathCauseQid || undefined
            );
          }

          // Create slug
          const slug = wp.name
            .toLowerCase()
            .replace(/ı/g, 'i')
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

          // Fetch Wikipedia extract for detailed description
          let detailedDescription = wp.description;
          if (wp.wikipediaUrl) {
            console.log(`Fetching Wikipedia extract for ${wp.name}...`);
            const wikiExtract = await fetchWikipediaExtract(wp.name);
            if (wikiExtract && wikiExtract.length > 200) {
              detailedDescription = wikiExtract;
              console.log(`✓ Got ${wikiExtract.length} chars for ${wp.name}`);
            } else {
              console.log(`✗ No Wikipedia extract for ${wp.name}, using Wikidata description`);
            }
          }

          // Create person
          await storage.createPerson({
            qid: wp.qid,
            slug,
            name: wp.name,
            birthDate: wp.birthDate,
            deathDate: wp.deathDate,
            deathPlace: wp.deathPlace,
            imageUrl: wp.imageUrl,
            wikipediaUrl: wp.wikipediaUrl,
            description: detailedDescription,
            professionId: profession.id,
            countryId: country.id,
            deathCauseId: deathCause?.id || null,
            categoryId: category.id,
            isApproved: true,
          });

          batchImported++;
        }
        
        totalImported += batchImported;
        totalSkipped += batchSkipped;
        
        console.log(`Batch ${batchNum} complete: ${batchImported} imported, ${batchSkipped} skipped`);
        console.log(`Total progress: ${totalImported} imported, ${totalSkipped} skipped, ${totalFetched} fetched`);
        
        // Wait before next batch (rate limiting)
        if (batchNum < TOTAL_BATCHES && wikidataPersons.length > 0) {
          console.log(`Waiting ${BATCH_DELAY_MS/1000}s before next batch...`);
          await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
        }
      }

      console.log(`\n=== Import complete: ${totalImported} imported, ${totalSkipped} skipped, ${totalFetched} total fetched ===`);
      res.json({ success: true, imported: totalImported, skipped: totalSkipped, total: totalFetched });
    } catch (error) {
      console.error("Error importing from Wikidata:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
