import {
  Button,
  Heading,
  Flex,
  Box,
  useDisclosure,
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
import { useState } from "react";

import { AppState, ConfigSchema } from "../App";
import {
  Coordinate,
  CoordinateArray,
  GameState,
  getPossibleMoveTiles,
  initializeGameState,
} from "../utils/game";

import { Tile } from "../components/Tile";

export type GameProps = {
  setAppState: (state: AppState) => void;
  config: ConfigSchema;
};

export function Game({ setAppState, config }: GameProps) {
  const [gameState, setGameState] = useState<GameState>(
    initializeGameState(config)
  );

  // Tile states
  const [selectedHex, setSelectedHex] = useState<Coordinate | undefined>(
    undefined
  );
  const [highlightedHexes, setHighlightedHexes] = useState<
    CoordinateArray | undefined
  >(gameState.startTiles);

  // Move sheep modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sheepToMove, setSheepToMove] = useState(1);

  function handleTileClick(coords: Coordinate, highlighted: boolean) {
    if (highlighted) {
      if (gameState.selectingStart) {
        // Selecting starting tile
        const newBoard = [...gameState.board];
        newBoard[coords[0]][coords[1]] = 16;

        setGameState({ ...gameState, board: newBoard, selectingStart: false });
        setHighlightedHexes(undefined);
      } else {
        // Make a move
        onOpen();
      }
    } else {
      const moves = getPossibleMoveTiles(gameState.board, coords);
      setHighlightedHexes(moves);
      setSelectedHex(coords);
    }
  }

  return (
    <Box>
      <Flex gap="4">
        <Button onClick={() => setAppState("config")}>Return</Button>
        <Heading>Battle Sheep</Heading>
      </Flex>

      <Box position="relative" left="50%">
        {gameState.board.map((horizontalHexes, x) =>
          horizontalHexes.map((hex, y) => {
            if (hex === undefined) {
              return undefined;
            }
            const highlighted = highlightedHexes
              ? highlightedHexes.some(coord => coord[0] === x && coord[1] === y)
              : false;

            const selected = selectedHex
              ? selectedHex[0] === x && selectedHex[1] === y
              : false;
            return (
              <Tile
                key={`${x}${y}`}
                x={x}
                y={y}
                highlighted={highlighted}
                selected={selected}
                click={() => handleTileClick([x, y], highlighted)}
              />
            );
          })
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Move sheep</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Slider
              maxWidth="300px"
              marginRight="3"
              min={1}
              max={3}
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
            <Button colorScheme="blue" onClick={onClose}>
              Move
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
