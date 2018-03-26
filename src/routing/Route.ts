import * as http from "http";
import { Encapsulation } from "../exeptions";
import httpMethods from "./httpMethods";

declare module Route {
  export type Controller =
    (
      requset: http.IncomingMessage,
      response: http.ServerResponse,
      next: () => void,
      ...rest: any[],
    ) => any;

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
    controller: Encapsulation;
  }
}

declare interface Route {
  [key: string]: any;

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
}

class Route {
  routes = {} as Route.Routes;

  protected _prefix: string;

  constructor(prefix: string = "") {
    this._prefix = prefix;

    httpMethods.map((method) => {
      this.routes[method] = [];

      this[method.toLowerCase()] =
        (path: string, ...controllers: Route.Controller[]) => this._push(method, path, ...controllers);
    });
  }

  protected _push(method: string, path: string, ...controllers: Route.Controller[]) {
    path = `${this._prefix}${path}`.replace(/\/$/, "");

    controllers.map((controller) =>
      this.routes[method].push({
        path,
        controller: new Encapsulation(
          (req, res, next: () => void, ...args: any[],
          ) => controller(req, res, next, ...args)),
      }),
    );

    return this;
  }

  any(path: string, ...controllers: Route.Controller[]) {
    httpMethods.map((method) => this._push(method, path, ...controllers));

    return this;
  }

  oneOf(methods: string[], path: string, ...controllers: Route.Controller[]) {
    methods.map((method) => this._push(method.toUpperCase(), path, ...controllers));

    return this;
  }

  /**
   *
   * @param {String|Route|Function} [path=(function())]
   * @param {Function} [middlewares=(function())[]]
   */
  use(path: string | Route | Route.Controller, ...middlewares: Route.Controller[]) {
    if (path instanceof Route) {
      const _routes = path.routes;

      httpMethods.map((method) => this._routes[method].push(..._routes[method]));
    } else {
      let _path = "(.*)";
      let _middlewares = <Route.Controller[]>[path, ...middlewares];

      if (String.isInstance(path)) {
        _path = `${path}${_path}`;
        _middlewares = middlewares;
      }

      this.any(_path, ..._middlewares);
    }

    return this;
  }
}

export = Route;
