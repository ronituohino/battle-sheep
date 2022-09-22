/**
 * @file Collection of functions used to simulate AI in the game.
 */

import {
  getPossibleMoves,
  getPossibleMovesFromTile,
  moveSheep,
  setSheep,
} from "./game";
import { getRandomInt } from "./random";
import { AIMove, Board, Coordinate, GameState } from "./types";

/**
 * Simulates a turn for the AI. Returns the new state of the game.
 *
 * @param game Game state
 * @param board  Game board
 * @returns a tuple: [newGameState, newBoardState]
 */
export function aiTurn(
  game: GameState,
  board: Board,
  playerIndex: number,
): Board {
  if (game.selectingStart) {
    return setSheep(board, AI_selectStart(game.startTiles), 16, playerIndex);
  }

  const move = AI_moveSheep(board, playerIndex);
  if (!move) {
    return board;
  }
  return moveSheep(board, move.from, move.to, move.amount, playerIndex);
}

/**
 * In the first turn of the game, choose a starting point.
 *
 * @param board Game board
 * @param players Players
 * @returns Coordinate where to place the first 16 sheep
 *
 * @todo Implement heuristic
 */
function AI_selectStart(startTiles: Coordinate[]): Coordinate {
  return startTiles[getRandomInt(startTiles.length)];
}

/**
 * Main AI function in the project. Moves sheep on the board for the AI.
 *
 * @param board Game board
 * @param players Players
 * @returns An AIMove object, which contains the Coordinates from and to, and sheep amount.
 */
export function AI_moveSheep(
  board: Board,
  playerIndex: number,
): AIMove | undefined {
  /**
   * Valuable moves:
   *  The idea is to first find the AI's sheep
   *  Then list their possible moves (sheep from, sheep to, amount)
   *  Then implement some heuristic to value each move
   *  Then take X most valuable moves
   *
   * Minimax:
   *  Before making the move, take the AI's X most valuable moves, and start building a tree.
   *   - AI takes move x1: use Valuable moves algorithm for the player's moves and use a heuristic to evaluate the board situation.
   *   - AI takes move x2: again see what Valuable moves the player could take and evaluate the board situation.
   *
   *  After building this tree to Y depth, find the most optimal move for the AI.
   *
   * Optimization:
   *  The Minimax algorithm could be optimized by alpha-beta pruning...
   */

  // Find all possible moves, and evaluate the amount of sheep to move
  const possibleMoves = getPossibleMoves(board, playerIndex);

  if (possibleMoves.length === 0) {
    return;
  }

  const move = possibleMoves[getRandomInt(possibleMoves.length)];
  return {
    from: move.from,
    to: move.to,
    amount: getRandomInt(move.maxSheep - 1) + 1,
  };
}

/**
 * Main heuristic for the AI.
 *
 * @param board Game board
 * @returns Value that represents how valuable tile at coord is.
 *
 * Right now returns the amount of free tiles connected in a straight line in any direction.
 *
 * Values calculated from this could be put into a LUT for the current player.
 */
export function tileValue(board: Board, coord: Coordinate): number {
  const moves = getPossibleMovesFromTile(board, coord);
  if (!moves) {
    return 0;
  }

  let total = 0;
  for (let i = 0; i < moves.length; i++) {
    const targetCoord = moves[i];
    const [diffX, diffY] = [
      Math.abs(coord[0] - targetCoord[0]),
      Math.abs(coord[1] - targetCoord[1]),
    ];
    if (diffX > 0) {
      total += diffX;
    } else {
      total += diffY;
    }
  }
  return total;
}
