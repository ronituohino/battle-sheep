import { describe, it, expect } from "vitest";
import { aiTurn, AI_moveSheep, tileValue } from "../src/utils/ai";
import { levels } from "../src/levels";
import { setSheep } from "../src/utils/game";

const testBoard = levels.test.board;

describe("ai", () => {
  it("can select starting tile", () => {
    const newBoard = aiTurn(
      { selectingStart: true, startTiles: levels.test.startTiles },
      testBoard,
      0,
    );
    expect(newBoard.flat()).toContainEqual(16);
  });
  it("can give a tile a 'value'", () => {
    expect(tileValue(testBoard, [1, 0])).toEqual(6);
    expect(tileValue(testBoard, [0, 1])).toEqual(6);
    expect(tileValue(testBoard, [3, 4])).toEqual(11);
    expect(tileValue(testBoard, [2, 1])).toEqual(4);
  });
  it("can move sheep", () => {
    const startingBoard = setSheep(testBoard, [1, 0], 16, 0);
    const move = AI_moveSheep(startingBoard, 0);

    expect(move).not.toEqual(undefined);
    expect(move?.amount).toBeLessThan(16);
  });
});
