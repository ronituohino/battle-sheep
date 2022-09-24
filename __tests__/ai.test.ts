import { describe, it, expect } from "vitest";
import { playAi } from "../src/utils/ai";
import { levels } from "../src/levels";
import { Player } from "../src/utils/types";
import { setSheep } from "../src/utils/game";

const testBoard = levels.test.board;

const ai: Player = { name: "ai", color: "white", human: false };
const human: Player = { name: "human", color: "blue", human: true };

describe("ai", () => {
  it("can select starting tile", () => {
    // Test if playAi returns a new game state which has 16 sheep somewhere
    const newState = playAi(
      testBoard,
      {
        selectingStart: true,
        startTiles: levels.test.startTiles,
        gameEnded: false,
      },
      [ai],
    );
    expect(newState[1].flat()).toContainEqual(16);
  });

  it("can move sheep", () => {
    const newState = playAi(
      testBoard,
      {
        selectingStart: true,
        startTiles: levels.test.startTiles,
        gameEnded: false,
      },
      [ai],
    );
    expect(newState[1].flat()).toContainEqual(16);

    const firstMovedState = playAi(
      newState[1],
      {
        selectingStart: false,
        startTiles: levels.test.startTiles,
        gameEnded: false,
      },
      [ai],
    );

    expect(firstMovedState[1].flat()).not.toContainEqual(16);
  });

  it("doesn't do anything if there are no ai players", () => {
    const newState = playAi(
      testBoard,
      {
        selectingStart: true,
        gameEnded: false,
        startTiles: levels.test.startTiles,
      },
      [human],
    );

    // Should return the same board with the same reference
    expect(newState[1]).toEqual(testBoard);
    expect(newState[1]).toBe(testBoard);
  });

  it("doesn't do anything if there are no possible moves", () => {
    // Fill board with 1 sheep for player 0
    let newBoard = testBoard;
    for (let x = 0; x < testBoard.length; x++) {
      const column = testBoard[x];
      for (let y = 0; y < column.length; y++) {
        newBoard = setSheep(testBoard, [x, y], 1, 0);
      }
    }

    // Give ai the turn, should return the same board with the same reference
    const newState = playAi(
      newBoard,
      {
        selectingStart: false,
        gameEnded: false,
        startTiles: levels.test.startTiles,
      },
      [human, ai],
    );

    expect(newState[1]).toEqual(newBoard);
    expect(newState[1]).toBe(newBoard);
  });
});
