import { CONFIG_FILEPATH } from "#src/constants/index";

/* ------------------------- Read the config file ------------------------- */

// TODO: Just to avoid the CommonJS build issue
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error,@typescript-eslint/ban-ts-comment
// @ts-ignore
const content: any = await import(CONFIG_FILEPATH)
  .then(resolved => resolved.default)
  .catch(() => null);

export default content;
