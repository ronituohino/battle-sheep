import {
  toBoardNumber,
  fromBoardNumber,
  initializeGame,
  getPossibleMovesFromTile,
  getPossibleMoves,
  moveSheep,
  setSheep,
} from "../src/utils/game";
import { describe, it, expect } from "vitest";
import { levels } from "../src/levels";

const testBoard = levels.test.board;

describe("game util", () => {
  it("can initialize the game", () => {
    const init = initializeGame({
      aiPlayers: 1,
      levelName: "test",
      watchMode: false,
    });
    expect(init.board).toEqual(testBoard);
    expect(init.selectingStart).toEqual(true);
    expect(init.players).toHaveLength(2);
  });
  it("can turn player index and sheep amount to board", () => {
    expect(toBoardNumber(16, 0)).toEqual(16);
    expect(toBoardNumber(14, 1)).toEqual(114);
    expect(toBoardNumber(6, 2)).toEqual(206);
    expect(toBoardNumber(3, 3)).toEqual(303);
  });
  it("can read player index and sheep amount from board", () => {
    expect(fromBoardNumber(6)).toEqual({ playerIndex: 0, sheep: 6 });
    expect(fromBoardNumber(112)).toEqual({ playerIndex: 1, sheep: 12 });
    expect(fromBoardNumber(210)).toEqual({ playerIndex: 2, sheep: 10 });
    expect(fromBoardNumber(301)).toEqual({ playerIndex: 3, sheep: 1 });
  });
  it("can read possible moves from board", () => {
    let tiles = getPossibleMovesFromTile(testBoard, [0, 1]);
    expect(tiles).toContainEqual([2, 1]);
    expect(tiles).toContainEqual([4, 5]);
    expect(tiles).toHaveLength(2);

    // Random extra, (test if tests work)
    expect(tiles).not.toContainEqual([2, 2]);

    // The coordinate we have selected shouldn't be in the results
    expect(tiles).not.toContainEqual([0, 1]);

    tiles = getPossibleMovesFromTile(testBoard, [3, 4]);
    expect(tiles).toContainEqual([3, 3]);
    expect(tiles).toContainEqual([0, 1]);
    expect(tiles).toContainEqual([4, 5]);
    expect(tiles).toContainEqual([7, 4]);
    expect(tiles).toContainEqual([3, 6]);
    expect(tiles).toHaveLength(5);

    tiles = getPossibleMovesFromTile(testBoard, [6, 0]);
    expect(tiles).toContainEqual([6, 5]);
    expect(tiles).toHaveLength(1);
  });
  it("can read all possible moves for a player", () => {
    let newBoard = setSheep(testBoard, [0, 1], 16, 0);
    newBoard = setSheep(newBoard, [4, 3], 16, 1);

    const allMoves = getPossibleMoves(newBoard, 0);

    expect(allMoves).toHaveLength(2);
    expect(allMoves).toEqual([
      { from: [0, 1], to: [2, 1], maxSheep: 16 },
      { from: [0, 1], to: [4, 5], maxSheep: 16 },
    ]);
  });
  it("can set sheep", () => {
    let newBoard = setSheep(testBoard, [0, 1], 16, 0);
    expect(newBoard[0][1]).toEqual(16);
    expect(newBoard).not.toContainEqual(116);

    newBoard = setSheep(testBoard, [1, 0], 10, 1);
    expect(newBoard[1][0]).toEqual(110);
    expect(newBoard).not.toContainEqual(10);
    expect(newBoard).not.toContainEqual(16);

    newBoard = setSheep(testBoard, [1, 1], 6, 2);
    expect(newBoard[1][1]).toEqual(206);
  });
  it("can move sheep", () => {
    let boardWithSheep = setSheep(testBoard, [0, 1], 16, 0);

    boardWithSheep = moveSheep(boardWithSheep, [0, 1], [2, 1], 6, 0);
    expect(boardWithSheep[0][1]).toEqual(10);
    expect(boardWithSheep[2][1]).toEqual(6);
    expect(boardWithSheep).not.toContainEqual(16);

    boardWithSheep = moveSheep(boardWithSheep, [0, 1], [4, 5], 1, 0);
    expect(boardWithSheep[0][1]).toEqual(9);
    expect(boardWithSheep[4][5]).toEqual(1);
    expect(boardWithSheep).not.toContainEqual(16);
  });
  it("can set sheep, returns different reference", () => {
    const newBoard = setSheep(testBoard, [0, 1], 1, 0);
    expect(newBoard).not.toBe(testBoard);
  });
  it("can move sheep, returns different reference", () => {
    const newBoard = setSheep(testBoard, [0, 1], 3, 0);
    const movedBoard = moveSheep(newBoard, [0, 1], [0, 2], 1, 0);
    expect(movedBoard).not.toBe(newBoard);
  });
});
