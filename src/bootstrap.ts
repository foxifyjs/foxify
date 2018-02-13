import * as path from 'path'
import * as dotenv from 'dotenv'
import 'prototyped.js/es6'

dotenv.config({
  path: path.join(path.dirname((require.main as OBJ).filename), '.env')
})

import { HttpExeption } from './exeptions'
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

      HttpExeption: HttpExeption
    }
  }

  var __FOX__: {
    db: {
      connections: {
        [name: string]: Db
      }
    }
  }

  var HttpExeption: HttpExeption
}

global.__FOX__ = {
  db: {
    connections: {}
  }
}

global.HttpExeption = require('./exeptions/HttpExeption')
