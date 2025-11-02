const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, '..', 'public', 'assets');

async function createJpgs() {
  const webpFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.webp'));
  
  for (const webp of webpFiles) {
    const webpPath = path.join(assetsDir, webp);
    const jpgPath = path.join(assetsDir, webp.replace('.webp', '.jpg'));
    
    if (!fs.existsSync(jpgPath)) {
      try {
        await sharp(webpPath)
          .jpeg({ quality: 90 })
          .toFile(jpgPath);
        console.log(`✓ Created ${webp.replace('.webp', '.jpg')}`);
      } catch (err) {
        console.error(`✗ Error creating JPG for ${webp}:`, err.message);
      }
    }
  }
}

createJpgs().catch(console.error);

