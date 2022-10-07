import { describe, it } from "vitest";
import { levels } from "../../src/levels";
import { simulate } from "../../src/utils/ai";

const testLevel = levels.test;

describe("ai", () => {
  it("select start", () => {
    console.time("selecting start");
    simulate(
      testLevel.board,
      testLevel.sizeX,
      testLevel.sizeY,
      true,
      testLevel.startTiles,
    );
    console.timeEnd("selecting start");
  });
  it("first move", () => {
    const start = simulate(
      testLevel.board,
      testLevel.sizeX,
      testLevel.sizeY,
      true,
      testLevel.startTiles,
    );

    console.time("first move");
    simulate(start[0], testLevel.sizeX, testLevel.sizeY);
    console.timeEnd("first move");
  });
  it("simulate 3 turns for ai", () => {
    let board = simulate(
      testLevel.board,
      testLevel.sizeX,
      testLevel.sizeY,
      true,
      testLevel.startTiles,
    );

    console.time("3 moves for ai");
    for (let i = 0; i < 3; i++) {
      board = simulate(board[0], testLevel.sizeX, testLevel.sizeY);
    }
    console.log("situation after 3 moves");
    console.log(board[0]);
    console.timeEnd("3 moves for ai");
  });
});
