/**
 * @file Most TypeScript types are defined here. Exceptions are React component prop types.
 */

import { levels } from "../levels";

export type AppState = "config" | "game";

export type Levels = typeof levels;
export type LevelName = keyof Levels;
export type Level = Levels[LevelName];

export type ConfigSchema = {
  levelName: LevelName;
  watchMode: boolean;
  aiPlayers: number;
};

export type GameState = {
  selectingStart: boolean;
  startTiles: Coordinate[];
  gameEnded: boolean;
};

export type Player = {
  name: string;
  color: string;
};

export type Coordinate = number[];
export type Board = number[][];

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

export type AIMove = {
  from: Coordinate;
  to: Coordinate;
  amount: number;
};
export type AIPlot = {
  from: Coordinate;
  to: Coordinate;
  fromValue: number;
  toValue: number;
};

// TS exhaustive type check (on switch statements)
export function assertUnreachable(x: never): never {
  throw new Error(`Oops, this should never be called! ${x}`);
}
