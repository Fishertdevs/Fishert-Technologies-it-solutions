---
name: Review video upload latency
description: Multipart video requests cannot respond before the browser finishes uploading the request body.
---

The server route cannot make a multipart video submission feel immediate by moving Telegram work after `res.json`; the request body must still finish uploading before Express reaches the handler.

**Why:** A review video request was observed taking over 100 seconds before the route response, even when Telegram processing was moved to a background task.

**How to apply:** For an immediate user-facing response, split metadata creation from video upload or use a durable upload path; do not rely on post-response work alone.