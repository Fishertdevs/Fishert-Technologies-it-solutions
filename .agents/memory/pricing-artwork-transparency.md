---
name: Pricing artwork transparency
description: Handling the frog artwork used beside desktop pricing plans.
---

Pricing artwork supplied as a black-background PNG needs a transparent derivative created by flood-filling the contiguous outer black area; global black removal can damage interior outlines. The rendered artwork should be bottom-aligned within the pricing-art column so the figure meets the section baseline.

**Why:** The source image is intended to sit on the page background, and the visible black rectangle plus floating bottom whitespace made the pricing composition look like a separate panel.

**How to apply:** When the source artwork changes, regenerate the transparent derivative, update the import to that derivative, and verify the desktop pricing section at the target viewport.