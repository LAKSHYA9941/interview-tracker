import TaskCard from "./TaskCard";

// full class names so Tailwind picks them up at build time
const HEADER_STYLE = {
  "todo": "bg-ink/5 text-ink",
  "in progress": "bg-doing/15 text-doing",
  "completed": "bg-done/15 text-done",
};

const COLUMN_LABEL = {
  "todo": "Todo",
  "in progress": "In Progress",
  "completed": "Completed",
};

export default function Column({
  status,
  tasks,
  onUpdate,
  onEdit,
  onDelete,
  onDragStart,
  onDrop,
}) {
  // dragover must preventDefault to allow drop
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    onDrop(status);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex min-h-48 flex-col rounded-xl bg-paper ring-1 ring-ink/10"
    >
      {/* column header */}
      <div
        className={`flex items-center justify-between rounded-t-xl px-4 py-3 ${HEADER_STYLE[status]}`}
      >
        <span className="font-semibold">{COLUMN_LABEL[status]}</span>
        <span className="rounded-full bg-white/60 px-2 py-0.5 text-xs font-medium">
          {tasks.length}
        </span>
      </div>

      {/* task list */}
      <div className="flex flex-col gap-3 p-3">
        {tasks.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink/40">No tasks here</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
}
