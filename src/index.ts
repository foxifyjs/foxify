import "./bootstrap";
import * as os from "os";
import * as serveStatic from "serve-static";
import * as inject from "@foxify/inject";
import * as qs from "qs";
import { Url } from "url";
import * as constants from "./constants";
import { httpMethods, Layer, Router } from "./routing";
import * as utils from "./utils";
import * as Server from "./Server";
import * as RequestClass from "./Request";
import * as ResponseClass from "./Response";
import events from "./events";
import { Engine } from "./view";

const OPTIONS = ["https", "x-powered-by", "routing.case-sensitive", "routing.ignore-trailing-slash",
  "routing.allow-unsafe-regex", "json.escape"];
const SETTINGS = ["env", "url", "port", "workers", "https.cert", "https.key", "json.spaces",
  "json.replacer", "query.parser", "routing.max-param-length", "subdomain.offset"];

namespace Foxify {
  export interface Options {
    https: boolean;
    "x-powered-by": boolean;
    routing: {
      "case-sensitive": boolean,
      "ignore-trailing-slash": boolean,
      "allow-unsafe-regex": boolean,
    };
    json: {
      escape: boolean,
    };
  }

  export interface Settings {
    env: string;
    url: string;
    port: number;
    workers: number;
    subdomain: {
      offset?: number,
    };
    https: {
      cert?: string,
      key?: string,
    };
    json: {
      replacer?: (...args: any[]) => any,
      spaces?: number,
    };
    query: {
      parser?: (...args: any[]) => any,
    };
    routing: {
      "max-param-length": number,
    };
  }

  export type Request = RequestClass;
  export type Response = ResponseClass;
  export type Handler = Layer.Handler;
}

interface Foxify extends Router.MethodFunctions<Foxify> {
  get(setting: string): any;
  get(path: string, options: Layer.RouteOptions | Layer.Handler, ...controllers: Layer.Handler[]): this;

  use(path: string | Layer.Handler | Router, ...handlers: Array<Layer.Handler | Router>): this;

  param(param: string, handler: Layer.Handler): this;
}

class Foxify {
  static constants = constants;
  static Router = Router;
  static static = serveStatic;

  static dotenv = (path: string) => {
    if (!utils.string.isString(path))
      throw new TypeError(`Expected 'dotenv' to be an string, got ${typeof path} instead`);

    require("dotenv").config({ path });
  }

  private _options: Foxify.Options = {
    https: false,
    ["x-powered-by"]: true,
    routing: {
      "case-sensitive": true,
      "ignore-trailing-slash": false,
      "allow-unsafe-regex": false,
    },
    json: {
      escape: false,
    },
  };

  private _settings: Foxify.Settings = {
    env: process.env.NODE_ENV || "production",
    url: process.env.APP_URL || "localhost",
    port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000,
    workers: process.env.WORKERS ? parseInt(process.env.WORKERS, 10) :
      (!process.env.NODE_ENV || process.env.NODE_ENV === "production") ? os.cpus().length : 1,
    subdomain: {
      offset: 2,
    },
    https: {
      cert: undefined,
      key: undefined,
    },
    json: {
      replacer: undefined,
      spaces: undefined,
    },
    query: {
      parser: undefined,
    },
    routing: {
      "max-param-length": 100,
    },
  };

  private _router = new Router();

  private _view?: Engine;

  constructor() {
    /* apply http routing methods */
    ["route", "use", "all"].concat(httpMethods).forEach((method) => {
      method = method.toLowerCase();

      if ((this as any)[method]) return;

      (this as any)[method] = (...args: any[]) => {
        (this._router as any)[method](...args);

        return this;
      };
    });
  }

  /* handle options & settings */
  private _set(setting: string, value: any, object: { [key: string]: any }) {
    const keys = setting.split(".");

    if (keys.length === 1)
      object[keys[0]] = value;
    else
      this._set(utils.array.tail(keys).join("."), value, object[keys[0]]);
  }

  /* handle options */
  enable(option: string) {
    if (!utils.string.isString(option))
      throw new TypeError("Argument 'option' should be an string");

    if (!utils.array.contains(OPTIONS, option))
      throw new TypeError(`Unknown option '${option}'`);

    this._set(option, true, this._options);

    return this;
  }

  disable(option: string) {
    if (!utils.string.isString(option))
      throw new TypeError("Argument 'option' should be an string");

    if (!utils.array.contains(OPTIONS, option))
      throw new TypeError(`Unknown option '${option}'`);

    this._set(option, false, this._options);

    return this;
  }

