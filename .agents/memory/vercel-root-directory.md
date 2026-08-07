---
name: Vercel root directory
description: Deployment configuration when Vercel uses a workspace artifact as its root.
---

When Vercel's Root Directory points at a workspace artifact instead of the repository root, its `vercel.json` must live inside that artifact and use paths relative to it.

**Why:** A root-level Vercel config can be ignored in this setup, causing Vercel to fall back to `public` even when the build writes to a nested output folder.

**How to apply:** Keep a colocated Vercel config with the artifact's local build command and output directory, while retaining the root config for root-based deployments.