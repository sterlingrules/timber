'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _errors = require('./data/errors');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JSON_SCHEMA_URL = 'https://raw.githubusercontent.com/timberio/log-event-json-schema/v3.1.3/schema.json';

/**
 * This class is instantiated before
 * Transforms a log message or object into a rich structured format
 * that timber expects, ex 'log message' @timber.io {"dt": "…", "level": "info", "context": {…}}
 * see https://github.com/timberio/log-event-json-schema for specs
 */

var LogEntry = function () {
  /**
   * @param {String} message - the log message before transforming
   * @param {Object} [context] - context to be attached to message
   */
  function LogEntry(message) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, LogEntry);

    // Throw an error if no message is provided
    // if (!message) throw new Error(_errors2.default.log.noMessage);

    /**
     * Reference to original log message
     * @type {String}
     */
    this.raw = message;

    /**
     * Structured log data
     * @type {Date}
     */
    this.data = _extends({
      $schema: JSON_SCHEMA_URL,
      dt: new Date(),
      message: message
    }, context);
  }

  /**
   * Adds the to the log entry. A log entry can only contain a single
   * event.
   *
   * @param {Event} event
   */


  _createClass(LogEntry, [{
    key: 'addEvent',
    value: function addEvent(event) {
      this.append({ event: event });
    }

    /**
     * Appends data to the end of the structured log object
     *
     * @param {Object} data
     */

  }, {
    key: 'append',
    value: function append(data) {
      this.data = _extends({}, this.data, data);
    }

    /**
     * Convenience function for setting the log level
     *
     * @param {String} level - `info` `warn` `error` `debug`
     */

  }, {
    key: 'setLevel',
    value: function setLevel(level) {
      this.append({ level: level });
    }

    /**
     * Transforms the structured log into a string
     * i.e. `Log message @metadata { ... }`
     */

  }, {
    key: 'format',
    value: function format() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$withMetadata = _ref.withMetadata,
          withMetadata = _ref$withMetadata === undefined ? true : _ref$withMetadata;

      var _data = this.data,
          dt = _data.dt,
          message = _data.message,
          rest = _objectWithoutProperties(_data, ['dt', 'message']);

      var log = this.raw.endsWith('\n') ? this.raw.substring(0, this.raw.length - 1) : this.raw;

      if (_config2.default.timestamp_prefix) {
        log = dt.toISOString() + ' ' + log;
      }

      if (withMetadata) {
        var data = _config2.default.timestamp_prefix ? rest : _extends({ dt: dt }, rest);
        log += ' ' + _config2.default.metadata_delimiter + ' ' + JSON.stringify(data);
      }

      return log + '\n';
    }
  }]);

  return LogEntry;
}();

exports.default = LogEntry;
