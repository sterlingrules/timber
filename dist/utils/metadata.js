'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var stripMetadata = exports.stripMetadata = function stripMetadata(log) {
  return log.split(' @metadata')[0] + '\n';
};