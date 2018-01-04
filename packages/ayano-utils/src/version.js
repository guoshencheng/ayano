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
