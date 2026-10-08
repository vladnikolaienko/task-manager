import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from "./api";
import "./App.css";

interface Task {
  id: number;
  title: string;
  completed: number;
  created_at: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch {
      setError("Unable to load your tasks.");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      setError("");
      await createTask(title);
      setTitle("");
      await loadTasks();
    } catch {
      setError("Unable to create the task.");
    }
  }

  async function handleToggle(task: Task) {
    try {
      await updateTask(task.id, task.completed !== 1);
      await loadTasks();
    } catch {
      setError("Unable to update the task.");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteTask(id);
      await loadTasks();
    } catch {
      setError("Unable to delete the task.");
    }
  }

  const completedCount = tasks.filter(
    (task) => task.completed === 1
  ).length;

  const remainingCount = tasks.length - completedCount;

  return (
    <main className="app-shell">
      <section className="task-card">
        <header className="header">
          <div>
            <p className="eyebrow">PERSONAL PRODUCTIVITY</p>
            <h1>Task Manager</h1>
            <p className="subtitle">
              Keep track of what needs to get done.
            </p>
          </div>

          <div className="header-icon">✓</div>
        </header>

        <section className="stats">
          <div className="stat">
            <span className="stat-number">{tasks.length}</span>
            <span className="stat-label">Total</span>
          </div>

          <div className="stat">
            <span className="stat-number">{remainingCount}</span>
            <span className="stat-label">Remaining</span>
          </div>

          <div className="stat">
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </section>

        <form className="task-form" onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            maxLength={100}
            aria-label="Task title"
          />

          <button type="submit">Add task</button>
        </form>

        {error && <div className="error">{error}</div>}

        <section className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h2>No tasks yet</h2>
              <p>Add your first task above and get things moving.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <article
                className={`task ${
                  task.completed === 1 ? "completed" : ""
                }`}
                key={task.id}
              >
                <label className="task-content">
                  <input
                    type="checkbox"
                    checked={task.completed === 1}
                    onChange={() => handleToggle(task)}
                  />

                  <span className="checkmark">
                    {task.completed === 1 ? "✓" : ""}
                  </span>

                  <span className="task-title">{task.title}</span>
                </label>

                <button
                  className="delete-button"
                  onClick={() => handleDelete(task.id)}
                  aria-label={`Delete ${task.title}`}
                >
                  ×
                </button>
              </article>
            ))
          )}
        </section>

        {tasks.length > 0 && (
          <footer className="footer">
            {completedCount === tasks.length
              ? "🎉 Everything is complete!"
              : `${remainingCount} ${
                  remainingCount === 1 ? "task" : "tasks"
                } left to finish`}
          </footer>
        )}
      </section>
    </main>
  );
}

export default App;