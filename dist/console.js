'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * @module timber/console
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               * This module transparently augments console messages with structured data. Continue
                                                                                                                                                                                                                                                                               * to use `console` as you normally would and also pass an object as a second
                                                                                                                                                                                                                                                                               * parameter to log structured data. In the examples below you will notice logs are
                                                                                                                                                                                                                                                                               * appended with `@metadata ...`. This is what we mean by "augment". The timber.io
                                                                                                                                                                                                                                                                               * service will strip and parse this data. See timber.io/docs for more details.
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               * @example <caption>Logging a string</caption>
                                                                                                                                                                                                                                                                               * console.log('Hello world')
                                                                                                                                                                                                                                                                               * // Hello world @metadata {'dt': '2017-10-09T02:42:12.235421Z', 'level': 'info', ...}
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               * @example <caption>Logging a structured data</caption>
                                                                                                                                                                                                                                                                               * console.warn('Payent rejected', event: {payment_rejected: { customer_id: "abcd1234", amount: 100, reason: "Card expired" }})
                                                                                                                                                                                                                                                                               * // Payent rejected @metadata {'dt': '2017-10-09T02:42:12.235421Z', 'level': 'warn', 'event': {'payment_rejected': {'customer_id': 'abcd1234', 'amount': 100, 'reason': 'Card expired'}}}
                                                                                                                                                                                                                                                                               */

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _log_entry = require('./log_entry');

var _log_entry2 = _interopRequireDefault(_log_entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Transforms an ordinary console.log message into a structured Log object.
 * It also allows you to pass a Log object directly to a console.log function
 * It will automatically detect whether or not you are passing a structured
 * log into the console before attempting to transform it.
 *
 * This is also what is responsible for assigning the correct level to the log.
 *
 * @param {Array} args - argument list passed to console
 * @param {String} level - `info` `warn` `error` `debug` `fatal`
 */
var transformConsoleLog = function transformConsoleLog(_ref) {
  var args = _ref.args,
      level = _ref.level;

  // Allow custom metadata and event logging
  // https://github.com/timberio/timber-node/issues/41
  if (args.length === 2 && typeof args[0] === 'string' && _typeof(args[1]) === 'object') {
    if (args[1].meta && _typeof(args[1].meta) === 'object') {
      return new _log_entry2.default(args[0], { level: level, meta: _extends({}, args[1].meta) }).format();
    } else if (args[1].event && _typeof(args[1].event) === 'object') {
      return new _log_entry2.default(args[0], {
        level: level,
        event: { custom: _extends({}, args[1].event) }
      }).format();
    }
  }
  var log = args[0] instanceof _log_entry2.default ? args[0] : new _log_entry2.default(_util2.default.format.apply(null, args) + '\n');
  log.setLevel(level);
  return log.format();
};

var originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error
};

console.log = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _config2.default._attached_stdout || _config2.default.append_metadata ? process.stdout.write(transformConsoleLog({ args: args, level: 'info' })) : originalConsole.log.apply(originalConsole, args);
};

console.info = function () {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return _config2.default._attached_stdout || _config2.default.append_metadata ? process.stdout.write(transformConsoleLog({ args: args, level: 'info' })) : originalConsole.info.apply(originalConsole, args);
};

console.warn = function () {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return _config2.default._attached_stdout || _config2.default.append_metadata ? process.stdout.write(transformConsoleLog({ args: args, level: 'warn' })) : originalConsole.warn.apply(originalConsole, args);
};

console.error = function () {
  for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  return _config2.default._attached_stderr || _config2.default.append_metadata ? process.stderr.write(transformConsoleLog({ args: args, level: 'error' })) : originalConsole.error.apply(originalConsole, args);
};