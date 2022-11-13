import cluster from "cluster";
import http from "http";
import https from "https";
import {
  Request,
  requestSettings,
  Response,
  responseSettings,
} from "@foxify/http";
import { Engine } from "./view/index.js";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type Foxify from "./index.js";

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

  protected _listening = false;

  protected _port: number;

  private readonly _instance?: http.Server | https.Server;

  public constructor(settings: Server.Settings, listener: Server.Listener) {
    this._host = settings.url;
    this._port = settings.port;

    const isHttps = settings.https;
    const SERVER: any = isHttps ? https : http;

    requestSettings(settings as any);
    responseSettings(settings as any);

    const OPTIONS: any = {
      IncomingMessage: Request,
      ServerResponse : Response,
    };

    if (isHttps) {
      OPTIONS.cert = settings["https.cert"];
      OPTIONS.key = settings["https.key"];
    }

    const workers = settings.workers;

    if (workers > 1) {
      if (cluster.isPrimary) {
        for (let i = 0; i < workers; i++) cluster.fork();

        return;
      }

      this._instance = SERVER.createServer(OPTIONS, listener);

      return;
    }

    this._instance = SERVER.createServer(OPTIONS, listener);
  }

  public get listening(): boolean {
    return this._listening;
  }

  public reload(callback?: Server.Callback): this {
    if (this._listening) return this.stop(server => server.start(callback));

    return this.start(callback);
  }

  public start(callback?: Server.Callback): this {
    this._listening = true;

    const instance = this._instance;

    if (instance) {
      instance.listen(
        this._port,
        this._host,
        callback && ((): unknown => callback(this)),
      );
    }

    return this;
  }

  public stop(callback?: Server.Callback): this {
    this._listening = false;

    const instance = this._instance;

    if (instance) instance.close(callback && ((): unknown => callback(this)));

    return this;
  }

}

export default Server;
