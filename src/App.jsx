import { Routes, Route } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Navbar from "./components/Navbar";
import Board from "./pages/Board";
import { SAMPLE_TASKS } from "./data";

export default function App() {
  // new key so old "ipt-tasks" data doesn't interfere
  const [tasks, setTasks] = useLocalStorage("kanban-tasks", []);

  const addTask = (task) =>
    setTasks((prev) => [
      { ...task, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
      ...prev,
    ]);

  const updateTask = (id, changes) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));

  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const loadSamples = () =>
    setTasks(
      SAMPLE_TASKS.map((t) => ({
        ...t,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }))
    );

  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
        <Routes>
          <Route
            path="/"
            element={
              <Board
                tasks={tasks}
                addTask={addTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
                loadSamples={loadSamples}
              />
            }
          />
          <Route
            path="*"
            element={
              <p className="py-20 text-center text-ink/60">
                Nothing here — <a href="/" className="text-accent hover:underline">go to the board</a>.
              </p>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
