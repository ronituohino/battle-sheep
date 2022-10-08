/**
 * @file Collection of functions that help with the manipulation of the game board.
 */

import type {
  ConfigSchema,
  Player,
  BoardIndex,
  Board,
  MovePlot,
  GameState,
  GameStateDynamic,
  Sheep,
  MovableSheepTile,
  BoardValue,
  Coordinate,
} from "../types";
import { levels } from "../levels";

import { copy } from "../utils/copy";

/**
 * Initializes the game:
 *   Creates players.
 *   Copies level object from levels.ts.
 *
 * @param config The game configuration
 * @returns An object with game information
 */
export function initializeGame(config: ConfigSchema): GameState {
  // Deep copy level object
  const level = copy(levels[config.levelKey]);

  return {
    static: {
      levelName: level.name,
      boardXSize: level.sizeX,
      boardYSize: level.sizeY,
    },
    dynamic: {
      board: level.board,
      info: {
        startTiles: level.startTiles,
        selectingStart: true,
        gameEnded: false,
        winner: -1,
      },
    },
  };
}

const movement = {
  north: [0, 1],
  east: [1, 0],
  southEast: [1, 1],
  south: [0, -1],
  west: [-1, 0],
  northWest: [-1, -1],
};

/**
 * Get tiles to which sheep can move from a tile
 * */
export function getPossibleMovesFromTile(
  board: Board,
  boardXSize: number,
  selectedTile: BoardIndex,
): BoardIndex[] {
  const boundaries: BoardIndex[] = [];
  const boardLength = board.length;

  // Select movement direction
  Object.values(movement).forEach((move) => {
    let boundaryFound = false;
    const [moveX, moveY] = move;

    let previousIndex = selectedTile;
    let selectedIndex = selectedTile;

    // Move there until we hit a missing (0) tile or empty tile (1) or a sheep (> 1)
    while (!boundaryFound) {
      previousIndex = selectedIndex;
      selectedIndex += moveX + moveY * boardXSize;

      if (selectedIndex < 0 || selectedIndex > boardLength) {
        found();
      } else {
        const value = board[selectedIndex];
        if (value !== 1) {
          found();
        }
      }
    }

    function found() {
      boundaryFound = true;
      // Don't add the currently selected tile to the boundaries
      if (previousIndex !== selectedTile) {
        boundaries.push(previousIndex);
      }
    }
  });

  return boundaries;
}

/**
 * Get all sheep from a player
 *
 * @param board Game board
 * @param playerIndex Player whose sheep are searched
 * @returns Array of sheep objects
 */
export function getMovableSheepFromPlayer(
  board: Board,
  boardXSize: number,
  boardYSize: number,
  playerIndex: Player,
): MovableSheepTile[] {
  const movableSheepTiles = [] as MovableSheepTile[];
  for (let x = 0; x < boardXSize; x++) {
    for (let y = 0; y < boardYSize; y++) {
      const boardIndex = tbi(x, y, boardXSize);
      const value = board[boardIndex];
      if (boardValueHasSheep(value)) {
        const player = boardValueToPlayerIndex(value);
        const sheep = boardValueToSheepAmount(value);

        if (player === playerIndex && sheep > 1) {
          movableSheepTiles.push([sheep - 1, boardIndex]);
        }
      }
    }
  }
  return movableSheepTiles;
}

/**
 * @param board Game board
 * @param playerIndex Player
 *
 * @returns Array of all possible moves for given player
 */
export function getPossibleMoves(
  board: Board,
  boardXSize: number,
  boardYSize: number,
  playerIndex: Player,
) {
  const moves: MovePlot[] = [];
  const movableSheepTiles = getMovableSheepFromPlayer(
    board,
    boardXSize,
    boardYSize,
    playerIndex,
  );
  for (let s = 0; s < movableSheepTiles.length; s++) {
    const [sheep, coord] = movableSheepTiles[s];

    const possibleMoves = getPossibleMovesFromTile(board, boardXSize, coord);

    for (let m = 0; m < possibleMoves.length; m++) {
      moves.push({
        from: coord,
        to: possibleMoves[m],
        maxSheep: sheep,
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
  from: BoardIndex,
  to: BoardIndex,
  amount: Sheep,
  playerIndex: Player,
): Board {
  const newBoard = copy(board);
  const sheep = boardValueToSheepAmount(newBoard[from]);

  newBoard[from] = toBoardValue(sheep - amount, playerIndex);
  newBoard[to] = toBoardValue(amount, playerIndex);

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
  coord: BoardIndex,
  amount: Sheep,
  playerIndex: Player,
): Board {
  const newBoard = copy(board);
  newBoard[coord] = toBoardValue(amount, playerIndex);
  return newBoard;
}

/**
 * Returns an array of the amount of tiles players have in control
 *
 * @param board Game board
 */
export function getPlayersSheepTileAmount(board: Board): [Sheep, Sheep] {
  let playerSheep = 0;
  let aiSheep = 0;

  for (let i = 0; i < board.length; i++) {
    const value = board[i];
    if (boardValueHasSheep(value)) {
      const player = boardValueToPlayerIndex(value);
      if (player === 0) {
        playerSheep++;
      } else {
        aiSheep++;
      }
    }
  }

  return [playerSheep, aiSheep];
}

export function getWinner(board: Board): GameStateDynamic["info"]["winner"] {
  const sheepAmounts = getPlayersSheepTileAmount(board);

  const isTie = sheepAmounts[0] === sheepAmounts[1];
  const winner = sheepAmounts[0] > sheepAmounts[1] ? 0 : 1;

  // If threre are two occurrences of the biggest value, game is a tie, otherwise a single winner
  return isTie ? -1 : winner;
}

export function tbi(x: number, y: number, xSize: number) {
  return y * xSize + x;
}

export function fbi(boardCoord: BoardIndex, xSize: number): Coordinate {
  const x = boardCoord % xSize;
  const y = (boardCoord - x) / xSize;
  return [x, y];
}

export function boardValueHasSheep(value: BoardValue) {
  return value > 1;
}

export function toBoardValue(
  sheepAmount: Sheep,
  playerIndex: Player,
): BoardValue {
  return sheepAmount + playerIndex * 16 + 1;
}

export function boardValueToSheepAmount(value: BoardValue): Sheep {
  return ((value - 2) % 16) + 1;
}

export function boardValueToPlayerIndex(value: BoardValue): Player {
  return Math.floor((value - 2) / 16);
}
