// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const nativeModule = require("node:module");

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function resolver(module, options) {
  const { basedir, defaultResolver } = options;
  try {
    return defaultResolver(module, options);
  } catch (error) {
    return nativeModule.createRequire(basedir).resolve(module);
  }
}

module.exports = resolver;
