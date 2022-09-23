import { describe, it, expect } from "vitest";
import { simulate, minimax } from "../src/utils/ai";
import { levels } from "../src/levels";
import { setSheep } from "../src/utils/game";

const testBoard = levels.test.board;

describe("ai", () => {
  it("can select starting tile", () => {
    const newBoard = simulate(
      testBoard,
      {
        selectingStart: true,
        startTiles: levels.test.startTiles,
        gameEnded: false,
      },
      0,
    );
    expect(newBoard.flat()).toContainEqual(16);
  });
});
