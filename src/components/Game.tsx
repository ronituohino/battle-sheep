import type {
  AppState,
  ConfigSchema,
  GameState,
  Coordinate,
  CoordinateArray,
  Move,
  Board,
  Player,
} from "../types";
import { Button, Heading, Flex, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import {
  getPossibleMoveTiles,
  initializeGame,
  moveSheep,
  setSheep,
  fromBoardNumber,
} from "../game";

import { Tile } from "../components/Tile";
import { MoveSheepModal } from "../components/MoveSheepModal";
import { Players } from "../components/Players";

export type GameProps = {
  setAppState: (state: AppState) => void;
  config: ConfigSchema;
};

export function Game({ setAppState, config }: GameProps) {
  // Main state
  const [boardState, setBoardState] = useState<Board | null>(null);
  const [players, setPlayers] = useState<Player[] | null>(null);

  // UI
  // Game state
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Tile states
  const [selectedHex, setSelectedHex] = useState<Coordinate | null>(null);
  const [highlightedHexes, setHighlightedHexes] =
    useState<CoordinateArray | null>(null);

  // Move sheep modal
  const [move, setMove] = useState<Move | null>(null);
  // Called from MoveSheepModal.tsx
  function makeMove(amount: number) {
    if (!move) {
      return;
    }
    const newBoard = moveSheep(boardState, move?.from, move?.to, amount, 0);
    if (newBoard) {
      setBoardState(newBoard);
    }
    // This closes the modal
    setMove(null);

    setHighlightedHexes(null);
    setSelectedHex(null);
  }

  // Tile click handler
  function handleTileClick(
    coords: Coordinate,
    highlighted: boolean,
    selected: boolean,
  ) {
    if (boardState === null || gameState === null) {
      return;
    }
    if (selected) {
      return;
    }
    if (highlighted) {
      if (gameState.selectingStart) {
        // Selecting starting tile
        const newBoard = setSheep(boardState, coords, 16, 0);
        if (newBoard) {
          setBoardState(newBoard);
        }

        setGameState({ selectingStart: false });
        setHighlightedHexes(null);
      } else if (selectedHex !== null) {
        // Make a move
        const value = boardState[selectedHex[0]][selectedHex[1]];
        if (!value) {
          return;
        }

        setMove({
          from: selectedHex,
          to: coords,
          maxSheep: fromBoardNumber(value)["sheep"] - 1,
        });
      }
      return;
    }

    // Select a tile
    const boardValue = boardState[coords[0]][coords[1]];

    // Check if the tile has more than 1 sheep on it
    if (boardValue !== null && boardValue > 1) {
      const moves = getPossibleMoveTiles(boardState, coords);
      setHighlightedHexes(moves);
      setSelectedHex(coords);
    } else {
      // Clear selection
      setHighlightedHexes(null);
      setSelectedHex(null);
    }
  }

  // Initialize game
  useEffect(() => {
    const game = initializeGame(config);
    setBoardState(game.board);
    setPlayers(game.players);
    setHighlightedHexes(game.startTiles);
    setGameState({ selectingStart: true });
  }, []);

  return (
    <Box>
      <Flex gap="4">
        <Button onClick={() => setAppState("config")}>Return</Button>
        <Heading>Battle Sheep</Heading>

        {gameState && <Players players={players} />}
      </Flex>

      <Box position="relative" left="50%">
        {boardState?.map((horizontalHexes, x) =>
          horizontalHexes.map((hex, y) => {
            if (hex === null) {
              return null;
            }
            const highlighted = highlightedHexes
              ? highlightedHexes.some(
                  (coord) => coord[0] === x && coord[1] === y,
                )
              : false;

            const selected = selectedHex
              ? selectedHex[0] === x && selectedHex[1] === y
              : false;

            const { playerIndex, sheep } = fromBoardNumber(
              boardState[x][y] as number,
            );
            return (
              <Tile
                key={`${x}${y}`}
                x={x}
                y={y}
                sheep={sheep}
                color={
                  playerIndex !== -1 && players !== null
                    ? players[playerIndex].color
                    : "white"
                }
                highlighted={highlighted}
                selected={selected}
                click={() => handleTileClick([x, y], highlighted, selected)}
              />
            );
          }),
        )}
      </Box>

      <MoveSheepModal move={move} setMove={setMove} makeMove={makeMove} />
    </Box>
  );
}
