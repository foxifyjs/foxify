import * as assert from "assert";
import * as fastStringify from "fast-json-stringify";
import isRegexSafe = require("safe-regex");
import * as Foxify from "..";
import { Encapsulation } from "../exceptions";
import { init } from "../middlewares";
import Request from "../Request";
import Response from "../Response";
import {
  array,
  decodeURIComponent as fastDecode,
  function as func,
  isHandler,
  object,
  string,
} from "../utils";
import httpMethods, { Method } from "./httpMethods";
import Layer, { TYPES } from "./Layer";

const OPTIONS = { schema: { response: {} } };

/*
  Char codes:
    "#": 35
    "*": 42
    "-": 45
    "/": 47
    ":": 58
    ";": 59
    "?": 63
*/

function foxify_not_found() {
  throw new HttpException(HTTP.NOT_FOUND);
}

const EMPTY_HANDLE = {
  handlers: [new Encapsulation(foxify_not_found)],
  options: OPTIONS,
  params: {},
};

const pathMatchesMiddleware = (path: string, middleware: string) => {
  const middlewares = middleware.replace(/(^\/|\/$)/g, "").split("/");
  const paths = path.replace(/(^\/|\/$)/g, "").split("/");
  const length = middlewares.length;

  for (let i = 0; i < length; i++) {
    const j = middlewares[i];
    const k = paths[i];

    if (j === "*") {
      if (i === length - 1) return true;

      continue;
    }

    if (!k || j !== k) return false;

    if (i === length - 1) return true;
  }

  return false;
};

const getWildcardNode = (
  layer: Layer | null,
  method: Method,
  path: string,
  len: number,
) => {
  if (layer === null) return EMPTY_HANDLE;

  const decoded = fastDecode(path.slice(-len));

  if (decoded === null) return EMPTY_HANDLE;

  const handler = layer.getHandler(method);

  if (handler.handlersLength > 0) {
    return {
      handlers: handler.handlers,
      options: handler.options,
      params: { "*": decoded },
    };
  }

  return EMPTY_HANDLE;
};

const getClosingParenthesesPosition = (path: string, idx: number) => {
  // `path.indexOf()` will always return the first position of the closing parenthese,
  // but it's inefficient for grouped or wrong regexp expressions.
  // see issues #62 and #63 for more info

  let parentheses = 1;

  while (idx < path.length) {
    idx++;

    // ignore skipped chars
    if (path[idx] === "\\") {
      idx++;

      continue;
    }

    if (path[idx] === ")") parentheses--;
    else if (path[idx] === "(") parentheses++;

    if (!parentheses) return idx;
  }

  throw new TypeError(`Invalid regexp expression in "${path}"`);
};

namespace Router {
  export interface Middleware {
    path: string;
    handlers: Layer.Handler[];
  }

  export interface Route {
    method: Method;
    path: string;
    opts: Layer.RouteOptions;
    handlers: Layer.Handler[];
    middlewares: Layer.Handler[];
  }

  export interface Params {
    [param: string]: Layer.Handler;
  }

  export type MethodFunction<T = Router> = (
    path: string,
    options: Layer.RouteOptions | Layer.Handler | Layer.Handler[],
    ...handlers: Array<Layer.Handler | Layer.Handler[]>
  ) => T;

  export type PathMethodFunction<T = Router> = (
    options: Layer.RouteOptions | Layer.Handler | Layer.Handler[],
    ...handlers: Array<Layer.Handler | Layer.Handler[]>
  ) => T;

  export interface MethodFunctions<T = Router> {
    get: Router.MethodFunction<T>;
    post: Router.MethodFunction<T>;
    put: Router.MethodFunction<T>;
    head: Router.MethodFunction<T>;
    delete: Router.MethodFunction<T>;
    options: Router.MethodFunction<T>;
    trace: Router.MethodFunction<T>;
    copy: Router.MethodFunction<T>;
    lock: Router.MethodFunction<T>;
    mkcol: Router.MethodFunction<T>;
    move: Router.MethodFunction<T>;
    purge: Router.MethodFunction<T>;
    propfind: Router.MethodFunction<T>;
    proppatch: Router.MethodFunction<T>;
    unlock: Router.MethodFunction<T>;
    report: Router.MethodFunction<T>;
    mkactivity: Router.MethodFunction<T>;
    checkout: Router.MethodFunction<T>;
    merge: Router.MethodFunction<T>;
    "m-search": Router.MethodFunction<T>;
    notify: Router.MethodFunction<T>;
    subscribe: Router.MethodFunction<T>;
    unsubscribe: Router.MethodFunction<T>;
    patch: Router.MethodFunction<T>;
    search: Router.MethodFunction<T>;
    connect: Router.MethodFunction<T>;
  }

