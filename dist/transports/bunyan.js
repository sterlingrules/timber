'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _stream = require('stream');

var _events = require('../events');

var _errors = require('../data/errors');

var _errors2 = _interopRequireDefault(_errors);

var _log_entry = require('../log_entry');

var _log_entry2 = _interopRequireDefault(_log_entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The Timber Bunyan transport allows you to seamlessly install
 * Timber in your apps that use bunyan as the logger.
 */
var BunyanTransport = function (_Writable) {
  _inherits(BunyanTransport, _Writable);

  /**
   * @param {Object} [options] - Configuration options for the transport
   * @param {string} [options.stream] - Stream to write to
   */
  function BunyanTransport() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref$stream = _ref.stream,
        stream = _ref$stream === undefined ? process.stdout : _ref$stream,
        options = _objectWithoutProperties(_ref, ['stream']);

    _classCallCheck(this, BunyanTransport);

    if (!stream) {
      throw new Error(_errors2.default.transports.bunyan.stream);
    }

    var _this = _possibleConstructorReturn(this, (BunyanTransport.__proto__ || Object.getPrototypeOf(BunyanTransport)).call(this, options));

    _this.name = 'timberBunyan';
    _this.level = options.level || 'info';

    // Attach the provided stream
    _this.stream = stream;
    return _this;
  }

  /**
   * @param {buffer|string} [chunk] - The chunk to be written. Will always be a buffer unless the decodeStrings option was set to false or the stream is operating in object mode.
   * @param {string} [encoding] - If the chunk is a string, then encoding is the character encoding of that string. If chunk is a Buffer, or if the stream is operating in object mode, encoding may be ignored.
   * @param {function} [next] - Call this function (optionally with an error argument) when processing is complete for the supplied chunk.
   */


  _createClass(BunyanTransport, [{
    key: '_write',
    value: function _write(chunk, encoding, next) {
      // Parse the JSON object
      var data = JSON.parse(chunk.toString());
      var msg = data.msg,
          event = data.event,
          context = data.context,
          meta = data.meta;
      // Convert the level integer into a string representation

      var level = _bunyan2.default.nameFromLevel[data.level];

      // Create a structured log object out of the log message
      var structuredLog = new _log_entry2.default(msg, { level: level });

      // If custom metadata was provided with the log, append it
      if (meta && Object.keys(meta).length) {
        structuredLog.append({ meta: meta });
      }

      // If the event key exists, append a custom event
      if (event) {
        for (var eventName in event) {
          if (!event[eventName]) continue;
          structuredLog.append({
            event: new _events.Custom({ type: eventName, data: event[eventName] })
          });
        }
      }

      // If a context object was provided with the log, append it
      if (context) {
        structuredLog.append({
          context: context
        });
      }

      // Write our structured log to the timber https stream
      this.stream.write(structuredLog.format());
      next();
    }
  }]);

  return BunyanTransport;
}(_stream.Writable);

exports.default = BunyanTransport;