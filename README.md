# Kanban Board

A responsive Kanban task board built with React 18, Tailwind CSS v4, and React Router v6 — no extra dependencies.

**Live:** _[add link here]_  
**Demo video:** _[add link here]_

---

## Setup

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # production build
npm run preview    # preview the production build
```

---

## Features

- **Three-column board** — Todo / In Progress / Completed
- **Add & edit tasks** — title (required), description, priority (low / medium / high), due date
- **Delete with confirmation** — small modal instead of `window.confirm`
- **Move tasks** — native HTML5 drag-and-drop between columns on desktop; per-card status `<select>` for mobile
- **Search** — filter cards by title, results update live
- **Priority filter** — show only low / medium / high cards
- **Status filter** — show only one column's cards across the board
- **URL-based filters** — `?q=`, `?priority=`, `?status=` so filters survive refresh and are shareable
- **Overdue highlight** — cards whose due date is before today (and not completed) get a red ring and badge
- **Empty states** — first-run empty state with sample data loader; per-column "No tasks here"; global no-results with "Clear filters"
- **localStorage persistence** — tasks survive refresh under the key `kanban-tasks`
- **Responsive** — 3 columns side-by-side on `md+`, single column stacked on mobile

---

## Project structure

```
src/
├── App.jsx                   # state (tasks), CRUD handlers, router
├── data.js                   # constants (STATUSES, PRIORITIES, SAMPLE_TASKS)
├── index.css                 # Tailwind v4 @theme tokens (paper, ink, accent, priority colors)
├── main.jsx                  # React root
├── hooks/
│   └── useLocalStorage.js    # useState + useEffect persistence hook
├── pages/
│   └── Board.jsx             # single page: filters, form toggle, drag logic, column layout
└── components/
    ├── Navbar.jsx            # app name bar
    ├── TaskForm.jsx          # add/edit form, validates title + date
    ├── TaskCard.jsx          # individual card with DnD, priority badge, overdue state
    └── Column.jsx            # column wrapper with drop target and header
```

**Task shape:**
```js
{
  id: string,          // crypto.randomUUID()
  title: string,
  description: string,
  priority: "low" | "medium" | "high",
  dueDate: string,     // "YYYY-MM-DD" ISO date string, may be empty
  status: "todo" | "in-progress" | "completed",
  createdAt: string,   // ISO timestamp, set on creation
}
```

---

## Assumptions & design decisions

1. **Filters in the URL** (`useSearchParams`) — search (`q`), priority, and status are stored in the URL query string instead of component state. This means filters survive a hard refresh and are copy-pasteable. The pattern mirrors the old day-filter from the previous project.

2. **Drag-and-drop is native HTML5** — `draggable`, `onDragStart`, `onDragOver`, `onDrop` only. No library. The dragged card's id is stored in a `useRef` (no re-render needed). Per-column drop targets call `preventDefault()` on `dragover` to enable drops.

3. **Overdue logic is local-date-aware** — `dueDate` is stored as `"YYYY-MM-DD"`. When checking if a task is overdue, the date is parsed as `new Date(y, m-1, d)` (local time) rather than `new Date(iso)` (UTC midnight), so the overdue flag doesn't flip a day early for users in UTC+ timezones.

4. **`key` trick on TaskForm** — `<TaskForm key={editing?.id ?? "new"} />` forces a full remount whenever you switch between adding and editing different tasks, resetting all local form state without any manual `useEffect` cleanup.

5. **No Context or reducers** — all state lives in `App.jsx` and flows down as props. This is intentional for readability in a 2.5h assignment context.
