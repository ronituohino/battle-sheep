import type { AppState, ConfigSchema } from "../types";

import { useFormik } from "formik";
import { useState } from "react";

import { Config } from "./Config";
import { Game } from "./Game";
import { Global, css } from "@emotion/react";

export function App() {
  const [appState, setAppState] = useState<AppState>("config");

  const initialValues: ConfigSchema = {
    levelKey: "mixed",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: () => {
      setAppState("game");
    },
  });

  const appStates = {
    config: <Config formik={formik} />,
    game: <Game setAppState={setAppState} config={formik.values} />,
  } as const;

  return (
    <>
      <Global
        styles={css`
          body {
            background-image: url("/cloud.png");
          }

          body,
          input,
          select,
          button {
            font-family: "Spork", serif;
            font-size: 24px;
          }

          button {
            transition: all 0.3s;
            background-color: yellow;
            border-radius: 8px;
            border: none;
            padding: 10px;

            &:hover {
              background-color: #e6e600;
            }
            &:active {
              background-color: #c8c800;
            }
          }

          a {
            color: white;
            text-decoration: none;
          }

          h1 {
            color: yellow;
            margin-bottom: 0px;
            text-align: center;
          }

          @font-face {
            font-family: "Spork";
            src: url("/fonts/Spork.eot");
            src: url("/fonts/Spork.eot?#iefix") format("embedded-opentype"),
              url("/fonts/Spork.woff2") format("woff2"),
              url("/fonts/Spork.woff") format("woff");
            font-weight: 500;
            font-style: normal;
            font-display: swap;
          }
        `}
      />
      <header>
        <a href="https://www.blueorangegames.com/index.php/games/battle-sheep">
          <h1>Battle Sheep</h1>
        </a>
      </header>
      <main css={{ margin: 8 }}>{appStates[appState]}</main>
      <footer css={{ position: "fixed", bottom: 0, textAlign: "center" }}>
        <a href="https://github.com/ronituohino/tiralabra">View source</a>
      </footer>
    </>
  );
}
