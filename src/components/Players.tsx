import { OrderedList, ListItem } from "@chakra-ui/react";

export function Players() {
  return (
    <OrderedList>
      <ListItem key={"you"}>{"You"}</ListItem>
      <ListItem key={"ai"}>{"AI"}</ListItem>
    </OrderedList>
  );
}
