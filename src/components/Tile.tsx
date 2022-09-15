import { fromBoardValue, GameState } from "../utils/game";
import { Text } from "@chakra-ui/react";

export type TileProps = {
  x: number;
  y: number;
  gameState: GameState;
  highlighted: boolean;
  selected: boolean;
  click: () => void;
};

export const Tile = ({
  x,
  y,
  gameState,
  highlighted,
  selected,
  click,
}: TileProps) => {
  let properties = {
    stroke: "black",
    strokeWidth: 5,
  };

  if (highlighted) {
    properties = {
      stroke: "red",
      strokeWidth: 8,
    };
  }

  if (selected) {
    properties = {
      stroke: "green",
      strokeWidth: 10,
    };
  }

  const { playerIndex, sheep } = fromBoardValue(
    gameState.board[x][y] as number
  );

  return (
    <svg
      viewBox="-10 -10 120 120"
      width="100px"
      style={{
        position: "absolute",
        left: `calc(calc(${x} * 100px) - calc(${y} * 50px))`,
        top: `calc(${y} * 80px)`,
      }}
    >
      <g
        style={{ cursor: sheep > 1 || highlighted ? "pointer" : "auto" }}
        onClick={click}
      >
        <polygon
          points="50 0,100 25,100 75, 50 100,0 75,0 25"
          fill={
            playerIndex === -1 ? "white" : gameState.players[playerIndex].color
          }
          {...properties}
        />

        {sheep > 0 && (
          <text
            x="50"
            y="55"
            style={{
              dominantBaseline: "middle",
              textAnchor: "middle",
              fontSize: 30,
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
          >
            {sheep}
          </text>
        )}
      </g>
    </svg>
  );
};
