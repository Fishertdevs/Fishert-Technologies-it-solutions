---
name: Task merge locks
description: How to interpret accepted project tasks that are waiting for merge.
---

An accepted task can move into a merge-managed waiting state before the main agent can close it manually.

**Why:** The completion callback only accepts tasks that are active on the main Repl; a task already in `MERGING` with `WAITING_FOR_LOCK` is handled by the platform's merge process instead.

**How to apply:** Verify the task state, avoid repeated completion attempts, and report the code delivery separately while the merge lock is being processed.