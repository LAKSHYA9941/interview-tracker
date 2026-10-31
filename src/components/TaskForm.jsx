import { useState } from "react";
import { PRIORITIES } from "../data";

const inputClass =
  "w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

// `editing` is a full task object when editing, null when adding.
// Parent passes `key={editing?.id ?? "new"}` so this component resets
// its local state automatically whenever you switch between add and edit.
export default function TaskForm({ editing, onSubmit, onCancel }) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [priority, setPriority] = useState(editing?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(editing?.dueDate ?? "");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Title is required.";
    if (dueDate && isNaN(Date.parse(dueDate))) e.dueDate = "Enter a valid date.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) return setErrors(e2);

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      status: editing?.status ?? "todo",
    });

    // only clear when adding; when editing the parent closes the form
    if (!editing) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    }
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-ink/10">
      <h2 className="mb-4 font-bold text-base">{editing ? "Edit task" : "Add a task"}</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* title spans full width */}
        <div className="sm:col-span-2">
          <input
            className={inputClass}
            placeholder="Task title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>

        {/* description spans full width */}
        <div className="sm:col-span-2">
          <textarea
            className={`${inputClass} resize-none`}
            placeholder="Description (optional)"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <select
            className={inputClass}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)} priority
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="date"
            className={inputClass}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          {errors.dueDate && <p className="mt-1 text-xs text-red-600">{errors.dueDate}</p>}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
        >
          {editing ? "Save changes" : "Add task"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-4 py-2 text-sm font-medium text-ink/70 hover:bg-ink/10"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
