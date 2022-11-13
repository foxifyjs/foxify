import { STATUS_CODES } from "http";
import { STATUS, StatusT } from "../constants/index.js";

export default class HttpError extends Error {

  public readonly details: Record<string, unknown>;

  public readonly statusCode: StatusT;

  public constructor(status: StatusT);
  public constructor(message: string, status?: StatusT);
  public constructor(details: Record<string, unknown>, status?: StatusT);
  public constructor(
    message: string,
    details: Record<string, unknown>,
    status?: StatusT,
  );
  public constructor(
    message: Record<string, unknown> | StatusT | string,
    details: Record<string, unknown> | StatusT = {},
    status: Record<string, unknown> | StatusT = STATUS.INTERNAL_SERVER_ERROR,
  ) {
    switch (typeof message) {
      case "string": {
        if (typeof details === "number") {
          status = details;
          details = {};
        }

        break;
      }
      case "number": {
        status = message;
        message = STATUS_CODES[status] ?? `${ status }`;

        break;
      }
      default: {
        status = details as StatusT;
        details = message;
        message = STATUS_CODES[status] ?? `${ status }`;

        break;
      }
    }

    super(message);

    this.statusCode = status as StatusT;
    this.details = details as Record<string, unknown>;
  }

}
