import { describe, expect, test } from "bun:test"
import { unparsed } from "@/tool/shell-unparsed"

// Tests for unparsed command handling
describe("Unparsed command handling", () => {
  test("should recover failed command text from ERROR nodes", () => {
    const root = /* setup node with ERROR */;
    const result = unparsed(root, 0);
    expect(result).toEqual(["failed command text"]);
  });
});