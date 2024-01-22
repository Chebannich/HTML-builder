const fs = require('fs');
const readline = require('readline');
const path = require('path');

const pathToFile = path.join(__dirname, '/text.txt');
const writeStream = fs.createWriteStream(pathToFile);
console.log('***  Hello reviewer  ***');
console.log('\nCan You shot me some text\n\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (input) => {
  if (input === 'exit') {
    rl.close();
  } else {
    writeStream.write(input);
    writeStream.write('\n');
  }
});

rl.on('close', () => {
  console.log('\n\n***  Goodbye  ***');
});
