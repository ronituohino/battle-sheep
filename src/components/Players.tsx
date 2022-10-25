import type { Theme } from "@emotion/react";

const nameStyle = {
  padding: 8,
  paddingLeft: 16,
  paddingRight: 20,
  paddingTop: 12,
  borderRadius: 50,
  marginTop: 8,
  textAlign: "center",
} as Theme;

export function Players() {
  return (
    <div>
      <p>Players</p>
      <div css={{ backgroundColor: "#34eb46", ...nameStyle }}>You</div>
      <div
        css={{
          backgroundColor: "#1e6341",
          ...nameStyle,
        }}
      >
        Joshi
      </div>
    </div>
  );
}
