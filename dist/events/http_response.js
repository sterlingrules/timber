'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _event = require('../event');

var _event2 = _interopRequireDefault(_event);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The HTTP server request event tracks incoming HTTP requests to your HTTP server.
 */
var HTTPResponse = function (_Event) {
  _inherits(HTTPResponse, _Event);

  /**
   * @param {String} [body] - the body of the request
   * @param {String} [direction] - incoming or outgoing
   * @param {Array} [headers] - the headers of the request
   * @param {Object} [request] - the request object (only set if combine_http_events is true)
   * @param {String} [request_id] - the uuid of the request
   * @param {String} status - the HTTP status code
   * @param {String} time_ms - the total duration of the request in milliseconds
   */
  function HTTPResponse() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        body = _ref.body,
        direction = _ref.direction,
        headers = _ref.headers,
        request = _ref.request,
        request_id = _ref.request_id,
        status = _ref.status,
        time_ms = _ref.time_ms;

    _classCallCheck(this, HTTPResponse);

    // check for required attributes
    var _this = _possibleConstructorReturn(this, (HTTPResponse.__proto__ || Object.getPrototypeOf(HTTPResponse)).call(this));

    _this.required({ status: status, time_ms: time_ms });

    // bind context attributes to the class
    _this.body = body;
    _this.direction = direction;
    _this.headers = headers;
    _this.request = request;
    _this.request_id = request_id;
    _this.status = status;
    _this.time_ms = time_ms;
    return _this;
  }

  _createClass(HTTPResponse, [{
    key: 'message',
    value: function message() {
      var parts = ['Outgoing HTTP response'];

      if (this.service_name) {
        parts.push('from ' + this.service_name);
      }

      parts.push(this.status + ' in ' + this.time_ms + 'ms');

      return parts.join(' ');
    }
  }]);

  return HTTPResponse;
}(_event2.default);

exports.default = HTTPResponse;