import fs from 'fs';

/**
 *
 * @class Async
 */
export default class Async {
  /**
   *
   * @param {String|Buffer|Number} file
   * @param {String|Buffer|Array} data
   * @param {Function} callback
   * @return {Promise|*|void}
   */
  static put(file, data, callback) {
    return fs.writeFile(`${dotenv.storagePath}/${file}`, data, callback);
  }

  /**
   *
   * @param {String|Buffer|URL|Number} path
   * @param {Function} callback
   * @return {Promise|*|void}
   */
  static get(path, callback) {
    return fs.readFile(`${dotenv.storagePath}/${path}`, callback);
  }

  /**
   *
   * @param {String|Buffer|URL} file
   * @param {Function} callback
   * @return {Promise|*|void}
   */
  static exists(file, callback) {
    return fs.stat(`${dotenv.storagePath}/${file}`, callback);
  }

  /**
   *
   * @param {String|Buffer|Number} file
   * @param {String|Buffer} data
   * @param {Function} callback
   * @return {Promise|*|void}
   */
  static append(file, data, callback) {
    return fs.appendFile(`${dotenv.storagePath}/${file}`, data, callback);
  }

  /**
   *
   * @param {String|Buffer|URL} src
   * @param {String|Buffer|URL} dest
   * @param {Function} callback
   * @return {Promise|*|void}
   */
  static copy(src, dest, callback) {
    return fs.appendFile(`${dotenv.storagePath}/${src}`, `${dotenv.storagePath}/${dest}`, callback);
  }
}
