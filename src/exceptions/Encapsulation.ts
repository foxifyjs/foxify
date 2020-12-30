import { Request, Response } from "@foxify/http";
import assert from "assert";
import escapeHtml from "escape-html";
import { STATUS_CODES } from "http";
import { HTTP } from "../constants";
import * as utils from "../utils";

const HANDLERS: Encapsulation.Handler[] = [];

const DOUBLE_SPACE_REGEXP = /\x20{2}/g;
const NEWLINE_REGEXP = /\r?\n/g;

function getStatus({ status, statusCode }: any) {
  if (typeof status === "number" && status >= 400 && status < 600) {
    return status;
  }

  if (typeof statusCode === "number" && statusCode >= 400 && statusCode < 600) {
    return statusCode;
  }

  return HTTP.INTERNAL_SERVER_ERROR;
}

function headersSent(res: Response) {
  return typeof res.headersSent !== "boolean"
    ? Boolean((res as any)._header)
    : res.headersSent;
}

function createHtmlDocument(message: string) {
  const body = escapeHtml(message)
    .replace(NEWLINE_REGEXP, "<br>")
    .replace(DOUBLE_SPACE_REGEXP, " &nbsp;");

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Error</title></head><body><pre>${body}</pre></body></html>`;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Encapsulation {
  export type Handler = (
    error: Error,
    request: Request,
    response: Response,
    next: () => void,
  ) => void;
}

class Encapsulation {
  public constructor(
    protected _fn: (
      req: Request,
      res: Response,
      ...rest: any[]
    ) => void | Promise<void>,
  ) {}

  public static use(handlers: Encapsulation.Handler[]) {
    handlers = utils.array.compact(handlers);

    // handler validation
    handlers.forEach(handler =>
      assert(utils.isHandler(handler), "Handler should be a function"),
    );

    HANDLERS.push(...handlers);
  }

  public run(req: Request, res: Response, ...rest: any[]) {
    try {
      const result = this._fn(req, res, ...rest);

      if (!(result instanceof Promise)) return;

      result.catch(err => this._next(err, req, res));
    } catch (err) {
      this._next(err, req, res);
    }
  }

  protected _next(err: Error, req: Request, res: Response, index = 0) {
    const handler = HANDLERS[index];

    if (!handler) return this._handle(err, req, res);

    const next = (err2?: Error) => {
      if (err2) return this._handle(err, req, res);

      this._next(err, req, res, index + 1);
    };

    res.next = next;

    handler(err, req, res, next);
  }

  protected _handle(err: Error, req: Request, res: Response) {
    if (headersSent(res)) return req.socket.destroy();

    const status: HTTP = getStatus(err);

    res.statusCode = status;
    res.statusMessage = STATUS_CODES[status]!;

    const message = err.message || res.statusMessage;
    let body: string;
    let stack: string[];

    if (process.env.NODE_ENV !== "production") {
      // use err.stack, which typically includes err.message
      body = err.stack!;

      stack = body
        .split(/\r?\n/)
        .map(line => line.replace(/^ */, ""))
        .slice(1);

      // fallback to err.toString() when possible
      if (!body && typeof err.toString === "function") {
        body = err.toString();
      }
    }

    body = body! || message;

    res.format({
      "application/json": () => {
        const json: { [key: string]: any } = { message, stack };

        const errors = (err as any).errors;

        if (errors && !utils.object.isEmpty(errors)) json.errors = errors;

        res.json(json);
      },
      default: () => res.send(body),
      "text/html": () => res.send(createHtmlDocument(body)),
    });
  }
}

export default Encapsulation;
