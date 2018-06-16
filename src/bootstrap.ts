import { HttpException as HttpEx } from "./exceptions";

declare global {
  namespace NodeJS {
    interface Global {
      HttpException: typeof HttpEx;
    }
  }

  const HttpException: typeof HttpEx;
}

global.HttpException = HttpEx;
