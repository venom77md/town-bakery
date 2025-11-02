const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, '..', 'public', 'assets', 'logo.png');
const tailwindConfigPath = path.join(__dirname, '..', 'tailwind.config.js');

let PRIMARY_HEX = '#C48A47'; // Fallback

if (fs.existsSync(logoPath)) {
  try {
    const sharp = require('sharp');
    
    sharp(logoPath)
      .resize(200, 200, { fit: 'inside' })
      .raw()
      .toBuffer({ resolveWithObject: true })
      .then(({ data, info }) => {
        const sampleSize = Math.min(1000, Math.floor(data.length / 3));
        const colorCounts = {};
        
        for (let i = 0; i < sampleSize; i++) {
          const idx = Math.floor(Math.random() * Math.floor(data.length / 3)) * 3;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          
          // Skip very light/dark colors and prioritize warm tones
          const brightness = (r + g + b) / 3;
          if (brightness < 50 || brightness > 200) continue;
          
          // Prefer warm colors (higher red component)
          if (r < g || r < b) continue;
          
          const qr = Math.floor(r / 16) * 16;
          const qg = Math.floor(g / 16) * 16;
          const qb = Math.floor(b / 16) * 16;
          
          const key = `${qr},${qg},${qb}`;
          colorCounts[key] = (colorCounts[key] || 0) + 1;
        }
        
        if (Object.keys(colorCounts).length > 0) {
          const dominantKey = Object.keys(colorCounts).reduce((a, b) =>
            colorCounts[a] > colorCounts[b] ? a : b
          );
          
          const [r, g, b] = dominantKey.split(',').map(Number);
          PRIMARY_HEX = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
        }
        
        updateTailwindConfig(PRIMARY_HEX);
      })
      .catch(err => {
        console.log('⚠️  خطأ في استخراج اللون:', err.message);
        updateTailwindConfig(PRIMARY_HEX);
      });
  } catch (err) {
    console.log('⚠️  Sharp غير مثبت. استخدام اللون الافتراضي');
    updateTailwindConfig(PRIMARY_HEX);
  }
} else {
  console.log('⚠️  لم يتم العثور على logo.png');
  updateTailwindConfig(PRIMARY_HEX);
}

function updateTailwindConfig(hex) {
  console.log(`\n🎨 اللون الأساسي المستخدم: ${hex}\n`);
  
  let configContent = fs.readFileSync(tailwindConfigPath, 'utf8');
  
  // Update primary color
  configContent = configContent.replace(
    /primary:\s*['"]#[A-Fa-f0-9]+['"]/,
    `primary: '${hex}'`
  );
  
  if (!configContent.includes(`primary: '${hex}'`)) {
    configContent = configContent.replace(
      /colors:\s*{/,
      `colors: {\n        primary: '${hex}',`
    );
  }
  
  fs.writeFileSync(tailwindConfigPath, configContent);
  console.log('✅ تم تحديث tailwind.config.js');
  console.log(`\n📍 PRIMARY_HEX: ${hex}`);
}
