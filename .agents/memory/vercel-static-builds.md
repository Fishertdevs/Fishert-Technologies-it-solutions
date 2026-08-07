---
name: Vercel static builds
description: Environment differences between Replit Vite development and external static hosting.
---

External static hosts such as Vercel may evaluate the Vite config without Replit's `PORT` and `BASE_PATH` environment variables.

**Why:** Requiring those variables at config-load time prevents Vercel from even starting the production build.

**How to apply:** Keep Replit's explicit values for development, but provide safe static-build defaults (`PORT` for Vite's config shape and `/` for the base path) when those variables are absent.