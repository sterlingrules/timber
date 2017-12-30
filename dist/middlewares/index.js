'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('./express');

var _express2 = _interopRequireDefault(_express);

var _koa = require('./koa');

var _koa2 = _interopRequireDefault(_koa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = { express: _express2.default, koa: _koa2.default };