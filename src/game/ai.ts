/**
 * @file Collection of functions used to simulate AI in the game.
 */

import {
  boardValueToPlayerIndex,
  boardValueToSheepAmount,
  getPossibleMoveTargets,
  getPossibleMovesFromTile,
  moveSheep,
  setSheep,
  indexToCoordinate,
} from "./game";
import { getRandomInt } from "../utils/random";
import {
  Board,
  BoardEvaluationPair,
  GameStateDynamic,
  MoveTarget,
  Sheep,
} from "../types";

const GOOD = 100000;
const BAD = -100000;

/**
 * Simulates a turn for the AI.
 *
 * @param board  Game board
 * @param boardXSize Game board horizontal size
 * @param boardYSize Game board vertical size
 * @param depth How many levels do we generate the game tree to?
 * @param selectingStart Are we still selecting start
 * @param startTiles If we are selecting start, what tiles can be selected?
 * @returns a tuple: [newBoard, moved], moved tells if AI could make a move
 */
export function simulate(
  board: Board,
  boardXSize: number,
  boardYSize: number,
  depth: number,
  selectingStart: GameStateDynamic["info"]["selectingStart"] = false,
  startTiles: GameStateDynamic["info"]["startTiles"] = [],
): [Board, boolean] {
  let moved = false;
  let newBoard;

  if (selectingStart && startTiles !== undefined) {
    // The start tile is just chosen randomly
    newBoard = setSheep(
      board,
      startTiles[getRandomInt(startTiles.length)],
      16,
      1,
    );
  } else {
    // The moves after start are found using minimax + alpha-beta
    newBoard = alphabeta(
      board,
      boardXSize,
      boardYSize,
      depth,
      BAD,
      GOOD,
      true,
    )[1];
  }

  // if AI couldn't move, newBoard has same reference as board
  if (newBoard !== board) {
    moved = true;
  }

  return [newBoard, moved];
}

/**
 * Main AI function in the project. Moves sheep on the board for the AI.
 *
 * @param board Game board
 * @param boardXSize Game board horizontal size
 * @param boardYSize Game board vertical size
 * @param depth The depth to which we compute minimax
 * @param a Alpha value used in alpha-beta pruning
 * @param b Beta value used in alpha-beta pruning
 * @param maximizing True for AI, False for human
 *
 * @returns Advantage value and new board
 */
function alphabeta(
  board: Board,
  boardXSize: number,
  boardYSize: number,
  depth: number,
  a: number,
  b: number,
  maximizing: boolean,
): BoardEvaluationPair {
  const currentPlayer = maximizing ? 1 : 0;
  const moveTargets = getPossibleMoveTargets(
    board,
    boardXSize,
    boardYSize,
    currentPlayer,
  );

  // Win/Lose check, add depth to values to prioritise early wins
  if (moveTargets.length === 0) {
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
    const evaluation = evaluate(board, boardXSize, boardYSize);
    return [evaluation, board];
  }

  const moves: [MoveTarget, Sheep[]][] = [];

  // First, create list of targets with their sheep amounts
  // Iterate over all possible moves
  for (let m = 0; m < moveTargets.length; m++) {
    const target = moveTargets[m];
    const sheepList: Sheep[] = [];

    // With all possible sheep amounts...
    /**
     * Iterate from half sheep amount, go up 1, down 2, up 3...
     * e.g. maxSheep: 8 -> 4-5-3-6-2-7-1
     * e.g. maxSheep: 7 -> 3-4-2-5-1-6
     */
    let s = target.maxSheep === 1 ? 1 : Math.floor(target.maxSheep / 2);
    let i = 1;
    while (s > 0 && s <= target.maxSheep) {
      sheepList.push(s);

      s += i;
      if (i > 0) {
        i += 1;
      } else {
        i -= 1;
      }
      i *= -1;
    }
    moves.push([target, sheepList]);
  }

  // Initialize each evaluation with the worst possible value, to encourage the AI to make some move
  let curValue = maximizing ? BAD : GOOD;
  let curBoard = board;

  /**
   * Then traverse over this array optimally and call next alphabeta
   *
   * The moves array looks like this:
   * [
   * {from, to, maxSheep = 7}[4, 3, 5, 2, 6, 1, 7]
   * {from, to, maxSheep = 2}[1, 2]
   * {from, to, maxSheep = 4}[2, 1, 4, 3]
   * ]
   *
   * We want to go over each move and try the first sheep amount,
   * Then go over all of the moves again with the second sheep amount,
   * and so on...
   */
  let moveIndex = -1;
  const movesHandled = Array(moves.length).fill(0);
  const sheepIndexes = Array(moves.length).fill(0); // Array with moves.length amount of 0

  let allDone = false;
  let allDoneCounter = 0;
  while (!allDone) {
    // Traverse logic
    moveIndex += 1;
    if (moveIndex >= moves.length) {
      moveIndex = 0;
    }
    if (movesHandled[moveIndex] === 1) {
      allDoneCounter += 1;
      if (allDoneCounter >= moves.length) {
        allDone = true;
      }
      continue;
    }
    const move = moves[moveIndex];
    const sheepIndex = sheepIndexes[moveIndex];

    const sheepAmounts = move[1];
    if (sheepIndex >= sheepAmounts.length) {
      movesHandled[moveIndex] = 1;
      continue;
    }
    sheepIndexes[moveIndex] += 1;
    const sheep = sheepAmounts[sheepIndex];
    const target = move[0];

    // Make the move and get the new board state
    const newBoard = moveSheep(
      board,
      target.from,
      target.to,
      sheep,
      currentPlayer,
    );

    // Minimax + alpha-beta
    if (maximizing) {
      const [res] = alphabeta(
        newBoard,
        boardXSize,
        boardYSize,
        depth - 1,
        a,
        b,
        false,
      );

      if (res > curValue) {
        curValue = res;
        curBoard = newBoard;
      }

      // beta cutoff
      if (curValue >= b) {
        break;
      }
      a = Math.max(a, curValue);
    } else {
      const [res] = alphabeta(
        newBoard,
        boardXSize,
        boardYSize,
        depth - 1,
        a,
        b,
        true,
      );

      if (res < curValue) {
        curValue = res;
        curBoard = newBoard;
      }

      // alpha cutoff
      if (curValue <= a) {
        break;
      }
      b = Math.min(b, curValue);
    }
  }

  return [curValue, curBoard];
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
 * @param boardXSize Game board horizontal size
 * @param boardYSize Game board vertical size
 * @returns The board advantage (negative values means player 0 has advantage, positive values mean player 1 has advantage)
 */
function evaluate(
  board: Board,
  boardXSize: number,
  boardYSize: number,
): number {
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
    const moves = getPossibleMovesFromTile(board, boardXSize, boardYSize, i);

    if (moves) {
      const [x, y] = indexToCoordinate(i, boardXSize);
      for (let m = 0; m < moves.length; m++) {
        const targetCoord = indexToCoordinate(moves[m], boardXSize);

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

    // If we are AI, add value, if this is for the player, negate value
    const player = boardValueToPlayerIndex(boardValue);
    if (player === 1) {
      advantage += value;
    } else {
      advantage -= value;
    }
  }
  return advantage;
}
