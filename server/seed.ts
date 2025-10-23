import { db } from "./db";
import { storage } from "./storage";
import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // 1. Create categories
    console.log("Creating categories...");
    const categories = [
      {
        slug: "hastalik",
        name: "Hastalık",
        description: "Hastalık nedeniyle vefat eden ünlüler",
      },
      {
        slug: "kaza",
        name: "Kaza",
        description: "Kaza nedeniyle vefat eden ünlüler",
      },
      {
        slug: "intihar",
        name: "İntihar",
        description: "İntihar nedeniyle vefat eden ünlüler",
      },
      {
        slug: "suikast",
        name: "Suikast",
        description: "Suikast veya cinayet nedeniyle vefat eden ünlüler",
      },
    ];

    for (const category of categories) {
      const existing = await storage.getCategoryBySlug(category.slug);
      if (!existing) {
        await storage.createCategory(category);
        console.log(`✓ Created category: ${category.name}`);
      } else {
        console.log(`- Category already exists: ${category.name}`);
      }
    }

    // 2. Create admin user (toov / Toov1453@@)
    console.log("\nCreating admin user...");
    const adminUsername = "toov";
    const adminPassword = "Toov1453@@";
    
    const existingAdmin = await storage.getAdminByUsername(adminUsername);
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await storage.createAdmin({
        username: adminUsername,
        password: hashedPassword,
      });
      console.log(`✓ Created admin user: ${adminUsername}`);
    } else {
      console.log(`- Admin user already exists: ${adminUsername}`);
    }

    // 3. Create some sample countries and professions
    console.log("\nCreating sample professions...");
    const professions = [
      { name: "Oyuncu", slug: "oyuncu" },
      { name: "Politikacı", slug: "politikaci" },
      { name: "Müzisyen", slug: "muzisyen" },
      { name: "Sporcu", slug: "sporcu" },
      { name: "Yazar", slug: "yazar" },
    ];

    for (const profession of professions) {
      const existing = await storage.getProfessionBySlug(profession.slug);
      if (!existing) {
        await storage.getOrCreateProfession(profession.name);
        console.log(`✓ Created profession: ${profession.name}`);
      }
    }

    console.log("\nCreating sample countries...");
    const countries = [
      "Türkiye",
      "Amerika Birleşik Devletleri",
      "İngiltere",
      "Fransa",
      "Almanya",
      "İtalya",
      "İspanya",
      "Bilinmiyor",
    ];

    for (const country of countries) {
      await storage.getOrCreateCountry(country);
      console.log(`✓ Created country: ${country}`);
    }

    console.log("\n✅ Database seed completed successfully!");
    console.log("\nℹ️  Admin credentials:");
    console.log(`   Username: ${adminUsername}`);
    console.log(`   Password: ${adminPassword}`);
    console.log("\n💡 Next step: Import data from Wikidata via /api/admin/import-from-wikidata");

  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seed();
