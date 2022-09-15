import type { AppState, ConfigSchema } from "../types";

import { useFormik } from "formik";
import { useState } from "react";
import { assertUnreachable } from "../types";

import { Config } from "./Config";
import { Game } from "./Game";
import { Box } from "@chakra-ui/react";

export function App() {
  const [appState, setAppState] = useState<AppState>("config");

  const initialValues: ConfigSchema = {
    levelName: "one",
    watchMode: false,
    aiPlayers: 1,
  };
  const formik = useFormik({
    initialValues,
    onSubmit: () => {
      setAppState("game");
    },
  });

  const switchRender = () => {
    switch (appState) {
      case "config":
        return <Config formik={formik} />;
      case "game":
        return <Game setAppState={setAppState} config={formik.values} />;
      default:
        assertUnreachable(appState);
    }
  };

  return <Box m="8">{switchRender()}</Box>;
}
