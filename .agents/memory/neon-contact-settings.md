---
name: Neon contact settings
description: Contact submissions and public studio contact details use different database tables.
---

The public studio contact card belongs in `contact_settings`; `contacts` is reserved for visitor-submitted leads and requires a message.

**Why:** The existing Neon schema already used `contacts` for form submissions, so placing the studio email there would mix configuration with user data and create a fake lead.

**How to apply:** Keep the Contacto UI reading `contact_settings` through the API, and use `contacts` only for POST `/contacts` submissions. This project’s runtime connection is `NEON_DATABASE_URL`.