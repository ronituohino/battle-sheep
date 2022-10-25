import { AppState, GameInfo } from "../types";

export type EndGameProps = {
  info: GameInfo | undefined;
  setAppState: (appState: AppState) => void;
};

const texts = {
  "-1": "The game is a tie 👉👈",
  "0": "You win! 🎉🎉",
  "1": "Joshi wins! 👀",
};

export function EndGame({ info, setAppState }: EndGameProps) {
  return (
    <>
      {info !== undefined && info.gameEnded && (
        <div
          css={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <p>Game ended!</p>
          <div>{texts[info.winner]}</div>
          <button onClick={() => setAppState("config")}>Back to config</button>
        </div>
      )}
    </>
  );
}
