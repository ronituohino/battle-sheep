import { describe, expect, it } from "vitest";
import { isNumeric } from "../../src/utils/regex";

describe("regex.ts", () => {
  it("can identify numeric values", () => {
    expect(isNumeric("123")).toEqual(true);
    expect(isNumeric("01")).toEqual(true);
    expect(isNumeric("  1")).toEqual(false);
    expect(isNumeric("abc")).toEqual(false);
    expect(isNumeric("0x123456")).toEqual(false);
    expect(isNumeric("av2341asd")).toEqual(false);
    expect(isNumeric("6")).toEqual(true);
  });
});
