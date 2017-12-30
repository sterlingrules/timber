'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debug_logger = undefined;

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convenience function for retrieving a reference to
 * the debug_logger stream.
 *
 * @private
 */
var debug_logger = exports.debug_logger = function debug_logger() {
  return _config2.default.debug_logger;
};

/**
 * Generate a timestamp string to use in debug lines
 *
 * @private
 */
var timestamp = function timestamp() {
  return new Date().toISOString();
};

/**
 * Convenience function for logging debug messages
 * to the configured debug_logger
 *
 * This works much like the builtin console.log function,
 * accepting any amount of mixed arguments and concatenating
 * them into a single string to be sent to the debug_logger stream
 *
 * @private
 * @param {...*} args
 */
var debug = function debug() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (debug_logger()) {
    debug_logger().write('[' + timestamp() + ']: ' + _util2.default.format.apply(null, args) + '\n');
  }
};

exports.default = debug;