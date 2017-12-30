'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _context = require('../context');

var _context2 = _interopRequireDefault(_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The HTTP context adds data about the current HTTP request being processed
 * to your logs.This allows you to tail and filter by this data.
 */
var HTTP = function (_Context) {
  _inherits(HTTP, _Context);

  function HTTP() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        method = _ref.method,
        path = _ref.path,
        remote_addr = _ref.remote_addr,
        request_id = _ref.request_id;

    _classCallCheck(this, HTTP);

    // check for required attributes
    var _this = _possibleConstructorReturn(this, (HTTP.__proto__ || Object.getPrototypeOf(HTTP)).call(this));

    _this.required({ method: method, path: path });

    // bind context attributes to the class
    _this.method = method;
    _this.path = path;
    _this.remote_addr = remote_addr;
    _this.request_id = request_id;
    return _this;
  }

  return HTTP;
}(_context2.default);

HTTP.keyspace = 'http';
exports.default = HTTP;