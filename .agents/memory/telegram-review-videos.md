---
name: Telegram review videos
description: Durable storage and moderation rules for customer testimonial videos.
---

Fishert Studio testimonial videos are stored in the configured Telegram administration chat, not in PostgreSQL. PostgreSQL keeps only the Telegram `file_id`, the `testimonial` category, and the timestamp for the user's explicit consent.

**Why:** App Storage could not be provisioned because the workspace exhausted its available credits, and storing video bytes in the database was explicitly rejected.

**How to apply:** A video review must carry explicit consent before submission, remain pending until Telegram moderation, and be streamable publicly only after the review is marked published.