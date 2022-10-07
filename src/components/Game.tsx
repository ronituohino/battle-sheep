import {
  AppState,
  ConfigSchema,
  BoardIndex,
  MovePlot,
  Board,
  GameStateStatic,
  GameInfo,
  GameStateDynamic,
} from "../utils/types";
import { Button, Heading, Flex, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import {
  getPossibleMovesFromTile,
  initializeGame,
  moveSheep,
  setSheep,
  getPossibleMoves,
  getWinner,
  boardValueToPlayerIndex,
  boardValueToSheepAmount,
  fromBoardCoordinate,
} from "../utils/game";
import { simulate } from "../utils/ai";

import { Tile } from "../components/Tile";
import { MoveSheepModal } from "../components/MoveSheepModal";
import { Players } from "../components/Players";
import { EndGame } from "./EndGame";

export type GameProps = {
  setAppState: (state: AppState) => void;
  config: ConfigSchema;
};

export function Game({ setAppState, config }: GameProps) {
  // Main states
  const [gameStatic, setGameStatic] = useState<GameStateStatic>();
  const [board, setBoard] = useState<Board>();
  const [info, setInfo] = useState<GameInfo>();
  const initDone =
    gameStatic !== undefined && board !== undefined && info !== undefined;

  // UI
  // Tile states
  const [selectedHex, setSelectedHex] = useState<BoardIndex>();
  const [highlightedHexes, setHighlightedHexes] = useState<BoardIndex[]>();

  // Set this to true to end the player turn
  const [finished, setFinished] = useState(false);
  // Move sheep modal
  const [move, setMove] = useState<MovePlot>();
  // Called from MoveSheepModal.tsx
  function makeMove(amount: number) {
    if (!move || !initDone) {
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
    index: BoardIndex,
    highlighted: boolean,
    selected: boolean,
  ) {
    if (selected || !initDone) {
      return;
    }

    if (highlighted) {
      if (info.selectingStart) {
        // Selecting starting tile
        setBoard(setSheep(board, index, 16, 0));

        setHighlightedHexes(undefined);
        setFinished(true);
      } else if (selectedHex) {
        // Check if there are sheep to move
        const value = board[selectedHex];

        // Bring up MoveSheepModal
        setMove({
          from: selectedHex,
          to: index,
          maxSheep: boardValueToSheepAmount(value),
        });
      }
      return;
    }

    // Select a tile
    const boardValue = board[index];

    // Check if the tile has more than 1 sheep on it and it's owned by player
    if (
      boardValueToSheepAmount(boardValue) > 1 &&
      boardValueToPlayerIndex(boardValue) === 0
    ) {
      const moves = getPossibleMovesFromTile(
        board,
        gameStatic.boardXSize,
        index,
      );
      setHighlightedHexes(moves);
      setSelectedHex(index);
    } else {
      // Clear selection
      setHighlightedHexes(undefined);
      setSelectedHex(undefined);
    }
  }

  // Called after the human player ends their turn
  useEffect(() => {
    function nextAiTurn(
      board: Board,
      boardXSize: number,
      boardYSize: number,
      selectingStart: GameStateDynamic["info"]["selectingStart"],
      startTiles: GameStateStatic["startTiles"],
    ) {
      const [newBoard, moved] = simulate(
        board,
        boardXSize,
        boardYSize,
        selectingStart,
        startTiles,
      );

      // If player can't make any move
      if (getPossibleMoves(newBoard, boardXSize, boardYSize, 0).length === 0) {
        // And AI can't move
        if (!moved) {
          // End game
          const winner = getWinner(board, boardXSize, boardYSize);

          setInfo({ gameEnded: true, selectingStart: false, winner });
          setBoard(newBoard);
        } else {
          nextAiTurn(
            newBoard,
            boardXSize,
            boardYSize,
            selectingStart,
            startTiles,
          );
        }
      } else {
        setInfo({ gameEnded: false, selectingStart: false, winner: -1 });
        setBoard(newBoard);
      }
    }

    if (finished && initDone) {
      nextAiTurn(
        board,
        gameStatic.boardXSize,
        gameStatic.boardYSize,
        info.selectingStart,
        gameStatic.startTiles,
      );
      setFinished(false);
    }
  }, [finished]);

  // Initialize game
  useEffect(() => {
    const game = initializeGame(config);
    setGameStatic(game.static);
    setBoard(game.dynamic.board);
    setInfo(game.dynamic.info);

    setHighlightedHexes(game.static.startTiles);
  }, []);

  // Game board rendering
  const tiles: JSX.Element[] = [];

  if (initDone) {
    board?.forEach((value, index) => {
      // 0 means missing tile in map
      if (value === 0) {
        return 0;
      }

      const highlighted = highlightedHexes
        ? highlightedHexes.includes(index)
        : false;
      const selected = selectedHex === index;

      const player = boardValueToPlayerIndex(value);
      const sheep = boardValueToSheepAmount(value);

      const isPlayerSheep = player === 0;
      const [x, y] = fromBoardCoordinate(index, gameStatic?.boardXSize);

      tiles.push(
        <Tile
          key={`${value}-${index}`}
          x={x}
          y={y}
          sheep={sheep}
          color={["#f15bb5", "#fee440"][player]}
          highlighted={highlighted}
          selected={selected}
          clickable={highlighted || (sheep > 1 && isPlayerSheep)}
          click={() => handleTileClick(index, highlighted, selected)}
        />,
      );
    });
  }

  return (
    <Box>
      <Flex gap="4">
        <Button onClick={() => setAppState("config")}>Return</Button>
        <Heading>Battle Sheep</Heading>

        <Players />
      </Flex>

      {initDone && (
        <>
          <Box position="relative" left="50%">
            {tiles}
          </Box>
          <MoveSheepModal move={move} setMove={setMove} makeMove={makeMove} />
          <EndGame
            gameEnded={info.gameEnded}
            winner={info.winner}
            setAppState={setAppState}
          />
        </>
      )}
    </Box>
  );
}
