import { MethodT, StatusT } from "@foxify/http";
import fastJson from "fast-json-stringify";
import Handlers from "./Handlers.js";
import Options from "./Options.js";
import {
  HandlersResultT,
  HandlerT,
  NODE,
  NodeChildrenT,
  NodeHandlersT,
  NodeOptionsT,
  NodeSchemaOptionsI,
  OptionsI,
  PARAM_LABEL,
  ParamsT,
  WILDCARD_LABEL,
} from "./constants.js";

interface Node {
  constructor: typeof Node;
}

class Node {

  public allowHeader = "";

  public readonly children: NodeChildrenT = {};

  public childrenCount = 0;

  public readonly handlers: NodeHandlersT = new Handlers;

  public label!: string;

  // eslint-disable-next-line no-undefined
  public matchAllParamRegExp?: RegExp = undefined;

  // eslint-disable-next-line no-undefined
  public matchingWildcardNode?: Node = undefined;

  public readonly methods: MethodT[] = [];

  // eslint-disable-next-line no-undefined
  public neighborParamNode?: Node = undefined;

  public readonly options: NodeOptionsT = new Options;

  // eslint-disable-next-line no-undefined
  public param?: string = undefined;

  public prefixLength!: number;

  public type!: NODE;

  public constructor(public prefix = "/") {
    this.init(prefix);
  }

  public static isNode(value: unknown): value is Node {
    return value instanceof this;
  }

  public addChild(node: Node): Node;
  public addChild(prefix?: string): Node;
  public addChild(prefix: Node | string = "/"): Node {
    let node: Node;

    if (this.constructor.isNode(prefix)) node = prefix;
    else node = new this.constructor(prefix);

    const label = node.label;

    this.children[label] = node;

    this.childrenCount = Object.keys(this.children).length;

    return node;
  }

  public addHandlers(
    method: MethodT,
    options: OptionsI,
    handlers: HandlerT[],
  ): this {
    if (handlers.length === 0) return this;

    const nodeHandlers = this.handlers[method];

    if (nodeHandlers.length === 0) {
      this.methods.push(method);
      this.methods.sort();
      this.allowHeader = this.methods.join(", ");
    }

    // eslint-disable-next-line no-undefined
    if (options.schema === undefined) options.schema = {};
    // eslint-disable-next-line no-undefined
    if (options.schema.response === undefined) options.schema.response = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schema = options.schema.response;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options.schema.response = Object.keys(schema).reduce<NodeSchemaOptionsI["response"]>(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result, status: any) => {
        const value = schema[status as StatusT]!;

        if (typeof value === "function") result[status as StatusT] = value;
        else result[status as StatusT] = fastJson(value);


        return result;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      },
      {},
    );

    Object.assign(this.options[method], options);

    nodeHandlers.push(...handlers);

    return this;
  }

  public findChild(path: string, index = 0): Node | undefined {
    const children = this.children;

    return children[path[index]] ?? children[PARAM_LABEL] ?? children[WILDCARD_LABEL];
  }

  public findChildByLabel(label: string): Node | undefined {
    return this.children[label];
  }

  public findHandlers(method: MethodT, params: ParamsT = {}): HandlersResultT {
    const {
      handlers: { [method]: handlers },
      allowHeader,
      options: { [method]: options },
    } = this;

    return {
      handlers,
      allowHeader,
      options,
      params,
    };
  }

  public resetLabel(prefix: string): this {
    this.prefix = prefix;

    return this.init(prefix);
  }

  protected init(prefix: string): this {
    this.prefixLength = prefix.length;
    this.label = prefix[0];

    switch (this.label) {
      case PARAM_LABEL: {
        this.param = prefix.slice(1);
        this.type = NODE.PARAM;

        if (this.param === "$") throw new Error("Invalid parameter name");

        break;
      }
      case WILDCARD_LABEL: {
        this.param = prefix.slice(1) || "$";
        this.type = NODE.MATCH_ALL;

        break;
      }
      default: {
        // eslint-disable-next-line no-undefined
        this.param = undefined;
        this.type = NODE.STATIC;

        break;
      }
    }

    return this;
  }

}

export default Node;
