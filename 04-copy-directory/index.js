const fs = require('fs/promises');
const path = require('path');

async function copyDir(srcDir, destDir) {
  try {
    await fs.rm(destDir, { recursive: true, force: true });
    await fs.mkdir(destDir, { recursive: true });

    const dirContents = await fs.readdir(srcDir, { withFileTypes: true });
    for (const item of dirContents) {
      const srcPath = path.join(srcDir, item.name);
      const destPath = path.join(destDir, item.name);

      if (item.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else if (item.isFile()) {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'copy'));
