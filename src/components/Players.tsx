import type { GameState } from "../utils/game";
import { OrderedList, ListItem } from "@chakra-ui/react";

export type PlayersProps = {
  gameState: GameState;
};

export function Players({ gameState }: PlayersProps) {
  return (
    <OrderedList>
      {gameState.players.map((player) => (
        <ListItem key={player.color}>{player.name}</ListItem>
      ))}
    </OrderedList>
  );
}
