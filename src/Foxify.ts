import {
  Request,
  requestSettings,
  Response,
  responseSettings,
} from "@foxify/http";
import inject, { OptionsI as InjectOptionsI } from "@foxify/inject";
import Router from "@foxify/router";
import assert from "assert";
import proxyAddr from "proxy-addr";
import qs from "qs";
import serveStatic from "serve-static";
import Server from "./Server";
import * as utils from "./utils";
import { Engine } from "./view";

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
    url: string;
    port: number;
    workers: number;
    etag?:
      | null
      | boolean
      | "weak"
      | "strong"
      | ((
          body: string | Buffer,
          encoding?: BufferEncoding,
        ) => string | undefined);
    https: boolean;
    "https.cert"?: string;
    "https.key"?: string;
    "x-powered-by": boolean;
    "routing.case-sensitive": boolean;
    "routing.ignore-trailing-slash": boolean;
    "routing.allow-unsafe-regex": boolean;
    "routing.max-param-length": number;
    "json.escape": boolean;
    "json.replacer"?: (...args: any[]) => any;
    "json.spaces"?: number;
    "jsonp.callback": string;
    "subdomain.offset": number;
    "trust.proxy":
      | boolean
      | number
      | string
      | ((ip: string, hopIndex: number) => boolean);
    "query.parser":
      | boolean
      | "simple"
      | "extended"
      | ((str: string) => Record<string, unknown>);
  }

  export interface Settings {
    env: string;
    url: string;
    port: number;
    workers: number;
    etag: (
      body: string | Buffer,
      encoding?: BufferEncoding,
    ) => string | undefined;
    https: boolean;
    "https.cert"?: string;
    "https.key"?: string;
    "x-powered-by": boolean;
    "routing.case-sensitive": boolean;
    "routing.ignore-trailing-slash": boolean;
    "routing.allow-unsafe-regex": boolean;
    "routing.max-param-length": number;
    "json.escape": boolean;
    "json.replacer"?: (...args: any[]) => any;
    "json.spaces"?: number;
    "jsonp.callback": string;
    "subdomain.offset": number;
    "trust.proxy": (ip: string, hopIndex: number) => boolean;
    "query.parser": (str: string) => Record<string, unknown>;
  }
}

class Foxify extends Router<Request, Response> {
  public static static = serveStatic;

  private _settings: Foxify.Settings = {
    env: process.env.NODE_ENV || "development",
    url: process.env.APP_URL || "localhost",
    port: process.env.APP_PORT ? +process.env.APP_PORT : 3000,
    workers: process.env.WORKERS ? +process.env.WORKERS : 1,
    https: false,
    "x-powered-by": true,
    "routing.allow-unsafe-regex": false,
    "routing.case-sensitive": true,
    "routing.ignore-trailing-slash": false,
    "routing.max-param-length": 100,
    "json.escape": false,
    "jsonp.callback": "callback",
    "subdomain.offset": 2,
    "query.parser": qs.parse,
    "trust.proxy": undefined as any,
    etag: undefined as any,
  };

  private _view?: Engine;

  public constructor() {
    super();

    this.set("etag", "weak");
    this.disable("trust.proxy");
  }

  public static dotenv(path: string) {
    utils.assertType("path", "string", path);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("dotenv").config({ path });
  }

  public enable(setting: keyof Foxify.Settings) {
    return this.set(setting, true);
  }

  public disable(setting: keyof Foxify.Settings) {
    return this.set(setting, false);
  }

  public disabled(setting: keyof Foxify.Settings): boolean {
    return !this.setting(setting);
  }

  public enabled(setting: keyof Foxify.Settings): boolean {
    return !this.disabled(setting);
  }

  public set<T extends keyof Foxify.UserSettings>(
    setting: T,
    value: Foxify.UserSettings[T],
  ) {
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
        if (value === false) value = undefined as any;
        else if (value === true || value === "weak") {
          value = utils.createETagGenerator(true) as any;
        } else if (value === "strong") {
          value = utils.createETagGenerator(false) as any;
        } else {
          throw new TypeError(`Unknown value for ${setting} setting: ${value}`);
        }
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
          if (typeof value === "string") {
            value = value.split(/ *, */) as any;
          }

          value = proxyAddr.compile((value as any) || []) as any;
        }
        break;
      case "query.parser":
        if (typeof value === "function") break;
        if (value === true || value === "simple") value = qs.parse as any;
        else if (value === false) value = (() => ({})) as any;
        else if (value === "extended") {
          value = ((str: string) =>
            qs.parse(str, { allowPrototypes: true })) as any;
        } else {
          throw new TypeError(`Unknown value for ${setting} setting: ${value}`);
        }
        break;
      default:
        throw new TypeError(
          `Expected setting to be one of [${SETTINGS}], got ${setting}`,
        );
    }

    this._settings[setting] = value as any;

    return this;
  }

  public setting<T extends keyof Foxify.Settings>(
    setting: T,
  ): Foxify.Settings[T] {
    assert(
      SETTINGS.includes(setting),
      `Expected setting to be one of [${SETTINGS}], got ${setting}`,
    );

    return this._settings[setting];
  }

  /**
   * handle view
   * @param extension view template file extension
   * @param path the directory containing view templates
   */
  public engine(extension: string, path: string, handler: () => void) {
    this._view = new Engine(path, extension, handler);

    return this;
  }

  public inject(options: InjectOptionsI | string) {
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return inject(this.lookup.bind(this), {
      ...options,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Response,
      Request,
    });
  }

  public start(callback?: Server.Callback) {
    if (callback !== undefined) {
      utils.assertType("callback", "function", callback);
    }

    /* set node env */
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