  enabled(option: string): boolean {
    if (!utils.string.isString(option))
      throw new TypeError("Argument 'option' should be an string");

    if (!utils.array.contains(OPTIONS, option))
      throw new TypeError(`Unknown option '${option}'`);

    const keys = option.split(".");

    let _opt: any = this._options;

    keys.forEach((key) => {
      if (utils.boolean.isBoolean(_opt)) throw new Error("Unknown option");

      _opt = _opt[key];
    });

    return _opt;
  }

  disabled(option: string): boolean {
    return !this.enabled(option);
  }

  /* handle settings */
  set(setting: string, value: any) {
    if (!utils.string.isString(setting))
      throw new TypeError("Argument 'setting' should be an string");

    switch (setting) {
      case "env":
      case "url":
        if (!utils.string.isString(value))
          throw new TypeError(`setting '${setting}' should be an string`);
        break;
      case "port":
      case "workers":
        if (!utils.number.isNumber(value))
          throw new TypeError(`setting '${setting}' should be a number`);
        if (value < 1)
          throw new TypeError(`setting '${setting}' should be a positive number`);
        break;
      case "https.cert":
        if (!utils.string.isString(value))
          throw new TypeError(`setting '${setting}' should be an string`);
        break;
      case "https.key":
        if (!utils.string.isString(value))
          throw new TypeError(`setting '${setting}' should be an string`);
        break;
      case "json.spaces":
      case "routing.max-param-length":
      case "subdomain.offset":
        if (value == null) break;
        if (!utils.number.isNumber(value))
          throw new TypeError(`setting '${setting}' should be a number`);
        if (value < 0)
          throw new TypeError(`setting '${setting}' should be a positive number or zero`);
        break;
      case "json.replacer":
      case "query.parser":
        if (value == null) break;
        if (!utils.function.isFunction(value))
          throw new TypeError(`setting '${setting}' should be a function`);
        break;
      default:
        throw new TypeError(`Unknown setting '${setting}'`);
    }

    this._set(setting, value, this._settings);

    return this;
  }

  get(path: string, options?: Layer.RouteOptions | Layer.Handler, ...controllers: Layer.Handler[]): any {
    if (!options) {
      const setting = path;

      if (!utils.string.isString(setting))
        throw new TypeError("'setting' should be an string");

      if (!utils.array.contains(SETTINGS, setting))
        throw new TypeError(`Unknown setting '${setting}'`);

      const keys = setting.split(".");

      let _setting: { [key: string]: any } | boolean = this._settings;

      keys.map((key) => {
        if (!utils.object.isObject(_setting)) throw new Error("Unknown setting");

        _setting = (_setting as { [key: string]: any })[key];
      });

      return _setting;
    }

    return this.use(new Router().get(path, options, ...controllers));
  }

  prettyPrint() {
    return this._router.prettyPrint();
  }

  /**
   * handle view
   * @param extension view template file extension
   * @param path the directory containing view templates
   */
  engine(extension: string, path: string, handler: () => void) {
    this._view = new Engine(path, extension, handler);

    return this;
  }

  inject(options: inject.Options | string, callback?: inject.Callback) {
    if (this.get("env") !== "test") throw new Error(`"inject" only works on testing environment`);

    this._router.initialize(this);

    if (typeof options === "string") options = { url: options };

    events.on("error", HttpException.handle);

    const opts = this._options;
    const settings = {
      ...this._settings,
      view: this._view,
    };

    const IncomingMessage = RequestClass;
    IncomingMessage.prototype.settings = {
      subdomain: {
        ...settings.subdomain,
      },
    };

    if (Object.getOwnPropertyNames(IncomingMessage.prototype).indexOf("query") === -1) {
      const queryParse: (...args: any[]) => any = settings.query.parser || qs.parse;
      Object.defineProperty(IncomingMessage.prototype, "query", {
        get() {
          return queryParse((utils.parseUrl(this) as Url).query, { allowDots: true });
        },
      });
    }

    const ServerResponse = ResponseClass;
    ServerResponse.prototype.settings = {
      engine: settings.view,
      json: {
        escape: opts.json.escape,
        spaces: settings.json.spaces,
        replacer: settings.json.replacer,
      },
    };

    return inject(
      this._router.lookup.bind(this._router) as any,
      {
        ...options,
        ServerResponse,
        IncomingMessage,
      },
      callback
    );
  }

  start(callback?: Server.Callback) {
    if (callback && !utils.function.isFunction(callback))
      throw new TypeError(`Expected 'callback' to be a function, got ${typeof callback} instead`);

    /* set node env */
    process.env.NODE_ENV = this.get("env");

    /* initialize the router with provided options and settings */
    this._router.initialize(this);

    const server = new Server(
      this._options,
      {
        ...this._settings,
        view: this._view,
      },
      this._router.lookup.bind(this._router)
    );

    return server.start(callback);
  }
}

export = Foxify;
