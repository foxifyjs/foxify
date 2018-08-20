import * as pathToRegExp from "path-to-regexp";
import * as fastStringify from "fast-json-stringify";
import httpMethods from "./httpMethods";
import * as Route from "./Route";
import * as Request from "../Request";
import * as Response from "../Response";
import { Encapsulation } from "../exceptions";
import * as Fox from "../index";
import * as utils from "../utils";

module Router { }

class Router {
  protected _routes = {} as Route.Routes;

  constructor() {
    httpMethods.map((method) => this._routes[method] = []);
  }

  protected _next = (
    req: Request,
    res: Response,
    url: string,
    routes: Route.RouteObject[],
    length = routes.length,
    index = 0
  ) => {
    for (let i = index; i < length; i++) {
      const { path, controller, options: { schema } } = routes[i];

      const params = (path as RegExp).exec(url);

      if (params) {
        const next = () => this._safeNext.run(req, res, url, routes, length, i + 1);

        req.next = next;

        res.stringify = schema && schema.response;

        return controller.run(req, res, next, ...utils.array.tail(params));
      }
    }

    throw new HttpException(HTTP.NOT_FOUND);
  }

  protected _safeNext = new Encapsulation(this._next);

  initialize(app: Fox) {
    const strict = app.enabled("routing.strict");
    const sensitive = app.enabled("routing.sensitive");

    httpMethods.forEach((method) => this._routes[method] = this._routes[method].map((route) => {
      const options = route.options;

      const schema: { response: { [statusCode: number]: any } } | undefined = options.schema;

      if (schema)
        schema.response = utils.object.map(schema.response, (value) => fastStringify(value));

      return {
        ...route,
        options: {
          ...options,
          schema,
        },
        path: pathToRegExp(route.path, [], { strict, sensitive }),
      };
    }));
  }

  prepend(routes: Route.Routes) {
    httpMethods.forEach((method) => this._routes[method] = [...routes[method], ...this._routes[method]]);
  }

  push(routes: Route.Routes) {
    httpMethods.forEach((method) => this._routes[method].push(...routes[method]));
  }

  route(req: Request, res: Response) {
    this._safeNext.run(req, res, req.path, this._routes[req.method as string]);
  }
}

export = Router;
