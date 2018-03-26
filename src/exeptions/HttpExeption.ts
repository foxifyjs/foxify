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
  constructor(message: string, errors: object);
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
    const message = exeption.message;
    const errors = exeption.errors;
    let code = exeption.code;

    let html: string;
    let json: object;

    switch (code) {
      case http.NOT_FOUND:
        html = htmlError(code, STATUS_CODES[code], message);
        json = { message };
        break;
      case http.INTERNAL_SERVER_ERROR:
      default:
        code = http.INTERNAL_SERVER_ERROR;

        html = htmlError(code, STATUS_CODES[code], message);
        json = { message, errors };
    }

    res.format({
      "text/html": () => res.status(code).send(html),
      "application/json": () => res.status(code).json(json),
      "default": () => res.status(code).send(message),
    });
  }
}

export = HttpExeption;
