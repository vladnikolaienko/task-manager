import request from "supertest";
import { describe, it, expect, beforeEach } from "vitest";
import app from "../src/index.js";
import db from "../src/db.js";

describe("Tasks API", () => {
  beforeEach(() => {
    db.exec("DELETE FROM tasks");
  });

  it("creates a task", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({
        title: "Test task"
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Test task");
    expect(response.body.completed).toBe(0);
  });

  it("rejects an empty title", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({
        title: ""
      });

    expect(response.status).toBe(400);
  });

  it("updates a task", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({
        title: "Update me"
      });

    const response = await request(app)
      .patch(`/api/tasks/${created.body.id}`)
      .send({
        completed: true
      });

    expect(response.status).toBe(200);
    expect(response.body.completed).toBe(1);
  });

  it("returns 404 for a nonexistent task", async () => {
    const response = await request(app)
      .patch("/api/tasks/999999")
      .send({
        completed: true
      });

    expect(response.status).toBe(404);
  });
});