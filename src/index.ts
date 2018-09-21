import "./bootstrap";
import * as os from "os";
import * as serveStatic from "serve-static";
import * as constants from "./constants";
import { init } from "./middlewares";
import { httpMethods, Route, Router } from "./routing";
import * as utils from "./utils";
import * as Server from "./Server";
import * as IncomingRequest from "./Request";
import * as ServerResponse from "./Response";
import { Engine } from "./view";

module Foxify {
  export interface Options {
    https: boolean;
    "x-powered-by": boolean;
    routing: {
      strict: boolean,
      sensitive: boolean,
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
  }

  export type Request = IncomingRequest;
  export type Response = ServerResponse;
}

interface Foxify extends Route.MethodFunctions<Foxify> {
  get(setting: string): any;
  get(path: string, options: Route.RouteOptions | Route.Controller, ...controllers: Route.Controller[]): this;

  use(route: Route): this;
  use(...controllers: Route.Controller[]): this;
  use(path: string, options: Route.RouteOptions | Route.Controller, ...controllers: Route.Controller[]): this;
}

class Foxify {
  static constants = constants;
  static Route = Route;
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
      strict: false,
      sensitive: true,
    },
    json: {
      escape: false,
    },
  };

  private _settings: Foxify.Settings = {
    env: process.env.NODE_ENV || "production",
    url: process.env.APP_URL || "localhost",
    port: process.env.APP_PORT ? +process.env.APP_PORT : 3000,
    workers: process.env.WORKERS ? +process.env.WORKERS : os.cpus().length,
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
  };

  private _router = new Router();

  private _view?: Engine;

  constructor() {
    /* apply http routing methods */
    httpMethods.forEach((method) => {
      method = method.toLowerCase();

      if ((this as any)[method]) return;

      (this as any)[method] =
        (path: string, options: Route.RouteOptions | Route.Controller, ...controllers: Route.Controller[]) => {
          const route = new Route();

          route[method](path, options, ...controllers);

          this._router.push(route.routes);

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

  /* handle built-in middlewares */
  private _use(
    path: string | Route | Route.Controller,
    options?: Route.RouteOptions | Route.Controller,
    ...middlewares: Route.Controller[]) {
    if (path instanceof Route)
      this._router.push(path.routes);
    else {
      const route = new Route();

      route.use(path, options, ...middlewares);

      this._router.prepend(route.routes);
    }

    return this;
  }

  /* handle options */
  enable(option: string) {
    if (!utils.string.isString(option))
      throw new TypeError("Argument 'option' should be an string");

    if (!utils.array.contains(
      ["https", "x-powered-by", "routing.strict", "routing.sensitive", "json.escape"], option))
      throw new TypeError(`Unknown option '${option}'`);

    this._set(option, true, this._options);

    return this;
  }

  disable(option: string) {
    if (!utils.string.isString(option))
      throw new TypeError("Argument 'option' should be an string");

    if (!utils.array.contains(
      ["https", "x-powered-by", "routing.strict", "routing.sensitive", "json.escape"], option))
      throw new TypeError(`Unknown option '${option}'`);

    this._set(option, false, this._options);

    return this;
  }

  enabled(option: string): boolean {
    if (!utils.string.isString(option))
      throw new TypeError("Argument 'option' should be an string");

    if (!utils.array.contains(
      ["https", "x-powered-by", "routing.strict", "routing.sensitive", "json.escape"], option))
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

  get(path: string, options?: Route.RouteOptions | Route.Controller, ...controllers: Route.Controller[]): any {
    if (!options) {
      const setting = path;

      if (!utils.string.isString(setting))
        throw new TypeError("'setting' should be an string");

      if (!utils.array.contains(
        ["env", "url", "port", "workers", "https.cert", "https.key",
          "json.spaces", "json.replacer", "query.parser"], setting))
        throw new TypeError(`Unknown setting '${setting}'`);

      const keys = setting.split(".");

      let _setting: { [key: string]: any } | boolean = this._settings;

      keys.map((key) => {
        if (!utils.object.isObject(_setting)) throw new Error("Unknown setting");

        _setting = (_setting as { [key: string]: any })[key];
      });

      return _setting;
    }

    if (!utils.string.isString(path))
      throw new TypeError("'path' should be an string");

    const route = new Route();

    route.get(path, options as Route.RouteOptions | Route.Controller, ...controllers);

    this._router.push(route.routes);

    return this;
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

  /* handle middlewares */
  use(
    path: string | Route | Route.Controller,
    options?: Route.RouteOptions | Route.Controller,
    ...controllers: Route.Controller[]) {
    if (path instanceof Route)
      this._router.push(path.routes);
    else {
      const route = new Route();

      route.use(path, options as Route.RouteOptions | Route.Controller, ...controllers);

      this._router.push(route.routes);
    }

    return this;
  }

  start(callback?: () => void) {
    if (callback && !utils.function.isFunction(callback))
      throw new TypeError(`Expected 'callback' to be a function, got ${typeof callback} instead`);

    /* set node env */
    process.env.NODE_ENV = this.get("env");

    /* apply built-in middlewares */
    this._use(init(this));

    /* initialize the router with provided options and settings */
    this._router.initialize(this);

    const server = new Server(
      this._options,
      {
        ...this._settings,
        view: this._view,
      },
      (req, res) => this._router.route(req, res)
    );

    return server.start(callback);
  }
}

export = Foxify;
