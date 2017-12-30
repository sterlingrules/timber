'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _log_entry = require('../log_entry');

var _log_entry2 = _interopRequireDefault(_log_entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @private
 *
 * This module is meant to be *private* and should not be used directly.
 * It's an internal function used by the Timber library to log within our
 * integrations. It an abstraction on top of the various loggers our clients
 * could use, ensuring we use the proper logger within each integration.
 *
 * For example, take Express. We provide a single middleware for capturing context
 * and logging HTTP request and response events. We need to log to winston if the
 * client is using winston, or the console if they are not. But a client should know
 * which logger they are using and use that directly.
 */

var loggers = {
  console: {
    detect: function detect() {
      return _config2.default.logger.constructor.name === 'Console' || _config2.default.logger.constructor.name === 'CustomConsole';
    },
    handler: function handler(level, message, metadata) {
      if (metadata) {
        return _config2.default.logger[level](new _log_entry2.default(message, metadata));
      }
      return _config2.default.logger[level](message);
    }
  },
  winston: {
    detect: function detect() {
      return _config2.default.logger.Container && _config2.default.logger.Logger && _config2.default.logger.Transport;
    },
    handler: function handler(level, message) {
      var metadata = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return _config2.default.logger.log(level, message, metadata);
    }
  },
  bunyan: {
    detect: function detect() {
      return _config2.default.logger.constructor.name === 'Logger';
    },
    handler: function handler(level, message, metadata) {
      _config2.default.logger[level](metadata, message);
    }
  }
};

var log = function log() {
  // Iterate through the loggers object to detect
  // which logger is set in the timber config.
  for (var name in loggers) {
    // If we successfully detected the logger...
    if (loggers[name].detect()) {
      var _loggers$name;

      // Pass the provded arguments to the logger
      return (_loggers$name = loggers[name]).handler.apply(_loggers$name, arguments);
    }
  }
};

exports.default = log;