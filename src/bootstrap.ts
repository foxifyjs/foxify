import "prototyped.js/es6";
import { HttpExeption as HttpEx } from "./exeptions";

declare global {
  namespace NodeJS {
    interface Global {
      HttpExeption: typeof HttpEx;
    }
  }

  // tslint:disable-next-line:variable-name
  var HttpExeption: typeof HttpEx;
}

global.HttpExeption = HttpEx;
