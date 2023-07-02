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
import { compile } from "proxy-addr";
import content from "#src/config-content";
import { Node, Schema } from "#src/utils/index";

export interface ProxyConfig {

  /**
   * Indicates whether the app is behind a front-facing proxy,
   * and to use the X-Forwarded-* headers to determine the connection and the IP address of the client.
   * @default () => false
   */
  get trust(): (ip: string, hopIndex: number) => boolean;

  /**
   * Indicates whether the app is behind a front-facing proxy,
   * and to use the X-Forwarded-* headers to determine the connection and the IP address of the client.
   * @default () => false
   */
  set trust(value: boolean | number | string | ((ip: string, hopIndex: number) => boolean));
}

export class ProxyConfig extends Node {

  public static SCHEMA: Schema<ProxyConfig> = {
    trust: Joi.alternatives().try(
      Joi.function(),
      Joi.boolean().custom(value => ((): boolean => value)),
      Joi.string().custom(value => compile(value.split(/ *, */))),
      Joi.number().integer()
        .positive()
        .custom(value => ((ip: string, hopIndex: number): boolean => hopIndex < value)),
    )
      .default(() => ((): boolean => false)),
  };


  public constructor(config: Partial<ProxyConfig> = content?.proxy ?? {}) {
    super("proxy");

    const { trust } = config as Required<ProxyConfig>;

    this.trust = trust;
  }

}
