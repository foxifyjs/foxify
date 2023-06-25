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

export type DirectConfigKey<T extends Node> = {
  [K in keyof T]: T[K] extends object ? never : K;
}[keyof T];

export type Schema<T extends Node> = Record<DirectConfigKey<T>, Joi.Schema>;

export abstract class Node {

  public static SCHEMA: Record<string, Joi.Schema>;

  protected constructor() {
    const SCHEMA = (this.constructor as typeof Node).SCHEMA;

    // eslint-disable-next-line no-constructor-return
    return new Proxy(this, {
      // eslint-disable-next-line max-params
      set(target: Node, p: string, newValue: unknown, receiver: unknown): boolean {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((target as any)[p] instanceof Node) throw new TypeError(`Config override for "${ p }" is not allowed.`);

        if (p in SCHEMA) {
          const { value, error } = SCHEMA[p].validate(newValue);

          if (error != null) throw error;

          newValue = value;
        }

        return Reflect.set(target, p, newValue, receiver);
      },
    });
  }

}
