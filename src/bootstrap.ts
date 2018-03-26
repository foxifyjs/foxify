import "prototyped.js/es6";
import { HttpExeption as HttpEx } from "./exeptions";
import { Db } from "mongodb";

declare global {
  namespace NodeJS {
    interface Global {
      __FOX__: {
        db: {
          connections: {
            [name: string]: Db;
          },
        },
      };

      HttpExeption: typeof HttpEx;
    }
  }

  var __FOX__: {
    db: {
      connections: {
        [name: string]: Db,
      },
    },
  };

  // tslint:disable-next-line:variable-name
  var HttpExeption: typeof HttpEx;
}

global.__FOX__ = {
  db: {
    connections: {},
  },
};

global.HttpExeption = HttpEx;
