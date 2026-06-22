import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isTaskOverdue } from "./isTaskOverdue";

describe("isTaskOverdue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-21T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns false when dueDate is null", () => {
    expect(isTaskOverdue(null, false)).toBe(false);
  });

  it("returns false when task is completed", () => {
    expect(isTaskOverdue("2026-06-20", true)).toBe(false);
  });

  it("returns false when dueDate is today", () => {
    expect(isTaskOverdue("2026-06-21", false)).toBe(false);
  });

  it("returns false when dueDate is in the future", () => {
    expect(isTaskOverdue("2026-06-25", false)).toBe(false);
  });

  it("returns true when dueDate is in the past and not completed", () => {
    expect(isTaskOverdue("2026-06-20", false)).toBe(true);
  });

  it("handles ISO date strings from Firestore", () => {
    expect(isTaskOverdue("2026-06-19T03:00:00.000Z", false)).toBe(true);
  });
});
