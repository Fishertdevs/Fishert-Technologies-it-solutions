---
name: Team bridge artwork
description: Placement constraint for the yellow bridge illustration in the white team transition.
---

The yellow bridge illustration contains substantial transparent space around the visible drawing. Position the visible bounds inside a dedicated column rather than aligning the raw image box, and keep the text column independent.

**Why:** Moving the raw square image to an edge can hide the drawing or make it appear off-center because the transparent margins are part of the source dimensions.

**How to apply:** Preserve the artwork's intended scale, center its image box geometrically in the illustration column, and anchor the visible lower edge with a controlled overflow container.