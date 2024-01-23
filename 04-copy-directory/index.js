const fs = require('fs');
const path = require('path');

const pathToDir = path.join(__dirname, 'files');
const pathToCopyDir = path.join(__dirname, 'files-copy');

function copyDir(from, to) {
  fs.mkdir(to, { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.readdir(from, { withFileTypes: true }, (err, files) => {
    files.forEach((item) => {
      const pathToFile = path.join(item.path, item.name);
      const pathToCopyFile = path.join(to, item.name);

      if (item.isFile()) {
        fs.copyFile(pathToFile, pathToCopyFile, (err) => {
          if (err) throw err;
        });
      } else {
        copyDir(pathToFile, pathToCopyFile);
      }
    });
  });
}

copyDir(pathToDir, pathToCopyDir);
