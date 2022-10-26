/**
 * @file Level objects for the game.
 */

export const levels = {
  // Game levels
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

  // Test levels
  // Mixed
  test: {
    name: "Test level, mixed",
    sizeX: 6,
    sizeY: 4,
    board: [
      1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1,
    ],
    startTiles: [0, 1, 2, 3, 6, 12, 18, 19, 20, 14, 15, 10, 16, 23],
    test: true,
  },
  testStarted: {
    name: "Test level, mixed, where both players have started",
    sizeX: 6,
    sizeY: 4,
    board: [
      17, 1, 1, 33, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1,
    ],
    startTiles: [0, 1, 2, 3, 6, 12, 18, 19, 20, 14, 15, 10, 16, 23],
    test: true,
  },
  testFull: {
    name: "Test level, mixed, filled with player sheep",
    sizeX: 6,
    sizeY: 4,
    board: [
      2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 0, 2,
    ],
    startTiles: [0, 1, 2, 3, 6, 12, 18, 19, 20, 14, 15, 10, 16, 23],
    test: true,
  },

  // Open
  testOpen: {
    name: "Test level, open",
    sizeX: 5,
    sizeY: 5,
    board: [
      1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1,
    ],
    startTiles: [0, 1, 2, 5, 8, 10, 14, 16, 19, 22, 23, 24],
    test: true,
  },
  testOpenStarted: {
    name: "Test level, open, both players have started",
    sizeX: 5,
    sizeY: 5,
    board: [
      1, 17, 1, 0, 0, 1, 1, 1, 1, 0, 33, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1,
      1,
    ],
    startTiles: [0, 1, 2, 5, 8, 10, 14, 16, 19, 22, 23, 24],
    test: true,
  },

  // Alphabeta validity tests
  testAlphabeta1: {
    name: "Test level, ai should choose winning move 1",
    sizeX: 4,
    sizeY: 2,
    board: [
      33, 1, 1, 17,
      1, 0, 0, 0,
    ],
    startTiles: [],
    test: true
  },
  testAlphabeta2: {
    name: "Test level, ai should choose winning move 2",
    sizeX: 3,
    sizeY: 3,
    board: [
      33, 1, 0, 
      1, 1, 0,
      0, 0, 17
    ],
    startTiles: [],
    test: true
  },
  testAlphabeta3: {
    name: "Test level, ai should choose winning move 3",
    sizeX: 5,
    sizeY: 5,
    board: [
      33, 1, 1, 1, 
      0, 1, 0, 17,
      0, 0, 1, 1,
      0, 0, 0, 1
    ],
    startTiles: [],
    test: true
  },
  testAlphabeta4: {
    name: "Test level, ai should choose winning move 4",
    sizeX: 3,
    sizeY: 5,
    board: [1, 0, 0, 1, 0, 0, 33, 1, 17, 0, 1, 0, 0, 0, 1],
    startTiles: [],
    test: true,
  },
  testAlphabeta5: {
    name: "Test level, ai should choose winning move 5",
    sizeX: 5,
    sizeY: 5,
    board: [
      1, 33, 17, 0, 0, 
      1, 33, 1, 1, 0, 
      1, 1, 33, 1, 1, 
      0, 1, 1, 1, 1, 
      0, 0, 1, 1, 33,
    ],
    startTiles: [],
    test: true,
  },

  // Basic heuristic tests
  testMovement: {
    name: "Test level, ai should move to open space",
    sizeX: 3,
    sizeY: 5,
    board: [1, 1, 0, 1, 1, 1, 0, 1, 17, 0, 33, 0, 0, 1, 1],
    startTiles: [],
    test: true,
  },
};
