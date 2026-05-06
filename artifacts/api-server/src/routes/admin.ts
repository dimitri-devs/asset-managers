import { Router, type IRouter } from "express";
import {
  AdminLoginBody,
  AdminLoginResponse,
  AdminLogoutResponse,
  GetAdminMeResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "elhawes2024";

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.username !== ADMIN_USERNAME || parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  res.cookie("admin_session", parsed.data.username, {
    signed: true,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.json(AdminLoginResponse.parse({ authenticated: true, username: parsed.data.username }));
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  res.clearCookie("admin_session");
  res.json(AdminLogoutResponse.parse({ message: "Logged out" }));
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const adminToken = req.signedCookies?.["admin_session"];
  if (!adminToken) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  res.json(GetAdminMeResponse.parse({ authenticated: true, username: String(adminToken) }));
});

export default router;
