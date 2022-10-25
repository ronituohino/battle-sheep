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
      <div css={{ maxWidth: "320px" }}>
        <form
          onSubmit={formik.handleSubmit}
          css={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>Level select</h3>
          <div>
            {Object.entries(levels).map(([key, value]) => {
              if (value.test) {
                return;
              }

              const checked = formik.values.levelKey === key;
              const checkedProperty = checked
                ? { boxShadow: "0 0 0 5px black" }
                : undefined;

              return (
                <label key={key}>
                  <div
                    css={{
                      margin: 16,
                      paddingTop: 4,
                      paddingBottom: 4,
                      paddingLeft: 16,
                      paddingRight: 16,
                      borderRadius: 8,
                      backgroundColor: "white",
                      "&:hover": {
                        cursor: "pointer",
                      },
                      ...checkedProperty,
                      transition: "all 0.15s",
                    }}
                  >
                    <p
                      css={{
                        userSelect: "none",
                        WebkitUserSelect: "none",
                        textAlign: "center",
                      }}
                    >
                      {key}
                    </p>
                  </div>

                  <input
                    type="radio"
                    value={key}
                    checked={checked}
                    name="level"
                    onChange={(e) =>
                      formik.setFieldValue("levelKey", e.target.value)
                    }
                    css={{ display: "none" }}
                  />
                </label>
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
