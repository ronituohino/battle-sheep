/**
 * @file Level objects for the game.
 */
export const levels = {
  one: {
    name: "One",
    sizeX: 6,
    sizeY: 4,
    board: [
      1, 1, 1, 1, 0, 0, 
      1, 1, 1, 1, 1, 0, 
      1, 0, 1, 1, 1, 0, 
      1, 1, 1, 0, 0, 1,
    ],
    startTiles: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 3],
      [2, 3],
      [2, 2],
      [3, 2],
      [4, 1],
      [4, 2],
      [5, 3],
    ],
  },
};
