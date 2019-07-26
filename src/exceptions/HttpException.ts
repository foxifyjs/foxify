import { STATUS_CODES } from "http";
import { HTTP } from "../constants";
// import Request from "../Request";
// import Response from "../Response";
import * as utils from "../utils";
// import htmlError from "./htmlError";

class HttpException extends Error {
  public static isHttpException = (arg: any): arg is HttpException =>
    arg instanceof HttpException;

  public statusCode: number;

  public errors: object;

  constructor(errors?: object);
  constructor(message: string | number, errors?: object);
  constructor(message: string, statusCode: number, errors?: object);
  constructor(
    message?: string | number | object,
    statusCode: number | object = HTTP.INTERNAL_SERVER_ERROR,
    errors: object = {},
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
}

export default HttpException;
