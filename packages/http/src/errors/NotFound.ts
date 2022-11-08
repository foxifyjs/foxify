import { STATUS_CODES } from "http";
import { STATUS } from "../constants";
import HttpError from "./HttpError";

export default class NotFound extends HttpError {

  public constructor(message: string = STATUS_CODES[STATUS.NOT_FOUND]!) {
    super(message, STATUS.NOT_FOUND);
  }

}
