const { execSync } = require('child_process');

console.log('building');
let output = execSync('npm run build');
console.log(output.toString());

console.log('deploying');
output = execSync('firebase deploy');
console.log(output.toString());