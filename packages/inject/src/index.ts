import {
  IncomingHttpHeaders,
  IncomingMessage,
  OutgoingHttpHeader,
  OutgoingHttpHeaders,
  ServerResponse,
} from "http";
import { Writable } from "readable-stream";
import * as Url from "url";
// @ts-expect-error
import { version } from "@foxify/inject/package.json";

function getNullSocket() {
  return new Writable({
    write(chunk: any, encoding: any, callback: any) {
      setImmediate(callback);
    },
  });
}

export default function inject<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse<Request>
  >(
  dispatch: DispatchT<Request, Response>,
  options: OptionsI | string,
  callback?: CallbackT<Request, Response>,
): Promise<InjectResultI<Request, Response>> {
  // tslint:disable-next-line:no-parameter-reassignment
  if (typeof options === "string") options = { url: options };

  const opts = {
    Request: IncomingMessage,
    Response: ServerResponse,
    headers: {} as IncomingHttpHeaders,
    method: "GET",
    remoteAddress: "127.0.0.1",
    ...options,
  } as Required<OptionsI>;

  opts.method = opts.method.toUpperCase();

  let body = opts.body || null;
  if (body) {
    if (typeof body !== "string") {
      body = JSON.stringify(body);

      opts.headers["content-type"] =
        opts.headers["content-type"] || "application/json";
    }

    opts.headers["content-length"] = Buffer.byteLength(body).toString();
  }

  const socket = getNullSocket();

  const req = new opts.Request(socket as any) as Request;

  (req as any)._inject = {
    body,
    isDone: false,
  };

  // readonly
  req.method = opts.method;

  const uri = Url.parse(opts.url);
  // readonly
  req.url = uri.path!;

  // readonly
  req.headers = opts.headers || {};

  req.headers["user-agent"] =
    req.headers["user-agent"] || `foxify-inject/${version}`;

  const hostHeaderFromUri = () => {
    if (uri.port) {
      return uri.host;
    }

    if (uri.protocol) {
      return uri.hostname + (uri.protocol === "https:" ? ":443" : ":80");
    }

    return null;
  };
  req.headers.host = req.headers.host || hostHeaderFromUri() || "localhost:80";

  (req.socket as any).remoteAddress = opts.remoteAddress;

  req._read = function _read() {
    setImmediate(() => {
      if ((this as any)._inject.isDone) {
        this.push(null);

        return;
      }

      if ((this as any)._inject.body) {
        this.push((this as any)._inject.body);
      }

      (this as any)._inject.isDone = true;

      // this.emit("close");

      this.push(null);
    });
  };

  const res: Response = new opts.Response(req) as any;

  res.assignSocket(socket as any);

  (res as any)._inject = {
    bodyChinks: [],
    headers: {},
  };

  // (res as any)._headers = {};

  const resWriteHead: any = res.writeHead;
  res.writeHead = function writeHead(
    statusCode: number,
    reasonPhrase?: string | OutgoingHttpHeaders | OutgoingHttpHeader[],
    headers?: OutgoingHttpHeaders | OutgoingHttpHeader[],
  ) {
    let hdrs = headers;

    if (typeof reasonPhrase !== "string") hdrs = reasonPhrase;

    if (hdrs && !Array.isArray(hdrs)) {
      Object.keys(hdrs).forEach(header =>
        this.setHeader(header, (hdrs as any)[header]),
      );
    }

    return resWriteHead.call(this, statusCode, reasonPhrase, headers);
  };

  const resWrite = res.write;
  res.write = function write(
    data: any,
    encoding?: BufferEncoding | ((error: Error | null | undefined) => void),
    cb?: (error: Error | null | undefined) => void,
  ) {
    resWrite.call(this, data, encoding as BufferEncoding, cb);
    (this as any)._inject.bodyChinks.push(
      Buffer.from(data, typeof encoding === "string" ? encoding : "utf8"),
    );
    return true;
  };

  const resEnd = res.end;
  res.end = function end(
    this: Response,
    chunk?: string | (() => void),
    encoding?: BufferEncoding | (() => void),
    cb?: () => void,
  ) {
    if (chunk && typeof chunk !== "function")
      this.write(chunk, encoding as BufferEncoding);

    resEnd.call(this, chunk, encoding as BufferEncoding, cb);

    this.emit("finish");
  } as never;

  if (callback) {
    res.once("error", callback);
    res.socket!.once("error", callback);

    res.once("finish", () =>
      callback(null, {
        body: Buffer.concat((res as any)._inject.bodyChinks).toString(),
        headers: res.getHeaders(),
        raw: {
          req,
          res,
        },
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
      }),
    );

    return dispatch(req, res) as any;
  }

  return new Promise((resolve, reject) => {
    res.once("error", reject);
    res.socket!.once("error", reject);

    res.once("finish", () =>
      resolve({
        body: Buffer.concat((res as any)._inject.bodyChinks).toString(),
        headers: res.getHeaders(),
        raw: {
          req,
          res,
        },
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
      }),
    );

    dispatch(req, res);
  });
}

export type DispatchT<
  Request extends IncomingMessage,
  Response extends ServerResponse
  > = (req: Request, res: Response) => void;

export interface OptionsI {
  url: string;
  method?: string;
  Request?: typeof IncomingMessage;
  Response?: typeof ServerResponse;
  headers?: IncomingHttpHeaders;
  remoteAddress?: string;
  body?: string | Record<string, unknown>;
}

export interface InjectResultI<
  Request extends IncomingMessage,
  Response extends ServerResponse
  > {
  raw: {
    req: Request;
    res: Response;
  };
  headers: OutgoingHttpHeaders;
  statusCode: number;
  statusMessage: string;
  body: string;
}

export type CallbackT<
  Request extends IncomingMessage,
  Response extends ServerResponse
  > = (err: Error | null, res: InjectResultI<Request, Response>) => void;
