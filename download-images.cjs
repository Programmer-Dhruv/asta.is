const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');

// Ensure directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const images = [
  { url: 'https://picsum.photos/seed/astahero/800/600', name: 'hero.jpg' },
  { url: 'https://picsum.photos/seed/demonslayer1/400/600', name: 'card1.webp' },
  { url: 'https://picsum.photos/seed/attackontitan1/400/600', name: 'card2.webp' },
  { url: 'https://picsum.photos/seed/blackclover1/400/600', name: 'grid1.webp' },
  { url: 'https://picsum.photos/seed/demonslayer2/400/600', name: 'grid2.webp' },
  { url: 'https://picsum.photos/seed/jujutsu1/400/600', name: 'grid3.webp' },
  { url: 'https://picsum.photos/seed/onepiece1/400/600', name: 'grid4.webp' },
  { url: 'https://picsum.photos/seed/sololeveling1/400/600', name: 'trend1.webp' },
  { url: 'https://picsum.photos/seed/jujutsukaisen1/400/600', name: 'trend2.webp' },
  { url: 'https://picsum.photos/seed/frieren1/400/600', name: 'trend3.webp' },
  { url: 'https://picsum.photos/seed/chainsawman1/400/600', name: 'trend4.webp' },
  { url: 'https://picsum.photos/seed/spyfamily1/400/600', name: 'spyfamily.webp' },
];

function downloadImage(image) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, image.name);
    const file = fs.createWriteStream(filePath);
    
    https.get(image.url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(filePath);
        console.log(`✓ Downloaded ${image.name} (${stats.size} bytes)`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      console.error(`✗ Error downloading ${image.name}:`, err.message);
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('Downloading images to:', imagesDir);
  console.log('---');
  
  for (const image of images) {
    try {
      await downloadImage(image);
    } catch (err) {
      console.error(`Failed to download ${image.name}`);
    }
  }
  
  console.log('---');
  console.log('All downloads complete!');
  
  // List files
  const files = fs.readdirSync(imagesDir);
  console.log('\nFiles in images directory:');
  files.forEach(f => {
    const stats = fs.statSync(path.join(imagesDir, f));
    console.log(`  ${f} - ${stats.size} bytes`);
  });
}

downloadAll();
