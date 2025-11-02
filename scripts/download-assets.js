const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, '..', 'public', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const images = [
  { filename: 'hero-1.jpg', search: 'bakery+storefront+warm+interior', w: 1920, h: 1080 },
  { filename: 'product-1.jpg', search: 'fresh+bread+loaf', w: 800, h: 800 },
  { filename: 'product-2.jpg', search: 'butter+croissant', w: 800, h: 800 },
  { filename: 'product-3.jpg', search: 'chocolate+cake', w: 800, h: 800 },
  { filename: 'product-4.jpg', search: 'pancakes+honey', w: 800, h: 800 },
  { filename: 'product-5.jpg', search: 'falafel+sandwich', w: 800, h: 800 },
  { filename: 'product-6.jpg', search: 'date+cookies', w: 800, h: 800 },
  { filename: 'chef.jpg', search: 'baker+portrait', w: 800, h: 800 },
];

function createPlaceholder(filepath, filename, w, h) {
  const name = filename.replace('.jpg', '').replace(/-/g, ' ');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#F5E6D3"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(w, h) / 10}" fill="#8B4513" text-anchor="middle" dominant-baseline="middle">${name}</text>
</svg>`;
  
  const svgBuffer = Buffer.from(svg);
  
  return sharp(svgBuffer)
    .resize(w, h, { fit: 'fill' })
    .jpeg({ quality: 90 })
    .toFile(filepath)
    .then(() => {
      console.log(`✓ تم إنشاء placeholder: ${filename}`);
    })
    .catch(err => {
      console.error(`✗ خطأ في إنشاء placeholder ${filename}:`, err.message);
    });
}

function createWebpVersion(jpgPath, webpPath) {
  if (!fs.existsSync(jpgPath)) return Promise.resolve();
  
  return sharp(jpgPath)
    .webp({ quality: 85 })
    .toFile(webpPath)
    .then(() => {
      console.log(`  ✓ نسخة WebP: ${path.basename(webpPath)}`);
    })
    .catch(err => {
      console.error(`  ✗ خطأ في إنشاء WebP:`, err.message);
    });
}

function createLogoPlaceholder() {
  const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <circle cx="200" cy="200" r="180" fill="#C48A47"/>
  <text x="200" y="220" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#FFF8E7" text-anchor="middle" dominant-baseline="middle">Town</text>
  <text x="200" y="270" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#FFF8E7" text-anchor="middle" dominant-baseline="middle">Bakery</text>
</svg>`;
  
  const svgBuffer = Buffer.from(logoSvg);
  const logoPath = path.join(assetsDir, 'logo.png');
  
  if (fs.existsSync(logoPath)) {
    console.log('✓ logo.png موجود بالفعل');
    return Promise.resolve();
  }
  
  return sharp(svgBuffer)
    .resize(400, 400, { fit: 'fill' })
    .png()
    .toFile(logoPath)
    .then(() => {
      console.log('✓ تم إنشاء logo.png placeholder');
    })
    .catch(err => {
      console.error('✗ خطأ في إنشاء logo.png:', err.message);
    });
}

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

async function downloadAll() {
  console.log('📥 جاري تحميل الصور...\n');
  
  // Create logo first
  await createLogoPlaceholder();
  
  for (const img of images) {
    const filepath = path.join(assetsDir, img.filename);
    const webpPath = path.join(assetsDir, img.filename.replace('.jpg', '.webp'));
    
    if (fs.existsSync(filepath)) {
      console.log(`✓ ${img.filename} موجود بالفعل`);
      if (!fs.existsSync(webpPath)) {
        await createWebpVersion(filepath, webpPath);
      }
      continue;
    }

    const unsplashUrl = `https://source.unsplash.com/${img.w}x${img.h}/?${img.search}`;
    
    try {
      console.log(`تحميل ${img.filename}...`);
      await downloadImage(unsplashUrl, filepath, img.filename);
      
      // Limit to max 2000px
      const image = sharp(filepath);
      const metadata = await image.metadata();
      if (metadata.width > 2000 || metadata.height > 2000) {
        const ratio = Math.min(2000 / metadata.width, 2000 / metadata.height);
        await image
          .resize(Math.round(metadata.width * ratio), Math.round(metadata.height * ratio))
          .jpeg({ quality: 90 })
          .toFile(filepath);
      }
      
      console.log(`✓ تم تحميل ${img.filename}`);
      
      // Create webp version
      await createWebpVersion(filepath, webpPath);
    } catch (error) {
      console.log(`⚠️  فشل تحميل ${img.filename}، إنشاء placeholder...`);
      await createPlaceholder(filepath, img.filename, img.w, img.h);
      await createWebpVersion(filepath, webpPath);
    }
  }
  
  console.log('\n✅ اكتمل تحميل الصور!');
}

downloadAll().catch(console.error);
