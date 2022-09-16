import type { FormikProps } from "formik";
import type { ConfigSchema } from "../types";

import {
  Checkbox,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
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
            value={formik.values.levelName}
            display="flex"
            flexDir="column"
          >
            {Object.entries(levels).map(([key, value]) => (
              <Radio key={key} value={key}>
                {value.name}
              </Radio>
            ))}
          </RadioGroup>

          <Text mt="4">Game configuration</Text>
          <Checkbox
            name="watchMode"
            onChange={formik.handleChange}
            checked={formik.values.watchMode}
            defaultChecked={formik.values.watchMode}
          >
            Watch mode
          </Checkbox>

          <Flex alignItems="center" gap="2">
            <Slider
              maxWidth="300px"
              marginRight="3"
              min={1}
              max={3}
              value={formik.values.aiPlayers}
              onChange={(value) => formik.setFieldValue("aiPlayers", value)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <Text backgroundColor="blue.200" p="0.5ch" textAlign="center">
              {formik.values.aiPlayers}
            </Text>

            <Text>AI players</Text>
          </Flex>

          <Button type="submit" mt="4">
            Play
          </Button>
        </form>
      </Box>
    </Flex>
  );
}
