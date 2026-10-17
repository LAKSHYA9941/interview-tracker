export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const TOPICS = [
  "JavaScript",
  "React",
  "Node/Express",
  "MongoDB",
  "Auth",
  "Git/GitHub",
  "Machine Coding",
  "Mock Interview",
];

export const STATUSES = ["todo", "doing", "done"];

// getDay() has sunday as 0, our week starts on monday so shift it
export const todayName = () => DAYS[(new Date().getDay() + 6) % 7];

// for the empty state button, makes the demo less sad
export const SAMPLE_TASKS = [
  { title: "Event loop: microtasks vs macrotasks", topic: "JavaScript", day: "Mon", hours: 1.5, status: "done" },
  { title: "Memoization: React.memo, useMemo, useCallback", topic: "React", day: "Tue", hours: 2, status: "done" },
  { title: "401 vs 403 and auth middleware flow", topic: "Auth", day: "Wed", hours: 1, status: "doing" },
  { title: "Unique index + duplicate key error handling", topic: "MongoDB", day: "Thu", hours: 1, status: "todo" },
  { title: "Git: reflog, revert vs reset", topic: "Git/GitHub", day: "Thu", hours: 1, status: "done" },
  { title: "Build the practice tracker (2.5hr timer)", topic: "Machine Coding", day: "Sat", hours: 2.5, status: "todo" },
  { title: "Record 2 min demo video", topic: "Mock Interview", day: "Sun", hours: 1, status: "todo" },
];
