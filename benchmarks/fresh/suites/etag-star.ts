import foxify from "@foxify/fresh";
import fresh from "fresh";

const foxifyFresh = foxify.default;

export default [
  [
    "@foxify/fresh",
    (): boolean => foxifyFresh(
      { "if-none-match": "*" },
      { etag: '"foo"' },
    ),
  ],
  [
    "fresh",
    (): boolean => fresh(
      { "if-none-match": "*" },
      { etag: '"foo"' },
    ),
  ],
];