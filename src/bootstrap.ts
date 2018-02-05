import 'prototyped.js/es6'
import * as dotenv from 'dotenv'

dotenv.config()

import { Events as DBEvents } from './database'
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
