import is, { TYPES, ObjectString } from './is';
import * as version from './version';
import * as brower from './brower';
import runCmd from './runCmd';
import logger from './logger';

exports.version = version;

// is
exports.is = is;
exports.TYPES = TYPES;
exports.ObjectString = ObjectString;

exports.brower = brower;
exports.runCmd = runCmd;
exports.logger = logger;
