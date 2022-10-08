import { describe, it } from "vitest";
import { levels } from "../../src/levels";
import { simulate } from "../../src/game/ai";
import { Board } from "../../src/types";

describe("ai", () => {
  it("select start", () => {
    console.time("selecting start");
    simulate(
      levels.test.board,
      levels.test.sizeX,
      levels.test.sizeY,
      true,
      levels.test.startTiles,
    );
    console.timeEnd("selecting start");
  });
  it("first move", () => {
    const start = simulate(
      levels.test.board,
      levels.test.sizeX,
      levels.test.sizeY,
      true,
      levels.test.startTiles,
    );

    console.time("first move");
    simulate(start[0], levels.test.sizeX, levels.test.sizeY);
    console.timeEnd("first move");
  });
  it("simulate 3 turns for ai", () => {
    console.time("3 moves for ai");

    let board: [Board, boolean] = [[], false];
    for (let i = 0; i < 3; i++) {
      board = simulate(
        levels.testStarted.board,
        levels.testStarted.sizeX,
        levels.testStarted.sizeY,
      );
    }

    console.log("situation after 3 moves");
    console.log(board[0]);
    console.timeEnd("3 moves for ai");
  });
});
