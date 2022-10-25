import { describe, it, expect } from "vitest";
import { simulate } from "../../src/game/ai";
import { coordinateToIndex } from "../../src/game/game";
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
    expect(newState[0]).toContainEqual(33);
  });

  it("can move sheep", () => {
    const result = simulate(
      levels.testStarted.board,
      levels.testStarted.sizeX,
      levels.testStarted.sizeY,
      aiDepth,
    );
    expect(result[0]).not.toContainEqual(33);
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

  // Some obvious cases
  it("moves to an area with more free space", () => {
    const result = simulate(
      levels.testMovement.board,
      levels.testMovement.sizeX,
      levels.testMovement.sizeY,
      aiDepth,
    );

    // Ai should move to an area with more space available
    expect(result[0][coordinateToIndex(1, 0, 3)]).toBeGreaterThanOrEqual(17);
  });
  it("blocks opponent from playing if possible", () => {
    const result = simulate(
      levels.testBlocking.board,
      levels.testBlocking.sizeX,
      levels.testBlocking.sizeY,
      aiDepth,
    );

    // Ai should block player from making any further moves (prioritising early wins)
    expect(result[0][coordinateToIndex(1, 2, 3)]).toBeGreaterThanOrEqual(17);
  });
});
