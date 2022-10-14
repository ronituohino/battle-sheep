import { Button, Text } from "@chakra-ui/react";
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
          <Text>Game ended!</Text>

          {winner === -1 ? (
            <Text>The game is a tie!</Text>
          ) : (
            <Text>{winner === 0 ? "You win!" : "The AI wins."}</Text>
          )}

          <Button onClick={() => setAppState("config")}>Back to config</Button>
        </>
      )}
    </>
  );
}
