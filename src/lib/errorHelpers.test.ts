import { describe, it, expect } from "vitest";
import { getErrorMessage, getErrorCode } from "./errorHelpers";

describe("getErrorMessage", () => {
  it("returns message for Error instances", () => {
    expect(getErrorMessage(new Error("Something broke"))).toBe(
      "Something broke",
    );
  });

  it("returns stringified value for non-Error", () => {
    expect(getErrorMessage("just a string")).toBe("just a string");
    expect(getErrorMessage(42)).toBe("42");
    expect(getErrorMessage(null)).toBe("null");
  });

  it("returns stringified value for objects", () => {
    expect(getErrorMessage({ message: "object error" })).toBe(
      "[object Object]",
    );
  });
});

describe("getErrorCode", () => {
  it("returns code from Firebase-like errors", () => {
    expect(getErrorCode({ code: "auth/invalid-credential" })).toBe(
      "auth/invalid-credential",
    );
  });

  it("returns empty string for Error instances", () => {
    expect(getErrorCode(new Error("no code"))).toBe("");
  });

  it("returns empty string for non-objects", () => {
    expect(getErrorCode("string")).toBe("");
    expect(getErrorCode(42)).toBe("");
    expect(getErrorCode(null)).toBe("");
    expect(getErrorCode(undefined)).toBe("");
  });
});
