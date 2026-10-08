import { Router } from "express";
import db from "../db.js";

const router = Router();

// GET /api/tasks
router.get("/", (_req, res) => {
  const tasks = db
    .prepare("SELECT * FROM tasks ORDER BY created_at DESC")
    .all();

  res.json(tasks);
});

// POST /api/tasks
router.post("/", (req, res) => {
  const { title } = req.body;

  if (
    typeof title !== "string" ||
    title.trim().length === 0 ||
    title.length > 100
  ) {
    return res.status(400).json({
      error: "Title must be between 1 and 100 characters"
    });
  }

  const result = db
    .prepare("INSERT INTO tasks (title) VALUES (?)")
    .run(title.trim());

  const task = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(task);
});

// PATCH /api/tasks/:id
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const { completed } = req.body;

  if (!Number.isInteger(id) || typeof completed !== "boolean") {
    return res.status(400).json({
      error: "Invalid request"
    });
  }

  const result = db
    .prepare("UPDATE tasks SET completed = ? WHERE id = ?")
    .run(completed ? 1 : 0, id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  const task = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(id);

  res.json(task);
});

// DELETE /api/tasks/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  const result = db
    .prepare("DELETE FROM tasks WHERE id = ?")
    .run(id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  res.status(204).send();
});

export default router;