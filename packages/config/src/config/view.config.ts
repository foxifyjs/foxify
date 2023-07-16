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

import { statSync } from "node:fs";
import Joi from "joi";
import content from "#src/config-content";
import { Node, Schema } from "#src/utils/index";

export type ViewRendererCallbackT = (error: Error, result: string) => void;

export type ViewRendererT = (
  filepath: string,
  options: Record<string, unknown>,
  callback?: ViewRendererCallbackT,
) => void;

export interface ViewConfigI {

  /**
   * The directory containing view templates.
   */
  directory?: string;

  /**
   * The view template file extension.
   */
  extension?: string;

  /**
   * The function to render the view templates.
   */
  renderer?: ViewRendererT;
}

export class ViewConfig extends Node {

  public static SCHEMA: Schema<ViewConfig> = {
    directory: Joi.string().custom((value) => {
      if (statSync(value).isDirectory()) return value;

      throw new TypeError(`Unexpected value: ${ value }`);
    }),
    extension: Joi.string(),
    renderer : Joi.function(),
  };

  /**
   * The directory containing view templates.
   */
  public directory: string;

  /**
   * The view template file extension.
   */
  public extension?: string;

  /**
   * The function to render the view templates.
   */
  public renderer: ViewRendererT;

  public constructor(config: Partial<ViewConfig> = content?.view ?? {}) {
    super("view");

    const { directory, extension, renderer } = config as Required<ViewConfig>;

    this.directory = directory;
    this.extension = extension;
    this.renderer = renderer;
  }

}
