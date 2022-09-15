import { Button, Heading, Flex, Box } from "@chakra-ui/react";
import { useState } from "react";

import { AppState, ConfigSchema } from "../App";
import {
  Coordinate,
  CoordinateArray,
  GameState,
  getPossibleMoveTiles,
  initializeGameState,
  moveSheep,
} from "../utils/game";

import { Tile } from "../components/Tile";
import { MoveSheepModal } from "../components/MoveSheepModal";
import { Players } from "../components/Players";

export type GameProps = {
  setAppState: (state: AppState) => void;
  config: ConfigSchema;
};

export type Move = {
  from: Coordinate | null;
  to: Coordinate;
};

export function Game({ setAppState, config }: GameProps) {
  const [gameState, setGameState] = useState<GameState>(() =>
    initializeGameState(config)
  );

  // Tile states
  const [selectedHex, setSelectedHex] = useState<Coordinate | null>(null);
  const [highlightedHexes, setHighlightedHexes] =
    useState<CoordinateArray | null>(gameState.startTiles);

  // Move sheep modal
  const [move, setMove] = useState<Move | null>(null);
  function makeMove(amount: number) {
    if (!move) {
      return;
    }
    moveSheep(gameState, setGameState, move?.from, move?.to, amount, 0);
    setMove(null);
    setHighlightedHexes(null);
    setSelectedHex(null);
  }

  function handleTileClick(
    coords: Coordinate,
    highlighted: boolean,
    selected: boolean
  ) {
    if (selected) {
      return;
    }

    if (highlighted) {
      if (gameState.selectingStart) {
        // Selecting starting tile
        const newBoard = [...gameState.board];
        newBoard[coords[0]][coords[1]] = 16;

        setGameState({ ...gameState, board: newBoard, selectingStart: false });
        setHighlightedHexes(null);
      } else {
        // Make a move
        setMove({ from: selectedHex, to: coords });
      }
      return;
    }

    // Select a tile
    const boardValue = gameState.board[coords[0]][coords[1]];

    // Check if the tile has more than 1 sheep on it
    if (boardValue !== null && boardValue > 1) {
      const moves = getPossibleMoveTiles(gameState.board, coords);
      setHighlightedHexes(moves);
      setSelectedHex(coords);
    } else {
      // Clear selection
      setHighlightedHexes(null);
      setSelectedHex(null);
    }
  }

  return (
    <Box>
      <Flex gap="4">
        <Button onClick={() => setAppState("config")}>Return</Button>
        <Heading>Battle Sheep</Heading>

        {gameState && <Players gameState={gameState} />}
      </Flex>

      <Box position="relative" left="50%">
        {gameState.board.map((horizontalHexes, x) =>
          horizontalHexes.map((hex, y) => {
            if (hex === null) {
              return null;
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
                gameState={gameState}
                highlighted={highlighted}
                selected={selected}
                click={() => handleTileClick([x, y], highlighted, selected)}
              />
            );
          })
        )}
      </Box>

      <MoveSheepModal move={move} setMove={setMove} makeMove={makeMove} />
    </Box>
  );
}
