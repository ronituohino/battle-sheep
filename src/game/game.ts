/**
 * @file Collection of functions that help with the manipulation of the game board.
 */

import type {
  ConfigSchema,
  Player,
  BoardIndex,
  Board,
  MoveTarget,
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
 * Initializes the game.
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

const movement = [
  [0, 1], //north
  [1, 0], //east
  [1, 1], //southEast
  [0, -1], //south
  [-1, 0], //west
  [-1, -1], //northWest
] as const;

/**
 * Get tiles to which sheep can move to from given tile
 *
 * @param board The game board
 * @param boardXSize The horizontal size of the game board
 * @param selectedTile The index which we want the moves to be looked from
 * */
export function getPossibleMovesFromTile(
  board: Board,
  boardXSize: number,
  boardYSize: number,
  selectedTile: BoardIndex,
): BoardIndex[] {
  const boundaries: BoardIndex[] = [];

  // Select movement direction
  for (let i = 0; i < 6; i++) {
    let [x, y] = indexToCoordinate(selectedTile, boardXSize);
    const [moveX, moveY] = movement[i];

    let boundaryFound = false;
    let previousIndex = selectedTile;

    // Move there until we hit a missing (0) tile or a sheep (> 1)
    while (!boundaryFound) {
      x += moveX;
      y += moveY;

      const index = coordinateToIndex(x, y, boardXSize);

      if (
        x < 0 ||
        y < 0 ||
        x >= boardXSize ||
        y >= boardYSize ||
        board[index] !== 1
      ) {
        boundaryFound = true;
        // Don't add the currently selected tile to the boundaries
        if (previousIndex !== selectedTile) {
          boundaries.push(previousIndex);
        }
      }

      previousIndex = index;
    }
  }

  return boundaries;
}

/**
 * Get all sheep from a player.
 *
 * @param board Game board
 * @param playerIndex Player whose sheep are searched
 * @returns Array of sheep objects
 */
export function getTilesMoreThanOneSheepFromPlayer(
  board: Board,
  playerIndex: Player,
): MovableSheepTile[] {
  const movableSheepTiles = [] as MovableSheepTile[];
  for (let i = 0; i < board.length; i++) {
    const value = board[i];
    if (value > 1) {
      const player = boardValueToPlayerIndex(value);
      const sheep = boardValueToSheepAmount(value);

      if (player === playerIndex && sheep > 1) {
        movableSheepTiles.push([sheep - 1, i]);
      }
    }
  }
  return movableSheepTiles;
}

/**
 * @param board Game board
 * @param boardXSize The game board horizontal size
 * @param playerIndex Player
 * @returns Array of all possible moves for given player
 */
export function getPossibleMoveTargets(
  board: Board,
  boardXSize: number,
  boardYSize: number,
  playerIndex: Player,
) {
  const moves: MoveTarget[] = [];
  const movableSheepTiles = getTilesMoreThanOneSheepFromPlayer(
    board,
    playerIndex,
  );
  for (let s = 0; s < movableSheepTiles.length; s++) {
    const [sheep, index] = movableSheepTiles[s];

    const possibleMoves = getPossibleMovesFromTile(
      board,
      boardXSize,
      boardYSize,
      index,
    );

    for (let m = 0; m < possibleMoves.length; m++) {
      moves.push({
        from: index,
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
 * @param fromIndex The coordinate where to move the sheep from
 * @param toIndex The coordinate where to move the sheep to
 * @param amount The amount of sheep to move
 * @param playerIndex The player to which these sheep belong to
 * @returns A new game board, or undefined if given values are not valid
 */
export function moveSheep(
  board: Board,
  fromIndex: BoardIndex,
  toIndex: BoardIndex,
  amount: Sheep,
  playerIndex: Player,
): Board {
  const newBoard = copy(board);
  const sheep = boardValueToSheepAmount(newBoard[fromIndex]);

  newBoard[fromIndex] = toBoardValue(sheep - amount, playerIndex);
  newBoard[toIndex] = toBoardValue(amount, playerIndex);

  return newBoard;
}

/**
 * Sets an amount of sheep to board and returns new board
 *
 * @param board Game board
 * @param index The boardIndex where to place the sheep to
 * @param amount The amount of sheep to place
 * @param playerIndex The player to which this tile belongs to
 * @returns A new game board
 */
export function setSheep(
  board: Board,
  index: BoardIndex,
  amount: Sheep,
  playerIndex: Player,
): Board {
  const newBoard = copy(board);
  newBoard[index] = toBoardValue(amount, playerIndex);
  return newBoard;
}

/**
 * @param board Game board
 * @returns A tuple: how many tiles each player controls
 */
export function getPlayersSheepTileAmount(board: Board): [Sheep, Sheep] {
  let playerSheep = 0;
  let aiSheep = 0;

  for (let i = 0; i < board.length; i++) {
    const value = board[i];
    if (value > 1) {
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

/**
 * @param board The game board
 * @returns -1 if the game is a tie, 0 if player 0 is winner, 1 if player 1 is winner
 */
export function getWinner(board: Board): GameStateDynamic["info"]["winner"] {
  const sheepAmounts = getPlayersSheepTileAmount(board);

  const isTie = sheepAmounts[0] === sheepAmounts[1];
  const winner = sheepAmounts[0] > sheepAmounts[1] ? 0 : 1;

  // If threre are two occurrences of the biggest value, game is a tie, otherwise a single winner
  return isTie ? -1 : winner;
}

/**
 * Transform a coordinate to an index on a board object
 *
 * @param x X coordinate
 * @param y Y coordinate
 * @param xSize Board horizontal size
 * @returns Index representation of the x/y coordinate
 */
export function coordinateToIndex(
  x: number,
  y: number,
  xSize: number,
): BoardIndex {
  return y * xSize + x;
}

/**
 * Transform an index on a board object to a coordinate
 *
 * @param index An index on the game board
 * @param xSize Board horizontal size
 * @returns Coordinate representation of the board index
 */
export function indexToCoordinate(
  index: BoardIndex,
  xSize: number,
): Coordinate {
  const x = index % xSize;
  const y = (index - x) / xSize;
  return [x, y];
}

/**
 * @param sheepAmount The amount of sheep to place
 * @param playerIndex The player who these sheep belong to
 * @returns A boardValue which contains the given info
 */
export function toBoardValue(
  sheepAmount: Sheep,
  playerIndex: Player,
): BoardValue {
  return sheepAmount + playerIndex * 16 + 1;
}

/**
 * @param value A boardValue
 * @returns The sheep amount in given board value
 */
export function boardValueToSheepAmount(value: BoardValue): Sheep {
  return ((value - 2) % 16) + 1;
}

/**
 * @param value A boardValue
 * @returns The player who this tile belongs to
 */
export function boardValueToPlayerIndex(value: BoardValue): Player {
  return Math.floor((value - 2) / 16) as Player;
}
