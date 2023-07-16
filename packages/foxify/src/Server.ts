import cluster from "node:cluster";
import http from "node:http";
import https from "node:https";
import { config, SERVER_PROTOCOL } from "@foxify/config";
import { Request, Response } from "@foxify/http";

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Server {

  export type Listener = (request: Request, response: Response) => void;

  export type Callback = (server: Server) => void;
}

class Server {

  protected _listening = false;

  private readonly _instance?: http.Server | https.Server;

  public constructor(listener: Server.Listener) {
    const isHttps = config.server.protocol === SERVER_PROTOCOL.HTTPS;
    const SERVER: any = isHttps ? https : http;

    const OPTIONS: any = {
      IncomingMessage: Request,
      ServerResponse : Response,
    };

    if (isHttps) {
      OPTIONS.cert = config.server.cert;
      OPTIONS.key = config.server.key;
    }

    const workers = config.workers;

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
        config.server.port,
        config.server.hostname,
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
