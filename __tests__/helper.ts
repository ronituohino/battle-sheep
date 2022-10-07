import { simulate } from "../src/utils/ai";
import { setSheep } from "../src/utils/game";
import { Board, GameState, Player } from "../src/utils/types";

export function simulateTurns(
  board: Board,
  game: GameState,
  players: Player[],
  turns: number,
) {
  let result: [GameState, Board, boolean[]] = [game, board, []];

  for (let i = 0; i < turns; i++) {
    result = simulate(result[1], result[0], players);
  }

  return result;
}

export function fillBoard(
  board: Board,
  playerIndex: number,
  sheepAmount: number,
) {
  // Fill board with 1 sheep for player 0
  let newBoard = board;
  for (let x = 0; x < board.length; x++) {
    const column = board[x];
    for (let y = 0; y < column.length; y++) {
      newBoard = setSheep(newBoard, [x, y], sheepAmount, playerIndex);
    }
  }

  return newBoard;
}
