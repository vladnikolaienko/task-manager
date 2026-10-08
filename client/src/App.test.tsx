import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import App from "./App";

import * as api from "./api";

vi.mock("./api");

const mockedApi = vi.mocked(api);

afterEach(() => {
  cleanup();
});

describe("Task Manager", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedApi.getTasks.mockResolvedValue([
      {
        id: 1,
        title: "Learn React",
        completed: 0,
        created_at: "2026-01-01"
      },
      {
        id: 2,
        title: "Build API",
        completed: 1,
        created_at: "2026-01-01"
      }
    ]);
  });

  it("renders tasks returned from the API", async () => {
    render(<App />);

    expect(await screen.findByText("Learn React")).toBeInTheDocument();
    expect(screen.getByText("Build API")).toBeInTheDocument();
  });

  it("creates a new task when the form is submitted", async () => {
    mockedApi.createTask.mockResolvedValue({
      id: 3,
      title: "New task",
      completed: 0,
      created_at: "2026-01-01"
    });

    render(<App />);

    const input = screen.getByPlaceholderText("Enter a task...");
    const button = screen.getByRole("button", {
      name: "Add"
    });

    fireEvent.change(input, {
      target: {
        value: "New task"
      }
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedApi.createTask).toHaveBeenCalledWith("New task");
    });
  });
});