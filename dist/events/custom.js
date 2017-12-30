'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _event = require('../event');

var _event2 = _interopRequireDefault(_event);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The Custom event allows you to past arbitrary events to timber.
 */
var Custom = function (_Event) {
  _inherits(Custom, _Event);

  /**
   * @param {String} [type] - This is the type of your event. It should be something unique       and unchanging. It will be used to identify this event.
   * @param {Array} [data] - An object containing the event data
   */
  function Custom() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        type = _ref.type,
        data = _ref.data;

    _classCallCheck(this, Custom);

    // check for required attributes
    var _this = _possibleConstructorReturn(this, (Custom.__proto__ || Object.getPrototypeOf(Custom)).call(this));

    _this.required({ type: type });

    // bind context attributes to the class
    _this.custom = _defineProperty({}, type, data);
    return _this;
  }

  return Custom;
}(_event2.default);

exports.default = Custom;