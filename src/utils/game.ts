/**
 * @file Collection of functions that help with the manipulation of the game board.
 */

import type {
  ConfigSchema,
  Player,
  Coordinate,
  Board,
  Level,
  SheepReadable,
  SheepBoard,
  MovePlot,
} from "./types";
import { levels } from "../levels";

import { copy } from "./copy";

export const playerColors = ["#f15bb5", "#fee440", "#00bbf9", "#9b5de5"];

/**
 * Initializes the game:
 *   Creates players.
 *   Copies level object from levels.ts.
 *
 * @param config The game configuration
 * @returns An object with game information
 */
export function initializeGame(config: ConfigSchema) {
  // Initialize players
  const players: Player[] = [];
  let playerAmount = 0;
  if (!config.watchMode) {
    players.push({
      name: "You",
      color: playerColors[playerAmount],
      human: true,
    });
    playerAmount++;
  }

  for (let i = 0; i < config.aiPlayers; i++) {
    players.push({
      name: `AI ${i}`,
      color: playerColors[playerAmount],
      human: false,
    });
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

/**
 *  Get tiles to which player can move, given a board and a selected tile
 * */
export function getPossibleMovesFromTile(
  board: Board,
  selectedTile: Coordinate,
): Coordinate[] | undefined {
  let boundaries: Coordinate[] | undefined = undefined;

  // Select movement direction
  Object.values(movement).forEach((move) => {
    let boundaryFound = false;
    const [moveX, moveY] = move;
    let [x, y] = selectedTile;

    // Move there until we hit an undefined tile or a sheep (> 0)
    while (!boundaryFound) {
      x += moveX;
      y += moveY;

      const horizontalTiles = board[x];
      if (
        horizontalTiles === undefined ||
        horizontalTiles[y] === undefined ||
        horizontalTiles[y] === -1 ||
        horizontalTiles[y] > 0
      ) {
        boundaryFound = true;

        const boundary = [x - moveX, y - moveY] as [number, number];

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

/**
 * @param board Game board
 * @param playerIndex Player whose sheep are searched
 * @returns Array of sheep objects
 */
export function getSheepFromPlayer(
  board: Board,
  playerIndex: number,
): SheepReadable[] {
  const sheepArr = [];
  for (let x = 0; x < board.length; x++) {
    const column = board[x];
    for (let y = 0; y < column.length; y++) {
      const tile = column[y];
      if (tile > 0) {
        const tileInfo = fromBoardNumber(tile);
        if (tileInfo.playerIndex === playerIndex && tileInfo.sheep > 1) {
          sheepArr.push({ ...tileInfo, coord: [x, y] });
        }
      }
    }
  }
  return sheepArr;
}

/**
 * @param board Game board
 * @param playerIndex Player
 *
 * @returns Array of all possible moves for given player
 */
export function getPossibleMoves(board: Board, playerIndex: number) {
  const moves: MovePlot[] = [];
  const sheepArr = getSheepFromPlayer(board, playerIndex);
  for (let s = 0; s < sheepArr.length; s++) {
    const tile = sheepArr[s];
    // Only handle sheep tiles with a movable amount of sheep
    if (tile.sheep <= 1) {
      continue;
    }

    const possibleMoves = getPossibleMovesFromTile(board, tile.coord);
    if (possibleMoves === undefined) {
      continue;
    }

    for (let m = 0; m < possibleMoves.length; m++) {
      moves.push({
        from: tile.coord,
        to: possibleMoves[m],
        maxSheep: tile.sheep,
      });
    }
  }
  return moves;
}

/**
 * Moves sheep from one tile to another and returns new board
 *
 * @param board Game board
 * @param from The coordinate where to move the sheep from
 * @param to The coordinate where to move the sheep to
 * @param amount The amount of sheep to move
 * @param playerIndex The player to which these sheep belong to
 * @returns A new game board, or undefined if given values are not valid
 */
export function moveSheep(
  board: Board,
  from: Coordinate,
  to: Coordinate,
  amount: number,
  playerIndex: number,
): Board {
  const newBoard = copy(board);
  const { sheep } = fromBoardNumber(newBoard[from[0]][from[1]]);

  newBoard[from[0]][from[1]] = toBoardNumber(sheep - amount, playerIndex);
  newBoard[to[0]][to[1]] = toBoardNumber(amount, playerIndex);

  return newBoard;
}

/**
 * Sets an amount of sheep to board and returns new board
 *
 * @param board Game board
 * @param coord The coordinate where to place the sheep to
 * @param amount The amount of sheep to place
 * @param playerIndex The player to which this tile belongs to
 * @returns A new game board
 */
export function setSheep(
  board: Board,
  coord: Coordinate,
  amount: number,
  playerIndex: number,
): Board {
  const newBoard = copy(board);
  newBoard[coord[0]][coord[1]] = toBoardNumber(amount, playerIndex);
  return newBoard;
}

/**
 * Transform playerIndex and sheep amount (TileInfo) to boardValue
 * player 0, 16 sheep -> 016 -> 16
 * player 1, 5 sheep -> 105
 *
 * @param amount Amount of sheep
 * @param playerIndex The player index
 * @returns A new board value with the above info combined
 */
export function toBoardNumber(amount: number, playerIndex: number): SheepBoard {
  return playerIndex * 100 + amount;
}

/**
 * Transform sheep value from (playerIndex)(sheep) to readable format
 * 016 -> player 0, 16 sheep
 * 105 -> player 1, 5 sheep
 *
 * @param value The board value read from the game board
 * @returns Object with playerIndex [-1, ...], and their sheep amount.
 */
export function fromBoardNumber(value: number) {
  const playerIndex = value > 0 ? Math.floor(value / 100) : -1;
  const sheep = playerIndex >= 0 ? value - playerIndex * 100 : 0;

  return {
    playerIndex,
    sheep,
  };
}
