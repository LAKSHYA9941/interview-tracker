// full class names on purpose, tailwind can't see classes built with string concat
const STATUS_STYLE = {
  todo: "bg-ink/10 text-ink/70",
  doing: "bg-doing/15 text-doing",
  done: "bg-done/15 text-done",
};

const NEXT = { todo: "doing", doing: "done", done: "todo" };

export default function TaskItem({ task, onStatus, onEdit, onDelete }) {
  const isDone = task.status === "done";

  return (
    <li className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-ink/10 sm:flex-nowrap">
      {/* click to cycle todo -> doing -> done */}
      <button
        onClick={() => onStatus(task.id, NEXT[task.status])}
        title="Click to change status"
        className={`w-16 shrink-0 rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLE[task.status]}`}
      >
        {task.status}
      </button>

      <div className="min-w-0 flex-1">
        <p className={`truncate font-medium ${isDone ? "text-ink/40 line-through" : ""}`}>
          {task.title}
        </p>
        <p className="text-xs text-ink/60">
          {task.topic} · {task.day} · {task.hours}h
        </p>
      </div>

      <div className="flex gap-1 text-sm">
        <button onClick={() => onEdit(task)} className="rounded-md px-2 py-1 text-ink/70 hover:bg-ink/10">
          Edit
        </button>
        <button
          onClick={() => window.confirm("Delete this task?") && onDelete(task.id)}
          className="rounded-md px-2 py-1 text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
