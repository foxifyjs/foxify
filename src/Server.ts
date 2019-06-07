import * as cluster from "cluster";
import * as http from "http";
import * as https from "https";
import * as qs from "qs";
import { Url } from "url";
import Foxify from ".";
import events from "./events";
import EventEmitter from "./events/Emitter";
import { HttpException } from "./exceptions";
import Request from "./Request";
import Response from "./Response";
import { parseUrl } from "./utils";
import { Engine } from "./view";

namespace Server {
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

  constructor(settings: Server.Settings, listener: Server.Listener) {
    this._host = settings.url;
    this._port = settings.port;

    const isHttps = settings.https;
    const SERVER: any = isHttps ? https : http;

    const IncomingMessage = Request;
    IncomingMessage.prototype.settings = settings;

    const ServerResponse = Response;
    ServerResponse.prototype.settings = settings;

    const OPTIONS: any = { IncomingMessage, ServerResponse };

    if (isHttps) {
      OPTIONS.cert = settings["https.cert"];
      OPTIONS.key = settings["https.key"];
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
