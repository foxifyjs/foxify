import { STATUS_CODES } from "node:http";
import { STATUS } from "../constants/index.js";
import HttpError from "./HttpError.js";

export default class NotFound extends HttpError {

  public constructor(message: string = STATUS_CODES[STATUS.NOT_FOUND]!) {
    super(message, STATUS.NOT_FOUND);
  }

}
