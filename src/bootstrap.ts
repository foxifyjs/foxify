import { http } from "./constants";
import { HttpException as HttpEx } from "./exceptions";

declare global {
  const HttpException: typeof HttpEx;
  const HTTP: typeof http;
}

(global as any).HttpException = HttpEx;
(global as any).HTTP = http;
