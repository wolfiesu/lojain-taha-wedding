import { describe, expect, it } from "vitest";
import { validateRsvp } from "@/lib/rsvp";

describe("RSVP rules", () => {
  it("requires a name", () => {
    expect(validateRsvp({ name: " ", attendance: "accept", guests: 1 }).name).toBeDefined();
  });
  it("requires an attendance choice", () => {
    expect(validateRsvp({ name: "Sara Ali", attendance: null, guests: 1 }).attendance).toBeDefined();
  });
  it("rejects zero guests when accepting", () => {
    expect(validateRsvp({ name: "Sara Ali", attendance: "accept", guests: 0 }).guests).toBeDefined();
  });
  it("ignores guest count when declining", () => {
    expect(validateRsvp({ name: "Sara Ali", attendance: "decline", guests: 0 })).toEqual({});
  });
});
