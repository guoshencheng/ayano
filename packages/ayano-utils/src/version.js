export const npmInstallTag = pacakageJson => packageName => tag => {
  if (tag) {
    return `${packageName}@${tag}`
  } else {
    if (pacakageJson.related && pacakageJson.related[packageName]) {
      return `${packageName}@${pacakageJson.related[packageName]}`
    } else {
      return packageName;
    }
  }
}


export const shouldUseCNPM = () => {
  var { execSync } = require('child_process');
  try {
    execSync('cnpm --version', { stdio: 'ignore' });;
    return true;
  } catch (error) {
    return false;
  }
}

export const shouldUseYarn = () => {
  var { execSync } = require('child_process');
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}
