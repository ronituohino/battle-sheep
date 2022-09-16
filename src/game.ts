/**
 * @file Collection of functions that help with the manipulation of the game board.
 */

import type {
  ConfigSchema,
  Player,
  Coordinate,
  CoordinateArray,
  Board,
  Level,
  GameState,
} from "./types";
import { levels } from "./levels";
import { aiTurn } from "./ai";

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
): CoordinateArray | undefined {
  let boundaries: CoordinateArray | undefined = undefined;

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
  const { sheep } = fromBoardNumber(board[from[0]][from[1]]);

  board[from[0]][from[1]] = toBoardNumber(sheep - amount, playerIndex);
  board[to[0]][to[1]] = toBoardNumber(amount, playerIndex);

  return board;
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
  board[coord[0]][coord[1]] = toBoardNumber(amount, playerIndex);
  return board;
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
export function toBoardNumber(amount: number, playerIndex: number) {
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

/**
 * Plays the AI turns. Called after the human player's turn ends.
 *
 * @param board Game board
 * @param game Game state
 * @param players Players
 * @returns this kind of array: [newGameState, newBoardState]
 */
export function nextTurn(
  board: Board,
  game: GameState,
  players: Player[],
): [GameState, Board] {
  for (let i = 1; i < players.length; i++) {
    // Use AI
    // board = aiTurn(game, board, players, i);
  }

  // Turn off selectingStart mode
  if (game.selectingStart) {
    game.selectingStart = false;
  }

  return [game, board];
}
