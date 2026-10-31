export const STATUSES = ["todo", "in progress", "completed"];
export const PRIORITIES = ["low", "medium", "high"];

// for moving a card one step forward (wraps back to todo)
export const NEXT_STATUS = {
  "todo": "in progress",
  "in progress": "completed",
  "completed": "todo",
};

// for the empty state button
export const SAMPLE_TASKS = [
  {
    title: "Have to Build a Kanban board from scratch",
    description: "try to Implement drag-and-drop, column filtering, and localStorage persistence.",
    priority: "high",
    dueDate: "2026-11-05",
    status: "in progress",
  },
  {
    title: "Go through some system design concepts",
    description: "Like LLD,HLD and types of scaling both horizontal and vertical",
    priority: "medium",
    dueDate: "2026-11-03",
    status: "todo",
  },
  {
    title: "Solve 5 LeetCode problesm",
    description: "questions based on sliding window and two-pointer patterns.",
    priority: "high",
    dueDate: "2026-11-02",
    status: "todo",
  },
  {
    title: "Record a 2-minute demo video",
    description: "Walk through the project and explain key decisions.",
    priority: "low",
    dueDate: "2026-11-10",
    status: "completed",
  },
  {
    title: "Gonna have a mock interview with a friend",
    description: "Hopefully this time i get a good partner .",
    priority: "medium",
    dueDate: "2026-11-07",
    status: "todo",
  },
];
