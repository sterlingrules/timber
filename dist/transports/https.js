'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _stream = require('stream');

var _debug = require('../utils/debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HOSTNAME = 'logs.timber.io';
var PATH = '/frames';
var CONTENT_TYPE = 'application/json';
var USER_AGENT = 'Timber Node HTTPS Stream/' + require('../../package.json').version;
var PORT = 443;

/**
 * A highly efficient stream for sending logs to Timber via HTTPS. It uses batches,
 * keep-alive connections (and in the future maybe msgpack) to deliver logs with high-throughput
 * and little overhead. It also implements the Stream.Writable interface so that it can be treated
 * like a stream. This is beneficial when using something like Morgan, where you can pass a custom stream.
 */

var HTTPS = function (_Writable) {
  _inherits(HTTPS, _Writable);

  /**
   * @param {string} apiKey - Timber API Key
   * @param {Object} [options] - Various options to adjust the stream behavior.
   * @param {string} [options.flushInterval=1000] - How often, in milliseconds, the messages written to the stream should be delivered to Timber.
   * @param {string} [options.httpsAgent] - Your own custom https.Agent. We use agents to maintain connection pools and keep the connections alive. This avoids the initial connection overhead every time we want to communicate with Timber. See https.Agent for options.
   */
  function HTTPS(apiKey) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$flushInterval = _ref.flushInterval,
        flushInterval = _ref$flushInterval === undefined ? 1000 : _ref$flushInterval,
        _ref$highWaterMark = _ref.highWaterMark,
        highWaterMark = _ref$highWaterMark === undefined ? 5000 : _ref$highWaterMark,
        httpsAgent = _ref.httpsAgent,
        httpsClient = _ref.httpsClient,
        _ref$hostName = _ref.hostName,
        hostName = _ref$hostName === undefined ? HOSTNAME : _ref$hostName,
        _ref$path = _ref.path,
        path = _ref$path === undefined ? PATH : _ref$path,
        _ref$port = _ref.port,
        port = _ref$port === undefined ? PORT : _ref$port;

    _classCallCheck(this, HTTPS);

    var _this = _possibleConstructorReturn(this, (HTTPS.__proto__ || Object.getPrototypeOf(HTTPS)).call(this, { objectMode: true, highWaterMark: highWaterMark }));
    // Ensure we use object mode and set a default highWaterMark


    (0, _debug2.default)('Initializing HTTPS transport stream');

    _this.acceptsObject = true;
    _this.apiKey = apiKey;
    _this.hostName = hostName;
    _this.path = path;
    _this.port = port;
    _this.flushInterval = flushInterval;
    _this.httpsAgent = httpsAgent || new _https2.default.Agent({
      maxSockets: 5
    });
    _this.httpsClient = httpsClient || _https2.default;

    // Cork the stream so we can utilize the internal Buffer. We do *not* want to
    // send a request for every message. The _flusher will take care of flushing the stream
    // on an interval.
    _this.cork();

    // In the event the _flusher is not fast enough, we need to monitor the buffer size.
    // If it fills before the next flush event, we should immediately flush.

    if (flushInterval !== undefined && flushInterval > 0) {
      (0, _debug2.default)('Starting stream flusher');
      _this._startFlusher();
    }
    return _this;
  }

  /**
   * _writev is a Stream.Writeable methods that, if present, will write multiple chunks of
   * data off of the buffer. Defining it means we do not need to define _write.
   */


  _createClass(HTTPS, [{
    key: '_writev',
    value: function _writev(chunks, next) {
      var _this2 = this;

      (0, _debug2.default)('Sending ' + chunks.length + ' log to stream');
      var messages = chunks.map(function (chunk) {
        return chunk.chunk;
      });
      var body = JSON.stringify(messages);
      var options = {
        headers: {
          'Content-Type': CONTENT_TYPE,
          'User-Agent': USER_AGENT
        },
        agent: this.httpsAgent,
        auth: this.apiKey,
        hostname: this.hostName,
        port: this.port,
        path: this.path,
        method: 'POST'

        // Add debug outputs for every possible request event
        // This should help debugging network related issues
      };(0, _debug2.default)('Instantiating req object');
      var req = this.httpsClient.request(options, function (res) {
        (0, _debug2.default)(_this2.hostName + ' responded with ' + res.statusCode);
        res.on('aborted', function () {
          return (0, _debug2.default)('Response event: aborted');
        });
        res.on('close', function () {
          return (0, _debug2.default)('Response event: close');
        });
      });

      req.on('error', function (err) {
        return (0, _debug2.default)('Error connecting to logs.timber.io:', err);
      });
      req.on('abort', function () {
        return (0, _debug2.default)('Request event: abort');
      });
      req.on('aborted', function () {
        return (0, _debug2.default)('Request event: aborted');
      });
      req.on('connect', function () {
        return (0, _debug2.default)('Request event: connect');
      });
      req.on('continue', function () {
        return (0, _debug2.default)('Request event: continue');
      });
      req.on('response', function () {
        return (0, _debug2.default)('Request event: response');
      });
      req.on('socket', function (sock) {
        (0, _debug2.default)('Request event: socket');
        sock.on('close', function () {
          return (0, _debug2.default)('Socket event: close');
        });
        sock.on('connect', function () {
          return (0, _debug2.default)('Socket event: connect');
        });
        sock.on('data', function () {
          return sock.end();
        });
        sock.on('drain', function () {
          return (0, _debug2.default)('Socket event: drain');
        });
        sock.on('end', function () {
          return (0, _debug2.default)('Socket event: end');
        });
        sock.on('error', function () {
          return (0, _debug2.default)('Socket event: error');
        });
        sock.on('lookup', function () {
          return (0, _debug2.default)('Socket event: lookup');
        });
        sock.on('drain', function () {
          return (0, _debug2.default)('Socket event: drain');
        });
      });
      req.on('upgrade', function () {
        return (0, _debug2.default)('Request event: upgrade');
      });

      req.write(body);
      req.end();
      next();
    }
  }, {
    key: '_write',
    value: function _write(chunk, encoding, next) {
      this._writev([{ chunk: chunk, encoding: encoding }], next);
    }

    /**
     * Expressive function to flush the buffer contents. uncork flushes the buffer and write
     * the contents. Cork allows us to continue buffering the messages until the next flush.
     */

  }, {
    key: '_flush',
    value: function _flush() {
      var _this3 = this;

      // nextTick is recommended here to allow batching of write calls I think
      process.nextTick(function () {
        _this3.uncork();
        _this3.cork();
      });
    }

    /**
     * Interval to call _flush continuously. This ensures log lines get sent on this.flushInterval
     * intervals.
     */

  }, {
    key: '_startFlusher',
    value: function _startFlusher() {
      var _this4 = this;

      setInterval(function () {
        return _this4._flush();
      }, this.flushInterval);
    }
  }]);

  return HTTPS;
}(_stream.Writable);

exports.default = HTTPS;