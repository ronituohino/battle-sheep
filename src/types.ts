/**
 * @file Most TypeScript types are defined here. Exceptions are React component prop types.
 */

import { levels } from "./levels";

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
};

export type Player = {
  name: string;
  color: string;
};

export type Coordinate = number[];
export type CoordinateArray = Coordinate[];

export type Board = number[][];

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

// TS exhaustive type check (on switch statements)
export function assertUnreachable(x: never): never {
  throw new Error(`Oops, this should never be called! ${x}`);
}
