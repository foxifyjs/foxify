import Any from './Any'
import Array from './Array'
import Boolean from './Boolean'
import Buffer from './Buffer'
import Date from './Date'
import Number from './Number'
import Object from './Object'
import String from './String'

declare module Type {}

// TODO ObjectId

class Type {
  static get Any() {
    return new Any
  }

  static get Array() {
    return new Array
  }

  static get Boolean() {
    return new Boolean
  }

  static get Buffer() {
    return new Buffer
  }

  static get Date() {
    return new Date
  }

  static get Number() {
    return new Number
  }

  static get Object() {
    return new Object
  }

  static get String() {
    return new String
  }
}

export = Type
