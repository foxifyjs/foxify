import os from "node:os";
import Joi from "joi";
import content from "#src/config";
import {
  ConfigI,
  DEFAULT,
  ENV,
  JsonConfigI,
  JsonpConfigI,
  ProxyConfigI,
  QueryConfigI,
  SERVER_PROTOCOL,
  ServerConfigI,
  SubdomainConfigI,
} from "#src/constants";

/* ------------------------- Validate the config data ------------------------- */

const { value: config, error } = Joi
  .object<ConfigI>()
  .keys({
    env: Joi.string().valid(...Object.values(ENV))
      .default(DEFAULT.env),
    xPoweredBy: Joi.boolean().default(DEFAULT.xPoweredBy),
    workers   : Joi.number().integer()
      .min(1)
      .max(os.cpus().length)
      .default(DEFAULT.workers),
    etag  : Joi.function(),
    server: Joi
      .object<ServerConfigI>()
      .keys({
        protocol: Joi.string().valid(...Object.values(SERVER_PROTOCOL))
          .default(DEFAULT.server.protocol),
        hostname: Joi.string().hostname()
          .default(DEFAULT.server.hostname),
        port: Joi.number().port()
          .default(DEFAULT.server.port),
      })
      .default(DEFAULT.server),
    subdomain: Joi
      .object<SubdomainConfigI>()
      .keys({
        offset: Joi.number().integer()
          .min(0)
          .default(DEFAULT.subdomain.offset),
      })
      .default(DEFAULT.subdomain),
    json: Joi
      .object<JsonConfigI>()
      .keys({
        escape  : Joi.boolean().default(DEFAULT.json.escape),
        replacer: Joi.function(),
        spaces  : Joi.number().integer()
          .min(0)
          .default(DEFAULT.json.spaces),
      })
      .default(DEFAULT.json),
    jsonp: Joi
      .object<JsonpConfigI>()
      .keys({
        callback: Joi.string().default(DEFAULT.jsonp.callback),
      })
      .default(DEFAULT.jsonp),
    query: Joi
      .object<QueryConfigI>()
      .keys({
        parser: Joi.function().default(DEFAULT.query.parser),
      })
      .default(DEFAULT.query),
    proxy: Joi
      .object<ProxyConfigI>()
      .keys({
        trust: Joi.function().default(DEFAULT.proxy.trust),
      })
      .default(DEFAULT.proxy),
  })
  .unknown()
  .validate(content);

if (error != null) throw error;

/* ------------------------- Freeze the config data ------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function freeze<T extends Record<string, any>>(obj: T): T {
  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) continue;

    const value = obj[key];

    if (typeof value !== "object" || value == null) continue;

    obj[key] = freeze(value);
  }

  return Object.freeze(obj);
}

const CONFIG: ConfigI = config.env === ENV.TEST ? config : freeze(config);

/* ------------------------- Exports ------------------------- */

export default CONFIG;

export { ENV, SERVER_PROTOCOL };

export type {
  ConfigI,
  ServerConfigI,
  SubdomainConfigI,
  JsonConfigI,
  JsonpConfigI,
  QueryConfigI,
  ProxyConfigI,
};
