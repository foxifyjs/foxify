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

import Joi from "joi";
import content from "#src/config-content";
import { SERVER_PROTOCOL } from "#src/constants/index";
import { Node, Schema } from "#src/utils/index";

export class ServerConfig extends Node {

  public static SCHEMA: Schema<ServerConfig> = {
    etag    : Joi.function(),
    hostname: Joi.string().hostname()
      .default("localhost"),
    port: Joi.number().port()
      .default(3_000),
    protocol: Joi.string().valid(...Object.values(SERVER_PROTOCOL))
      .default(SERVER_PROTOCOL.HTTP),
  };

  /**
   * ETag response header value generator.
   */
  public etag?: (body: Buffer | string, encoding?: BufferEncoding) => string;

  /**
   * Server hostname.
   * @default "localhost"
   */
  public hostname: string;

  /**
   * Server port.
   * @default 3000
   */
  public port: number;

  /**
   * Server protocol.
   * @default "http"
   */
  public protocol: SERVER_PROTOCOL;

  public constructor(config: Partial<ServerConfig> = content?.server ?? {}) {
    super("server");

    const { etag, hostname, port, protocol } = config as Required<ServerConfig>;

    this.etag = etag;
    this.hostname = hostname;
    this.port = port;
    this.protocol = protocol;
  }

}
