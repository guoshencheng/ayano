function runCmd(cmd, _args, cb) {
  const args = _args || [];
  const runner = require('child_process').spawn(cmd, args, {
    stdio: 'inherit',
    env: process.env
  });

  runner.on('close', (code) => {
    cb && cb(code)
  });
}

export default runCmd;
