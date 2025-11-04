const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, '..', 'public', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Product images mapping - each product gets its own unique image
const productImages = [
  // Original 6 products (keep existing images, but ensure they're correct)
  { filename: 'product-1.jpg', search: 'chocolate+chip+cookies', w: 800, h: 800, product: 'Chocolate Chip Cookies' },
  { filename: 'product-2.jpg', search: 'french+croissant+pastry', w: 800, h: 800, product: 'Classic Croissant' },
  { filename: 'product-3.jpg', search: 'red+velvet+cupcake', w: 800, h: 800, product: 'Red Velvet Cupcake' },
  { filename: 'product-4.jpg', search: 'sourdough+bread+loaf', w: 800, h: 800, product: 'Sourdough Bread' },
  { filename: 'product-5.jpg', search: 'cinnamon+roll+bun', w: 800, h: 800, product: 'Cinnamon Roll' },
  { filename: 'product-6.jpg', search: 'lemon+tart+pie', w: 800, h: 800, product: 'Lemon Tart' },
  
  // Additional 6 products (new images)
  { filename: 'product-7.jpg', search: 'sesame+bagel+bread', w: 800, h: 800, product: 'Bagel with Sesame' },
  { filename: 'product-8.jpg', search: 'chocolate+eclair+pastry', w: 800, h: 800, product: 'Chocolate Eclair' },
  { filename: 'product-9.jpg', search: 'whole+wheat+bread+loaf', w: 800, h: 800, product: 'Whole Wheat Bread' },
  { filename: 'product-10.jpg', search: 'apple+pie+dessert', w: 800, h: 800, product: 'Apple Pie' },
  { filename: 'product-11.jpg', search: 'danish+pastry+fruit', w: 800, h: 800, product: 'Danish Pastry' },
  { filename: 'product-12.jpg', search: 'brioche+bread+loaf', w: 800, h: 800, product: 'Brioche' },
];

// Use Unsplash Source API with specific photo IDs for better matching
const unsplashPhotoIds = {
  'product-1.jpg': 'photo-1499636136210-6f4ee915583e', // Chocolate chip cookies
  'product-2.jpg': 'photo-1509440159596-0249088772ff', // Croissant
  'product-3.jpg': 'photo-1614707267537-f85d9f84e7a2', // Red velvet cupcake
  'product-4.jpg': 'photo-1542838132-92c53300491e', // Sourdough bread
  'product-5.jpg': 'photo-1626082927389-6cd887cddb72', // Cinnamon roll
  'product-6.jpg': 'photo-1558961363-fa8fdf82db35', // Lemon tart
  'product-7.jpg': 'photo-1586444248902-2f64eddc142f', // Bagel
  'product-8.jpg': 'photo-1555507036-ab1f4038808a', // Eclair
  'product-9.jpg': 'photo-1607472586893-edb57bdc0e39', // Whole wheat bread
  'product-10.jpg': 'photo-1578985545062-69928b1d9587', // Apple pie
  'product-11.jpg': 'photo-1519869325932-a348e36a9d83', // Danish pastry
  'product-12.jpg': 'photo-1606313564200-e75d5e30476c', // Brioche
};

function downloadImage(url, filepath, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        if (response.headers.location) {
          downloadImage(response.headers.location, filepath, filename).then(resolve).catch(reject);
        } else {
          reject(new Error(`Redirect without location: ${response.statusCode}`));
        }
      } else {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        reject(new Error(`Status: ${response.statusCode}`));
      }
    });
    
    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      reject(err);
    });
    
    request.setTimeout(30000, () => {
      request.destroy();
      file.close();
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      reject(new Error('Timeout'));
    });
  });
}

function createPlaceholder(filepath, filename, w, h, productName) {
  const name = productName || filename.replace('.jpg', '').replace(/-/g, ' ');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#F5E6D3"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(w, h) / 12}" fill="#8B4513" text-anchor="middle" dominant-baseline="middle">${name}</text>
</svg>`;
  
  const svgBuffer = Buffer.from(svg);
  
  return sharp(svgBuffer)
    .resize(w, h, { fit: 'fill' })
    .jpeg({ quality: 90 })
    .toFile(filepath)
    .then(() => {
      console.log(`✓ Created placeholder: ${filename}`);
    })
    .catch(err => {
      console.error(`✗ Error creating placeholder ${filename}:`, err.message);
    });
}

function createWebpVersion(jpgPath, webpPath) {
  if (!fs.existsSync(jpgPath)) return Promise.resolve();
  
  return sharp(jpgPath)
    .webp({ quality: 85 })
    .toFile(webpPath)
    .then(() => {
      console.log(`  ✓ WebP version: ${path.basename(webpPath)}`);
    })
    .catch(err => {
      console.error(`  ✗ Error creating WebP:`, err.message);
    });
}

async function downloadProductImages() {
  console.log('📥 Downloading product images...\n');
  
  for (const img of productImages) {
    const filepath = path.join(assetsDir, img.filename);
    const webpPath = path.join(assetsDir, img.filename.replace('.jpg', '.webp'));
    
    // Use specific Unsplash photo ID if available, otherwise use search
    let unsplashUrl;
    if (unsplashPhotoIds[img.filename]) {
      unsplashUrl = `https://images.unsplash.com/photo-${unsplashPhotoIds[img.filename]}?w=${img.w}&h=${img.h}&fit=crop&q=80`;
    } else {
      unsplashUrl = `https://source.unsplash.com/${img.w}x${img.h}/?${img.search}`;
    }
    
    try {
      console.log(`Downloading ${img.filename} (${img.product})...`);
      
      // Download the image
      await downloadImage(unsplashUrl, filepath, img.filename);
      
      // Optimize the image
      const image = sharp(filepath);
      const metadata = await image.metadata();
      
      // Resize if too large
      if (metadata.width > 1200 || metadata.height > 1200) {
        await image
          .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 90, mozjpeg: true })
          .toFile(filepath);
      } else {
        // Just optimize without resizing
        await image
          .jpeg({ quality: 90, mozjpeg: true })
          .toFile(filepath);
      }
      
      console.log(`✓ Downloaded and optimized ${img.filename}`);
      
      // Create webp version
      await createWebpVersion(filepath, webpPath);
    } catch (error) {
      console.log(`⚠️  Failed to download ${img.filename}, creating placeholder...`);
      await createPlaceholder(filepath, img.filename, img.w, img.h, img.product);
      await createWebpVersion(filepath, webpPath);
    }
  }
  
  console.log('\n✅ Product images download complete!');
}

downloadProductImages().catch(console.error);

