const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

function getCssFiles(dir) {
  let cssFiles = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  items.forEach((item) => {
    const itemPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      cssFiles = cssFiles.concat(getCssFiles(itemPath));
    } else if (item.isFile() && path.extname(item.name) === '.css') {
      cssFiles.push(itemPath);
    }
  });

  return cssFiles;
}

function createBundle() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const cssFiles = getCssFiles(stylesDir);

  if (cssFiles.length === 0) {
    console.log('Нет CSS файлов для объединения.');
    return;
  }

  const writeStream = fs.createWriteStream(outputFile, 'utf-8');

  const fileReadPromises = cssFiles.map((filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          writeStream.write(data + '\n');
          resolve();
        }
      });
    });
  });

  Promise.all(fileReadPromises)
    .then(() => {
      writeStream.end(() => {
        console.log('Файл bundle.css успешно создан!');
      });
    })
    .catch((err) => {
      console.error('Ошибка при создании бандла:', err);
    });
}

createBundle();
