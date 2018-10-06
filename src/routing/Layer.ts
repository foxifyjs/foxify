import * as assert from "assert";
import httpMethods, { Method } from "./httpMethods";
import * as Request from "../Request";
import * as Response from "../Response";
import { Encapsulation } from "../exceptions";

const buildHandlers = (handlers?: any) => {
  let code = `handlers = handlers || {}
  `;

  for (let i = 0; i < httpMethods.length; i++) {
    const m = httpMethods[i];

    code += `this["${m}"] = handlers["${m}"] || []
    `;
  }

  return new Function("handlers", code); // eslint-disable-line
};

const Handlers = buildHandlers();

const OPTIONS = { schema: { response: {} } };

const TYPES = {
  STATIC: 0,
  PARAM: 1,
  MATCH_ALL: 2,
  REGEX: 3,
  // It's used for a parameter, that is followed by another parameter in the same part
  MULTI_PARAM: 4,
};

module Layer {
  export type Handler = (request: Request, response: Response, next: () => void) => void;

  export interface HandlerObject {
    handler: Encapsulation;
    params: string[];
    paramsLength: number;
  }

  export interface Handlers {
    [method: string]: Encapsulation[];

    ACL: Encapsulation[];
    BIND: Encapsulation[];
    CHECKOUT: Encapsulation[];
    CONNECT: Encapsulation[];
    COPY: Encapsulation[];
    DELETE: Encapsulation[];
    GET: Encapsulation[];
    HEAD: Encapsulation[];
    LINK: Encapsulation[];
    LOCK: Encapsulation[];
    "M-SEARCH": Encapsulation[];
    MERGE: Encapsulation[];
    MKACTIVITY: Encapsulation[];
    MKCALENDAR: Encapsulation[];
    MKCOL: Encapsulation[];
    MOVE: Encapsulation[];
    NOTIFY: Encapsulation[];
    OPTIONS: Encapsulation[];
    PATCH: Encapsulation[];
    POST: Encapsulation[];
    PROPFIND: Encapsulation[];
    PROPPATCH: Encapsulation[];
    PURGE: Encapsulation[];
    PUT: Encapsulation[];
    REBIND: Encapsulation[];
    REPORT: Encapsulation[];
    SEARCH: Encapsulation[];
    SOURCE: Encapsulation[];
    SUBSCRIBE: Encapsulation[];
    TRACE: Encapsulation[];
    UNBIND: Encapsulation[];
    UNLINK: Encapsulation[];
    UNLOCK: Encapsulation[];
    UNSUBSCRIBE: Encapsulation[];
  }

  export interface Options {
    [method: string]: RouteOptions | undefined;

    ACL?: RouteOptions;
    BIND?: RouteOptions;
    CHECKOUT?: RouteOptions;
    CONNECT?: RouteOptions;
    COPY?: RouteOptions;
    DELETE?: RouteOptions;
    GET?: RouteOptions;
    HEAD?: RouteOptions;
    LINK?: RouteOptions;
    LOCK?: RouteOptions;
    "M-SEARCH"?: RouteOptions;
    MERGE?: RouteOptions;
    MKACTIVITY?: RouteOptions;
    MKCALENDAR?: RouteOptions;
    MKCOL?: RouteOptions;
    MOVE?: RouteOptions;
    NOTIFY?: RouteOptions;
    OPTIONS?: RouteOptions;
    PATCH?: RouteOptions;
    POST?: RouteOptions;
    PROPFIND?: RouteOptions;
    PROPPATCH?: RouteOptions;
    PURGE?: RouteOptions;
    PUT?: RouteOptions;
    REBIND?: RouteOptions;
    REPORT?: RouteOptions;
    SEARCH?: RouteOptions;
    SOURCE?: RouteOptions;
    SUBSCRIBE?: RouteOptions;
    TRACE?: RouteOptions;
    UNBIND?: RouteOptions;
    UNLINK?: RouteOptions;
    UNLOCK?: RouteOptions;
    UNSUBSCRIBE?: RouteOptions;
  }

  export interface Children {
    [label: string]: Layer | undefined;
  }

  export type JsonSchemaType = "string" | "integer" | "number" | "array" | "object" | "boolean" | "null";

  export interface JsonSchemaProperties {
    [property: string]: {
      type: JsonSchemaType;
      default?: any;
    };
  }

  export interface JsonSchema {
    title?: string;
    type: JsonSchemaType;
    properties?: JsonSchemaProperties;
    patternProperties?: JsonSchemaProperties;
    additionalProperties?: {
      type: JsonSchemaType;
    };
    required?: string[];
  }

  export interface Schema {
    response: { [statusCode: number]: JsonSchema };
  }

