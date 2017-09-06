import fs from 'fs-extra';
import path from 'path';

module.exports = () => {
  const cwd = process.cwd();
  const devConfigPath = path.resolve(__dirname, '../config/webpack.config.dev.js');
  const proConfigPath = path.resolve(__dirname, '../config/webpack.config.product.js');
  fs.copySync(devConfigPath, path.resolve(cwd, './webpack.config.js'));
  fs.copySync(devConfigPath, path.resolve(cwd, './webpack.config.product.js'));
}