  export type PathMethods<T = any> = {
    [method in Method]: Router.PathMethodFunction<T>
  };
}

interface Router extends Router.MethodFunctions {}

class Router {
  public static isRouter = (arg: any): arg is Router => arg instanceof Router;

  public tree = new Layer();

  public middlewares: Router.Middleware[] = [];

  public routes: Router.Route[] = [];

  public params: Router.Params = {};

  public caseSensitive = true;

  public ignoreTrailingSlash = false;

  public maxParamLength = 100;

  public allowUnsafeRegex = false;

  protected _safeNext: Encapsulation;

  constructor(public prefix = "") {
    assert(typeof prefix === "string", "Prefix should be a string");

    httpMethods.forEach(method => {
      const methodName = method.toLowerCase();

      assert(
        !(this as any)[methodName],
        `Method already exists: ${methodName}`,
      );

      (this as any)[methodName] = (
        path: string,
        opts: Layer.RouteOptions | Layer.Handler | Layer.Handler[],
        ...handlers: Array<Layer.Handler | Layer.Handler[]>
      ) => this.on(method, path, opts, ...handlers);
    });

    this._safeNext = new Encapsulation(this._next);
  }

  public initialize(app: Foxify) {
    this.caseSensitive = app.enabled("routing.case-sensitive");
    this.ignoreTrailingSlash = app.enabled("routing.ignore-trailing-slash");
    this.allowUnsafeRegex = app.enabled("routing.allow-unsafe-regex");
    this.maxParamLength = app.get("routing.max-param-length");

    /* apply built-in middlewares */
    this._use(init(app) as any);

    const middlewares = this.middlewares.reduce(
      (prev, { path, handlers }) => {
        httpMethods.forEach(method =>
          prev.push({
            method,
            path,
            handlers: [],
            middlewares: handlers,
            opts: OPTIONS,
          }),
        );

        return prev;
      },
      [] as Router.Route[],
    );

    let routes = this.routes.reduce(
      (prev, { method, path, opts, handlers }) => {
        const options = opts;

        const schema = options.schema;

        if (schema) {
          schema.response = object.mapValues(schema.response || {}, value =>
            fastStringify(value),
          ) as any;
        }

        options.schema = schema;

        const matchedMiddlewares = middlewares
          .filter(
            middleware =>
              method === middleware.method &&
              pathMatchesMiddleware(path, middleware.path),
          )
          .reduce(
            (prev, { middlewares }) => prev.concat(middlewares),
            [] as Layer.Handler[],
          );

        const newRoutes = [
          {
            handlers,
            method,
            path,
            middlewares: matchedMiddlewares,
            opts: options,
          },
        ];

        if (this.ignoreTrailingSlash && path !== "/" && !path.endsWith("*")) {
          let newRoute = {
            handlers,
            method,
            middlewares: matchedMiddlewares,
            opts: options,
            path: `${path}/`,
          };

          if (path.endsWith("/")) {
            newRoute = {
              handlers,
              method,
              path: path.slice(0, -1),
              middlewares: matchedMiddlewares,
              opts: options,
            };
          }

          newRoutes.push(newRoute);
        }

        return prev.concat(newRoutes);
      },
      [] as Router.Route[],
    );

    const filteredMiddleware = middlewares.filter(
      middleware => middleware.path === "*",
    );
    if (filteredMiddleware) routes = filteredMiddleware.concat(routes);

    routes = routes.map(route => {
      route.handlers = route.handlers.concat([foxify_not_found]);

      return route;
    });

    routes
      .concat(
        middlewares
          .filter(middleware => !/\*/.test(middleware.path))
          .map(middleware => {
            middleware.handlers = middleware.handlers.concat([
              foxify_not_found,
            ]);

            return middleware;
          }),
      )
      .forEach(({ method, path, opts, handlers, middlewares }) => {
        const params = [];
        let j = 0;

        for (let i = 0, len = path.length; i < len; i++) {
          // search for parametric or wildcard routes
          // parametric route
          if (path.charCodeAt(i) === 58) {
            let nodeType = TYPES.PARAM;
            let staticPart = path.slice(0, i);
            j = i + 1;

            if (!this.caseSensitive) staticPart = staticPart.toLowerCase();

            // add the static part of the route to the tree
            this._insert(
              method,
              staticPart,
              TYPES.STATIC,
              opts,
              undefined,
              undefined,
              undefined,
              null,
            );

            // isolate the parameter name
            let isRegex = false;
            while (i < len && path.charCodeAt(i) !== 47) {
              isRegex = isRegex || path[i] === "(";

              if (isRegex) {
                i = getClosingParenthesesPosition(path, i) + 1;
                break;
              } else if (path.charCodeAt(i) !== 45) i++;
              else break;
            }

            if (isRegex && (i === len || path.charCodeAt(i) === 47)) {
              // REGEX
              nodeType = 3;
            } else if (i < len && path.charCodeAt(i) !== 47) {
              // MULTI_PARAM
              nodeType = 4;
            }

            const parameter = path.slice(j, i);
            let regex: any = isRegex
              ? parameter.slice(parameter.indexOf("("), i)
              : null;

            if (isRegex) {
              regex = new RegExp(regex);

              if (!this.allowUnsafeRegex) {
                assert(
                  isRegexSafe(regex),
                  `The regex "${regex.toString()}" is not safe!`,
                );
              }
            }

            params.push(
              parameter.slice(0, isRegex ? parameter.indexOf("(") : i),
            );

            path = path.slice(0, j) + path.slice(i);
            i = j;
            len = path.length;

            // if the path is ended
            if (i === len) {
              return this._insert(
                method,
                path.slice(0, i),
                nodeType,
                opts,
                params,
                handlers,
                middlewares,
                regex,
              );
            }

            // add the parameter and continue with the search
            this._insert(
              method,
              path.slice(0, i),
              nodeType,
              opts,
              params,
              undefined,
              undefined,
              regex,
            );

            i--;
            // wildcard route
          } else if (path.charCodeAt(i) === 42) {
            this._insert(
              method,
              path.slice(0, i),
              TYPES.STATIC,
              opts,
              undefined,
              undefined,
              undefined,
              null,
            );
            // add the wildcard parameter
            params.push("*");
            return this._insert(
              method,
              path.slice(0, len),
              TYPES.MATCH_ALL,
              opts,
              params,
              handlers,
              middlewares,
              null,
            );
          }
        }

        if (!this.caseSensitive) path = path.toLowerCase();

        // static route
        return this._insert(
          method,
          path,
          TYPES.STATIC,
          opts,
          params,
          handlers,
          middlewares,
          null,
        );
      });

    return this;
  }

