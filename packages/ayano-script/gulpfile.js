var fs = require('fs');
var path = require('path');
const files = fs.readdirSync(path.resolve(__dirname, './tasks'));
const ayanoReactReadme = path.resolve(__dirname, '../ayano-react/README.md');
const tempReadme = path.resolve(__dirname, './template/README.md');
var gulp = require('gulp');

files.filter(file => /\.js$/.test(file)).forEach(file => {
  require(`./tasks/${file}`)(gulp)
})

gulp.task('upload', ['qiniu']);
gulp.task('cp-rdm', function() {
  if (fs.existsSync(tempReadme)) {
    fs.unlinkSync(tempReadme);
  }
  return gulp.src(ayanoReactReadme).pipe(gulp.dest(path.resolve(__dirname, './template')));
})

module.exports = gulp;
