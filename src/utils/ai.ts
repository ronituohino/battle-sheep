/**
 * @file Collection of functions used to simulate AI in the game.
 */

import {
  fromBoardNumber,
  getPossibleMoves,
  getPossibleMovesFromTile,
  moveSheep,
  setSheep,
} from "./game";
import { getRandomInt } from "./random";
import { Board, Coordinate, GameState, Player } from "./types";

/**
 * Plays the AI turns. Called after the human player's turn ends.
 *
 * @param board Game board
 * @param game Game state
 * @param players Players
 * @returns this kind of array: [newGameState, newBoardState, moved]
 */
export function playAi(
  board: Board,
  game: GameState,
  players: Player[],
): [GameState, Board, boolean[]] {
  let prevBoard = board;
  let newBoard = prevBoard;
  const moved = [];

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    if (player.human) {
      continue;
    }

    // Use AI
    newBoard = simulate(prevBoard, game, i, players.length);

    // simulate returns the same board object reference if it couldn't move
    if (newBoard === prevBoard) {
      moved.push(false);
    } else {
      moved.push(true);
    }

    prevBoard = newBoard;
  }

  // Turn off selectingStart mode
  if (game.selectingStart) {
    game.selectingStart = false;
  }

  return [game, newBoard, moved];
}

/**
 * Simulates a turn for the AI. Returns the new state of the game.
 *
 * @param game Game state
 * @param board  Game board
 * @returns a tuple: [newGameState, newBoardState]
 */
export function simulate(
  board: Board,
  game: GameState,
  playerIndex: number,
  playerAmount: number,
): Board {
  if (game.selectingStart) {
    return setSheep(board, AI_selectStart(game.startTiles), 16, playerIndex);
  }

  const result = minimax(board, 2, playerIndex, playerIndex, playerAmount);
  return result[1];
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
export function minimax(
  board: Board,
  depth: number,
  playerIndex: number,
  handledPlayerIndex: number,
  playerAmount: number,
): [number, Board] {
  /**
   * Valuable moves:
   *  The idea is to first find the AI's sheep
   *  Then list their possible moves (sheep from, sheep to, amount)
   *  Then implement some heuristic to value the new board state after that move
   *  Then take X most valuable boards
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
  const possibleMoves = getPossibleMoves(board, handledPlayerIndex);

  const advantageWithNewBoard: [number, Board][] = [];

  // No possible moves
  if (possibleMoves.length === 0) {
    if (handledPlayerIndex === playerIndex) {
      // If this is the handled AI, bad move (drove itself out of moves)
      return [-100, board];
    } else {
      // If this is another player, really good (no moves for the other player)
      return [100, board];
    }
  }

  // Iterate over all possible moves
  for (let m = 0; m < possibleMoves.length; m++) {
    const move = possibleMoves[m];

    // With all possible sheep amounts...
    for (let s = 1; s < move.maxSheep; s++) {
      const newBoard = moveSheep(
        board,
        move.from,
        move.to,
        s,
        handledPlayerIndex,
      );
      // Always evaluate situation for playerIndex
      let advantage = evaluate(newBoard)[playerIndex];

      if (depth > 0) {
        // Results from DFS
        const result = minimax(
          newBoard,
          depth - 1,
          playerIndex,
          handledPlayerIndex + 1 >= playerAmount ? 0 : handledPlayerIndex + 1,
          playerAmount,
        );

        if (result[0] > advantage) {
          advantage = result[0];
        }
      }

      advantageWithNewBoard.push([advantage, newBoard]);
    }
  }

  // If finding move for player, sort by best, if for opponents, sort by worst
  let sorted = [];
  if (handledPlayerIndex === playerIndex) {
    // Best move
    sorted = advantageWithNewBoard.sort((a, b) => b[0] - a[0]);
  } else {
    // Worst move
    sorted = advantageWithNewBoard.sort((a, b) => a[0] - b[0]);
  }

  return sorted[0];
}

/**
 * Main heuristic for the AI. Evaluates the game board for each player.
 *
 * Advantage formula per sheep tile:
 *  Take the sum of free space in all directions from tile +1.
 *  Take the sheep amount, see if there are excess sheep compared to free space:
 *    any excess sheep negate advantage * 3
 *
 *
 * @param board Game board
 * @returns An array of advantage/value for each player
 */
export function evaluate(board: Board): number[] {
  const advantage: number[] = [];

  // Iterate over all tiles
  for (let x = 0; x < board.length; x++) {
    const column = board[x];
    for (let y = 0; y < column.length; y++) {
      // Tile itself has a value of 1
      let value = 1;
      const tileInfo = fromBoardNumber(column[y]);

      // An empty tile
      if (tileInfo.playerIndex === -1) {
        continue;
      }

      // Free space in all directions of tile
      const moves = getPossibleMovesFromTile(board, [x, y]);
      if (moves) {
        for (let i = 0; i < moves.length; i++) {
          const targetCoord = moves[i];
          const [diffX, diffY] = [
            Math.abs(x - targetCoord[0]),
            Math.abs(y - targetCoord[1]),
          ];
          if (diffX > 0) {
            value += diffX;
          } else {
            value += diffY;
          }
        }
      }

      // Excess sheep reduction, harsh reduction
      if (tileInfo.sheep > value) {
        value -= tileInfo.sheep * 3;
      } else {
        // If sheep are within bounds, add value
        value += tileInfo.sheep;
      }

      advantage[tileInfo.playerIndex] = value;
    }
  }

  return advantage;
}
