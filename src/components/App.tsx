import type { AppState, ConfigSchema } from "../utils/types";

import { useFormik } from "formik";
import { useState } from "react";

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

  const appStates = {
    config: <Config formik={formik} />,
    game: <Game setAppState={setAppState} config={formik.values} />,
  } as const;

  return <Box m="8">{appStates[appState]}</Box>;
}
