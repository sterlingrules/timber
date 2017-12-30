'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _arguments = arguments;

var _stream = require('stream');

var _metadata = require('../utils/metadata');

var _errors = require('../data/errors');

var _errors2 = _interopRequireDefault(_errors);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

var _log_entry = require('../log_entry');

var _log_entry2 = _interopRequireDefault(_log_entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Attaches a transport stream to a writeable stream.
 *
 * @param {Array} transports - array of transports to attach to the stream
 * @param {Writable} toStream - the stream your transport will attach to
 * @param {Object} options - configuration options
 * @param {boolean} options.applyBackPressure
 */
var attach = function attach(transports, toStream) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$applyBackPressur = _ref.applyBackPressure,
      applyBackPressure = _ref$applyBackPressur === undefined ? false : _ref$applyBackPressur;

  // Ensure all the streams are Writable
  for (var i = 0; i < transports.length; i++) {
    if (!(transports[i] instanceof _stream.Writable)) {
      throw new Error(_errors2.default.attach.notWritable);
    }
  }

  // Store refs to standard logging utilities
  var originalWrite = toStream.write;

  (0, _debug2.default)('attaching ' + transports.length + ' transports to stream');

  toStream.write = function (message, encoding, fd) {
    var log = message instanceof _log_entry2.default ? message : new _log_entry2.default(message);

    var _loop = function _loop(_i) {
      var transport = transports[_i];

      var written = transport.write(transport.acceptsObject ? log.data : log.data.message, encoding, fd);

      if (!written && applyBackPressure) {
        transport.once('drain', function () {
          return transport.write.apply(transport, _arguments);
        });
      }
    };

    for (var _i = 0; _i < transports.length; _i++) {
      _loop(_i);
    }

    // When writing the log to the original stream,
    // strip the metadata if we're not in production
    originalWrite.apply(toStream, [_config2.default.append_metadata || process.env.NODE_ENV === 'production' ? log.data.message : (0, _metadata.stripMetadata)(log.data.message)]);
  };

  if (toStream === process.stdout) {
    _config2.default._attached_stdout = true;
  } else if (toStream === process.stderr) {
    _config2.default._attached_stderr = true;
  }

  return {
    detach: function detach() {
      toStream.write = originalWrite;
    }
  };
};

exports.default = attach;