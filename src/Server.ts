import * as cluster from "cluster";
import * as http from "http";
import * as https from "https";
import * as qs from "qs";
import { Url } from "url";
import * as Foxify from ".";
import events from "./events";
import * as EventEmitter from "./events/Emitter";
import Request from "./Request";
import Response from "./Response";
import { parseUrl } from "./utils";
import { Engine } from "./view";

namespace Server {
  export interface Options extends Foxify.Options {}

  export interface Settings extends Foxify.Settings {
    view?: Engine;
  }

  export type Listener = (request: Request, response: Response) => void;

  export type Callback = (server: Server) => void;
}

interface Server {
  on(
    event: EventEmitter.ErrorEvent,
    listener: EventEmitter.ErrorListener,
  ): this;
  on(
    event: "uncaughtException",
    listener: EventEmitter.ExceptionListener,
  ): this;
  on(
    event: "unhandledRejection",
    listener: EventEmitter.RejectionListener,
  ): this;
}

class Server {
  protected _host: string;
  protected _port: number;

  protected _listening = false;

  private _instance?: http.Server | https.Server;

  constructor(
    options: Server.Options,
    settings: Server.Settings,
    listener: Server.Listener,
  ) {
    this._host = settings.url;
    this._port = settings.port;

    const isHttps = options.https;
    const SERVER: any = isHttps ? https : http;

    const IncomingMessage = Request;
    IncomingMessage.prototype.settings = {
      subdomain: {
        ...settings.subdomain,
      },
      trust: {
        ...settings.trust,
      },
    };

    const queryParse: (...args: any[]) => any =
      settings.query.parser || qs.parse;
    Object.defineProperty(IncomingMessage.prototype, "query", {
      get() {
        return queryParse((parseUrl(this) as Url).query, { allowDots: true });
      },
    });

    const ServerResponse = Response;
    ServerResponse.prototype.settings = {
      engine: settings.view,
      etag: settings.etag,
      json: {
        escape: options.json.escape,
        replacer: settings.json.replacer,
        spaces: settings.json.spaces,
      },
      jsonp: {
        callback: settings.jsonp.callback,
      },
    };

    const OPTIONS: any = { IncomingMessage, ServerResponse };

    if (isHttps) {
      const httpsSettings = settings.https;

      OPTIONS.cert = httpsSettings.cert;
      OPTIONS.key = httpsSettings.key;
    }

    this.on("error", HttpException.handle);

    const workers = settings.workers;

    if (workers > 1) {
      if (cluster.isMaster) {
        for (let i = 0; i < workers; i++) cluster.fork();

        return this;
      }

      this._instance = SERVER.createServer(OPTIONS, listener);

      return this;
    }

    this._instance = SERVER.createServer(OPTIONS, listener);
  }

  public get listening() {
    return this._listening;
  }

  public start(callback?: Server.Callback) {
    this._listening = true;

    const instance = this._instance;

    if (instance) {
      instance.listen(
        this._port,
        this._host,
        callback && (() => callback(this)),
      );
    }

    return this;
  }

  public stop(callback?: Server.Callback) {
    this._listening = false;

    const instance = this._instance;

    if (instance) instance.close(callback && (() => callback(this)));

    return this;
  }

  public reload(callback?: Server.Callback) {
    if (this._listening) return this.stop(server => server.start(callback));

    return this.start(callback);
  }

  public on(event: EventEmitter.Event, listener: (...args: any[]) => void) {
    events.on(event, listener);

    return this;
  }
}

export = Server;
