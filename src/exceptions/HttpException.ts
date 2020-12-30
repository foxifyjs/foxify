import { STATUS_CODES } from "http";
import { HTTP } from "../constants";
import * as utils from "../utils";

class HttpException extends Error {
  public statusCode: number;

  public errors: Record<string, unknown>;

  public constructor(errors?: Record<string, unknown>);
  public constructor(
    message: string | number,
    errors?: Record<string, unknown>,
  );
  public constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, unknown>,
  );
  public constructor(
    message?: string | number | Record<string, unknown>,
    statusCode: number | Record<string, unknown> = HTTP.INTERNAL_SERVER_ERROR,
    errors: Record<string, unknown> = {},
  ) {
    if (utils.object.isObject(message)) {
      errors = message;
      statusCode = HTTP.INTERNAL_SERVER_ERROR;
      message = undefined;
    } else if (utils.number.isNumber(message)) {
      errors = utils.object.isObject(statusCode) ? statusCode : {};
      statusCode = message;
      message = undefined;
    }

    if (utils.object.isObject(statusCode)) {
      errors = statusCode;
      statusCode = HTTP.INTERNAL_SERVER_ERROR;
    }

    if (!message) message = STATUS_CODES[statusCode];

    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
  }

  public static isHttpException = (arg: any): arg is HttpException =>
    arg instanceof HttpException;
}

export default HttpException;
