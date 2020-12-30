import etag from "etag";

export * from "prototyped.js/es6/methods";
export * from "./assertions";

export { default as decodeURIComponent } from "./fast-decode-uri-component";

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