  public on(
    method: Method | Method[],
    path: string,
    opts: Layer.RouteOptions | Layer.Handler | Layer.Handler[],
    ...handlers: Array<Layer.Handler | Layer.Handler[]>
  ) {
    if (func.isFunction(opts) || Array.isArray(opts)) {
      handlers = [opts].concat(handlers as any);
      opts = {} as Layer.RouteOptions;
    }

    handlers = array.deepFlatten(handlers);

    handlers = array.compact(handlers);

    // path validation
    assert(typeof path === "string", "Path should be a string");
    assert(`${this.prefix}${path}`.length > 0, "The path could not be empty");
    assert(
      path === "" || path[0] === "/" || path[0] === "*",
      "The first character of a path should be `/` or `*`",
    );
    // handler validation
    handlers.forEach(handler =>
      assert(isHandler(handler), "Handler should be a function"),
    );

    return this._on(method, path, opts as any, handlers as any);
  }

  public route(path: string): Router.PathMethods<Router.PathMethods> {
    const ROUTE = httpMethods.reduce(
      (prev, method) => {
        const methodName = method.toLowerCase();

        assert(
          !prev[methodName],
          `Method already exists: ${methodName}`,
        );

        prev[methodName] = (
          opts: Layer.RouteOptions | Layer.Handler | Layer.Handler[],
          ...handlers: Array<Layer.Handler | Layer.Handler[]>
        ) => {
          this.on(method, path, opts, ...handlers);

          return ROUTE;
        };

        return prev;
      },
      {} as any,
    );

    return ROUTE;
  }

