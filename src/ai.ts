/**
 * @file Collection of functions used to simulate AI in the game.
 */

import { moveSheep, setSheep } from "./game";
import { AIMove, Board, Coordinate, GameState, Player } from "./types";

/**
 * Simulates a turn for the AI. Returns the new state of the game.
 *
 * @param game Game state
 * @param board  Game board
 * @param players Players
 * @returns a tuple: [newGameState, newBoardState]
 */
export function aiTurn(
  game: GameState,
  board: Board,
  players: Player[],
  playerIndex: number,
): Board {
  if (game.selectingStart) {
    board = setSheep(board, AI_selectStart(board, players), 16, playerIndex);
  } else {
    const move = AI_moveSheep(board, players);
    board = moveSheep(board, move.from, move.to, move.amount, playerIndex);
  }

  return board;
}

/**
 * In the first turn of the game, choose a starting point.
 *
 * @param board Game board
 * @param players Players
 * @returns Coordinate where to place the first 16 sheep
 */
function AI_selectStart(board: Board, players: Player[]): Coordinate {
  return [0, 0];
}

/**
 * Main AI function in the project. Moves sheep on the board for the AI.
 *
 * @param board Game board
 * @param players Players
 * @returns An AIMove object, which contains the Coordinates from and to, and sheep amount.
 */
function AI_moveSheep(board: Board, players: Player[]): AIMove {
  return {
    from: [0, 0],
    to: [3, 0],
    amount: 14,
  };
}
