import { describe, it, expect } from "vitest";
import { aiTurn } from "../src/ai";
import { levels } from "../src/levels";

const testBoard = levels.test.board;

describe("ai", () => {
  it("can select starting tile", () => {
    const newBoard = aiTurn(
      { selectingStart: true },
      testBoard,
      [{ name: "ai", color: "white" }],
      0,
    );
    expect(newBoard.flat()).toContainEqual(16);
  });
  /*
  it("can move sheep", () => {
    const newBoard = aiTurn(
      { selectingStart: false },
      testBoard,
      [{ name: "ai", color: "white" }],
      0,
    );
  });
  */
});
