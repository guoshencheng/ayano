import { execSync } from 'child_process';

export const npmInstallTag = pacakageJson => packageName => tag => {
  if (tag) {
    return `${packageName}@${tag}`
  } else {
    if (pacakageJson.related && pacakageJson.related[packageName]) {
      return `${packageName}@${pacakageJson.related[pacakageName]}`
    } else {
      return packageName;
    }
  }
}


export const shouldUseCNPM = () => {
  try {
    execSync('cnpm --version', { stdio: 'ignore' });;
    return true;
  } catch (error) {
    return false;
  }
}

export const shouldUseYarn = () => {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}
