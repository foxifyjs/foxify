import {
  Request,
  requestSettings,
  Response,
  responseSettings,
} from "@foxify/http";
import * as cluster from "cluster";
import * as http from "http";
import * as https from "https";
import Foxify from ".";
import { Engine } from "./view";

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Server {
  export interface Settings extends Foxify.Settings {
    view?: Engine;
  }

  export type Listener = (request: Request, response: Response) => void;

  export type Callback = (server: Server) => void;
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

    requestSettings(settings as any);
    responseSettings(settings as any);

    const OPTIONS: any = { IncomingMessage: Request, ServerResponse: Response };

    if (isHttps) {
      OPTIONS.cert = settings["https.cert"];
      OPTIONS.key = settings["https.key"];
    }

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
}

export = Server;
