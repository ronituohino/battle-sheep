/**
 * @file Level objects for the game.
 */

export const levels = {
  first: {
    name: "First level",
    sizeX: 6,
    sizeY: 4,
    board: [
      1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1,
    ],
    startTiles: [0, 1, 2, 3, 6, 12, 18, 19, 20, 14, 15, 10, 16, 23],
    test: false,
  },
  test: {
    name: "Test level, fresh",
    sizeX: 6,
    sizeY: 4,
    board: [
      1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1,
    ],
    startTiles: [0, 1, 2, 3, 6, 12, 18, 19, 20, 14, 15, 10, 16, 23],
    test: true,
  },
  testStarted: {
    name: "Test level where both players have started",
    sizeX: 6,
    sizeY: 4,
    board: [
      17, 1, 1, 33, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1,
    ],
    startTiles: [0, 1, 2, 3, 6, 12, 18, 19, 20, 14, 15, 10, 16, 23],
    test: true,
  },
  testFull: {
    name: "Test level filled with player sheep",
    sizeX: 6,
    sizeY: 4,
    board: [
      2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 0, 2,
    ],
    startTiles: [0, 1, 2, 3, 6, 12, 18, 19, 20, 14, 15, 10, 16, 23],
    test: true,
  },
};
