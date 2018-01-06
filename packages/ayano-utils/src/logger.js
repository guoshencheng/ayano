function log(...arguments) {
  console.log(`ayano log → `, ...arguments);
}

function warn(...arguments) {
  console.warn(`ayano warn → `, ...arguments);
}

function error(...arguments) {
  console.warn(`ayano warn → `, ...arguments);
}

export default {
  log, warn, error
}
