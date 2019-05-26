import { EventEmitter as Base } from "@foxify/events";
import { http } from "../constants";
import { HttpException } from "../exceptions";
import Request from "../Request";
import Response from "../Response";
import { object } from "../utils";

const ERRORS = object.reduce(
  http,
  (prev, code) => {
    prev.push(`error-${code}`);

    return prev;
  },
  [],
);

const EVENTS = ["uncaughtException", "unhandledRejection", "error"].concat(
  ERRORS,
);

namespace EventEmitter {
  export type ErrorEvent =
    | "error"
    | "error-100"
    | "error-101"
    | "error-102"
    | "error-103"
    | "error-200"
    | "error-201"
    | "error-202"
    | "error-203"
    | "error-204"
    | "error-205"
    | "error-206"
    | "error-207"
    | "error-208"
    | "error-226"
    | "error-300"
    | "error-301"
    | "error-302"
    | "error-303"
    | "error-304"
    | "error-305"
    | "error-306"
    | "error-307"
    | "error-308"
    | "error-400"
    | "error-401"
    | "error-402"
    | "error-403"
    | "error-404"
    | "error-405"
    | "error-406"
    | "error-407"
    | "error-408"
    | "error-409"
    | "error-410"
    | "error-411"
    | "error-412"
    | "error-413"
    | "error-414"
    | "error-415"
    | "error-416"
    | "error-417"
    | "error-418"
    | "error-421"
    | "error-422"
    | "error-423"
    | "error-424"
    | "error-426"
    | "error-428"
    | "error-429"
    | "error-431"
    | "error-451"
    | "error-500"
    | "error-501"
    | "error-502"
    | "error-503"
    | "error-504"
    | "error-505"
    | "error-506"
    | "error-507"
    | "error-508"
    | "error-510"
    | "error-511";

  export type ErrorListener = (
    error: HttpException,
    req: Request,
    res: Response,
  ) => void;
  export type ExceptionListener = (error: Error) => void;
  export type RejectionListener = (error: any) => void;

  export type Event =
    | "uncaughtException"
    | "unhandledRejection"
    | EventEmitter.ErrorEvent;

  export type ErrorEvents = { [event in ErrorEvent]: ErrorListener };

  export interface Events extends ErrorEvents {
    uncaughtException: ExceptionListener;
    unhandledRejection: RejectionListener;
  }
}

class EventEmitter extends Base<EventEmitter.Events> {
  public addListener(
    event: EventEmitter.Event,
    listener: (...args: any[]) => void,
  ) {
    if (!EVENTS.includes(event)) {
      throw new TypeError(`Unexpected event "${event}"`);
    }

    switch (event) {
      case "uncaughtException":
      case "unhandledRejection":
        process.removeAllListeners(event).addListener(event as any, listener);
        break;
      case "error":
        ERRORS.forEach((error: any) => this.addListener(error, listener));
        break;
      default:
        this.removeAllListeners(event);

        super.addListener(event, listener);
    }

    return this;
  }

  public emit(event: EventEmitter.ErrorEvent, ...args: any[]) {
    if (!EVENTS.includes(event) || event === "error") {
      throw new TypeError(`Unexpected event "${event}"`);
    }

    return super.emit.apply(this, [event, ...args]);
  }
}

export = EventEmitter;
