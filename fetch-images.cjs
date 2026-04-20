const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public/images');

// Ensure directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const images = [
  { url: 'https://picsum.photos/400/600', name: 'card1.webp' },
  { url: 'https://picsum.photos/400/600', name: 'card2.webp' },
  { url: 'https://picsum.photos/400/600', name: 'grid1.webp' },
  { url: 'https://picsum.photos/400/600', name: 'grid2.webp' },
  { url: 'https://picsum.photos/400/600', name: 'grid3.webp' },
  { url: 'https://picsum.photos/400/600', name: 'grid4.webp' },
  { url: 'https://picsum.photos/400/600', name: 'trend1.webp' },
  { url: 'https://picsum.photos/400/600', name: 'trend2.webp' },
  { url: 'https://picsum.photos/400/600', name: 'trend3.webp' },
  { url: 'https://picsum.photos/400/600', name: 'trend4.webp' },
  { url: 'https://picsum.photos/800/600', name: 'hero.jpg' },
  { url: 'https://picsum.photos/400/600', name: 'spyfamily.webp' },
];

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename);
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        console.log(`  Redirecting to: ${response.headers.location.substring(0, 50)}...`);
        downloadImage(response.headers.location, filename).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      const file = fs.createWriteStream(filePath);
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(filePath);
        console.log(`✓ ${filename}: ${stats.size} bytes`);
        resolve();
      });
    });
    
    request.on('error', (err) => {
      console.error(`✗ Error: ${err.message}`);
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading images...\n');
  
  for (const img of images) {
    try {
      await downloadImage(img.url, img.name);
    } catch (err) {
      console.error(`Failed: ${img.name}`);
    }
  }
  
  console.log('\nDone!');
  
  // Verify files
  const files = fs.readdirSync(imagesDir);
  let totalSize = 0;
  files.forEach(f => {
    const s = fs.statSync(path.join(imagesDir, f)).size;
    totalSize += s;
    console.log(`  ${f}: ${s} bytes`);
  });
  console.log(`\nTotal: ${files.length} files, ${totalSize} bytes`);
}

main();
