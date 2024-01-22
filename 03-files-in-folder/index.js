const fs = require('fs');
const path = require('path');

const pathToDir = path.join(__dirname, 'secret-folder');

fs.readdir(pathToDir, { withFileTypes: true }, (err, files) => {
  files.forEach((item) => {
    if (item.isFile()) {
      const pathToFile = path.join(item.path, item.name);
      console.log(
        path.parse(pathToFile).name,
        ' - ',
        path.parse(pathToFile).ext.slice(1),
        ' - ',
        fs.statSync(pathToFile).size,
        'B',
      );
    }
  });
});
