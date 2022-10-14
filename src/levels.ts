/**
 * @file Level objects for the game.
 */

export const levels = {
  mixed: {
    name: "Mixed",
    sizeX: 6,
    sizeY: 4,
    board: [
      1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1,
    ],
    startTiles: [0, 1, 2, 3, 6, 12, 18, 19, 20, 14, 15, 10, 16, 23],
    test: false,
  },
  open: {
    name: "Open",
    sizeX: 5,
    sizeY: 5,
    board: [
      1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1,
    ],
    startTiles: [0, 1, 2, 5, 8, 10, 14, 16, 19, 22, 23, 24],
    test: false,
  },
  web: {
    name: "Web",
    sizeX: 6,
    sizeY: 6,
    board: [
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0,
      1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    ],
    startTiles: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    ],
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
