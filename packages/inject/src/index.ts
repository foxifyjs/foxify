import {
  IncomingHttpHeaders,
  IncomingMessage,
  OutgoingHttpHeader,
  OutgoingHttpHeaders,
  ServerResponse,
} from "node:http";
import * as Url from "node:url";
import { Writable } from "readable-stream";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment,@typescript-eslint/prefer-ts-expect-error
// @ts-ignore
import pkg from "@foxify/inject/package.json" assert { type: "json" };

function getNullSocket(): Writable {
  return new Writable({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    write(chunk: any, encoding: any, callback: any): void {
      setImmediate(callback);
    },
  });
}

export default async function inject<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse<Request> = ServerResponse<Request>,
>(
  dispatch: DispatchT<Request, Response>,
  options: OptionsI<Request, Response> | string,
  callback?: CallbackT<Request, Response>,
): Promise<InjectResultI<Request, Response>> {
  if (typeof options === "string") options = { url: options };

  const {
    Request = IncomingMessage,
    Response = ServerResponse,
    headers = {},
    method = "GET",
    remoteAddress = "127.0.0.1",
    url,
  } = options;

  let body = options.body ?? null;

  if (body) {
    if (typeof body !== "string") {
      body = JSON.stringify(body);

      headers["content-type"] = headers["content-type"] ?? "application/json";
    }

    headers["content-length"] = Buffer.byteLength(body).toString();
  }

  const socket = getNullSocket();

  const req = new Request(socket as any) as Request;

  // eslint-disable-next-line no-underscore-dangle,@typescript-eslint/no-explicit-any
  (req as any)._inject = {
    body,
    isDone: false,
  };

  // Readonly
  req.method = method.toUpperCase();

  const uri = Url.parse(url);

  // Readonly
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  req.url = uri.path!;

  // Readonly
  req.headers = headers;

  req.headers["user-agent"] = req.headers["user-agent"] ?? `foxify-inject/${ pkg.version }`;

  const hostHeaderFromUri = (): string | null => {
    if (uri.port) return uri.host;

    if (uri.protocol) return uri.hostname + (uri.protocol === "https:" ? ":443" : ":80");

    return null;
  };
  req.headers.host = (req.headers.host ?? hostHeaderFromUri()) ?? "localhost:80";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req.socket as any).remoteAddress = remoteAddress;

  // eslint-disable-next-line no-underscore-dangle
  req._read = function _read(): void {
    setImmediate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any,no-underscore-dangle
      if ((this as any)._inject.isDone) {
        this.push(null);

        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any,no-underscore-dangle
      if ((this as any)._inject.body) this.push((this as any)._inject.body);


      // eslint-disable-next-line @typescript-eslint/no-explicit-any,no-underscore-dangle
      (this as any)._inject.isDone = true;

      // This.emit("close");

      this.push(null);
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = new Response(req as any) as Response;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res.assignSocket(socket as any);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,no-underscore-dangle
  (res as any)._inject = {
    bodyChinks: [],
    headers   : {},
  };

  // (res as any)._headers = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resWriteHead: any = res.writeHead;
  res.writeHead = function writeHead(
    statusCode: number,
    reasonPhrase?: OutgoingHttpHeader[] | OutgoingHttpHeaders | string,
    // eslint-disable-next-line no-underscore-dangle
    _headers?: OutgoingHttpHeader[] | OutgoingHttpHeaders,
  ): Response {
    let hdrs = _headers;

    if (typeof reasonPhrase !== "string") hdrs = reasonPhrase;

    // eslint-disable-next-line max-len
    if (hdrs && !Array.isArray(hdrs)) Object.keys(hdrs).forEach(header => this.setHeader(header, (hdrs as any)[header]));

    return resWriteHead.call(this, statusCode, reasonPhrase, _headers);
  };

  const resWrite = res.write;
  res.write = function write(
    data: any,
    encoding?: BufferEncoding | ((error: Error | null | undefined) => void),
    cb?: (error: Error | null | undefined) => void,
  ): boolean {
    resWrite.call(this, data, encoding as BufferEncoding, cb);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,no-underscore-dangle
    (this as any)._inject.bodyChinks.push(Buffer.from(data, typeof encoding === "string" ? encoding : "utf8"));
    return true;
  };

  const resEnd = res.end;
  // eslint-disable-next-line max-params
  res.end = function end(
    this: Response,
    chunk?: string | (() => void),
    encoding?: BufferEncoding | (() => void),
    cb?: () => void,
  ) {
    if (chunk && typeof chunk !== "function") this.write(chunk, encoding as BufferEncoding);

    resEnd.call(this, chunk, encoding as BufferEncoding, cb);

    this.emit("finish");
  } as never;

  if (callback) {
    res.once("error", callback);
    res.socket!.once("error", callback);

    res.once("finish", () => callback(null, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any,no-underscore-dangle
      body   : Buffer.concat((res as any)._inject.bodyChinks).toString(),
      headers: res.getHeaders(),
      raw    : {
        req,
        res,
      },
      statusCode   : res.statusCode,
      statusMessage: res.statusMessage,
    }));

    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    return dispatch(req, res) as any;
  }

  return new Promise((resolve, reject) => {
    res.once("error", reject);
    res.socket!.once("error", reject);

    res.once("finish", () => resolve({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any,no-underscore-dangle
      body   : Buffer.concat((res as any)._inject.bodyChinks).toString(),
      headers: res.getHeaders(),
      raw    : {
        req,
        res,
      },
      statusCode   : res.statusCode,
      statusMessage: res.statusMessage,
    }));

    dispatch(req, res);
  });
}

export type DispatchT<
  Request extends IncomingMessage,
  Response extends ServerResponse,
> = (req: Request, res: Response) => void;

export interface OptionsI<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse<Request> = ServerResponse<Request>,
> {
  Request?: typeof Request;
  Response?: typeof Response;
  body?: Record<string, unknown> | string;
  headers?: IncomingHttpHeaders;
  method?: string;
  remoteAddress?: string;
  url: string;
}

export interface InjectResultI<
  Request extends IncomingMessage,
  Response extends ServerResponse,
> {
  body: string;
  headers: OutgoingHttpHeaders;
  raw: {
    req: Request;
    res: Response;
  };
  statusCode: number;
  statusMessage: string;
}

export type CallbackT<
  Request extends IncomingMessage,
  Response extends ServerResponse,
> = (err: Error | null, res: InjectResultI<Request, Response>) => void;
