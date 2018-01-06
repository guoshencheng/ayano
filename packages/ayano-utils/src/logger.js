function log(...argument) {
  console.log(`ayano log → `, ...argument);
}

function warn(...argument) {
  console.warn(`ayano warn → `, ...argument);
}

function error(...argument) {
  console.warn(`ayano warn → `, ...argument);
}

export default {
  log, warn, error
}
