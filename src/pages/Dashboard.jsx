import { Link } from "react-router-dom";
import { DAYS, TOPICS, todayName } from "../data";

export default function Dashboard({ tasks, goal, setGoal, loadSamples }) {
  const today = todayName();

  const doneTasks = tasks.filter((t) => t.status === "done");
  const doingCount = tasks.filter((t) => t.status === "in progress").length;
  const doneHours = doneTasks.reduce((sum, t) => sum + t.hours, 0);
  const pct = goal > 0 ? Math.min(100, Math.round((doneHours / goal) * 100)) : 0;

  const todaysTasks = tasks.filter((t) => t.day === today && t.status !== "done");

  // per day + per topic numbers for the week strip and the bars
  const byDay = DAYS.map((d) => {
    const list = tasks.filter((t) => t.day === d);
    return { day: d, total: list.length, done: list.filter((t) => t.status === "done").length };
  });

  const byTopic = TOPICS.map((name) => {
    const list = tasks.filter((t) => t.topic === name);
    return { name, total: list.length, done: list.filter((t) => t.status === "done").length };
  }).filter((t) => t.total > 0);

  if (tasks.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="mb-2 text-3xl font-bold">Plan your interview week</h1>
        <p className="mx-auto mb-6 max-w-md text-ink/70">
          Log what you want to practice, tick it off as you go, and see how the week is shaping up.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/practice" className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white">
            Add a task
          </Link>
          <button onClick={loadSamples} className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white">
            Load sample week
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* headline progress */}
      <section className="rounded-xl bg-ink p-5 text-white sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-white/60">This week</p>
            <p className="text-4xl font-bold">
              {doneHours}h <span className="text-lg font-normal text-white/60">of {goal}h</span>
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-white/70">
            Weekly goal
            <input
              type="number"
              min="1"
              value={goal}
              onChange={(e) => setGoal(Math.max(1, Number(e.target.value) || 1))}
              className="w-16 rounded-md bg-white/10 px-2 py-1 text-white outline-none focus:ring-2 focus:ring-white/40"
            />
            h
          </label>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-done transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-sm text-white/60">{pct}% of your goal done</p>
      </section>

      {/* quick numbers */}
      <section className="grid grid-cols-3 gap-3">
        <Stat label="Tasks" value={tasks.length} />
        <Stat label="In progress" value={doingCount} />
        <Stat label="Completed" value={doneTasks.length} />
      </section>

      {/* week strip - each column links to that day's tasks */}
      <section>
        <h2 className="mb-3 font-bold">Your week</h2>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
          {byDay.map(({ day, total, done }) => {
            const fill = total ? (done / total) * 100 : 0;
            const isToday = day === today;
            return (
              <Link
                key={day}
                to={`/practice?day=${day}`}
                className={`flex flex-col items-center rounded-xl bg-white p-2 ring-1 transition-shadow hover:shadow-md sm:p-3 ${
                  isToday ? "ring-2 ring-accent" : "ring-ink/10"
                }`}
              >
                <span className={`text-xs font-medium ${isToday ? "text-accent" : "text-ink/60"}`}>{day}</span>
                {/* little fill bar, taller = more done */}
                <div className="relative my-2 h-16 w-full max-w-8 overflow-hidden rounded-md bg-ink/10 sm:h-24">
                  <div className="absolute bottom-0 w-full bg-done" style={{ height: `${fill}%` }} />
                </div>
                <span className="text-xs text-ink/70">
                  {done}/{total}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        {/* today */}
        <section>
          <h2 className="mb-3 font-bold">Still to do today ({today})</h2>
          {todaysTasks.length === 0 ? (
            <p className="rounded-xl bg-white p-4 text-sm text-ink/60 ring-1 ring-ink/10">
              Nothing left for today. Add more or take a break.
            </p>
          ) : (
            <ul className="space-y-2">
              {todaysTasks.map((t) => (
                <li key={t.id} className="rounded-xl bg-white p-3 text-sm ring-1 ring-ink/10">
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-ink/60">
                    {t.topic} · {t.hours}h · {t.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* topics */}
        <section>
          <h2 className="mb-3 font-bold">By topic</h2>
          <ul className="space-y-3 rounded-xl bg-white p-4 ring-1 ring-ink/10">
            {byTopic.map((t) => (
              <li key={t.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{t.name}</span>
                  <span className="text-ink/60">
                    {t.done}/{t.total}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink/10">
                  <div className="h-full bg-accent" style={{ width: `${(t.done / t.total) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-ink/10">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-ink/60">{label}</p>
    </div>
  );
}
