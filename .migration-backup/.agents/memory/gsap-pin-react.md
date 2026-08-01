---
name: GSAP pin + React cleanup
description: Why pinned ScrollTrigger animations crash on route change and how to fix it.
---

## Rule
Any GSAP ScrollTrigger that uses `pin: true` **must** be set up inside `useLayoutEffect` (not `useEffect`), wrapped in `gsap.context()`, and cleaned up with `ctx.revert()`.

**Why:** GSAP `pin` inserts a spacer div around the pinned element. React 18 `useEffect` cleanup runs **after** React commits DOM removals, so `ctx.revert()` tries to unwrap a node whose parent has already been deleted → `removeChild` error → React fiber corruption → "Invalid hook call". `useLayoutEffect` cleanup runs synchronously before React touches the DOM, giving GSAP time to restore the tree first.

**How to apply:** In every component that uses `pin: true` in a ScrollTrigger:
```tsx
useLayoutEffect(() => {
  if (!sectionRef.current) return;
  const ctx = gsap.context(() => {
    gsap.timeline({ scrollTrigger: { ..., pin: true, ... } });
    // other gsap calls
  }, sectionRef);
  return () => ctx.revert();
}, [deps]);
```
Files in this project already fixed: `Servicios.tsx`, `Section4.tsx`, `Works.tsx`.
