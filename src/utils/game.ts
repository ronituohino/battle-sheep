import { ConfigSchema } from "../App";

export type GameState = {
  players: Player[];
  sizeX: number;
  sizeY: number;
  board: TileArray;
  selectingStart: boolean;
  startTiles: CoordinateArray;
};

export type Player = {
  name: string;
  color: string;
};

export type Coordinate = number[];
export type CoordinateArray = Coordinate[];

export type TileArray = (number | undefined)[][];

export const playerColors = ["#f15bb5", "#fee440", "#00bbf9", "#9b5de5"];
export const levels = {
  one: {
    name: "One",
    sizeX: 4,
    sizeY: 6,
    board: [
      [0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, undefined, 0, 0, 0],
      [0, 0, 0, undefined, undefined, 0],
    ],
    startTiles: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 4],
      [2, 4],
      [3, 5],
      [2, 3],
      [2, 2],
      [3, 2],
      [3, 1],
    ],
  },
  two: { name: "Two", sizeX: 1, sizeY: 1, board: [[0]], startTiles: [[0, 0]] },
};

export const movement = {
  northEast: [0, 1],
  east: [1, 0],
  southEast: [1, 1],
  southWest: [0, -1],
  west: [-1, 0],
  northWest: [-1, -1],
};

export function initializeGameState(config: ConfigSchema): GameState {
  // Initialize players
  let players: Player[] = [];
  let playerAmount = 0;
  if (config.watchMode) {
    players.push({ name: "You", color: playerColors[playerAmount] });
    playerAmount++;
  }

  for (let i = 0; i < config.aiPlayers; i++) {
    players.push({ name: `AI ${i}`, color: playerColors[playerAmount] });
    playerAmount++;
  }

  // Initialize board
  const level = levels[config.level];

  return {
    players,
    sizeX: level.sizeX,
    sizeY: level.sizeY,
    board: level.board,
    selectingStart: true,
    startTiles: level.startTiles,
  };
}

/**
 *  Return tiles that are on the edge of the board
 *  This isn't as straightforward as I thought lol, gonna do this manually per map for now
 *
 *  export function getBoardEdges(board: Board): [[number, number]] {}
 * */

// Get tiles to which player can move, given a board and a selected tile
export function getPossibleMoveTiles(
  board: TileArray,
  selectedTile: Coordinate
): CoordinateArray | undefined {
  let boundaries: [[number, number]] | undefined = undefined;

  // Select movement direction
  Object.values(movement).forEach(move => {
    let boundaryFound = false;
    let coords = [selectedTile[0], selectedTile[1]];

    // Move there until we hit an undefined tile or a sheep (!== 0)
    while (!boundaryFound) {
      coords[0] += move[0];
      coords[1] += move[1];

      const vertical = board[coords[0]];
      if (!vertical || vertical[coords[1]] !== 0) {
        boundaryFound = true;

        const boundary = [coords[0] - move[0], coords[1] - move[1]] as [
          number,
          number
        ];

        // Don't add the currently selected tile to the boundaries
        if (
          !(boundary[0] === selectedTile[0] && boundary[1] === selectedTile[1])
        ) {
          // Found a boundary tile
          if (!boundaries) {
            boundaries = [boundary];
          } else {
            boundaries.push(boundary);
          }
        }
      }
    }
  });

  return boundaries;
}
