import { execSync } from 'child_process'

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
