import { describe, it, expect } from "vitest";
import { simulate } from "../../src/game/ai";
import { levels } from "../../src/levels";

// Use these to control unit tests
const aiDepth = 4;

describe("ai", () => {
  it("can select starting tile", () => {
    // Test if playAi returns a new game state which has 16 sheep for player 1 somewhere
    const newState = simulate(
      levels.test.board,
      levels.test.sizeX,
      levels.test.sizeY,
      aiDepth,
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
      aiDepth,
    );
    expect(result[0].flat()).not.toContainEqual(18);
  });

  it("doesn't do anything if there are no possible moves", () => {
    const result = simulate(
      levels.testFull.board,
      levels.testFull.sizeX,
      levels.testFull.sizeY,
      aiDepth,
    );
    expect(result[0]).toEqual(levels.testFull.board);
    expect(result[0]).toBe(levels.testFull.board);
  });
});
