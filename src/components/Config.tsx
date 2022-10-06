import type { FormikProps } from "formik";
import type { ConfigSchema } from "../utils/types";

import {
  RadioGroup,
  Radio,
  Button,
  Text,
  Box,
  Heading,
  Flex,
} from "@chakra-ui/react";

import { levels } from "../levels";

export type ConfigProps = {
  formik: FormikProps<ConfigSchema>;
};

export function Config({ formik }: ConfigProps) {
  return (
    <Flex flexDir="column" alignItems="center" gap="4">
      <Heading>Battle Sheep</Heading>

      <Box width="50vw">
        <form onSubmit={formik.handleSubmit}>
          <Text>Level select</Text>
          <RadioGroup
            onChange={(value) => formik.setFieldValue("levelName", value)}
            value={formik.values.levelKey}
            display="flex"
            flexDir="column"
          >
            {Object.entries(levels).map(([key, value]) => (
              <Radio key={key} value={key}>
                {value.name}
              </Radio>
            ))}
          </RadioGroup>

          <Button type="submit" mt="4">
            Play
          </Button>
        </form>
      </Box>
    </Flex>
  );
}
