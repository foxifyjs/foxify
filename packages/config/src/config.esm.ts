import { CONFIG_FILEPATH, ConfigI } from "#src/constants";

/* ------------------------- Read the config file ------------------------- */

// TODO: Just to avoid the CommonJS build issue
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error,@typescript-eslint/ban-ts-comment
// @ts-ignore
const content: ConfigI = await import(CONFIG_FILEPATH)
  .then(resolved => resolved.default)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  .catch(() => ({}) as never);

export default content;
