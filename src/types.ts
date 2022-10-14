/**
 * @file Most TypeScript types are defined here. Exceptions are React component prop types.
 */

import { levels } from "./levels";

export type AppState = "config" | "game";

export type Levels = typeof levels;
export type LevelKey = keyof Levels;
export type Level = Levels[LevelKey];

export type ConfigSchema = {
  levelKey: LevelKey;
};

export type GameState = {
  static: GameStateStatic;
  dynamic: GameStateDynamic;
};
export type GameStateStatic = {
  levelName: string;
  boardXSize: number;
  boardYSize: number;
};
export type GameStateDynamic = {
  board: Board;
  info: GameInfo;
};

/**
 * winner -1, means nobody won (tie)
 */
export type GameInfo = {
  startTiles: BoardIndex[];
  selectingStart: boolean;
  gameEnded: boolean;
  winner: -1 | 0 | 1;
};

export type Board = number[];
export type BoardIndex = number;
export type BoardEvaluationPair = [number, Board];
export type BoardValue = number;

export type Coordinate = [number, number];
export type Sheep = number;
export type Player = 0 | 1;

export type MovableSheepTile = [Sheep, BoardIndex];

export type MoveTarget = {
  from: BoardIndex;
  to: BoardIndex;
  maxSheep: Sheep;
};
