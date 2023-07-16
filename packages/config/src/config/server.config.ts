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

import createETag from "etag";
import Joi from "joi";
import content from "#src/config-content";
import { SERVER_PROTOCOL } from "#src/constants/index";
import { Node, Schema } from "#src/utils/index";

const createETagGenerator = (weak: boolean) => function generateETag(
  body: Buffer | string,
  encoding?: BufferEncoding,
): string {
  return createETag(Buffer.isBuffer(body) ? body : Buffer.from(body, encoding), {
    weak,
  });
};

export interface ServerConfigI {

  /**
   * HTTP2/HTTPS cert chain in PEM format.
   */
  cert?: string;

  /**
   * ETag response header value generator.
   */
  etag?: boolean | "strong" | "weak" | ((body: Buffer | string, encoding?: BufferEncoding) => string);

  /**
   * Server hostname.
   * @default "localhost"
   */
  hostname?: string;

  /**
   * HTTP2/HTTPS private key in PEM format.
   */
  key?: string;

  /**
   * Server port.
   * @default 3000
   */
  port?: number;

  /**
   * Server protocol.
   * @default "http"
   */
  protocol?: SERVER_PROTOCOL;
}

export interface ServerConfig {

  /**
   * ETag response header value generator.
   */
  get etag(): ((body: Buffer | string, encoding?: BufferEncoding) => string) | undefined;

  /**
   * ETag response header value generator.
   */
  set etag(
    etag: boolean | "strong" | "weak" | ((body: Buffer | string, encoding?: BufferEncoding) => string) | undefined,
  );
}

export class ServerConfig extends Node {

  public static SCHEMA: Schema<ServerConfig> = {
    cert: Joi.string(),
    etag: Joi.alternatives(
      Joi.function(),
      Joi.boolean().custom((value) => {
        if (value) return createETagGenerator(true);

        // eslint-disable-next-line no-undefined
        return undefined;
      }),
      Joi.string().custom((value) => {
        switch (value) {
          case "weak":
            return createETagGenerator(true);
          case "strong":
            return createETagGenerator(false);
          default:
            throw new TypeError(`Unexpected value: ${ value }`);
        }
      }),
    ),
    hostname: Joi.string().hostname()
      .default("localhost"),
    key : Joi.string(),
    port: Joi.number().port()
      .default(3_000),
    protocol: Joi.string().valid(...Object.values(SERVER_PROTOCOL))
      .default(SERVER_PROTOCOL.HTTP),
  };

  /**
   * HTTP2/HTTPS cert chain in PEM format.
   */
  public cert?: string;

  /**
   * Server hostname.
   * @default "localhost"
   */
  public hostname: string;

  /**
   * HTTP2/HTTPS private key in PEM format.
   */
  public key?: string;

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

    const { cert, etag, hostname, key, port, protocol } = config as Required<ServerConfig>;

    this.cert = cert;
    this.etag = etag;
    this.hostname = hostname;
    this.key = key;
    this.port = port;
    this.protocol = protocol;
  }

}
