import { STATUS_CODES } from "http";
import { STATUS } from "../constants";
import HttpError from "./HttpError";

export default class MethodNotAllowed extends HttpError {

  public constructor(message: string = STATUS_CODES[STATUS.METHOD_NOT_ALLOWED]!) {
    super(message, STATUS.METHOD_NOT_ALLOWED);
  }

}
