import * as http from "http";
import * as https from "https";
import * as cluster from "cluster";
import * as qs from "qs";
import { Url } from "url";
import * as EventEmitter from "./events/EventEmitter";
import * as events from "./events";
import * as Request from "./Request";
import * as Response from "./Response";
import * as Foxify from "./index";
import { Engine } from "./view";
import { parseUrl } from "./utils";

module Server {
  export interface Options extends Foxify.Options {
  }

  export interface Settings extends Foxify.Settings {
    view?: Engine;
  }

  export type Listener = (request: Request, response: Response) => void;

  export type Callback = (server: Server) => void;
}

interface Server {
  on(event: EventEmitter.ErrorEvent, listener: EventEmitter.ErrorListener): this;
  on(event: "uncaughtException", listener: EventEmitter.ExceptionListener): this;
  on(event: "unhandledRejection", listener: EventEmitter.RejectionListener): this;
}

class Server {
  private _instance?: http.Server | https.Server;

  protected _host: string;
  protected _port: number;

  protected _listening = false;

  constructor(options: Server.Options, settings: Server.Settings, listener: Server.Listener) {
    this._host = settings.url;
    this._port = settings.port;

    const isHttps = options.https;
    const SERVER: any = isHttps ? https : http;

    const IncomingMessage = Request;
    IncomingMessage.prototype.settings = {
      subdomain: {
        ...settings.subdomain,
      },
    };

    const queryParse: (...args: any[]) => any = settings.query.parser || qs.parse;
    Object.defineProperty(IncomingMessage.prototype, "query", {
      get() {
        return queryParse((parseUrl(this) as Url).query, { allowDots: true });
      },
    });

    const ServerResponse = Response;
    ServerResponse.prototype.settings = {
      engine: settings.view,
      json: {
        escape: options.json.escape,
        spaces: settings.json.spaces,
        replacer: settings.json.replacer,
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
        for (let i = 0; i < workers; i++)
          cluster.fork();

        return this;
      }

      this._instance = SERVER.createServer(OPTIONS, listener);

      return this;
    }

    this._instance = SERVER.createServer(OPTIONS, listener);
  }

  get listening() {
    return this._listening;
  }

  start(callback?: Server.Callback) {
    this._listening = true;

    const instance = this._instance;

    if (instance) instance.listen(this._port, this._host, callback && (() => callback(this)));

    return this;
  }

  stop(callback?: Server.Callback) {
    this._listening = false;

    const instance = this._instance;

    if (instance) instance.close(callback && (() => callback(this)));

    return this;
  }

  reload(callback?: Server.Callback) {
    if (this._listening)
      return this.stop((server) => server.start(callback));

    return this.start(callback);
  }

  on(event: EventEmitter.Event, listener: (...args: any[]) => void) {
    events.on(event, listener);

    return this;
  }
}

export = Server;
