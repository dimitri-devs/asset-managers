import { Router, type IRouter } from "express";
import { db, tripsTable, bookingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { serializeDb } from "../lib/serialize";
import { GetDashboardStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", async (req, res): Promise<void> => {
  const adminToken = req.signedCookies?.["admin_session"];
  if (!adminToken) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [trips, bookings] = await Promise.all([
    db.select().from(tripsTable),
    db.select().from(bookingsTable).orderBy(bookingsTable.createdAt),
  ]);

  const activeTrips = trips.filter((t) => t.isActive).length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
  const totalRevenueDzd = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.totalPriceDzd, 0);

  const recentBookings = bookings.slice(-5).reverse();

  res.json(
    GetDashboardStatsResponse.parse(serializeDb({
      totalTrips: trips.length,
      activeTrips,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalRevenueDzd,
      recentBookings,
    }))
  );
});

export default router;
