'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _composableMiddleware = require('composable-middleware');

var _composableMiddleware2 = _interopRequireDefault(_composableMiddleware);

var _expressRequestId = require('express-request-id');

var _expressRequestId2 = _interopRequireDefault(_expressRequestId);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _http = require('../contexts/http');

var _http2 = _interopRequireDefault(_http);

var _events = require('../events');

var _log = require('../utils/log');

var _log2 = _interopRequireDefault(_log);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } // import transform from '../transform'


/**
 * The express middleware takes care of automatically logging
 * each http event with the appropriate context events attached.
 *
 * This middleware is composed of three separate middlewares:
 * - `addRequestId` automatically attaches a unique uuid to every request
 * - `bodyParser` allows parsing of JSON encoded request bodies
 * - `expressMiddleware` automatically logs http events to timber
 *
 * @param {object} [options] - An object with configuration options
 * @param {object} [options.logger] - A custom logger to log http events to (usually either: console, winston, or bunyan)
 * @param {boolean} [options.capture_request_body] - Whether the http request body data will be captured (off by default)
 * @param {boolean} [options.combine_http_events] - If true, HTTPRequest and HTTPResponse events will be combined in a single log message (off by defaut)
*/
var expressMiddleware = function expressMiddleware(_ref) {
  var options = _objectWithoutProperties(_ref, []);

  // If a custom logger was provided, use it to log http events
  if (options.logger) {
    _config2.default.logger = options.logger;
  }
  return (0, _composableMiddleware2.default)((0, _expressRequestId2.default)(), _bodyParser2.default.json(), function (req, res, next) {
    // save a reference of the start time so that we can determine
    // the amount of time each http request takes
    req.start_time = new Date().getTime();

    // destructure the request object for ease of use

    var _req$headers = req.headers,
        host = _req$headers.host,
        headers = _objectWithoutProperties(_req$headers, ['host']),
        method = req.method,
        request_id = req.id,
        path = req.path,
        scheme = req.protocol,
        reqBody = req.body,
        connection = req.connection;

    // determine the ip address of the client
    // https://stackoverflow.com/a/10849772


    var remote_addr = headers['x-forwarded-for'] || connection.remoteAddress;

    // send the request body if the capture_request_body flag is true (off by default)
    // and the request body is not empty
    var body = options.capture_request_body && Object.keys(reqBody).length > 0 ? JSON.stringify(reqBody) : undefined;

    // create the HTTP context item
    var http_context = new _http2.default({
      method: method,
      path: path,
      request_id: request_id,
      remote_addr: remote_addr
    });

    // add the http context information to the metadata object
    var metadata = {
      context: {
        http: http_context
      }
    };

    var http_request = new _events.HTTPRequest({
      direction: 'incoming',
      body: body,
      host: host,
      path: path,
      request_id: request_id,
      scheme: scheme,
      method: method
    });

    // add the http_request event to the metadata object
    metadata.event = { http_request: http_request

      // Override the response end event
      // This event will send the http_client_response event to timber
      // If combine_http_events is true, this will be the only log generated
    };var end = res.end;
    res.end = function (chunk, encoding) {
      // Emit the original res.end event
      res.end = end;
      res.end(chunk, encoding);

      // destructure the response object for ease of use
      var resBody = res.body,
          status = res.statusCode;

      // calculate the duration of the http request

      var time_ms = new Date().getTime() - req.start_time;

      // send the response body if the capture_response_body flag is true (off by default)
      body = options.capture_response_body ? JSON.stringify(resBody) : undefined;

      var http_response = new _events.HTTPResponse({
        direction: 'outgoing',
        request_id: request_id,
        time_ms: time_ms,
        status: status,
        body: body
      });

      // If we're combining http events, append the request event
      if (options.combine_http_events) {
        http_response.request = http_request;
      }

      // add the http_response event to the metadata object
      metadata.event = { http_response: http_response };

      var message = options.combine_http_events ? method + ' ' + host + path + ' - ' + status + ' in ' + time_ms + 'ms' : http_response.message();

      // log the http response with metadata
      (0, _log2.default)('info', message, metadata);
    };

    // If we're not combining http events, log the http request
    if (!options.combine_http_events) {
      (0, _log2.default)('info', http_request.message(), metadata);
    }
    next();
  });
};

exports.default = expressMiddleware;