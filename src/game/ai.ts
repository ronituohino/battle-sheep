/**
 * @file Collection of functions used to simulate AI in the game.
 */

import {
  boardValueToPlayerIndex,
  boardValueToSheepAmount,
  getPossibleMoves,
  getPossibleMovesFromTile,
  moveSheep,
  setSheep,
  fbi,
} from "./game";
import { getRandomInt } from "../utils/random";
import {
  Board,
  BoardEvaluationPair,
  BoardIndex,
  GameStateDynamic,
  MovePlot,
} from "../types";

const GOOD = 100000;
const BAD = -100000;

/**
 * Simulates a turn for the AI.
 *
 * @param board  Game board
 * @param selectingStart Are we still selecting start
 * @param startTiles If we are selecting start, what tiles can be selected?
 * @returns a tuple: [newBoard, moved], moved tells if AI could make a move
 */
export function simulate(
  board: Board,
  boardXSize: number,
  boardYSize: number,
  selectingStart: GameStateDynamic["info"]["selectingStart"] = false,
  startTiles: GameStateDynamic["info"]["startTiles"] = [],
): [Board, boolean] {
  let moved = false;
  let newBoard;

  if (selectingStart && startTiles !== undefined) {
    newBoard = setSheep(board, selectStart(startTiles), 16, 1);
  } else {
    newBoard = alphabeta(
      board,
      boardXSize,
      boardYSize,
      5,
      BAD,
      GOOD,
      1,
      true,
      getPossibleMoves(board, boardXSize, boardYSize, 1),
    )[1];
  }

  // if AI couldn't move, newBoard has same reference as board
  if (newBoard !== board) {
    moved = true;
  }

  return [newBoard, moved];
}

/**
 * In the first turn of the game, choose a starting point.
 * @todo Implement heuristic
 */
function selectStart(startTiles: BoardIndex[]): BoardIndex {
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
  boardXSize: number,
  boardYSize: number,
  depth: number,
  a: number,
  b: number,
  currentPlayer: number,
  maximizing: boolean,
  possibleMoves: MovePlot[],
): BoardEvaluationPair {
  // Win/Lose check, add depth to values to prioritise early wins
  if (possibleMoves.length === 0) {
    if (maximizing) {
      // If this is the handled AI, bad move (drove itself out of moves)
      // + depth, to prioritize late losses
      return [BAD + depth, board];
    } else {
      // If this is another player, really good (no moves for the other player)
      // + depth, to prioritize early wins
      return [GOOD + depth, board];
    }
  }

  // If no win/lose, and on bottom depth, use heuristic to evaluate sitation
  if (depth === 0) {
    const evaluation = evaluate(board, boardXSize);
    return [evaluation, board];
  }

  let value: BoardEvaluationPair = [maximizing ? BAD : GOOD, board];

  // Iterate over all possible moves
  for (let m = 0; m < possibleMoves.length; m++) {
    const move = possibleMoves[m];

    // With all possible sheep amounts...
    /**
     * Iterate from half sheep amount, go up 1, down 2, up 3...
     * e.g. maxSheep: 8 -> 4-5-3-6-2-7-1
     * e.g. maxSheep: 7 -> 3-4-2-5-1-6
     */
    let s = move.maxSheep === 1 ? 1 : Math.floor(move.maxSheep / 2);
    let i = 1;
    while (s > 0 && s <= move.maxSheep) {
      const newBoard = moveSheep(board, move.from, move.to, s, currentPlayer);
      const nextPlayer = nextPlayerIndex(currentPlayer);
      const nextMoves = getPossibleMoves(
        newBoard,
        boardXSize,
        boardYSize,
        nextPlayer,
      );

      if (maximizing) {
        const res = alphabeta(
          newBoard,
          boardXSize,
          boardYSize,
          depth - 1,
          a,
          b,
          nextPlayer,
          false,
          nextMoves,
        );
        if (res[0] > value[0]) {
          value = [res[0], newBoard];
        }

        // beta cutoff
        if (value[0] >= b) {
          break;
        }
        a = Math.max(a, value[0]);
      } else {
        const res = alphabeta(
          newBoard,
          boardXSize,
          boardYSize,
          depth - 1,
          a,
          b,
          nextPlayer,
          true,
          nextMoves,
        );
        if (res[0] < value[0]) {
          value = [res[0], newBoard];
        }

        // alpha cutoff
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
  return index === 0 ? 1 : 0;
}

/**
 * Main heuristic for the AI. Evaluates the game board for each player.
 *
 * Advantage formula per sheep tile:
 *  Take the sum of free space in all directions from tile +1.
 *  Take the sheep amount, see if there are excess sheep compared to free space:
 *    any excess sheep negate advantage * 3
 *
 * @param board Game board
 * @returns The board advantage (negative values means player 0 has advantage, positive values mean player 1 has advantage)
 */
export function evaluate(board: Board, boardXSize: number): number {
  let advantage = 0;

  // Iterate over all tiles
  for (let i = 0; i < board.length; i++) {
    const boardValue = board[i];

    // An empty tile
    if (boardValue < 2) {
      continue;
    }

    // Tile itself has a value of 1
    let value = 1;

    // Free space in all directions of tile
    const moves = getPossibleMovesFromTile(board, boardXSize, i);

    if (moves) {
      const [x, y] = fbi(i, boardXSize);
      for (let m = 0; m < moves.length; m++) {
        const targetCoord = fbi(moves[m], boardXSize);

        const diffX = Math.abs(x - targetCoord[0]);
        const diffY = Math.abs(y - targetCoord[1]);

        if (diffX > 0) {
          value += diffX;
        } else {
          value += diffY;
        }
      }
    }

    const sheep = boardValueToSheepAmount(boardValue);

    // Excess sheep reduction, harsh reduction
    if (sheep > value) {
      value -= sheep * 3;
    } else {
      // If sheep are within bounds, add value
      value += sheep;
    }

    const player = boardValueToPlayerIndex(boardValue);
    if (player === 1) {
      advantage += value;
    } else {
      advantage -= value;
    }
  }
  return advantage;
}
