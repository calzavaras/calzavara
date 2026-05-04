const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImagePath = '/Users/calza/.gemini/antigravity/brain/7ec2ad06-cf46-4645-a510-f765a87000b3/media__1777825655567.jpg';
const outputDir = './static/assets/';
const baseName = 'marco-calzavara-nigredo-st-gallen';
const sizes = [500, 750, 1000];

async function processImage() {
  const image = sharp(inputImagePath);
  const metadata = await image.metadata();
  
  // Crop to square if it's not square
  const size = Math.min(metadata.width, metadata.height);
  const squareImage = image.extract({
    left: Math.floor((metadata.width - size) / 2),
    top: Math.floor((metadata.height - size) / 2),
    width: size,
    height: size
  });

  // Save base jpg (size: 1086 for original if it's large enough, otherwise max size)
  const baseSize = Math.min(size, 1086);
  await squareImage.clone().resize(baseSize, baseSize).jpeg({ quality: 80 }).toFile(path.join(outputDir, `${baseName}.jpg`));

  for (const width of sizes) {
    await squareImage.clone().resize(width, width).webp({ quality: 80 }).toFile(path.join(outputDir, `${baseName}-${width}.webp`));
    await squareImage.clone().resize(width, width).avif({ quality: 80 }).toFile(path.join(outputDir, `${baseName}-${width}.avif`));
  }
  
  console.log("Images processed successfully.");
}

processImage().catch(err => {
  console.error("Error with sharp, trying to install it locally...", err);
  process.exit(1);
});
