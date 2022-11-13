import assert from "assert";
import {
  Request,
  requestSettings,
  Response,
  responseSettings,
} from "@foxify/http";
import inject, { InjectResultI, OptionsI as InjectOptionsI } from "@foxify/inject";
import Router from "@foxify/router";
import * as proxyAddr from "proxy-addr";
import * as qs from "qs";
import serveStatic from "serve-static";
import Server from "./Server.js";
import * as utils from "./utils/index.js";
import { Engine } from "./view/index.js";

const SETTINGS: Array<keyof Foxify.UserSettings> = [
  "env",
  "url",
  "port",
  "workers",
  "etag",
  "https",
  "https.cert",
  "https.key",
  "x-powered-by",
  "routing.case-sensitive",
  "routing.ignore-trailing-slash",
  "routing.allow-unsafe-regex",
  "routing.max-param-length",
  "json.escape",
  "json.replacer",
  "json.spaces",
  "jsonp.callback",
  "subdomain.offset",
  "trust.proxy",
  "query.parser",
];

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Foxify {
  export interface UserSettings {
    env: string;
    etag?: boolean | "strong" | "weak"
    | ((body: Buffer | string, encoding?: BufferEncoding) => string | undefined) | null;
    https: boolean;
    "https.cert"?: string;
    "https.key"?: string;
    "json.escape": boolean;
    "json.spaces"?: number;
    "jsonp.callback": string;
    port: number;
    "query.parser": boolean | "extended" | "simple" | ((str: string) => Record<string, unknown>);
    "routing.allow-unsafe-regex": boolean;
    "routing.case-sensitive": boolean;
    "routing.ignore-trailing-slash": boolean;
    "routing.max-param-length": number;
    "subdomain.offset": number;
    "trust.proxy": boolean | number | string | ((ip: string, hopIndex: number) => boolean);
    url: string;
    workers: number;
    "x-powered-by": boolean;
    "json.replacer"?(...args: any[]): any;
  }

  export interface Settings {
    env: string;
    https: boolean;
    "https.cert"?: string;
    "https.key"?: string;
    "json.escape": boolean;
    "json.spaces"?: number;
    "jsonp.callback": string;
    port: number;
    "routing.allow-unsafe-regex": boolean;
    "routing.case-sensitive": boolean;
    "routing.ignore-trailing-slash": boolean;
    "routing.max-param-length": number;
    "subdomain.offset": number;
    url: string;
    workers: number;
    "x-powered-by": boolean;

    etag(
      body: Buffer | string,
      encoding?: BufferEncoding,
    ): string | undefined;

    "json.replacer"?(...args: any[]): any;

    "query.parser"(str: string): Record<string, unknown>;

    "trust.proxy"(ip: string, hopIndex: number): boolean;
  }
}

class Foxify extends Router {

  public static static = serveStatic;

  private _settings: Foxify.Settings = {
    env                            : process.env.NODE_ENV ?? "development",
    url                            : process.env.APP_URL ?? "localhost",
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    port                           : process.env.APP_PORT ? +process.env.APP_PORT : 3000,
    workers                        : process.env.WORKERS ? +process.env.WORKERS : 1,
    https                          : false,
    "x-powered-by"                 : true,
    "routing.allow-unsafe-regex"   : false,
    "routing.case-sensitive"       : true,
    "routing.ignore-trailing-slash": false,
    "routing.max-param-length"     : 100,
    "json.escape"                  : false,
    "jsonp.callback"               : "callback",
    "subdomain.offset"             : 2,
    "query.parser"                 : qs.parse,
    // eslint-disable-next-line no-undefined
    "trust.proxy"                  : undefined as any,
    // eslint-disable-next-line no-undefined
    etag                           : undefined as any,
  };

  private _view?: Engine;

  public constructor() {
    super();

    this.set("etag", "weak");
    this.disable("trust.proxy");
  }

  public static dotenv(path: string): void {
    utils.assertType("path", "string", path);

    // eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports
    require("dotenv").config({ path });
  }

  public disable(setting: keyof Foxify.Settings): this {
    return this.set(setting, false);
  }

  public disabled(setting: keyof Foxify.Settings): boolean {
    return !this.setting(setting);
  }

  public enable(setting: keyof Foxify.Settings): this {
    return this.set(setting, true);
  }

