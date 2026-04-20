const fs = require('fs');
const https = require('https');
const path = require('path');

const posterDir = 'C:/Users/devel/Desktop/asta.is/public/assets/images/poster';
const coverDir = 'C:/Users/devel/Desktop/asta.is/public/assets/images/cover';

// Using verified working URLs from different anime
const verifiedUrls = {
  3: 'https://cdn.myanimelist.net/images/anime/1795/127008.jpg',  // JJK Season 2
  4: 'https://cdn.myanimelist.net/images/anime/1019/134436.jpg',  // Vinland Saga
  6: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',     // AOT
  8: 'https://cdn.myanimelist.net/images/anime/1089/135655.jpg',  // Solo Leveling
  9: 'https://cdn.myanimelist.net/images/anime/1251/143625.jpg',  // Frieren
  10: 'https://cdn.myanimelist.net/images/anime/6/75617.jpg',    // DBS
  11: 'https://cdn.myanimelist.net/images/anime/1231/131693.jpg', // Blue Lock
  12: 'https://cdn.myanimelist.net/images/anime/1/22227.jpg',    // Death Note
};

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
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
  console.log('🔄 Downloading with verified URLs...\n');
  
  for (const [id, url] of Object.entries(verifiedUrls)) {
    const posterPath = path.join(posterDir, `${id}.jpg`);
    const coverPath = path.join(coverDir, `${id}.jpg`);
    
    try {
      await download(url, posterPath);
      console.log(`✅ Poster ${id} downloaded`);
      
      await download(url, coverPath);
      console.log(`✅ Cover ${id} downloaded`);
    } catch (err) {
      console.log(`❌ ID ${id} failed: ${err.message}`);
    }
  }
  
  console.log('\n✨ Done!');
}

main().catch(console.error);
