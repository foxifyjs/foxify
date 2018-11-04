import { STATUS_CODES } from "http";
import { http } from "../constants";
import htmlError from "./htmlError";
import * as Request from "../Request";
import * as Response from "../Response";
import * as utils from "../utils";

module HttpException { }

class HttpException extends Error {
  static isHttpException = (arg: any): arg is HttpException => arg instanceof HttpException;

  code: number;

  errors: object;

  constructor(errors?: object);
  constructor(code: number, errors?: object);
  constructor(message: string, errors?: object);
  constructor(message: string, code: number, errors?: object);
  constructor(
    message?: string | number | object,
    code: number | object = http.INTERNAL_SERVER_ERROR,
    errors: object = {}
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

    if (!message) message = STATUS_CODES[code];

    super(message);

    this.code = code;
    this.errors = errors;
  }

  static handle(exception: any = new HttpException(), req: Request, res: Response): void {
    const code = exception.code || http.INTERNAL_SERVER_ERROR;
    const message = exception.message || STATUS_CODES[code] || "";
    let stack: string[];

    exception.path = req.path;

    if (process.env.NODE_ENV === "development") {
      console.error(exception);

      stack = utils.string.lines(exception.stack)
        .map((line) => line.replace(/^ */, ""));

      stack.shift();
    }

    res.status(code).format({
      "text/html": () =>
        res.send(htmlError(code, STATUS_CODES[code], message, stack && stack.join("<br>").replace(/ /g, "&nbsp;"))),
      "application/json": () => {
        const json: { [key: string]: any } = { message, stack };

        const errors = exception.errors;

        if (errors && !utils.object.isEmpty(errors)) json.errors = errors;

        res.json(json);
      },
      "default": () => res.send(message),
    });
  }
}

export = HttpException;
