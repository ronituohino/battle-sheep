import {
  initializeGame,
  getPossibleMovesFromTile,
  getPossibleMoves,
  moveSheep,
  setSheep,
  getPlayersSheepTileAmount,
  boardValueToPlayerIndex,
  boardValueToSheepAmount,
  tbi,
} from "../../src/game/game";
import { describe, it, expect } from "vitest";
import { levels } from "../../src/levels";

const testLevel = levels.test;

describe("game util", () => {
  it("can initialize the game", () => {
    const init = initializeGame({
      levelKey: "test",
    });
    expect(init.dynamic.board).toEqual(testLevel.board);
    expect(init.dynamic.info.selectingStart).toEqual(true);
  });

  it("can read player index and sheep amount from board", () => {
    expect(boardValueToPlayerIndex(17)).toEqual(0);
    expect(boardValueToPlayerIndex(6)).toEqual(0);
    expect(boardValueToPlayerIndex(2)).toEqual(0);
    expect(boardValueToPlayerIndex(18)).toEqual(1);
    expect(boardValueToPlayerIndex(20)).toEqual(1);
    expect(boardValueToPlayerIndex(33)).toEqual(1);
  });

  it("can read sheep amount from board", () => {
    expect(boardValueToSheepAmount(17)).toEqual(16);
    expect(boardValueToSheepAmount(6)).toEqual(5);
    expect(boardValueToSheepAmount(2)).toEqual(1);
    expect(boardValueToSheepAmount(18)).toEqual(1);
    expect(boardValueToSheepAmount(20)).toEqual(3);
    expect(boardValueToSheepAmount(33)).toEqual(16);
  });

  it("can read possible moves from board", () => {
    let tiles = getPossibleMovesFromTile(testLevel.board, testLevel.sizeX, 0);
    expect(tiles).toContainEqual(tbi(0, 3, testLevel.sizeX));
    expect(tiles).toContainEqual(tbi(3, 0, testLevel.sizeX));
    expect(tiles).toContainEqual(tbi(2, 2, testLevel.sizeX));
    expect(tiles).toHaveLength(3);

    // The coordinate we have selected shouldn't be in the results
    expect(tiles).not.toContainEqual(0);

    tiles = getPossibleMovesFromTile(testLevel.board, testLevel.sizeX, 3);
    expect(tiles).toContainEqual(tbi(0, 0, testLevel.sizeX));
    expect(tiles).toContainEqual(tbi(3, 2, testLevel.sizeX));
    expect(tiles).toContainEqual(tbi(4, 1, testLevel.sizeX));
    expect(tiles).toHaveLength(3);

    tiles = getPossibleMovesFromTile(
      testLevel.board,
      testLevel.sizeX,
      tbi(2, 1, testLevel.sizeX),
    );
    expect(tiles).toContainEqual(tbi(1, 0, testLevel.sizeX));
    expect(tiles).toContainEqual(tbi(2, 0, testLevel.sizeX));
    expect(tiles).toContainEqual(tbi(4, 1, testLevel.sizeX));
    expect(tiles).toContainEqual(tbi(3, 2, testLevel.sizeX));
    expect(tiles).toContainEqual(tbi(2, 3, testLevel.sizeX));
    expect(tiles).toContainEqual(tbi(0, 1, testLevel.sizeX));
    expect(tiles).toHaveLength(6);
  });

  it("can read all possible moves for a player", () => {
    let newBoard = setSheep(testLevel.board, 1, 16, 0);
    newBoard = setSheep(newBoard, tbi(3, 2, testLevel.sizeX), 16, 1);

    const allMoves = getPossibleMoves(
      newBoard,
      testLevel.sizeX,
      testLevel.sizeY,
      0,
    );

    expect(allMoves).toHaveLength(4);
    expect(allMoves).toEqual([
      { from: 1, to: tbi(1, 1, testLevel.sizeX), maxSheep: 15 },
      { from: 1, to: tbi(3, 0, testLevel.sizeX), maxSheep: 15 },
      { from: 1, to: tbi(2, 1, testLevel.sizeX), maxSheep: 15 },
      { from: 1, to: tbi(0, 0, testLevel.sizeX), maxSheep: 15 },
    ]);
  });

  it("can set sheep", () => {
    let index = tbi(0, 1, testLevel.sizeX);
    let newBoard = setSheep(testLevel.board, index, 16, 0);
    expect(newBoard[index]).toEqual(17);

    index = tbi(1, 0, testLevel.sizeX);
    newBoard = setSheep(testLevel.board, index, 10, 1);
    expect(newBoard[index]).toEqual(27);
  });

  it("can move sheep", () => {
    const index = tbi(0, 1, testLevel.sizeX);
    let boardWithSheep = setSheep(testLevel.board, index, 16, 0);

    const secondIndex = 0;
    boardWithSheep = moveSheep(boardWithSheep, index, secondIndex, 6, 0);
    expect(boardWithSheep[index]).toEqual(11);
    expect(boardWithSheep[secondIndex]).toEqual(7);
    expect(boardWithSheep).not.toContainEqual(17);

    const thirdIndex = tbi(0, 3, testLevel.sizeX);
    boardWithSheep = moveSheep(boardWithSheep, index, thirdIndex, 1, 0);
    expect(boardWithSheep[index]).toEqual(10);
    expect(boardWithSheep[thirdIndex]).toEqual(2);
    expect(boardWithSheep).not.toContainEqual(17);
  });

  it("can set sheep, returns different reference", () => {
    const newBoard = setSheep(testLevel.board, 0, 1, 0);
    expect(newBoard).not.toBe(testLevel.board);
  });

  it("can move sheep, returns different reference", () => {
    const newBoard = setSheep(testLevel.board, 0, 3, 0);
    const movedBoard = moveSheep(newBoard, 0, 3, 1, 0);
    expect(movedBoard).not.toBe(newBoard);
  });

  it("can count how many tiles players have in control", () => {
    const newBoard = setSheep(testLevel.board, 0, 6, 0);
    const again = setSheep(newBoard, 1, 10, 0);
    const onceMore = setSheep(again, 2, 2, 1);

    const result = getPlayersSheepTileAmount(
      onceMore,
      testLevel.sizeX,
      testLevel.sizeY,
    );

    expect(result).toHaveLength(2);
    expect(result).toEqual([2, 1]);
  });
});
