import { AppState, GameStateDynamic } from "../types";

export type EndGameProps = {
  gameEnded: boolean;
  winner: GameStateDynamic["info"]["winner"];
  setAppState: (appState: AppState) => void;
};

export function EndGame({ gameEnded, winner, setAppState }: EndGameProps) {
  return (
    <>
      {gameEnded && (
        <>
          <p>Game ended!</p>

          {winner === -1 ? (
            <p>The game is a tie!</p>
          ) : (
            <p>{winner === 0 ? "You win!" : "Joshi wins!"}</p>
          )}

          <button onClick={() => setAppState("config")}>Back to config</button>
        </>
      )}
    </>
  );
}