  public all(
    path: string,
    opts: Layer.RouteOptions | Layer.Handler | Layer.Handler[],
    ...handlers: Array<Layer.Handler | Layer.Handler[]>
  ) {
    return this.on(httpMethods, path, opts, ...handlers);
  }

  public use(
    path: string | Layer.Handler | Layer.Handler[] | Router | Router[],
    ...handlers: Array<Layer.Handler | Layer.Handler[] | Router | Router[]>
  ) {
    if (!string.isString(path)) {
      handlers = [path].concat(handlers);
      path = "*";
    }

    handlers = array.deepFlatten(handlers);

    handlers = array.compact(handlers);

    const routers = handlers.filter(Router.isRouter);

    handlers = handlers.filter(handler => !Router.isRouter(handler));

    // path validation
    assert(typeof path === "string", "Path should be a string");
    assert(`${this.prefix}${path}`.length > 0, "The path could not be empty");
    assert(
      path === "" || path[0] === "/" || path[0] === "*",
      "The first character of a path should be `/` or `*`",
    );
    // handler validation
    handlers.forEach(handler =>
      assert(isHandler(handler), "Handler should be a function"),
    );

    const middlewarePrefix =
      this.prefix === ""
        ? path
        : path === "*"
        ? `${this.prefix}/${path}`
        : `${this.prefix}${path}`;
    const index = this.middlewares.findIndex(
      middleware => middlewarePrefix === middleware.path,
    );

    if (index === -1) {
      this.middlewares.push({
        path: middlewarePrefix,
        handlers: handlers as Layer.Handler[],
      });
    } else {
      this.middlewares[index].handlers.push(...(handlers as Layer.Handler[]));
    }

    const prefix = `${this.prefix}${path === "*" ? "" : path}`;
    routers.forEach(router => {
      router.middlewares.forEach(middleware =>
        this.use(`${prefix}${middleware.path}`, ...middleware.handlers),
      );
      this.routes = this.routes.concat(
        router.routes.map(route => ({
          ...route,
          path: `${prefix}${route.path}`,
        })),
      );
      this.params = Object.assign({}, this.params, router.params);
    });

    return this;
  }

  public param(param: string, handler: Layer.Handler) {
    // path validation
    assert(typeof param === "string", "Param should be a string");
    assert(param.length > 0, "The param could not be empty");
    assert(
      !/\//.test(param),
      "The first character of a param shouldn't have `/`",
    );
    // handler validation
    assert(isHandler(handler), "Handler should be a function");

    this.params[param] = handler;

    return this;
  }

  public reset() {
    this.tree = new Layer();
    this.middlewares = [];
    this.routes = [];
    this.params = {};

    return this;
  }

  public lookup(req: Request, res: Response) {
    const handle = this.find(req.method as Method, req.path);

    req.params = handle.params;

    res.stringify = handle.options.schema.response;

    this._safeNext.run(req, res, handle.handlers);
  }

