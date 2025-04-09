/* eslint-env node */
/* eslint-disable no-undef */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '../assets');

async function generateAssets() {
  // Generate app icon
  await sharp(path.join(assetsDir, 'icon.svg'))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, 'icon.png'));

  // Generate adaptive icon
  await sharp(path.join(assetsDir, 'icon.svg'))
    .resize(512, 512)
    .png()
    .toFile(path.join(assetsDir, 'adaptive-icon.png'));

  // Generate splash screen
  await sharp(path.join(assetsDir, 'splash.svg'))
    .resize(1242, 2436)
    .png()
    .toFile(path.join(assetsDir, 'splash.png'));

  // Generate favicon
  await sharp(path.join(assetsDir, 'icon.svg'))
    .resize(32, 32)
    .png()
    .toFile(path.join(assetsDir, 'favicon.png'));

  // Generate notification icon
  await sharp(path.join(assetsDir, 'icon.svg'))
    .resize(96, 96)
    .png()
    .toFile(path.join(assetsDir, 'notification-icon.png'));

  console.log('All assets generated successfully!');
}

generateAssets().catch(console.error); 