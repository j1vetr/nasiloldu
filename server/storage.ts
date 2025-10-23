// Referenced from javascript_database blueprint integration
import { 
  admins, 
  categories, 
  countries, 
  professions, 
  deathCauses,
  persons,
  type Admin,
  type InsertAdmin,
  type Category,
  type InsertCategory,
  type Country,
  type InsertCountry,
  type Profession,
  type InsertProfession,
  type DeathCause,
  type InsertDeathCause,
  type Person,
  type InsertPerson,
  type PersonWithRelations,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, or, like, asc } from "drizzle-orm";

export interface IStorage {
  // Admin methods
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  
  // Stats methods
  getStats(): Promise<{ totalPersons: number; totalCategories: number; totalCountries: number; totalProfessions: number }>;
  
  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Country methods
  getAllCountries(): Promise<Country[]>;
  getCountryBySlug(slug: string): Promise<Country | undefined>;
  getOrCreateCountry(name: string, qid?: string): Promise<Country>;
  
  // Profession methods
  getAllProfessions(): Promise<Profession[]>;
  getProfessionBySlug(slug: string): Promise<Profession | undefined>;
  getOrCreateProfession(name: string, qid?: string): Promise<Profession>;
  
  // DeathCause methods
  getOrCreateDeathCause(name: string, categoryId: number, qid?: string): Promise<DeathCause>;
  
  // Person methods
  getAllPersons(limit?: number): Promise<PersonWithRelations[]>;
  getPersonBySlug(slug: string): Promise<PersonWithRelations | undefined>;
  getPersonByQid(qid: string): Promise<Person | undefined>;
  getTodayDeaths(): Promise<PersonWithRelations[]>;
  getRecentPersons(limit: number): Promise<PersonWithRelations[]>;
  getPopularPersons(limit: number): Promise<PersonWithRelations[]>;
  getPersonsByCategory(categoryId: number): Promise<PersonWithRelations[]>;
  getPersonsByCountry(countryId: number): Promise<PersonWithRelations[]>;
  getPersonsByProfession(professionId: number): Promise<PersonWithRelations[]>;
  searchPersons(query: string): Promise<PersonWithRelations[]>;
  getRelatedPersons(personId: number, limit: number): Promise<PersonWithRelations[]>;
  createPerson(person: InsertPerson): Promise<Person>;
  updatePerson(personId: number, updates: Partial<InsertPerson>): Promise<Person>;
  incrementViewCount(personId: number): Promise<void>;
  
  // Stats
  getDashboardStats(): Promise<{
    totalPersons: number;
    totalCategories: number;
    totalCountries: number;
    totalProfessions: number;
    recentPersons: number;
    todayDeaths: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Admin methods
  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const [admin] = await db.insert(admins).values(insertAdmin).returning();
    return admin;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [result] = await db.insert(categories).values(category).returning();
    return result;
  }

  // Country methods
  async getAllCountries(): Promise<Country[]> {
    return await db.select().from(countries).orderBy(countries.name);
  }

  async getCountryBySlug(slug: string): Promise<Country | undefined> {
    const [country] = await db.select().from(countries).where(eq(countries.slug, slug));
    return country || undefined;
  }

  async getOrCreateCountry(name: string, qid?: string): Promise<Country> {
    const slug = name.toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const [existing] = await db.select().from(countries).where(eq(countries.slug, slug));
    if (existing) return existing;

    const [country] = await db.insert(countries).values({ name, slug, qid }).returning();
    return country;
  }

  // Profession methods
  async getAllProfessions(): Promise<Profession[]> {
    return await db.select().from(professions).orderBy(professions.name);
  }

  async getProfessionBySlug(slug: string): Promise<Profession | undefined> {
    const [profession] = await db.select().from(professions).where(eq(professions.slug, slug));
    return profession || undefined;
  }

  async getOrCreateProfession(name: string, qid?: string): Promise<Profession> {
    const slug = name.toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const [existing] = await db.select().from(professions).where(eq(professions.slug, slug));
    if (existing) return existing;

    const [profession] = await db.insert(professions).values({ name, slug, qid }).returning();
    return profession;
  }

  // DeathCause methods
  async getOrCreateDeathCause(name: string, categoryId: number, qid?: string): Promise<DeathCause> {
    if (qid) {
      const [existing] = await db.select().from(deathCauses).where(eq(deathCauses.qid, qid));
      if (existing) {
        // Update category if it changed (handles recategorization)
        if (existing.categoryId !== categoryId) {
          console.log(`Updating death cause "${existing.name}" category: ${existing.categoryId} -> ${categoryId}`);
          const [updated] = await db.update(deathCauses)
            .set({ categoryId })
            .where(eq(deathCauses.id, existing.id))
            .returning();
          return updated;
        }
        return existing;
      }
    }

    const [deathCause] = await db.insert(deathCauses)
      .values({ name, categoryId, qid })
      .returning();
    return deathCause;
  }

  // Person methods
  async getAllPersons(limit: number = 100): Promise<PersonWithRelations[]> {
    const results = await db.query.persons.findMany({
      limit,
      orderBy: [desc(persons.createdAt)],
      with: {
        profession: true,
        country: true,
        deathCause: true,
        category: true,
      },
    });
    return results as PersonWithRelations[];
  }

