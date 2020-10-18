import etag from "etag";

export * from "prototyped.js/es6/methods";
export * from "./assertions";

export { default as Accepts } from "./accepts";
export { default as encodeUrl } from "./encode-url";
export { default as decodeURIComponent } from "./fast-decode-uri-component";
export { default as parseUrl } from "./parse-url";
export { default as rangeParser } from "./range-parser";
export { default as vary } from "./vary";

export function mixins(...baseCtors: any[]) {
  return (derivedCtor: any) => {
    baseCtors.forEach(baseCtor => {
      // static methods
      Object.getOwnPropertyNames(baseCtor).forEach(name => {
        if (
          !exports.array.contains(
            ["length", "constructor", "prototype", "name"],
            name,
          ) &&
          !derivedCtor[name]
        ) {
          derivedCtor[name] = baseCtor[name];
        }
      });

      // instance methods
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
        if (name !== "constructor" && !derivedCtor.prototype[name]) {
          derivedCtor.prototype[name] = baseCtor.prototype[name];
        }
      });
    });

    return derivedCtor;
  };
}

export function define(
  obj: object,
  method: "get" | "set",
  name: string,
  func: (value?: any) => any,
) {
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: true,
    [method]: func,
  });
}

export const isHandler = (arg: any) =>
  typeof arg === "function" || arg instanceof Promise;

export const createETagGenerator = (weak: boolean) => {
  return function generateETag(
    body: string | Buffer,
    encoding?: BufferEncoding,
  ) {
    return etag(Buffer.isBuffer(body) ? body : Buffer.from(body, encoding), {
      weak,
    });
  };
};
