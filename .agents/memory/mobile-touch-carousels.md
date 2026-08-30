---
name: Mobile touch carousels
description: Reliable swipe handling for touch carousels in this workspace.
---

Use direct touch start/end handlers together with `touch-action: pan-y` for mobile carousels that must preserve vertical page scrolling while recognizing horizontal swipes.

**Why:** Pointer-only gesture handling did not reliably advance the pricing carousel in the mobile preview, while touch events provide the expected behavior on the target interaction.

**How to apply:** Keep desktop navigation on explicit buttons, use a horizontal-distance threshold for touch changes, and reset the stored start position on touch cancellation.