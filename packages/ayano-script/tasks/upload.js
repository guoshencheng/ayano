var qiniu = require('gulp-qiniu');
var paths = require('../lib/config/paths.js');
const readConfig = require('../src/config/readConfig');

var resolveApp = paths.resolveApp;

const config = readConfig();
var upload = config.upload || {};
var output = config.output || '';

const checkProps = (value) => (key, waring) => {
  if (!value[key]) {
    console.warn(waring);
    return false
  } else {
    return true;
  }
}

module.exports = (gulp) => {
  var qiniuConfig = upload.qiniu || {};
  const check = checkProps(qiniuConfig);
  var prefix = qiniuConfig.prefix;
  delete qiniuConfig.prefix;
  gulp.task('qiniu', function() {
    var access = check('accessKey', "请在ayano.config.js中设置accessKey") &&
    check('secretKey', "请在ayano.config.js中设置secretKey") &&
    check("bucket", "请在ayano.config.js中设置bucket");
    if (!access) return;
    gulp.src(paths.resolveApp(`${output}/**`)).pipe(qiniu(qiniuConfig, {
      dir: prefix,
      version: false
    }));
  });
};
