import dotenv = require('dotenv')
import * as path from 'path'
import 'prototyped.js/es6'

dotenv.config()

// dotenv.config({
//   path: path.join(path.dirname((require.main as OBJ).filename), '.env')
// })

import { HttpExeption as HttpEx } from './exeptions'
import { Db } from 'mongodb'

declare global {
  namespace NodeJS {
    interface Global {
      __FOX__: {
        db: {
          connections: {
            [name: string]: Db
          }
        }
      }

      HttpExeption: typeof HttpEx
    }
  }

  var __FOX__: {
    db: {
      connections: {
        [name: string]: Db
      }
    }
  }

  var HttpExeption: typeof HttpEx
}

global.__FOX__ = {
  db: {
    connections: {}
  }
}

global.HttpExeption = HttpEx
