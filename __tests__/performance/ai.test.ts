import { describe, it } from "vitest";
import { levels } from "../../src/levels";
import { Board, Player } from "../../src/utils/types";
import { simulateTurns } from "../helper";

const testBoard = levels.test.board;
const testBoardWithStart: Board = [
  [-1, 0],
  [0, 0, 0, 0],
  [0, 0, -1, 0],
  [0, -1, -1, 0, 116, 0, 0],
  [-1, 0, -1, 0, 0, 0, 0, 0],
  [-1, -1, 0, -1, 0, 16],
  [0, 0, 0, 0, 0, 0],
  [-1, -1, -1, -1, 0],
];

const ai: Player = { name: "ai", color: "white", human: false };

describe("ai", () => {
  it("select start", () => {
    console.time("selecting start");
    simulateTurns(
      testBoard,
      {
        selectingStart: true,
        startTiles: levels.test.startTiles,
        gameEnded: false,
      },
      [ai, ai],
      1,
    );
    console.timeEnd("selecting start");
  });
  it("first move", () => {
    console.time("first move");
    simulateTurns(
      testBoardWithStart,
      {
        selectingStart: false,
        startTiles: levels.test.startTiles,
        gameEnded: false,
      },
      [ai, ai],
      1,
    );
    console.timeEnd("first move");
  });
  it("simulate 3 turns for both", () => {
    console.time("3 moves for both");
    const res = simulateTurns(
      testBoardWithStart,
      {
        selectingStart: false,
        startTiles: levels.test.startTiles,
        gameEnded: false,
      },
      [ai, ai],
      3,
    );
    console.log("situation after 3 moves");
    console.log(res[1]);
    console.timeEnd("3 moves for both");
  });
});
