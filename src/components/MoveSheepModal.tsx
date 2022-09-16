import type { Move } from "../types";

import { useState } from "react";

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
} from "@chakra-ui/react";

export type MoveSheepModalProps = {
  move: Move | null;
  setMove: (newMove: Move | null) => void;
  makeMove: (amount: number) => void;
};

export function MoveSheepModal({
  move,
  setMove,
  makeMove,
}: MoveSheepModalProps) {
  const [sheepToMove, setSheepToMove] = useState(1);

  return (
    <Modal
      isOpen={move !== null}
      onClose={() => {
        // Reset sheep to move
        setSheepToMove(1);

        setMove(null);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Move sheep</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Slider
            maxWidth="300px"
            marginRight="3"
            min={1}
            max={move?.maxSheep}
            value={sheepToMove}
            onChange={setSheepToMove}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Text>{sheepToMove}</Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={() => {
              // Reset sheep to move
              setSheepToMove(1);

              makeMove(sheepToMove);
            }}
          >
            Move
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
