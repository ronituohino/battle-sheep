import type { MoveTarget } from "../types";

import { useState } from "react";
import { isNumeric } from "../utils/regex";

export type MoveSheepProps = {
  move: MoveTarget | undefined;
  setMove: (newMove: MoveTarget | undefined) => void;
  makeMove: (amount: number) => void;
};

export function MoveSheep({ move, setMove, makeMove }: MoveSheepProps) {
  const [sheepToMove, setSheepToMove] = useState<string>("1");
  const [moveValid, setMoveValid] = useState(true);

  const enabled = move !== undefined;
  return (
    <div
      css={{
        opacity: enabled ? 1 : 0.5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <p>Move</p>
      <input
        type="number"
        value={sheepToMove}
        onChange={(e) => {
          if (move === undefined) {
            return;
          }
          setSheepToMove(e.target.value);

          // Input validation
          const val = e.target.value.trim();
          if (val.length > 0 && isNumeric(val)) {
            const parsed = parseInt(val, 10);
            setMoveValid(parsed > 0 && parsed <= move.maxSheep);
            return;
          }
          setMoveValid(false);
        }}
        css={{ pointerEvents: enabled ? "all" : "none" }}
      ></input>
      <div css={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => {
            if (moveValid) {
              makeMove(parseInt(sheepToMove));
            }

            // Reset sheep to move
            setSheepToMove("1");
            setMoveValid(true);
          }}
          css={
            !enabled || !moveValid
              ? {
                  backgroundColor: "gray",
                  "&:hover": {
                    backgroundColor: "gray",
                  },
                }
              : {}
          }
        >
          Move
        </button>
        <button
          onClick={() => {
            // Reset sheep to move
            setSheepToMove("1");
            setMoveValid(true);
            setMove(undefined);
          }}
          css={
            !enabled
              ? {
                  backgroundColor: "gray",
                  "&:hover": {
                    backgroundColor: "gray",
                  },
                }
              : {}
          }
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
