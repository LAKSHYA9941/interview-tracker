# Interview Practice Tracker

A small dashboard to plan and track a week of interview prep. Built for the Frontend Machine Coding Round.

**Live:** _add your deployed link here_
**Demo video:** _add your video link here_

## Stack
React 18, Tailwind CSS v4, React Router v6, Vite. No backend.

## Setup
```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # production build in /dist
```

## Features
- Add, edit, delete practice tasks (title, topic, day, hours)
- Click the status pill to cycle todo -> doing -> done
- Filter by status, topic, day, plus text search
- Dashboard: weekly hours vs goal, stat cards, Mon-Sun progress strip, today's pending tasks, progress by topic
- Click a day on the dashboard to jump to that day's tasks (day filter is in the URL)
- Editable weekly goal
- Data saved in localStorage, survives refresh
- Responsive down to mobile, "Load sample week" button for a quick demo

## Pages
- `/` Dashboard
- `/practice` Task list + form

## Assumptions
- The week runs Monday to Sunday and tasks are tied to a day name, not a calendar date, so it works as a repeating weekly plan.
- Only tasks marked **done** count towards the weekly hours.
- Single user, no login. Clearing browser storage resets everything.

## Structure
```
src/
  App.jsx            state lives here, passed down as props
  data.js            days, topics, sample tasks
  hooks/useLocalStorage.js
  components/        Navbar, TaskForm, TaskItem
  pages/             Dashboard, Practice
```
