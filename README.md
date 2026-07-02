# WellPass Admin

The standalone **super-admin console** for the WellPass platform, split out from the
main WellPass app into its own Next.js project with its own dedicated login.

It shares the WellPass design system (brand tokens, logo, `SidebarLayout`, KPI cards,
status badges) so the UI stays consistent with the rest of the product, but it runs and
deploys independently and is gated behind a single admin account.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** with the WellPass brand theme (`app/globals.css`)
- **recharts** (dashboards) · **lucide-react** (icons) · **sonner** (toasts)
- **@tanstack/react-query** provider (ready for real data wiring)

## Authentication

Unlike the original app's shared demo login (a role dropdown with no real auth), this
console has its own credentials and a real, self-contained session:

- A login form (`/login`) posts to `/api/auth/login`.
- Credentials are checked against `ADMIN_EMAIL` / `ADMIN_PASSWORD` (env).
- On success an **HMAC-SHA256 signed, httpOnly cookie** session is issued.
- `middleware.ts` guards every `/admin/*` route and bounces unauthenticated users to
  `/login`; signed-in users hitting `/login` are sent to the dashboard.
- Logout (`/api/auth/logout`) clears the session.

### Default credentials

Set in `.env.local` (git-ignored). Change them before deploying anywhere public.

```
Email:    admin@wellpass.sa
Password: WellPass@Admin2025
```

See [.env.example](.env.example) for all configurable variables
(`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `SESSION_MAX_AGE`).

## Getting started

```bash
npm install
cp .env.example .env.local   # already provided with working defaults
npm run dev                  # http://localhost:3000
```

You'll land on `/login`. Sign in with the credentials above to reach `/admin/dashboard`.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Sections

All 12 sidebar sections are live pages (data is mocked in `src/data/mock.ts`):

Dashboard · Studios · Customers · Bookings · Membership Plans · Categories ·
Loyalty · Revenue · Analytics · Content · Settings · Notifications

## Project layout

```
app/
  api/auth/{login,logout}/route.ts   # session endpoints (Node runtime)
  admin/                             # protected console (layout + 12 pages)
  login/page.tsx                     # dedicated admin login
  layout.tsx · providers.tsx · page.tsx · globals.css
middleware.ts                        # route guard (Edge)
src/
  components/wp/                     # SidebarLayout, Kpi, StatusBadge, Logo
  data/mock.ts                       # demo data
  lib/{auth.ts,utils.ts}             # session signing + cn()
public/                             # WellPass logo assets
```

## Notes

- Data is currently mocked. The React Query provider and typed mock module make it
  straightforward to swap in a real API later.
- `noindex` is set in metadata — this console should never be crawled.
