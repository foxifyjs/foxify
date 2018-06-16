import { IncomingMessage, ServerResponse } from "http";
import { HttpException, Encapsulation } from "../exceptions";
import httpMethods from "./httpMethods";
import * as pathToRegExp from "path-to-regexp";
import * as constants from "../constants";
import * as fastStringify from "fast-json-stringify";
import * as Route from "./Route";
import * as Fox from "../index";
import * as utils from "../utils";

module Router { }

class Router {
  protected _routes = {} as Route.Routes;

  constructor() {
    httpMethods.map((method) => this._routes[method] = []);
  }

  protected _next = (
    req: IncomingMessage,
    res: ServerResponse,
    url: string,
    routes: Route.RouteObject[],
    index = 0,
  ) => {
    const length = routes.length;
    let i = index;

    for (; i < length; i++) {
      const route = routes[i];

      const params = (route.path as RegExp).exec(url);

      if (params) {
        const next = () => this._safeNext.run(req, res, url, routes, i + 1);

        req.next = next;

        res.stringify = (route.options as any).stringify;

        return route.controller.run(req, res, next, ...utils.array.tail(params));
      }
    }

    throw new HttpException(constants.http.NOT_FOUND);
  }

  protected _safeNext = new Encapsulation(this._next);

  initialize(app: Fox) {
    const strict = app.enabled("routing.strict");
    const sensitive = app.enabled("routing.sensitive");

    httpMethods.map((method) => this._routes[method] = this._routes[method].map((route) => ({
      ...route,
      options: {
        ...route.options,
        stringify: route.options.schema && fastStringify(route.options.schema),
      },
      path: pathToRegExp(route.path, [], { strict, sensitive }),
    })));
  }

  prepend(routes: Route.Routes) {
    httpMethods.map((method) => this._routes[method] = [...routes[method], ...this._routes[method]]);
  }

  push(routes: Route.Routes) {
    httpMethods.map((method) => this._routes[method].push(...routes[method]));
  }

  route(req: IncomingMessage, res: ServerResponse) {
    this._safeNext.run(req, res, req.path, this._routes[<string>req.method]);
  }
}

export = Router;
