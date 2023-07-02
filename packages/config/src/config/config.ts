/*
 * MIT License
 *
 * Copyright (c) 2023 FoxifyJS
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import os from "node:os";
import Joi from "joi";
import content from "#src/config-content";
import { ENV } from "#src/constants/index";
import { Node, Schema } from "#src/utils/index";
import { JsonConfig } from "./json.config.js";
import { JsonpConfig } from "./jsonp.config.js";
import { ProxyConfig } from "./proxy.config.js";
import { QueryConfig } from "./query.config.js";
import { RouterConfig } from "./router.config.js";
import { ServerConfig } from "./server.config.js";
import { SubdomainConfig } from "./subdomain.config.js";

export class Config extends Node {

  public static SCHEMA: Schema<Config> = {
    env: Joi.string().valid(...Object.values(ENV))
      .default(process.env.NODE_ENV as ENV | undefined ?? ENV.DEVELOPMENT),
    workers: Joi.number().integer()
      .min(1)
      .max(os.cpus().length)
      .default(1),
    xPoweredBy: Joi.boolean().default(true),
  };

  /**
   * Node.js environment.
   * @default process.env.NODE_ENV ?? "development"
   */
  public env: ENV;

  /**
   * JSON config.
   */
  public json = new JsonConfig;

  /**
   * JSONP config.
   */
  public jsonp = new JsonpConfig;

  /**
   * Proxy config.
   */
  public proxy = new ProxyConfig;

  /**
   * Request query string config.
   */
  public query = new QueryConfig;

  /**
   * Router config.
   */
  public router = new RouterConfig;

  /**
   * Server config.
   */
  public server = new ServerConfig;

  /**
   * Subdomain config.
   */
  public subdomain = new SubdomainConfig;

  /**
   * Number of Node.js cluster workers to be created.
   * In case of `1` Node.js cluster workers won't be used.
   * @default 1
   */
  public workers: number;

  /**
   * Indicates whether the "X-Powered-By" header should be present or not.
   * @default true
   */
  public xPoweredBy: boolean;

  public constructor(config: Partial<Config> = content ?? {}) {
    super();

    const { env, workers, xPoweredBy } = config as Required<Config>;

    this.env = env;
    this.workers = workers;
    this.xPoweredBy = xPoweredBy;
  }

}
