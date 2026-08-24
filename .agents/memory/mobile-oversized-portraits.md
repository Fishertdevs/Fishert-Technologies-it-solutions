---
name: Mobile oversized portraits
description: How to keep intentionally oversized transparent decorative images centered inside mobile sections.
---

When a mobile decorative portrait must be taller than its viewport-width container, center it with an explicit `left: 50%` and `translateX(-50%)`, while clipping only at the section boundary.

**Why:** Automatic margins or flex centering can resolve to the start edge when an image is wider than its container, leaving the portrait visibly shifted even though the page itself has no horizontal overflow.

**How to apply:** Use this only for deliberate edge-to-edge decorative artwork. Keep the parent clipped and measure the rendered bounding-box center against the viewport after changing its size.