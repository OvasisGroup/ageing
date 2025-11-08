#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceImage = path.join(__dirname, '../public/images/mynestshield-icon.png');
const outputDir = path.join(__dirname, '../public/icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log('Generating PWA icons...');
  
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated ${size}x${size} icon`);
    } catch (error) {
      console.error(`✗ Error generating ${size}x${size} icon:`, error.message);
    }
  }
  
  // Generate apple-touch-icon
  const appleTouchIcon = path.join(__dirname, '../public/apple-touch-icon.png');
  try {
    await sharp(sourceImage)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(appleTouchIcon);
    console.log('✓ Generated apple-touch-icon.png');
  } catch (error) {
    console.error('✗ Error generating apple-touch-icon:', error.message);
  }
  
  // Generate favicon
  try {
    await sharp(sourceImage)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(__dirname, '../public/favicon.png'));
    console.log('✓ Generated favicon.png');
  } catch (error) {
    console.error('✗ Error generating favicon:', error.message);
  }
  
  console.log('\nIcon generation complete!');
}

generateIcons().catch(console.error);
