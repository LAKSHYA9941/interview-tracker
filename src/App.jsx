import { Routes, Route } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import { SAMPLE_TASKS } from "./data";

export default function App() {
  const [tasks, setTasks] = useLocalStorage("ipt-tasks", []);
  const [goal, setGoal] = useLocalStorage("ipt-goal", 15); // weekly hours target

  const addTask = (task) =>
    setTasks((prev) => [{ ...task, id: crypto.randomUUID() }, ...prev]);

  const updateTask = (id, changes) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));

  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const loadSamples = () =>
    setTasks(SAMPLE_TASKS.map((t) => ({ ...t, id: crypto.randomUUID() })));

  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard tasks={tasks} goal={goal} setGoal={setGoal} loadSamples={loadSamples} />
            }
          />
          <Route
            path="/practice"
            element={
              <Practice
                tasks={tasks}
                addTask={addTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
                loadSamples={loadSamples}
              />
            }
          />
          <Route path="*" element={<p className="py-20 text-center">Nothing here. Use the nav up top.</p>} />
        </Routes>
      </main>
    </div>
  );
}
