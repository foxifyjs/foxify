import { IncomingMessage, ServerResponse, STATUS_CODES } from "http";
import { http } from "../constants";
import htmlError from "./htmlError";

declare module HttpExeption { }

declare interface HttpExeption extends Error {
  code: number;
  errors: object;

  handle(exeption: any, req: IncomingMessage, res: ServerResponse): void;
}

class HttpExeption extends Error {
  constructor(errors?: object);
  constructor(code: number, errors?: object);
  constructor(message: string, errors?: object);
  constructor(message: string, code: number, errors?: object);
  constructor(
    message?: string | number | object,
    code: number | object = http.INTERNAL_SERVER_ERROR,
    errors: object = {},
  ) {
    if (Object.isInstance(message)) {
      errors = message;
      code = http.INTERNAL_SERVER_ERROR;
      message = undefined;
    } else if (Number.isInstance(message)) {
      errors = Object.isInstance(code) ? code : {};
      code = message;
      message = undefined;
    }

    if (Object.isInstance(code)) {
      errors = code;
      code = http.INTERNAL_SERVER_ERROR;
    }

    super(message);

    this.code = code;
    this.errors = errors;
  }

  static handle(exeption: any = new HttpExeption(), req: IncomingMessage, res: ServerResponse): void {
    const code = exeption.code || http.INTERNAL_SERVER_ERROR;
    const message = exeption.message || STATUS_CODES[code] || "";
    const errors = exeption.errors && exeption.errors.$size() > 0 ? exeption.errors : null;

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

export = HttpExeption;
