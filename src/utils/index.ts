import etag from "etag";

export * from "./assertions";

export { default as decodeURIComponent } from "./fast-decode-uri-component";

export const isHandler = (arg: unknown): boolean => typeof arg === "function" || arg instanceof Promise;

export const createETagGenerator = (weak: boolean) => function generateETag(
  body: Buffer | string,
  encoding?: BufferEncoding,
): string {
  return etag(Buffer.isBuffer(body) ? body : Buffer.from(body, encoding), {
    weak,
  });
};
