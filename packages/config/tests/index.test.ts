import { DEFAULT } from "#src/constants";
import CONFIG from "@foxify/config";

it("should use default config", () => {
  expect(CONFIG).toEqual(DEFAULT);
});
