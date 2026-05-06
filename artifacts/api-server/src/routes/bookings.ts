import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, bookingsTable, tripsTable } from "@workspace/db";
import { serializeDb } from "../lib/serialize";
import {
  ListBookingsResponse,
  CreateBookingBody,
  GetBookingParams,
  GetBookingResponse,
  UpdateBookingParams,
  UpdateBookingBody,
  UpdateBookingResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/bookings", async (req, res): Promise<void> => {
  const adminToken = req.signedCookies?.["admin_session"];
  if (!adminToken) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const bookings = await db.select().from(bookingsTable).orderBy(bookingsTable.createdAt);
  res.json(ListBookingsResponse.parse(serializeDb(bookings)));
});

router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [trip] = await db.select().from(tripsTable).where(eq(tripsTable.id, parsed.data.tripId));
  if (!trip) {
    res.status(400).json({ error: "Trip not found" });
    return;
  }

  const totalPriceDzd = trip.priceDzd * parsed.data.numberOfPeople;

  const [booking] = await db.insert(bookingsTable).values({
    tripId: parsed.data.tripId,
    tripTitle: trip.title,
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    numberOfPeople: parsed.data.numberOfPeople,
    message: parsed.data.message ?? null,
    status: "pending",
    totalPriceDzd,
    preferredDate: parsed.data.preferredDate ?? null,
    isContacted: false,
  }).returning();

  if (trip.spotsLeft > 0) {
    await db.update(tripsTable).set({ spotsLeft: trip.spotsLeft - parsed.data.numberOfPeople }).where(eq(tripsTable.id, trip.id));
  }

  res.status(201).json(GetBookingResponse.parse(serializeDb(booking)));
});

router.get("/bookings/:id", async (req, res): Promise<void> => {
  const adminToken = req.signedCookies?.["admin_session"];
  if (!adminToken) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid booking id" });
    return;
  }

  const params = GetBookingParams.safeParse({ id });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, params.data.id));

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  res.json(GetBookingResponse.parse(serializeDb(booking)));
});

router.patch("/bookings/:id", async (req, res): Promise<void> => {
  const adminToken = req.signedCookies?.["admin_session"];
  if (!adminToken) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid booking id" });
    return;
  }

  const params = UpdateBookingParams.safeParse({ id });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
  if (parsed.data.isContacted !== undefined) updateData.isContacted = parsed.data.isContacted;

  const [booking] = await db
    .update(bookingsTable)
    .set(updateData)
    .where(eq(bookingsTable.id, params.data.id))
    .returning();

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  res.json(UpdateBookingResponse.parse(serializeDb(booking)));
});

export default router;
