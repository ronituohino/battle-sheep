import { toBoardNumber, fromBoardNumber } from "../src/game";
import { describe, it, expect } from "vitest";

describe("game", () => {
  it("initializes", () => {
    expect(1).toEqual(1);
  });
  it("can turn player index and sheep amount to board", () => {
    expect(toBoardNumber(16, 0)).toEqual(16);
    expect(toBoardNumber(14, 1)).toEqual(114);
    expect(toBoardNumber(6, 2)).toEqual(206);
    expect(toBoardNumber(3, 3)).toEqual(303);
  });
  it("can read player index and sheep amount from board", () => {
    expect(fromBoardNumber(106)).toEqual({ playerIndex: 1, sheep: 6 });
  });
});
