"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var npmInstallTag = function npmInstallTag(pacakageJson) {
  return function (packageName) {
    return function (tag) {
      if (tag) {
        return packageName + "@" + tag;
      } else {
        if (pacakageJson.related && pacakageJson.related[packageName]) {
          return packageName + "@" + pacakageJson.related[pacakageName];
        } else {
          return packageName;
        }
      }
    };
  };
};
exports.npmInstallTag = npmInstallTag;