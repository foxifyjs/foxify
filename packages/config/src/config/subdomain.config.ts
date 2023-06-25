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
import { Node, Schema } from "#src/utils/index";

export class SubdomainConfig extends Node {

  public static SCHEMA: Schema<SubdomainConfig> = {
    offset: Joi.number().integer()
      .min(0)
      .default(2),
  };

  /**
   * The number of dot-separated parts of the host to remove to access subdomain.
   * @default 2
   */
  public offset: number;

  public constructor(config: Partial<SubdomainConfig> = content?.subdomain ?? {}) {
    super();

    const { offset } = config as Required<SubdomainConfig>;

    this.offset = offset;
  }

}
