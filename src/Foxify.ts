import inject from "@foxify/inject";
import assert from "assert";
import proxyAddr from "proxy-addr";
import qs from "qs";
import serveStatic from "serve-static";
import { Url } from "url";
import { METHODS } from "./constants/METHOD";
import events from "./events";
import { HttpException } from "./exceptions";
import RequestClass from "./Request";
import ResponseClass from "./Response";
import { Layer, Router } from "./routing";
import Server from "./Server";
import * as utils from "./utils";
import { Engine } from "./view";

const SETTINGS: Array<keyof Foxify.UserSettings> = [
  "env",
  "url",
  "port",
  "workers",
  "etag",
  "https",
  "https.cert",
  "https.key",
  "x-powered-by",
  "routing.case-sensitive",
  "routing.ignore-trailing-slash",
  "routing.allow-unsafe-regex",
  "routing.max-param-length",
  "json.escape",
  "json.replacer",
  "json.spaces",
  "jsonp.callback",
  "subdomain.offset",
  "trust.proxy",
  "query.parser",
];

namespace Foxify {
  export interface UserSettings {
    env: string;
    url: string;
    port: number;
    workers: number;
    etag?:
      | null
      | boolean
      | "weak"
      | "strong"
      | ((
          body: string | Buffer,
          encoding?: BufferEncoding,
        ) => string | undefined);
    https: boolean;
    "https.cert"?: string;
    "https.key"?: string;
    "x-powered-by": boolean;
    "routing.case-sensitive": boolean;
    "routing.ignore-trailing-slash": boolean;
    "routing.allow-unsafe-regex": boolean;
    "routing.max-param-length": number;
    "json.escape": boolean;
    "json.replacer"?: (...args: any[]) => any;
    "json.spaces"?: number;
    "jsonp.callback": string;
    "subdomain.offset": number;
    "trust.proxy":
      | boolean
      | number
      | ((ip: string, hopIndex: number) => boolean);
    "query.parser": boolean | "simple" | "extended" | ((str: string) => object);
  }

  export interface Settings {
    env: string;
    url: string;
    port: number;
    workers: number;
    etag: (
      body: string | Buffer,
      encoding?: BufferEncoding,
    ) => string | undefined;
    https: boolean;
    "https.cert"?: string;
    "https.key"?: string;
    "x-powered-by": boolean;
    "routing.case-sensitive": boolean;
    "routing.ignore-trailing-slash": boolean;
    "routing.allow-unsafe-regex": boolean;
    "routing.max-param-length": number;
    "json.escape": boolean;
    "json.replacer"?: (...args: any[]) => any;
    "json.spaces"?: number;
    "jsonp.callback": string;
    "subdomain.offset": number;
    "trust.proxy": (ip: string, hopIndex: number) => boolean;
    "query.parser": (str: string) => object;
  }

  export type Handler = Layer.Handler;
}

interface Foxify extends Router.MethodFunctions<Foxify> {
  get(setting: string): any;
  get(
    path: string,
    options: Layer.RouteOptions | Layer.Handler,
    ...controllers: Layer.Handler[]
  ): this;

  use(
    path: string | Layer.Handler | Router,
    ...handlers: Array<Layer.Handler | Router>
  ): this;

  param(param: string, handler: Layer.Handler): this;
}

class Foxify {
  public static Router = Router;
  public static static = serveStatic;

  public static dotenv(path: string) {
    utils.assertType("path", "string", path);

    require("dotenv").config({ path });
  }

  private _settings: Foxify.Settings = {
    env: process.env.NODE_ENV || "development",
    url: process.env.APP_URL || "localhost",
    port: process.env.APP_PORT ? +process.env.APP_PORT : 3000,
    workers: process.env.WORKERS ? +process.env.WORKERS : 1,
    https: false,
    "x-powered-by": true,
    "routing.allow-unsafe-regex": false,
    "routing.case-sensitive": true,
    "routing.ignore-trailing-slash": false,
    "routing.max-param-length": 100,
    "json.escape": false,
    "jsonp.callback": "callback",
    "subdomain.offset": 2,
    "query.parser": qs.parse,
    "trust.proxy": undefined as any,
    etag: undefined as any,
  };

  private _router = new Router();

  private _view?: Engine;

  constructor() {
    /* apply http routing methods */
    ["route", "use", "all"].concat(METHODS).forEach(method => {
      method = method.toLowerCase();

      if ((this as any)[method]) return;

      (this as any)[method] = (...args: any[]) => {
        (this._router as any)[method](...args);

        return this;
      };
    });

    this.set("etag", "weak");
    this.disable("trust.proxy");
  }

  public enable(setting: keyof Foxify.Settings) {
    return this.set(setting, true);
  }

  public disable(setting: keyof Foxify.Settings) {
    return this.set(setting, false);
  }

  public disabled(setting: keyof Foxify.Settings): boolean {
    return !this.get(setting);
  }

  public enabled(setting: keyof Foxify.Settings): boolean {
    return !this.disabled(setting);
  }

