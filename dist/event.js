"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This is the base class for all event types
 */
var Event = function () {
  function Event() {
    _classCallCheck(this, Event);
  }

  _createClass(Event, [{
    key: "required",

    /**
     * required checks for the existence of the given attributes.
     * If any of the values provided are undefined, an error will be thrown
     *
     * @private
     * @param {object} attributes - key/value pair of required attributes
     */
    value: function required(attributes) {
      for (var attribute in attributes) {
        if (!attributes[attribute] && attributes[attribute] !== 0) {
          throw new Error(attribute + " is required");
        }
      }
    }
  }]);

  return Event;
}();

exports.default = Event;