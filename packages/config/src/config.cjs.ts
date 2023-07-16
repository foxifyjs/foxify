import { CONFIG_FILEPATH } from "#src/constants/index";

/* ------------------------- Read the config file ------------------------- */

let resolved;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  resolved = require(CONFIG_FILEPATH);

  // eslint-disable-next-line no-underscore-dangle
  resolved = resolved?.__esModule ? resolved : { default: resolved };
} catch (e) {
  resolved = {};
}

const content: any = resolved.default ?? null;

export default content;
