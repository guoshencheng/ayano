import path from 'path';
import spawn from 'react-dev-utils/crossSpawn';

module.exports = (configPath) => {
  process.env.NODE_ENV = "production";
  const webpackPro = configPath || path.resolve(__dirname, '../config/webpack.config.product.js');
  const command = 'webpack';
  const args = ['--progress', '--display-error-details', '--config', webpackPro]
  spawn.sync(command, args, { stdio: 'inherit' });
};
