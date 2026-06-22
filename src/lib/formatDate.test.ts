import { describe, it, expect } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats a valid ISO date string in es-AR locale", () => {
    const result = formatDate("2026-06-21T10:00:00Z");
    expect(result).toContain("21");
    expect(result).toContain("jun");
    expect(result).toContain("2026");
  });

  it("returns the original string for invalid dates", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });

  it("handles empty string", () => {
    expect(formatDate("")).toBe("");
  });
});
