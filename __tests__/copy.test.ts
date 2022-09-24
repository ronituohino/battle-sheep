import { describe, expect, it } from "vitest";
import { copy } from "../src/utils/copy";

describe("copy.ts", () => {
  it("deep copies an object", () => {
    const object = [
      [0, 1],
      [
        ["test", 1],
        [
          [4, 5],
          [6, 7],
        ],
        { test: 1, something: "more" },
      ],
      false,
    ];
    const newObject = copy(object);

    // Objects equal
    expect(newObject).toEqual(object);

    // But reference is different
    expect(newObject).not.toBe(object);
  });
});
