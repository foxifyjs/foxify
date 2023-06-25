import qs from "node:querystring";
import { config } from "@foxify/config";

it("should use default config", () => {
  expect(config).toMatchObject({
    env : "test",
    // eslint-disable-next-line no-undefined
    etag: undefined,
    json: {
      escape  : false,
      // eslint-disable-next-line no-undefined
      replacer: undefined,
      spaces  : 0,
    },
    jsonp: {
      callback: "callback",
    },
    proxy: {
    },
    query: {
      parser: qs.parse,
    },
    server: {
      hostname: "localhost",
      port    : 3000,
      protocol: "http",
    },
    subdomain: {
      offset: 2,
    },
    workers   : 1,
    xPoweredBy: true,
  });

  expect(config.proxy.trust).toBeInstanceOf(Function);
  expect(config.proxy.trust.toString()).toBe("() => false");
});

it("should update json.escape", () => {
  expect(config.json.escape).toBe(false);

  config.json.escape = true;

  expect(config.json.escape).toBe(true);

  config.json.escape = false;

  expect(config.json).toEqual({
    escape  : false,
    // eslint-disable-next-line no-undefined
    replacer: undefined,
    spaces  : 0,
  });
});

it("shouldn't allow sub-config updates", () => {
  expect(() => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    config.json = {} as never;
  }).toThrowError("Config override for \"json\" is not allowed.");
});
