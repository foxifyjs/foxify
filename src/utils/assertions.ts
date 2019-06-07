import assert from "assert";

export type JSType =
  | "bigint"
  | "boolean"
  | "function"
  | "number"
  | "object"
  | "string"
  | "symbol"
  | "undefined";

export function assertType(name: string, type: JSType, value: any) {
  assert(
    typeof value === type,
    `Expected ${name} to be ${type}, got ${typeof value}`,
  );
}

export function assertPosInt(name: string, value: any) {
  assertType(name, "number", value);
  assert(
    Number.isInteger(value) && value > 0,
    `Expected ${name} to be a positive integer, got ${value}`,
  );
}

export function assertNonNegInt(name: string, value: any) {
  assertType(name, "number", value);
  assert(
    Number.isInteger(value) && value >= 0,
    `Expected ${name} to be a non-negative integer, got ${value}`,
  );
}
