const fs = require('fs').promises;
const path = require('path');

const pathToDir = path.join(__dirname, 'files');
const pathToCopyDir = path.join(__dirname, 'files-copy');

async function copyDir(from, to) {
  try {
    await await fs.rm(to, { force: true, recursive: true });
  } catch (err) {}

  await fs.mkdir(to, { recursive: true }, (err) => {
    if (err) throw err;
  });
  const files = await fs.readdir(from, { withFileTypes: true });
  await Promise.all(
    files.map(async (item) => {
      const pathToFile = path.join(item.path, item.name);
      const pathToCopyFile = path.join(to, item.name);

      if (item.isFile()) {
        await fs.copyFile(pathToFile, pathToCopyFile);
      } else {
        await copyDir(pathToFile, pathToCopyFile);
      }
    }),
  );
}

copyDir(pathToDir, pathToCopyDir);
