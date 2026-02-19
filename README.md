# Calendar Pro — Minimal Scaffold

This folder contains a minimal Next.js + Tailwind scaffold implementing the core pieces from `organizer.md` (recurrence expansion, undo/redo history, Zustand store).

Setup

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

Notes

- The code is minimal and intended as a starting point. See `organizer.md` for a fuller blueprint.
- To persist and rehydrate `Date` objects, the store uses a simple deserialize hook inside `useCalendarStore.ts`.
