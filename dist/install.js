'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _attach = require('./utils/attach');

var _attach2 = _interopRequireDefault(_attach);

var _errors = require('./data/errors');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Installs the timber logger to route all stdout logs to the provided stream
 *
 * @param {Stream} transport - the stream that all logs will go through
 */
function install(transport) {
  if (!transport) throw Error(_errors2.default.install.noTransport);

  // attach our transport stream to stdout/stderr
  (0, _attach2.default)([transport], process.stdout);
  (0, _attach2.default)([transport], process.stderr);
}

exports.default = install;