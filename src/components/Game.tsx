import type {
  AppState,
  ConfigSchema,
  GameState,
  Coordinate,
  MovePlot,
  Board,
  Player,
} from "../utils/types";
import { Button, Heading, Flex, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import {
  getPossibleMovesFromTile,
  initializeGame,
  moveSheep,
  setSheep,
  fromBoardNumber,
  nextTurn,
  getPossibleMoves,
} from "../utils/game";

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
  const [highlightedHexes, setHighlightedHexes] = useState<Coordinate[]>();

  // Set this to true to end the player turn
  const [finished, setFinished] = useState(false);
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

    setFinished(true);
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
        setFinished(true);
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
      const moves = getPossibleMovesFromTile(board, coords);
      setHighlightedHexes(moves);
      setSelectedHex(coords);
    } else {
      // Clear selection
      setHighlightedHexes(undefined);
      setSelectedHex(undefined);
    }
  }

  useEffect(() => {
    function finish(board: Board, game: GameState, players: Player[]) {
      const [newGame, newBoard, moved] = nextTurn(board, game, players);

      // If player can't make any move
      if (getPossibleMoves(newBoard, 0).length === 0) {
        // And AI moved last turn
        if (moved.some((v) => v)) {
          // Simulate more AI
          finish(newBoard, newGame, players);
          console.log("finishing ai");
        } else {
          // End game
          console.log("game end");
          setGame({ ...newGame, gameEnded: true });
          setBoard(newBoard);
        }
      } else {
        console.log("regular turn to player");
        setGame(newGame);
        setBoard(newBoard);
      }
    }

    if (finished && board && game && players) {
      finish(board, game, players);
      setFinished(false);
    }
  }, [finished]);

  // Initialize game
  useEffect(() => {
    const game = initializeGame(config);
    setBoard(game.board);
    setPlayers(game.players);
    setGame({
      selectingStart: true,
      startTiles: game.startTiles,
      gameEnded: false,
    });
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
