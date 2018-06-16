import { IncomingMessage, ServerResponse, STATUS_CODES } from "http";
import { http } from "../constants";
import htmlError from "./htmlError";
import * as utils from "../utils";

declare module HttpException { }

declare interface HttpException extends Error {
  code: number;
  errors: object;

  handle(exception: any, req: IncomingMessage, res: ServerResponse): void;
}

class HttpException extends Error {
  constructor(errors?: object);
  constructor(code: number, errors?: object);
  constructor(message: string, errors?: object);
  constructor(message: string, code: number, errors?: object);
  constructor(
    message?: string | number | object,
    code: number | object = http.INTERNAL_SERVER_ERROR,
    errors: object = {},
  ) {
    if (utils.object.isObject(message)) {
      errors = message;
      code = http.INTERNAL_SERVER_ERROR;
      message = undefined;
    } else if (utils.number.isNumber(message)) {
      errors = utils.object.isObject(code) ? code : {};
      code = message;
      message = undefined;
    }

    if (utils.object.isObject(code)) {
      errors = code;
      code = http.INTERNAL_SERVER_ERROR;
    }

    super(message);

    this.code = code;
    this.errors = errors;
  }

  static handle(exception: any = new HttpException(), req: IncomingMessage, res: ServerResponse): void {
    const code = exception.code || http.INTERNAL_SERVER_ERROR;
    const message = exception.message || STATUS_CODES[code] || "";
    const errors = exception.errors && !utils.object.empty(exception.errors) ? exception.errors : null;

    const html = htmlError(code, STATUS_CODES[code], message);
    const json: { [key: string]: any } = { message };

    if (errors) json.errors = errors;

    res.format({
      "text/html": () => res.status(code).send(html),
      "application/json": () => res.status(code).json(json),
      "default": () => res.status(code).send(message),
    });
  }
}

export = HttpException;
