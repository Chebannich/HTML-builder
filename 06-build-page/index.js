const fs = require('fs');
const path = require('path');

async function createProjectDist() {
  const projectDistPath = path.join(__dirname, 'projectDist');
  await fs.promises.mkdir(projectDistPath, { recursive: true });
  return projectDistPath;
}

async function processTemplate(projectDistPath) {
  const templatePath = path.join(__dirname, 'template.html');
  const componentsPath = path.join(__dirname, 'components');
  const outputPath = path.join(projectDistPath, 'index.html');

  let template = await fs.promises.readFile(templatePath, 'utf-8');
  const matches = template.match(/{{\s*\w+\s*}}/g) || [];

  for (const match of matches) {
    const componentName = match.replace(/[{}]/g, '').trim();
    const componentPath = path.join(componentsPath, `${componentName}.html`);

    if (fs.existsSync(componentPath)) {
      const componentContent = await fs.promises.readFile(
        componentPath,
        'utf-8',
      );
      template = template.replace(new RegExp(match, 'g'), componentContent);
    } else {
      console.error(`Component ${componentName} not found`);
    }
  }

  await fs.promises.writeFile(outputPath, template, 'utf-8');
}

async function bundleStyles(projectDistPath) {
  const stylesPath = path.join(__dirname, 'styles');
  const outputPath = path.join(projectDistPath, 'style.css');
  const files = await fs.promises.readdir(stylesPath, { withFileTypes: true });

  const cssFiles = files.filter(
    (file) => file.isFile() && path.extname(file.name) === '.css',
  );
  const styles = await Promise.all(
    cssFiles.map((file) =>
      fs.promises.readFile(path.join(stylesPath, file.name), 'utf-8'),
    ),
  );

  await fs.promises.writeFile(outputPath, styles.join('\n'), 'utf-8');
}

async function copyAssets(projectDistPath) {
  const assetsPath = path.join(__dirname, 'assets');
  const targetPath = path.join(projectDistPath, 'assets');

  async function copyDir(src, dest) {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }
  }

  await copyDir(assetsPath, targetPath);
}

async function buildPage() {
  try {
    const projectDistPath = await createProjectDist();
    await processTemplate(projectDistPath);
    await bundleStyles(projectDistPath);
    await copyAssets(projectDistPath);
    console.log('Project built successfully!');
  } catch (err) {
    console.error('Error building project:', err);
  }
}

buildPage();
