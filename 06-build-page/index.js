//подключаем встроенные модули
const fs = require('fs');
const path = require('path');

// прописываю пути к существующим папкам/файлам
const pathToAssets = path.join(__dirname, 'assets');
const pathToComponents = path.join(__dirname, 'components');
const pathToStyles = path.join(__dirname, 'styles');
const pathToTemplate = path.join(__dirname, 'template.html');
let templateHtml = '';

// прописываю пути к папкам/файлам которые будут созданы
const pathToDist = path.join(__dirname, 'project-dist');
const pathToDistAssets = path.join(pathToDist, 'assets');
const pathToDistHtml = path.join(pathToDist, 'index.html');
const pathToDistCss = path.join(pathToDist, 'style.css');

// создаем папку "project-dist"
fs.mkdir(pathToDist, { recursive: true }, (err) => {
  if (err) throw err.message;
});

// считываем и файл "template.html"
const readStream = fs.createReadStream(pathToTemplate);
readStream.on('data', (chunk) => {
  templateHtml += chunk;

  // считываем все с папки "components"
  fs.readdir(pathToComponents, { withFileTypes: true }, (err, items) => {
    if (err) throw err.message;

    // записываем инвормацию о всех файлах в массив
    let componentFiles = items.filter(
      (file) => file.isFile() && path.extname(file.name) === '.html',
    );

    if (componentFiles.length === 0) {
      // если .html файлом нету записываем шаблон внутрь dist
      fs.writeFile(pathToDistHtml, templateHtml, (err) => {
        if (err) throw err.message;
      });
    } else {
      // иначе считываем данные со всех файлов
      componentFiles.forEach((file) => {
        fs.readFile(path.join(pathToComponents, file.name), (err, data) => {
          if (err) throw err.message;

          // заменяем шаблон на данные из файла "components"
          let tmp = '{{' + path.parse(file.name).name + '}}';
          templateHtml = templateHtml.replaceAll(tmp, data);

          // записываем все данные внутрь dist
          fs.writeFile(pathToDistHtml, templateHtml, (err) => {
            if (err) throw err.message;
          });
        });
      });
    }
  });
});

// собираем файлы .css в один файл
const writeStream = fs.createWriteStream(pathToDistCss);
fs.readdir(pathToStyles, { withFileTypes: true }, (err, items) => {
  if (err) throw err.message;

  items.forEach((item) => {
    const itemPath = path.join(item.path, item.name);
    const itemExt = path.parse(itemPath).ext.slice(1);

    if (item.isFile() && itemExt === 'css') {
      fs.createReadStream(itemPath, 'utf8').pipe(writeStream);
    }
  });
});

async function copyFiles(from, to) {
  await fs.promises.rm(to, { recursive: true, force: true });

  fs.mkdir(to, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.readdir(from, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const sourceFilePath = path.join(from, file.name);
      const targetFilePath = path.join(to, file.name);

      if (file.isFile()) {
        fs.copyFile(sourceFilePath, targetFilePath, (err) => {
          if (err) throw err;
        });
      } else if (file.isDirectory()) {
        fs.mkdir(targetFilePath, { recursive: true }, (err) => {
          if (err) throw err;
        });
        copyFiles(sourceFilePath, targetFilePath);
      }
    });
  });
}
copyFiles(pathToAssets, pathToDistAssets);
