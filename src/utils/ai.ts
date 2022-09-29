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
import { Board, BoardValuePair, Coordinate, GameState, Player } from "./types";

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
    newBoard = simulate(prevBoard, game, i);

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

const GOOD = 100000;
const BAD = -100000;

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
): Board {
  if (game.selectingStart) {
    return setSheep(board, AI_selectStart(game.startTiles), 16, playerIndex);
  }

  const result = alphabeta(board, 4, BAD, GOOD, playerIndex, playerIndex, true);
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
 * @param depth The depth to which we compute minimax
 * @param a Alpha value
 * @param b Beta value
 * @param currentPlayer The current playerIndex we are computing for (0 or 1)
 * @param maximizing If we want to maximize advantage for this player
 *
 * @returns Advantage value and new board
 */
export function alphabeta(
  board: Board,
  depth: number,
  a: number,
  b: number,
  aiPlayer: number,
  currentPlayer: number,
  maximizing: boolean,
): BoardValuePair {
  // Find all possible move origin-target pairs
  const possibleMoves = getPossibleMoves(board, currentPlayer);

  // Win/Lose check, add depth to values to prioritise early wins
  if (possibleMoves.length === 0) {
    if (maximizing) {
      // If this is the handled AI, bad move (drove itself out of moves)
      return [BAD - depth, board];
    } else {
      // If this is another player, really good (no moves for the other player)
      return [GOOD + depth, board];
    }
  }

  // If no win/lose, and on bottom depth, use heuristic to evaluate sitation
  if (depth === 0) {
    return [evaluate(board, aiPlayer), board];
  }

  let value: BoardValuePair = [maximizing ? BAD : GOOD, board];

  // Iterate over all possible moves
  for (let m = 0; m < possibleMoves.length; m++) {
    const move = possibleMoves[m];

    // With all possible sheep amounts...
    /**
     * Iterate from half sheep amount, go up 1, down 2, up 3...
     * e.g. maxSheep: 8 -> 4-5-3-6-2-7-1
     * e.g. maxSheep: 7 -> 3-4-2-5-1-6
     */
    let s = Math.floor(move.maxSheep / 2);
    let i = 1;
    while (s > 0 && s < move.maxSheep) {
      const newBoard = moveSheep(board, move.from, move.to, s, currentPlayer);

      if (maximizing) {
        const res = alphabeta(
          newBoard,
          depth - 1,
          a,
          b,
          aiPlayer,
          nextPlayerIndex(currentPlayer),
          false,
        );
        if (res[0] > value[0]) {
          value = [res[0], newBoard];
        }
        if (value[0] >= b) {
          break;
        }
        a = Math.max(a, value[0]);
      } else {
        const res = alphabeta(
          newBoard,
          depth - 1,
          a,
          b,
          aiPlayer,
          nextPlayerIndex(currentPlayer),
          true,
        );
        if (res[0] < value[0]) {
          value = [res[0], newBoard];
        }
        if (value[0] <= a) {
          break;
        }
        b = Math.min(b, value[0]);
      }

      s += i;
      if (i > 0) {
        i += 1;
      } else {
        i -= 1;
      }
      i *= -1;
    }
  }

  return value;
}

function nextPlayerIndex(index: number) {
  if (index === 0) {
    return 1;
  }
  return 0;
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
 * @returns The board advantage (negative values means player 0 has advantage, positive values mean player 1 has advantage)
 */
export function evaluate(board: Board, aiPlayer: number): number {
  let advantage = 0;

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

      if (tileInfo.playerIndex === aiPlayer) {
        advantage += value;
      } else {
        advantage -= value;
      }
    }
  }

  return advantage;
}