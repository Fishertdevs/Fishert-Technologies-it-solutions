# Threat Model

## Project Overview

This repository is a pnpm monorepo with a small production footprint: an Express 5 API in `artifacts/api-server`, a React/Vite frontend in `artifacts/clark-kent`, and shared OpenAPI/DB libraries in `lib/`. The currently deployed app is `https://portfolio-clark-kent.replit.app`, and its deployment visibility is `private`, so Replit infrastructure blocks public internet access to application endpoints. The production API currently exposes only a health endpoint and does not yet implement user authentication, business workflows, or database-backed data handling.

## Assets

- **Deployment availability** — Even a simple portfolio and health endpoint must remain reachable to intended users. Crashes or resource exhaustion still impact the service.
- **Application secrets and infrastructure configuration** — `DATABASE_URL`, runtime env vars, and any future API keys must remain server-only. The DB package requires `DATABASE_URL` even though production routes do not currently use it.
- **Server logs and error output** — Request metadata and future auth/session material must not leak through logs. The current logger already redacts cookies and authorization headers.
- **Source-controlled production behavior** — The boundary between production artifacts and dev-only tooling matters because the repo also contains a mockup sandbox that dynamically loads components and should not be treated as production-reachable.

## Trust Boundaries

- **Browser to API (`artifacts/api-server/src/app.ts`)** — All client requests are untrusted. Any future route added under `/api` must validate input and avoid exposing internals.
- **API to PostgreSQL (`lib/db/src/index.ts`)** — The API process can connect directly to Postgres via `DATABASE_URL`. Any future use of this package must preserve parameterized queries and row-level scoping.
- **Build/codegen to runtime (`lib/api-spec`, `lib/api-zod`, `lib/api-client-react`)** — Generated client and schema layers influence runtime behavior and error handling. Security assumptions in the spec flow into both client and server code.
- **Production vs dev-only artifacts** — `artifacts/mockup-sandbox` is explicitly a development sandbox and, per platform assumptions, is not deployed to production. Security findings in that area should be ignored unless production reachability is demonstrated.
- **Private deployment boundary** — Because deployment visibility is `private`, internet-wide unauthenticated probing is out of scope. Findings still matter if they are exploitable by an allowed user or by server-side code paths in production.

## Scan Anchors

- **Production entry points:** `artifacts/api-server/src/index.ts`, `artifacts/api-server/src/app.ts`, `artifacts/clark-kent/src/main.tsx`
- **Current production routes:** `artifacts/api-server/src/routes/index.ts`, `artifacts/api-server/src/routes/health.ts`
- **Highest-risk shared code:** `lib/db/src/index.ts`, `lib/api-client-react/src/custom-fetch.ts`
- **Public/authenticated/admin surfaces:** only a health endpoint is currently server-exposed; no app-level authenticated or admin surface exists yet
- **Usually dev-only:** all of `artifacts/mockup-sandbox/`, codegen inputs under `lib/api-spec/`, helper scripts under `scripts/`

## Threat Categories

### Tampering

The main tampering risk for this project is future expansion of the API from its current minimal state. All production API endpoints added under `/api` must treat request bodies, query strings, and headers as untrusted input. Database access must remain parameterized through Drizzle/pg and must not introduce string-built SQL or client-controlled business state.

### Information Disclosure

The project currently has a small disclosure surface, but it still must avoid leaking secrets, environment configuration, internal paths, or stack traces. Logger output must continue to redact authorization and cookie data, and future error handlers must not return raw exception details to clients. Shared client utilities must not encourage placing server secrets in browser code.

### Denial of Service

Because the production API currently has no expensive endpoints, the immediate DoS risk is low. Still, any future public or semi-public route must enforce reasonable body-size limits, avoid unbounded work per request, and use bounded external/database calls so a single client cannot consume disproportionate server resources.

### Elevation of Privilege

There is no application-level privilege model yet, so classic authz escalation is not present today. The relevant guarantee is forward-looking: once authenticated or admin behavior is introduced, authorization must be enforced server-side on every sensitive endpoint, not in frontend code or generated clients.
