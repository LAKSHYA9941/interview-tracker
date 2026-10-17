import { useState } from "react";
import { DAYS, TOPICS, todayName } from "../data";

const inputClass =
  "w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

// `editing` is a task object when we're editing, null when adding.
// parent passes a key so this resets when you switch between the two
export default function TaskForm({ editing, onSubmit, onCancel }) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [topic, setTopic] = useState(editing?.topic ?? TOPICS[0]);
  const [day, setDay] = useState(editing?.day ?? todayName());
  const [hours, setHours] = useState(editing?.hours ?? 1);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Give the task a name first.");
    if (Number(hours) <= 0) return setError("Hours should be more than 0.");

    onSubmit({
      title: title.trim(),
      topic,
      day,
      hours: Number(hours),
      status: editing?.status ?? "todo",
    });

    // only clear when adding, when editing the parent closes the form
    if (!editing) {
      setTitle("");
      setHours(1);
    }
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-ink/10">
      <h2 className="mb-3 font-bold">{editing ? "Edit task" : "Add a task"}</h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_5rem]">
        <input
          className={`${inputClass} sm:col-span-2 lg:col-span-1`}
          placeholder="What are you practicing?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select className={inputClass} value={topic} onChange={(e) => setTopic(e.target.value)}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select className={inputClass} value={day} onChange={(e) => setDay(e.target.value)}>
          {DAYS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <input
          type="number"
          min="0.5"
          step="0.5"
          className={inputClass}
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          aria-label="Hours"
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-3 flex gap-2">
        <button className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90">
          {editing ? "Save changes" : "Add task"}
        </button>
        {editing && (
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
