export type TileProps = {
  x: number;
  y: number;
  sheep: number;
  color: string;
  highlighted: boolean;
  selected: boolean;
  moving: boolean;
  clickable: boolean;
  click: () => void;
  uiMultiplier: number;
};

export function Tile({
  x,
  y,
  sheep,
  color,
  highlighted,
  selected,
  moving,
  clickable,
  click,
  uiMultiplier,
}: TileProps) {
  let properties = { stroke: "transparent", strokeWidth: 5 };

  if (highlighted) {
    properties = {
      stroke: "#a85a00",
      strokeWidth: 5,
    };
  }

  if (selected) {
    properties = {
      stroke: "#a85a00",
      strokeWidth: 8,
    };
  }

  if (moving) {
    properties = {
      stroke: "#1c03fc",
      strokeWidth: 8,
    };
  }

  return (
    <svg
      viewBox="-10 -10 120 120"
      width={uiMultiplier * 100}
      css={{
        position: "absolute",
        left: `calc(calc(${x * uiMultiplier} * 95px) - calc(${
          y * uiMultiplier
        } * 47.5px))`,
        top: `calc(${y * uiMultiplier} * 75px)`,
      }}
    >
      <g
        css={{ cursor: clickable ? "pointer" : "auto" }}
        onClick={() => {
          if (clickable) {
            click();
          }
        }}
      >
        <polygon
          points="50 0,100 25,100 75, 50 100,0 75,0 25"
          fill={color}
          {...properties}
          css={{
            transition: "all 0.15s",
          }}
        />

        {sheep > 0 ? (
          <text
            x="45"
            y="55"
            css={{
              dominantBaseline: "middle",
              textAnchor: "middle",
              fontSize: 55,
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
          >
            {sheep}
          </text>
        ) : (
          <image x="20" y="20" href="/hay.png" />
        )}
      </g>
    </svg>
  );
}