  public enabled(setting: keyof Foxify.Settings): boolean {
    return !this.disabled(setting);
  }

  /**
   * Handle view
   * @param extension view template file extension
   * @param path the directory containing view templates
   * @param handler
   */
  public engine(extension: string, path: string, handler: () => void): this {
    this._view = new Engine(path, extension, handler);

    return this;
  }

  public async inject(options: InjectOptionsI | string): Promise<InjectResultI<Request, Response>> {
    assert(
      this.setting("env") === "test",
      "Inject only works on the testing environment",
    );

    if (typeof options === "string") options = { url: options };

    requestSettings(this._settings as any);
    responseSettings({
      ...this._settings,
      view: this._view,
    } as any);

    // TODO: fix typescript issues
    return inject(this.lookup.bind(this), {
      ...options,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      Response,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      Request,
    });
  }

  public set<T extends keyof Foxify.UserSettings>(
    setting: T,
    value: Foxify.UserSettings[T],
  ): this {
    switch (setting) {
      case "env":
        utils.assertType(setting, "string", value);
        break;
      case "url":
        utils.assertType(setting, "string", value);
        break;
      case "port":
        utils.assertNonNegInt(setting, value);
        break;
      case "workers":
        utils.assertPosInt(setting, value);
        break;
      case "etag":
        if (value == null || typeof value === "function") break;
        // eslint-disable-next-line no-undefined
        if (value === false) value = undefined as any;
        else if (value === true || value === "weak") value = utils.createETagGenerator(true) as any;
        else if (value === "strong") value = utils.createETagGenerator(false) as any;
        else throw new TypeError(`Unknown value for ${ setting } setting: ${ value }`);

        break;
      case "https":
        utils.assertType(setting, "boolean", value);
        break;
      case "https.cert":
        utils.assertType(setting, "string", value);
        break;
      case "https.key":
        utils.assertType(setting, "string", value);
        break;
      case "x-powered-by":
        utils.assertType(setting, "boolean", value);
        break;
      case "routing.case-sensitive":
        utils.assertType(setting, "boolean", value);
        break;
      case "routing.ignore-trailing-slash":
        utils.assertType(setting, "boolean", value);
        break;
      case "routing.allow-unsafe-regex":
        utils.assertType(setting, "boolean", value);
        break;
      case "routing.max-param-length":
        utils.assertPosInt(setting, value);
        break;
      case "json.escape":
        utils.assertType(setting, "boolean", value);
        break;
      case "json.replacer":
        utils.assertType(setting, "function", value);
        break;
      case "json.spaces":
        utils.assertNonNegInt(setting, value);
        break;
      case "jsonp.callback":
        utils.assertType(setting, "string", value);
        break;
      case "subdomain.offset":
        utils.assertNonNegInt(setting, value);
        break;
      case "trust.proxy":
        if (value === true) {
          value = (() => true) as any;
        } else if (typeof value === "number") {
          const num = value;
          value = ((ip: string, i: number) => i < num) as any;
        } else if (typeof value !== "function") {
          if (typeof value === "string") value = value.split(/ *, */) as any;


          value = proxyAddr.compile((value as any) || []) as any;
        }
        break;
      case "query.parser":
        if (typeof value === "function") break;
        if (value === true || value === "simple") value = qs.parse as any;
        else if (value === false) value = (() => ({})) as any;
        else if (value === "extended") value = ((str: string) => qs.parse(str, { allowPrototypes: true })) as any;
        else throw new TypeError(`Unknown value for ${ setting } setting: ${ value }`);

        break;
      default:
        throw new TypeError(`Expected setting to be one of [${ SETTINGS }], got ${ setting }`);
    }

    this._settings[setting] = value as any;

    return this;
  }

  public setting<T extends keyof Foxify.Settings>(setting: T): Foxify.Settings[T] {
    assert(
      SETTINGS.includes(setting),
      `Expected setting to be one of [${ SETTINGS }], got ${ setting }`,
    );

    return this._settings[setting];
  }

  public start(callback?: Server.Callback): Server {
    if (callback != null) utils.assertType("callback", "function", callback);


    /* Set node env */
    process.env.NODE_ENV = this.setting("env");

    const server = new Server(
      {
        ...this._settings,
        view: this._view,
      },
      this.lookup.bind(this),
    );

    return server.start(callback);
  }

}

export default Foxify;
