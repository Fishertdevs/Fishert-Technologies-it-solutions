---
name: Vercel deployment source
description: Detecting when Vercel serves an older commit than the connected repository.
---

A successful Vercel deployment is not proof that the current repository commit is live. Compare the deployment commit shown in Vercel with the current `origin/main`, then verify a changed API response publicly.

**Why:** This project has had successful production deployments while newer committed webhook fixes were not deployed, making the bot appear broken even though the current code was corrected.

**How to apply:** If the deployment list stops at an older commit, check the Vercel Git repository and production branch, then create a deployment from the current `main` commit instead of redeploying the stale deployment.