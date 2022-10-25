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
      <div css={{ margin: 8 }}>{appStates[appState]}</div>
    </>
  );
}
