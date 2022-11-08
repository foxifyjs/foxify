import http from "node:http";

export type MethodT =
  | "ACL"
  | "BIND"
  | "CHECKOUT"
  | "CONNECT"
  | "COPY"
  | "DELETE"
  | "GET"
  | "HEAD"
  | "LINK"
  | "LOCK"
  | "M-SEARCH"
  | "MERGE"
  | "MKACTIVITY"
  | "MKCALENDAR"
  | "MKCOL"
  | "MOVE"
  | "NOTIFY"
  | "OPTIONS"
  | "PATCH"
  | "POST"
  | "PRI"
  | "PROPFIND"
  | "PROPPATCH"
  | "PURGE"
  | "PUT"
  | "REBIND"
  | "REPORT"
  | "SEARCH"
  | "SOURCE"
  | "SUBSCRIBE"
  | "TRACE"
  | "UNBIND"
  | "UNLINK"
  | "UNLOCK"
  | "UNSUBSCRIBE";

export const METHODS = http.METHODS as MethodT[];

export const enum METHOD {
  ACL = "ACL",
  BIND = "BIND",
  CHECKOUT = "CHECKOUT",
  CONNECT = "CONNECT",
  COPY = "COPY",
  DELETE = "DELETE",
  GET = "GET",
  HEAD = "HEAD",
  LINK = "LINK",
  LOCK = "LOCK",
  M_SEARCH = "M-SEARCH",
  MERGE = "MERGE",
  MKACTIVITY = "MKACTIVITY",
  MKCALENDAR = "MKCALENDAR",
  MKCOL = "MKCOL",
  MOVE = "MOVE",
  NOTIFY = "NOTIFY",
  OPTIONS = "OPTIONS",
  PATCH = "PATCH",
  POST = "POST",
  PRI = "PRI",
  PROPFIND = "PROPFIND",
  PROPPATCH = "PROPPATCH",
  PURGE = "PURGE",
  PUT = "PUT",
  REBIND = "REBIND",
  REPORT = "REPORT",
  SEARCH = "SEARCH",
  SOURCE = "SOURCE",
  SUBSCRIBE = "SUBSCRIBE",
  TRACE = "TRACE",
  UNBIND = "UNBIND",
  UNLINK = "UNLINK",
  UNLOCK = "UNLOCK",
  UNSUBSCRIBE = "UNSUBSCRIBE",
}
