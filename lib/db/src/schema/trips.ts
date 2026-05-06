import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  real,
  json,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tripsTable = pgTable("trips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull().default(""),
  location: text("location").notNull(),
  country: text("country").notNull().default("Algeria"),
  durationDays: integer("duration_days").notNull(),
  priceDzd: integer("price_dzd").notNull(),
  originalPriceDzd: integer("original_price_dzd"),
  maxGroupSize: integer("max_group_size").notNull().default(12),
  spotsLeft: integer("spots_left").notNull().default(12),
  imageUrl: text("image_url").notNull(),
  galleryImages: json("gallery_images").$type<string[]>().notNull().default([]),
  highlights: json("highlights").$type<string[]>().notNull().default([]),
  included: json("included").$type<string[]>().notNull().default([]),
  excluded: json("excluded").$type<string[]>().notNull().default([]),
  isFeatured: boolean("is_featured").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  departureDate: text("departure_date"),
  returnDate: text("return_date"),
  difficulty: text("difficulty").notNull().default("Easy"),
  category: text("category").notNull().default("Adventure"),
  rating: real("rating").notNull().default(4.8),
  reviewCount: integer("review_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertTripSchema = createInsertSchema(tripsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof tripsTable.$inferSelect;
