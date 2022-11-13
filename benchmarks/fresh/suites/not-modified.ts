import foxifyFresh from "@foxify/fresh";
import fresh from "fresh";

export default [
  [
    "@foxify/fresh",
    (): boolean => foxifyFresh(
      { "if-modified-since": "Fri, 01 Jan 2010 00:00:00 GMT" },
      { "last-modified": "Sat, 01 Jan 2000 00:00:00 GMT" },
    ),
  ],
  [
    "fresh",
    (): boolean => fresh(
      { "if-modified-since": "Fri, 01 Jan 2010 00:00:00 GMT" },
      { "last-modified": "Sat, 01 Jan 2000 00:00:00 GMT" },
    ),
  ],
];
