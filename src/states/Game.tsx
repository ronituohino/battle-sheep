import { AppState, ConfigSchema } from "../App";

export type GameProps = {
  setAppState: (state: AppState) => void;
  config: ConfigSchema;
};

export function Game({ setAppState, config }: GameProps) {
  return (
    <div>
      <button onClick={() => setAppState("config")}>Return</button>
      <h1>Game</h1>
    </div>
  );
}
