import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = path.join(root, 'logo', 'logo1.png');
const logoDir = path.join(root, 'client', 'public', 'logo');
const logoOut = path.join(logoDir, 'logo1.png');
const logoAlias = path.join(root, 'client', 'public', 'logo.png');
const faviconOut = path.join(root, 'client', 'public', 'favicon.png');
const logoSourceOut = path.join(root, 'logo', 'logo1.png');

const removeBlackBackground = async (inputPath, size) => {
  const { data, info } = await sharp(inputPath)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r < 40 && g < 40 && b < 40) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toBuffer();
};

await fs.promises.mkdir(logoDir, { recursive: true });

const logoBuffer = await removeBlackBackground(src, 512);
const faviconBuffer = await removeBlackBackground(src, 64);

await fs.promises.writeFile(logoOut, logoBuffer);
await fs.promises.writeFile(logoAlias, logoBuffer);
await fs.promises.writeFile(faviconOut, faviconBuffer);
await fs.promises.writeFile(logoSourceOut, logoBuffer);

const logoKb = (logoBuffer.length / 1024).toFixed(1);
const faviconKb = (faviconBuffer.length / 1024).toFixed(1);
console.log(`logo/logo1.png: ${logoKb} KB`);
console.log(`favicon.png: ${faviconKb} KB`);
