import * as mongodb from "mongodb";
import * as deasync from "deasync";

declare module Cursor { }

declare interface Cursor<T> {
  close(): Promise<mongodb.CursorResult>;
  close(callback: mongodb.MongoCallback<mongodb.CursorResult>): void;

  count(): Promise<number>;
  count(callback: mongodb.MongoCallback<number>): void;
  count(applySkipLimit: boolean): Promise<number>;
  count(applySkipLimit: boolean, callback: mongodb.MongoCallback<number>): void;
  count(options: mongodb.CursorCommentOptions): Promise<number>;
  count(options: mongodb.CursorCommentOptions, callback: mongodb.MongoCallback<number>): void;
  count(applySkipLimit: boolean, options: mongodb.CursorCommentOptions): Promise<number>;
  count(applySkipLimit: boolean, options: mongodb.CursorCommentOptions, callback: mongodb.MongoCallback<number>): void;

  explain(): Promise<mongodb.CursorResult>;
  explain(callback: mongodb.MongoCallback<mongodb.CursorResult>): void;

  hasNext(): Promise<boolean>;
  hasNext(callback: mongodb.MongoCallback<boolean>): void;

  next(): Promise<T>;
  next(callback: mongodb.MongoCallback<T>): void;

  toArray(): Promise<T[]>;
  toArray(callback: mongodb.MongoCallback<T[]>): void;
}

class Cursor<T> {
  protected _cursor: mongodb.Cursor;

  constructor(cursor: mongodb.Cursor) {
    this._cursor = cursor;
  }

  addCursorFlag(flag: string, value: boolean): Cursor<T> {
    this._cursor = this._cursor.addCursorFlag(flag, value);

    return this;
  }

  addQueryModifier(name: string, value: boolean): Cursor<T> {
    this._cursor = this._cursor.addQueryModifier(name, value);

    return this;
  }

  batchSize(value: number): Cursor<T> {
    this._cursor = this._cursor.batchSize(value);

    return this;
  }

  clone(): Cursor<T> {
    return new Cursor(this._cursor.clone());
  }

  close(callback?: mongodb.MongoCallback<mongodb.CursorResult>) {
    return <Promise<mongodb.CursorResult> | void>this._cursor.close(
      <mongodb.MongoCallback<mongodb.CursorResult>>callback,
    );
  }

  comment(value: string): Cursor<T> {
    this._cursor = this._cursor.comment(value);

    return this;
  }

  count(
    applySkipLimit?: boolean | mongodb.CursorCommentOptions | mongodb.MongoCallback<number>,
    options?: mongodb.CursorCommentOptions | mongodb.MongoCallback<number>,
    callback?: mongodb.MongoCallback<number>,
  ) {
    return <Promise<number> | void>this._cursor.count(
      <boolean>applySkipLimit,
      <mongodb.CursorCommentOptions>options,
      <mongodb.MongoCallback<number>>callback,
    );
  }

  explain(callback?: mongodb.MongoCallback<mongodb.CursorResult>) {
    return <Promise<mongodb.CursorResult> | void>this._cursor.explain(
      <mongodb.MongoCallback<mongodb.CursorResult>>callback,
    );
  }

  filter(filter: object): Cursor<T> {
    this._cursor = this._cursor.filter(filter);

    return this;
  }

  forEach(iterator: mongodb.IteratorCallback<T>, callback?: mongodb.EndCallback): void {
    return this._cursor.forEach(iterator, <mongodb.EndCallback>callback);
  }

  hasNext(callback?: mongodb.MongoCallback<boolean>) {
    return <Promise<boolean> | void>this._cursor.hasNext(<mongodb.MongoCallback<boolean>>callback);
  }

  hint(hint: object): Cursor<T> {
    this._cursor = this._cursor.hint(hint);

    return this;
  }

  isClosed(): boolean {
    return this._cursor.isClosed();
  }

  limit(value: number): Cursor<T> {
    this._cursor = this._cursor.limit(value);

    return this;
  }

  map(transform: (...args: any[]) => any): Cursor<T> {
    this._cursor = this._cursor.map(transform);

    return this;
  }

  max(max: number): Cursor<T> {
    this._cursor = this._cursor.max(max);

    return this;
  }

  maxAwaitTimeMS(value: number): Cursor<T> {
    this._cursor = this._cursor.maxAwaitTimeMS(value);

    return this;
  }

  maxScan(maxScan: number): Cursor<T> {
    this._cursor = this._cursor.maxScan(maxScan);

    return this;
  }

  maxTimeMS(value: number): Cursor<T> {
    this._cursor = this._cursor.maxTimeMS(value);

    return this;
  }

  min(min: number): Cursor<T> {
    this._cursor = this._cursor.min(min);

    return this;
  }

  next(callback?: mongodb.MongoCallback<T>) {
    return <Promise<T> | void>this._cursor.next(<mongodb.MongoCallback<T>>callback);
  }

  pause(): Cursor<T> {
    this._cursor = this._cursor.pause();

    return this;
  }

  pipe(destination: NodeJS.WritableStream, options?: { end?: boolean; }): NodeJS.WritableStream {
    return this._cursor.pipe(destination, options);
  }

  project(value: object): Cursor<T> {
    this._cursor = this._cursor.project(value);

    return this;
  }

  read(size: number): string | Buffer | void {
    return this._cursor.read(size);
  }

  resume(): this {
    this._cursor = this._cursor.resume();

    return this;
  }

  returnKey(returnKey: object): Cursor<T> {
    this._cursor = this._cursor.returnKey(returnKey);

    return this;
  }

  rewind(): void {
    this._cursor.rewind();
  }

  setCursorOption(field: string, value: object): this {
    this._cursor = this._cursor.setCursorOption(field, value);

    return this;
  }

  setEncoding(encoding: string): this {
    this._cursor = this._cursor.setEncoding(encoding);

    return this;
  }

  setReadPreference(readPreference: string | mongodb.ReadPreference): this {
    this._cursor = this._cursor.setReadPreference(readPreference);

    return this;
  }

  showRecordId(showRecordId: object): this {
    this._cursor = this._cursor.showRecordId(showRecordId);

    return this;
  }

  skip(value: number): this {
    this._cursor = this._cursor.skip(value);

    return this;
  }

  snapshot(snapshot: object): this {
    this._cursor = this._cursor.snapshot(snapshot);

    return this;
  }

  sort(keyOrList: string | object[] | object, direction?: number): this {
    this._cursor = this._cursor.sort(keyOrList, direction);

    return this;
  }

  stream(options?: { transform?: (...args: any[]) => any }): this {
    this._cursor = this._cursor.stream(options);

    return this;
  }

  toArray(callback?: mongodb.MongoCallback<T[]>) {
    return <Promise<T[]> | void>this._cursor.toArray(<mongodb.MongoCallback<T[]>>callback);
  }

  unpipe(destination?: NodeJS.WritableStream): Cursor<T> {
    return new Cursor(this._cursor.unpipe(destination));
  }

  unshift(stream: Buffer | string): void {
    this._cursor.unshift(stream);
  }

  wrap(stream: NodeJS.ReadableStream): this {
    this._cursor = this._cursor.wrap(stream);

    return this;
  }
}

export = Cursor;
