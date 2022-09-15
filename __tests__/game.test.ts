import { toBoardValue, fromBoardValue } from "../src/utils/game";
import { describe, it, expect } from "vitest";

describe("game", () => {
  it("initializes", () => {
    expect(1).toEqual(1);
  });
  it("can turn player index and sheep amount to board", () => {
    expect(toBoardValue(16, 0)).toEqual(16);
    expect(toBoardValue(14, 1)).toEqual(114);
    expect(toBoardValue(6, 2)).toEqual(206);
    expect(toBoardValue(3, 3)).toEqual(303);
  });
  it("can read player index and sheep amount from board", () => {
    expect(fromBoardValue(106)).toEqual({ playerIndex: 1, sheep: 6 });
  });
});
