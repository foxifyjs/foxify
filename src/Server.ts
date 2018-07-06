import * as http from "http";
import * as https from "https";
import * as cluster from "cluster";
import { request, response } from "./patches";
import * as Foxify from "./index";

module Server {
  export interface Options {
    protocol: "http" | "https";
    host: string;
    port: number;
    workers: number;
    key?: string;
    cert?: string;
  }

  export type Listener = (request: http.IncomingMessage, response: http.ServerResponse) => void;
}

class Server {
  private _instance?: http.Server | https.Server;

  protected _host: string;
  protected _port: number;

  constructor(options: Foxify.Options, settings: Foxify.Settings, listener: Server.Listener) {
    const isHttps = options.https;

    this._host = settings.url;
    this._port = settings.port;

    const SERVER: any = isHttps ? https : http;

    const IncomingMessage = request(http.IncomingMessage, options, settings);
    const ServerResponse = response(http.ServerResponse, options, settings);

    const OPTIONS: any = {
      IncomingMessage,
      ServerResponse,
    };

    if (isHttps) {
      const httpsSettings = settings.https;

      OPTIONS.cert = httpsSettings.cert;
      OPTIONS.key = httpsSettings.key;
    }

    const workers = settings.workers;

    if (workers > 1) {
      if (cluster.isMaster) {
        for (let i = 0; i < workers; i++)
          cluster.fork();

        return this;
      }

      /* no server fail at any cost ;) */
      process.on("uncaughtException", (err) => console.error("Caught exception: ", err))
        .on("unhandledRejection", (err) => console.warn("Caught rejection: ", err));

      this._instance = SERVER.createServer(OPTIONS, listener);

      return this;
    }

    /* no server fail at any cost ;) */
    process.on("uncaughtException", (err) => console.error("Caught exception: ", err))
      .on("unhandledRejection", (err) => console.warn("Caught rejection: ", err));

    this._instance = SERVER.createServer(OPTIONS, listener);
  }

  start(callback?: () => void) {
    const instance = this._instance;

    if (instance) instance.listen(this._port, this._host, callback);
  }

  stop(callback?: () => void) {
    const instance = this._instance;

    if (instance) instance.close(callback);
  }

  reload(callback?: () => void) {
    this.stop(() => this.start(callback));
  }
}

export = Server;
