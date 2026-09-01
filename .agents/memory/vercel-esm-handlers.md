---
name: Vercel ESM handlers
description: Explicit extensions required by strict NodeNext compilation of Vercel serverless handlers.
---

Vercel may compile serverless TypeScript handlers with NodeNext resolution, which requires `.js` on relative ESM imports even when the referenced source file is `.ts`.

**Why:** A handler can pass the workspace TypeScript checks while Vercel rejects it with TS2835 during deployment.

**How to apply:** Use explicit `.js` extensions in root and artifact-local `api/[...path].ts` handlers, then run a production-style build before redeploying.