'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('../events');

var _log_entry = require('../log_entry');

var _log_entry2 = _interopRequireDefault(_log_entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var WinstonFormatter = function WinstonFormatter(_ref) {
  var raw = _ref.message,
      level = _ref.level,
      metadata = _ref.meta,
      timestamp = _ref.timestamp;

  var message = timestamp ? timestamp() + ' - ' + raw : raw;
  var structuredLog = new _log_entry2.default(message, { level: level });

  var event = metadata.event,
      context = metadata.context,
      meta = _objectWithoutProperties(metadata, ['event', 'context']);

  // If custom metadata was provided with the log, append it


  if (Object.keys(meta).length) {
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

  return structuredLog.format();
};

exports.default = WinstonFormatter;