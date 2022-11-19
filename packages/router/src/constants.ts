import { MethodT, Request, Response, StatusT, StringifyT } from "@foxify/http";
import { Schema as JsonSchemaT } from "fast-json-stringify";
import type Node from "./Node.js";
import type Router from "./Router.js";

export const PARAM_LABEL = ":" as const;

export const WILDCARD_LABEL = "*" as const;

export const EMPTY_OPTIONS: NodeMethodOptionsI = { schema: { response: {} } };

export const EMPTY_RESULT: HandlersResultT = {
  handlers   : [],
  allowHeader: "",
  options    : EMPTY_OPTIONS,
  params     : {},
};

export const enum NODE {
  STATIC,
  PARAM,
  MATCH_ALL,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParamsT = Record<string, any>;

export type NodeOptionsT = {
  readonly [Method in MethodT]-?: NodeMethodOptionsI;
};

export interface NodeMethodOptionsI {
  schema: NodeSchemaOptionsI;
}

export interface NodeSchemaOptionsI {
  response: {
    [statusCode in StatusT]?: StringifyT;
  };
}

export interface OptionsI {
  schema?: SchemaOptionsI;
}

export interface SchemaOptionsI {
  response?: { [statusCode in StatusT]?: JsonSchemaT | StringifyT };
}

export type NextT = (error?: Error) => void;

export type ParamHandlerI = Record<string, HandlerT | undefined>;

export type RoutesT = Array<[
  method: MethodT,
  path: string,
  options: NodeMethodOptionsI,
  handlers: HandlerT[],
]>;

export type HandlerT = (request: Request, response: Response, next: NextT) => unknown;

export type HandlersT = Array<HandlersT | HandlerT | false | null | undefined>;

export type MiddlewaresT = Array<HandlersT | HandlerT | Router | false | null | undefined>;

export type ErrorHandlerT = (
  error: Error,
  request: Request,
  response: Response,
  next: NextT,
) => unknown;

export type ErrorHandlersT = Array<ErrorHandlersT | ErrorHandlerT | false | null | undefined>;

export interface HandlersResultT {
  allowHeader: string;
  handlers: HandlerT[];
  options: NodeMethodOptionsI;
  params: ParamsT;
}

export type NodeHandlersT = {
  readonly [Method in MethodT]-?: HandlerT[];
};

export type NodeChildrenT = {
  [Label in string]?: Node;
};

export type ShortHandRouteT = (
  path: string,
  options?: HandlersT | HandlerT | OptionsI | false | null,
  ...handlers: HandlersT
) => Router;

export type RouteMethodT = (
  options?: HandlersT | HandlerT | OptionsI | false | null,
  ...handlers: HandlersT
) => RouteMethodsT;

export type RouteMethodsT = {
  [method in Lowercase<MethodT>]: RouteMethodT;
};
