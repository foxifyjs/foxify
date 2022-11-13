import { Request as RequestT, Response as ResponseT } from "@foxify/http";
import { NodeHandlersT } from "./constants.js";

export default class Handlers<Request extends RequestT = RequestT,
  Response extends ResponseT = ResponseT> implements NodeHandlersT<Request, Response> {

  public readonly ACL = [];

  public readonly BIND = [];

  public readonly CHECKOUT = [];

  public readonly CONNECT = [];

  public readonly COPY = [];

  public readonly DELETE = [];

  public readonly GET = [];

  public readonly HEAD = [];

  public readonly LINK = [];

  public readonly LOCK = [];

  public readonly "M-SEARCH" = [];

  public readonly MERGE = [];

  public readonly MKACTIVITY = [];

  public readonly MKCALENDAR = [];

  public readonly MKCOL = [];

  public readonly MOVE = [];

  public readonly NOTIFY = [];

  public readonly OPTIONS = [];

  public readonly PATCH = [];

  public readonly POST = [];

  public readonly PRI = [];

  public readonly PROPFIND = [];

  public readonly PROPPATCH = [];

  public readonly PURGE = [];

  public readonly PUT = [];

  public readonly REBIND = [];

  public readonly REPORT = [];

  public readonly SEARCH = [];

  public readonly SOURCE = [];

  public readonly SUBSCRIBE = [];

  public readonly TRACE = [];

  public readonly UNBIND = [];

  public readonly UNLINK = [];

  public readonly UNLOCK = [];

  public readonly UNSUBSCRIBE = [];

}