  public set<T extends keyof Foxify.UserSettings>(
    setting: T,
    value: Foxify.UserSettings[T],
  ) {
    switch (setting) {
      case "env":
        utils.assertType(setting, "string", value);
        break;
      case "url":
        utils.assertType(setting, "string", value);
        break;
      case "port":
        utils.assertNonNegInt(setting, value);
        break;
      case "workers":
        utils.assertPosInt(setting, value);
        break;
      case "etag":
        if (value == null || typeof value === "function") break;
        if (value === false) value = undefined as any;
        if (value === true || value === "weak") {
          value = utils.createETagGenerator(true) as any;
        } else if (value === "strong") {
          value = utils.createETagGenerator(false) as any;
        } else {
          throw new TypeError(`Unknown value for ${setting} setting: ${value}`);
        }
        break;
      case "https":
        utils.assertType(setting, "boolean", value);
        break;
      case "https.cert":
        utils.assertType(setting, "string", value);
        break;
      case "https.key":
        utils.assertType(setting, "string", value);
        break;
      case "x-powered-by":
        utils.assertType(setting, "boolean", value);
        break;
      case "routing.case-sensitive":
        utils.assertType(setting, "boolean", value);
        break;
      case "routing.ignore-trailing-slash":
        utils.assertType(setting, "boolean", value);
        break;
      case "routing.allow-unsafe-regex":
        utils.assertType(setting, "boolean", value);
        break;
      case "routing.max-param-length":
        utils.assertPosInt(setting, value);
        break;
      case "json.escape":
        utils.assertType(setting, "boolean", value);
        break;
      case "json.replacer":
        utils.assertType(setting, "function", value);
        break;
      case "json.spaces":
        utils.assertNonNegInt(setting, value);
        break;
      case "jsonp.callback":
        utils.assertType(setting, "string", value);
        break;
      case "subdomain.offset":
        utils.assertNonNegInt(setting, value);
        break;
      case "trust.proxy":
        if (value === true) {
          value = (() => true) as any;
        } else if (typeof value === "number") {
          const num = value;
          value = ((ip: string, i: number) => i < num) as any;
        } else if (typeof value !== "function") {
          if (typeof value === "string") {
            value = value.split(/ *, */) as any;
          }

          value = proxyAddr.compile((value as any) || []) as any;
        }
        break;
      case "query.parser":
        if (typeof value === "function") break;
        if (value === true || value === "simple") value = qs.parse as any;
        else if (value === false) value = (() => ({})) as any;
        else if (value === "extended") {
          value = ((str: string) =>
            qs.parse(str, { allowPrototypes: true })) as any;
        } else {
          throw new TypeError(`Unknown value for ${setting} setting: ${value}`);
        }
        break;
      default:
        throw new TypeError(
          `Expected setting to be one of [${SETTINGS}], got ${setting}`,
        );
    }

    this._settings[setting] = value as any;

    return this;
  }

  public get<T extends keyof Foxify.Settings>(setting: T): Foxify.Settings[T];
  public get(
    path: string,
    options: Layer.RouteOptions | Layer.Handler,
    ...controllers: Layer.Handler[]
  ): this;
  public get(
    path: string,
    options?: Layer.RouteOptions | Layer.Handler,
    ...controllers: Layer.Handler[]
  ): any {
    if (arguments.length === 1) {
      assert(
        SETTINGS.includes(path as keyof Foxify.Settings),
        `Expected setting to be one of [${SETTINGS}], got ${path}`,
      );

      return this._settings[path as keyof Foxify.Settings];
    }

    return this.use(new Router().get(path, options as any, ...controllers));
  }

  public prettyPrint() {
    return this._router.prettyPrint();
  }

  /**
   * handle view
   * @param extension view template file extension
   * @param path the directory containing view templates
   */
  public engine(extension: string, path: string, handler: () => void) {
    this._view = new Engine(path, extension, handler);

    return this;
  }

  public inject(options: inject.Options | string, callback?: inject.Callback) {
    assert(
      this.get("env") === "test",
      "Inject only works on the testing environment",
    );

    this._router.initialize(this);

    if (typeof options === "string") options = { url: options };

    events.on("error", HttpException.handle);

    const IncomingMessage = RequestClass;
    IncomingMessage.prototype.settings = {
      ...this._settings,
    };

    const ServerResponse = ResponseClass;
    ServerResponse.prototype.settings = {
      ...this._settings,
      view: this._view,
    };

    return inject(
      this._router.lookup.bind(this._router) as any,
      {
        ...options,
        ServerResponse,
        IncomingMessage,
      },
      callback,
    );
  }

  public start(callback?: Server.Callback) {
    utils.assertType("callback", "function", callback);

    /* set node env */
    process.env.NODE_ENV = this.get("env");

    /* initialize the router with provided options and settings */
    this._router.initialize(this);

    const server = new Server(
      {
        ...this._settings,
        view: this._view,
      },
      this._router.lookup.bind(this._router),
    );

    return server.start(callback);
  }
}

export default Foxify;
