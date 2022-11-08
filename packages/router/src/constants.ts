import {
  MethodT,
  Request as RequestT,
  Response as ResponseT,
  StatusT,
  StringifyT,
} from "@foxify/http";
import { Schema as JsonSchemaT } from "fast-json-stringify";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type NodeT from "./Node";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type RouterT from "./Router";

export const PARAM_LABEL = ":" as const;

export const WILDCARD_LABEL = "*" as const;

export const EMPTY_OPTIONS: NodeMethodOptionsI = { schema: { response: {} } };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EMPTY_RESULT: HandlersResultT<any, any> = {
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

export type ParamHandlerI<
  Request extends RequestT = RequestT,
  Response extends ResponseT = ResponseT,
> = Record<string, HandlerT<Request, Response> | undefined>;

export type RoutesT<
  Request extends RequestT = RequestT,
  Response extends ResponseT = ResponseT,
> = Array<[
  method: MethodT,
  path: string,
  options: NodeMethodOptionsI,
  handlers: Array<HandlerT<Request, Response>>,
]>;

export type HandlerT<
  Request extends RequestT = RequestT,
  Response extends ResponseT = ResponseT,
> = (request: Request, response: Response, next: NextT) => unknown;

export type HandlersT<
  Request extends RequestT = RequestT,
  Response extends ResponseT = ResponseT,
> = Array<
HandlersT<Request, Response> | HandlerT<Request, Response> | false | null | undefined
>;

export type MiddlewaresT<
  Request extends RequestT = RequestT,
  Response extends ResponseT = ResponseT,
> = Array<
HandlersT<Request, Response> | HandlerT<Request, Response> | RouterT<Request, Response> | false | null | undefined
>;

export type ErrorHandlerT<
  Request extends RequestT = RequestT,
  Response extends ResponseT = ResponseT,
> = (
  error: Error,
  request: Request,
  response: Response,
  next: NextT,
) => unknown;

export type ErrorHandlersT<
  Request extends RequestT = RequestT,
  Response extends ResponseT = ResponseT,
> = Array<
ErrorHandlersT<Request, Response> | ErrorHandlerT<Request, Response> | false | null | undefined
>;

export interface HandlersResultT<
  Request extends RequestT = RequestT,
  Response extends ResponseT = ResponseT,
> {
  allowHeader: string;
  handlers: Array<HandlerT<Request, Response>>;
  options: NodeMethodOptionsI;
  params: ParamsT;
}

export type NodeHandlersT<
  Request extends RequestT = RequestT,
  Response extends ResponseT = ResponseT,
> = {
  readonly [Method in MethodT]-?: Array<HandlerT<Request, Response>>;
};

export type NodeChildrenT<
  Request extends RequestT = RequestT,
  Response extends ResponseT = ResponseT,
> = {
  [Label in string]?: NodeT<Request, Response>;
};

export type ShortHandRouteT<
  Request extends RequestT = RequestT,
  Response extends ResponseT = ResponseT,
  Router extends RouterT<Request, Response> = RouterT<Request, Response>,
> = (
  path: string,
  options?:
  HandlersT<Request, Response> | HandlerT<Request, Response> | OptionsI | false | null,
  ...handlers: HandlersT<Request, Response>
) => Router;

export type RouteMethodT<
  Request extends RequestT = RequestT,
  Response extends ResponseT = ResponseT,
  This extends RouteMethodsT<Request, Response> = RouteMethodsT<
  Request,
  Response
  >,
> = (
  options?:
  HandlersT<Request, Response> | HandlerT<Request, Response> | OptionsI | false | null,
  ...handlers: HandlersT<Request, Response>
) => This;

export type RouteMethodsT<
  Request extends RequestT = RequestT,
  Response extends ResponseT = ResponseT,
> = {
  [method in Lowercase<MethodT>]: RouteMethodT<
  Request,
  Response,
  RouteMethodsT<Request, Response>
  >;
};
