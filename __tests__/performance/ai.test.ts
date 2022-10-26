import { describe, it } from "vitest";
import { levels } from "../../src/levels";
import { simulate } from "../../src/game/ai";
import { Board } from "../../src/types";

// Use these to control performance tests
const level = levels.testOpen;
const levelStarted = levels.testOpenStarted;

const aiDepth = 6;

describe("ai", () => {
  it("select start", () => {
    console.time("selecting start");
    simulate(
      level.board,
      level.sizeX,
      level.sizeY,
      aiDepth,
      true,
      level.startTiles,
    );
    console.timeEnd("selecting start");
  });
  it("first move", () => {
    console.time("first move");
    simulate(levelStarted.board, level.sizeX, level.sizeY, aiDepth);
    console.timeEnd("first move");
  });
  it("simulate first 3 move turns for ai", () => {
    console.time("3 moves for ai");

    let board: [Board, boolean, number] = [levelStarted.board, false, 0];
    for (let i = 0; i < 3; i++) {
      board = simulate(
        board[0],
        levelStarted.sizeX,
        levelStarted.sizeY,
        aiDepth,
      );
    }

    console.log("situation after 3 moves");
    console.log(board[0]);
    console.timeEnd("3 moves for ai");
  });
});
