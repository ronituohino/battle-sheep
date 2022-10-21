import type { FormikProps } from "formik";
import type { ConfigSchema } from "../types";

import { levels } from "../levels";

export type ConfigProps = {
  formik: FormikProps<ConfigSchema>;
};

export function Config({ formik }: ConfigProps) {
  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <h1
        css={{
          color: "yellow",
        }}
      >
        Battle Sheep
      </h1>

      <div css={{ width: "50vw" }}>
        <form onSubmit={formik.handleSubmit}>
          <p>Level select</p>
          <div css={{ display: "flex", flexDirection: "column" }}>
            {Object.entries(levels).map(([key, value]) => {
              if (value.test) {
                return;
              }

              return (
                <div key={key}>
                  <input
                    type="radio"
                    id={key}
                    value={key}
                    checked={formik.values.levelKey === key}
                    name="level"
                    onChange={(e) =>
                      formik.setFieldValue("levelKey", e.target.value)
                    }
                  />
                  <label htmlFor={key}>{value.name}</label>
                </div>
              );
            })}
          </div>

          <button type="submit" css={{ marginTop: 4 }}>
            Play
          </button>
        </form>
      </div>
    </div>
  );
}
