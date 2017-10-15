/**
  config: {
    server: 'xxx.xxxx.xxx', // append /app
    appScrect: "xxxxxxxxxxxxxxxxx",
    appId: "",
    htmlPath: './',
    resourceFile: './'
  }
 */

const env = process.env.ayano_PUBLISH_ENV;

import paths from '../config/paths.js';
import path from 'path';
import chalk from 'chalk';
import axios from 'axios';
import fs from 'fs';

const defaultPrefix = 'env_';
const ayanoPublishConfigKey = 'ayano-publish-config';

module.exports = (comment) => {
  const packageJson = require(paths.appPackageJson);
  //load config fron package.json
  let publishConfig = packageJson[ayanoPublishConfigKey];

  if (!publishConfig) {
    console.log("↖(▔^▔)↗" + chalk.red(`  key ${ayanoPublishConfigKey} in package.json is not exist !! `));
    console.log('↖(▔^▔)↗  Exit!!')
    return;
  }
  // load current config with env
  const currentConfig = ((prefix) => (config) => {
    const prefixTest = new RegExp(prefix);
    const allKeys = Object.keys(publishConfig);
    const defaultKeys = allKeys.filter(key => !prefixTest.test(key));
    const envKeys = allKeys.filter(key => prefixTest.test(key));
    const defautConfig = defaultKeys.reduce((pre, key) => {
      return Object.assign({}, pre, { [key]: config[key] })
    }, {})
    const envConfigs = allKeys.reduce((pre, key) => {
      const _config = Object.assign({}, defautConfig, config[key]);
      key = key.replace(prefixTest, '');
      return Object.assign({}, pre, { [key]: _config })
    }, { default: defautConfig })
    return (envKey) => (envConfigs[envKey] || envConfigs.default)
  })(defaultPrefix)(publishConfig)(env);
  console.log(chalk.green("🐶  Use config → " + JSON.stringify(currentConfig)));
  let resources;
  try {
    resources = require(path.resolve(paths.appDirectory, currentConfig.resourceFile));
  } catch (e) {
    console.log("↖(▔^▔)↗" + chalk.red(`  Resource file at ${path.resolve(paths.appDirectory, currentConfig.resourceFile)} is not exist`));
    console.log('↖(▔^▔)↗  Exit!!')
  }
  if (!resources) return;
  const { javascripts = [], styles = [], hash = "", type = 1 } = resources;
  const { htmlPath } = currentConfig;
  var html;
  try {
    html = fs.readFileSync(path.resolve(paths.appDirectory, htmlPath), "utf-8")
  } catch (e) {
    console.log(e)
  }
  const params = {
    javascripts: javascripts.join(','), styles: styles.join(','), version: hash, type, html, comment
  }
  axios.post(`${currentConfig.server}/${currentConfig.appId}/resources`, params).then(response => {
    if (response.status == 200) {
      const { data } = response;
      if (data.id) {
        console.log(chalk.green('Success: → ') + JSON.stringify(data))
      } else {
        console.log(chalk.red('Error: → ') + data);
      }
    } else {
      console.log(chalk.red(`Error: → status ${response.status}  `) + error.response.data);
    }
  }).catch(error => {
    if (error.response) {
      console.log(chalk.red('Error: →') + error.response.data);
    } else {
      console.log(error.message);
    }
  })
}