  async getPersonBySlug(slug: string): Promise<PersonWithRelations | undefined> {
    const result = await db.query.persons.findFirst({
      where: eq(persons.slug, slug),
      with: {
        profession: true,
        country: true,
        deathCause: true,
        category: true,
      },
    });
    return result as PersonWithRelations | undefined;
  }

  async getPersonByQid(qid: string): Promise<Person | undefined> {
    const [person] = await db.select().from(persons).where(eq(persons.qid, qid));
    return person || undefined;
  }

  async getTodayDeaths(): Promise<PersonWithRelations[]> {
    const today = new Date();
    const monthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const results = await db.query.persons.findMany({
      where: sql`SUBSTRING(${persons.deathDate}, 6, 5) = ${monthDay}`,
      orderBy: [desc(persons.viewCount)],
      limit: 20,
      with: {
        profession: true,
        country: true,
        deathCause: true,
        category: true,
      },
    });
    return results as PersonWithRelations[];
  }

  async getRecentPersons(limit: number): Promise<PersonWithRelations[]> {
    const results = await db.query.persons.findMany({
      limit,
      orderBy: [desc(persons.createdAt)],
      with: {
        profession: true,
        country: true,
        deathCause: true,
        category: true,
      },
    });
    return results as PersonWithRelations[];
  }

  async getPopularPersons(limit: number): Promise<PersonWithRelations[]> {
    const results = await db.query.persons.findMany({
      limit,
      orderBy: [desc(persons.viewCount)],
      with: {
        profession: true,
        country: true,
        deathCause: true,
        category: true,
      },
    });
    return results as PersonWithRelations[];
  }

  async getPersonsByCategory(categoryId: number): Promise<PersonWithRelations[]> {
    const results = await db.query.persons.findMany({
      where: eq(persons.categoryId, categoryId),
      orderBy: [desc(persons.viewCount)],
      with: {
        profession: true,
        country: true,
        deathCause: true,
        category: true,
      },
    });
    return results as PersonWithRelations[];
  }

  async getPersonsByCountry(countryId: number): Promise<PersonWithRelations[]> {
    const results = await db.query.persons.findMany({
      where: eq(persons.countryId, countryId),
      orderBy: [desc(persons.viewCount)],
      with: {
        profession: true,
        country: true,
        deathCause: true,
        category: true,
      },
    });
    return results as PersonWithRelations[];
  }

  async getPersonsByProfession(professionId: number): Promise<PersonWithRelations[]> {
    const results = await db.query.persons.findMany({
      where: eq(persons.professionId, professionId),
      orderBy: [desc(persons.viewCount)],
      with: {
        profession: true,
        country: true,
        deathCause: true,
        category: true,
      },
    });
    return results as PersonWithRelations[];
  }

  async searchPersons(query: string): Promise<PersonWithRelations[]> {
    const searchTerm = `%${query}%`;
    const results = await db.query.persons.findMany({
      where: sql`unaccent(${persons.name}) ILIKE unaccent(${searchTerm})`,
      orderBy: [desc(persons.viewCount)],
      limit: 50,
      with: {
        profession: true,
        country: true,
        deathCause: true,
        category: true,
      },
    });
    return results as PersonWithRelations[];
  }

  async getRelatedPersons(personId: number, limit: number): Promise<PersonWithRelations[]> {
    const [person] = await db.select().from(persons).where(eq(persons.id, personId));
    if (!person) return [];

    const results = await db.query.persons.findMany({
      where: and(
        sql`${persons.id} != ${personId}`,
        or(
          eq(persons.categoryId, person.categoryId),
          eq(persons.countryId, person.countryId),
          eq(persons.professionId, person.professionId)
        )
      ),
      orderBy: [desc(persons.viewCount)],
      limit,
      with: {
        profession: true,
        country: true,
        deathCause: true,
        category: true,
      },
    });
    return results as PersonWithRelations[];
  }

  async createPerson(person: InsertPerson): Promise<Person> {
    const [result] = await db.insert(persons).values(person).returning();
    return result;
  }

  async updatePerson(personId: number, updates: Partial<InsertPerson>): Promise<Person> {
    const [result] = await db.update(persons)
      .set(updates)
      .where(eq(persons.id, personId))
      .returning();
    return result;
  }

  async incrementViewCount(personId: number): Promise<void> {
    await db.update(persons)
      .set({ viewCount: sql`${persons.viewCount} + 1` })
      .where(eq(persons.id, personId));
  }

  // Stats
  async getStats() {
    const [totalPersons] = await db.select({ count: sql<number>`count(*)::int` }).from(persons);
    const [totalCategories] = await db.select({ count: sql<number>`count(*)::int` }).from(categories);
    const [totalCountries] = await db.select({ count: sql<number>`count(*)::int` }).from(countries);
    const [totalProfessions] = await db.select({ count: sql<number>`count(*)::int` }).from(professions);

    return {
      totalPersons: totalPersons.count,
      totalCategories: totalCategories.count,
      totalCountries: totalCountries.count,
      totalProfessions: totalProfessions.count,
    };
  }

  async getDashboardStats() {
    const stats = await this.getStats();
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const [recentPersonsCount] = await db.select({ count: sql<number>`count(*)::int` })
      .from(persons)
      .where(sql`${persons.createdAt} >= ${thirtyDaysAgo.toISOString()}`);

    const todayDeaths = await this.getTodayDeaths();

    return {
      ...stats,
      recentPersons: recentPersonsCount.count,
      todayDeaths: todayDeaths.length,
    };
  }
}

export const storage = new DatabaseStorage();