  export interface RouteOptions {
    schema: Schema;
  }
}

interface Layer { }

class Layer {
  static isLayer = (arg: any): arg is Layer => arg instanceof Layer;

  static TYPES = TYPES;
  static Handlers = Handlers;

  handlers: Layer.Handlers;

  options: Layer.Options = {};

  wildcardChild: Layer | null = null;

  parametricBrother: Layer | null = null;

  paramsLength: number;

  constructor(
    public prefix = "/",
    public children: Layer.Children = {},
    public kind = TYPES.STATIC,
    handlers?: Layer.Handlers,
    public regex: RegExp | null = null,
    public params: string[] = []
  ) {
    this.handlers = new (Handlers as any)(handlers);
    this.paramsLength = params.length;
  }

  get label() {
    return this.prefix[0];
  }

  get numberOfChildren() {
    return Object.keys(this.children).length;
  }

  addChild(layer: Layer) {
    let label = "";

    switch (layer.kind) {
      case TYPES.STATIC:
        label = layer.label;
        break;
      case TYPES.PARAM:
      case TYPES.REGEX:
      case TYPES.MULTI_PARAM:
        label = ":";
        break;
      case TYPES.MATCH_ALL:
        this.wildcardChild = layer;
        label = "*";
        break;
      default:
        throw new Error(`Unknown layer kind: ${layer.kind}`);
    }

    assert(
      this.children[label] === undefined,
      `There is already a child with label "${label}"`
    );

    this.children[label] = layer;

    const labels = Object.keys(this.children);
    let parametricBrother = null;
    for (let i = 0; i < labels.length; i++) {
      const child = this.children[labels[i]] as Layer;
      if (child.label === ":") {
        parametricBrother = child;
        break;
      }
    }

    // Save the parametric brother inside a static children
    for (let i = 0; i < labels.length; i++) {
      const child = this.children[labels[i]] as Layer;

      if (child.kind === TYPES.STATIC && parametricBrother)
        child.parametricBrother = parametricBrother;
    }

    return this;
  }

  reset(prefix = "/") {
    this.prefix = prefix;
    this.children = {};
    this.kind = TYPES.STATIC;
    this.handlers = new (Handlers as any)();
    this.regex = null;
    this.wildcardChild = null;

    return this;
  }

  findByLabel(path: string) {
    return this.children[path[0]];
  }

  findChild(path: string, method: Method) {
    let child = this.children[path[0]];

    if (child !== undefined && (child.numberOfChildren > 0 || child.handlers[method] !== null))
      if (path.slice(0, child.prefix.length) === child.prefix)
        return child;

    child = this.children[":"] || this.children["*"];

    if (child !== undefined && (child.numberOfChildren > 0 || child.handlers[method] !== null))
      return child;

    return null;
  }

  addHandler(method: Method, options: Layer.RouteOptions = OPTIONS, handlers: Layer.Handler[]) {
    if (handlers.length === 0) return this;

    // assert(
    //   this.handlers[method].length !== 0,
    //   `There is already an handler with method "${method}"`
    // );

    this.handlers[method].push(...handlers.map((handler) => new Encapsulation(handler)));

    this.options[method] = Object.assign({}, OPTIONS, options, { schema: options.schema || { response: {} } });

    return this;
  }

  getHandler(method: Method) {
    const handlers = this.handlers[method];

    return {
      handlers,
      options: this.options[method] || { schema: { response: {} } },
      params: this.params,
      handlersLength: handlers.length,
      paramsLength: this.paramsLength,
    };
  }

  prettyPrint(prefix: string, tail: boolean = false) {
    const handlers = this.handlers;
    const methods = Object.keys(handlers)
      .filter((method) => handlers[method].length > 0);
    let paramName = "";

    if (this.prefix === ":") {
      const params = this.params;
      const param = params[params.length - 1];

      methods.forEach((method, index) => {
        if (methods.length > 1) {
          if (index === 0) {
            paramName += `${param} (${method}`;
            return;
          }

          paramName += `|${method}`;
          paramName += (index === methods.length - 1 ? ")" : "");
        } else
          paramName = `${param} (${method})`;
      });
    } else if (methods.length)
      paramName = ` (${methods.join("|")})`;

    let tree = `${prefix}${tail ? "└── " : "├── "}${this.prefix}${paramName}\n`;

    prefix = `${prefix}${tail ? "    " : "│   "}`;
    const labels = Object.keys(this.children);

    for (let i = 0; i < labels.length - 1; i++)
      tree += (this.children[labels[i]] as Layer).prettyPrint(prefix);

    if (labels.length > 0)
      tree += (this.children[labels[labels.length - 1]] as Layer).prettyPrint(prefix, true);

    return tree;
  }
}

export = Layer;
