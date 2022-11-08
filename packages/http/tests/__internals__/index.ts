import { requestSettings, responseSettings } from "../../src";

export function reset(): void {
  requestSettings();
  responseSettings();
}

export { default as inject } from "./inject";
