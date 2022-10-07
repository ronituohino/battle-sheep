import { describe, it, expect } from "vitest";
import { simulate } from "../../src/utils/ai";
import { levels } from "../../src/levels";

describe("ai", () => {
  it("can select starting tile", () => {
    // Test if playAi returns a new game state which has 16 sheep for player 1 somewhere
    const newState = simulate(
      levels.test.board,
      levels.test.sizeX,
      levels.test.sizeY,
      true,
      levels.test.startTiles,
    );
    expect(newState[0].flat()).toContainEqual(33);
  });

  it("can move sheep", () => {
    const result = simulate(
      levels.testStarted.board,
      levels.testStarted.sizeX,
      levels.testStarted.sizeY,
    );
    expect(result[0].flat()).not.toContainEqual(18);
  });

  it("doesn't do anything if there are no possible moves", () => {
    const result = simulate(
      levels.testFull.board,
      levels.testFull.sizeX,
      levels.testFull.sizeY,
    );
    expect(result[0]).toEqual(levels.testFull.board);
    expect(result[0]).toBe(levels.testFull.board);
  });

  it("does it get stuck?", () => {
    const situation = [
      18, 1, 19, 18, 0, 0, 3, 1, 2, 1, 5, 0, 1, 0, 3, 1, 20, 0, 7, 1, 2, 0, 0,
      26,
    ];
    const result = simulate(situation, 6, 4);

    expect(result[0]).not.toEqual(situation);
  });
});
