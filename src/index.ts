import "./bootstrap";
import * as cluster from "cluster";
import * as http from "http";
import * as os from "os";
import * as serveStatic from "serve-static";
import * as constants from "./constants";
import { init, query } from "./middleware";
import { request, response } from "./patches";
import { httpMethods, Route, Router } from "./routing";
import * as utils from "./utils";
import { Engine } from "./view";

module Foxify {
  export interface Options {
    "x-powered-by": boolean;
    "content-length": boolean;
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
    json: {
      replacer?: (...args: any[]) => any,
      spaces?: number,
    };
    query: {
      parser?: (...args: any[]) => any,
    };
  }
}

interface Foxify {
  get(setting: string): any;
  get(path: string, ...controllers: Route.Controller[]): this;

  post(path: string, ...controllers: Route.Controller[]): this;
  put(path: string, ...controllers: Route.Controller[]): this;
  head(path: string, ...controllers: Route.Controller[]): this;
  delete(path: string, ...controllers: Route.Controller[]): this;
  options(path: string, ...controllers: Route.Controller[]): this;
  trace(path: string, ...controllers: Route.Controller[]): this;
  copy(path: string, ...controllers: Route.Controller[]): this;
  lock(path: string, ...controllers: Route.Controller[]): this;
  mkcol(path: string, ...controllers: Route.Controller[]): this;
  move(path: string, ...controllers: Route.Controller[]): this;
  purge(path: string, ...controllers: Route.Controller[]): this;
  propfind(path: string, ...controllers: Route.Controller[]): this;
  proppatch(path: string, ...controllers: Route.Controller[]): this;
  unlock(path: string, ...controllers: Route.Controller[]): this;
  report(path: string, ...controllers: Route.Controller[]): this;
  mkactivity(path: string, ...controllers: Route.Controller[]): this;
  checkout(path: string, ...controllers: Route.Controller[]): this;
  merge(path: string, ...controllers: Route.Controller[]): this;
  ["m-search"](path: string, ...controllers: Route.Controller[]): this;
  notify(path: string, ...controllers: Route.Controller[]): this;
  subscribe(path: string, ...controllers: Route.Controller[]): this;
  unsubscribe(path: string, ...controllers: Route.Controller[]): this;
  patch(path: string, ...controllers: Route.Controller[]): this;
  search(path: string, ...controllers: Route.Controller[]): this;
  connect(path: string, ...controllers: Route.Controller[]): this;

  use(route: Route): this;
  use(...controllers: Route.Controller[]): this;
  use(path: string, options: Route.RouteOptions | Route.Controller, ...controllers: Route.Controller[]): this;
}

class Foxify {
  static constants = constants;
  static Route = Route;
  static static = serveStatic;

  static dotenv = (dotenv: string) => {
    if (!utils.string.isString(dotenv))
      throw new TypeError(`Expected 'dotenv' to be an string, got ${typeof dotenv} instead`);

    require("dotenv").config({
      path: dotenv,
    });
  }

  private _options: Foxify.Options = {
    ["x-powered-by"]: true,
    ["content-length"]: true,
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
    httpMethods.map((method) => {
      method = method.toLowerCase();

      if (!(this as { [key: string]: any })[method])
        (this as { [key: string]: any })[method] = (path: string, ...controllers: Route.Controller[]) => {
          const route = new Route();

          route[method](path, ...controllers);

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
    options: Route.RouteOptions | Route.Controller,
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
      ["x-powered-by", "content-length", "routing.strict", "routing.sensitive", "json.escape"], option))
      throw new TypeError(`Unknown option '${option}'`);

    this._set(option, true, this._options);

    return this;
  }

  disable(option: string) {
    if (!utils.string.isString(option))
      throw new TypeError("Argument 'option' should be an string");

    if (!utils.array.contains(
      ["x-powered-by", "content-length", "routing.strict", "routing.sensitive", "json.escape"], option))
      throw new TypeError(`Unknown option '${option}'`);

    this._set(option, false, this._options);

    return this;
  }

  enabled(option: string): boolean {
    if (!utils.string.isString(option))
      throw new TypeError("Argument 'option' should be an string");

    if (!utils.array.contains(
      ["x-powered-by", "content-length", "routing.strict", "routing.sensitive", "json.escape"], option))
      throw new TypeError(`Unknown option '${option}'`);

    const keys = option.split(".");

    let _opt: any = this._options;

    keys.map((key) => {
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
    if (controllers.length === 0) {
      const setting = path;

      if (!utils.string.isString(setting))
        throw new TypeError("'setting' should be an string");

      if (!utils.array.contains(
        ["env", "url", "port", "workers", "json.spaces", "json.replacer", "query.parser"], setting))
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

  /* handle view */
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
    this._use(
      init(this),
      query(this),
    );

    /* apply http patches */
    request(http.IncomingMessage, this);
    response(http.ServerResponse, this);
    Engine.responsePatch(http.ServerResponse, this._view);

    /* initialize the router with provided options and settings */
    this._router.initialize(this);

    /* apply workers */
    const workers = this.get("workers");
    if (workers > 1) {
      if (cluster.isMaster) {
        for (let i = 0; i < workers; i++) cluster.fork();

        return;
      }

      /* no server fail at any cost ;) */
      process.on("uncaughtException", (err) => console.error(`Caught exception (worker pid: ${process.pid}): `, err))
        .on("unhandledRejection", (err) => console.warn(`Caught rejection (worker pid: ${process.pid}): `, err));

      http.createServer((req, res) => this._router.route(req, res))
        .listen(this.get("port"), this.get("url"), callback);

      return;
    }

    /* no server fail at any cost ;) */
    process.on("uncaughtException", (err) => console.error("Caught exception: ", err))
      .on("unhandledRejection", (err) => console.warn("Caught rejection: ", err));

    http.createServer((req, res) => this._router.route(req, res))
      .listen(this.get("port"), this.get("url"), callback);
  }
}

export = Foxify;