  public find(method: Method, path: string) {
    if (!this.caseSensitive) path = path.toLowerCase();

    const maxParamLength = this.maxParamLength;
    const originalPath = path;
    const params = [];
    let currentNode = this.tree;
    let wildcardNode = null;
    let pathLenWildcard = 0;
    let decoded = null;
    let pindex = 0;
    let i = 0;

    while (true) {
      const prefix = currentNode.prefix;
      let pathLen = path.length;

      // found the route
      if (pathLen === 0 || path === prefix) {
        const handle = currentNode.getHandler(method);

        if (handle.handlersLength > 0) {
          const paramsObj: any = {};

          if (handle.paramsLength > 0) {
            const paramNames = handle.params;

            for (i = 0; i < handle.paramsLength; i++) {
              paramsObj[paramNames[i]] = params[i];
            }
          }

          return {
            handlers: handle.handlers,
            options: handle.options,
            params: paramsObj,
          };
        }
      }

      const prefixLen = prefix.length;
      let len = 0;

      // search for the longest common prefix
      i = pathLen < prefixLen ? pathLen : prefixLen;
      while (len < i && path.charCodeAt(len) === prefix.charCodeAt(len)) len++;

      const previousPath = path;

      if (len === prefixLen) {
        path = path.slice(len);
        pathLen = path.length;
      }

      let node = currentNode.findChild(path, method);

      if (node === null) {
        node = currentNode.parametricBrother;

        if (node === null) {
          return getWildcardNode(
            wildcardNode,
            method,
            originalPath,
            pathLenWildcard,
          );
        }

        path = previousPath;
        pathLen = previousPath.length;
        len = prefixLen;
      }

      const kind = node.kind;

      // static route
      if (kind === TYPES.STATIC) {
        // if exist, save the wildcard child
        if (currentNode.wildcardChild !== null) {
          wildcardNode = currentNode.wildcardChild;
          pathLenWildcard = pathLen;
        }

        currentNode = node;
        continue;
      }

      if (len !== prefixLen) {
        return getWildcardNode(
          wildcardNode,
          method,
          originalPath,
          pathLenWildcard,
        );
      }

      // if exist, save the wildcard child
      if (currentNode.wildcardChild !== null) {
        wildcardNode = currentNode.wildcardChild;
        pathLenWildcard = pathLen;
      }

      // parametric route
      if (kind === TYPES.PARAM) {
        currentNode = node;
        i = path.indexOf("/");

        if (i === -1) i = pathLen;

        if (i > maxParamLength) return EMPTY_HANDLE;

        decoded = fastDecode(path.slice(0, i));

        if (decoded === null) return EMPTY_HANDLE;

        params[pindex++] = decoded;
        path = path.slice(i);

        continue;
      }

      // wildcard route
      if (kind === TYPES.MATCH_ALL) {
        decoded = fastDecode(path);

        if (decoded === null) return EMPTY_HANDLE;

        params[pindex] = decoded;
        currentNode = node;
        path = "";

        continue;
      }

      // parametric(regex) route
      if (kind === TYPES.REGEX) {
        i = path.indexOf("/");

        if (i === -1) i = pathLen;

        if (i > maxParamLength) return EMPTY_HANDLE;

        decoded = fastDecode(path.slice(0, i));

        if (decoded === null) return EMPTY_HANDLE;

        if (!(node.regex as RegExp).test(decoded)) return EMPTY_HANDLE;

        currentNode = node;
        params[pindex++] = decoded;
        path = path.slice(i);

        continue;
      }

      // multiparametric route
      if (kind === TYPES.MULTI_PARAM) {
        if (node.regex !== null) {
          const matchedParameter = path.match(node.regex);

          if (matchedParameter === null) return EMPTY_HANDLE;

          i = matchedParameter[1].length;
        } else {
          i = 0;
          while (
            i < pathLen &&
            path.charCodeAt(i) !== 47 &&
            path.charCodeAt(i) !== 45
          ) {
            i++;
          }

          if (i > maxParamLength) return EMPTY_HANDLE;
        }

        decoded = fastDecode(path.slice(0, i));

        if (decoded === null) return EMPTY_HANDLE;

        currentNode = node;
        params[pindex++] = decoded;
        path = path.slice(i);

        continue;
      }

      wildcardNode = null;
    }
  }

  public prettyPrint() {
    return this.tree.prettyPrint("", true);
  }

  protected _on(
    method: Method | Method[],
    path: string,
    opts: Layer.RouteOptions = OPTIONS,
    handlers: Layer.Handler[],
  ) {
    if (Array.isArray(method)) {
      method.forEach(m => this._on(m, path, opts, handlers));

      return this;
    }

    // method validation
    assert(typeof method === "string", "Method should be a string");
    assert(
      httpMethods.indexOf(method) !== -1,
      `Method "${method}" is not an http method.`,
    );

    this.routes.push({
      handlers,
      method,
      opts,
      middlewares: [],
      path: `${this.prefix}${path}`,
    });

    return this;
  }

