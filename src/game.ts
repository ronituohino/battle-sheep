import type {
  ConfigSchema,
  Player,
  Coordinate,
  CoordinateArray,
  Board,
  Level,
} from "./types";
import { levels } from "./levels";

export const playerColors = ["#f15bb5", "#fee440", "#00bbf9", "#9b5de5"];

export function initializeGame(config: ConfigSchema) {
  // Initialize players
  const players: Player[] = [];
  let playerAmount = 0;
  if (!config.watchMode) {
    players.push({ name: "You", color: playerColors[playerAmount] });
    playerAmount++;
  }

  for (let i = 0; i < config.aiPlayers; i++) {
    players.push({ name: `AI ${i}`, color: playerColors[playerAmount] });
    playerAmount++;
  }

  // Deep copy level object
  const level = JSON.parse(JSON.stringify(levels[config.levelName])) as Level;

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

export const movement = {
  northEast: [0, 1],
  east: [1, 0],
  southEast: [1, 1],
  southWest: [0, -1],
  west: [-1, 0],
  northWest: [-1, -1],
};

// Get tiles to which player can move, given a board and a selected tile
export function getPossibleMoveTiles(
  board: Board,
  selectedTile: Coordinate,
): CoordinateArray | null {
  let boundaries: CoordinateArray | null = null;

  // Select movement direction
  Object.values(movement).forEach((move) => {
    let boundaryFound = false;
    const coords = [selectedTile[0], selectedTile[1]];

    // Move there until we hit an null tile or a sheep (!== 0)
    while (!boundaryFound) {
      coords[0] += move[0];
      coords[1] += move[1];

      const vertical = board[coords[0]];
      if (!vertical || vertical[coords[1]] !== 0) {
        boundaryFound = true;

        const boundary = [coords[0] - move[0], coords[1] - move[1]] as [
          number,
          number,
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

// Moves sheep from one tile to another and return new board
export function moveSheep(
  board: Board | null,
  from: Coordinate | null,
  to: Coordinate | null,
  amount: number,
  playerIndex: number,
): Board | undefined {
  if (board === null || from === null || to === null) {
    return;
  }

  const newBoard = [...board];
  const previous = newBoard[from[0]][from[1]];
  if (previous === null || previous <= amount) {
    return;
  }

  newBoard[from[0]][from[1]] = toBoardNumber(previous - amount, playerIndex);
  newBoard[to[0]][to[1]] = toBoardNumber(amount, playerIndex);

  return newBoard;
}

// Set an amount of sheep to board and return new board
export function setSheep(
  board: Board | null,
  coord: Coordinate,
  amount: number,
  playerIndex: number,
): Board | undefined {
  if (board === null) {
    return;
  }

  const newBoard = [...board];
  newBoard[coord[0]][coord[1]] = toBoardNumber(amount, playerIndex);

  return newBoard;
}

/**
 * Transform playerIndex and sheep amount (TileInfo) to boardValue
 * player 0, 16 sheep -> 016 -> 16
 * player 1, 5 sheep -> 105
 * */
export function toBoardNumber(amount: number, playerIndex: number) {
  return playerIndex * 100 + amount;
}

/**
 * Transform sheep value from (playerIndex)(sheep) to readable format
 * 016 -> player 0, 16 sheep
 * 105 -> player 1, 5 sheep
 * */
export function fromBoardNumber(value: number) {
  const playerIndex = value > 0 ? Math.floor(value / 100) : -1;
  const sheep = value > 0 ? value - playerIndex * 100 : 0;

  return {
    playerIndex,
    sheep,
  };
}
