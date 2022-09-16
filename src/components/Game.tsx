import type {
  AppState,
  ConfigSchema,
  GameState,
  Coordinate,
  CoordinateArray,
  MovePlot,
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
  nextTurn,
} from "../game";

import { Tile } from "../components/Tile";
import { MoveSheepModal } from "../components/MoveSheepModal";
import { Players } from "../components/Players";

export type GameProps = {
  setAppState: (state: AppState) => void;
  config: ConfigSchema;
};

export function Game({ setAppState, config }: GameProps) {
  // Main states
  const [board, setBoard] = useState<Board>();
  const [players, setPlayers] = useState<Player[]>();
  const [game, setGame] = useState<GameState>();

  // UI
  // Tile states
  const [selectedHex, setSelectedHex] = useState<Coordinate>();
  const [highlightedHexes, setHighlightedHexes] = useState<CoordinateArray>();

  // Move sheep modal
  const [move, setMove] = useState<MovePlot>();
  // Called from MoveSheepModal.tsx
  function makeMove(amount: number) {
    if (!move || !board) {
      return;
    }

    setBoard(moveSheep(board, move?.from, move?.to, amount, 0));

    // This closes the modal
    setMove(undefined);

    setHighlightedHexes(undefined);
    setSelectedHex(undefined);

    finishTurn();
  }

  // Tile click handler
  function handleTileClick(
    coords: Coordinate,
    highlighted: boolean,
    selected: boolean,
  ) {
    if (selected || !board || !game || !players) {
      return;
    }

    if (highlighted) {
      if (game.selectingStart) {
        // Selecting starting tile
        setBoard(setSheep(board, coords, 16, 0));

        setHighlightedHexes(undefined);
        finishTurn();
      } else if (selectedHex) {
        // Check if there are sheep to move
        const value = board[selectedHex[0]][selectedHex[1]];
        if (!value) {
          return;
        }

        // Bring up MoveSheepModal
        setMove({
          from: selectedHex,
          to: coords,
          maxSheep: fromBoardNumber(value).sheep - 1,
        });
      }
      return;
    }

    // Select a tile
    const boardValue = board[coords[0]][coords[1]];

    // Check if the tile has more than 1 sheep on it
    if (boardValue > 1) {
      const moves = getPossibleMoveTiles(board, coords);
      setHighlightedHexes(moves);
      setSelectedHex(coords);
    } else {
      // Clear selection
      setHighlightedHexes(undefined);
      setSelectedHex(undefined);
    }
  }

  function finishTurn() {
    if (!board || !game || !players) {
      return;
    }
    const [newGame, newBoard] = nextTurn(board, game, players);
    setGame(newGame);
    setBoard(newBoard);
  }

  // Initialize game
  useEffect(() => {
    const game = initializeGame(config);
    setBoard(game.board);
    setPlayers(game.players);
    setGame({ selectingStart: true });
    setHighlightedHexes(game.startTiles);
  }, []);

  return (
    <Box>
      <Flex gap="4">
        <Button onClick={() => setAppState("config")}>Return</Button>
        <Heading>Battle Sheep</Heading>

        <Players players={players} />
      </Flex>

      {board && game && players && (
        <>
          <Box position="relative" left="50%">
            {board?.map((horizontalHexes, x) =>
              horizontalHexes.map((hex, y) => {
                // -1 means missing tile in map
                if (hex === -1) {
                  return;
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
                  board[x][y] as number,
                );
                return (
                  <Tile
                    key={`${x}${y}`}
                    x={x}
                    y={y}
                    sheep={sheep}
                    color={
                      playerIndex >= 0 ? players[playerIndex].color : "white"
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
        </>
      )}
    </Box>
  );
}
