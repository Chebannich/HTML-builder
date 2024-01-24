const fs = require('fs');
const path = require('path');

const pathToDir = path.join(__dirname, 'styles');
const pathToDistDir = path.join(__dirname, 'project-dist', 'bundle.css');

const writeStream = fs.createWriteStream(pathToDistDir);
fs.readdir(pathToDir, { withFileTypes: true }, (err, items) => {
  if (err) throw err;

  items.forEach((item) => {
    const itemPath = path.join(item.path, item.name);
    const itemExt = path.parse(itemPath).ext.slice(1);

    if (item.isFile() && itemExt === 'css') {
      fs.createReadStream(itemPath, 'utf8').pipe(writeStream);
    }
  });
});
