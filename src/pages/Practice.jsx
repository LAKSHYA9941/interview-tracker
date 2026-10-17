import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import { DAYS, TOPICS, STATUSES } from "../data";

const selectClass =
  "rounded-md border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-accent";

export default function Practice({ tasks, addTask, updateTask, deleteTask, loadSamples }) {
  // day lives in the url so the dashboard week strip can link here
  const [params, setParams] = useSearchParams();
  const day = params.get("day") || "all";

  const [status, setStatus] = useState("all");
  const [topic, setTopic] = useState("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);

  const setDay = (d) => {
    if (d === "all") setParams({});
    else setParams({ day: d });
  };

  const visible = tasks.filter((t) => {
    if (day !== "all" && t.day !== day) return false;
    if (status !== "all" && t.status !== status) return false;
    if (topic !== "all" && t.topic !== topic) return false;
    if (query && !t.title.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const handleSubmit = (data) => {
    if (editing) {
      updateTask(editing.id, data);
      setEditing(null);
    } else {
      addTask(data);
    }
  };

  const clearFilters = () => {
    setParams({});
    setStatus("all");
    setTopic("all");
    setQuery("");
  };

  const filtersOn = day !== "all" || status !== "all" || topic !== "all" || query;

  return (
    <div className="space-y-6">
      <TaskForm
        key={editing?.id ?? "new"}
        editing={editing}
        onSubmit={handleSubmit}
        onCancel={() => setEditing(null)}
      />

      {/* filters */}
      <div className="flex flex-wrap gap-2">
        <input
          className={`${selectClass} min-w-0 flex-1 basis-48`}
          placeholder="Search tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All status</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select className={selectClass} value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="all">All topics</option>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select className={selectClass} value={day} onChange={(e) => setDay(e.target.value)}>
          <option value="all">Whole week</option>
          {DAYS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        {filtersOn && (
          <button onClick={clearFilters} className="px-2 text-sm text-accent hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {/* list */}
      {tasks.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-ink/20 p-10 text-center">
          <p className="font-medium">No tasks yet.</p>
          <p className="mb-4 text-sm text-ink/60">Add your first one above, or fill in a sample week.</p>
          <button
            onClick={loadSamples}
            className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90"
          >
            Load sample week
          </button>
        </div>
      ) : visible.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink/60">Nothing matches those filters.</p>
      ) : (
        <ul className="space-y-2">
          {visible.map((t) => (
            <TaskItem
              key={t.id}
              task={t}
              onStatus={(id, s) => updateTask(id, { status: s })}
              onEdit={(task) => {
                setEditing(task);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onDelete={deleteTask}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
