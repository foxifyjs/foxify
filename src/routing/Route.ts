import * as http from "http";
import { Encapsulation } from "../exceptions";
import httpMethods from "./httpMethods";
import * as utils from "../utils";

module Route {
  export type Controller =
    (request: http.IncomingMessage, response: http.ServerResponse, next: () => void, ...rest: any[]) => any;

  export type MethodFunction<T = Route> =
    (path: string, options: Route.RouteOptions | Route.Controller, ...controllers: Route.Controller[]) => T;

  export interface MethodFunctions<T = Route> {
    get: Route.MethodFunction<T>;
    post: Route.MethodFunction<T>;
    put: Route.MethodFunction<T>;
    head: Route.MethodFunction<T>;
    delete: Route.MethodFunction<T>;
    options: Route.MethodFunction<T>;
    trace: Route.MethodFunction<T>;
    copy: Route.MethodFunction<T>;
    lock: Route.MethodFunction<T>;
    mkcol: Route.MethodFunction<T>;
    move: Route.MethodFunction<T>;
    purge: Route.MethodFunction<T>;
    propfind: Route.MethodFunction<T>;
    proppatch: Route.MethodFunction<T>;
    unlock: Route.MethodFunction<T>;
    report: Route.MethodFunction<T>;
    mkactivity: Route.MethodFunction<T>;
    checkout: Route.MethodFunction<T>;
    merge: Route.MethodFunction<T>;
    ["m-search"]: Route.MethodFunction<T>;
    notify: Route.MethodFunction<T>;
    subscribe: Route.MethodFunction<T>;
    unsubscribe: Route.MethodFunction<T>;
    patch: Route.MethodFunction<T>;
    search: Route.MethodFunction<T>;
    connect: Route.MethodFunction<T>;
  }

  export interface Routes {
    [method: string]: RouteObject[];

    get: RouteObject[];
    post: RouteObject[];
    put: RouteObject[];
    head: RouteObject[];
    delete: RouteObject[];
    options: RouteObject[];
    trace: RouteObject[];
    copy: RouteObject[];
    lock: RouteObject[];
    mkcol: RouteObject[];
    move: RouteObject[];
    purge: RouteObject[];
    propfind: RouteObject[];
    proppatch: RouteObject[];
    unlock: RouteObject[];
    report: RouteObject[];
    mkactivity: RouteObject[];
    checkout: RouteObject[];
    merge: RouteObject[];
    ["m-search"]: RouteObject[];
    notify: RouteObject[];
    subscribe: RouteObject[];
    unsubscribe: RouteObject[];
    patch: RouteObject[];
    search: RouteObject[];
    connect: RouteObject[];
  }

  export interface RouteObject {
    path: string | RegExp;
    options: Route.RouteOptions;
    controller: Encapsulation;
  }

  export type JsonSchemaType = "string" | "integer" | "number" | "array" | "object" | "boolean" | "null";

  export interface JsonSchemaProperties {
    [key: string]: {
      type: JsonSchemaType;
      default?: any;
    };
  }

  export interface JsonSchema {
    title: string;
    type: object;
    properties?: JsonSchemaProperties;
    patternProperties?: JsonSchemaProperties;
    additionalProperties?: {
      type: JsonSchemaType;
    };
    required?: string[];
  }

  export interface RouteOptions {
    schema?: JsonSchema;
  }
}

interface Route extends Route.MethodFunctions<Route> {
  [method: string]: any;
}

/**
 *
 */
class Route {
  protected _routes = {} as Route.Routes;

  protected readonly _prefix: string;

  get routes() {
    return this._routes;
  }

  /**
   * Creates a new instance of Route
   * @param {string} [prefix=""]
   */
  constructor(prefix: string = "") {
    this._prefix = prefix;

    httpMethods.map((method) => {
      this._routes[method] = [];

      this[method.toLowerCase()] =
        (path: string, options: Route.RouteOptions | Route.Controller, ...controllers: Route.Controller[]) =>
          this._push(method, path, options, ...controllers);
    });
  }

  protected _push = (
    method: string, path: string, options: Route.RouteOptions | Route.Controller,
    ...controllers: Route.Controller[]) => {
    if (utils.function.isFunction(options)) {
      utils.array.prepend(controllers, options);
      options = {};
    }

    if (!options) options = {};

    path = `${this._prefix}${path}`
      .replace("//", "/")
      .replace(/\/$/, "");

    controllers.map((controller) =>
      this._routes[method].push({
        path,
        options: options as Route.RouteOptions,
        controller: new Encapsulation(
          (req, res, next: () => void, ...args: any[]) => controller(req, res, next, ...args)),
      }),
    );

    return this;
  }

  any = (path: string, options: Route.RouteOptions | Route.Controller, ...controllers: Route.Controller[]) => {
    httpMethods.map((method) => this._push(method, path, options, ...controllers));

    return this;
  }

  oneOf = (
    methods: string[], path: string, options: Route.RouteOptions | Route.Controller,
    ...controllers: Route.Controller[]) => {
    methods.map((method) => this._push(method.toUpperCase(), path, options, ...controllers));

    return this;
  }

  /**
   *
   * @param {String|Route|Function} [path=(function())]
   * @param {Function} [middlewares=(function())[]]
   */
  use = (
    path: string | Route | Route.Controller,
    options: Route.RouteOptions | Route.Controller,
    ...middlewares: Route.Controller[]) => {
    if (path instanceof Route) {
      const _routes = path.routes;

      httpMethods.map((method) => this._routes[method].push(..._routes[method]));
    } else {
      let _path = "(.*)";
      let _middlewares = [path, ...middlewares] as Route.Controller[];

      if (utils.string.isString(path)) {
        _path = `${path}${_path}`;
        _middlewares = middlewares;
      }

      this.any(_path, options, ..._middlewares);
    }

    return this;
  }
}

export = Route;
