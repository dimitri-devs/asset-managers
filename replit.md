# El Hawes Travel

Premium Algerian travel booking platform inspired by the @elhawes Instagram page, with a public site, trip explorer, booking form, and admin dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at `/api`)
- `pnpm --filter @workspace/elhawes run dev` — run the frontend (proxied at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_USERNAME` (default: `admin`), `ADMIN_PASSWORD` (default: `elhawes2024`)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, Wouter (routing), shadcn/ui, Lucide icons
- API: Express 5, cookie-parser (signed cookies for admin auth)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`, generated Zod schemas from OpenAPI
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth for all endpoints)
- `lib/api-zod/src/generated/api.ts` — generated Zod schemas (run codegen to update)
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks
- `lib/db/src/schema/` — Drizzle schema (`trips.ts`, `bookings.ts`)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/elhawes/src/pages/` — React pages (HomePage, TripsPage, TripDetailPage, AdminDashboard, etc.)
- `artifacts/elhawes/src/index.css` — theme tokens (golden sand palette, Playfair Display + Plus Jakarta Sans)

## Architecture decisions

- **Date serialization**: DB returns `Date` objects; routes call `serializeDb()` (JSON roundtrip) before Zod validation to convert Dates → ISO strings.
- **Admin auth**: Signed cookie (`admin_session`) using `SESSION_SECRET`. No JWT or sessions table needed.
- **Instagram feed**: Static curated list of Unsplash images in `routes/instagram.ts` — no real Instagram API required.
- **Price currency**: All prices stored in DZD (integer); formatted via `formatDZD()` in `lib/utils.ts`.
- **Routing**: Wouter with `base` set to `import.meta.env.BASE_URL` for proxy compatibility.

## Product

- **Public site**: Hero homepage with featured trips, Instagram grid, testimonials, CTA
- **Trips explorer**: Filter by category (Adventure, Culture, Beach, Desert, Mountain) and duration
- **Trip detail**: Full description, gallery, highlights, included/excluded, sticky booking form
- **Booking flow**: Form → POST /api/bookings → success page
- **Admin dashboard**: Login (`admin` / `elhawes2024`) → stats, trips CRUD, booking management (status + contacted flag)

## User preferences

- French language throughout the UI (Algerian travel brand)
- Prices in DZD (Algerian Dinar)
- Premium, cinematic design: Playfair Display serif headings, golden sand color palette

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`
- The API server must be restarted after code changes (it builds with esbuild before starting)
- Do NOT use `console.log` in server code — use `req.log` or the `logger` singleton
- `serializeDb()` must wrap any DB results passed to Zod `.parse()` to handle Date → string coercion

## Pointers

- `pnpm-workspace` skill — workspace structure, TypeScript, codegen setup
- `.local/skills/pnpm-workspace/references/server.md` — Express route patterns and logging
