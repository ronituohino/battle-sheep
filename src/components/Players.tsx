import type { Player } from "../types";
import { OrderedList, ListItem } from "@chakra-ui/react";

export type PlayersProps = {
  players: Player[] | null;
};

export function Players({ players }: PlayersProps) {
  return (
    <OrderedList>
      {players?.map((player) => (
        <ListItem key={player.color}>{player.name}</ListItem>
      ))}
    </OrderedList>
  );
}
