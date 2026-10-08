import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from "./api";

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
      setError("Failed to load tasks");
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      await createTask(title);
      setTitle("");
      await loadTasks();
    } catch {
      setError("Failed to create task");
    }
  }

  async function handleToggle(task: Task) {
    await updateTask(task.id, !Boolean(task.completed));
    await loadTasks();
  }

  async function handleDelete(id: number) {
    await deleteTask(id);
    await loadTasks();
  }

  const completedCount = tasks.filter(
    (task) => Boolean(task.completed)
  ).length;

  return (
    <main style={{ maxWidth: 600, margin: "50px auto", padding: 20 }}>
      <h1>Task Manager</h1>

      <p>
        {tasks.length} tasks · {completedCount} completed
      </p>

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a task..."
          maxLength={100}
        />

        <button type="submit">Add</button>
      </form>

      {error && <p>{error}</p>}

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={Boolean(task.completed)}
              onChange={() => handleToggle(task)}
            />

            <span
              style={{
                textDecoration: task.completed
                  ? "line-through"
                  : "none"
              }}
            >
              {task.title}
            </span>

            <button onClick={() => handleDelete(task.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;