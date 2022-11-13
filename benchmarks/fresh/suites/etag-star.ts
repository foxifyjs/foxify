import foxifyFresh from "@foxify/fresh";
import fresh from "fresh";

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
