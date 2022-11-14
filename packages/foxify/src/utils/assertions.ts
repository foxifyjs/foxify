import assert from "node:assert";

export type JSType =
  | "bigint"
  | "boolean"
  | "function"
  | "number"
  | "object"
  | "string"
  | "symbol"
  | "undefined";

export function assertType(name: string, type: JSType, value: unknown): void {
  assert(
    typeof value === type,
    `Expected ${ name } to be ${ type }, got ${ typeof value }`,
  );
}

export function assertPosInt(name: string, value: unknown): void {
  assertType(name, "number", value);
  assert(
    Number.isInteger(value) && (value as number) > 0,
    `Expected ${ name } to be a positive integer, got ${ value }`,
  );
}

export function assertNonNegInt(name: string, value: unknown): void {
  assertType(name, "number", value);
  assert(
    Number.isInteger(value) && (value as number) >= 0,
    `Expected ${ name } to be a non-negative integer, got ${ value }`,
  );
}
