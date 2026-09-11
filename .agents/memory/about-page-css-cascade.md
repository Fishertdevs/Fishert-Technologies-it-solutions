---
name: About-page CSS cascade
description: Durable guidance for visual changes to the Quienes Somos sections.
---

The Quienes Somos page has several historical style blocks for the same selectors. Visual changes to its section shapes should be made in the final override block, with a mobile override when needed.

**Why:** Earlier declarations can appear correct in isolation but be superseded by later refinements, making a valid-looking radius change invisible in the running page.

**How to apply:** When adjusting a Quienes Somos section, search all occurrences of the selector and update the last desktop and mobile declarations that win the cascade.