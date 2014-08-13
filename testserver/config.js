/** Configuration for the local WebDAV testing server. */

/**
 * @description The scheme of the protocol over which the connection is made.
 * Modify this if using an alternative such as HTTPS.
 * @type {string}
 * @constant
 */
var SCHEME = 'http';

/**
 * @description The hostname of the machine on which the server is running,
 * used by the test suite when connecting. Modify this if running the server
 * externally.
 * @type {string}
 * @constant
 */
var HOST = 'localhost';

/**
 * @description The port on which the server communicates.
 * @type {number}
 * @constant
 */
var PORT = 8000;

/**
 * @description The full URL of the server, formed of scheme, host and port.
 * @type {string}
 * @constant
 */
var URL = SCHEME + '://' + HOST + ':' + PORT + '/';

/**
 * @description The relative path of the directory that stores assets for
 *     testing.
 * @type {string}
 * @constant
 */
var ASSETS_DIRECTORY = '/assets';

module.exports = {
  SCHEME: SCHEME,
  HOST: HOST,
  PORT: PORT,
  URL: URL,
  ASSETS_DIRECTORY: ASSETS_DIRECTORY
};
