# Shared 06 — Authentication Integration (for app developers)

Server-side design: [../10-AUTHENTICATION-AND-AUTHORIZATION.md](../10-AUTHENTICATION-AND-AUTHORIZATION.md).

## 1. Browser client (`@puzzlers/auth/client`)

```ts
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`,
  fetchOptions: { credentials: "include" },
});
export const { signIn, signUp, signOut, useSession } = authClient;
```

Use `authClient` for auth actions only. For "who am I + permissions", use `api.me.get()` (`GET /v1/me`), which includes roles, permissions and the profile.

## 2. Next.js middleware (student and admin)

```ts
// apps/student/src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
const PUBLIC = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];
export function middleware(req: NextRequest) {
  const hasSession = req.cookies.getAll().some(c => c.name.endsWith("better-auth.session_token"));
  if (!hasSession && !PUBLIC.some(p => req.nextUrl.pathname.startsWith(p))) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next|favicon|assets|api/og).*)"] };
```

This is only a **fast pre-check** (the cookie exists). Real validation happens in the server layout with `GET /v1/me`, and in every API call. The cookie name may carry a `__Secure-` prefix in production. Match by suffix as shown, and confirm the name in the PoC.

## 3. Server layout guard

```ts
// apps/student/src/app/(app)/layout.tsx
export default async function AppLayout({ children }) {
  const api = await serverApi();               // forwards cookies
  const me = await api.me.get().catch(handleAuthError); // 401 → redirect('/login?next=...')
  if (me.user.status === "suspended") redirect("/suspended");
  if (!me.profile.onboardingCompletedAt) redirect("/onboarding");
  return <MeProvider value={me}>{children}</MeProvider>;
}
```

Admin layout: additionally `if (me.user.userType !== "staff") redirect(STUDENT_URL + "/dashboard?notice=no-admin-access")`.

## 4. Permission-aware UI (admin)

```ts
const can = useCan();          // from MeProvider permissions
{can("question:publish") && <Button onClick={publish}>Publish</Button>}
```

Navigation items declare `requires: Permission[]`. Items without permission are hidden, **and** the API still enforces them.

## 5. Cross-app links

| From | To | URL |
|---|---|---|
| Marketing "Login" | Student login | `${STUDENT_URL}/login?next=/dashboard` |
| Marketing "Start free" / batch CTA | Student register | `${STUDENT_URL}/register?exam=<slug>&next=/batches/<slug>` |
| Marketing "Buy" | Student checkout | `${STUDENT_URL}/checkout?item=batch:<id>` (login first if needed) |
| Student "Admin" (staff only) | Admin | `${ADMIN_URL}/` |
| Admin "View as student" *(not MVP)* | — | Impersonation is out of scope |

`next` parameters are validated: they must start with `/` and not `//`, so they cannot open-redirect.

## 6. Handling auth errors

| Error | Student app | Admin app | Exam UI |
|---|---|---|---|
| 401 `UNAUTHENTICATED`/`SESSION_EXPIRED` | Redirect to `/login?next=` | Redirect to `/login?next=` | **In-place re-login modal**; the exam state and outbox are kept |
| 403 `ACCOUNT_SUSPENDED` | `/suspended` page | `/suspended` | Stop; message |
| 403 `FORBIDDEN` | Forbidden state | Forbidden state + "Request access" hint | n/a |

## 7. Local development

- Cookies on `localhost` are shared across ports. Leave `COOKIE_DOMAIN` empty locally.
- Seeded accounts: `superadmin@demo.local`, `admin@demo.local`, `faculty.physics@demo.local`, `student1@demo.local` … (passwords printed by `pnpm db:seed`).
