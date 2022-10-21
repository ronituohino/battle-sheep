export function Players() {
  const nameStyle = {
    padding: 8,
    paddingLeft: 16,
    paddingRight: 20,
    paddingTop: 12,
    borderRadius: 50,
  };
  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <span css={{ backgroundColor: "#34eb46", ...nameStyle }}>You</span>
      <span
        css={{
          backgroundColor: "#1e6341",
          ...nameStyle,
        }}
      >
        Joshi
      </span>
    </div>
  );
}
