import * as mongodb from 'mongodb'
import * as deasync from 'deasync'

declare interface Cursor<T> {
  addCursorFlag(flag: string, value: boolean): this

  addQueryModifier(name: string, value: boolean): this

  batchSize(value: number): this

  close(): any
  close(callback: mongodb.MongoCallback<any>): void

  toArray(): Array<T>
  toArray(callback: mongodb.MongoCallback<Array<T>>): void
}

class Cursor<T> {
  protected _cursor: mongodb.Cursor

  constructor(cursor: mongodb.Cursor) {
    this._cursor = cursor
  }

  addCursorFlag(flag: string, value: boolean) {
    this._cursor = this._cursor.addCursorFlag(flag, value)

    return this
  }

  addQueryModifier(name: string, value: boolean) {
    this._cursor = this._cursor.addQueryModifier(name, value)

    return this
  }

  batchSize(value: number) {
    this._cursor = this._cursor.batchSize(value)

    return this
  }

  close(callback?: mongodb.MongoCallback<any>) {
    if (callback) return this._cursor.close(callback)

    let result: any | undefined

    this._cursor.close((err, res) => {
      if (err) throw err

      result = res
    })

    while (result == undefined) deasync.sleep(1)

    return result
  }

  toArray(callback?: mongodb.MongoCallback<Array<T>>) {
    if (callback) return this._cursor.toArray(callback)

    let array: Array<any> | undefined

    this._cursor.toArray((err, docs) => {
      if (err) throw err

      array = docs
    })

    while (array == undefined) deasync.sleep(1)

    return array
  }
}

export default Cursor
