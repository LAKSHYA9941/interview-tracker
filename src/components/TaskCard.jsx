import { STATUSES } from "../data";

// full class names — Tailwind can't see classes built with string concat
const PRIORITY_STYLE = {
  low: "bg-prio-low/15 text-prio-low",
  medium: "bg-prio-medium/15 text-prio-medium",
  high: "bg-prio-high/15 text-prio-high",
};

const STATUS_LABEL = {
  "todo": "Todo",
  "in progress": "In Progress",
  "completed": "Completed",
};

function formatDate(iso) {
  if (!iso) return null;
  // parse as local date, not UTC, to avoid off-by-one day issues
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isOverdue(iso, status) {
  if (!iso || status === "completed") return false;
  const [y, m, d] = iso.split("-").map(Number);
  const due = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

export default function TaskCard({ task, onUpdate, onEdit, onDelete, onDragStart }) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(task.id)}
      className={`cursor-grab rounded-xl bg-white p-4 shadow-sm ring-1 ring-ink/10 active:cursor-grabbing ${
        overdue ? "ring-red-400" : ""
      }`}
    >
      {/* priority badge + overdue indicator */}
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_STYLE[task.priority]}`}
        >
          {task.priority}
        </span>
        {overdue && (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
            Overdue
          </span>
        )}
      </div>

      {/* title */}
      <p className="font-medium leading-snug">{task.title}</p>

      {/* description clamped to 2 lines */}
      {task.description && (
        <p className="mt-1 line-clamp-2 text-sm text-ink/60">{task.description}</p>
      )}

      {/* due date */}
      {task.dueDate && (
        <p className={`mt-2 text-xs ${overdue ? "text-red-500" : "text-ink/50"}`}>
          Due {formatDate(task.dueDate)}
        </p>
      )}

      {/* move + actions row */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {/* mobile-friendly status select; drag-and-drop works on desktop */}
        <select
          value={task.status}
          onChange={(e) => onUpdate(task.id, { status: e.target.value })}
          className="flex-1 rounded-md border border-ink/20 bg-paper px-2 py-1 text-xs outline-none focus:border-accent"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>

        <button
          onClick={() => onEdit(task)}
          className="rounded-md px-2 py-1 text-xs text-ink/70 hover:bg-ink/10"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
