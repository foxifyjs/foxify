import qs from "node:querystring";
import { config, events } from "@foxify/config";

it("should use default config", () => {
  expect(config).toMatchObject({
    env : "test",
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
      // eslint-disable-next-line no-undefined
      etag    : undefined,
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
  const listener = jest.fn();

  events.on("change", listener);

  expect(config.json.escape).toBe(false);

  config.json.escape = true;

  expect(listener).toBeCalledTimes(1);
  expect(listener).toBeCalledWith("json.escape", true, false);

  listener.mockReset();

  expect(config.json.escape).toBe(true);

  config.json.escape = false;

  expect(listener).toBeCalledTimes(1);
  expect(listener).toBeCalledWith("json.escape", false, true);

  events.off("change", listener);

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
