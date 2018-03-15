import { IncomingMessage, ServerResponse } from "http";
import { HttpExeption } from "../exeptions";
import httpMethods from "./httpMethods";
import * as pathToRegExp from "path-to-regexp";
import * as constants from "../constants";
import { Encapsulation } from "../exeptions";
import * as Route from "./Route";
import * as Fox from "../index";

declare module Router { }

class Router {
  protected _routes: Route.Routes = {};
  protected _safeNext = new Encapsulation(
    (req, res, url: string, routes: Route.RouteObject[], index = 0) => this._next(req, res, url, routes, index),
  );

  constructor() {
    httpMethods.map((method) => this._routes[method] = []);
  }

  protected _next(req: IncomingMessage, res: ServerResponse, url: string, routes: Route.RouteObject[], index = 0) {
    const length = routes.length;
    let i = index;

    for (; i < length; i++) {
      const route = routes[i];

      const params = (route.path as RegExp).exec(url);

      if (params) {
        const next = () => this._safeNext.run(req, res, url, routes, i + 1);

        req.next = next;

        return route.controller.run(req, res, next, ...params.tail());
      }
    }

    throw new HttpExeption(constants.http.NOT_FOUND);
  }

  initialize(app: Fox) {
    const strict = app.enabled("routing.strict");
    const sensitive = app.enabled("routing.sensitive");

    httpMethods.map((method) => this._routes[method] = this._routes[method].map((route) => ({
      path: pathToRegExp(route.path, [], { strict, sensitive }),
      controller: route.controller,
    })));
  }

  prepend(routes: Route.Routes) {
    httpMethods.map((method) => this._routes[method] = [...routes[method], ...this._routes[method]]);
  }

  push(routes: Route.Routes) {
    httpMethods.map((method) => this._routes[method].push(...routes[method]));
  }

  route(req: IncomingMessage, res: ServerResponse) {
    this._safeNext.run(req, res, req.path, this._routes[<string> req.method]);
  }
}

export = Router;
