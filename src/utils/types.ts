/**
 * @file Most TypeScript types are defined here. Exceptions are React component prop types.
 */

import { levels } from "../levels";

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
  players: Player[];
  levelName: string;
  startTiles: Level["startTiles"];
};
export type GameStateDynamic = {
  board: Board;
  info: GameInfo;
};
export type GameInfo = {
  selectingStart: boolean;
  gameEnded: boolean;
  winner: Player | undefined;
};

export type Player = {
  name: string;
  color: string;
  human: boolean;
};

export type Coordinate = number[];
export type Board = number[][];

export type BoardValuePair = [number, Board];

export type SheepBoard = number;
export type SheepReadable = {
  sheep: number;
  coord: Coordinate;
  playerIndex: number;
};

export type MovePlot = {
  from: Coordinate;
  to: Coordinate;
  maxSheep: number;
};
