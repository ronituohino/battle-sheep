import { describe, it, expect } from "vitest";
import { AI_moveSheep, simulate } from "../src/utils/ai";
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
  it("can move sheep", () => {
    const startingBoard = setSheep(testBoard, [1, 0], 16, 0);
    const move = AI_moveSheep(startingBoard, 0);

    expect(move).not.toEqual(undefined);
    expect(move?.amount).toBeLessThan(16);
  });
});
