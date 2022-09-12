import { useFormik } from "formik";
import { useState } from "react";
import { assertUnreachable } from "./utils/typescript";

import { Config } from "./states/Config";
import { Game } from "./states/Game";
import { Box } from "@chakra-ui/react";

export type AppState = "config" | "game";

export type ConfigSchema = {
  level: string;
  watchMode: boolean;
  aiPlayers: number;
};

export function App() {
  const [appState, setAppState] = useState<AppState>("config");

  const initialValues: ConfigSchema = {
    level: "one",
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
