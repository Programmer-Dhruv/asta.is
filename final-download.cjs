const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const posterDir = 'C:/Users/devel/Desktop/asta.is/public/assets/images/poster';
const coverDir = 'C:/Users/devel/Desktop/asta.is/public/assets/images/cover';

const images = {
  1: 'https://picsum.photos/seed/anime1/225/320',
  2: 'https://picsum.photos/seed/anime2/225/320',
  3: 'https://picsum.photos/seed/anime3/225/320',
  4: 'https://picsum.photos/seed/anime4/225/320',
  5: 'https://picsum.photos/seed/anime5/225/320',
  6: 'https://picsum.photos/seed/anime6/225/320',
  7: 'https://picsum.photos/seed/anime7/225/320',
  8: 'https://picsum.photos/seed/anime8/225/320',
  9: 'https://picsum.photos/seed/anime9/225/320',
  10: 'https://picsum.photos/seed/anime10/225/320',
  11: 'https://picsum.photos/seed/anime11/225/320',
  12: 'https://picsum.photos/seed/anime12/225/320',
};

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      followAllRedirects: true
    }, (response) => {
      // Handle redirects manually
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlinkSync(filepath);
        download(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filepath);
        });
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', reject);
    file.on('error', reject);
  });
}

async function main() {
  console.log('📥 Downloading images...\n');
  
  let success = 0;
  for (const [id, url] of Object.entries(images)) {
    const posterPath = path.join(posterDir, `${id}.jpg`);
    const coverPath = path.join(coverDir, `${id}.jpg`);
    
    try {
      await download(url, posterPath);
      await download(url, coverPath);
      console.log(`✅ ID ${id}`);
      success++;
    } catch (err) {
      console.log(`❌ ID ${id}: ${err.message}`);
    }
  }
  
  console.log(`\n✨ Done! ${success}/12`);
}

main().catch(console.error);