  protected _insert(
    method: Method,
    path: string,
    kind: number,
    options: Layer.RouteOptions = OPTIONS,
    params: string[] = [],
    handlers: Layer.Handler[] = [],
    middlewares: Layer.Handler[] = [],
    regex: RegExp | null,
  ) {
    const prettyPrint = handlers.length !== 0;

    handlers = middlewares
      .concat(
        params
          .filter(param => this.params[param] !== undefined)
          .map(param => this.params[param]),
      )
      .concat(handlers);

    const route = path;
    let currentNode = this.tree;
    let prefix = "";
    let pathLen = 0;
    let prefixLen = 0;
    let len = 0;
    let max = 0;
    let node = null;

    while (true) {
      prefix = currentNode.prefix;
      prefixLen = prefix.length;
      pathLen = path.length;
      len = 0;

      // search for the longest common prefix
      max = pathLen < prefixLen ? pathLen : prefixLen;
      while (len < max && path[len] === prefix[len]) len++;

      // the longest common prefix is smaller than the current prefix
      // let's split the node and add a new child
      if (len < prefixLen) {
        node = new Layer(
          prefix.slice(len),
          currentNode.children,
          currentNode.kind,
          currentNode.regex,
          params,
          new (Layer.Handlers as any)(currentNode.handlers),
        );

        if (currentNode.wildcardChild !== null) {
          node.wildcardChild = currentNode.wildcardChild;
        }

        // reset the parent
        currentNode.reset(prefix.slice(0, len)).addChild(node);

        // if the longest common prefix has the same length of the current path
        // the handler should be added to the current node, to a child otherwise
        if (len === pathLen) {
          assert(
            currentNode.getHandler(method).handlersLength === 0,
            `Method "${method}" already declared for route "${route}"`,
          );

          currentNode.addHandler(method, options, handlers, prettyPrint);
          currentNode.kind = kind;
        } else {
          node = new Layer(path.slice(len), {}, kind, regex, params);
          node.addHandler(method, options, handlers, prettyPrint);
          currentNode.addChild(node);
        }

        // the longest common prefix is smaller than the path length,
        // but is higher than the prefix
      } else if (len < pathLen) {
        // remove the prefix
        path = path.slice(len);
        // check if there is a child with the label extracted from the new path
        node = currentNode.findByLabel(path);
        // there is a child within the given label, we must go deepen in the tree
        if (node) {
          currentNode = node;

          continue;
        }
        // there are not children within the given label, let's create a new one!
        node = new Layer(path, {}, kind, regex, params);
        node.addHandler(method, options, handlers, prettyPrint);

        currentNode.addChild(node);

        // the node already exist
        // } else if (handler) {
      } else if (handlers) {
        // assert(!currentNode.getHandler(method),
        // `Method "${method}" already declared for route "${route}"`);
        currentNode.addHandler(method, options, handlers, prettyPrint);
      }

      return this;
    }
  }

  protected _next = (
    req: Request,
    res: Response,
    handlers: Encapsulation[],
    index = 0,
    error?: Error,
  ) => {
    if (error) throw error;

    const next = (err?: Error) =>
      this._safeNext.run(req, res, handlers, index + 1, err);

    res.next = next;

    handlers[index].run(req, res, next);
  };

  /* handle built-in middlewares */
  private _use(...handlers: Layer.Handler[]) {
    handlers = array.compact(handlers);

    // handler validation
    handlers.forEach(handler =>
      assert(isHandler(handler), "Handler should be a function"),
    );

    const path = "*";

    const index = this.middlewares.findIndex(
      middleware => path === middleware.path,
    );
    if (index === -1) {
      this.middlewares.push({ path, handlers });
    } else {
      this.middlewares[index].handlers = handlers.concat(
        this.middlewares[index].handlers,
      );
    }

    return this;
  }
}

export default Router;
