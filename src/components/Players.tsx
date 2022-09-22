import type { Player } from "../utils/types";
import { OrderedList, ListItem } from "@chakra-ui/react";

export type PlayersProps = {
  players: Player[] | undefined;
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
