import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin kullanıcılar tablosu
export const admins = pgTable("admins", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Kategoriler tablosu (Hastalık, Kaza, İntihar, Suikast)
export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
});

// Ülkeler tablosu
export const countries = pgTable("countries", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  qid: text("qid").unique(), // Wikidata QID
});

// Meslekler tablosu
export const professions = pgTable("professions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  qid: text("qid").unique(), // Wikidata QID
});

// Ölüm nedenleri tablosu
export const deathCauses = pgTable("death_causes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  qid: text("qid").unique(), // Wikidata QID
});

// Kişiler tablosu
export const persons = pgTable("persons", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  qid: text("qid").notNull().unique(), // Wikidata QID - tekilleştirme için
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  birthDate: text("birth_date"), // YYYY-MM-DD formatında
  birthPlace: text("birth_place"), // Doğum yeri
  deathDate: text("death_date"), // YYYY-MM-DD formatında
  deathPlace: text("death_place"), // Ölüm yeri
  deathCause: text("death_cause"), // Ölüm nedeni (text)
  nationality: text("nationality"), // Uyruk/milliyet
  imageUrl: text("image_url"),
  wikipediaUrl: text("wikipedia_url"),
  description: text("description"), // Kısa açıklama
  professionId: integer("profession_id").references(() => professions.id).notNull(),
  countryId: integer("country_id").references(() => countries.id).notNull(),
  deathCauseId: integer("death_cause_id").references(() => deathCauses.id),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  isApproved: boolean("is_approved").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  persons: many(persons),
  deathCauses: many(deathCauses),
}));

export const countriesRelations = relations(countries, ({ many }) => ({
  persons: many(persons),
}));

export const professionsRelations = relations(professions, ({ many }) => ({
  persons: many(persons),
}));

export const deathCausesRelations = relations(deathCauses, ({ one, many }) => ({
  category: one(categories, {
    fields: [deathCauses.categoryId],
    references: [categories.id],
  }),
  persons: many(persons),
}));

export const personsRelations = relations(persons, ({ one }) => ({
  profession: one(professions, {
    fields: [persons.professionId],
    references: [professions.id],
  }),
  country: one(countries, {
    fields: [persons.countryId],
    references: [countries.id],
  }),
  deathCause: one(deathCauses, {
    fields: [persons.deathCauseId],
    references: [deathCauses.id],
  }),
  category: one(categories, {
    fields: [persons.categoryId],
    references: [categories.id],
  }),
}));

// Insert schemas
export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertCountrySchema = createInsertSchema(countries).omit({
  id: true,
});

export const insertProfessionSchema = createInsertSchema(professions).omit({
  id: true,
});

export const insertDeathCauseSchema = createInsertSchema(deathCauses).omit({
  id: true,
});

export const insertPersonSchema = createInsertSchema(persons).omit({
  id: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Country = typeof countries.$inferSelect;
export type InsertCountry = z.infer<typeof insertCountrySchema>;

export type Profession = typeof professions.$inferSelect;
export type InsertProfession = z.infer<typeof insertProfessionSchema>;

export type DeathCause = typeof deathCauses.$inferSelect;
export type InsertDeathCause = z.infer<typeof insertDeathCauseSchema>;

export type Person = typeof persons.$inferSelect;
export type InsertPerson = z.infer<typeof insertPersonSchema>;

// Genişletilmiş tipler (ilişkilerle)
export type PersonWithRelations = Person & {
  profession: Profession;
  country: Country;
  deathCause: DeathCause | null;
  category: Category;
};
