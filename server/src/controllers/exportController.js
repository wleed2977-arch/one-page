import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const archiver = require('archiver');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportWebsite = async (req, res, next) => {
  try {
    const { html, theme = 'light' } = req.body;

    if (!html) {
      return res.status(400).json({ success: false, message: 'HTML content is required' });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=my-onepage-site.zip');

    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(res);

    // 1. Add CSS Files
    const stylesDir = path.join(__dirname, '../../../client/styles');
    archive.directory(stylesDir, 'styles');

    // 2. Generate index.html
    const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Personal Website</title>
    
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <link rel="stylesheet" href="./styles/base/variables.css" />
    <link rel="stylesheet" href="./styles/base/reset.css" />
    <link rel="stylesheet" href="./styles/base/typography.css" />
    <link rel="stylesheet" href="./styles/layout/grid.css" />
    <link rel="stylesheet" href="./styles/layout/container.css" />
    
    <link rel="stylesheet" href="./styles/components/button.css" />
    
    <link rel="stylesheet" href="./styles/themes/${theme}.css" />
  </head>
  <body data-theme="${theme}">
    <div id="app">
      ${html}
    </div>
    <script>
      lucide.createIcons();
    </script>
  </body>
</html>`;
    
    archive.append(indexHtml, { name: 'index.html' });

    await archive.finalize();
  } catch (error) {
    next(error);
  }
};
