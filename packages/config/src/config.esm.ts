import { CONFIG_FILEPATH, ConfigI } from "#src/constants";

/* ------------------------- Read the config file ------------------------- */

const content: ConfigI = await import(CONFIG_FILEPATH)
  .then(resolved => resolved.default)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  .catch(() => ({}) as never);

export default content;
