import { http } from "./constants";
import { HttpException as HttpEx } from "./exceptions";

declare global {
  namespace NodeJS {
    interface Global {
      HttpException: typeof HttpEx;
      HTTP: typeof http;
    }
  }

  const HttpException: typeof HttpEx;
  const HTTP: typeof http;
}

global.HttpException = HttpEx;
global.HTTP = http;
