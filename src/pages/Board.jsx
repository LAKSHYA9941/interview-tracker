import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import Column from "../components/Column";
import { STATUSES, PRIORITIES } from "../data";

const selectClass =
  "rounded-md border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-accent";

export default function Board({ tasks, addTask, updateTask, deleteTask, loadSamples }) {
  // search and filters live in the URL so they're shareable and survive navigation
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const priorityFilter = params.get("priority") || "all";
  const statusFilter = params.get("status") || "all";

  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // id of the card being dragged, stored in a ref (no re-render needed)
  const draggingId = useRef(null);

  // confirm-delete modal state
  const [pendingDelete, setPendingDelete] = useState(null);

  const setParam = (key, val) => {
    const next = new URLSearchParams(params);
    if (val === "all" || val === "") next.delete(key);
    else next.set(key, val);
    setParams(next, { replace: true });
  };

  const clearFilters = () => setParams({}, { replace: true });

  const filtersOn = query || priorityFilter !== "all" || statusFilter !== "all";

  // filter tasks for display
  const visible = tasks.filter((t) => {
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (query && !t.title.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  // tasks per column, respecting current filters
  const byStatus = (s) => visible.filter((t) => t.status === s);

  const totalVisible = visible.length;

  const handleSubmit = (data) => {
    if (editing) {
      updateTask(editing.id, data);
      setEditing(null);
      setShowForm(false);
    } else {
      addTask(data);
      setShowForm(false);
    }
  };

  const handleEdit = (task) => {
    setEditing(task);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelForm = () => {
    setEditing(null);
    setShowForm(false);
  };

  const handleDragStart = (id) => {
    draggingId.current = id;
  };

  const handleDrop = (targetStatus) => {
    if (!draggingId.current) return;
    updateTask(draggingId.current, { status: targetStatus });
    draggingId.current = null;
  };

  const confirmDelete = (id) => setPendingDelete(id);

  const handleDeleteConfirm = () => {
    if (pendingDelete) deleteTask(pendingDelete);
    setPendingDelete(null);
  };

  // --- empty state (no tasks at all) ---
  if (tasks.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="mb-1 text-3xl">📋</p>
        <h1 className="mb-2 text-2xl font-bold">Your board is empty</h1>
        <p className="mb-6 text-sm text-ink/60">Add your first task or load the sample data to get started.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
          >
            Add a task
          </button>
          <button
            onClick={loadSamples}
            className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90"
          >
            Load sample tasks
          </button>
        </div>
        {showForm && (
          <div className="mx-auto mt-8 max-w-xl text-left">
            {/* key resets form when switching add vs edit */}
            <TaskForm key="new" onSubmit={handleSubmit} onCancel={handleCancelForm} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* add/edit form — shown inline when triggered */}
      {showForm && (
        <TaskForm
          key={editing?.id ?? "new"}
          editing={editing}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {/* toolbar: add button + filters */}
      <div className="flex flex-wrap items-center gap-2">
        {!showForm && (
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
          >
            + Add task
          </button>
        )}

        <input
          className={`${selectClass} min-w-0 flex-1 basis-40`}
          placeholder="Search by title…"
          value={query}
          onChange={(e) => setParam("q", e.target.value)}
        />

        <select
          className={selectClass}
          value={priorityFilter}
          onChange={(e) => setParam("priority", e.target.value)}
        >
          <option value="all">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={statusFilter}
          onChange={(e) => setParam("status", e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {filtersOn && (
          <button onClick={clearFilters} className="text-sm text-accent hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {/* global no-results state — only when filters are on and nothing matches */}
      {filtersOn && totalVisible === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-ink/20 p-12 text-center">
          <p className="font-medium">No tasks match your filters.</p>
          <button onClick={clearFilters} className="mt-3 text-sm text-accent hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        /* board: 3 columns side-by-side on desktop, stacked on mobile */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {STATUSES.map((s) => (
            <Column
              key={s}
              status={s}
              tasks={byStatus(s)}
              onUpdate={updateTask}
              onEdit={handleEdit}
              onDelete={confirmDelete}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            />
          ))}
        </div>
      )}

      {/* delete confirm modal — small, no library needed */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <p className="font-medium">Delete this task?</p>
            <p className="mt-1 text-sm text-ink/60">This can't be undone.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setPendingDelete(null)}
                className="rounded-md px-4 py-2 text-sm text-ink/70 hover:bg-ink/10"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
