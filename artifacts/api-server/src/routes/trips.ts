import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, tripsTable } from "@workspace/db";
import { serializeDb } from "../lib/serialize";
import {
  ListTripsQueryParams,
  ListTripsResponse,
  GetTripParams,
  GetTripResponse,
  CreateTripBody,
  UpdateTripParams,
  UpdateTripBody,
  UpdateTripResponse,
  DeleteTripParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/trips", async (req, res): Promise<void> => {
  const query = ListTripsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let trips = await db.select().from(tripsTable).orderBy(tripsTable.createdAt);

  if (query.data.featured === "true") {
    trips = trips.filter((t) => t.isFeatured && t.isActive);
  } else {
    trips = trips.filter((t) => t.isActive);
  }

  if (query.data.limit) {
    trips = trips.slice(0, query.data.limit);
  }

  res.json(ListTripsResponse.parse(serializeDb(trips)));
});

router.post("/trips", async (req, res): Promise<void> => {
  const adminToken = req.signedCookies?.["admin_session"];
  if (!adminToken) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateTripBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [trip] = await db.insert(tripsTable).values({
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description,
    shortDescription: parsed.data.shortDescription ?? "",
    location: parsed.data.location,
    country: parsed.data.country ?? "Algeria",
    durationDays: parsed.data.durationDays,
    priceDzd: parsed.data.priceDzd,
    originalPriceDzd: parsed.data.originalPriceDzd ?? null,
    maxGroupSize: parsed.data.maxGroupSize ?? 12,
    spotsLeft: parsed.data.spotsLeft ?? 12,
    imageUrl: parsed.data.imageUrl,
    galleryImages: parsed.data.galleryImages ?? [],
    highlights: parsed.data.highlights ?? [],
    included: parsed.data.included ?? [],
    excluded: parsed.data.excluded ?? [],
    isFeatured: parsed.data.isFeatured ?? false,
    isActive: parsed.data.isActive ?? true,
    departureDate: parsed.data.departureDate ?? null,
    returnDate: parsed.data.returnDate ?? null,
    difficulty: parsed.data.difficulty ?? "Easy",
    category: parsed.data.category ?? "Adventure",
  }).returning();

  res.status(201).json(GetTripResponse.parse(serializeDb(trip)));
});

router.get("/trips/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid trip id" });
    return;
  }

  const params = GetTripParams.safeParse({ id });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [trip] = await db.select().from(tripsTable).where(eq(tripsTable.id, params.data.id));

  if (!trip) {
    res.status(404).json({ error: "Trip not found" });
    return;
  }

  res.json(GetTripResponse.parse(serializeDb(trip)));
});

router.patch("/trips/:id", async (req, res): Promise<void> => {
  const adminToken = req.signedCookies?.["admin_session"];
  if (!adminToken) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid trip id" });
    return;
  }

  const params = UpdateTripParams.safeParse({ id });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateTripBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.slug !== undefined) updateData.slug = parsed.data.slug;
  if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
  if (parsed.data.shortDescription !== undefined) updateData.shortDescription = parsed.data.shortDescription;
  if (parsed.data.location !== undefined) updateData.location = parsed.data.location;
  if (parsed.data.country !== undefined) updateData.country = parsed.data.country;
  if (parsed.data.durationDays !== undefined) updateData.durationDays = parsed.data.durationDays;
  if (parsed.data.priceDzd !== undefined) updateData.priceDzd = parsed.data.priceDzd;
  if (parsed.data.originalPriceDzd !== undefined) updateData.originalPriceDzd = parsed.data.originalPriceDzd;
  if (parsed.data.maxGroupSize !== undefined) updateData.maxGroupSize = parsed.data.maxGroupSize;
  if (parsed.data.spotsLeft !== undefined) updateData.spotsLeft = parsed.data.spotsLeft;
  if (parsed.data.imageUrl !== undefined) updateData.imageUrl = parsed.data.imageUrl;
  if (parsed.data.galleryImages !== undefined) updateData.galleryImages = parsed.data.galleryImages;
  if (parsed.data.highlights !== undefined) updateData.highlights = parsed.data.highlights;
  if (parsed.data.included !== undefined) updateData.included = parsed.data.included;
  if (parsed.data.excluded !== undefined) updateData.excluded = parsed.data.excluded;
  if (parsed.data.isFeatured !== undefined) updateData.isFeatured = parsed.data.isFeatured;
  if (parsed.data.isActive !== undefined) updateData.isActive = parsed.data.isActive;
  if (parsed.data.departureDate !== undefined) updateData.departureDate = parsed.data.departureDate;
  if (parsed.data.returnDate !== undefined) updateData.returnDate = parsed.data.returnDate;
  if (parsed.data.difficulty !== undefined) updateData.difficulty = parsed.data.difficulty;
  if (parsed.data.category !== undefined) updateData.category = parsed.data.category;

  const [trip] = await db
    .update(tripsTable)
    .set(updateData)
    .where(eq(tripsTable.id, params.data.id))
    .returning();

  if (!trip) {
    res.status(404).json({ error: "Trip not found" });
    return;
  }

  res.json(UpdateTripResponse.parse(serializeDb(trip)));
});

router.delete("/trips/:id", async (req, res): Promise<void> => {
  const adminToken = req.signedCookies?.["admin_session"];
  if (!adminToken) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid trip id" });
    return;
  }

  const params = DeleteTripParams.safeParse({ id });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [trip] = await db.delete(tripsTable).where(eq(tripsTable.id, params.data.id)).returning();

  if (!trip) {
    res.status(404).json({ error: "Trip not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
