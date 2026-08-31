---
name: Node seed scripts
description: Runtime constraint for repeatable database seed commands in this workspace.
---

Use native ESM JavaScript for database seed entrypoints unless the package explicitly provides a compatible TypeScript runner.

**Why:** The configured workspace runtime is Node 20, so newer Node-only flags for stripping TypeScript are rejected before the seed starts.

**How to apply:** Keep the seed command runnable with the package's existing Node runtime and make repeated runs safe with database uniqueness constraints.