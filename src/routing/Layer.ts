import { Request, Response } from "@foxify/http";
import assert from "assert";
import { Method, METHODS } from "../constants/METHOD";
import { Encapsulation } from "../exceptions";

const OPTIONS = { schema: { response: {} } };

const buildHandlers = (handlers?: any) => {
  let code = `handlers = handlers || {}
  `;

  for (let i = 0; i < METHODS.length; i++) {
    const m = METHODS[i];

    code += `this["${m}"] = handlers["${m}"] || {
      handlers: [],
      handlersLength: 0,
      params: [],
      paramsLength: 0,
      options: ${JSON.stringify(OPTIONS)},
      prettyPrint: false
    }
    `;
  }

  // tslint:disable-next-line:no-function-constructor-with-string-args
  return new Function("handlers", code); // eslint-disable-line
};

const Handlers = buildHandlers();

export const enum TYPES {
  STATIC = 0,
  PARAM = 1,
  MATCH_ALL = 2,
  REGEX = 3,
  // It's used for a parameter, that is followed by another parameter in the same part
  MULTI_PARAM = 4,
}

namespace Layer {
  export type Handler = (
    request: Request,
    response: Response,
    next: (err?: Error) => void,
  ) => void;

  export interface HandlerObject {
    handlers: Encapsulation[];
    handlersLength: number;
    params: string[];
    paramsLength: number;
    options: RouteOptions;
    prettyPrint: boolean;
  }

  export type Handlers = { [method in Method]: HandlerObject };

  export type Options = { [method in Method]: RouteOptions };

  export interface Children {
    [label: string]: Layer | undefined;
  }

  export type JsonSchemaType =
    | "string"
    | "integer"
    | "number"
    | "array"
    | "object"
    | "boolean"
    | "null";

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

class Layer {
  public static Handlers = Handlers;

  public static isLayer = (arg: any): arg is Layer => arg instanceof Layer;

  public handlers: Layer.Handlers;

  public wildcardChild: Layer | null = null;

  public parametricBrother: Layer | null = null;

  public numberOfChildren = Object.keys(this.children).length;

  constructor(
    public prefix = "/",
    public children: Layer.Children = {},
    public kind: number = TYPES.STATIC,
    public regex: RegExp | null = null,
    public params: string[] = [],
    handlers?: Layer.Handlers,
  ) {
    this.handlers = new (Handlers as any)(handlers);

    const paramsLength = params.length;
    METHODS.forEach(method => {
      this.handlers[method].params = params;
      this.handlers[method].paramsLength = paramsLength;
    });
  }

  get label() {
    return this.prefix[0];
  }

  public addChild(layer: Layer) {
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
      `There is already a child with label "${label}"`,
    );

    this.children[label] = layer;

    this.numberOfChildren++;

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

      if (child.kind === TYPES.STATIC && parametricBrother) {
        child.parametricBrother = parametricBrother;
      }
    }

    return this;
  }

  public reset(prefix = "/") {
    this.prefix = prefix;
    this.children = {};
    this.kind = TYPES.STATIC;
    this.handlers = new (Handlers as any)();
    this.regex = null;
    this.wildcardChild = null;
    this.numberOfChildren = 0;

    return this;
  }

  public findByLabel(path: string) {
    return this.children[path[0]];
  }

  public findChild(path: string, method: Method) {
    let child = this.children[path[0]];

    if (
      child !== undefined &&
      (child.numberOfChildren > 0 ||
        child.handlers[method].handlersLength !== 0)
    ) {
      if (path.slice(0, child.prefix.length) === child.prefix) return child;
    }

    child = this.children[":"] || this.children["*"];

    if (
      child !== undefined &&
      (child.numberOfChildren > 0 ||
        child.handlers[method].handlersLength !== 0)
    ) {
      return child;
    }

    return null;
  }

  public addHandler(
    method: Method,
    options: Layer.RouteOptions = OPTIONS,
    handlers: Layer.Handler[],
    prettyPrint = false,
  ) {
    const length = handlers.length;

    if (length === 0) return this;

    this.handlers[method].handlers.push(
      ...handlers.map(handler => new Encapsulation(handler)),
    );
    this.handlers[method].handlersLength += length;
    this.handlers[method].options = Object.assign({}, OPTIONS, options, {
      schema: options.schema || { response: {} },
    });
    this.handlers[method].prettyPrint =
      this.handlers[method].prettyPrint || prettyPrint;

    return this;
  }

  public getHandler(method: Method) {
    return this.handlers[method];
  }

  public prettyPrint(prefix: string, tail: boolean = false) {
    const handlers = this.handlers;
    const methods = Object.keys(handlers).filter(
      method => handlers[method as Method].prettyPrint,
    );
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
          paramName += index === methods.length - 1 ? ")" : "";
        } else paramName = `${param} (${method})`;
      });
    } else if (methods.length) paramName = ` (${methods.join("|")})`;

    let tree = `${prefix}${tail ? "└── " : "├── "}${this.prefix}${paramName}\n`;

    prefix = `${prefix}${tail ? "    " : "│   "}`;
    const labels = Object.keys(this.children);

    for (let i = 0; i < labels.length - 1; i++) {
      tree += (this.children[labels[i]] as Layer).prettyPrint(prefix);
    }

    if (labels.length > 0) {
      tree += (this.children[labels[labels.length - 1]] as Layer).prettyPrint(
        prefix,
        true,
      );
    }

    return tree;
  }
}

export default Layer;
