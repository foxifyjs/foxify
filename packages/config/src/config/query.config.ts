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
import { parse, ParsedQs } from "qs";
import content from "#src/config-content";
import { Node, Schema } from "#src/utils/index";

export interface QueryConfig {

  /**
   * A custom query string parsing function will receive the complete query string,
   * and must return an object of query keys and their values.
   * @default qs.parse // node:querystring
   */
  get parser(): (str: string) => ParsedQs;

  /**
   * A custom query string parsing function will receive the complete query string,
   * and must return an object of query keys and their values.
   * @default qs.parse // node:querystring
   */
  set parser(parser: boolean | "extended" | "simple" | ((str: string) => ParsedQs));
}

export class QueryConfig extends Node {

  public static SCHEMA: Schema<QueryConfig> = {
    parser: Joi.alternatives().try(
      Joi.function(),
      Joi.boolean().custom((value) => {
        if (value) return parse;

        return (): ParsedQs => ({});
      }),
      Joi.string().custom((value) => {
        switch (value) {
          case "simple":
            return parse;
          case "extended":
            return (str: string): ParsedQs => parse(str, { allowPrototypes: true });
          default:
            throw new Error(`Unexpected value: ${ value }`);
        }
      }),
    )
      .default(() => parse),
  };


  public constructor(config: Partial<QueryConfig> = content?.query ?? {}) {
    super("query");

    const { parser } = config as Required<QueryConfig>;

    this.parser = parser;
  }

}
