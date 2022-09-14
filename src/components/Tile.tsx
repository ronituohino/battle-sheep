import type { GameState } from "../utils/game";
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

  return (
    <>
      <svg
        viewBox="-10 -10 120 120"
        width="150px"
        style={{
          position: "absolute",
          left: `calc(calc(${x} * 140px) - calc(${y} * 70px))`,
          top: `calc(${y} * 105px)`,
        }}
      >
        <g style={{ cursor: "pointer" }} onClick={click}>
          <polygon
            points="50 0,100 25,100 75, 50 100,0 75,0 25"
            fill="white"
            {...properties}
          />
          <text x="50" y="50">
            {gameState.board[x][y]}
          </text>
        </g>
      </svg>
    </>
  );
};
