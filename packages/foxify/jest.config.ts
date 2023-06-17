/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import { type Config } from "jest";
import BaseConfig from "../../jest.config.ts";

export default {
  ...BaseConfig,
  displayName: "foxify",
} satisfies Config;
