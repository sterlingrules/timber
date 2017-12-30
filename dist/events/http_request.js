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
 * The HTTP request event tracks incoming and outgoing
 * HTTP requests to your server.
 */
var HTTPRequest = function (_Event) {
  _inherits(HTTPRequest, _Event);

  /**
   * @param {String} [body] - the body of the request
   * @param {String} [direction] - incoming or outgoing
   * @param {Array} [headers] - the headers of the request
   * @param {String} host - the server's hostname
   * @param {String} method - `CONNECT` `DELETE` `GET` `HEAD` `OPTIONS` `PATCH` `POST` `PUT` `TRACE`
   * @param {String} [path] - the path of the request
   * @param {Number} [port] - the port of the request
   * @param {String} [query_string] - the query parameters present on the url
   * @param {String} [request_id] - the uuid attached to the request
   * @param {String} scheme - `HTTP` or `HTTPS`
   */
  function HTTPRequest() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        body = _ref.body,
        direction = _ref.direction,
        headers = _ref.headers,
        host = _ref.host,
        method = _ref.method,
        path = _ref.path,
        port = _ref.port,
        query_string = _ref.query_string,
        request_id = _ref.request_id,
        scheme = _ref.scheme;

    _classCallCheck(this, HTTPRequest);

    // check for required attributes
    var _this = _possibleConstructorReturn(this, (HTTPRequest.__proto__ || Object.getPrototypeOf(HTTPRequest)).call(this));

    _this.required({ host: host, method: method, scheme: scheme });

    // bind context attributes to the class
    _this.body = body;
    _this.direction = direction;
    _this.headers = headers;
    _this.host = host;
    _this.method = method;
    _this.path = path;
    _this.port = port;
    _this.query_string = query_string;
    _this.request_id = request_id;
    _this.scheme = scheme;
    return _this;
  }

  _createClass(HTTPRequest, [{
    key: 'message',
    value: function message() {
      return 'Started ' + this.method + ' "' + this.path + '"';
    }
  }]);

  return HTTPRequest;
}(_event2.default);

exports.default = HTTPRequest;