const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  'Hello, please enter some text into the console. If you want to exit please enter `exit` or press ctrl+c',
);

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    exitProgram();
  } else {
    writeStream.write(input + '\n', (err) => {
      if (err) {
        console.error('Error when writing to a file', err.message);
      }
    });
  }
});

process.on('SIGINT', exitProgram);

function exitProgram() {
  console.log('Goodbye');
  rl.close();
  writeStream.end();
  process.exit();
}
