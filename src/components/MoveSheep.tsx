import type { MoveTarget } from "../types";

import { useState } from "react";

export type MoveSheepProps = {
  move: MoveTarget | undefined;
  setMove: (newMove: MoveTarget | undefined) => void;
  makeMove: (amount: number) => void;
};

export function MoveSheep({ move, setMove, makeMove }: MoveSheepProps) {
  const [sheepToMove, setSheepToMove] = useState(1);

  return (
    <div
      css={{
        display: move !== undefined ? "flex" : "none",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <input
        type="number"
        value={sheepToMove}
        onChange={(e) => {
          if (move === undefined) {
            return;
          }

          const amount = parseInt(e.target.value);
          if (amount > 0 && amount <= move.maxSheep) {
            setSheepToMove(amount);
          }
        }}
      ></input>
      <div>
        <button
          onClick={() => {
            // Reset sheep to move
            setSheepToMove(1);
            makeMove(sheepToMove);
          }}
        >
          Move
        </button>
        <button
          onClick={() => {
            // Reset sheep to move
            setSheepToMove(1);
            setMove(undefined);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
