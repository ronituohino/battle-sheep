import { describe, it, expect } from "vitest";
import { GOOD, simulate } from "../../src/game/ai";
import { coordinateToIndex } from "../../src/game/game";
import { levels } from "../../src/levels";

// Use these to control unit tests
const aiDepth = 5;

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

  // Testing if the alphabeta algorithm works
  // It should be able to find winning states from the game tree and make those moves even without a heuristic
  it("selects the winning move from two possibilities, 1", () => {
    const result = simulate(levels.testAlphabeta1.board, levels.testAlphabeta1.sizeX, levels.testAlphabeta1.sizeY, aiDepth)

    expect(result[0][2]).toBeGreaterThanOrEqual(18)
    expect(result[2]).toBeGreaterThanOrEqual(GOOD)
  })
  it("selects the winning move from two possibilities, 2", () => {
    const result = simulate(levels.testAlphabeta2.board, levels.testAlphabeta2.sizeX, levels.testAlphabeta2.sizeY, aiDepth)

    expect(result[2]).toBeGreaterThanOrEqual(GOOD)
  })
  it("selects the winning move from two possibilities, 3", () => {
    const result = simulate(levels.testAlphabeta3.board, levels.testAlphabeta3.sizeX, levels.testAlphabeta3.sizeY, aiDepth)
    expect(result[2]).toBeGreaterThanOrEqual(GOOD)
  })
  it("selects the winning move from three possibilities, 4", () => {
    const result = simulate(
      levels.testAlphabeta4.board,
      levels.testAlphabeta4.sizeX,
      levels.testAlphabeta4.sizeY,
      aiDepth,
    );

    expect(result[0][coordinateToIndex(1, 2, levels.testAlphabeta4.sizeX)]).toBeGreaterThanOrEqual(18);
    expect(result[2]).toBeGreaterThanOrEqual(GOOD)
  });
  // aiDepth >= 5 for this to pass
  it("selects the winning move from three possibilities, 5", () => {
    const result = simulate(
      levels.testAlphabeta5.board,
      levels.testAlphabeta5.sizeX,
      levels.testAlphabeta5.sizeY,
      aiDepth,
    );
    expect(result[2]).toBeGreaterThanOrEqual(GOOD)
  });

  // This could be considered performance testing, since we need the heuristic for these tests
  // However, I think even a basic heuristic makes these tests passable and is essential for the AI itself to work
  it("moves to an area with more free space", () => {
    const result = simulate(
      levels.testMovement.board,
      levels.testMovement.sizeX,
      levels.testMovement.sizeY,
      aiDepth,
    );

    // Ai should move to an area with more space available
    expect(result[0][coordinateToIndex(1, 0, 3)]).toBeGreaterThanOrEqual(18);
    // And there isn't a winning move by minimax
    expect(result[2]).toBeLessThan(GOOD)
  });
});
