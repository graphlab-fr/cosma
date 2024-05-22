const path = require('path');
const { exec } = require('child_process');

exec('cosma m', { cwd: path.join(__dirname, './citeproc') }, (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
